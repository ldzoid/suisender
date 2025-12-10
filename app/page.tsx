"use client";

import { useCurrentAccount } from "@mysten/dapp-kit";
import { Send, Zap, Shield, Github } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MultisendForm from "@/components/MultisendForm";

export default function HomePage() {
  const currentAccount = useCurrentAccount();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#6fbcf0]/10 rounded-full text-sm font-medium text-[#4da2da] mb-6">
              <Zap className="w-4 h-4" />
              Free • Open Source • No Fees
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-sui-text-primary mb-6">
              Free Sui Multisender
              <br />
              <span className="bg-gradient-to-r from-[#6fbcf0] to-[#4da2da] bg-clip-text text-transparent">
                Batch Send SUI & Tokens
              </span>
            </h1>
            
            <p className="text-xl text-sui-text-secondary mb-10 max-w-2xl mx-auto">
              Free Sui token multisend tool. Send SUI and custom tokens to multiple addresses in one transaction. 
              Zero fees, lightning fast bulk transfers on Sui blockchain.
            </p>

            {currentAccount ? (
              <MultisendForm />
            ) : (
              <div className="bg-gradient-to-br from-white to-[#6fbcf0]/5 border-2 border-dashed border-sui-border rounded-2xl p-12">
                <div className="w-20 h-20 bg-gradient-to-br from-[#6fbcf0] to-[#4da2da] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Send className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-sui-text-primary mb-3">
                  Connect Your Wallet to Get Started
                </h3>
                <p className="text-sui-text-secondary">
                  Click the "Connect Wallet" button in the header to begin
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-sui-text-primary mb-12">
              Best Free Sui Multisender Tool
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-[#6fbcf0]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-[#4da2da]" />
                </div>
                <h3 className="text-xl font-semibold text-sui-text-primary mb-2">
                  Lightning Fast Batch Transfers
                </h3>
                <p className="text-sui-text-secondary">
                  Sui token multisend to hundreds of addresses in one transaction. Save time and gas with bulk sending.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-[#6fbcf0]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-[#4da2da]" />
                </div>
                <h3 className="text-xl font-semibold text-sui-text-primary mb-2">
                  100% Free Multisender
                </h3>
                <p className="text-sui-text-secondary">
                  Free Sui sender with zero platform fees. No middlemen. Only pay standard Sui network gas.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-[#6fbcf0]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Github className="w-8 h-8 text-[#4da2da]" />
                </div>
                <h3 className="text-xl font-semibold text-sui-text-primary mb-2">
                  Open Source
                </h3>
                <p className="text-sui-text-secondary">
                  Fully transparent and auditable. Contribute or fork on GitHub.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-[#6fbcf0]/5">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-sui-text-primary mb-12">
              Frequently Asked Questions
            </h2>
            
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-sui-border hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold text-sui-text-primary mb-3">
                  What is a Sui multisender?
                </h3>
                <p className="text-sui-text-secondary leading-relaxed">
                  A tool that lets you send SUI or custom tokens to multiple wallet addresses in a single transaction, 
                  saving time and reducing gas fees.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-sm border border-sui-border hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold text-sui-text-primary mb-3">
                  How much does it cost?
                </h3>
                <p className="text-sui-text-secondary leading-relaxed">
                  Completely free with zero platform fees. You only pay standard Sui network gas fees.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-sm border border-sui-border hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold text-sui-text-primary mb-3">
                  Is it safe?
                </h3>
                <p className="text-sui-text-secondary leading-relaxed">
                  Yes! Completely non-custodial - you maintain full control of your wallet. The code is open source 
                  and auditable on GitHub.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
