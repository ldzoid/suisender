import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import WalletProvider from "@/providers/WalletProvider";
import { Toaster } from "sonner";
import { APP_NAME, APP_DESCRIPTION, APP_URL } from "@/lib/constants";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  keywords: [
    "sui sender",
    "free sui multisender",
    "sui token multisend",
    "sui bulk sender",
    "send sui tokens",
    "sui airdrop tool",
    "sui batch transfer",
    "sui token distributor",
    "multisend sui",
    "sui crypto sender",
    "free multisender",
    "sui blockchain",
    "sui network",
  ],
  authors: [{ name: "SuiSender" }],
  creator: "SuiSender",
  publisher: "SuiSender",
  alternates: {
    canonical: APP_URL,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: APP_URL,
    title: APP_NAME,
    description: APP_DESCRIPTION,
    siteName: APP_NAME,
    images: [
      {
        url: `${APP_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "SuiSender - Free Sui Multisender Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: APP_NAME,
    description: APP_DESCRIPTION,
    images: [`${APP_URL}/og-image.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add these once you set up:
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "SuiSender",
    description: APP_DESCRIPTION,
    url: APP_URL,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "Bulk send SUI tokens",
      "Batch transfer custom tokens",
      "CSV import support",
      "Zero platform fees",
      "Open source",
    ],
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link rel="author" href="/humans.txt" />
      </head>
      <body className={inter.className}>
        <WalletProvider>
          {children}
          <Toaster position="top-right" richColors />
        </WalletProvider>
        <Analytics />
      </body>
    </html>
  );
}
