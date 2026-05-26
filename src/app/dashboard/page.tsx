import { Metadata } from "next";
import DashboardPageClient from "@/components/layout/DashboardPageClient";

export const metadata: Metadata = {
  title: "ДИДБОН // VANTAGE Sovereign Command Console",
  description: "Маркази фармондиҳии дороиҳо ва сармояи соҳибихтиёрӣ. Назорати умумӣ тавассути AI Google Gemini бо омори молиявии воқеӣ.",
};

export default function DashboardPage() {
  return <DashboardPageClient />;
}
