import { Github, Heart } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-sui-border bg-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="font-semibold text-sui-text-primary mb-3">
              SuiSender
            </h3>
            <p className="text-sm text-sui-text-secondary">
              Free, open-source multisender for Sui blockchain. No fees, no middlemen.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-sui-text-primary mb-3">
              Resources
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://sui.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sui-text-secondary hover:text-sui-primary transition-colors"
                >
                  Sui Network
                </a>
              </li>
              <li>
                <a
                  href="https://docs.sui.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sui-text-secondary hover:text-sui-primary transition-colors"
                >
                  Documentation
                </a>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-sui-text-secondary hover:text-sui-primary transition-colors"
                >
                  How to Use
                </Link>
              </li>
            </ul>
          </div>

          {/* Open Source */}
          <div>
            <h3 className="font-semibold text-sui-text-primary mb-3">
              Open Source
            </h3>
            <a
              href="https://github.com/ldzoid/suisender"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-sui-text-secondary hover:text-sui-primary transition-colors"
            >
              <Github className="w-4 h-4" />
              View on GitHub
            </a>
            <p className="text-sm text-sui-text-secondary mt-4 flex items-center gap-1">
              Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> for Sui
            </p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-sui-border text-center text-sm text-sui-text-muted">
          <p>
            © {new Date().getFullYear()} SuiSender. Open source under MIT License.
          </p>
        </div>
      </div>
    </footer>
  );
}
