"use client";

import React, { useState, useEffect } from "react";
import { motion, MotionValue, useTransform } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowRight, Terminal, Cpu, Activity, ShieldAlert } from "lucide-react";
import { CinematicAuth } from "@/components/auth/CinematicAuth";

// Helper to calculate opacity based on the scene index
const useSceneOpacity = (progress: MotionValue<number>, index: number) => {
  const center = index / 8;
  const spread = 0.08; // width of the fade
  return useTransform(progress, [center - spread, center, center + spread], [0, 1, 0]);
};

// Helper for enter/exit translation y
const useSceneY = (progress: MotionValue<number>, index: number) => {
  const center = index / 8;
  const spread = 0.08;
  return useTransform(progress, [center - spread, center, center + spread], [50, 0, -50]);
};

// Wrapper for all absolute scenes
const SceneContainer = ({ opacity, children }: { opacity: MotionValue<number>, children: React.ReactNode }) => {
  const [isActive, setIsActive] = useState(false);
  
  useEffect(() => {
    return opacity.on("change", (v) => setIsActive(v > 0.01));
  }, [opacity]);

  return (
    <motion.section 
      style={{ opacity }} 
      className={`absolute inset-0 h-screen w-full flex items-center justify-center ${isActive ? 'pointer-events-auto' : 'pointer-events-none'}`}
    >
      {children}
    </motion.section>
  );
};

// --- SCENE 0: THE VOID ---
export const VoidScene = ({ scrollProgress }: { scrollProgress: MotionValue<number> }) => {
  const opacity = useSceneOpacity(scrollProgress, 0);
  const y = useSceneY(scrollProgress, 0);

  return (
    <SceneContainer opacity={opacity}>
      <motion.div style={{ y }} className="flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-4xl md:text-6xl font-light tracking-widest text-zinc-400">
          Молияи муосир <span className="text-white font-medium">истеъмолкунандагонро</span> месозад.
        </h1>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mt-12 text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500">
          VANTAGE <span className="text-[#F0B90B]">операторҳои соҳибихтиёрро</span> месозад.
        </h1>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-12 flex flex-col items-center gap-2 text-zinc-500 font-mono text-xs tracking-widest uppercase"
        >
          <span>Барои омӯзиши платформа ба поён ҳаракат кунед</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-zinc-500 to-transparent"></div>
        </motion.div>
      </motion.div>
    </SceneContainer>
  );
};

// --- SCENE 1: MARKET CHAOS ---
export const ChaosScene = ({ scrollProgress }: { scrollProgress: MotionValue<number> }) => {
  const opacity = useSceneOpacity(scrollProgress, 1);
  const scale = useTransform(scrollProgress, [1/7 - 0.08, 1/7, 1/7 + 0.08], [0.9, 1, 1.1]);

  return (
    <SceneContainer opacity={opacity}>
      <motion.div style={{ scale }} className="text-center">
        <p className="text-3xl text-red-500 font-mono mb-2 uppercase tracking-widest flex items-center justify-center gap-3">
          <ShieldAlert className="w-8 h-8" />
          Маълумот дар ҳама ҷост.
        </p>
        <p className="text-5xl font-black text-white tracking-tighter uppercase mt-4">Аммо зеҳни ҳақиқӣ нодир аст.</p>
      </motion.div>
    </SceneContainer>
  );
};

// --- SCENE 2: VANTAGE AWAKENING ---
export const AwakeningScene = ({ scrollProgress }: { scrollProgress: MotionValue<number> }) => {
  const opacity = useSceneOpacity(scrollProgress, 2);
  const y = useSceneY(scrollProgress, 2);

  return (
    <SceneContainer opacity={opacity}>
      <motion.div style={{ y }} className="flex flex-col items-center gap-4">
        <div className="w-24 h-24 mb-8 border border-[#F0B90B] flex items-center justify-center shadow-[0_0_50px_rgba(240,185,11,0.3)] bg-[#F0B90B]/10 backdrop-blur-md relative overflow-hidden group">
          <div className="absolute inset-0 bg-[#F0B90B] opacity-20 group-hover:opacity-40 transition-opacity"></div>
          <Cpu className="text-[#F0B90B] w-12 h-12 relative z-10" />
        </div>
        <h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase drop-shadow-[0_0_30px_rgba(240,185,11,0.3)] text-white">Vantage</h2>
        <div className="flex gap-4 md:gap-6 mt-6 font-mono text-xs md:text-sm tracking-widest text-[#F0B90B] opacity-80 flex-wrap justify-center">
          <span>ЗЕҲНИ СОҲИБИХТИЁР</span>
          <span className="hidden md:inline">//</span>
          <span>СИМУЛЯТСИЯИ САНОАТӢ</span>
          <span className="hidden md:inline">//</span>
          <span>ШАФФОФИЯТИ КУЛЛӢ</span>
        </div>
      </motion.div>
    </SceneContainer>
  );
};

// --- SCENE 3: INTEL CORE ENGINE ---
export const IntelScene = ({ scrollProgress }: { scrollProgress: MotionValue<number> }) => {
  const opacity = useSceneOpacity(scrollProgress, 3);
  const x = useTransform(scrollProgress, [3/8 - 0.08, 3/8, 3/8 + 0.08], [-50, 0, 50]);

  return (
    <SceneContainer opacity={opacity}>
      <motion.div style={{ x }} className="w-full flex justify-start px-8 md:px-32">
        <div className="max-w-2xl border-l-2 border-[#F0B90B] pl-8 bg-[#1E2026]/80 p-8 backdrop-blur-sm">
          <p className="text-[#F0B90B] font-mono mb-4 text-sm tracking-widest flex items-center gap-2">
            <Activity className="w-4 h-4" />
            01 / ҲАСТАИ ДИДБОН
          </p>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-6 uppercase text-white">ФАРМОНДЕҲИИ МУТЛАҚ.</h2>
          <p className="text-lg md:text-xl text-zinc-400 font-light leading-relaxed">
            Индексиатсияи мутамаркази сармоя. Харитасозии мустақими тақсимоти нақд. Дастрасӣ ба арзёбии воқеии хавфҳои портфел, ки тавассути Gemini AI тавлид мешавад.
          </p>
        </div>
      </motion.div>
    </SceneContainer>
  );
};

// --- SCENE 4: MATRIX TRADING ---
export const MarketScene = ({ scrollProgress }: { scrollProgress: MotionValue<number> }) => {
  const opacity = useSceneOpacity(scrollProgress, 4);
  const x = useTransform(scrollProgress, [4/8 - 0.08, 4/8, 4/8 + 0.08], [50, 0, -50]);

  return (
    <SceneContainer opacity={opacity}>
      <motion.div style={{ x }} className="w-full flex justify-end px-8 md:px-32">
        <div className="max-w-2xl text-right border-r-2 border-[#F0B90B] pr-8 bg-[#1E2026]/80 p-8 backdrop-blur-sm">
          <p className="text-[#F0B90B] font-mono mb-4 text-sm tracking-widest justify-end flex items-center gap-2">
            02 / МАТРИТСАИ САВДО
            <Cpu className="w-4 h-4" />
          </p>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-6 uppercase text-white">АРБИТРАЖИ СЕРИЛТИҶОРАТ.</h2>
          <p className="text-lg md:text-xl text-zinc-400 font-light leading-relaxed">
            Харид ва фурӯши дороиҳои рақамии криптографии тағйирёбанда ба монанди Bitcoin, Ethereum ва Solana дар терминали савдои воқеӣ бо нишондиҳандаҳои автоматӣ.
          </p>
        </div>
      </motion.div>
    </SceneContainer>
  );
};

// --- SCENE 5: EMPIRE ENGINE ---
export const EmpireScene = ({ scrollProgress }: { scrollProgress: MotionValue<number> }) => {
  const opacity = useSceneOpacity(scrollProgress, 5);
  const x = useTransform(scrollProgress, [5/8 - 0.08, 5/8, 5/8 + 0.08], [-50, 0, 50]);

  return (
    <SceneContainer opacity={opacity}>
      <motion.div style={{ x }} className="w-full flex justify-start px-8 md:px-32">
        <div className="max-w-2xl border-l-2 border-[#F0B90B] pl-8 bg-[#1E2026]/80 p-8 backdrop-blur-sm">
          <p className="text-[#F0B90B] font-mono mb-4 text-sm tracking-widest flex items-center gap-2">
            <Activity className="w-4 h-4" />
            03 / АМАЛИЁТИ ИМПЕРИЯ
          </p>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-6 uppercase text-white">СИМУЛЯТСИЯИ ХУДРО ИДОРА КУНЕД.</h2>
          <p className="text-lg md:text-xl text-zinc-400 font-light leading-relaxed">
            Стартапҳои SaaS, гиреҳҳои DeFi, лоиҳаҳои PropTech ва кластерҳои AI-ро ба даст оред. Параметрҳои мураккаби амалиётиро барои афзоиши даромад идора кунед.
          </p>
        </div>
      </motion.div>
    </SceneContainer>
  );
};

// --- SCENE 6: FEDERAL RESERVES ---
export const BankScene = ({ scrollProgress }: { scrollProgress: MotionValue<number> }) => {
  const opacity = useSceneOpacity(scrollProgress, 6);
  const x = useTransform(scrollProgress, [6/8 - 0.08, 6/8, 6/8 + 0.08], [50, 0, -50]);

  return (
    <SceneContainer opacity={opacity}>
      <motion.div style={{ x }} className="w-full flex justify-end px-8 md:px-32">
        <div className="max-w-2xl text-right border-r-2 border-[#F0B90B] pr-8 bg-[#1E2026]/80 p-8 backdrop-blur-sm">
          <p className="text-[#F0B90B] font-mono mb-4 text-sm tracking-widest justify-end flex items-center gap-2">
            04 / ЗАХИРАИ МАРКАЗӢ
            <Cpu className="w-4 h-4" />
          </p>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-6 uppercase text-white">БОНКДОРИИ ЗАХИРАВӢ.</h2>
          <p className="text-lg md:text-xl text-zinc-400 font-light leading-relaxed">
            Ифтитоҳи хатҳои кредитии фаъол, ки аз ҷониби мудири хавфи Gemini AI тасдиқ мешаванд. Маблағҳоро дар хазина бо фоидаи 5.5% барои як моҳ захира намоед.
          </p>
        </div>
      </motion.div>
    </SceneContainer>
  );
};

// --- SCENE 7: COGNITIVE ACADEMY ---
export const AcademyScene = ({ scrollProgress }: { scrollProgress: MotionValue<number> }) => {
  const opacity = useSceneOpacity(scrollProgress, 7);
  const y = useSceneY(scrollProgress, 7);

  return (
    <SceneContainer opacity={opacity}>
      <motion.div style={{ y }} className="text-center max-w-4xl bg-[#1E2026]/80 p-12 backdrop-blur-md border border-[#F0B90B]/10 rounded-sm mx-8">
        <p className="text-[#F0B90B] font-mono mb-4 text-sm tracking-widest uppercase">05 / АКАДЕМИЯИ ТАҲТИ AI</p>
        <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 uppercase text-white">ТАВАССУТИ АМАЛ ОМӮЗЕД.</h2>
        <p className="text-xl md:text-2xl text-zinc-400 font-light leading-relaxed mx-auto">
          Супоришҳои молиявиро аз савдои крипто то бонкдорӣ иҷро кунед, дар ҳоле ки муаллими инфиродии Gemini AI ба шумо дар вақти воқеӣ маслиҳат медиҳад.
        </p>
      </motion.div>
    </SceneContainer>
  );
};

// --- SCENE 8: GATEWAY ---
export const GatewayScene = ({ scrollProgress }: { scrollProgress: MotionValue<number> }) => {
  const center = 8 / 8;
  const spread = 0.08;
  const opacity = useTransform(scrollProgress, [center - spread, center], [0, 1]);
  const y = useTransform(scrollProgress, [center - spread, center], [50, 0]);

  return (
    <SceneContainer opacity={opacity}>
      <div className="absolute inset-0 bg-[#0B0E11]/85 backdrop-blur-xl pointer-events-none" />
      <motion.div 
        style={{ y }}
        className="z-10 mx-8 w-full flex justify-center"
      >
        <div className="pointer-events-auto w-full flex justify-center">
          <CinematicAuth />
        </div>
      </motion.div>
    </SceneContainer>
  );
};
