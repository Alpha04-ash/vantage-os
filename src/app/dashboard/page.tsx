import { Metadata } from "next";
import DashboardPageClient from "@/components/layout/DashboardPageClient";

export const metadata: Metadata = {
  title: "DASHBOARD // VANTAGE Sovereign Command Console",
  description: "Sovereign assets and capital command console. Complete oversight powered by Google Gemini AI with real-time financial telemetry.",
};

export default function DashboardPage() {
  return <DashboardPageClient />;
}
