"use client";

import React from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { NeuralField3D } from "@/components/layout/NeuralField3D";
import { Scanlines } from "@/components/layout/SovereignUI";
import { FINANCE_LESSONS } from "@/data/financeLessons";
import { useAcademyProgress } from "@/hooks/useAcademyProgress";
import { AcademyHeader, AcademyLessonCard } from "@/components/academy/AcademyComponents";
import { Sparkles, BookOpen } from "lucide-react";
import { SynapseTutor } from "@/components/layout/SynapseTutor";

export default function AcademyPage() {
  const { progress, isLoaded } = useAcademyProgress();

  const overallProgress = isLoaded 
    ? Math.round((progress.completedLessons.length / FINANCE_LESSONS.length) * 100) 
    : 0;

  return (
    <main className="min-h-screen bg-[#0B0E11] text-white selection:bg-white selection:text-black overflow-x-hidden no-scrollbar relative pb-32">
      <NeuralField3D />
      <Scanlines />
      <Navbar />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-10 pt-24 sm:pt-32 space-y-16">
         {/* HEADER SECTION */}
         <AcademyHeader progress={overallProgress} />

         {/* LESSONS GRID */}
         <div className="space-y-8">
            <div className="flex items-center gap-4">
               <div className="text-[9px] font-extrabold uppercase tracking-[0.6em] text-[#F0B90B] flex items-center gap-2 font-mono">
                 <Sparkles className="w-3.5 h-3.5 text-[#F0B90B] animate-pulse" />
                 АРХИВИ_БАРНОМАҲО_ОМӮЗИШӢ
               </div>
               <div className="h-[1px] flex-1 bg-gradient-to-r from-[#F0B90B]/30 via-[#2B2F36] to-transparent" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
               {FINANCE_LESSONS.map((lesson) => {
                  const isCompleted = progress.completedLessons.includes(lesson.slug);
                  const isStarted = progress.lessonProgress[lesson.slug] !== undefined;
                  const status = isCompleted ? "completed" : isStarted ? "started" : "locked";

                  return (
                     <AcademyLessonCard 
                        key={lesson.id} 
                        lesson={lesson} 
                        status={status as any} 
                     />
                  );
               })}
            </div>
         </div>
      </div>

      <footer className="mt-40 py-20 border-t border-white/5 px-10 flex flex-col md:flex-row justify-between items-center gap-8 opacity-20">
         <div className="text-[10px] font-black uppercase tracking-widest italic">Академияи Молиявии VANTAGE — Ҳамаи 8 модул дарсҳои ИИ-и Gemini-ро дар бар мегиранд</div>
         <div className="text-[10px] font-black uppercase tracking-widest italic">Бо дастгирии Google Gemini Flash Lite</div>
      </footer>
      <SynapseTutor />
    </main>
  );
}
