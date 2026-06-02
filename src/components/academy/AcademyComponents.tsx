"use client";
import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Lock, Play, Award, Zap } from "lucide-react";
import { MonolithCard, GlitchText } from "@/components/layout/SovereignUI";
import { Lesson } from "@/types/academy";
import { useRouter } from "next/navigation";
import { useAcademyProgress } from "@/hooks/useAcademyProgress";

// --- GENTLE AUDIOPHILE SYNTH FOR ACADEMY ---
const playSubtleTick = () => {};
const playSubtleClick = () => {};

export function AcademyHeader({ progress }: { progress: number }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#2B2F36] bg-[#1E2026]/90 p-6 md:p-10 backdrop-blur-md shadow-2xl">
      {/* Decorative glowing gradient backdrop */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#F0B90B]/5 blur-[80px] pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-white/2 blur-[80px] pointer-events-none" />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        
        {/* Left text column */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-extrabold uppercase tracking-[0.25em] px-2 py-0.5 bg-[#F0B90B]/10 border border-[#F0B90B]/20 text-[#F0B90B] rounded">
                PROTOCOL_V4 // COGNITIVE
              </span>
              <span className="flex items-center gap-2 text-[9px] font-bold text-[#848E9C] uppercase tracking-wider font-mono">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F0B90B] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F0B90B]"></span>
                </span>
                SYNAPSE_SYSTEM // NEURAL PULSE ACTIVE
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-[#EAECEF] leading-none">
              <GlitchText text="FINANCIAL ACADEMY" />
            </h1>
          </div>
          
          <p className="text-xs md:text-sm text-[#848E9C] max-w-xl leading-relaxed">
            Master the complex mechanics of wealth through proprietary simulation protocols and AI education modules. Each lesson is engineered to expand your financial intelligence quotient.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#2B2F36] border border-[#474D57]/60 text-[10px] font-mono text-[#EAECEF]">
              <Zap className="w-3.5 h-3.5 text-[#F0B90B]" />
              <span>ACTIVE_INTELLIGENCE: GEMINI FLASH</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#2B2F36] border border-[#474D57]/60 text-[10px] font-mono text-[#EAECEF]">
              <Award className="w-3.5 h-3.5 text-[#F0B90B]" />
              <span>STATUS: FUTURE EMPEROR</span>
            </div>
          </div>
        </div>

        {/* Right progress column */}
        <div className="lg:col-span-5 bg-[#2B2F36]/50 border border-[#474D57]/40 rounded-xl p-6 md:p-8 space-y-6">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#848E9C]">Synchronization Progress</span>
            <span className="text-2xl font-black font-mono text-[#F0B90B]">{progress}%</span>
          </div>

          {/* Premium Progress Bar */}
          <div className="relative">
            <div className="w-full h-3 bg-[#1E2026] rounded-full overflow-hidden border border-[#474D57]/30 p-0.5">
              <motion.div 
                className="h-full rounded-full bg-gradient-to-r from-[#F0B90B]/80 to-[#F0B90B] shadow-[0_0_12px_rgba(240,185,11,0.4)]"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
            {/* Glowing neon notch */}
            <motion.div 
              className="absolute top-1/2 -translate-y-1/2 w-1.5 h-5 bg-[#F0B90B] rounded shadow-[0_0_8px_#F0B90B]"
              initial={{ left: 0 }}
              animate={{ left: `calc(${progress}% - 3px)` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 text-center font-mono">
            <div className="p-3 bg-[#1E2026]/60 rounded-lg border border-[#474D57]/30">
              <div className="text-[8px] font-bold text-[#848E9C] uppercase tracking-wider mb-1">CURRICULUM</div>
              <div className="text-base font-bold text-[#EAECEF]">8 MODULES</div>
            </div>
            <div className="p-3 bg-[#1E2026]/60 rounded-lg border border-[#474D57]/30">
              <div className="text-[8px] font-bold text-[#848E9C] uppercase tracking-wider mb-1">PROGRESS</div>
              <div className="text-base font-bold text-[#F0B90B]">
                {Math.round((progress / 100) * 8)} / 8 DONE
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export function AcademyLessonCard({ lesson, status }: { lesson: Lesson, status: "locked" | "started" | "completed" }) {
  const router = useRouter();
  const { resetLessonProgress } = useAcademyProgress();

  const handleAction = (e: React.MouseEvent) => {
    e.preventDefault();
    playSubtleClick();
    if (status === "completed") {
      resetLessonProgress(lesson.slug);
    }
    router.push(`/academy/${lesson.slug}`);
  };

  const statusColors = {
    completed: "bg-[#F0B90B]/10 border-[#F0B90B]/30 text-[#F0B90B]",
    started: "bg-amber-500/10 border-amber-500/30 text-amber-400 animate-pulse",
    locked: "bg-white/2 border-[#2B2F36] text-[#848E9C]/40"
  };

  const statusText = status === "completed" ? "COMPLETED" : status === "started" ? "IN PROGRESS" : "LOCKED";
  const difficultyText = lesson.difficulty === "Beginner" ? "Beginner" : lesson.difficulty === "Intermediate" ? "Intermediate" : "Advanced";

  return (
    <div 
      onClick={handleAction} 
      onMouseEnter={playSubtleTick} 
      className="group cursor-pointer h-full relative"
    >
      <MonolithCard className="p-6 md:p-8 h-full flex flex-col border-[#2B2F36] bg-[#1E2026] hover:bg-[#2B2F36]/40 hover:border-[#F0B90B]/50 transition-all duration-300 rounded-2xl relative overflow-hidden group shadow-lg hover:shadow-2xl">
        
        {/* Subtle grid pattern overlay on hover */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#F0B90B]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Top Header Row inside Card */}
        <div className="flex justify-between items-center mb-6">
          <span className="text-[10px] font-mono font-bold text-[#848E9C]/60 tracking-wider">
            MODULE 0{lesson.number}
          </span>
          <span className={`text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${statusColors[status]}`}>
            {statusText}
          </span>
        </div>

        {/* Lesson Title & Descriptions */}
        <div className="space-y-3 flex-grow mb-8">
          <div className="flex items-start gap-2">
            {status === "completed" ? (
              <CheckCircle2 className="w-5 h-5 text-[#F0B90B] shrink-0 mt-0.5" />
            ) : status === "started" ? (
              <Play className="w-5 h-5 text-amber-400 shrink-0 mt-0.5 animate-pulse" />
            ) : (
              <Lock className="w-5 h-5 text-[#848E9C]/40 shrink-0 mt-0.5" />
            )}
            <h3 className="text-lg md:text-xl font-black uppercase tracking-tight text-[#EAECEF] group-hover:text-[#F0B90B] transition-colors leading-snug">
              {lesson.title}
            </h3>
          </div>
          <p className="text-[11px] text-[#848E9C] font-mono leading-relaxed pl-7">
            {lesson.shortDescription}
          </p>
        </div>

        {/* Bottom details block */}
        <div className="mt-auto pt-6 border-t border-[#2B2F36] flex items-center justify-between">
          <div className="flex items-center gap-4 text-mono">
            <div className="flex flex-col">
              <span className="text-[7px] font-bold text-[#848E9C]/40 uppercase tracking-widest">DURATION</span>
              <span className="text-[10px] font-bold text-[#EAECEF] tracking-wide">{lesson.estimatedMinutes} MIN</span>
            </div>
            <div className="w-[1px] h-4 bg-[#2B2F36]" />
            <div className="flex flex-col">
              <span className="text-[7px] font-bold text-[#848E9C]/40 uppercase tracking-widest">LEVEL</span>
              <span className="text-[10px] font-bold text-[#EAECEF] tracking-wide">{difficultyText}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5 text-[#848E9C] group-hover:text-[#F0B90B] transition-all">
            <span className="text-[8px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
              {status === "completed" ? "REPLAY" : "START"}
            </span>
            <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

      </MonolithCard>
    </div>
  );
}
