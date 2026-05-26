import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VANTAGE | SOVEREIGN_OS",
  description: "Sovereign Intelligence. Systemic Impact. Radical Transparency.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tg"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col font-[var(--font-inter)]">{children}</body>
    </html>
  );
}
