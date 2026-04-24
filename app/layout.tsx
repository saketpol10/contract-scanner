import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ContractScan — AI Contract Risk Scanner",
  description:
    "Paste any contract and get an instant AI breakdown of risky clauses. Non-competes, IP grabs, hidden auto-renewals, and more — explained in plain English.",
  openGraph: {
    title: "ContractScan — AI Contract Risk Scanner",
    description: "Know what you're signing. Free AI contract analysis in seconds.",
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
