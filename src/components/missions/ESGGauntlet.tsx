"use client";

import React, { useState } from "react";
import { useVantageStore } from "@/store/useVantageStore";
import { motion, AnimatePresence } from "framer-motion";
import { X, Leaf, Sparkles, AlertCircle, BarChart3, Globe } from "lucide-react";
import { generateSynapseResponse } from "@/services/aiOracle";

declare var pendo: any;

interface MissionModalProps {
  onClose: () => void;
}

async function getButterflyInsight(choiceText: string, profit: number, impact: number) {
  try {
    const prompt = `ESG Business Choice: "${choiceText}". Current Profit: ${profit}%, Social Impact: ${impact}%. Provide a brief, single-paragraph cyber-strategist risk audit of this dynamic.`;
    return await generateSynapseResponse(prompt, 100);
  } catch (e) {
    return "The sovereign nodes confirm the trade. Your profile is updating.";
  }
}

export function ESGGauntlet({ onClose }: MissionModalProps) {
  const [step, setStep] = useState(1);
  const [profit, setProfit] = useState(100);
  const [impact, setImpact] = useState(100);
  const [aiAnalysis, setAiAnalysis] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { completeMission } = useVantageStore();

  const handleChoice = async (pChange: number, iChange: number, choiceText: string) => {
    const newProfit = Math.max(0, profit + pChange);
    const newImpact = Math.max(0, impact + iChange);
    setProfit(newProfit);
    setImpact(newImpact);
    
    setIsAnalyzing(true);
    try {
      const insight = await getButterflyInsight(choiceText, newProfit, newImpact);
      setAiAnalysis(insight);
    } catch (e) {
      setAiAnalysis("The oracle is clouded, but your choice has been felt.");
    } finally {
      setIsAnalyzing(false);
    }

    if (step < 3) {
      setStep(step + 1);
    } else {
      setStep(4);
      if (newImpact > 120) {
        completeMission("esg-gauntlet", 250, 200);
      }
      if (typeof pendo !== "undefined") {
        pendo.track("esg_gauntlet_completed", {
          finalProfit: newProfit,
          finalImpact: newImpact,
          passed: newImpact > 120,
          title: newImpact > 120 ? "Legendary Entrepreneur" : "Profit Monger"
        });
      }
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0B0E11]/90 backdrop-blur-xl p-4">
      <motion.div initial={{ scale: 0.96, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-[#1E2026] border border-[#2B2F36] max-w-2xl w-full rounded-2xl p-8 sm:p-10 relative overflow-hidden">
        
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-[3px] bg-[#2B2F36]">
          <motion.div className="h-full bg-[#F0B90B]" initial={{ width: "0%" }} animate={{ width: `${(step / 4) * 100}%` }} transition={{ duration: 0.4 }} />
        </div>

        <button onClick={onClose} className="absolute top-5 right-5 text-[#848E9C] hover:text-[#EAECEF] transition-colors">
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-4 mb-8 pt-2">
          <div className="w-12 h-12 rounded-xl bg-[#F0B90B]/10 flex items-center justify-center text-[#F0B90B] border border-[#F0B90B]/20">
            <Leaf className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#EAECEF] uppercase tracking-tight">ESG Gauntlet</h3>
            <p className="text-[10px] text-[#848E9C] uppercase tracking-widest font-semibold">Mission: Ethical Capital Optimization</p>
          </div>
        </div>

        {/* Stats Panel */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <div className="p-4 rounded-xl bg-[#2B2F36] border border-[#474D57]">
            <div className="flex items-center gap-2 mb-2 text-[#848E9C]">
              <BarChart3 className="w-3.5 h-3.5" />
              <span className="text-[10px] uppercase font-semibold tracking-widest">Profit Potential</span>
            </div>
            <div className="text-2xl font-bold font-mono text-[#EAECEF]">{profit}%</div>
          </div>
          <div className="p-4 rounded-xl bg-[#2B2F36] border border-[#474D57]">
            <div className="flex items-center gap-2 mb-2 text-[#848E9C]">
              <Globe className="w-3.5 h-3.5" />
              <span className="text-[10px] uppercase font-semibold tracking-widest">Social Impact</span>
            </div>
            <div className="text-2xl font-bold font-mono text-[#F0B90B]">{impact}%</div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step <= 3 ? (
            <motion.div key={`step-${step}`} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} className="space-y-5">
              <p className="text-base text-[#EAECEF] font-medium leading-relaxed border-l-2 border-[#F0B90B]/40 pl-4">
                {step === 1 && "Scenario: A tech giant offers a massive contract, but they are known for poor worker conditions. Do you accept?"}
                {step === 2 && "A local green-energy startup needs funding. It's high risk but could change the community. Do you invest?"}
                {step === 3 && "Market Crash! Your ethical stocks are diving. Do you sell them for 'Stable' but dirty oil stocks?"}
              </p>

              <div className="grid gap-3">
                <button 
                  onClick={() => handleChoice(step === 1 ? 50 : step === 2 ? -20 : -40, step === 1 ? -40 : step === 2 ? 60 : 50, "Aggressive Growth Choice")}
                  className="w-full p-4 rounded-xl bg-[#2B2F36] border border-[#474D57] hover:border-[#F0B90B]/50 hover:bg-[#F0B90B]/5 transition-all text-left group"
                >
                  <div className="text-sm font-bold text-[#EAECEF] group-hover:text-[#F0B90B] transition-colors">
                    {step === 1 && "Accept for Profit (+50% P, -40% I)"}
                    {step === 2 && "Full Investment (-20% P, +60% I)"}
                    {step === 3 && "Hold Ethical Position (-40% P, +50% I)"}
                  </div>
                </button>
                <button 
                  onClick={() => handleChoice(step === 1 ? -10 : step === 2 ? 10 : 30, step === 1 ? 20 : step === 2 ? -20 : -50, "Stable/Dirty Choice")}
                  className="w-full p-4 rounded-xl bg-[#2B2F36] border border-[#474D57] hover:border-[#F6465D]/50 hover:bg-[#F6465D]/5 transition-all text-left group"
                >
                  <div className="text-sm font-bold text-[#EAECEF] group-hover:text-[#F6465D] transition-colors">
                    {step === 1 && "Decline for Ethics (-10% P, +20% I)"}
                    {step === 2 && "Low Risk Loan (+10% P, -20% I)"}
                    {step === 3 && "Switch to Oil (+30% P, -50% I)"}
                  </div>
                </button>
              </div>

              {/* AI Oracle Feedback */}
              <div className="flex gap-3 p-4 rounded-xl bg-[#F0B90B]/5 border border-[#F0B90B]/15 min-h-[70px] items-start">
                 <div className="shrink-0 mt-0.5">
                    {isAnalyzing
                      ? <Sparkles className="w-4 h-4 text-[#F0B90B] animate-pulse" />
                      : <BrainIcon className="w-4 h-4 text-[#F0B90B]" />
                    }
                 </div>
                 <div className="text-xs text-[#848E9C] leading-relaxed">
                   {isAnalyzing ? "The Oracle is calculating the ripple effect..." : aiAnalysis || "Make a choice to see the Oracle's judgment."}
                 </div>
              </div>
            </motion.div>
          ) : (
            <motion.div key="finish" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4 space-y-6">
              <div className={`w-20 h-20 rounded-2xl mx-auto flex items-center justify-center ${impact > 120 ? 'bg-[#F0B90B]/15 text-[#F0B90B]' : 'bg-[#F6465D]/15 text-[#F6465D]'}`}>
                {impact > 120 ? <Sparkles className="w-10 h-10" /> : <AlertCircle className="w-10 h-10" />}
              </div>
              <div>
                <h4 className="text-2xl font-extrabold text-[#EAECEF] uppercase tracking-tight mb-2">
                  {impact > 120 ? "Legendary Entrepreneur" : "Profit Monger"}
                </h4>
                <p className="text-sm text-[#848E9C] leading-relaxed max-w-sm mx-auto">
                  {impact > 120 ? "You've proven that social impact can coexist with capital. The future is yours." : "You chose profit over the world. Your impact score has suffered."}
                </p>
              </div>
              <div className="flex gap-3 justify-center">
                 <div className="px-4 py-2 rounded-lg bg-[#F0B90B]/10 border border-[#F0B90B]/20 text-[#F0B90B] text-xs font-bold">+250 XP</div>
                 <div className="px-4 py-2 rounded-lg bg-[#F0B90B]/10 border border-[#F0B90B]/20 text-[#F0B90B] text-xs font-bold">+200 IMPACT</div>
              </div>
              <button onClick={onClose} className="w-full py-3.5 rounded-xl bg-[#F0B90B] text-black font-bold uppercase tracking-wider hover:bg-[#F8D33A] transition-colors">
                Return to Command
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

const BrainIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9.5 2C10.8261 2 12.0979 2.52678 13.0355 3.46447C13.9732 4.40215 14.5 5.67392 14.5 7V11C14.5 12.3261 13.9732 13.5979 13.0355 14.5355C12.0979 15.4732 10.8261 16 9.5 16H8.5V21.5C8.5 21.6326 8.44732 21.7598 8.35355 21.8536C8.25979 21.9473 8.13261 22 8 22H7C6.86739 22 6.74021 21.9473 6.64645 21.8536C6.55268 21.7598 6.5 21.6326 6.5 21.5V16H5.5C4.17392 16 2.90215 15.4732 1.96447 14.5355C1.02678 13.5979 0.5 12.3261 0.5 11V7C0.5 5.67392 1.02678 4.40215 1.96447 3.46447C2.90215 2.52678 4.17392 2 5.5 2H9.5ZM17.5 2C18.8261 2 20.0979 2.52678 21.0355 3.46447C21.9732 4.40215 22.5 5.67392 22.5 7V11C22.5 12.3261 21.9732 13.5979 21.0355 14.5355C20.0979 15.4732 18.8261 16 17.5 16H16.5V21.5C16.5 21.6326 16.4473 21.7598 16.3536 21.8536C16.2598 21.9473 16.1326 22 16 22H15C14.8674 22 14.7402 21.9473 14.6464 21.8536C14.5527 21.7598 14.5 21.6326 14.5 21.5V16H13.5C12.1739 16 10.9021 15.4732 9.96447 14.5355C9.02678 13.5979 8.5 12.3261 8.5 11V7C8.5 5.67392 9.02678 4.40215 9.96447 3.46447C10.9021 2.52678 12.1739 2 13.5 2H17.5Z" fill="currentColor"/>
  </svg>
);
