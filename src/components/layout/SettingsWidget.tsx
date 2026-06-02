"use client";

import React from "react";
import { motion } from "framer-motion";
import { Settings as SettingsIcon } from "lucide-react";
import { useVantageStore } from "@/store/useVantageStore";

export function SettingsWidget() {
  const { activeTab, setActiveTab } = useVantageStore();
  const isSettingsActive = activeTab === "settings";

  const handleToggleSettings = () => {
    if (isSettingsActive) {
      setActiveTab("dashboard");
    } else {
      setActiveTab("settings");
    }
  };

  return (
    <div className="fixed bottom-6 sm:bottom-14 left-4 sm:left-8 z-[490]">
      <button
        onClick={handleToggleSettings}
        className={`flex items-center gap-3 px-5 py-4 sm:py-3.5 min-h-[48px] bg-[#1E2026] backdrop-blur-md border rounded-full transition-all group shadow-[0_0_30px_rgba(0,0,0,0.15)] cursor-pointer ${
          isSettingsActive
            ? "border-[#F0B90B] text-[#F0B90B] shadow-[0_0_30px_rgba(240,185,11,0.15)]"
            : "border-[#2B2F36] hover:border-[#F0B90B]/50 text-[#848E9C] hover:text-[#EAECEF]"
        }`}
      >
        <motion.div
          animate={isSettingsActive ? { rotate: 180 } : { rotate: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <SettingsIcon className={`w-5 h-5 transition-colors ${
            isSettingsActive ? "text-[#F0B90B]" : "text-[#848E9C]/60 group-hover:text-[#F0B90B]"
          }`} />
        </motion.div>
        
        <span className="text-[10px] font-bold uppercase tracking-wider font-mono leading-none">
          {isSettingsActive ? "Dashboard" : "Settings"}
        </span>
      </button>
    </div>
  );
}
