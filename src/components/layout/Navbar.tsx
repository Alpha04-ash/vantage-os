"use client";

import React, { useState, useEffect } from "react";
import { useVantageStore, VantageTab } from "@/store/useVantageStore";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, BarChart2, GraduationCap, Wallet, Network, Landmark, LogOut, Home, Dices } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

export const getFiscalDateString = (days: number) => {
  const safeDays = Math.max(1, Math.floor(days));
  const year = Math.floor((safeDays - 1) / 360) + 1;
  const dayOfYear = (safeDays - 1) % 360;
  const month = Math.floor(dayOfYear / 30) + 1;
  const day = (dayOfYear % 30) + 1;
  return `СОЛИ ${year} / МОҲИ ${month} / РӮЗИ ${day}`;
};

export function Navbar() {
  const { activeTab, setActiveTab, logout, activeLoan, fiscalDays } = useVantageStore();
  const router = useRouter();
  const pathname = usePathname();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
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
    { id: "dashboard",      label: "ДИДБОН",    sub: "Панел",    icon: LayoutDashboard },
    { id: "portfolio",      label: "ДОРОИҲО",   sub: "Портфел",  icon: Wallet },
    { id: "market",         label: "МАТРИТСА",  sub: "Савдо",    icon: BarChart2 },
    { id: "empire",         label: "ИМПЕРИЯ",   sub: "Тиҷорат",  icon: Network },
    { id: "realestate",     label: "ТАРЗИ ҲАЁТ",sub: "Амлок",   icon: Home },
    { id: "bank",           label: "БОНК",      sub: "Бонкдорӣ", icon: Landmark },
    { id: "casino",         label: "КАЗИНО",    sub: "Таҳлил",   icon: Dices },
    { id: "academy-route",  label: "АКАДЕМИЯ",  sub: "Когнитивӣ",icon: GraduationCap, route: "/academy" },
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
            <span className="text-[8px] font-semibold text-[#848E9C] uppercase tracking-[0.15em]">Sovereign OS</span>
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
          {/* Live fiscal date */}
          <div className="hidden xl:flex flex-col items-end leading-none font-mono">
            <span className="text-[8px] font-semibold text-[#848E9C] uppercase tracking-widest mb-0.5 flex items-center gap-1.5">
              <span className="status-live inline-block w-1.5 h-1.5 rounded-full bg-[#F0B90B] animate-pulse" />
              Санаи Молиявӣ
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
               netStatus === "slow" ? "ХАРОБ" :
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

          <div className="w-px h-6 bg-[#2B2F36] hidden xl:block" />

          {/* Logout */}
          <button 
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowLogoutModal(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#F6465D]/20 text-[#F6465D]/60 hover:text-[#F6465D] hover:border-[#F6465D]/50 hover:bg-[#F6465D]/5 text-[9px] font-bold uppercase tracking-widest transition-all cursor-pointer"
          >
            <span className="hidden sm:inline">ҚАТЪИ ПАЙВАСТ</span>
            <LogOut className="w-3.5 h-3.5" />
          </button>
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

      {/* LOGOUT MODAL */}
      <AnimatePresence>
        {showLogoutModal && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-[#0B0E11]/80 backdrop-blur-sm pointer-events-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              className="bg-[#1E2026] border border-[#474D57] rounded-xl p-8 max-w-sm w-full mx-4 relative"
            >
               <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#F6465D]/60 to-transparent rounded-t-xl" />
               
               <h3 className="text-base font-bold text-[#EAECEF] uppercase tracking-wider mb-2">Қатъи Пайвасти Система</h3>
               <p className="text-[11px] text-[#848E9C] font-mono mb-8 leading-relaxed">Оё боварӣ доред, ки мехоҳед сессияи бехатарро қатъ кунед?</p>
               
               <div className="flex gap-3">
                 <button 
                   onClick={() => setShowLogoutModal(false)}
                   className="flex-1 py-2.5 rounded-lg border border-[#474D57] bg-[#2B2F36] hover:bg-[#363C45] text-[#EAECEF] font-bold text-xs tracking-widest uppercase transition-all"
                 >
                   Рад кардан
                 </button>
                 <button 
                   onClick={() => {
                     setShowLogoutModal(false);
                     logout();
                     router.push("/");
                   }}
                   className="flex-1 py-2.5 rounded-lg bg-[#F6465D]/10 border border-[#F6465D]/40 hover:bg-[#F6465D] text-[#F6465D] hover:text-white font-bold text-xs tracking-widest uppercase transition-all"
                 >
                   Қатъ кардан
                 </button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
