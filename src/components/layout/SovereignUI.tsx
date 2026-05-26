"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";

// Subtle background — Binance style: dark navy with crosshatch grid
export function Scanlines() {
  return null; // Binance is clean — no scanlines
}

export function NeuralField() {
  return (
    <div className="fixed inset-0 -z-10 bg-[#0B0E11]">
       <div className="absolute inset-0 neural-grid" />
       {/* Subtle depth gradient */}
       <div className="absolute inset-0 bg-gradient-to-br from-[#F0B90B]/[0.02] via-transparent to-transparent" />
       <motion.div 
         animate={{ opacity: [0.04, 0.08, 0.04] }} 
         transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
         className="absolute top-0 left-0 w-[600px] h-[400px] bg-[#F0B90B]/5 blur-[140px] rounded-full pointer-events-none" 
       />
       <motion.div 
         animate={{ opacity: [0.03, 0.06, 0.03] }} 
         transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 4 }}
         className="absolute bottom-0 right-0 w-[500px] h-[400px] bg-[#F0B90B]/5 blur-[140px] rounded-full pointer-events-none" 
       />
    </div>
  );
}

// Binance-style flat card
export function MonolithCard({ children, className = "", noScan = false, style }: { children: React.ReactNode, className?: string, noScan?: boolean, style?: React.CSSProperties }) {
  return (
    <div 
      className={`bg-[#1E2026] border border-[#2B2F36] rounded-xl relative overflow-hidden transition-[border-color] duration-200 hover:border-[#474D57] ${className}`} 
      style={style}
    >
       <div className="relative z-10">{children}</div>
    </div>
  );
}

export function DataPulse({ active = true, color = "buy" }: { active?: boolean, color?: string }) {
  const colorMap: Record<string, string> = {
    buy: "#F0B90B",
    sell: "#F6465D",
    bnb: "#F0B90B",
    "cyber-lime": "#F0B90B",
    "cyber-pink": "#F6465D",
    "cyber-violet": "#F0B90B",
  };
  const hex = colorMap[color] ?? "#F0B90B";
  return (
    <div className="relative w-2 h-2">
      <div 
        className={`absolute inset-0 rounded-full ${active ? 'animate-ping opacity-40' : 'opacity-20'}`}
        style={{ backgroundColor: hex }}
      />
      <div 
        className={`absolute inset-0 rounded-full ${active ? 'opacity-100' : 'opacity-40'}`}
        style={{ backgroundColor: hex }}
      />
    </div>
  );
}

export function GlitchText({ text, className = "" }: { text: string, className?: string }) {
  return (
    <div className={`relative inline-block group/glitch ${className}`}>
      <span className="relative z-10">{text}</span>
      <span className="absolute inset-0 text-[#F0B90B]/30 -translate-x-[1px] translate-y-[1px] opacity-0 group-hover/glitch:opacity-100 transition-opacity">{text}</span>
    </div>
  );
}

export function HologramNode({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 80, damping: 30, mass: 1 });
  const mouseYSpring = useSpring(y, { stiffness: 80, damping: 30, mass: 1 });
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["8deg", "-8deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-8deg", "8deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div 
      className="perspective-1000 w-full"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className={`bg-[#1E2026] border border-[#2B2F36] rounded-xl p-6 sm:p-12 relative transition-[border-color] duration-200 hover:border-[#F0B90B]/30 ${className}`}
      >
         <div className="relative z-10 pointer-events-auto">
            {children}
         </div>
      </motion.div>
    </div>
  );
}


export function Typewriter({ text, speed = 30 }: { text: string; speed?: number }) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      setDisplayed(text.slice(0, i));
      i++;
      if (i > text.length) clearInterval(timer);
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);
  return <span>{displayed}</span>;
}

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({ isOpen, title, description, onConfirm, onCancel }: ConfirmModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-[#0B0E11]/70 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="w-full max-w-md bg-[#1E2026] border border-[#474D57] rounded-xl p-8 relative"
          >
             <h3 className="text-lg font-bold text-[#EAECEF] uppercase tracking-wider mb-3">{title}</h3>
             <p className="text-[#848E9C] text-sm mb-8 leading-relaxed">{description}</p>
             <div className="flex gap-3">
                <button onClick={onConfirm} className="flex-1 py-3 bg-[#F0B90B] text-black text-sm font-bold uppercase tracking-wider rounded-lg hover:bg-[#F8D33A] transition-colors">Иҷозат додан</button>
                <button onClick={onCancel} className="flex-1 py-3 bg-[#2B2F36] border border-[#474D57] text-[#EAECEF] text-sm font-bold uppercase tracking-wider rounded-lg hover:bg-[#363C45] transition-colors">Қатъ кардан</button>
             </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

interface SovereignButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "buy" | "sell";
}

export function SovereignButton({ children, className = "", type = "button", disabled = false, variant = "primary", ...props }: SovereignButtonProps) {
  const variantStyles: Record<string, string> = {
    primary:   "bg-[#F0B90B] text-black hover:bg-[#F8D33A] border border-transparent",
    secondary: "bg-[#2B2F36] text-[#EAECEF] border border-[#474D57] hover:bg-[#363C45]",
    danger:    "bg-[#F6465D]/10 text-[#F6465D] border border-[#F6465D]/30 hover:bg-[#F6465D] hover:text-white",
    buy:       "bg-[#F0B90B] text-black hover:bg-[#F8D33A] border border-transparent",
    sell:      "bg-[#F6465D] text-white hover:bg-[#F6465D]/90 border border-transparent",
  };
  const disabledStyles = disabled ? "opacity-40 pointer-events-none" : "";

  return (
    <button
      type={type}
      disabled={disabled}
      className={`flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold uppercase tracking-wider rounded-lg transition-all duration-150 ${variantStyles[variant] ?? variantStyles.primary} ${disabledStyles} ${className}`}
      {...props}
    >
       <span className="flex items-center gap-2">{children}</span>
    </button>
  );
}

export function AssetIcon({ src, symbol, className = "w-10 h-10" }: { src: string, symbol: string, className?: string }) {
  return (
    <div className={`${className} border border-[#2B2F36] bg-[#1E2026] rounded-lg p-2 relative overflow-hidden group/icon`}>
       <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
       {/* eslint-disable-next-line @next/next/no-img-element */}
       <img src={src} alt={symbol} className="w-full h-full object-contain relative z-10 opacity-70 group-hover/icon:opacity-100 transition-opacity" />
    </div>
  );
}
