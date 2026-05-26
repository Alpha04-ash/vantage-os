import { Metadata } from "next";
import AcademyPageClient from "@/components/academy/AcademyPageClient";

export const metadata: Metadata = {
  title: "АКАДЕМИЯИ МОЛИЯВӢ // VANTAGE OS",
  description: "Академияи молиявии мукаммал бо дарсҳои интерактивии молия ва симулятсияҳои аслӣ, ки бо муаллими инфиродии Google Gemini AI дастгирӣ мешаванд.",
};

export default function AcademyPage() {
  return <AcademyPageClient />;
}
