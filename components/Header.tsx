"use client";

import { ConnectButton } from "@mysten/dapp-kit";
import Link from "next/link";
import { Send } from "lucide-react";

export default function Header() {
  return (
    <header className="border-b border-sui-border bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-[#6fbcf0] to-[#4da2da] rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <Send className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-sui-text-primary">
              SuiSender
            </span>
          </Link>

          {/* Navigation & Connect Button */}
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-6 text-sm">
              <Link 
                href="/" 
                className="text-sui-text-secondary hover:text-sui-primary transition-colors"
              >
                Home
              </Link>
              <a 
                href="https://github.com/ldzoid/suisender" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sui-text-secondary hover:text-sui-primary transition-colors"
              >
                GitHub
              </a>
            </nav>
            
            <ConnectButton />
          </div>
        </div>
      </div>
    </header>
  );
}
