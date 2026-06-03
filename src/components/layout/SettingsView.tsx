"use client";

import React, { useState } from "react";
import { useVantageStore } from "@/store/useVantageStore";
import { motion } from "framer-motion";
import { 
  Cpu, Terminal as TerminalIcon, Fingerprint, Shield, 
  Power, Key, RefreshCw, Activity, Database, Clock, LogOut
} from "lucide-react";
import { MonolithCard, ConfirmModal } from "./SovereignUI";
import { SystemCore3D } from "./SystemCore3D";
import { useRouter } from "next/navigation";

declare var pendo: any;

export function SettingsView() {
  const { reset, logout, currentUser, balance, timeSpeed, setTimeSpeed } = useVantageStore();
  const router = useRouter();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isDiagnosticRunning, setIsDiagnosticRunning] = useState(false);
  const [diagnosticResult, setDiagnosticResult] = useState("");

  const triggerReset = () => {
    if (typeof pendo !== "undefined") {
      pendo.track("system_reset", {
        balanceAtReset: balance,
        portfolioSizeAtReset: currentUser?.portfolio?.length ?? 0,
        learningXPAtReset: currentUser?.learningXP ?? 0
      });
    }
    reset();
    setShowResetConfirm(false);
  };

  const triggerLogout = () => {
    setShowLogoutConfirm(false);
    if (typeof pendo !== "undefined") {
      pendo.track("user_logged_out");
      pendo.clearSession();
    }
    logout();
    router.push("/");
  };

  const runDatabaseDiagnostic = () => {
    setIsDiagnosticRunning(true);
    setDiagnosticResult("Scanning structural files...");
    setTimeout(() => {
      setDiagnosticResult("Checking synchronization speed...");
      setTimeout(() => {
        setDiagnosticResult("Database successfully synchronized! Balance Integrity: INTEGRAL.");
        setIsDiagnosticRunning(false);
        if (typeof pendo !== "undefined") {
          pendo.track("database_diagnostic_run", {
            diagnosticResult: "success"
          });
        }
      }, 1000);
    }, 1000);
  };

  return (
    <div className="pt-24 sm:pt-32 px-4 sm:px-10 max-w-[1400px] mx-auto space-y-12 pb-40 no-scrollbar relative z-10 font-mono">
      
      {/* SYSTEM HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center border-b border-[#2B2F36] py-5 relative">
        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2">
             <Cpu className="w-4 h-4 text-[#F0B90B]" />
             <span className="text-[10px] font-semibold uppercase tracking-widest text-[#848E9C]">SYSTEM_CALIBRATION_OS_v9.2</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#EAECEF] tracking-tight">SYSTEM_SETTINGS</h2>
        </div>
        <div className="w-64 h-64 md:absolute md:right-0 md:top-0 select-none pointer-events-none opacity-80">
           <SystemCore3D />
        </div>
      </div>

      {/* BALANCED 3-COLUMN METRICS AND CONTROLS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
         
         {/* COLUMN 1: SECURITY IDENTITY */}
         <MonolithCard className="p-6 sm:p-8 flex flex-col justify-between h-full hover:border-[#474D57] transition-colors">
            <div>
               <div className="flex items-center gap-3 mb-6 border-b border-[#2B2F36] pb-4">
                  <Fingerprint className="w-5 h-5 text-[#F0B90B]/60" />
                  <h3 className="text-base sm:text-lg font-bold uppercase tracking-tight text-[#EAECEF]">AUTHORIZATION_CERTIFICATE</h3>
               </div>
               <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center border-b border-[#2B2F36] pb-3">
                     <span className="text-[10px] font-semibold uppercase tracking-widest text-[#848E9C]">User_ID</span>
                     <span className="text-[#EAECEF] font-mono text-xs">{currentUser?.operatorId || "DIRECTOR_01"}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-[#2B2F36] pb-3">
                     <span className="text-[10px] font-semibold uppercase tracking-widest text-[#848E9C]">Clearance Level</span>
                     <span className="text-[#F0B90B] font-bold bg-[#F0B90B]/5 border border-[#F0B90B]/20 px-2 py-0.5 rounded text-[10px]">
                        {currentUser?.clearance || "LEVEL_05"}
                     </span>
                  </div>
                  <div className="flex justify-between items-center border-b border-[#2B2F36] pb-3">
                     <span className="text-[10px] font-semibold uppercase tracking-widest text-[#848E9C]">Liquid Capital</span>
                     <span className="text-[#EAECEF] font-mono">${(balance || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                     <span className="text-[10px] font-semibold uppercase tracking-widest text-[#848E9C]">System_Status</span>
                     <span className="text-[#F0B90B] flex items-center gap-2 font-bold text-[10px]">
                        <div className="status-live" />
                        SECURE
                     </span>
                  </div>
               </div>
            </div>
            
            <div className="mt-8 pt-4 border-t border-white/5 flex items-center gap-2 text-[8px] text-white/20 uppercase tracking-widest justify-center">
              <Key className="w-3.5 h-3.5" />
              <span>Session encryption active</span>
            </div>
         </MonolithCard>

         {/* COLUMN 2: TELEMETRY & SYNC SYSTEM */}
         <MonolithCard className="p-6 sm:p-8 flex flex-col justify-between h-full hover:border-[#474D57] transition-all">
            <div>
               <div className="flex items-center justify-between mb-6 border-b border-[#2B2F36] pb-4">
                  <div className="flex items-center gap-3">
                     <Database className="w-5 h-5 text-[#F0B90B]" />
                     <h3 className="text-base sm:text-lg font-bold uppercase tracking-tight text-[#EAECEF]">DATABASE</h3>
                  </div>
                  <span className="px-2 py-0.5 text-[9px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded">
                     SYNC // ACTIVE
                  </span>
               </div>
               
               <div className="space-y-6 text-xs">
                  <div className="space-y-2">
                     <span className="text-[10px] font-semibold uppercase tracking-widest text-[#848E9C]">SYNCHRONIZATION SYSTEM // AUTOMATED BACKUPS</span>
                     <div className="p-3 bg-[#14151A] border border-[#2B2F36] rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                           <span className="text-[9px] uppercase tracking-wider text-[#848E9C]">Database File:</span>
                           <span className="text-[#EAECEF] font-mono">db.json</span>
                        </div>
                        <div className="flex justify-between items-center">
                           <span className="text-[9px] uppercase tracking-wider text-[#848E9C]">Status:</span>
                           <span className="text-emerald-400 font-bold">SYNCHRONIZED // ONLINE</span>
                        </div>
                     </div>
                  </div>

                  <div className="space-y-2">
                     <span className="text-[10px] font-semibold uppercase tracking-widest text-[#848E9C]">NEURAL TELEMETRY // ENGINE INTEGRITY</span>
                     <div className="grid grid-cols-2 gap-2 text-center">
                        <div className="p-2.5 bg-[#14151A] border border-[#2B2F36] rounded-lg">
                           <div className="text-[9px] text-[#848E9C] uppercase">Active Nodes</div>
                           <div className="text-sm font-extrabold text-[#EAECEF] mt-1">OPTIMAL</div>
                        </div>
                        <div className="p-2.5 bg-[#14151A] border border-[#2B2F36] rounded-lg">
                           <div className="text-[9px] text-[#848E9C] uppercase">EV Check</div>
                           <div className="text-sm font-extrabold text-emerald-400 mt-1">POSITIVE</div>
                        </div>
                     </div>
                  </div>

                  {diagnosticResult && (
                    <div className="p-2.5 bg-[#14151A] border border-[#2B2F36] rounded-lg font-mono text-[9px] text-amber-400 leading-normal">
                      📟 {diagnosticResult}
                    </div>
                  )}
               </div>
            </div>
            
            <button 
               disabled={isDiagnosticRunning}
               onClick={runDatabaseDiagnostic}
               className={`w-full py-3 mt-6 rounded-lg border text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer ${
                 isDiagnosticRunning
                   ? "border-[#2B2F36] bg-transparent text-[#474D57] cursor-not-allowed"
                   : "border-[#F0B90B]/25 hover:border-[#F0B90B]/60 bg-[#F0B90B]/5 hover:bg-[#F0B90B]/10 text-[#F0B90B]"
               }`}
            >
               <Activity className="w-4 h-4" />
               {isDiagnosticRunning ? "RUNNING DIAGNOSTICS..." : "DATABASE DIAGNOSTICS // DIAGNOSTICS"}
            </button>
         </MonolithCard>

         {/* COLUMN 3: DISCONNECT */}
         <MonolithCard className="p-6 sm:p-8 flex flex-col justify-between h-full border-[#F6465D]/10 hover:border-[#F6465D]/25 transition-all">
            <div>
               <div className="flex items-center gap-3 mb-6 border-b border-[#2B2F36] pb-4">
                  <LogOut className="w-5 h-5 text-[#F6465D]/60" />
                  <h3 className="text-base sm:text-lg font-bold uppercase tracking-tight text-[#EAECEF]">TERMINATE_CONNECTION</h3>
               </div>
               <p className="text-xs text-[#F6465D]/60 leading-relaxed mb-6">
                  Terminate your secure session. All of your progress is locally persistent and will reload on your next authorization.
               </p>
            </div>
            <div className="space-y-3">
               <button
                  onClick={() => setShowLogoutConfirm(true)}
                  className="w-full py-3 rounded-lg border border-[#F6465D]/30 hover:border-[#F6465D] bg-[#F6465D]/5 hover:bg-[#F6465D] text-[#F6465D] hover:text-white text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer"
               >
                  <LogOut className="w-4 h-4" />
                  TERMINATE CONNECTION
               </button>
               <button
                  onClick={() => setShowResetConfirm(true)}
                  className="w-full py-3 rounded-lg border border-[#F6465D]/10 hover:border-[#F6465D]/40 bg-transparent text-[#F6465D]/40 hover:text-[#F6465D] text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer"
               >
                  <RefreshCw className="w-4 h-4" />
                  SYSTEM_RESET
               </button>
            </div>
         </MonolithCard>

      </div>
 
      {/* TIME SCALE CONTROL PANEL */}
      <div className="w-full">
         <MonolithCard className="p-6 sm:p-8 space-y-6 bg-gradient-to-br from-[#F0B90B]/[0.01] to-transparent border-[#2B2F36] hover:border-[#F0B90B]/20 transition-all rounded-xl">
            <div className="flex items-center gap-3 border-b border-[#2B2F36] pb-4">
               <Clock className="w-5 h-5 text-[#F0B90B] animate-pulse" />
               <div>
                  <h3 className="text-base sm:text-lg font-bold uppercase tracking-tight text-[#EAECEF]">TIME SCALE CALIBRATION // CHRONOS SPEED ENGINE</h3>
                  <span className="text-[9px] font-semibold text-[#848E9C] uppercase tracking-wider block mt-0.5">Calibration of the financial timeline rate inside Vantage Sovereign OS</span>
               </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center text-xs">
               <div className="space-y-3 lg:col-span-1">
                  <p className="text-white/60 leading-relaxed font-sans">
                     Adjust the financial clock speed to your preference. Accelerating time triggers faster day transitions, magnifying passive income cycles across real estate, interest reserves, and industrial business nodes proportionally.
                  </p>
                  <div className="p-3 bg-[#14151A] border border-[#2B2F36] rounded-lg text-[9px] text-[#848E9C] space-y-1">
                     <div className="flex justify-between">
                        <span>MIN LIMIT:</span>
                        <span className="text-[#EAECEF]">1 Month = 1 Hour (1x)</span>
                     </div>
                     <div className="flex justify-between">
                        <span>MAX LIMIT:</span>
                        <span className="text-[#F0B90B] font-bold">1 Month = 10 Seconds (360x)</span>
                     </div>
                  </div>
               </div>

               <div className="lg:col-span-2 space-y-4">
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-[#848E9C] block">SELECT SPEED PRESET // SELECT SPEED PRESET</span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                     {[
                       { val: 0.1,  label: "0.1x — Slow",    desc: "1 Month = 10 hrs" },
                       { val: 0.2,  label: "0.2x — Relaxed", desc: "1 Month = 5 hrs" },
                       { val: 0.5,  label: "0.5x — Moderate",desc: "1 Month = 2 hrs" },
                       { val: 1,    label: "1x — Standard",  desc: "1 Month = 1 hr" },
                       { val: 1.5,  label: "1.5x — Fast",    desc: "1 Month = 40 mins" },
                       { val: 2,    label: "2x — MAXIMUM",   desc: "1 Month = 30 mins" },
                     ].map(s => (
                       <button
                         key={s.val}
                         onClick={() => { if (typeof pendo !== "undefined") { pendo.track("time_speed_changed", { newTimeSpeed: s.val, previousTimeSpeed: timeSpeed ?? 1 }); } setTimeSpeed(s.val); }}
                         className={`p-3 rounded-lg border text-left flex flex-col justify-between transition-all cursor-pointer ${
                           (timeSpeed ?? 1) === s.val
                             ? "bg-[#F0B90B]/10 border-[#F0B90B] text-[#F0B90B] shadow-[0_0_15px_rgba(240,185,11,0.1)] font-bold"
                             : "bg-[#14151A] border-[#2B2F36] hover:border-white/20 text-[#848E9C]"
                         }`}
                       >
                          <span className="text-[10px] font-bold block">{s.label}</span>
                          <span className="text-[8px] text-white/40 mt-1 font-mono">{s.desc}</span>
                       </button>
                     ))}
                  </div>
               </div>
            </div>
         </MonolithCard>
      </div>

      {/* SYSTEM DIAGNOSTICS LOGS */}
      <div className="w-full">
         <MonolithCard className="p-5 sm:p-8 h-[200px] flex flex-col">
            <div className="flex items-center gap-2 mb-4 border-b border-[#2B2F36] pb-3">
               <TerminalIcon className="w-4 h-4 text-[#F0B90B]/50" />
               <span className="text-[10px] font-semibold uppercase tracking-widest text-[#848E9C]">SYSTEM_DIAGNOSTICS_OUTPUT // SYS_LOGS</span>
               <div className="ml-auto status-live" />
            </div>
            <div className="flex-1 overflow-y-auto no-scrollbar space-y-2 font-mono text-[10px] text-[#474D57] leading-relaxed">
               <div>[00:01:02] INITIALIZING SOVEREIGN ENGINE... COMPLETED.</div>
               <div>[00:01:04] DECRYPTING ASSET VAULT... COMPLETED.</div>
               <div>[00:01:08] <span className="text-[#F0B90B]">SYNCHRONIZING SYNAPSE NODES... 100% OPTIMAL</span></div>
               <div>[00:01:12] MAPPING ENTERPRISE MATRIX... COMPLETED.</div>
               <div>[00:01:20] <span className="text-[#F0B90B]">SYSTEM STATUS: NOMINAL. ALL DEFENSIVE SHIELDS ACTIVE.</span></div>
            </div>
         </MonolithCard>
      </div>

      {/* CONFIRM RESET DIALOG */}
      <ConfirmModal 
        isOpen={showResetConfirm}
        title="WARNING: TOTAL SYSTEM WIPE"
        description="Confirming this action will purge all industrial holdings, real estate, achievements, and capital reserves. Are you absolutely sure?"
        onConfirm={triggerReset}
        onCancel={() => { setShowResetConfirm(false); }}
      />

      <ConfirmModal
        isOpen={showLogoutConfirm}
        title="TERMINATE SESSION CONNECTION"
        description="Are you sure you want to terminate your secure session? Your progress is preserved locally."
        onConfirm={triggerLogout}
        onCancel={() => setShowLogoutConfirm(false)}
      />

    </div>
  );
}
