import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vantage OS | AI Financial Simulator",
  description: "Start with $100K. Reach $1M without going bankrupt. Learn real money decisions by actually making them. Every decision is analyzed in real-time by AI, acting as your financial advisor.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col font-[var(--font-inter)]">{children}</body>
    </html>
  );
}
