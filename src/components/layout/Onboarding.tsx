"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Play } from "lucide-react";
import { Asset3D } from "../terminal/Asset3D";
import { Globe3D } from "./Globe3D";

export function Onboarding({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1);

  const slides = [
    {
      id: 1,
      title: "Панели Дидбон",
      desc: "Маркази фармондиҳии шумо. Назорати сармояи умумӣ, маблағҳои озоди нақд ва таҳлили нейронии портфел тавассути AI Google Gemini, ки дар вақти воқеӣ навсозӣ мешавад.",
    },
    {
      id: 2,
      title: "Савдои КРИПТО",
      desc: "Харид ва фурӯши Bitcoin, Ethereum, Solana ва ғайра дар дохили терминали савдо. Нархҳо дар вақти воқеӣ навсозӣ мешаванд. Портфели худро созед ва афзоиши сармояатонро мушоҳида кунед.",
    },
    {
      id: 3,
      title: "Сохтани Империя",
      desc: "Харидани тиҷоратҳои маҷозӣ — стартапҳои SaaS, гиреҳҳои DeFi, ширкатҳои PropTech ва кластерҳои AI. Ҳар яки онҳо даромади ғайрифаъол меоранд. Барои оптимизатсияи даромад аз мушовири Gemini AI истифода баред.",
    },
    {
      id: 4,
      title: "Бонки Захиравӣ",
      desc: "Гирифтани қарз тавассути таҳлили боэътимоди AI. Сарфаҷӯиро дар хазина бо фоидаи 5.5% барои як моҳ захира кунед. Ҳар як қарор дар вақти воқеӣ аз ҷониби муҳаррики Gemini арзёбӣ мешавад.",
    },
    {
      id: 5,
      title: "Академияи AI",
      desc: "Молияи воқеиро тавассути дарсҳои интерактивӣ — крипто, бонкдорӣ ва стратегияи корпоративӣ омӯзед. Муаллими инфиродии Gemini AI дар паҳлӯи шумо буда, ба саволҳо вобаста ба контекст ҷавоб медиҳад.",
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
            animate={{ width: `${(step / 5) * 100}%` }}
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
                    МОДУЛИ {step} АЗ 5
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
              {[1, 2, 3, 4, 5].map((s) => (
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
                   {step === 2 && <Asset3D asset={{ image: "https://assets.coingecko.com/coins/images/1/small/bitcoin.png" }} />}
                   {step === 3 && <Globe3D />}
                   {step === 4 && <Globe3D />}
                   {step === 5 && <Globe3D />}
                 </motion.div>
               </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-[#2B2F36] relative z-20">
          <button
            onClick={onClose}
            className="text-[#848E9C] hover:text-[#EAECEF] transition-colors text-xs font-semibold uppercase tracking-widest py-2"
          >
            Гузаштан →
          </button>
          
          <button 
            onClick={() => step < 5 ? setStep(step + 1) : onClose()}
            className="w-12 h-12 sm:w-14 sm:h-14 bg-[#F0B90B] text-black rounded-xl flex items-center justify-center hover:bg-[#F8D33A] active:scale-95 transition-all shadow-[0_0_20px_rgba(240,185,11,0.2)] group"
          >
            {step < 5
              ? <ChevronRight className="w-5 sm:w-6 h-5 sm:h-6 group-hover:translate-x-0.5 transition-transform" />
              : <Play className="w-5 sm:w-6 h-5 sm:h-6 fill-current" />
            }
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
