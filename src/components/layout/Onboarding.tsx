"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Play } from "lucide-react";
import { Asset3D } from "../terminal/Asset3D";
import { Globe3D } from "./Globe3D";

declare var pendo: any;

export function Onboarding({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1);

  const slides = [
    {
      id: 1,
      title: "Mission: $1,000,000 Net Worth",
      desc: "Start with $100,000 in seed capital. Your goal is to grow your net worth to $1,000,000 through crypto trading, real estate, and business investments. Risk Alert: Avoid bankruptcy ($0 net worth) at all costs. Run your own financial empire and learn real-world money decisions with AI.",
    },
    {
      id: 2,
      title: "Overview Dashboard",
      desc: "Your central command center. Monitor total capital, free cash flow, and real-time neural portfolio audits powered by Google Gemini AI.",
    },
    {
      id: 3,
      title: "Crypto Trading Terminal",
      desc: "Buy and sell Bitcoin, Ethereum, Solana, and more within the trading terminal. Build your portfolio and monitor capital growth in real-time.",
    },
    {
      id: 4,
      title: "Business Investments",
      desc: "Acquire digital businesses: SaaS startups, DeFi nodes, PropTech projects, and AI clusters. Each generates passive income. Consult Gemini AI to optimize your cash flow.",
    },
    {
      id: 5,
      title: "Reserve Banking & Savings",
      desc: "Access credit backed by secure AI risk evaluation. Store your savings in the treasury earning 5.5% monthly yield. Every decision is audited in real-time by the Gemini engine.",
    },
    {
      id: 6,
      title: "AI Financial Advisor",
      desc: "Learn real-world finance through interactive lessons: crypto, banking, and corporate strategy. Your personal Gemini AI advisor sits by your side, answering context-aware questions.",
    }
  ];

  const current = slides[step - 1];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-[#0B0E11]/95 backdrop-blur-xl p-4 sm:p-6 overflow-y-auto"
    >
      <motion.div
        initial={{ scale: 0.95, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-[#1E2026] border border-[#2B2F36] rounded-2xl max-w-5xl w-full p-6 sm:p-14 relative overflow-hidden my-auto"
      >
        {/* Progress bar — Binance yellow */}
        <div className="absolute top-0 left-0 w-full h-[3px] bg-[#2B2F36]">
          <motion.div
            className="h-full bg-[#F0B90B]"
            initial={{ width: "0%" }}
            animate={{ width: `${(step / 6) * 100}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-14 items-center pt-4">
          <div className="space-y-6 sm:space-y-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                className="space-y-5"
              >
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#F0B90B]/10 text-[#F0B90B] border border-[#F0B90B]/20 uppercase tracking-wider">
                    MODULE {step} OF 6
                  </span>
                </div>
                <h3 className="text-2xl sm:text-5xl font-extrabold text-[#EAECEF] leading-tight tracking-tight">{current.title}</h3>
                <p className="text-sm sm:text-base text-[#848E9C] leading-relaxed border-l-2 border-[#F0B90B]/30 pl-4">
                  {current.desc}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Step dots */}
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5, 6].map((s) => (
                <div
                  key={s}
                  className={`h-1 rounded-full transition-all duration-400 ${
                    step === s ? 'w-8 bg-[#F0B90B]' : 'w-2 bg-[#2B2F36]'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Visual */}
          <div className="relative h-[220px] sm:h-[360px] hidden md:block">
            <div className="absolute inset-0 flex items-center justify-center">
               <AnimatePresence mode="wait">
                 <motion.div 
                   key={step}
                   initial={{ opacity: 0, scale: 0.85 }}
                   animate={{ opacity: 1, scale: 1 }}
                   exit={{ opacity: 0, scale: 0.85 }}
                   className="w-full h-full"
                 >
                   {step === 1 && <Globe3D />}
                   {step === 2 && <Globe3D />}
                   {step === 3 && <Asset3D asset={{ image: "https://assets.coingecko.com/coins/images/1/small/bitcoin.png" }} />}
                   {step === 4 && <Globe3D />}
                   {step === 5 && <Globe3D />}
                   {step === 6 && <Globe3D />}
                 </motion.div>
               </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-[#2B2F36] relative z-20">
          <button
            onClick={() => {
              if (typeof pendo !== "undefined") {
                pendo.track("onboarding_skipped", {
                  currentStep: step
                });
              }
              onClose();
            }}
            className="text-[#848E9C] hover:text-[#EAECEF] transition-colors text-xs font-semibold uppercase tracking-widest py-2"
          >
            Skip →
          </button>
          
          <button 
            onClick={() => {
              if (step < 6) {
                setStep(step + 1);
              } else {
                if (typeof pendo !== "undefined") {
                  pendo.track("onboarding_completed", {
                    stepsCompleted: 6,
                    completionMethod: "sequential"
                  });
                }
                onClose();
              }
            }}
            className="w-12 h-12 sm:w-14 sm:h-14 bg-[#F0B90B] text-black rounded-xl flex items-center justify-center hover:bg-[#F8D33A] active:scale-95 transition-all shadow-[0_0_20px_rgba(240,185,11,0.2)] group"
          >
            {step < 6
              ? <ChevronRight className="w-5 sm:w-6 h-5 sm:h-6 group-hover:translate-x-0.5 transition-transform" />
              : <Play className="w-5 sm:w-6 h-5 sm:h-6 fill-current" />
            }
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
