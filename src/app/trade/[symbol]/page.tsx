import { Metadata } from "next";
import TradeTerminalPageClient from "@/components/terminal/TradeTerminalPageClient";

interface Props {
  params: Promise<{ symbol: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { symbol } = await params;
  const normSymbol = (symbol || "BTC_USDT").toUpperCase().replace("_", "/");
  return {
    title: `САВДОИ ${normSymbol} | ТЕРМИНАЛИ МАТРИТСА // VANTAGE OS`,
    description: `Терминали савдои воқеии ${normSymbol} бо омори мустақим, китоби фармоишҳои фаъол ва таҳлили кити бозор дар вақти воқеӣ.`,
  };
}

export default function TradePage() {
  return <TradeTerminalPageClient />;
}
