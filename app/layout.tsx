import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";

export const metadata: Metadata = {
  title: "DatasetDAO - AI-Verified Dataset Marketplace",
  description: "The first marketplace where AI verification meets blockchain certification. Buy and sell datasets with provable quality.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased min-h-screen w-full overflow-x-hidden">
        <Navbar />
        <main className="relative w-full">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
