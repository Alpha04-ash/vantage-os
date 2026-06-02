import { Metadata } from "next";
import AcademyPageClient from "@/components/academy/AcademyPageClient";

export const metadata: Metadata = {
  title: "FINANCIAL ACADEMY // VANTAGE OS",
  description: "A comprehensive financial academy featuring interactive finance lessons and realistic simulations, supported by your personal Google Gemini AI tutor.",
};

export default function AcademyPage() {
  return <AcademyPageClient />;
}
