"use client";

import React, { useState, useEffect } from "react";
import { useVantageStore, VantageTab } from "@/store/useVantageStore";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, BarChart2, GraduationCap, Wallet, Network, Landmark, Home, Dices, Shield } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

export const getFiscalDateString = (days: number) => {
  const safeDays = Math.max(1, Math.floor(days));
  const year = Math.floor((safeDays - 1) / 360) + 1;
  const dayOfYear = (safeDays - 1) % 360;
  const month = Math.floor(dayOfYear / 30) + 1;
  const day = (dayOfYear % 30) + 1;
  return `YEAR ${year} / MONTH ${month} / DAY ${day}`;
};

export const getSpeedIcon = (speed: number) => {
  if (speed <= 0.1)  return "🐌";
  if (speed <= 0.2)  return "🐢";
  if (speed <= 0.5)  return "🚶";
  if (speed <= 1)    return "🚗";
  if (speed <= 1.5)  return "⚡";
  return "🚀";
};

export function Navbar() {
  const { activeTab, setActiveTab, activeLoan, fiscalDays, timeSpeed, setTimeSpeed } = useVantageStore();
  const [showSpeedDropdown, setShowSpeedDropdown] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const [latency, setLatency] = useState<number | null>(null);
  const [netStatus, setNetStatus] = useState<"stable" | "slow" | "offline">("stable");

  useEffect(() => {
    const pingServer = async () => {
      const start = Date.now();
      try {
        const res = await fetch("/api/vantage-sync", { method: "GET", cache: "no-store" });
        if (res.ok) {
          const delay = Date.now() - start;
          setLatency(delay);
          if (delay < 180) {
            setNetStatus("stable");
          } else {
            setNetStatus("slow");
          }
        } else {
          setNetStatus("offline");
          setLatency(null);
        }
      } catch (e) {
        setNetStatus("offline");
        setLatency(null);
      }
    };

    pingServer();
    const interval = setInterval(pingServer, 10000); // check connection latency every 10s
    return () => clearInterval(interval);
  }, []);

  const tabs: { id: VantageTab | "academy-route"; label: string; sub: string; icon: any; route?: string }[] = [
    { id: "dashboard",      label: "OVERVIEW",      sub: "Net Worth", icon: LayoutDashboard },
    { id: "portfolio",      label: "TREASURY",      sub: "Assets",    icon: Wallet },
    { id: "market",         label: "TRADE",         sub: "Terminal",  icon: BarChart2 },
    { id: "empire",         label: "BUSINESS",      sub: "Investments",icon: Network },
    { id: "realestate",     label: "PROPERTIES",    sub: "Real Estate",icon: Home },
    { id: "bank",           label: "RESERVES",      sub: "Loans & Savings",icon: Landmark },
    { id: "casino",         label: "ANALYTICS",     sub: "Risk & Ruin",icon: Dices },
    { id: "academy-route",  label: "ACADEMY",       sub: "AI Advisor", icon: GraduationCap, route: "/academy" },
  ];

  const handleTabClick = (tab: any) => {
    if (tab.route) {
      router.push(tab.route);
    } else {
      if (pathname !== "/dashboard") {
        router.push("/dashboard");
      }
      setActiveTab(tab.id);
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-[500]">
      {/* Top bar — Binance exchange header style */}
      <nav className="bg-[#1E2026] border-b border-[#2B2F36] flex items-center justify-between px-4 sm:px-8 h-14 relative">
        
        {/* LOGO */}
        <div
          className="flex items-center gap-2.5 cursor-pointer group shrink-0"
          onClick={() => router.push('/dashboard')}
        >
          {/* Binance-style diamond logo */}
          <div className="relative w-7 h-7 flex items-center justify-center">
            <div className="w-4 h-4 bg-[#F0B90B] rotate-45 rounded-sm group-hover:scale-110 transition-transform" />
            <div className="absolute w-2.5 h-2.5 bg-[#1E2026] rotate-45 rounded-[2px]" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-[15px] font-extrabold text-[#EAECEF] tracking-tight group-hover:text-[#F0B90B] transition-colors">
              VANTAGE
            </span>
            <span className="text-[8px] font-semibold text-[#848E9C] uppercase tracking-[0.15em]">Financial Simulator</span>
          </div>
          <span className="hidden sm:inline text-[8px] font-bold font-mono px-1.5 py-0.5 bg-[#F0B90B]/10 text-[#F0B90B] border border-[#F0B90B]/20 rounded">
            v3.1
          </span>
        </div>

        {/* NAV TABS — aligned left with gap and safe distance from the date/latency widgets */}
        <div className="hidden md:flex items-center justify-start gap-1.5 flex-1 max-w-[850px] ml-10 mr-auto px-2">
          {tabs.map((tab) => {
            const isAcademyRoute = tab.route === "/academy" && pathname === "/academy";
            const isActive = isAcademyRoute || (pathname === "/dashboard" && activeTab === tab.id);
            const isBankWithLoan = tab.id === "bank" && activeLoan;
            
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab)}
                className={`relative px-2 lg:px-3 py-4 h-14 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider transition-colors group ${
                  isActive
                    ? "text-[#F0B90B]"
                    : isBankWithLoan
                      ? "text-amber-400"
                      : "text-[#848E9C] hover:text-[#EAECEF]"
                }`}
              >
                {/* Active underline */}
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#F0B90B]"
                  />
                )}
                <tab.icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-[#F0B90B]" : isBankWithLoan ? "text-amber-400 animate-pulse" : "text-[#848E9C] group-hover:text-[#EAECEF]"}`} />
                <span className="hidden xl:inline">{tab.label}</span>
                {isBankWithLoan && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping absolute top-2.5 right-1.5" />
                )}
              </button>
            );
          })}
        </div>

        {/* RIGHT — Fiscal Date + Logout */}
        <div className="flex items-center gap-3 shrink-0">
          
          {/* Live speed control selector */}
          <div className="relative font-mono" id="nav-speed-control">
             <button
               onClick={() => setShowSpeedDropdown(!showSpeedDropdown)}
               className="flex flex-col items-end leading-none cursor-pointer group text-right focus:outline-none"
             >
                <span className="text-[8px] font-semibold text-[#848E9C] uppercase tracking-widest mb-0.5 flex items-center gap-1 group-hover:text-white transition-colors">
                   TIME SPEED
                </span>
                <span className="text-[11px] font-bold text-[#F0B90B] tracking-wider whitespace-nowrap flex items-center gap-1 select-none">
                   {getSpeedIcon(timeSpeed)} {timeSpeed}x
                </span>
             </button>
             {showSpeedDropdown && (
                <>
                  <div className="fixed inset-0 z-[1000] cursor-default" onClick={() => setShowSpeedDropdown(false)} />
                  <motion.div 
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    className="absolute top-10 right-0 z-[1001] w-48 bg-[#1E2026] border border-[#2B2F36] rounded-xl p-2.5 shadow-[0_10px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl"
                  >
                     <div className="text-[8px] font-black text-[#848E9C] px-2.5 pb-2 border-b border-white/5 uppercase tracking-widest font-mono">CLOCK CALIBRATION</div>
                     <div className="space-y-0.5 mt-1.5 max-h-[250px] overflow-y-auto no-scrollbar">
                        {[
                          { val: 0.1,  label: "0.1x — Slow",     desc: "1 month = 10 hrs (🐌)" },
                          { val: 0.2,  label: "0.2x — Sluggish", desc: "1 month = 5 hrs (🐢)" },
                          { val: 0.5,  label: "0.5x — Moderate", desc: "1 month = 2 hrs (🚶)" },
                          { val: 1,    label: "1x — Standard",   desc: "1 month = 1 hr (🚗)" },
                          { val: 1.5,  label: "1.5x — Fast",     desc: "1 month = 40 mins (⚡)" },
                          { val: 2,    label: "2x — MAXIMUM",    desc: "1 month = 30 mins (🚀)" },
                        ].map(s => (
                          <button
                             key={s.val}
                             onClick={() => {
                               setTimeSpeed(s.val);
                               setShowSpeedDropdown(false);
                             }}
                             className={`w-full text-left px-2.5 py-2 rounded-lg transition-colors flex flex-col cursor-pointer border ${
                               timeSpeed === s.val 
                                 ? "bg-[#F0B90B]/10 border-[#F0B90B]/20 text-[#F0B90B]" 
                                 : "hover:bg-white/5 text-[#EAECEF] border-transparent"
                             }`}
                          >
                             <span className="text-[10px] font-black">{s.label}</span>
                             <span className="text-[7.5px] font-medium text-[#848E9C] tracking-wide mt-0.5">{s.desc}</span>
                          </button>
                        ))}
                     </div>
                  </motion.div>
                </>
             )}
          </div>

          <div className="w-px h-6 bg-[#2B2F36] hidden xl:block" />

          {/* Live fiscal date */}
          <div className="hidden xl:flex flex-col items-end leading-none font-mono">
            <span className="text-[8px] font-semibold text-[#848E9C] uppercase tracking-widest mb-0.5 flex items-center gap-1.5">
              <span className="status-live inline-block w-1.5 h-1.5 rounded-full bg-[#F0B90B] animate-pulse" />
              Fiscal Date
            </span>
            <span className="text-[11px] font-bold text-[#F0B90B] tracking-wider whitespace-nowrap">
              {getFiscalDateString(fiscalDays)}
            </span>
          </div>

          <div className="w-px h-6 bg-[#2B2F36] hidden xl:block" />

          {/* Network Latency Indicator Badge */}
          <div className="hidden xl:flex items-center gap-2 px-2.5 py-1.5 bg-[#1E2026] border border-[#2B2F36] rounded-lg font-mono text-[10px] shrink-0">
            <span className="text-[#848E9C] text-[9px] uppercase tracking-wider">NET:</span>
            <span className={`font-extrabold tracking-wider ${
              netStatus === "stable" ? "text-emerald-400" :
              netStatus === "slow" ? "text-amber-400" :
              "text-[#F6465D]"
            }`}>
              {netStatus === "stable" ? `${latency ?? 12}ms` :
               netStatus === "slow" ? "SLOW" :
               "OFFLINE"}
            </span>
            <span className="relative flex h-1.5 w-1.5">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                netStatus === "stable" ? "bg-emerald-400" :
                netStatus === "slow" ? "bg-amber-400" :
                "bg-[#F6465D]"
              }`} />
              <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${
                netStatus === "stable" ? "bg-emerald-500" :
                netStatus === "slow" ? "bg-amber-500" :
                "bg-[#F6465D]"
              }`} />
            </span>
          </div>

        </div>

        {/* Mobile tab bar — icons only, shown below md */}
        <div className="flex md:hidden items-center gap-0">
          {tabs.slice(0, 5).map((tab) => {
            const isActive = pathname === "/dashboard" && activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab)}
                className={`px-2.5 py-2 flex items-center justify-center transition-colors ${
                  isActive ? "text-[#F0B90B]" : "text-[#848E9C] hover:text-[#EAECEF]"
                }`}
              >
                <tab.icon className="w-4 h-4" />
              </button>
            );
          })}
        </div>
      </nav>

    </div>
  );
}
