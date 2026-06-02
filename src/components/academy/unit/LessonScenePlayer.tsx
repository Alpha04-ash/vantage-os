"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Lesson, Scene } from "@/types/academy";
import { SceneTransition } from "./SceneTransition";
import { SceneRenderer } from "./SceneRenderer";
import { SceneUI } from "./SceneUI";
import { useAcademyProgress } from "@/hooks/useAcademyProgress";
import { NeuralField, Scanlines } from "@/components/layout/SovereignUI";
import { SynapseTutor } from "@/components/layout/SynapseTutor";

const playSubtleTick = () => {};
const playSubtleClick = () => {};

export default function LessonScenePlayer({ lesson }: { lesson: Lesson }) {
  const router = useRouter();
  const { progress, isLoaded, setSceneIndex, completeLesson, saveQuizAnswer } = useAcademyProgress();
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (isLoaded && progress.lessonProgress[lesson.slug] !== undefined) {
      setCurrentSceneIndex(progress.lessonProgress[lesson.slug]);
    }
  }, [isLoaded, lesson.slug, progress.lessonProgress]);

  const handleNext = useCallback(() => {
    playSubtleClick();
    if (currentSceneIndex < lesson.scenes.length - 1) {
      setIsTransitioning(true);
      setDirection("forward");
      const nextIndex = currentSceneIndex + 1;
      
      setTimeout(() => {
        setCurrentSceneIndex(nextIndex);
        setSceneIndex(lesson.slug, nextIndex);
        setTimeout(() => setIsTransitioning(false), 300);
      }, 100);
    } else {
      completeLesson(lesson.slug);
      router.push("/academy");
    }
  }, [currentSceneIndex, lesson, setSceneIndex, completeLesson, router]);

  const handleBack = useCallback(() => {
    playSubtleClick();
    if (currentSceneIndex > 0) {
      setIsTransitioning(true);
      setDirection("backward");
      const prevIndex = currentSceneIndex - 1;
      
      setTimeout(() => {
        setCurrentSceneIndex(prevIndex);
        setSceneIndex(lesson.slug, prevIndex);
        setTimeout(() => setIsTransitioning(false), 300);
      }, 100);
    }
  }, [currentSceneIndex, lesson.slug, setSceneIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handleBack();
      if (e.key === "Escape") router.push("/academy");
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handleBack, router]);

  const currentScene = lesson.scenes[currentSceneIndex];

  return (
    <main className="fixed inset-0 bg-[#050505] text-white overflow-hidden selection:bg-white selection:text-black touch-none">
      <NeuralField />
      <Scanlines />
      
      {/* PERFORMANCE OPTIMIZED BACKGROUND */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none transition-colors duration-1000 will-change-transform"
        style={{ 
          background: `radial-gradient(circle at 50% 50%, ${lesson.theme}44 0%, transparent 70%)`,
          transform: "translateZ(0)"
        }}
      />

      <SceneUI 
        lesson={lesson} 
        currentSceneIndex={currentSceneIndex} 
        onBack={handleBack} 
        onExit={() => router.push("/academy")}
      />

      {/* TRANSITION OVERLAY FLASH */}
      <AnimatePresence>
        {isTransitioning && (
           <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             transition={{ duration: 0.3 }}
             className="fixed inset-0 z-[150] bg-white/5 backdrop-blur-md pointer-events-none"
           />
        )}
      </AnimatePresence>

      <div className="relative h-full w-full flex items-center justify-center p-6 md:p-20 perspective-2000 overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <SceneTransition 
            key={currentScene.id} 
            direction={direction} 
            style={lesson.transitionStyle}
          >
            <div className="w-full h-full flex items-center justify-center will-change-transform">
               <SceneRenderer 
                 scene={currentScene} 
                 lesson={lesson}
                 onNext={handleNext} 
                 onQuizAnswer={(answerIndex: number, isCorrect: boolean) => saveQuizAnswer(lesson.slug, currentScene.id, answerIndex, isCorrect)}
               />
            </div>
          </SceneTransition>
        </AnimatePresence>
      </div>

      {/* KEYBOARD INSTRUCTION - MORE DISCRETE */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 0.2, y: 0 }}
        className="fixed bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
      >
        <div className="text-[8px] font-black uppercase tracking-[0.8em]">SYSTEM_READY</div>
        <div className="w-4 h-0.5 bg-white/20" />
        <div className="text-[7px] font-mono text-white/40 uppercase tracking-widest hidden md:block">Press [Enter] to proceed to the next stage</div>
      </motion.div>
      <SynapseTutor />
    </main>
  );
}

