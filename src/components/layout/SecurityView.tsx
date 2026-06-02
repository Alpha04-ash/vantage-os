"use client";

import React, { useState, useEffect } from "react";
import { useVantageStore } from "@/store/useVantageStore";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, ShieldAlert, Cpu, Terminal as TerminalIcon, 
  Activity, Fingerprint, Key, RefreshCw, Zap, 
  AlertTriangle, CheckCircle, Flame, ShieldCheck, HeartPulse
} from "lucide-react";
import { MonolithCard, SovereignButton } from "./SovereignUI";

export function SecurityView() {
  const { 
    balance, 
    learningXP, 
    securityScore, 
    securityProtocols, 
    threatLevel, 
    securityAuditText, 
    threatLogs, 
    toggleSecurityProtocol, 
    requestSecurityAudit, 
    mitigateThreat,
    runSecuritySimulation
  } = useVantageStore();

  const [isAuditing, setIsAuditing] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simProgress, setSimProgress] = useState(0);
  const [simText, setSimText] = useState("");
  const [diagnosticsSuccess, setDiagnosticsSuccess] = useState<boolean | null>(null);

  // Play delicate hover/click audio effects locally via Web Audio API
  const playBeep = (freq = 800, type: OscillatorType = "sine", duration = 0.08) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {}
  };

  const handleProtocolClick = (id: "quantumLedger" | "neuralFirewall" | "biometricMfa" | "multisigAuth", cost: number) => {
    playBeep(securityProtocols[id] ? 500 : 1000, "triangle", 0.12);
    toggleSecurityProtocol(id, cost);
  };

  const handleAuditRequest = async () => {
    playBeep(1200, "sine", 0.15);
    setIsAuditing(true);
    // Simulate high-fidelity network lookup
    setTimeout(async () => {
      await requestSecurityAudit();
      setIsAuditing(false);
      playBeep(880, "sine", 0.25);
    }, 2000);
  };

  const handleMitigateClick = (logId: string) => {
    playBeep(980, "sawtooth", 0.15);
    mitigateThreat(logId);
  };

  const startDefenseGridSimulation = () => {
    if (isSimulating) return;
    playBeep(1500, "sawtooth", 0.25);
    setIsSimulating(true);
    setDiagnosticsSuccess(null);
    setSimProgress(0);
    setSimText("Identifying attack nodes...");

    const intervals = [
      { p: 20, t: "Auditing cryptographic security in db.json..." },
      { p: 45, t: "Quarantining malicious packets..." },
      { p: 70, t: "Running router filtering scans..." },
      { p: 90, t: "Patching cash balance exposure vectors..." },
      { p: 100, t: "Analyzing absolute shield integrity..." }
    ];

    intervals.forEach((step, idx) => {
      setTimeout(() => {
        setSimProgress(step.p);
        setSimText(step.t);
        playBeep(600 + step.p * 4, "sine", 0.06);

        if (step.p === 100) {
          setTimeout(() => {
            const success = Math.random() > 0.18; // 82% success chance
            setDiagnosticsSuccess(success);
            setIsSimulating(false);

            if (success) {
              playBeep(1000, "sine", 0.4);
              runSecuritySimulation({
                success: true,
                scoreDelta: 8,
                xpDelta: 45,
                cashDelta: 15000,
                logMessage: "📟 Defense simulation completed successfully: External attacks blocked. Bounty: +$15,000"
              });
            } else {
              playBeep(180, "sawtooth", 0.5);
              runSecuritySimulation({
                success: false,
                scoreDelta: -10,
                xpDelta: 10,
                cashDelta: -8000,
                logMessage: "🚨 Security breach in simulation: Containment Grid breached, inflicting a severe financial loss of $8,000!"
              });
            }
          }, 1000);
        }
      }, (idx + 1) * 1000);
    });
  };

  // Get dynamic colors depending on security score
  const getScoreColor = (score: number) => {
    if (score >= 85) return { text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30", hex: "#34d399" };
    if (score >= 60) return { text: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/30", hex: "#fbbf24" };
    return { text: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/30", hex: "#f87171" };
  };

  const currentTheme = getScoreColor(securityScore);

  const getThreatBadge = (level: string) => {
    switch (level) {
      case "LOW":
        return { label: "LOW RISK", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" };
      case "GUARDED":
        return { label: "GUARDED", color: "text-[#F0B90B] bg-[#F0B90B]/10 border-[#F0B90B]/30" };
      case "ELEVATED":
        return { label: "ELEVATED RISK", color: "text-amber-500 bg-amber-500/10 border-amber-500/30 animate-pulse" };
      case "CRITICAL":
        return { label: "EMERGENCY / CRITICAL", color: "text-red-500 bg-red-500/10 border-red-500/30 animate-pulse font-black" };
      default:
        return { label: "ARMED / SYSTEM MONITOR", color: "text-[#F0B90B] bg-[#F0B90B]/10 border-[#F0B90B]/30" };
    }
  };

  const threatTheme = getThreatBadge(threatLevel);

  const protocolList = [
    {
      id: "neuralFirewall" as const,
      title: "NEURAL FIREWALL",
      desc: "Continuous network scanning and API data transmission exploit blocking.",
      cost: 0,
      score: "+20%",
      icon: Cpu,
      isDefault: true
    },
    {
      id: "quantumLedger" as const,
      title: "QUANTUM LEDGER",
      desc: "Two-way cryptographic encryption and securing of db.json database file.",
      cost: 50000,
      score: "+25%",
      icon: Key,
      isDefault: false
    },
    {
      id: "biometricMfa" as const,
      title: "BIOMETRIC MFA",
      desc: "Biometric protection of operator session to prevent unauthorized access.",
      cost: 25000,
      score: "+15%",
      icon: Fingerprint,
      isDefault: false
    },
    {
      id: "multisigAuth" as const,
      title: "MULTI-SIGNATURE AUTH",
      desc: "Multi-party confirmation of security nodes for large balance transactions.",
      cost: 80000,
      score: "+25%",
      icon: Shield,
      isDefault: false
    }
  ];

  return (
    <div className="pt-24 sm:pt-32 px-4 sm:px-10 max-w-[1400px] mx-auto space-y-12 pb-40 no-scrollbar relative z-10 font-mono">
      
      {/* SYSTEM HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center border-b border-[#2B2F36] py-5 relative">
        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#F0B90B]" />
            <span className="text-[10px] font-semibold uppercase tracking-widest text-[#848E9C]">SOVEREIGN_EQUITY_SECURITY_SHIELD // SECURE_SHIELD_v4.5</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#EAECEF] tracking-tight">SECURITY_STRUCTURE</h2>
        </div>
        <div className="mt-4 md:mt-0 flex gap-3 shrink-0">
          <div className="p-3 bg-[#1E2026] border border-[#2B2F36] rounded-xl flex items-center gap-3">
             <div className="w-2.5 h-2.5 rounded-full bg-[#F0B90B] animate-ping" />
             <div className="flex flex-col text-[10px]">
                <span className="text-[#848E9C] uppercase font-bold text-[8px]">PROTECTED CAPITAL</span>
                <span className="text-[#EAECEF] font-bold font-mono">${(balance || 0).toLocaleString()}</span>
             </div>
          </div>
        </div>
      </div>

      {/* CORE TOP ROW: HUD TELEMETRY & PROTOCOLS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* LEFT COLUMN: CYBERSECURITY HUD (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <MonolithCard className="p-6 sm:p-8 flex flex-col justify-between flex-grow hover:border-[#474D57] transition-all">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#2B2F36] pb-4">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#F0B90B]" />
                  <h3 className="text-sm font-bold uppercase tracking-tight text-[#EAECEF]">SECURITY_INDEX</h3>
                </div>
                <span className="text-[8px] font-bold text-white/30 uppercase font-mono">Telemetry Active</span>
              </div>

              {/* Glowing Interactive Dial */}
              <div className="flex flex-col items-center justify-center py-6 relative">
                 <div className="relative w-44 h-44 flex items-center justify-center rounded-full border-4 border-dashed border-[#2B2F36] transition-all duration-300">
                    {/* Glowing outer aura */}
                    <div 
                      className="absolute inset-0 rounded-full blur-[20px] opacity-10 transition-colors"
                      style={{ backgroundColor: currentTheme.hex }}
                    />
                    {/* Glowing inner score ring */}
                    <svg className="absolute w-full h-full -rotate-90">
                       <circle 
                         cx="88" cy="88" r="80" 
                         stroke="#2b2f36" strokeWidth="6" 
                         fill="transparent"
                       />
                       <motion.circle 
                         cx="88" cy="88" r="80" 
                         stroke={currentTheme.hex} strokeWidth="6" 
                         fill="transparent"
                         strokeDasharray="502"
                         initial={{ strokeDashoffset: 502 }}
                         animate={{ strokeDashoffset: 502 - (502 * securityScore) / 100 }}
                         transition={{ duration: 1.2, ease: "easeOut" }}
                       />
                    </svg>

                    <div className="text-center z-10">
                      <span className={`text-4xl sm:text-5xl font-black font-mono tracking-tighter ${currentTheme.text}`}>
                        {securityScore}%
                      </span>
                      <span className="block text-[8px] font-bold text-[#848E9C] uppercase tracking-widest mt-1">SECURITY INDEX</span>
                    </div>
                 </div>
              </div>

              {/* Threat Level alert banner */}
              <div className="space-y-2">
                 <span className="text-[9px] font-semibold text-[#848E9C] uppercase tracking-wider block">CURRENT THREAT LEVEL // THREAT MATRIX</span>
                 <div className={`p-3 border rounded-xl flex items-center justify-between text-[11px] font-bold ${threatTheme.color}`}>
                    <div className="flex items-center gap-2">
                       {threatLevel === "LOW" && <CheckCircle className="w-4 h-4" />}
                       {threatLevel === "GUARDED" && <ShieldCheck className="w-4 h-4" />}
                       {threatLevel === "ELEVATED" && <AlertTriangle className="w-4 h-4" />}
                       {threatLevel === "CRITICAL" && <Flame className="w-4 h-4 animate-bounce" />}
                       <span>{threatTheme.label}</span>
                    </div>
                    <span className="text-[8px] opacity-60">SYS_SHIELD</span>
                  </div>
              </div>
            </div>

            <div className="border-t border-[#2B2F36] mt-6 pt-4 flex justify-between text-[9px] text-[#848E9C] uppercase font-mono">
              <span>XP LEVEL: {learningXP}</span>
              <span className="text-emerald-400">COMPLIANT WITH SEC REGULATIONS</span>
            </div>
          </MonolithCard>
        </div>

        {/* RIGHT COLUMN: ACTIVE PROTOCOLS GRID (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <MonolithCard className="p-6 sm:p-8 flex flex-col justify-between h-full hover:border-[#474D57] transition-all">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#2B2F36] pb-4">
                <div className="flex items-center gap-2">
                  <Key className="w-4 h-4 text-[#F0B90B]" />
                  <h3 className="text-sm font-bold uppercase tracking-tight text-[#EAECEF]">DEFENSE PROTOCOLS</h3>
                </div>
                <span className="text-[9px] font-bold text-white/30 uppercase font-mono">OPERATIONAL GRID</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 {protocolList.map(proto => {
                   const isEnabled = securityProtocols[proto.id] || false;
                   const canAfford = balance >= proto.cost;
                   const IconComponent = proto.icon;

                   return (
                     <div 
                       key={proto.id}
                       onClick={() => !proto.isDefault && handleProtocolClick(proto.id, proto.cost)}
                       className={`p-4 rounded-xl border flex flex-col justify-between transition-all duration-200 ${
                         proto.isDefault
                           ? "bg-[#2B2F36]/20 border-emerald-500/20 text-white cursor-default opacity-85"
                           : isEnabled
                             ? "bg-[#F0B90B]/5 border-[#F0B90B]/40 hover:border-[#F0B90B] text-white cursor-pointer shadow-[0_0_12px_rgba(240,185,11,0.05)]"
                             : canAfford
                               ? "bg-[#14151A] border-[#2B2F36] hover:border-[#474D57] text-[#848E9C] hover:text-white cursor-pointer"
                               : "bg-[#14151A]/50 border-[#2B2F36]/60 text-[#474D57] cursor-not-allowed opacity-60"
                       }`}
                     >
                       <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="p-2 rounded-lg bg-[#2B2F36]/60 text-[#F0B90B]">
                               <IconComponent className="w-4 h-4" />
                            </div>
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase ${
                              proto.isDefault || isEnabled
                                ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                                : "text-[#848E9C] bg-[#2B2F36]/20 border-transparent"
                            }`}>
                              {proto.isDefault ? "Always Enabled" : isEnabled ? "ACTIVE" : "INACTIVE"}
                            </span>
                          </div>
                          <div className="space-y-1">
                             <h4 className="text-[11px] font-bold text-[#EAECEF] uppercase tracking-wide">{proto.title}</h4>
                             <p className="text-[9px] text-[#848E9C] leading-normal font-sans">{proto.desc}</p>
                          </div>
                       </div>

                       <div className="border-t border-white/5 mt-4 pt-3 flex justify-between items-center text-[9px] font-mono">
                          <span className="text-[#848E9C]">SECURITY: <span className="text-[#F0B90B] font-bold">{proto.score}</span></span>
                          {!proto.isDefault && !isEnabled && (
                            <span className={`font-bold ${canAfford ? "text-[#EAECEF]" : "text-red-400"}`}>
                              ACQUIRE: ${proto.cost.toLocaleString()}
                            </span>
                          )}
                          {!proto.isDefault && isEnabled && (
                            <span className="text-[#F6465D] font-bold hover:underline">DISABLE</span>
                          )}
                          {proto.isDefault && (
                            <span className="text-emerald-400 font-bold uppercase tracking-widest text-[8.5px]">Default</span>
                          )}
                       </div>
                     </div>
                   );
                 })}
              </div>
            </div>

            <div className="p-3 bg-[#14151A] border border-[#2B2F36] rounded-xl text-[9px] text-[#848E9C] leading-normal mt-6">
              📟 <span className="text-[#F0B90B] font-bold">WARNING // SYS_PROTOCOL:</span> Enabling protocols directly consumes liquid sovereign funds but protects the system 100% against external simulated intrusions.
            </div>
          </MonolithCard>
        </div>

      </div>

      {/* LOWER GRID: THREAT LOGS, DEFENSE MINI-GAME, AI REPORT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* COLUMN 1: LIVE THREAT LOGS (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <MonolithCard className="p-6 sm:p-8 flex flex-col h-[460px] hover:border-[#474D57] transition-all">
            <div className="flex items-center justify-between border-b border-[#2B2F36] pb-4 mb-4">
              <div className="flex items-center gap-2">
                <TerminalIcon className="w-4 h-4 text-[#F0B90B]" />
                <h3 className="text-sm font-bold uppercase tracking-tight text-[#EAECEF]">THREAT WARNING PANEL // THREAT RADAR</h3>
              </div>
              <div className="flex items-center gap-2 text-[9px] text-[#848E9C] font-mono">
                 <span>ACTIVE RADAR</span>
                 <div className="status-live bg-emerald-400" />
              </div>
            </div>

            {/* Scrollable logs list */}
            <div className="flex-grow overflow-y-auto no-scrollbar space-y-3 pr-1">
               {threatLogs && threatLogs.length > 0 ? (
                 threatLogs.map(log => {
                   const isResolved = log.status === "RESOLVED";
                   const cost = log.severity === "HIGH" ? 15000 : log.severity === "MEDIUM" ? 7500 : 2500;
                   const canMitigate = balance >= cost;

                   return (
                     <div 
                       key={log.id}
                       className={`p-3.5 rounded-xl border font-mono text-[10.5px] leading-relaxed transition-all flex flex-col sm:flex-row justify-between sm:items-center gap-3 ${
                         isResolved
                           ? "bg-[#2B2F36]/10 border-emerald-500/10 text-emerald-400/80 opacity-60"
                           : log.severity === "HIGH" || log.severity === "CRITICAL"
                             ? "bg-red-500/[0.03] border-red-500/20 text-red-300"
                             : log.severity === "MEDIUM"
                               ? "bg-amber-500/[0.03] border-amber-500/20 text-amber-300"
                               : "bg-[#1E2026] border-[#2B2F36] text-[#EAECEF]"
                       }`}
                     >
                       <div className="space-y-1.5 max-w-[80%]">
                          <div className="flex items-center gap-2 text-[8px] font-bold font-mono">
                             <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 uppercase tracking-widest">{log.time}</span>
                             <span className="text-[#848E9C]">IP: {log.ip}</span>
                             <span className={`px-1.5 rounded uppercase ${
                               isResolved
                                 ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20"
                                 : log.severity === "HIGH"
                                   ? "text-red-400 bg-red-500/10 border border-red-500/20"
                                   : "text-amber-400 bg-amber-500/10 border border-amber-500/20"
                             }`}>
                               {isResolved ? "RESOLVED" : log.severity}
                             </span>
                          </div>
                          <p className="text-[11px] font-medium leading-relaxed font-sans">{log.event}</p>
                       </div>

                       <div className="shrink-0 flex items-center justify-end">
                          {isResolved ? (
                            <span className="text-[9px] font-black uppercase text-emerald-400 tracking-wider flex items-center gap-1">
                               <CheckCircle className="w-3.5 h-3.5" /> SAFE
                            </span>
                          ) : (
                            <button
                              onClick={() => handleMitigateClick(log.id)}
                              disabled={!canMitigate}
                              className={`px-3 py-1.5 rounded-lg border text-[9px] font-bold uppercase tracking-widest transition-all cursor-pointer ${
                                canMitigate
                                  ? "border-[#F0B90B] bg-[#F0B90B]/5 hover:bg-[#F0B90B] text-[#F0B90B] hover:text-black active:scale-95"
                                  : "border-[#2B2F36] text-[#474D57] cursor-not-allowed opacity-50"
                              }`}
                             >
                                MITIGATE: ${cost.toLocaleString()}
                            </button>
                          )}
                       </div>
                     </div>
                   );
                 })
               ) : (
                 <div className="h-full flex items-center justify-center text-[#474D57] text-[11px] uppercase tracking-widest">
                    No active threats detected // Threat shield 100% stable
                 </div>
               )}
            </div>
          </MonolithCard>
        </div>

        {/* COLUMN 2: ACTIVE DEFENSE GRID & AI SECURITY AUDIT (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* TOP HALF: DEFENSE SIMULATION UNIT */}
          <MonolithCard className="p-6 flex flex-col justify-between flex-grow hover:border-[#474D57] transition-all">
             <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#2B2F36] pb-3">
                   <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#F0B90B]" />
                      <h3 className="text-xs font-bold uppercase tracking-tight text-[#EAECEF]">ACTIVE DEFENSE SIMULATION // DEFENSE GRID</h3>
                   </div>
                   <span className="text-[8px] font-mono text-[#848E9C] uppercase">Diag Engine</span>
                </div>

                <p className="text-[11px] text-[#848E9C] leading-relaxed font-sans">
                   DEPLOY CYBER-DEFENSE SYSTEM: Launch a defense simulation to establish active protection. Our containment grid coordinates a defense against corporate threat actors, rewarding XP and additional capital reserve balances upon success.
                </p>

                {isSimulating && (
                  <div className="space-y-2 p-3 bg-[#14151A] border border-[#2B2F36] rounded-xl font-mono text-[9px]">
                     <div className="flex justify-between items-center text-[#F0B90B] font-bold">
                        <span>RUNNING SIMULATION...</span>
                        <span>{simProgress}%</span>
                     </div>
                     <div className="w-full h-1.5 bg-[#1E2026] rounded-full overflow-hidden border border-[#2B2F36]">
                        <motion.div 
                          className="h-full bg-[#F0B90B]"
                          style={{ width: `${simProgress}%` }}
                        />
                     </div>
                     <span className="text-[#848E9C] block italic mt-1">{simText}</span>
                  </div>
                )}

                {diagnosticsSuccess !== null && (
                  <div className={`p-3 border rounded-xl font-mono text-[10px] leading-relaxed flex items-start gap-2.5 ${
                    diagnosticsSuccess 
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                      : "bg-red-500/10 border-red-500/20 text-red-400"
                  }`}>
                    {diagnosticsSuccess ? (
                      <>
                        <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <div>
                           <span className="font-bold block uppercase tracking-wide">DEFENSE COMPLETED SUCCESSFULLY</span>
                           <span>Shield 100% restored. Sovereign fund balance secured: +$15,000, +45 XP.</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                        <div>
                           <span className="font-bold block uppercase tracking-wide">DIAGNOSTICS: DEFENSE BREACHED</span>
                           <span>System compromised. Severe financial loss of $8,000 inflicted on liquid capital. Shield vulnerable.</span>
                        </div>
                      </>
                    )}
                  </div>
                )}
             </div>

             <button
               onClick={startDefenseGridSimulation}
               disabled={isSimulating}
               className={`w-full py-3 mt-4 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer ${
                 isSimulating
                   ? "border-[#2B2F36] bg-transparent text-[#474D57] cursor-not-allowed"
                   : "border-[#F0B90B] hover:border-[#F8D33A] bg-[#F0B90B]/5 hover:bg-[#F0B90B] text-[#F0B90B] hover:text-black active:scale-95"
               }`}
             >
                <RefreshCw className={`w-3.5 h-3.5 ${isSimulating ? "animate-spin" : ""}`} />
                {isSimulating ? "SYNCHRONIZING..." : "LAUNCH DEFENSE // LAUNCH DEFENSE"}
             </button>
          </MonolithCard>

          {/* BOTTOM HALF: NEURAL CYBERSECURITY AUDIT */}
          <MonolithCard className="p-6 flex flex-col justify-between flex-grow hover:border-[#474D57] transition-all">
             <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#2B2F36] pb-3">
                   <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-[#F0B90B]" />
                      <h3 className="text-xs font-bold uppercase tracking-tight text-[#EAECEF]">AI SECURITY AUDIT REPORT // AI SECURITY ORACLE</h3>
                   </div>
                   <span className="text-[8px] font-mono text-[#848E9C] uppercase">Gemini Intel</span>
                </div>

                <div className="p-4 bg-[#14151A] border border-[#2B2F36] rounded-xl text-[10.5px] font-mono leading-relaxed h-[130px] overflow-y-auto no-scrollbar relative">
                   {isAuditing ? (
                     <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#14151A] text-amber-400 gap-2 font-mono text-[9px] uppercase tracking-widest">
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Scanning shield structures...</span>
                     </div>
                   ) : null}
                   
                   <span className="text-[#848E9C] block text-[8px] border-b border-white/5 pb-1 mb-2 font-mono uppercase tracking-widest">
                      Latest AI Security Audit Report
                   </span>
                   <p className="text-[#EAECEF] font-mono leading-relaxed whitespace-pre-line text-[10.5px]">
                      {securityAuditText}
                   </p>
                </div>
             </div>

             <button
               onClick={handleAuditRequest}
               disabled={isAuditing}
               className={`w-full py-3 mt-4 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer ${
                 isAuditing
                   ? "border-[#2B2F36] bg-transparent text-[#474D57] cursor-not-allowed"
                   : "border-[#F0B90B]/25 hover:border-[#F0B90B]/60 bg-[#F0B90B]/5 hover:bg-[#F0B90B]/10 text-[#F0B90B]"
               }`}
             >
                <TerminalIcon className="w-3.5 h-3.5" />
                {isAuditing ? "SUBMITTING REQUEST..." : "SUBMIT AUDIT // AI SECURITY AUDIT"}
             </button>
          </MonolithCard>

        </div>

      </div>

    </div>
  );
}
