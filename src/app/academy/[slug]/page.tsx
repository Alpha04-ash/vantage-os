import React from "react";
import { Metadata } from "next";
import { FINANCE_LESSONS } from "@/data/financeLessons";
import LessonScenePlayer from "@/components/academy/unit/LessonScenePlayer";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const lesson = FINANCE_LESSONS.find((l) => l.slug === slug);
  if (!lesson) {
    return {
      title: "МОДУЛИ КОГНИТИВӢ ЁФТ НАШУД | VANTAGE ACADEMY",
    };
  }
  return {
    title: `${lesson.title} — Модули ${lesson.number} | АКАДЕМИЯИ VANTAGE`,
    description: `${lesson.shortDescription} Мафҳумҳои молиявиро бо ИИ-и Gemini ва VANTAGE омӯзед.`,
  };
}

export default async function LessonPage({ params }: Props) {
  const { slug } = await params;
  const lesson = FINANCE_LESSONS.find((l) => l.slug === slug);

  if (!lesson) {
    notFound();
  }

  return <LessonScenePlayer lesson={lesson} />;
}
