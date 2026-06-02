import { Metadata } from "next";
import TradeTerminalPageClient from "@/components/terminal/TradeTerminalPageClient";

interface Props {
  params: Promise<{ symbol: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { symbol } = await params;
  const normSymbol = (symbol || "BTC_USDT").toUpperCase().replace("_", "/");
  return {
    title: `TRADE ${normSymbol} | MATRIX TERMINAL // VANTAGE OS`,
    description: `Real-time trading terminal for ${normSymbol} with live ticker data, active order book, and real-time order flow tracking.`,
  };
}

export default function TradePage() {
  return <TradeTerminalPageClient />;
}
