"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Lesson, Scene } from "@/types/academy";
import { MonolithCard, SovereignButton } from "@/components/layout/SovereignUI";
import { CheckCircle2, XCircle, ArrowRight, HelpCircle } from "lucide-react";
import Image from "next/image";

export function SceneRenderer({ scene, lesson, onNext, onQuizAnswer }: { 
  scene: Scene, 
  lesson: Lesson,
  onNext: () => void,
  onQuizAnswer: (index: number, isCorrect: boolean) => void
}) {
  switch (scene.type) {
    case "intro": return <IntroScene scene={scene} lesson={lesson} onNext={onNext} />;
    case "concept": return <ConceptScene scene={scene} lesson={lesson} onNext={onNext} />;
    case "explanation": return <ExplanationScene scene={scene} lesson={lesson} onNext={onNext} />;
    case "example": return <ExampleScene scene={scene} lesson={lesson} onNext={onNext} />;
    case "mistake": return <MistakeScene scene={scene} lesson={lesson} onNext={onNext} />;
    case "quiz": return <QuizScene scene={scene} lesson={lesson} onNext={onNext} onAnswer={onQuizAnswer} />;
    case "completion": return <CompletionScene scene={scene} lesson={lesson} onNext={onNext} />;
    default: return <div>Unknown Scene Type</div>;
  }
}

function SceneLayout({ children, visual, title, subtitle, content, lesson }: any) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center w-full min-h-[60vh]">
       <div className="order-2 lg:order-1 space-y-10">
          <div className="space-y-6">
             {subtitle && (
               <motion.div 
                 initial={{ opacity: 0, x: -10 }}
                 animate={{ opacity: 1, x: 0 }}
                 className="text-[10px] font-black uppercase tracking-[0.8em]"
                 style={{ color: lesson?.theme || "rgba(255,255,255,0.2)" }}
               >
                 {subtitle}
               </motion.div>
             )}
             <h2 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter italic leading-none text-white/90">
                {title}
             </h2>
          </div>
          <div className="space-y-8">
             <p className="text-lg md:text-xl text-white/40 leading-relaxed italic font-mono border-l-2 pl-8 py-2" style={{ borderColor: lesson?.theme ? `${lesson.theme}40` : "rgba(255,255,255,0.1)" }}>
                {content}
             </p>
             <div className="pt-4">
                {children}
             </div>
          </div>
       </div>
       <div className="order-1 lg:order-2 flex justify-center items-center py-10 lg:py-0">
          <div className="w-full max-w-[500px]">
             {visual}
          </div>
       </div>
    </div>
  );
}

function VisualWrapper({ children, lesson }: { children: React.ReactNode, lesson?: Lesson }) {
  return (
    <motion.div 
      animate={{ 
        y: [0, -15, 0],
        rotateX: [3, -3, 3],
        rotateY: [5, -5, 5]
      }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      className="relative group perspective-2000 will-change-transform"
      style={{ transformStyle: "preserve-3d" }}
    >
       <div className="absolute inset-0 blur-[100px] rounded-full opacity-20 group-hover:opacity-40 transition-opacity" style={{ backgroundColor: lesson?.theme || "rgba(255,255,255,0.1)" }} />
       <div className="relative z-10" style={{ filter: `drop-shadow(0 0 50px ${lesson?.theme ? lesson.theme + "10" : "rgba(255,255,255,0.05)"})` }}>
          {children}
       </div>
    </motion.div>
  );
}


function IntroScene({ scene, lesson, onNext }: any) {
  return (
    <div className="flex flex-col items-center text-center space-y-12 max-w-4xl mx-auto py-10">
       <VisualWrapper lesson={lesson}>
          <div className="relative w-64 h-64 md:w-80 md:h-80">
             {scene.visualData?.src ? (
               <Image 
                 src={`/academy/${scene.visualData.src}`} 
                 alt={scene.title}
                 width={400}
                 height={400}
                 priority
                 className="w-full h-full object-contain filter drop-shadow-[0_0_50px_rgba(255,255,255,0.05)]"
               />
             ) : (
               <div className="w-full h-full border border-white/5 bg-white/[0.01] flex items-center justify-center rounded-full">
                  <div className="text-[8px] font-black uppercase tracking-[1em] text-white/5 animate-pulse">INITIALIZING_SEQUENCE</div>
               </div>
             )}
          </div>
       </VisualWrapper>
       <div className="space-y-6 max-w-2xl">
          <motion.div
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.2 }}
             className="space-y-4"
          >
             <div className="text-[9px] font-black text-white/10 uppercase tracking-[0.8em]">MODULE_INITIATION</div>
             <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic leading-none text-white/90">
                {scene.title}
             </h1>
             <p className="text-base md:text-lg text-white/20 italic font-mono tracking-tight leading-relaxed">
                {scene.content}
             </p>
          </motion.div>
       </div>
       <motion.div
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         transition={{ delay: 0.6 }}
       >
          <SovereignButton onClick={onNext} className="px-12 py-5 text-xs">
             EXECUTE_SYNCHRONIZATION <ArrowRight size={14} />
          </SovereignButton>
       </motion.div>
    </div>
  );
}

function ConceptScene({ scene, lesson, onNext }: any) {
  // Render different geometric abstractions based on lesson slug
  const renderVisual = () => {
    switch (lesson.slug) {
      case "money-psychology":
        return (
          <div className="w-full h-full border border-dashed rounded-full flex items-center justify-center relative animate-[spin_40s_linear_infinite]" style={{ borderColor: `${lesson.theme}40` }}>
            <div className="absolute w-4 h-4 rounded-full blur-[2px]" style={{ backgroundColor: lesson.theme, top: '-2px' }} />
            <div className="absolute w-3 h-3 rounded-full blur-[2px]" style={{ backgroundColor: lesson.theme, bottom: '20px', left: '10px' }} />
            <div className="w-1/2 h-1/2 border rounded-full flex items-center justify-center animate-[spin_20s_linear_infinite_reverse]" style={{ borderColor: `${lesson.theme}60` }}>
               <div className="w-8 h-8 rounded-full" style={{ backgroundColor: lesson.theme, boxShadow: `0 0 30px ${lesson.theme}` }} />
            </div>
          </div>
        );
      case "how-money-works":
        return (
          <div className="w-full h-full grid grid-cols-4 grid-rows-4 gap-2 p-4">
             {Array.from({ length: 16 }).map((_, i) => (
                <motion.div 
                  key={i} 
                  animate={{ opacity: [0.2, 0.8, 0.2] }} 
                  transition={{ duration: Math.random() * 3 + 2, repeat: Infinity }}
                  className="rounded-sm"
                  style={{ backgroundColor: i % 3 === 0 ? lesson.theme : `${lesson.theme}20` }}
                />
             ))}
          </div>
        );
      case "budgeting-saving":
        return (
          <div className="w-full h-full flex flex-col justify-end gap-2 px-8 py-4">
             <motion.div animate={{ height: ["20%", "40%", "20%"] }} transition={{ duration: 4, repeat: Infinity }} className="w-full" style={{ backgroundColor: `${lesson.theme}80` }} />
             <div className="w-full h-[30%]" style={{ backgroundColor: `${lesson.theme}40` }} />
             <div className="w-full h-[50%]" style={{ backgroundColor: `${lesson.theme}20` }} />
          </div>
        );
      case "investing-compounding":
        return (
          <div className="w-full h-full flex items-end justify-between px-4 pb-4">
             {Array.from({ length: 6 }).map((_, i) => (
                <motion.div 
                  key={i} 
                  initial={{ height: "10%" }}
                  animate={{ height: `${(i + 1) * 15}%` }}
                  className="w-4 rounded-t-sm"
                  style={{ backgroundColor: lesson.theme, opacity: (i + 1) * 0.15 }}
                />
             ))}
          </div>
        );
      default:
        return (
          <div className="w-full h-full border border-dashed rounded-full animate-[spin_30s_linear_infinite] flex items-center justify-center" style={{ borderColor: `${lesson.theme}30` }}>
             <div className="w-2/3 h-2/3 border rounded-full flex items-center justify-center" style={{ borderColor: `${lesson.theme}50` }}>
                <div className="w-3 h-3 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.3)]" style={{ backgroundColor: lesson.theme }} />
             </div>
          </div>
        );
    }
  };

  return (
    <SceneLayout 
      title={scene.title} 
      subtitle={scene.subtitle} 
      content={scene.content}
      lesson={lesson}
      visual={
        <VisualWrapper lesson={lesson}>
           <div className="w-64 h-64 md:w-80 md:h-80 border bg-white/[0.01] rounded-full flex items-center justify-center p-8" style={{ borderColor: `${lesson.theme}10` }}>
              {renderVisual()}
           </div>
        </VisualWrapper>
      }
    >
       <SovereignButton onClick={onNext} className="px-10 py-4 text-[10px]">NEXT_STAGE <ArrowRight size={12} /></SovereignButton>
    </SceneLayout>
  );
}

function ExplanationScene({ scene, lesson, onNext }: any) {
  return (
    <div className="w-full flex flex-col items-center justify-center min-h-[60vh] space-y-12">
       <div className="text-center space-y-4 max-w-2xl">
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic text-white/90">
             {scene.title}
          </h2>
          <p className="text-lg text-white/40 italic font-mono leading-relaxed" style={{ color: `${lesson.theme}80` }}>
             {scene.content}
          </p>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
          {scene.points?.map((point: string, i: number) => (
             <motion.div 
               key={i}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.15 }}
               className="h-full"
             >
                <MonolithCard className="p-6 border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all h-full flex flex-col group relative overflow-hidden" style={{ borderColor: `${lesson.theme}20` }}>
                   <div className="absolute top-0 right-0 w-24 h-24 blur-[40px] opacity-10 group-hover:opacity-30 transition-opacity" style={{ backgroundColor: lesson.theme }} />
                   <div className="text-[32px] font-black opacity-20 mb-4 font-mono leading-none" style={{ color: lesson.theme }}>0{i+1}</div>
                   <div className="text-sm font-mono text-white/60 italic leading-relaxed z-10">{point}</div>
                </MonolithCard>
             </motion.div>
          ))}
       </div>

       <div className="pt-8">
          <SovereignButton onClick={onNext} className="px-10 py-4 text-[10px]">DEEP_SYNCHRONIZATION <ArrowRight size={12} /></SovereignButton>
       </div>
    </div>
  );
}

function ExampleScene({ scene, lesson, onNext }: any) {
  return (
    <div className="w-full min-h-[60vh] flex flex-col items-center justify-center space-y-12">
       <div className="w-full max-w-4xl relative">
          <div className="absolute -left-4 top-0 bottom-0 w-[2px]" style={{ backgroundColor: `${lesson.theme}40` }} />
          <h2 className="text-[10px] font-black uppercase tracking-[0.8em] mb-4" style={{ color: lesson.theme }}>PRACTICAL_APPLICATION</h2>
          <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic text-white/90 mb-6">{scene.title}</h3>
          <p className="text-xl text-white/50 italic leading-relaxed max-w-2xl">{scene.content}</p>
       </div>

       <motion.div 
         initial={{ opacity: 0, scale: 0.95 }}
         animate={{ opacity: 1, scale: 1 }}
         className="w-full max-w-4xl"
       >
          <MonolithCard className="p-10 border-white/10 bg-[#0A0A0A] w-full relative overflow-hidden group">
             <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] opacity-20" />
             <div className="absolute top-0 right-0 w-64 h-64 blur-[80px] opacity-10 pointer-events-none" style={{ backgroundColor: lesson.theme }} />
             
             <div className="flex flex-col md:flex-row gap-8 relative z-10">
                <div className="flex-1 space-y-4">
                   <div className="text-[8px] font-black uppercase tracking-[0.4em]" style={{ color: lesson.theme }}>VERIFIED_CASE_STUDY</div>
                   <p className="text-lg text-white/80 leading-relaxed font-mono">{scene.example}</p>
                </div>
                <div className="w-full md:w-64 border-t md:border-t-0 md:border-l border-white/10 pt-6 md:pt-0 md:pl-6 flex flex-col justify-center space-y-4">
                   <div className="text-[7px] font-black uppercase tracking-widest text-white/30">REF_ID</div>
                   <div className="text-sm font-mono" style={{ color: lesson.theme }}>{Math.random().toString(36).substring(2, 10).toUpperCase()}</div>
                   <div className="text-[7px] font-black uppercase tracking-widest text-white/30 pt-4">STATUS</div>
                   <div className="text-xs font-bold uppercase tracking-wide text-[#F0B90B]">VERIFIED</div>
                </div>
             </div>
          </MonolithCard>
       </motion.div>

       <div className="pt-6 w-full max-w-4xl flex justify-end">
          <SovereignButton onClick={onNext} className="px-10 py-4 text-[10px]">APPLY_SYNCHRONIZATION <ArrowRight size={12} /></SovereignButton>
       </div>
    </div>
  );
}

function MistakeScene({ scene, lesson, onNext }: any) {
  return (
    <div className="w-full min-h-[60vh] flex flex-col items-center justify-center space-y-12 py-10">
       <div className="text-center space-y-4 max-w-2xl">
          <div className="text-[10px] font-black uppercase tracking-[0.8em] text-red-500/50">SYSTEMIC_VULNERABILITY</div>
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic text-white/90">
             {scene.title}
          </h2>
          <p className="text-lg text-white/40 italic font-mono leading-relaxed">
             {scene.content}
          </p>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl items-center relative">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black border border-white/10 z-20 flex items-center justify-center hidden md:flex">
             <ArrowRight size={16} className="text-white/30" />
          </div>

          <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
             <MonolithCard className="p-10 border-red-500/20 bg-red-500/[0.02] h-full flex flex-col justify-between group">
                <div className="mb-8 flex items-center justify-between">
                   <div className="text-[9px] font-black uppercase tracking-widest text-red-500">ERROR_STATE</div>
                   <XCircle className="text-red-500/50" size={24} />
                 </div>
                 <p className="text-base text-red-100/60 italic leading-relaxed font-mono">{scene.mistake?.bad}</p>
              </MonolithCard>
          </motion.div>

          <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
             <MonolithCard className="p-10 h-full flex flex-col justify-between group relative overflow-hidden" style={{ borderColor: `${lesson.theme}30`, backgroundColor: `${lesson.theme}05` }}>
                <div className="absolute inset-0 bg-gradient-to-br to-transparent opacity-10 pointer-events-none" style={{ backgroundImage: `linear-gradient(to bottom right, ${lesson.theme}, transparent)` }} />
                <div className="mb-8 flex items-center justify-between relative z-10">
                   <div className="text-[9px] font-black uppercase tracking-widest" style={{ color: lesson.theme }}>OPTIMIZED_PROTOCOL</div>
                   <CheckCircle2 size={24} style={{ color: lesson.theme }} />
                </div>
                 <p className="text-base text-white/80 italic leading-relaxed font-mono relative z-10">{scene.mistake?.good}</p>
              </MonolithCard>
          </motion.div>
       </div>

       <div className="pt-8">
          <SovereignButton onClick={onNext} className="px-10 py-4 text-[10px]">ARCHITECTURAL_PROOF <ArrowRight size={12} /></SovereignButton>
       </div>
    </div>
  );
}


function QuizScene({ scene, lesson, onNext, onAnswer }: any) {

  const [selected, setSelected] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    if (selected === null) return;
    const isCorrect = selected === scene.quiz.correctIndex;
    setIsSubmitted(true);
    onAnswer(selected, isCorrect);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-10 py-10">
       <div className="text-center space-y-3">
          <div className="text-[9px] font-black uppercase tracking-[0.8em] italic" style={{ color: lesson.theme }}>COGNITIVE_VERIFICATION</div>
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter italic text-white/90">{scene.quiz.question}</h2>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {scene.quiz.options.map((option: string, i: number) => (
             <button
               key={i}
               disabled={isSubmitted}
               onClick={() => setSelected(i)}
               className={`p-5 border text-left transition-all duration-500 relative group ${
                 isSubmitted 
                  ? i === scene.quiz.correctIndex 
                    ? `border-white/10 bg-white/[0.02]` 
                    : i === selected 
                      ? "border-red-500/30 bg-red-500/[0.02]" 
                      : "border-white/5 opacity-20"
                  : selected === i 
                    ? `bg-white/[0.05]` 
                    : "border-white/5 bg-white/[0.01] hover:border-white/10"
               }`}
               style={{
                  borderColor: isSubmitted && i === scene.quiz.correctIndex ? lesson.theme : selected === i ? lesson.theme : undefined
               }}
             >
                <div className="flex gap-4 items-center">
                   <div className={`w-1.5 h-1.5 ${selected === i ? "shadow-[0_0_10px_rgba(255,255,255,0.8)]" : "bg-white/10"}`} style={{ backgroundColor: selected === i ? lesson.theme : undefined }} />
                   <div className="text-[12px] font-mono italic text-white/40 group-hover:text-white/70 transition-colors">{option}</div>
                </div>
                {isSubmitted && i === scene.quiz.correctIndex && (
                   <div className="absolute top-2 right-2"><CheckCircle2 size={12} style={{ color: lesson.theme }} /></div>
                )}
             </button>
          ))}
       </div>

       {isSubmitted && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 border border-white/5 bg-white/[0.01] space-y-3"
          >
             <div className="flex items-center gap-3">
                <HelpCircle size={14} className="text-white/20" />
                <span className="text-[8px] font-black uppercase tracking-widest text-white/20">LOGICAL_ANALYSIS</span>
             </div>
             <p className="text-[12px] text-white/30 italic leading-relaxed font-mono">{scene.quiz.explanation}</p>
             <SovereignButton onClick={onNext} className="px-10 py-4 text-[10px] mt-4">PROCEED_TO_GLOBAL_SYNC <ArrowRight size={12} /></SovereignButton>
          </motion.div>
       )}

       {!isSubmitted && (
          <div className="flex justify-center pt-6">
             <SovereignButton 
               disabled={selected === null}
               onClick={handleSubmit} 
               className="px-10 py-4 text-[10px]"
             >
                VERIFY_ANSWER <ArrowRight size={14} />
             </SovereignButton>
          </div>
       )}
    </div>
  );
}

function CompletionScene({ scene, lesson, onNext }: any) {
  return (
    <div className="flex flex-col items-center text-center space-y-12 max-w-5xl mx-auto py-10">
       <VisualWrapper lesson={lesson}>
          <div className="w-24 h-24 rounded-full border flex items-center justify-center bg-white/[0.03] relative overflow-hidden group" style={{ borderColor: `${lesson.theme}40`, boxShadow: `0 0 50px ${lesson.theme}20` }}>
             <motion.div
               animate={{ scale: [1, 1.05, 1] }}
               transition={{ duration: 4, repeat: Infinity }}
             >
                <CheckCircle2 size={40} style={{ color: lesson.theme }} />
             </motion.div>
             <div className="absolute inset-0 bg-gradient-to-t to-transparent opacity-20" style={{ backgroundImage: `linear-gradient(to top, ${lesson.theme}40, transparent)` }} />
          </div>
       </VisualWrapper>
       
       <div className="space-y-4">
          <motion.div
             initial={{ opacity: 0, letterSpacing: "1em" }}
             animate={{ opacity: 1, letterSpacing: "0.6em" }}
             className="text-[9px] font-black uppercase italic"
             style={{ color: lesson.theme }}
          >
             PROTOCOL_SYNCHRONIZATION_COMPLETE
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic leading-none text-white/90 drop-shadow-xl">
             {scene.title}
          </h1>
          <p className="text-base md:text-lg text-white/20 italic font-mono max-w-2xl mx-auto leading-relaxed">
             {scene.content}
          </p>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
           {scene.summaryPoints?.map((point: string, i: number) => (
             <motion.div
               key={i}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.3 + (i * 0.1) }}
             >
                 <MonolithCard className="p-6 border-white/5 bg-white/[0.01] hover:border-white/10 transition-all h-full text-left group relative overflow-hidden">
                    <div className="text-[8px] font-black mb-4 transition-colors tracking-[0.4em]" style={{ color: `${lesson.theme}80` }}>KEY_TAKEAWAY_0{i+1}</div>
                    <div className="text-[11px] font-mono text-white/40 italic leading-relaxed group-hover:text-white/70 transition-colors">{point}</div>
                    <div className="absolute bottom-0 left-0 h-[1px] w-0 group-hover:w-full transition-all duration-700" style={{ backgroundColor: lesson.theme }} />
                 </MonolithCard>
              </motion.div>
           ))}
       </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="pt-8"
        >
            <SovereignButton onClick={onNext} className="px-12 py-5 text-xs bg-[#F0B90B] text-black hover:bg-[#F8D33A] transition-all border-none font-bold rounded-xl shadow-[0_0_24px_rgba(240,185,11,0.2)]">
               INITIATE_NEXT_STAGE <ArrowRight size={14} />
            </SovereignButton>
        </motion.div>
     </div>
  );
}
