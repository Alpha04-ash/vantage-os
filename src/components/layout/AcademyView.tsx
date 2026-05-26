"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { GraduationCap, ArrowRight, BookOpen, Brain, Zap } from "lucide-react";

const STATUS_LINES = [
  "Омодасозии Академияи молиявии AI...",
  "Боркунии муҳити дарсҳои интерактивӣ...",
  "Пайваст кардани муаллими Gemini AI...",
  "Лабораторияи симулятсия омода аст.",
];

export function AcademyView() {
  const router = useRouter();
  const [statusIndex, setStatusIndex] = useState(0);

  useEffect(() => {
    if (statusIndex < STATUS_LINES.length - 1) {
      const t = setTimeout(() => setStatusIndex(i => i + 1), 600);
      return () => clearTimeout(t);
    }
  }, [statusIndex]);

  const features = [
    { icon: BookOpen, label: "8 Дарси интерактивӣ" },
    { icon: Brain, label: "Муаллими инфиродии Gemini AI" },
    { icon: Zap, label: "Ба даст овардани XP ва сатҳи нав" },
  ];

  return (
    <div className="relative w-full h-[90vh] flex flex-col items-center justify-center text-white bg-[#1E2026] border border-[#2B2F36] rounded-2xl overflow-hidden">
      {/* Subtle radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(240,185,11,0.04)_0%,transparent_70%)]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 text-center max-w-2xl px-10"
      >
        {/* Icon */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="inline-block p-5 rounded-2xl bg-[#F0B90B]/10 border border-[#F0B90B]/20 backdrop-blur-xl mb-8"
        >
          <GraduationCap size={44} className="text-[#F0B90B]" />
        </motion.div>

        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight uppercase mb-3 leading-none text-[#EAECEF]">
          Академияи молиявии <span className="text-[#F0B90B]">AI</span>
        </h1>

        <p className="text-[#848E9C] text-sm font-medium uppercase tracking-[0.2em] mb-6 leading-relaxed">
          Молияи воқеиро тавассути дарсҳои интерактивӣ бо AI омӯзед
        </p>

        {/* Typewriter status */}
        <motion.div
          key={statusIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-mono text-[11px] text-[#F0B90B]/70 tracking-widest uppercase mb-8 flex items-center justify-center gap-2"
        >
          <span className="w-1.5 h-1.5 bg-[#F0B90B] rounded-full animate-pulse" />
          {STATUS_LINES[statusIndex]}
        </motion.div>

        {/* Feature pills */}
        <div className="flex items-center justify-center gap-6 mb-10 flex-wrap">
          {features.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 text-[#848E9C] text-[11px] font-mono uppercase tracking-wider">
              <Icon size={12} className="text-[#F0B90B]/60" />
              {label}
            </div>
          ))}
        </div>

        <button
          onClick={() => router.push('/academy')}
          className="group px-10 py-4 bg-[#F0B90B] text-black font-bold uppercase tracking-widest rounded-xl hover:bg-[#F8D33A] active:scale-95 transition-all shadow-[0_0_24px_rgba(240,185,11,0.2)] flex items-center gap-3 mx-auto"
        >
          ВУРУД БА АКАДЕМИЯ
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </motion.div>

      {/* Decorative border lines */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#F0B90B]/30 to-transparent" />
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#2B2F36] to-transparent" />
    </div>
  );
}
