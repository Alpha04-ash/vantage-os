"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Activity, Zap } from "lucide-react";
import { marketSimulator } from "@/services/MarketSimulator";

export function NeuralTicker() {
  const [pulse, setPulse] = useState("Ҳамоҳангсозӣ бо Шабакаи Глобалии Нейронӣ...");
  const [loading, setLoading] = useState(true);

  const fetchPulse = () => {
    setPulse(marketSimulator.getNewsFeed());
    setLoading(false);
  };

  useEffect(() => {
    fetchPulse();
    const interval = setInterval(fetchPulse, 2000); // Check for new market events frequently
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-0 left-0 w-full z-[100] h-10 bg-[#1E2026] border-t border-[#2B2F36] flex items-center overflow-hidden">
      <div className="flex-shrink-0 h-full px-6 flex items-center gap-3 bg-[#F0B90B]/10 border-r border-[#2B2F36] z-10">
        <Activity className="w-4 h-4 text-[#F0B90B]" />
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#F0B90B]">ИМПУЛСИ НЕЙРОНИ</span>
      </div>
      
      <div className="flex-1 overflow-hidden relative">
        <motion.div 
          animate={{ x: ["100%", "-100%"] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="whitespace-nowrap flex items-center gap-12"
        >
          {pulse.split("|").map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <Zap className="w-3 h-3 text-[#848E9C]/60" />
              <span className="text-[11px] font-semibold text-[#EAECEF] uppercase tracking-wider">
                {item.trim()}
              </span>
            </div>
          ))}
          {/* Repeat for seamless loop */}
          {pulse.split("|").map((item, i) => (
            <div key={`dup-${i}`} className="flex items-center gap-3">
              <Zap className="w-3 h-3 text-[#848E9C]/60" />
              <span className="text-[11px] font-semibold text-[#EAECEF] uppercase tracking-wider">
                {item.trim()}
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      <div className="flex-shrink-0 h-full px-6 flex items-center gap-3 bg-[#2B2F36] border-l border-[#2B2F36] z-10 text-[10px] font-mono text-[#848E9C]">
        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} UTC
      </div>
    </div>
  );
}
