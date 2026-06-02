"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useVantageStore } from "@/store/useVantageStore";
import { motion } from "framer-motion";
import { 
  Wallet, Shield, Activity, TrendingUp, TrendingDown, RefreshCw, 
  Layers, Zap, Fingerprint, Lock, ShieldCheck, BarChart3, Clock,
  ArrowUpRight, Target, Brain, Box, Cpu, HardHat, Gauge, Building, Home
} from "lucide-react";
import { MonolithCard, Typewriter, AssetIcon } from "./SovereignUI";

function AssetNode({ asset }: { asset: any }) {
  const amount = asset?.amount ?? 0;
  const avgPrice = asset?.avgPrice ?? 0;
  const isCorporate = asset?.isCorporate ?? false;
  const isProperty = asset?.isProperty ?? false;

  let cardStyle = "border-sky-500/10 hover:border-sky-500/30 hover:shadow-[0_0_20px_rgba(14,165,233,0.03)]";
  let accentColor = "text-sky-400";
  let pulseColor = "bg-sky-400";
  let bgGradient = "";
  let badgeText = "CRYPTO ASSET // CRYPTO_NODE";

  if (isCorporate) {
    cardStyle = "border-[#F0B90B]/20 hover:border-[#F0B90B]/50 hover:shadow-[0_0_25px_rgba(240,185,11,0.06)]";
    accentColor = "text-[#F0B90B]";
    pulseColor = "bg-[#F0B90B]";
    bgGradient = "bg-gradient-to-br from-[#1E2026] via-[#1E2026] to-[#F0B90B]/[0.02]";
    badgeText = "EMPIRE NODE // EMPIRE_NODE";
  } else if (isProperty) {
    cardStyle = "border-emerald-500/20 hover:border-emerald-500/50 hover:shadow-[0_0_25px_rgba(16,185,129,0.06)]";
    accentColor = "text-emerald-400";
    pulseColor = "bg-emerald-400";
    bgGradient = "bg-gradient-to-br from-[#1E2026] via-[#1E2026] to-emerald-500/[0.02]";
    badgeText = "REAL ESTATE ASSET // REAL_ESTATE";
  }

  return (
    <motion.div 
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`bg-[#1E2026] border rounded-xl p-6 group cursor-pointer h-full relative overflow-hidden transition-all duration-300 ${cardStyle} ${bgGradient}`}
    >
       {/* Background Vector Art HUD */}
       <div className="absolute inset-0 opacity-[0.01] group-hover:opacity-[0.02] pointer-events-none transition-opacity duration-300 neural-grid" />
       
       {/* Floating Corner icon */}
       <div className="absolute top-0 right-0 p-5 opacity-[0.06] group-hover:opacity-20 transition-all duration-300">
          {isCorporate ? (
            <Building className="w-10 h-10 text-[#F0B90B] animate-pulse" />
          ) : isProperty ? (
            <Home className="w-10 h-10 text-emerald-400" />
          ) : (
            <Cpu className="w-10 h-10 text-sky-400" />
          )}
       </div>
       
       <div className="flex items-center gap-4 mb-6 relative z-10">
          {isCorporate ? (
            <div className="w-10 h-10 bg-[#F0B90B]/10 border border-[#F0B90B]/25 flex items-center justify-center rounded-lg shadow-[0_0_15px_rgba(240,185,11,0.05)]">
                <Building className="w-5 h-5 text-[#F0B90B]" />
            </div>
          ) : isProperty ? (
            <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.05)]">
                <Home className="w-5 h-5 text-emerald-400" />
            </div>
          ) : (
            <AssetIcon src={asset?.image || ""} symbol={asset?.symbol} />
          )}
          
          <div className="space-y-0.5">
             <h4 className={`text-sm font-black uppercase tracking-wider ${accentColor}`}>
                  {(asset?.symbol || "").toString()}
              </h4>
              <div className="text-[8px] font-bold uppercase tracking-[0.15em] text-[#848E9C] font-mono whitespace-nowrap">
                  {badgeText}
              </div>
          </div>
       </div>

       <div className="space-y-4 mb-6 relative z-10">
          <div>
             <div className="text-[9px] font-semibold uppercase tracking-widest text-[#848E9C] mb-1 font-mono">
                {isCorporate ? "Enterprises Owned" : isProperty ? "Property Units Owned" : "Active Nodes Owned"}
             </div>
             <div className="text-xl font-black font-mono text-[#EAECEF]">
               {amount.toLocaleString()} <span className="text-[10px] text-[#474D57] font-normal uppercase tracking-widest ml-1">{isCorporate ? "units" : isProperty ? "props" : "nodes"}</span>
             </div>
          </div>
          <div>
             <div className="text-[9px] font-semibold uppercase tracking-widest text-[#848E9C] mb-1 font-mono">
                {isCorporate ? "Current Market Valuation" : isProperty ? "Total Portfolio Valuation" : "Capital Valuation"}
             </div>
             <div className="text-xl font-black font-mono text-[#EAECEF] flex items-baseline gap-1">
                 ${(amount * avgPrice).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                 {isProperty && asset.rentedCount > 0 && (
                   <span className="text-[9px] font-bold text-emerald-400 font-mono ml-2 lowercase tracking-wider bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded">
                     leasing active
                   </span>
                 )}
              </div>
          </div>
       </div>

       {/* Telemetry Visual Graph */}
       <div className="flex items-end gap-1.5 h-8 opacity-25 group-hover:opacity-60 transition-all duration-300 relative z-10">
          {[40, 75, 45, 90, 65, 35, 80, 55, 95, 70].map((h, i) => (
            <motion.div 
              key={i} 
              className={`flex-1 rounded-[1px] ${isCorporate ? "bg-[#F0B90B]" : isProperty ? "bg-emerald-400" : "bg-sky-400"}`} 
              initial={{ height: 0 }}
              animate={{ height: `${h}%` }}
              transition={{ delay: i * 0.04, repeat: Infinity, repeatType: 'reverse', duration: 1.8 }}
            />
          ))}
       </div>

       <div className="mt-5 pt-4 border-t border-[#2B2F36] flex justify-between items-center text-[9px] font-semibold uppercase tracking-widest relative z-10 font-mono">
          <span className="text-[#848E9C]">Node Telemetry</span>
          <span className={`${accentColor} flex items-center gap-1.5 font-bold`}>
             <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${pulseColor}`} />
             {isCorporate ? "OPTIMAL_ECONOMIC_ROI" : isProperty ? "LEASING_ACTIVE" : "LIVE_MARKET_TRADE"}
          </span>
       </div>
    </motion.div>
  );
}

export function PortfolioView() {
  const { balance, portfolio, infrastructure, properties, portfolioAudit, requestPortfolioAudit } = useVantageStore();
  const [ticker, setTicker] = useState(60);

  useEffect(() => {
    const interval = setInterval(() => setTicker(t => t <= 1 ? 60 : t - 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const combinedAssets = useMemo(() => {
    const corporateAssets = (infrastructure || [])
      .filter(node => node.owned > 0)
      .map(node => {
        const currentCost = node.cost * Math.pow(1.5, node.owned - 1);
        const multiplier = node.customYieldMultiplier ?? 1.0;
        const currentValuation = currentCost * multiplier;
        
        let sym = "SAAS";
        if (node.type === "orbital_satellite") sym = "PROP";
        else if (node.type === "quantum_rig") sym = "DEFI";
        else if (node.type === "ai_cluster") sym = "AGI";

        return {
          id: node.id,
          symbol: sym,
          name: node.name,
          amount: node.owned,
          avgPrice: currentValuation,
          image: "",
          isCorporate: true,
          type: node.type,
        };
      });

    const propertyAssets = (properties || [])
      .filter(p => p.owned > 0)
      .map(p => {
        const currentValuation = p.currentValue * (p.appreciationMultiplier ?? 1.0);
        return {
          id: p.id,
          symbol: p.type === "residential" ? "HOME" : "LUX",
          name: p.name,
          amount: p.owned,
          avgPrice: currentValuation,
          image: "",
          isProperty: true,
          type: p.type,
          rentedCount: p.rentedCount ?? 0
        };
      });

    return [...(portfolio || []), ...corporateAssets, ...propertyAssets];
  }, [portfolio, infrastructure, properties]);

  const totalMarketValue = useMemo(() => {
    return combinedAssets.reduce((acc, a) => acc + ((a?.amount ?? 0) * (a?.avgPrice ?? 0)), 0);
  }, [combinedAssets]);

  const safeBalance = balance ?? 0;

  return (
    <div className="pt-20 sm:pt-24 px-4 sm:px-8 max-w-[1500px] mx-auto space-y-6 pb-32 no-scrollbar">
      {/* VAULT HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 py-5 border-b border-[#2B2F36]">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <Box className="w-3.5 h-3.5 text-[#F0B90B]" />
             <span className="text-[10px] font-semibold uppercase tracking-widest text-[#848E9C]">ASSET_TREASURY_SYSTEM</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#EAECEF] tracking-tight">TREASURY_MATRIX</h2>
        </div>

        <div className="flex items-center gap-4">
           <div className="text-right">
              <div className="text-[10px] font-semibold uppercase tracking-widest text-[#848E9C] mb-0.5">Liquid_Sovereign_Cash</div>
              <div className="text-xl sm:text-2xl font-bold font-mono text-[#EAECEF]">${safeBalance.toLocaleString()}</div>
           </div>
           <button onClick={() => requestPortfolioAudit()} className="w-10 h-10 bg-[#2B2F36] border border-[#474D57] rounded-lg flex items-center justify-center hover:border-[#F0B90B]/40 transition-all group">
              <RefreshCw className="w-4 h-4 text-[#848E9C] group-hover:text-[#F0B90B]" />
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
         {/* AUDIT PANEL */}
         <div className="lg:col-span-4 space-y-4">
            <MonolithCard className="p-5 sm:p-8">
               <div className="flex items-center gap-3 mb-5">
                  <Brain className="w-4 h-4 text-[#F0B90B]" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#EAECEF]">TREASURY_AUDIT</h3>
               </div>
               <p className="text-sm leading-relaxed text-[#848E9C] mb-5 border-l-2 border-[#F0B90B]/30 pl-4 py-1 min-h-[80px]">
                  <Typewriter text={portfolioAudit || "Scanning vault sectors for systemic vulnerabilities..."} />
               </p>
               <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#2B2F36]">
                  <div className="bg-[#2B2F36] rounded-lg p-3">
                      <div className="text-[9px] font-semibold uppercase tracking-widest text-[#848E9C] mb-1">Capital_Valuation</div>
                      <div className="text-base font-bold font-mono text-[#EAECEF]">${totalMarketValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                  </div>
                  <div className="bg-[#2B2F36] rounded-lg p-3">
                     <div className="text-[9px] font-semibold uppercase tracking-widest text-[#848E9C] mb-1">Systemic_Risk_Index</div>
                     <div className="text-base font-bold font-mono text-[#F0B90B]">0.24</div>
                  </div>
               </div>
            </MonolithCard>

            <MonolithCard className="p-5 sm:p-8 space-y-5">
               <div className="flex items-center gap-2">
                  <Gauge className="w-4 h-4 text-[#F0B90B]" />
                  <h4 className="text-xs font-bold uppercase tracking-widest text-[#EAECEF]">PERFORMANCE_DIAGNOSTICS</h4>
               </div>
               <div className="space-y-4">
                 {[
                   { label: "Extraction_Speed", val: 94 },
                   { label: "Treasury_Security", val: 98 },
                   { label: "System_Efficiency", val: 82 }
                 ].map(s => (
                   <div key={s.label} className="space-y-1.5">
                      <div className="flex justify-between text-[10px] font-semibold uppercase tracking-widest">
                         <span className="text-[#848E9C]">{s.label}</span>
                         <span className="text-[#F0B90B] font-mono">{s.val}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-[#2B2F36] rounded-full overflow-hidden">
                         <motion.div
                           initial={{ width: 0 }}
                           animate={{ width: `${s.val}%` }}
                           transition={{ duration: 1.2, ease: "easeOut" }}
                           className="h-full bg-[#F0B90B] rounded-full"
                         />
                      </div>
                   </div>
                 ))}
               </div>
            </MonolithCard>
         </div>

         {/* ASSET NODE GRID */}
         <div className="lg:col-span-8 space-y-8">
              <div className="flex items-center justify-between">
                 <span className="text-[10px] font-semibold uppercase tracking-widest text-[#848E9C]">ACTIVE_ASSET_NODES</span>
                 <div className="text-[10px] font-mono text-[#F0B90B] flex items-center gap-2">
                    <div className="status-live" />
                    LIVE_TELEMETRY
                 </div>
              </div>

              {combinedAssets.length === 0 ? (
                 <MonolithCard className="p-8 sm:p-32 flex flex-col items-center justify-center gap-4 text-center">
                    <Fingerprint className="w-16 h-16 text-[#2B2F36]" />
                    <p className="text-xs font-semibold uppercase tracking-widest text-[#474D57]">Acquire digital or physical assets to map nodes</p>
                 </MonolithCard>
              ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {combinedAssets.map((asset) => (
                    <AssetNode key={asset.id} asset={asset} />
                  ))}
               </div>
             )}
         </div>
      </div>
    </div>
  );
}
