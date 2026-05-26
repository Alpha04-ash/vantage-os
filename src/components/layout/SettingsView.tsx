"use client";

import React, { useState, useEffect } from "react";
import { useVantageStore } from "@/store/useVantageStore";
import { motion } from "framer-motion";
import { 
  Cpu, Terminal as TerminalIcon, Fingerprint, Shield, 
  Power, Key, RefreshCw, Activity, Database
} from "lucide-react";
import { MonolithCard, ConfirmModal } from "./SovereignUI";
import { SystemCore3D } from "./SystemCore3D";

export function SettingsView() {
  const { reset, currentUser, balance } = useVantageStore();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isDiagnosticRunning, setIsDiagnosticRunning] = useState(false);
  const [diagnosticResult, setDiagnosticResult] = useState("");

  const triggerReset = () => {
    reset();
    setShowResetConfirm(false);
  };

  const runDatabaseDiagnostic = () => {
    setIsDiagnosticRunning(true);
    setDiagnosticResult("Сканкунии файлҳои сохторӣ...");
    setTimeout(() => {
      setDiagnosticResult("Тафтиши суръати синхронизатсия...");
      setTimeout(() => {
        setDiagnosticResult("Махзан бомуваффақият ҳамоҳанг шуд! Тавозун: ИНТЕГРАЛӢ.");
        setIsDiagnosticRunning(false);
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
             <span className="text-[10px] font-semibold uppercase tracking-widest text-[#848E9C]">КАЛИБРОВКАИ_СИСТЕМА_OS_v9.2</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#EAECEF] tracking-tight">ТАНЗИМОТИ_СИСТЕМА</h2>
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
                  <h3 className="text-base sm:text-lg font-bold uppercase tracking-tight text-[#EAECEF]">СЕРТИФИКАТИ_ВАКОЛАТ</h3>
               </div>
               <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center border-b border-[#2B2F36] pb-3">
                     <span className="text-[10px] font-semibold uppercase tracking-widest text-[#848E9C]">ID_и_Корбар</span>
                     <span className="text-[#EAECEF] font-mono text-xs">{currentUser?.operatorId || "DIRECTOR_01"}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-[#2B2F36] pb-3">
                     <span className="text-[10px] font-semibold uppercase tracking-widest text-[#848E9C]"> Clearance Level</span>
                     <span className="text-[#F0B90B] font-bold bg-[#F0B90B]/5 border border-[#F0B90B]/20 px-2 py-0.5 rounded text-[10px]">
                        {currentUser?.clearance || "LEVEL_05"}
                     </span>
                  </div>
                  <div className="flex justify-between items-center border-b border-[#2B2F36] pb-3">
                     <span className="text-[10px] font-semibold uppercase tracking-widest text-[#848E9C]">Сармояи Нақд</span>
                     <span className="text-[#EAECEF] font-mono">${(balance || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                     <span className="text-[10px] font-semibold uppercase tracking-widest text-[#848E9C]">Ҳолати_Система</span>
                     <span className="text-[#F0B90B] flex items-center gap-2 font-bold text-[10px]">
                        <div className="status-live" />
                        БЕХАТАР
                     </span>
                  </div>
               </div>
            </div>
            
            <div className="mt-8 pt-4 border-t border-white/5 flex items-center gap-2 text-[8px] text-white/20 uppercase tracking-widest justify-center">
              <Key className="w-3.5 h-3.5" />
              <span>Шифргузории сессия фаъол аст</span>
            </div>
         </MonolithCard>

         {/* COLUMN 2: TELEMETRY & SYNC SYSTEM */}
         <MonolithCard className="p-6 sm:p-8 flex flex-col justify-between h-full hover:border-[#474D57] transition-all">
            <div>
               <div className="flex items-center justify-between mb-6 border-b border-[#2B2F36] pb-4">
                  <div className="flex items-center gap-3">
                     <Database className="w-5 h-5 text-[#F0B90B]" />
                     <h3 className="text-base sm:text-lg font-bold uppercase tracking-tight text-[#EAECEF]">БАЗАИ_МАЪЛУМОТ</h3>
                  </div>
                  <span className="px-2 py-0.5 text-[9px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded">
                     СИНК // ACTIVE
                  </span>
               </div>
               
               <div className="space-y-6 text-xs">
                  <div className="space-y-2">
                     <span className="text-[10px] font-semibold uppercase tracking-widest text-[#848E9C]">НИЗОМИ СИНХРОНИЗАТСИЯ // AUTOMATED BACKUPS</span>
                     <div className="p-3 bg-[#14151A] border border-[#2B2F36] rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                           <span className="text-[9px] uppercase tracking-wider text-[#848E9C]">Файли Махзан:</span>
                           <span className="text-[#EAECEF] font-mono">db.json</span>
                        </div>
                        <div className="flex justify-between items-center">
                           <span className="text-[9px] uppercase tracking-wider text-[#848E9C]">Ҳолат:</span>
                           <span className="text-emerald-400 font-bold">ҲАМОҲАНГ // ONLINE</span>
                        </div>
                     </div>
                  </div>

                  <div className="space-y-2">
                     <span className="text-[10px] font-semibold uppercase tracking-widest text-[#848E9C]">ТЕЛЕМЕТРИЯИ НЕЙРОНӢ // ENGINE INTEGRITY</span>
                     <div className="grid grid-cols-2 gap-2 text-center">
                        <div className="p-2.5 bg-[#14151A] border border-[#2B2F36] rounded-lg">
                           <div className="text-[9px] text-[#848E9C] uppercase">Шумораи Гиреҳҳо</div>
                           <div className="text-sm font-extrabold text-[#EAECEF] mt-1">ОПТИМАЛӢ</div>
                        </div>
                        <div className="p-2.5 bg-[#14151A] border border-[#2B2F36] rounded-lg">
                           <div className="text-[9px] text-[#848E9C] uppercase">Санҷиши EV</div>
                           <div className="text-sm font-extrabold text-emerald-400 mt-1">МУСБАТ</div>
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
               {isDiagnosticRunning ? "ДАР ҲОЛИ ТАФТИШ..." : "ДИАГНОСТИКАИ МАХЗАН // DIAGNOSTICS"}
            </button>
         </MonolithCard>

         {/* COLUMN 3: HARD RESET */}
         <MonolithCard className="p-6 sm:p-8 flex flex-col justify-between h-full border-[#F6465D]/10 hover:border-[#F6465D]/25 transition-all">
            <div>
               <div className="flex items-center gap-3 mb-6 border-b border-[#2B2F36] pb-4">
                  <Power className="w-5 h-5 text-[#F6465D]/60" />
                  <h3 className="text-base sm:text-lg font-bold uppercase tracking-tight text-[#EAECEF]">ОБНУЛ_КАРДАН</h3>
               </div>
               <p className="text-xs text-[#F6465D]/60 leading-relaxed mb-6">
                  ОГОҲӢ: Тозакунии умумии система ҳамаи гиреҳҳои саноатӣ, дороиҳо, амлок ва сармояи шумороро ба таври доимӣ нест мекунад.
               </p>
            </div>
            
            <button 
               onClick={() => { setShowResetConfirm(true); }}
               className="w-full py-3 rounded-lg border border-[#F6465D]/30 hover:border-[#F6465D] bg-[#F6465D]/5 hover:bg-[#F6465D] text-[#F6465D] hover:text-white text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
               <RefreshCw className="w-4 h-4" />
               ТОЗАКУНИИ_СИСТЕМА
            </button>
         </MonolithCard>

      </div>

      {/* SYSTEM DIAGNOSTICS LOGS */}
      <div className="w-full">
         <MonolithCard className="p-5 sm:p-8 h-[200px] flex flex-col">
            <div className="flex items-center gap-2 mb-4 border-b border-[#2B2F36] pb-3">
               <TerminalIcon className="w-4 h-4 text-[#F0B90B]/50" />
               <span className="text-[10px] font-semibold uppercase tracking-widest text-[#848E9C]">НАШРИ_ДИАГНОСТИКИИ_СИСТЕМА // SYS_LOGS</span>
               <div className="ml-auto status-live" />
            </div>
            <div className="flex-1 overflow-y-auto no-scrollbar space-y-2 font-mono text-[10px] text-[#474D57] leading-relaxed">
               <div>[00:01:02] ИҲРОКУНИИ_СИСТЕМАИ_СОҲИБИХТИёР... ИҲРО ШУД.</div>
               <div>[00:01:04] РАМЗКУШОИИ_ХАЗИНАИ_ДОРОИҲО... ИҲРО ШУД.</div>
               <div>[00:01:08] <span className="text-[#F0B90B]">ҲАМОҲАНГСОЗИИ_ГИРЕҲҲОИ_ЗЕҲНӢ... 100% ОПТИМАЛӢ</span></div>
               <div>[00:01:12] ХАРИТАСОЗИИ_МАТРИТСАИ_САНОАТӢ... ИҲРО ШУД.</div>
               <div>[00:01:20] <span className="text-[#F0B90B]">СИСТЕМА_МӮЪТАДИЛ_АСТ. ҲАМАИ_ГИРЕҲҲО_ФАЪОЛ.</span></div>
            </div>
         </MonolithCard>
      </div>

      {/* CONFIRM RESET DIALOG */}
      <ConfirmModal 
        isOpen={showResetConfirm}
        title="ОГОҲӢ: ТОЗАКУНИИ УМУМИИ СИСТЕМА"
        description="Тасдиқи ин амал ҳамаи корхонаҳо, дастовардҳо ва сармояи шуморо нест мекунад. Оё боварӣ доред?"
        onConfirm={triggerReset}
        onCancel={() => { setShowResetConfirm(false); }}
      />

    </div>
  );
}
