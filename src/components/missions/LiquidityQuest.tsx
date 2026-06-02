"use client";

import React, { useState } from "react";
import { useVantageStore } from "@/store/useVantageStore";
import { motion, AnimatePresence } from "framer-motion";
import { X, Wallet, AlertTriangle, CheckCircle2 } from "lucide-react";

interface MissionModalProps {
  onClose: () => void;
}

export function LiquidityQuest({ onClose }: MissionModalProps) {
  const [step, setStep] = useState(1);
  const [budget, setBudget] = useState(1000);
  const { completeMission } = useVantageStore();

  const handleChoice = (cost: number) => {
    const newBudget = budget - cost;
    setBudget(newBudget);
    if (step < 3) {
      setStep(step + 1);
    } else {
      setStep(4);
      if (newBudget > 0) {
        completeMission("liquidity-quest", 100, 50);
      }
    }
  };

  const budgetPct = Math.max(0, (budget / 1000) * 100);
  const isLow = budget < 200;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0B0E11]/90 backdrop-blur-xl p-4"
    >
      <motion.div 
        initial={{ scale: 0.96, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-[#1E2026] border border-[#2B2F36] max-w-lg w-full rounded-2xl p-8 relative overflow-hidden"
      >
        {/* Progress bar */}
        <div className="absolute top-0 left-0 w-full h-[3px] bg-[#2B2F36]">
          <motion.div 
            className="h-full bg-[#F0B90B]"
            initial={{ width: "0%" }}
            animate={{ width: `${(step / 4) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>

        <button onClick={onClose} className="absolute top-5 right-5 text-[#848E9C] hover:text-[#EAECEF] transition-colors">
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-4 mb-6 pt-2">
          <div className="w-12 h-12 rounded-xl bg-[#F0B90B]/10 flex items-center justify-center text-[#F0B90B] border border-[#F0B90B]/20">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#EAECEF] uppercase tracking-tight">Liquidity Quest</h3>
            <p className="text-[10px] text-[#848E9C] uppercase tracking-widest font-semibold mt-0.5">Mission: Save the School Club</p>
          </div>
        </div>

        {/* Budget indicator */}
        <div className="mb-6 p-4 rounded-xl bg-[#2B2F36] border border-[#474D57]">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs text-[#848E9C] uppercase font-semibold tracking-wider">Cash Flow</span>
            <span className={`text-lg font-mono font-bold ${isLow ? "text-[#F6465D]" : "text-[#F0B90B]"}`}>
              ${budget}
            </span>
          </div>
          <div className="w-full h-1.5 bg-[#1E2026] rounded-full overflow-hidden">
            <motion.div 
              className={`h-full rounded-full ${isLow ? "bg-[#F6465D]" : "bg-[#F0B90B]"}`}
              animate={{ width: `${budgetPct}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} className="space-y-4">
              <p className="text-sm text-[#848E9C] leading-relaxed border-l-2 border-[#F0B90B]/30 pl-4">
                Scenario: Your school entrepreneurship club needs to host a showcase event. You have $1,000 in liquid capital. What is your first move?
              </p>
              <div className="grid gap-2.5">
                <button onClick={() => handleChoice(800)} className="w-full p-4 rounded-xl bg-[#2B2F36] border border-[#474D57] hover:border-[#F6465D]/50 hover:bg-[#F6465D]/5 transition-all text-left group">
                  <div className="text-sm font-bold text-[#EAECEF] group-hover:text-[#F6465D] mb-1">Rent a luxury hotel ballroom ($800)</div>
                  <div className="text-xs text-[#848E9C]">High prestige but high risk of illiquidity.</div>
                </button>
                <button onClick={() => handleChoice(200)} className="w-full p-4 rounded-xl bg-[#2B2F36] border border-[#474D57] hover:border-[#F0B90B]/50 hover:bg-[#F0B90B]/5 transition-all text-left group">
                  <div className="text-sm font-bold text-[#EAECEF] group-hover:text-[#F0B90B] mb-1">Use the school gym ($200)</div>
                  <div className="text-xs text-[#848E9C]">Practical, preserves capital reserves.</div>
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} className="space-y-4">
              <p className="text-sm text-[#848E9C] leading-relaxed border-l-2 border-[#F0B90B]/30 pl-4">
                The catering service requests an upfront payment. What do you do?
              </p>
              <div className="grid gap-2.5">
                <button onClick={() => handleChoice(500)} className="w-full p-4 rounded-xl bg-[#2B2F36] border border-[#474D57] hover:border-[#F6465D]/50 hover:bg-[#F6465D]/5 transition-all text-left group">
                  <div className="text-sm font-bold text-[#EAECEF] group-hover:text-[#F6465D] mb-1">Pay in full to secure a discount ($500)</div>
                  <div className="text-xs text-[#848E9C]">Saves money in the long run, but reduces short-term liquidity.</div>
                </button>
                <button onClick={() => handleChoice(300)} className="w-full p-4 rounded-xl bg-[#2B2F36] border border-[#474D57] hover:border-[#F0B90B]/50 hover:bg-[#F0B90B]/5 transition-all text-left group">
                  <div className="text-sm font-bold text-[#EAECEF] group-hover:text-[#F0B90B] mb-1">Pay a 30% deposit ($300)</div>
                  <div className="text-xs text-[#848E9C]">Higher total cost, but preserves cash buffers.</div>
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} className="space-y-4">
              <p className="text-sm text-[#848E9C] leading-relaxed border-l-2 border-[#F0B90B]/30 pl-4">
                Final Step: Marketing! How do you reach your target audience?
              </p>
              <div className="grid gap-2.5">
                <button onClick={() => handleChoice(400)} className="w-full p-4 rounded-xl bg-[#2B2F36] border border-[#474D57] hover:border-[#F6465D]/50 hover:bg-[#F6465D]/5 transition-all text-left group">
                  <div className="text-sm font-bold text-[#EAECEF] group-hover:text-[#F6465D] mb-1">Paid ad campaign ($400)</div>
                  <div className="text-xs text-[#848E9C]">Guarantees reach, but drains cash.</div>
                </button>
                <button onClick={() => handleChoice(0)} className="w-full p-4 rounded-xl bg-[#2B2F36] border border-[#474D57] hover:border-[#F0B90B]/50 hover:bg-[#F0B90B]/5 transition-all text-left group">
                  <div className="text-sm font-bold text-[#EAECEF] group-hover:text-[#F0B90B] mb-1">Organic social media campaign ($0)</div>
                  <div className="text-xs text-[#848E9C]">Free, but requires more creative effort.</div>
                </button>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="finish" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4 space-y-5">
              {budget >= 0 ? (
                <>
                  <div className="w-20 h-20 rounded-2xl bg-[#F0B90B]/15 flex items-center justify-center text-[#F0B90B] mx-auto">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-extrabold text-[#EAECEF] uppercase tracking-tight mb-2">Mission Completed Successfully!</h4>
                    <p className="text-sm text-[#848E9C]">You managed the club's liquidity perfectly. The showcase was a massive success!</p>
                  </div>
                  <div className="flex gap-3 justify-center">
                    <div className="px-4 py-2 rounded-lg bg-[#F0B90B]/10 border border-[#F0B90B]/20 text-[#F0B90B] text-xs font-bold">+100 XP</div>
                    <div className="px-4 py-2 rounded-lg bg-[#F0B90B]/10 border border-[#F0B90B]/20 text-[#F0B90B] text-xs font-bold">+50 Influence</div>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-20 h-20 rounded-2xl bg-[#F6465D]/15 flex items-center justify-center text-[#F6465D] mx-auto">
                    <AlertTriangle className="w-10 h-10" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-extrabold text-[#EAECEF] uppercase tracking-tight mb-2">Bankruptcy!</h4>
                    <p className="text-sm text-[#848E9C]">Your club ran out of cash before the event could start. Monitor your liquidity threshold next time!</p>
                  </div>
                </>
              )}
              <button onClick={onClose} className="w-full py-3.5 rounded-xl bg-[#F0B90B] text-black font-bold uppercase tracking-wider hover:bg-[#F8D33A] transition-colors">
                Return to Terminal
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
