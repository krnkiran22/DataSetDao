import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { SuiWalletProvider } from "@/lib/wallet/SuiWalletProvider";
import { ToastProvider } from "@/lib/context/ToastContext";
import '@mysten/dapp-kit/dist/index.css';

export const metadata: Metadata = {
  title: "Suitify - AI-Verified Dataset Marketplace on Sui",
  description: "Trade verified datasets with confidence. AI-powered quality scores, blockchain certification, and decentralized storage on Sui blockchain.",
  
  keywords: [
    "Sui blockchain",
    "dataset marketplace",
    "AI verification",
    "blockchain certification",
    "Walrus storage",
    "NFT certificates",
    "data quality",
    "machine learning datasets",
    "verified data",
    "decentralized storage"
  ].join(", "),
  
  authors: [{ name: "Suitify Team" }],
  creator: "Suitify",
  publisher: "Suitify",
  
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  
  // Open Graph (for social media sharing)
  openGraph: {
    title: "Suitify - Certify Your Data on Sui",
    description: "The first AI-verified, blockchain-certified dataset marketplace. Trade datasets with provable quality on Sui blockchain.",
    url: "https://suitifyy.vercel.app",
    siteName: "Suitify",
    images: [
      {
        url: "https://suitifyy.vercel.app/logo.jpg",
        width: 1200,
        height: 630,
        alt: "Suitify - AI-Verified Dataset Marketplace",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  
  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "Suitify - Certify Your Data on Sui",
    description: "AI-verified, blockchain-certified dataset marketplace on Sui blockchain",
    creator: "@suitify_io",
    images: ["https://suitifyy.vercel.app/logo.jpg"],
  },
  
  // Additional Meta
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
  
  // App-specific
  applicationName: "Suitify",
  appleWebApp: {
    capable: true,
    title: "Suitify",
    statusBarStyle: "black-translucent",
  },
  
  icons: {
    icon: '/logo.jpg',
    shortcut: '/logo.jpg',
    apple: '/logo.jpg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased min-h-screen w-full overflow-x-hidden">
        <SuiWalletProvider>
          <ToastProvider>
            <Navbar />
            <main className="relative w-full">{children}</main>
            <Footer />
          </ToastProvider>
        </SuiWalletProvider>
      </body>
    </html>
  );
}
