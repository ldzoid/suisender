import { Transaction } from "@mysten/sui/transactions";
import { SuiClient } from "@mysten/sui/client";

export interface Recipient {
  address: string;
  amount: string;
}

export interface SendTransactionParams {
  recipients: Recipient[];
  tokenType: "SUI" | "TOKEN";
  tokenAddress?: string;
  tokenDecimals?: number;
  signAndExecute: (params: { transaction: Transaction }) => Promise<any>;
  client: SuiClient;
  senderAddress: string;
}

export interface TransactionResult {
  success: boolean;
  digest?: string;
  error?: string;
}

/**
 * Check if user has sufficient balance for the transaction
 */
export async function checkSufficientBalance(
  client: SuiClient,
  senderAddress: string,
  totalAmount: string,
  tokenType: "SUI" | "TOKEN",
  recipientCount: number,
  tokenAddress?: string,
  tokenDecimals?: number
): Promise<{ sufficient: boolean; currentBalance: string; required: string }> {
  try {
    if (tokenType === "SUI") {
      // Check SUI balance
      const balance = await client.getBalance({
        owner: senderAddress,
        coinType: "0x2::sui::SUI",
      });
      
      const currentBalanceSui = parseFloat(balance.totalBalance) / 1_000_000_000;
      const requiredSui = parseFloat(totalAmount);
      // Dynamic gas estimation: ~0.01 SUI per 10 recipients
      const estimatedGas = Math.max(0.01, Math.ceil(recipientCount / 10) * 0.01);
      
      return {
        sufficient: currentBalanceSui >= (requiredSui + estimatedGas),
        currentBalance: currentBalanceSui.toFixed(4),
        required: (requiredSui + estimatedGas).toFixed(4),
      };
    } else {
      // Check token balance
      if (!tokenAddress) {
        throw new Error("Token address required");
      }
      
      const decimals = tokenDecimals || 9;
      const balance = await client.getBalance({
        owner: senderAddress,
        coinType: tokenAddress,
      });
      
      const currentBalanceToken = parseFloat(balance.totalBalance) / Math.pow(10, decimals);
      const requiredToken = parseFloat(totalAmount);
      
      // Also check SUI for gas
      const suiBalance = await client.getBalance({
        owner: senderAddress,
        coinType: "0x2::sui::SUI",
      });
      const currentSui = parseFloat(suiBalance.totalBalance) / 1_000_000_000;
      // Dynamic gas estimation: ~0.01 SUI per 10 recipients
      const estimatedGas = Math.max(0.01, Math.ceil(recipientCount / 10) * 0.01);
      
      if (currentSui < estimatedGas) {
        return {
          sufficient: false,
          currentBalance: currentSui.toFixed(4) + " SUI (gas)",
          required: estimatedGas.toFixed(4) + " SUI (gas)",
        };
      }
      
      return {
        sufficient: currentBalanceToken >= requiredToken,
        currentBalance: currentBalanceToken.toFixed(4),
        required: requiredToken.toFixed(4),
      };
    }
  } catch (error) {
    console.error("Balance check failed:", error);
    throw error;
  }
}

/**
 * Convert amount from human readable to smallest unit based on decimals
 */
export function amountToSmallestUnit(amount: string, decimals: number): bigint {
  const amountNum = parseFloat(amount);
  return BigInt(Math.floor(amountNum * Math.pow(10, decimals)));
}

/**
 * Convert SUI amount from human readable to MIST (1 SUI = 1_000_000_000 MIST)
 */
export function suiToMist(sui: string): bigint {
  return amountToSmallestUnit(sui, 9);
}

/**
 * Batch send native SUI to multiple recipients
 */
export async function sendSuiBatch(
  params: SendTransactionParams
): Promise<TransactionResult> {
  try {
    const { recipients, signAndExecute } = params;

    const tx = new Transaction();

    // Split coins for each recipient
    for (const recipient of recipients) {
      const amountInMist = suiToMist(recipient.amount);
      const [coin] = tx.splitCoins(tx.gas, [amountInMist]);
      tx.transferObjects([coin], recipient.address);
    }

    // Execute transaction
    const result = await signAndExecute({
      transaction: tx,
    });

    return {
      success: true,
      digest: result.digest,
    };
  } catch (error) {
    console.error("Transaction failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Transaction failed",
    };
  }
}

/**
 * Batch send custom tokens to multiple recipients
 */
export async function sendTokenBatch(
  params: SendTransactionParams
): Promise<TransactionResult> {
  try {
    const { recipients, tokenAddress, tokenDecimals, signAndExecute, client, senderAddress } = params;

    if (!tokenAddress) {
      throw new Error("Token address is required");
    }

    const decimals = tokenDecimals || 9;
    const tx = new Transaction();

    // Get the token coin objects owned by sender
    const coins = await client.getCoins({
      owner: senderAddress,
      coinType: tokenAddress,
    });

    if (coins.data.length === 0) {
      throw new Error("No token coins found in wallet");
    }

    // Merge all coins into one if multiple
    if (coins.data.length > 1) {
      const primaryCoin = coins.data[0].coinObjectId;
      const coinsToMerge = coins.data.slice(1).map((c) => c.coinObjectId);
      tx.mergeCoins(
        tx.object(primaryCoin),
        coinsToMerge.map((id) => tx.object(id))
      );
    }

    const primaryCoin = tx.object(coins.data[0].coinObjectId);

    // Split and transfer to each recipient
    for (const recipient of recipients) {
      const amountInSmallestUnit = amountToSmallestUnit(recipient.amount, decimals);
      const [coin] = tx.splitCoins(primaryCoin, [amountInSmallestUnit]);
      tx.transferObjects([coin], recipient.address);
    }

    // Execute transaction
    const result = await signAndExecute({
      transaction: tx,
    });

    return {
      success: true,
      digest: result.digest,
    };
  } catch (error) {
    console.error("Token transaction failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Transaction failed",
    };
  }
}

/**
 * Estimate gas cost for the transaction
 */
export async function estimateGasCost(
  recipientCount: number,
  tokenType: "SUI" | "TOKEN"
): Promise<string> {
  // Base gas cost + per recipient cost
  // These are rough estimates - actual gas will vary
  const baseGas = 0.001; // 0.001 SUI base
  const perRecipient = 0.0001; // 0.0001 SUI per recipient
  
  const estimatedGas = baseGas + (recipientCount * perRecipient);
  
  return estimatedGas.toFixed(6);
}
