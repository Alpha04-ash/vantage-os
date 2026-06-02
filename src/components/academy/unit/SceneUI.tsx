"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lesson } from "@/types/academy";
import { X, ArrowLeft } from "lucide-react";
import { MonolithCard, SovereignButton } from "@/components/layout/SovereignUI";

export function SceneUI({ lesson, currentSceneIndex, onBack, onExit }: { 
  lesson: Lesson, 
  currentSceneIndex: number, 
  onBack: () => void,
  onExit: () => void 
}) {
  const progress = ((currentSceneIndex + 1) / lesson.scenes.length) * 100;

  return (
    <>
      {/* Top Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 z-[100] px-10 py-8 flex justify-between items-center pointer-events-none">
         <div className="flex items-center gap-10 pointer-events-auto">
            <button 
              onClick={onExit}
              className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-white/30 hover:text-white transition-colors"
            >
               <X size={14} className="group-hover:rotate-90 transition-transform" /> EXIT_SYNCHRONIZATION
            </button>
            <div className="h-4 w-[1px] bg-white/10 hidden md:block" />
            <div className="hidden md:flex flex-col">
               <div className="text-[10px] font-black uppercase tracking-widest text-white/10 italic">ACTIVE_MODULE</div>
               <div className="text-sm font-black italic uppercase tracking-tighter text-white/80">{lesson.title}</div>
            </div>
         </div>

         <div className="flex items-center gap-8 pointer-events-auto">
            <button 
              onClick={onBack}
              disabled={currentSceneIndex === 0}
              className={`p-3 border border-white/10 hover:bg-white/5 transition-all ${currentSceneIndex === 0 ? 'opacity-0 pointer-events-none' : ''}`}
            >
               <ArrowLeft size={16} />
            </button>
         </div>
      </div>

      {/* Progress Bar (Bottom) */}
      <div className="fixed bottom-0 left-0 right-0 z-[100] h-1.5 bg-white/5">
         <motion.div 
           initial={{ width: 0 }}
           animate={{ width: `${progress}%` }}
           transition={{ duration: 0.8, ease: "circOut" }}
           className="h-full bg-white shadow-[0_0_20px_rgba(255,255,255,0.5)]"
         />
         <div className="fixed bottom-4 right-10 text-[9px] font-black uppercase tracking-[0.6em] text-white/10">
            STAGE_SYNCHRONIZATION: {currentSceneIndex + 1}/{lesson.scenes.length}
         </div>
      </div>

      {/* AI Tutor Panel */}
    </>
  );
}
