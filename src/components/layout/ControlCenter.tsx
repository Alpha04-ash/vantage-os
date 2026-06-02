"use client";
import React, { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useVantageStore } from "@/store/useVantageStore";
import { 
  Activity, Brain, Layers, RefreshCw, ShieldCheck, Fingerprint, Award, TrendingUp, AlertTriangle, Cpu, HelpCircle
} from "lucide-react";
import { CryptoPrice } from "@/services/market";
import { MonolithCard } from "./SovereignUI";
import { Brain3D } from "./Brain3D";
import { generateMacroeconomicNews, MacroeconomicNews } from "@/services/aiOracle";

function StatCard({ label, value, subValue, trend, icon: Icon }: any) {
  const isPositive = trend > 0;
  return (
    <MonolithCard className="p-5 sm:p-8 group hover:border-[#474D57] transition-all">
      <div className="flex justify-between items-start mb-4">
         <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#848E9C]">{label.toString()}</span>
         {Icon && <Icon className="w-4 h-4 text-[#474D57] group-hover:text-[#848E9C] transition-colors" />}
      </div>
      <h3 className="text-2xl sm:text-3xl font-bold text-[#EAECEF] mb-2 font-[var(--font-ibm-plex-mono)] tracking-tight">{value.toString()}</h3>
      <div className="flex items-center gap-3">
         {trend != null && (
            <div className={`text-xs font-bold font-mono flex items-center gap-1 ${isPositive ? "text-[#F0B90B]" : "text-[#F6465D]"}`}>
               <span>{isPositive ? "▲" : "▼"}</span>
               <span>{Math.abs(trend)}%</span>
            </div>
         )}
         <div className="text-[10px] text-[#474D57] uppercase tracking-wider truncate">{(subValue || "").toString()}</div>
      </div>
    </MonolithCard>
  );
}

export function ControlCenter({ prices, isSyncing, onSync }: { prices: CryptoPrice[], isSyncing: boolean, onSync: () => void }) {
  const { balance, portfolio, learningXP, portfolioAudit, properties, achievements, activeLoan } = useVantageStore();

  const [news, setNews] = useState<MacroeconomicNews | null>(null);
  const [isLoadingNews, setIsLoadingNews] = useState(false);

  const portfolioMarketValue = useMemo(() => {
    if (!Array.isArray(portfolio)) return 0;
    return portfolio.reduce((total, asset) => {
      const currentPrice = prices?.find(p => p.id === asset.id)?.current_price || asset.avgPrice || 0;
      return total + ((asset.amount || 0) * currentPrice);
    }, 0);
  }, [portfolio, prices]);

  const propertiesValue = useMemo(() => {
    if (!Array.isArray(properties)) return 0;
    return properties.reduce((total, prop) => {
      return total + ((prop.owned || 0) * (prop.currentValue || 0) * (prop.appreciationMultiplier || 1.0));
    }, 0);
  }, [properties]);

  const marketFlux = useMemo(() => {
    if (!prices || prices.length === 0) return 0;
    return prices.reduce((acc, p) => acc + p.price_change_percentage_24h, 0) / prices.length;
  }, [prices]);

  const totalNetWorth = (balance || 0) + portfolioMarketValue + propertiesValue - (activeLoan ? activeLoan.totalDue : 0);
  const isMarketPositive = marketFlux >= 0;

  const fetchNews = async () => {
    setIsLoadingNews(true);
    try {
      const symbol = portfolio && portfolio.length > 0 
        ? portfolio[Math.floor(Math.random() * portfolio.length)].symbol 
        : "BTC";
      const currentPrice = prices?.find(p => p.id === symbol.toLowerCase())?.current_price || 63500;
      const report = await generateMacroeconomicNews(symbol, currentPrice);
      setNews(report);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingNews(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [prices]);

  const activeAchievements = useMemo(() => {
    return achievements || [];
  }, [achievements]);

  return (
    <div className="pt-20 sm:pt-24 px-4 sm:px-8 max-w-[1400px] mx-auto space-y-6 pb-24 no-scrollbar">
      {/* PAGE HEADER — Binance style */}
      <div className="flex justify-between items-center py-5 border-b border-[#2B2F36]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Fingerprint className="w-3.5 h-3.5 text-[#F0B90B]" />
            <span className="text-[10px] font-semibold uppercase tracking-widest text-[#848E9C]">MISSION_DIRECTIVE_ACTIVE</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#EAECEF] tracking-tight">YOUR NET WORTH DASHBOARD</h1>
        </div>

        <button 
          onClick={onSync}
          className="w-10 h-10 bg-[#2B2F36] border border-[#474D57] rounded-lg flex items-center justify-center hover:border-[#F0B90B]/40 hover:bg-[#2B2F36] transition-all group"
        >
          <RefreshCw className={`w-4 h-4 text-[#848E9C] group-hover:text-[#F0B90B] ${isSyncing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* MISSION GOAL TRACKER */}
      <MonolithCard className="p-4 sm:p-6 bg-gradient-to-r from-[#1E2026] to-[#24262E] border border-[#2B2F36] hover:border-[#F0B90B]/30 transition-all">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#F0B90B]/10 flex items-center justify-center border border-[#F0B90B]/20">
              <span className="text-[#F0B90B] text-xs font-black">🎯</span>
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-[#EAECEF] tracking-wider uppercase">Mission: The Millionaire Run</h4>
              <p className="text-[10px] text-[#848E9C]">Reach $1,000,000 net worth and avoid bankruptcy to win.</p>
            </div>
          </div>
          <div className="text-right sm:text-right font-mono text-[10px] text-[#848E9C]">
            <span className="text-[#F0B90B] font-bold text-xs">${totalNetWorth.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span> / $1,000,000
          </div>
        </div>
        <div className="relative w-full h-3 bg-[#2B2F36] rounded-full overflow-hidden border border-white/5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, Math.max(0, (totalNetWorth / 1000000) * 100))}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="h-full rounded-full bg-gradient-to-r from-[#F0B90B]/80 to-[#F0B90B] shadow-[0_0_10px_rgba(240,185,11,0.3)]"
          />
        </div>
        <div className="flex justify-between items-center mt-2.5 text-[9px] font-bold tracking-wider text-[#474D57]">
          <span>START: $100,000</span>
          <span className="text-[#F0B90B]">{(Math.min(100, Math.max(0, (totalNetWorth / 1000000) * 100))).toFixed(1)}% COMPLETED</span>
          <span>GOAL: $1,000,000</span>
        </div>
      </MonolithCard>

      {/* DEBT / BANKRUPTCY CONSEQUENCE WARNING */}
      {totalNetWorth <= 0 && (
        <div className="p-4 bg-[#F6465D]/10 border border-[#F6465D]/30 rounded-xl flex items-start gap-3.5 text-[#F6465D] shadow-[0_4px_20px_rgba(246,70,93,0.15)] animate-pulse">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-xs font-black uppercase tracking-wider">CRITICAL DIRECTIVE: INSOLVENCY / TECHNICAL BANKRUPTCY</h4>
            <p className="text-[10.5px] text-[#848E9C] leading-relaxed">
              Your active liabilities exceed your total asset valuation. Your net worth has dropped below <span className="text-[#F6465D] font-black font-mono">$0</span>. Your Gemini AI financial adviser warns that you must liquidate crypto assets or sell property units immediately to recover a positive balance.
            </p>
          </div>
        </div>
      )}

      {activeLoan && activeLoan.timeLeft <= 10 && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-start gap-3.5 text-amber-500 shadow-[0_4px_20px_rgba(245,158,11,0.15)]">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 animate-pulse" />
          <div className="space-y-1">
            <h4 className="text-xs font-black uppercase tracking-wider">LIABILITY DEFAULT HAZARD</h4>
            <p className="text-[10.5px] text-[#848E9C] leading-relaxed">
              Your outstanding loan of <span className="font-bold text-[#F0B90B] font-mono">${activeLoan.totalDue.toLocaleString()}</span> has less than <span className="text-white font-bold">{activeLoan.timeLeft} cycles</span> left before structural default. Go to the **RESERVES** view to repay your debt and avoid a default score penalty!
            </p>
          </div>
        </div>
      )}

      {/* STAT CARDS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Total Capital Value" value={`$${totalNetWorth.toLocaleString()}`} subValue="Cash + Portfolio" trend={14.2} icon={Layers} />
        <StatCard label="Free Liquid Cash"  value={`$${(balance || 0).toLocaleString()}`} subValue="Available to invest" icon={Activity} />
        <StatCard label="Academy Level" value={`Level ${Math.floor(learningXP / 100) + 1}`} subValue={`${100 - (learningXP % 100)} XP to next level`} icon={Brain} />
      </div>

      {/* ROW 2: AI AUDIT & IMPACT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
         {/* Portfolio Analysis */}
         <div className="lg:col-span-8">
            <MonolithCard className="p-5 sm:p-8 h-full">
                <div className="flex items-center justify-between mb-6">
                   <div className="flex items-center gap-3">
                      <Brain className="w-5 h-5 text-[#F0B90B]" />
                      <h3 className="text-base sm:text-xl font-bold uppercase tracking-tight text-[#EAECEF]">NEURAL PORTFOLIO AUDIT</h3>
                   </div>
                   <div className="w-12 h-12 sm:w-16 sm:h-16">
                      <Brain3D />
                   </div>
                </div>
                <div className="space-y-6">
                   <p className="text-sm text-[#848E9C] leading-relaxed border-l-2 border-[#F0B90B]/30 pl-4 py-1">
                     {portfolioAudit || 'Your neural portfolio audit will appear here after your first investment. The artificial intelligence will analyze your risk posture and generate tactical allocations.'}
                   </p>
                   <div className="grid grid-cols-2 gap-4 pt-2">
                      {/* Market Flux */}
                      <div className="bg-[#2B2F36] rounded-lg p-4">
                         <div className="text-[10px] font-semibold uppercase tracking-widest text-[#848E9C] mb-2">Market_Volatility</div>
                         <div className={`text-2xl sm:text-3xl font-bold font-mono ${isMarketPositive ? 'text-[#F0B90B]' : 'text-[#F6465D]'}`}>
                            {marketFlux > 0 ? '+' : ''}{marketFlux.toFixed(2)}%
                         </div>
                      </div>
                      {/* Portfolio Status */}
                      <div className="bg-[#2B2F36] rounded-lg p-4">
                         <div className="text-[10px] font-semibold uppercase tracking-widest text-[#848E9C] mb-2">Portfolio_Status</div>
                         <div className={`text-2xl sm:text-3xl font-bold font-mono ${portfolio.length > 0 ? 'text-[#F0B90B]' : 'text-[#848E9C]'}`}>
                           {portfolio.length > 0 ? 'ACTIVE' : 'INACTIVE'}
                         </div>
                      </div>
                   </div>
                </div>
            </MonolithCard>
         </div>

         {/* Impact Indicators */}
         <div className="lg:col-span-4">
            <MonolithCard className="p-5 sm:p-8 h-full">
               <div className="flex items-center gap-3 mb-6">
                  <ShieldCheck className="w-4 h-4 text-[#F0B90B]" />
                  <h3 className="text-base font-bold uppercase tracking-tight text-[#EAECEF]">IMPACT STATUS INDICATORS</h3>
               </div>
               <div className="space-y-6">
                 {[
                   { label: "Institutional_Impact", val: 88 },
                   { label: "Resource_Efficiency",    val: 94 }
                 ].map(s => (
                   <div key={s.label} className="space-y-2">
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
      </div>

      {/* ROW 3: VANTAGE AI NEWS WIRE & SOVEREIGN ACHIEVEMENTS MATRIX */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
         {/* AI Macro News Wire */}
         <div className="lg:col-span-5">
            <MonolithCard className="p-5 sm:p-8 h-full flex flex-col justify-between">
               <div>
                  <div className="flex items-center justify-between mb-6">
                     <div className="flex items-center gap-3">
                        <Cpu className="w-5 h-5 text-[#F0B90B]" />
                        <h3 className="text-base sm:text-xl font-bold uppercase tracking-tight text-[#EAECEF]">
                           VANTAGE AI MACRO WIRE
                        </h3>
                     </div>
                     <button
                        onClick={fetchNews}
                        disabled={isLoadingNews}
                        className="p-2 bg-[#2B2F36] hover:bg-[#212429] border border-[#474D57] rounded-md transition-all active:scale-95 disabled:opacity-50"
                     >
                        <RefreshCw className={`w-3.5 h-3.5 text-[#848E9C] ${isLoadingNews ? "animate-spin text-[#F0B90B]" : ""}`} />
                     </button>
                  </div>

                  <div className="space-y-4">
                     {news ? (
                        <motion.div
                           initial={{ opacity: 0, y: 10 }}
                           animate={{ opacity: 1, y: 0 }}
                           className="space-y-3"
                        >
                           <div className="flex items-center gap-2">
                              <span className={`text-[10px] px-2 py-0.5 rounded font-bold font-mono tracking-wider ${
                                 news.sentiment === "BULLISH" ? "bg-[#0ECB81]/15 text-[#0ECB81] border border-[#0ECB81]/30" :
                                 news.sentiment === "BEARISH" ? "bg-[#F6465D]/15 text-[#F6465D] border border-[#F6465D]/30" :
                                 "bg-[#848E9C]/15 text-[#848E9C] border border-[#848E9C]/30"
                              }`}>
                                 {news.sentiment}
                              </span>
                              <span className="text-[10px] text-[#474D57] font-mono">{news.timestamp}</span>
                           </div>

                           <h4 className="text-base sm:text-lg font-bold text-[#EAECEF] leading-snug font-[var(--font-ibm-plex-mono)]">
                              {news.headline}
                           </h4>
                           <p className="text-xs sm:text-sm text-[#848E9C] leading-relaxed">
                              {news.description}
                           </p>

                           {/* Sentiment score bar */}
                           <div className="pt-2 space-y-1">
                              <div className="flex justify-between text-[9px] text-[#848E9C] font-semibold tracking-wider">
                                 <span>BEARISH</span>
                                 <span className="font-bold text-[#EAECEF] font-mono">{news.sentimentScore}%</span>
                                 <span>BULLISH</span>
                               </div>
                               <div className="w-full bg-[#2B2F36] h-1.5 rounded-full overflow-hidden relative">
                                  <motion.div
                                     initial={{ width: 0 }}
                                     animate={{ width: `${news.sentimentScore}%` }}
                                     transition={{ duration: 0.8, ease: "easeOut" }}
                                     className={`h-full rounded-full ${
                                        news.sentiment === "BULLISH" ? "bg-[#0ECB81]" :
                                        news.sentiment === "BEARISH" ? "bg-[#F6465D]" :
                                        "bg-[#848E9C]"
                                     }`}
                                  />
                               </div>
                            </div>
                         </motion.div>
                      ) : (
                         <div className="py-12 text-center text-xs text-[#474D57] uppercase tracking-widest">
                            Awaiting neural broadcast...
                         </div>
                      )}
                   </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#2B2F36] flex items-center gap-2.5 text-[#474D57]">
                   <TrendingUp className="w-4 h-4 text-[#F0B90B]/50" />
                   <span className="text-[10px] font-semibold uppercase tracking-wider">
                      SOVEREIGN MACRO ANALYSIS ONLINE
                   </span>
                </div>
             </MonolithCard>
          </div>

          {/* Achievements Matrix Grid */}
          <div className="lg:col-span-7">
             <MonolithCard className="p-5 sm:p-8 h-full">
                <div className="flex items-center gap-3 mb-6">
                   <Award className="w-5 h-5 text-[#F0B90B]" />
                   <h3 className="text-base sm:text-xl font-bold uppercase tracking-tight text-[#EAECEF]">
                      SOVEREIGN ACHIEVEMENTS MATRIX
                   </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[350px] overflow-y-auto pr-1 no-scrollbar">
                   {activeAchievements.map((ach) => {
                      const isUnlocked = !!ach.unlockedAt;
                      return (
                         <motion.div
                            key={ach.id}
                            whileHover={{ scale: 1.015 }}
                            className={`p-4 rounded-lg border text-left cursor-pointer transition-all duration-300 ${
                               isUnlocked 
                                  ? "bg-[#F0B90B]/5 border-[#F0B90B]/30 hover:border-[#F0B90B]/50" 
                                  : "bg-[#1E2026] border-[#2B2F36] hover:border-[#474D57]/60"
                            }`}
                         >
                            <div className="flex items-start gap-3">
                               <div className={`p-2 rounded-md ${
                                  isUnlocked ? "bg-[#F0B90B]/10 text-[#F0B90B]" : "bg-[#2B2F36] text-[#474D57]"
                               }`}>
                                  <Award className="w-4 h-4" />
                               </div>
                               <div className="space-y-1.5 flex-1">
                                  <div className="flex justify-between items-center gap-2">
                                     <h4 className={`text-xs sm:text-sm font-bold truncate ${
                                        isUnlocked ? "text-[#EAECEF]" : "text-[#848E9C]"
                                     }`}>
                                        {ach.title}
                                     </h4>
                                     {isUnlocked && (
                                        <span className="text-[9px] font-mono text-[#F0B90B] bg-[#F0B90B]/10 px-1.5 py-0.5 rounded font-bold uppercase">
                                           +{ach.xpReward} XP
                                        </span>
                                     )}
                                  </div>
                                  <p className="text-[10px] sm:text-xs text-[#848E9C] leading-normal line-clamp-2">
                                     {ach.description}
                                  </p>

                                  {/* Progress indicator */}
                                  <div className="space-y-1 pt-1">
                                     <div className="flex justify-between text-[8px] font-semibold text-[#474D57] font-mono uppercase tracking-wider">
                                        <span>Progress</span>
                                        <span>
                                           {ach.current.toLocaleString()} / {ach.target.toLocaleString()} ({ach.progress}%)
                                        </span>
                                     </div>
                                     <div className="w-full bg-[#2B2F36] h-1 rounded-full overflow-hidden">
                                        <div 
                                           className={`h-full transition-all duration-500 rounded-full ${
                                              isUnlocked ? "bg-[#F0B90B]" : "bg-[#848E9C]/40"
                                           }`}
                                           style={{ width: `${ach.progress}%` }}
                                        />
                                     </div>
                                  </div>
                               </div>
                            </div>
                         </motion.div>
                      );
                   })}
                </div>
             </MonolithCard>
          </div>
       </div>
    </div>
  );
}
