"use client";

import { useState, useEffect } from "react";
import { Upload, Send, AlertCircle, Loader2, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { useCurrentAccount, useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";
import { sendSuiBatch, sendTokenBatch, estimateGasCost, checkSufficientBalance } from "@/lib/transactions";

interface RecipientRow {
  address: string;
  amount: string;
}

interface TokenBalance {
  coinType: string;
  balance: string;
  symbol: string;
  decimals?: number;
}

export default function MultisendForm() {
  const currentAccount = useCurrentAccount();
  const { mutateAsync: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const client = useSuiClient();
  
  const [recipients, setRecipients] = useState("");
  const [tokenType, setTokenType] = useState<"SUI" | "TOKEN">("SUI");
  const [tokenAddress, setTokenAddress] = useState("");
  const [parsedRecipients, setParsedRecipients] = useState<RecipientRow[]>([]);
  const [totalAmount, setTotalAmount] = useState("0");
  const [isSending, setIsSending] = useState(false);
  const [txDigest, setTxDigest] = useState<string | null>(null);
  const [currentBalance, setCurrentBalance] = useState<string>("");
  const [availableTokens, setAvailableTokens] = useState<TokenBalance[]>([]);
  const [loadingTokens, setLoadingTokens] = useState(false);
  const [showCustomToken, setShowCustomToken] = useState(false);
  const [tokenDecimals, setTokenDecimals] = useState<number>(9);

  // Fetch user's token balances when switching to TOKEN mode
  useEffect(() => {
    if (tokenType === "TOKEN" && currentAccount?.address) {
      fetchUserTokens();
    }
  }, [tokenType, currentAccount]);

  const getTokenDecimals = async (coinType: string): Promise<number> => {
    try {
      const metadata = await client.getCoinMetadata({ coinType });
      return metadata?.decimals ?? 9; // Default to 9 if not found
    } catch (error) {
      console.error("Failed to fetch token decimals:", error);
      return 9; // Default to 9
    }
  };

  const fetchUserTokens = async () => {
    if (!currentAccount?.address) return;
    
    setLoadingTokens(true);
    try {
      const allBalances = await client.getAllBalances({
        owner: currentAccount.address,
      });

      // Filter out SUI and map to our format
      const tokensWithDecimals = await Promise.all(
        allBalances
          .filter((b) => b.coinType !== "0x2::sui::SUI" && parseFloat(b.totalBalance) > 0)
          .map(async (b) => {
            const decimals = await getTokenDecimals(b.coinType);
            const balance = parseFloat(b.totalBalance) / Math.pow(10, decimals);
            return {
              coinType: b.coinType,
              balance: balance.toFixed(4),
              symbol: extractTokenSymbol(b.coinType),
              decimals,
            };
          })
      );

      setAvailableTokens(tokensWithDecimals);
    } catch (error) {
      console.error("Failed to fetch tokens:", error);
      toast.error("Failed to load your tokens");
    } finally {
      setLoadingTokens(false);
    }
  };

  const extractTokenSymbol = (coinType: string): string => {
    // Extract last part of coin type (e.g., "0x...::coin::USDC" -> "USDC")
    const parts = coinType.split("::");
    return parts[parts.length - 1] || "TOKEN";
  };

  // Fetch current balance when parsing
  const fetchCurrentBalance = async () => {
    if (!currentAccount?.address) return;

    try {
      if (tokenType === "SUI") {
        const balance = await client.getBalance({
          owner: currentAccount.address,
          coinType: "0x2::sui::SUI",
        });
        setCurrentBalance((parseFloat(balance.totalBalance) / 1_000_000_000).toFixed(4));
        setTokenDecimals(9);
      } else if (tokenAddress) {
        const decimals = await getTokenDecimals(tokenAddress);
        setTokenDecimals(decimals);
        const balance = await client.getBalance({
          owner: currentAccount.address,
          coinType: tokenAddress,
        });
        setCurrentBalance((parseFloat(balance.totalBalance) / Math.pow(10, decimals)).toFixed(4));
      }
    } catch (error) {
      console.error("Failed to fetch balance:", error);
    }
  };

  const handleParseRecipients = async () => {
    try {
      const lines = recipients.trim().split("\n").filter(line => line.trim());
      const parsed: RecipientRow[] = [];
      let total = 0;

      for (const line of lines) {
        // Support formats: "address,amount" or "address amount" or "address = amount"
        const parts = line.trim().split(/[,\s=]+/).filter(p => p);
        
        if (parts.length !== 2) {
          throw new Error(`Invalid format: ${line}`);
        }

        const [address, amount] = parts;
        
        // Basic Sui address validation (0x followed by 64 hex chars)
        if (!address.match(/^0x[a-fA-F0-9]{64}$/)) {
          throw new Error(`Invalid Sui address: ${address}`);
        }

        const numAmount = parseFloat(amount);
        if (isNaN(numAmount) || numAmount <= 0) {
          throw new Error(`Invalid amount for ${address}: ${amount}`);
        }

        parsed.push({ address, amount });
        total += numAmount;
      }

      if (parsed.length === 0) {
        throw new Error("No recipients found");
      }

      setParsedRecipients(parsed);
      setTotalAmount(total.toFixed(9));
      await fetchCurrentBalance();
      toast.success(`Parsed ${parsed.length} recipients successfully`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to parse recipients");
      setParsedRecipients([]);
    }
  };

  const handleCSVUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setRecipients(text);
      toast.success("CSV file loaded");
    };
    reader.readAsText(file);
  };

  const handleSend = async () => {
    if (parsedRecipients.length === 0) {
      toast.error("Please parse recipients first");
      return;
    }

    if (!currentAccount?.address) {
      toast.error("Wallet not connected");
      return;
    }

    setIsSending(true);
    setTxDigest(null);

    try {
      // Check balance first
      toast.loading("Checking balance...", { id: "balance-check" });
      
      const balanceCheck = await checkSufficientBalance(
        client,
        currentAccount.address,
        totalAmount,
        tokenType,
        parsedRecipients.length,
        tokenAddress,
        tokenDecimals
      );

      toast.dismiss("balance-check");

      if (!balanceCheck.sufficient) {
        toast.error(
          `Insufficient balance! You have ${balanceCheck.currentBalance} but need ${balanceCheck.required}`,
          { duration: 5000 }
        );
        setIsSending(false);
        return;
      }

      toast.loading("Preparing transaction...", { id: "tx-prep" });

      const result = tokenType === "SUI" 
        ? await sendSuiBatch({
            recipients: parsedRecipients,
            tokenType,
            signAndExecute: signAndExecuteTransaction,
            client,
            senderAddress: currentAccount.address,
          })
        : await sendTokenBatch({
            recipients: parsedRecipients,
            tokenType,
            tokenAddress,
            tokenDecimals,
            signAndExecute: signAndExecuteTransaction,
            client,
            senderAddress: currentAccount.address,
          });

      toast.dismiss("tx-prep");

      if (result.success && result.digest) {
        setTxDigest(result.digest);
        toast.success(`Successfully sent to ${parsedRecipients.length} recipients!`, {
          duration: 5000,
        });
        
        // Clear form
        setRecipients("");
        setParsedRecipients([]);
        setTotalAmount("0");
      } else {
        toast.error(result.error || "Transaction failed");
      }
    } catch (error: any) {
      toast.dismiss("balance-check");
      toast.dismiss("tx-prep");
      
      // Handle user rejection gracefully (suppress console errors for rejections)
      const isRejection = error?.message?.includes("User rejected") || 
                          error?.message?.includes("rejected") ||
                          error?.message?.toLowerCase().includes("user denied") ||
                          error?.code === 4001 ||
                          error?.name === "WalletAccountNotFoundError";
      
      if (isRejection) {
        toast.error("Transaction rejected");
        // Don't log rejection errors to console - this is expected user behavior
      } else {
        toast.error(error instanceof Error ? error.message : "Transaction failed");
        // Only log unexpected errors
        console.error("Transaction error:", error);
      }
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Token Type Selection */}
      <div className="bg-white border border-sui-border rounded-xl p-6 shadow-sm">
        <label className="block text-sm font-medium text-sui-text-primary mb-3">
          What do you want to send?
        </label>
        <div className="flex gap-4">
          <button
            onClick={() => setTokenType("SUI")}
            className={`flex-1 py-3 px-4 rounded-lg border-2 font-medium transition-all ${
              tokenType === "SUI"
                ? "border-sui-primary bg-sui-primary/10 text-sui-primary"
                : "border-sui-border text-sui-text-secondary hover:border-sui-primary/50"
            }`}
          >
            Native SUI
          </button>
          <button
            onClick={() => setTokenType("TOKEN")}
            className={`flex-1 py-3 px-4 rounded-lg border-2 font-medium transition-all ${
              tokenType === "TOKEN"
                ? "border-sui-primary bg-sui-primary/10 text-sui-primary"
                : "border-sui-border text-sui-text-secondary hover:border-sui-primary/50"
            }`}
          >
            Custom Token
          </button>
        </div>

        {tokenType === "TOKEN" && (
          <div className="mt-4">
            {loadingTokens ? (
              <div className="flex items-center gap-2 text-sm text-sui-text-secondary">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading your tokens...
              </div>
            ) : availableTokens.length > 0 && !showCustomToken ? (
              <>
                <label className="block text-sm font-medium text-sui-text-secondary mb-2">
                  Select Token from Your Wallet
                </label>
                <div className="space-y-2 mb-3">
                  {availableTokens.map((token) => (
                    <button
                      key={token.coinType}
                      onClick={() => {
                        setTokenAddress(token.coinType);
                        setTokenDecimals(token.decimals || 9);
                      }}
                      className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${
                        tokenAddress === token.coinType
                          ? "border-sui-primary bg-sui-primary/10"
                          : "border-sui-border hover:border-sui-primary/50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sui-text-primary">{token.symbol}</p>
                          <p className="text-xs text-sui-text-muted font-mono truncate max-w-xs">
                            {token.coinType}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-sui-text-primary">
                            {token.balance}
                          </p>
                          <p className="text-xs text-sui-text-muted">Balance</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setShowCustomToken(true)}
                  className="text-sm text-sui-primary hover:text-sui-primary-dark"
                >
                  + Enter Custom Token Address
                </button>
              </>
            ) : (
              <>
                <label className="block text-sm font-medium text-sui-text-secondary mb-2">
                  Token Object ID
                </label>
                <input
                  type="text"
                  value={tokenAddress}
                  onChange={(e) => setTokenAddress(e.target.value)}
                  placeholder="0x..."
                  className="w-full px-4 py-2 border border-sui-border rounded-lg focus:outline-none focus:ring-2 focus:ring-sui-primary focus:border-transparent"
                />
                {availableTokens.length > 0 && (
                  <button
                    onClick={() => {
                      setShowCustomToken(false);
                      setTokenAddress("");
                    }}
                    className="text-sm text-sui-primary hover:text-sui-primary-dark mt-2"
                  >
                    ← Back to Your Tokens
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Recipients Input */}
      <div className="bg-white border border-sui-border rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-sui-text-primary">
            Recipients & Amounts
          </label>
          <label className="cursor-pointer flex items-center gap-2 text-sm text-sui-primary hover:text-sui-primary-dark">
            <Upload className="w-4 h-4" />
            Upload CSV
            <input
              type="file"
              accept=".csv,.txt"
              onChange={handleCSVUpload}
              className="hidden"
            />
          </label>
        </div>

        <textarea
          value={recipients}
          onChange={(e) => setRecipients(e.target.value)}
          placeholder={`Enter one recipient per line:\n\n0x1234...5678,10\n0xabcd...efgh,25.5\n\nSupported formats:\n• address,amount\n• address amount\n• address = amount`}
          rows={10}
          className="w-full px-4 py-3 border border-sui-border rounded-lg focus:outline-none focus:ring-2 focus:ring-sui-primary focus:border-transparent font-mono text-sm resize-none"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
        />

        <div className="flex gap-3 mt-4">
          <button
            onClick={handleParseRecipients}
            disabled={!recipients.trim()}
            className="flex-1 bg-sui-primary hover:bg-sui-primary-dark disabled:bg-sui-border disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            Parse Recipients
          </button>
        </div>
      </div>

      {/* Parsed Results */}
      {parsedRecipients.length > 0 && (
        <div className="bg-white border border-sui-border rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-sui-text-primary mb-4">
            Review & Send
          </h3>

          {/* Summary */}
          <div className="bg-sui-bg rounded-lg p-4 mb-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-sui-text-secondary">Total Recipients:</span>
              <span className="font-semibold text-sui-text-primary">
                {parsedRecipients.length}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-sui-text-secondary">Total Amount:</span>
              <span className="font-semibold text-sui-text-primary">
                {parseFloat(totalAmount).toFixed(4)} {tokenType}
              </span>
            </div>
            {currentBalance && (
              <div className="flex justify-between text-sm">
                <span className="text-sui-text-secondary">Your Balance:</span>
                <span className="font-semibold text-sui-text-primary">
                  {currentBalance} {tokenType}
                </span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-sui-text-secondary">Estimated Gas:</span>
              <span className="font-semibold text-sui-text-primary">
                ~{(Math.ceil(parsedRecipients.length / 10) * 0.01).toFixed(3)} SUI
              </span>
            </div>
          </div>

          {/* Recipients List Preview */}
          <div className="max-h-60 overflow-y-auto border border-sui-border rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-sui-bg sticky top-0">
                <tr>
                  <th className="text-left py-2 px-4 text-sui-text-secondary font-medium">
                    #
                  </th>
                  <th className="text-left py-2 px-4 text-sui-text-secondary font-medium">
                    Address
                  </th>
                  <th className="text-right py-2 px-4 text-sui-text-secondary font-medium">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {parsedRecipients.map((recipient, index) => (
                  <tr key={index} className="border-t border-sui-border">
                    <td className="py-2 px-4 text-sui-text-muted">{index + 1}</td>
                    <td className="py-2 px-4 font-mono text-xs text-sui-text-primary">
                      {recipient.address.slice(0, 8)}...{recipient.address.slice(-6)}
                    </td>
                    <td className="py-2 px-4 text-right font-semibold text-sui-text-primary">
                      {recipient.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Warning */}
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800">
              <p className="font-medium mb-1">Please verify carefully</p>
              <p>
                Transactions on the blockchain are irreversible. Make sure all addresses and
                amounts are correct before sending.
              </p>
            </div>
          </div>

          {/* Send Button */}
          <button
            onClick={handleSend}
            disabled={isSending}
            className="w-full bg-gradient-to-r from-sui-primary to-sui-primary-dark hover:from-sui-primary-dark hover:to-sui-primary disabled:from-sui-border disabled:to-sui-border disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-lg transition-all mt-4 flex items-center justify-center gap-2 shadow-lg shadow-sui-primary/20"
          >
            {isSending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Sending Transaction...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Send to {parsedRecipients.length} Recipients
              </>
            )}
          </button>
        </div>
      )}

      {/* Transaction Success */}
      {txDigest && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-green-900 mb-2">
                Transaction Successful!
              </h3>
              <p className="text-sm text-green-800 mb-3">
                Your transaction has been confirmed on the Sui blockchain.
              </p>
              <div className="bg-white rounded-lg p-3 border border-green-200">
                <p className="text-xs text-green-700 font-medium mb-1">Transaction Digest:</p>
                <p className="text-xs font-mono text-green-900 break-all">{txDigest}</p>
              </div>
              <a
                href={`https://suiscan.xyz/mainnet/tx/${txDigest}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3 text-sm text-sui-primary hover:text-sui-primary-dark font-medium"
              >
                View on Explorer →
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
