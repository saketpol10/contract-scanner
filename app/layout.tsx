import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "OfferScan — AI Job Offer Analyzer for Tech Workers",
  description:
    "Paste your job offer or employment contract and get an instant AI breakdown of non-competes, IP clauses, equity terms, and hidden risks — explained in plain English.",
  openGraph: {
    title: "OfferScan — AI Job Offer Analyzer for Tech Workers",
    description: "Know what you're signing. Free AI job offer analysis built for developers.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} bg-gray-950 text-gray-100 min-h-screen antialiased`}>
        {children}
      </body>
    </html>
  );
}
