"use client";
import React, { useState, useMemo } from "react";
import { useVantageStore } from "@/store/useVantageStore";
import { motion } from "framer-motion";
import { 
  Landmark, ShieldAlert, Brain, TrendingUp, Coins, 
  AlertCircle, CheckCircle2, DollarSign, Percent, Scale
} from "lucide-react";
import { MonolithCard, Typewriter, SovereignButton } from "./SovereignUI";
import { generateCreditDecision, CreditDecision } from "@/services/aiOracle";

export function BankView() {
  const { 
    balance, 
    infrastructure, 
    portfolio, 
    savingsDeposited, 
    activeLoan,
    depositSavings,
    withdrawSavings,
    applyForLoan,
    repayLoan 
  } = useVantageStore();

  // Savings form state
  const [savingsInput, setSavingsInput] = useState("");
  const [savingsAction, setSavingsAction] = useState<"deposit" | "withdraw">("deposit");

  // Loan form state
  const [loanAmount, setLoanAmount] = useState<number>(50000);
  const [loanTerm, setLoanTerm] = useState<number>(300); // 90, 180, 360 days
  const [loanPurpose, setLoanPurpose] = useState<string>("");
  const [customPurpose, setCustomPurpose] = useState<string>("");

  // Underwriting states
  const [isUnderwriting, setIsUnderwriting] = useState(false);
  const [underwritingStatus, setUnderwritingStatus] = useState("");
  const [decision, setDecision] = useState<CreditDecision | null>(null);

  // Suggested Purposes
  const SUGGESTED_PURPOSES = [
    { label: "Ливерҷи Даромади DeFi", text: "Барои ворид кардани пардохтпазирии қарзӣ ба ҳавзҳои арбитражии DeFi баҳри гирифтани фоидаи фаврӣ." },
    { label: "Тавсеаи Инфрасохтори SaaS", text: "Барои маблағгузории тавсеаи инфрасохтори нармафзор ва васеъ кардани нишондиҳандаҳои LTV ва CAC." },
    { label: "Orbital Satellite Acquisition", text: "Барои таъмини хароҷоти сармоявӣ ҷиҳати харидани нуқтаҳои иловагии тасвирсозии PropTech." }
  ];

  // Calculate Net Worth / Total Equity
  const totalEquity = useMemo(() => {
    const tokenVal = (portfolio || []).reduce((sum, a) => sum + ((a?.amount ?? 0) * (a?.avgPrice ?? 0)), 0);
    const corpVal = (infrastructure || [])
      .filter(n => n.owned > 0)
      .reduce((sum, node) => {
        const currentCost = node.cost * Math.pow(1.5, node.owned - 1);
        const multiplier = node.customYieldMultiplier ?? 1.0;
        return sum + (currentCost * multiplier);
      }, 0);
    return balance + tokenVal + corpVal;
  }, [balance, portfolio, infrastructure]);

  const handleDepositSavings = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(savingsInput);
    if (isNaN(val) || val <= 0) return;
    if (savingsAction === "deposit") {
      if (val > balance) return;
      depositSavings(val);
    } else {
      if (val > (savingsDeposited ?? 0)) return;
      withdrawSavings(val);
    }
    setSavingsInput("");
  };

  const handleApplyLoan = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalPurpose = loanPurpose === "custom" ? customPurpose : loanPurpose;
    if (!finalPurpose.trim()) return;

    setIsUnderwriting(true);
    setDecision(null);

    const statuses = [
      "Пайвастшавӣ ба шабакаи марказии Соҳибихтиёрӣ...",
      "Таҳлили ҳаҷми умумии захираҳои гаравии оператор...",
      "Симулятсияи гардиши пулии пардохтҳо дар давраи қарзӣ...",
      "Даъват кардани блоки марказии андеррайтинги Gemini...",
      "Таҳияи аудити хавфҳои соҳибихтиёрӣ..."
    ];

    let currentIdx = 0;
    setUnderwritingStatus(statuses[0]);
    const timer = setInterval(() => {
      currentIdx++;
      if (currentIdx < statuses.length) {
        setUnderwritingStatus(statuses[currentIdx]);
      }
    }, 850);

    try {
      const res = await generateCreditDecision(loanAmount, loanTerm, finalPurpose, totalEquity);
      setDecision(res);
    } catch (err) {
      console.error(err);
    } finally {
      clearInterval(timer);
      setIsUnderwriting(false);
    }
  };

  const acceptLoan = () => {
    if (!decision || !decision.approved) return;
    const finalPurpose = loanPurpose === "custom" ? customPurpose : loanPurpose;
    applyForLoan(loanAmount, loanTerm, decision.apr, decision.verdict, finalPurpose);
    setDecision(null);
    setLoanPurpose("");
    setCustomPurpose("");
  };

  const cancelDecision = () => {
    setDecision(null);
  };

  // Safe variables
  const safeLoan = activeLoan;
  const fiscalDaysLeft = safeLoan ? Math.ceil(safeLoan.timeLeft / 120) : 0;

  return (
    <div className="pt-24 sm:pt-32 px-4 sm:px-10 max-w-[1500px] mx-auto space-y-12 pb-40 no-scrollbar">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start border-l-4 border-[#F0B90B]/50 py-5 gap-4">
        <div className="space-y-3">
          <div className="flex items-center gap-4 text-white/20">
             <Landmark className="w-4 h-4 text-[#F0B90B] animate-pulse" />
             <span className="text-[10px] font-semibold uppercase tracking-widest text-[#848E9C] font-mono">ПРОТОКОЛИ_БОНКИ_МАРКАЗӢ</span>
          </div>
          <h2 className="text-3xl sm:text-6xl font-extrabold text-[#EAECEF] tracking-tight ">ЗАХИРАИ_СОҲИБИХТИЁРӢ</h2>
        </div>

        <div className="flex items-center gap-6 mt-2 md:mt-0">
           <div className="text-left md:text-right">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-[#848E9C] block mb-1 font-mono">Сармояи_Умумии_Оператор</span>
              <div className="text-2xl sm:text-4xl font-black font-mono text-[#F0B90B] drop-shadow-[0_0_20px_rgba(240,185,11,0.15)]">${totalEquity.toLocaleString('en-US', { maximumFractionDigits: 0 })}</div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* SAVINGS FACILITY (Left - 5 Cols) */}
        <div className="lg:col-span-5 space-y-8">
           <MonolithCard className="p-4 sm:p-8 space-y-6 sm:space-y-8 relative overflow-hidden border-white/10 bg-[#2B2F36]/40">
              <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none">
                 <Coins className="w-24 h-24 text-[#F0B90B]" />
              </div>
              
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <TrendingUp className="w-5 h-5 text-[#F0B90B] animate-pulse" />
                    <h3 className="text-2xl font-bold uppercase tracking-tight text-[#EAECEF]">Амонатҳои Соҳибихтиёрӣ</h3>
                 </div>
                 <span className="text-[9px] font-black uppercase tracking-widest bg-[#F0B90B]/10 text-[#F0B90B] px-3 py-1 rounded-sm border border-[#F0B90B]/20 shadow-[0_0_20px_rgba(240,185,11,0.15)] font-mono">
                    Даромад: 5.5% солона
                 </span>
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 bg-[#2B2F36]/60 border border-white/5 rounded-sm backdrop-blur-xl">
                 <div>
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-[#848E9C] font-mono">Захираи Гузошташуда</span>
                    <div className="text-xl sm:text-3xl font-black font-mono text-white mt-1">
                       ${(savingsDeposited ?? 0).toLocaleString('en-US')}
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-[#848E9C] font-mono">Суръати Афзоиш</span>
                    <div className="text-xl sm:text-3xl font-black font-mono text-[#F0B90B] mt-1">
                       +${(((savingsDeposited ?? 0) * 0.055) / 12).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/моҳ
                    </div>
                  </div>
              </div>

              {/* Deposit/Withdraw Form */}
              <form onSubmit={handleDepositSavings} className="space-y-6">
                 <div className="flex bg-[#2B2F36]/40 border border-white/10 p-1 rounded-sm">
                    <button 
                      type="button"
                      onClick={() => setSavingsAction("deposit")}
                      className={`flex-1 py-3.5 rounded-sm text-[9px] font-black uppercase tracking-widest transition-all duration-300 ${
                        savingsAction === "deposit" 
                          ? "bg-[#F0B90B] text-black shadow-[0_0_20px_rgba(240,185,11,0.15)] font-black" 
                          : "text-white/40 hover:text-white hover:bg-white/5"
                      }`}
                    >
                       ГУЗОШТАНИ САРМОЯ
                    </button>
                    <button 
                      type="button"
                      onClick={() => setSavingsAction("withdraw")}
                      className={`flex-1 py-3.5 rounded-sm text-[9px] font-black uppercase tracking-widest transition-all duration-300 ${
                        savingsAction === "withdraw" 
                          ? "bg-[#F0B90B] text-black shadow-[0_0_20px_rgba(240,185,11,0.15)] font-black" 
                          : "text-white/40 hover:text-white hover:bg-white/5"
                      }`}
                    >
                       ГЕРИФТАНИ ЗАХИРА
                    </button>
                 </div>

                 <div className="relative">
                    <input 
                      type="number"
                      placeholder="0.00"
                      value={savingsInput}
                      onChange={(e) => setSavingsInput(e.target.value)}
                      className="w-full bg-[#2B2F36]/40 border border-white/10 focus:border-[#F0B90B]/50 rounded-sm p-4 font-mono text-lg text-white focus:outline-none backdrop-blur-xl transition-all duration-300 pl-12"
                     />
                     <DollarSign className="w-5 h-5 text-white/30 absolute left-4 top-1/2 -translate-y-1/2" />
                  </div>

                  <div className="flex gap-3 justify-end">
                     <button 
                       type="button"
                       onClick={() => setSavingsInput((balance * 0.5).toFixed(0))}
                       className="px-4 py-2 border border-white/10 rounded-sm text-[9px] font-bold font-mono tracking-widest bg-[#1E2026] hover:bg-white/5 hover:border-white/30 transition-all duration-300 text-white/60 hover:text-white"
                     >
                        50% CAP
                     </button>
                     <button 
                       type="button"
                       onClick={() => setSavingsInput((savingsAction === "deposit" ? balance : (savingsDeposited ?? 0)).toFixed(0))}
                       className="px-4 py-2 border border-white/10 rounded-sm text-[9px] font-bold font-mono tracking-widest bg-[#1E2026] hover:bg-white/5 hover:border-white/30 transition-all duration-300 text-white/60 hover:text-white"
                     >
                        АЪЗАМӢ
                     </button>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 text-center text-[10px] font-black uppercase tracking-[0.3em] bg-[#F0B90B] text-black hover:bg-[#F0B90B]/95 active:scale-98 transition-all rounded-sm shadow-[0_0_20px_rgba(240,185,11,0.15)] cursor-pointer"
                  >
                     {savingsAction === "deposit" ? "ТАСДИҚИ ГУЗОРИШИ АМОНАТ" : "ГЕРИФТАНИ САРМОЯИ ЗАХИРАВӢ"}
                  </button>
              </form>
           </MonolithCard>

           <MonolithCard className="p-6 border-l-4 border-l-[#F0B90B] bg-[#2B2F36]/40 border-white/10 space-y-3">
              <h4 className="text-[10px] font-black tracking-[0.3em] uppercase text-[#F0B90B] flex items-center gap-2 font-mono">
                 <Percent className="w-3.5 h-3.5" /> Дастурамали Захираҳои Федералӣ
              </h4>
              <p className="text-[12px] font-semibold leading-relaxed text-white/60 font-mono">
                 Гузоштани сармоя дар амонатҳои VANTAGE пули нақди шуморо аз камшавии пардохтпазирӣ муҳофизат мекунад. Фоизи ғайрифаъол дар вақти воқеӣ бо суръати 5.5% солона (APY) ҳисоб карда мешавад. Захираҳоро метавон фавран ва бидуни хароҷот ба тавозуни асосӣ баргардонд.
              </p>
           </MonolithCard>
        </div>

        {/* LENDING FACILITY (Right - 7 Cols) */}
        <div className="lg:col-span-7 space-y-8">
           
           {/* IF OPERATOR HAS AN ACTIVE LOAN (REPAYMENT PANEL) */}
           {safeLoan ? (
              <MonolithCard className="p-4 sm:p-8 border border-[#F6465D]/20 bg-[#F6465D]/5 backdrop-blur-xl space-y-6 sm:space-y-8 relative overflow-hidden rounded-sm">
                 <div className="absolute top-0 right-0 p-4 opacity-15 pointer-events-none">
                    <ShieldAlert className="w-24 h-24 text-[#F6465D] animate-pulse" />
                 </div>

                 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                       <ShieldAlert className="w-6 h-6 text-[#F6465D] animate-bounce" />
                       <div>
                          <h3 className="text-2xl font-black uppercase tracking-tight italic text-[#F6465D]">
                             ҚАРЗИ СИСТЕМА ФАЪОЛ АСТ
                          </h3>
                          <span className="text-[10px] font-semibold uppercase tracking-widest text-[#848E9C] font-mono">
                             Ҳадаф: &ldquo;{safeLoan.purpose}&rdquo;
                          </span>
                       </div>
                    </div>
                     <div className="text-left sm:text-right">
                        <span className="text-[10px] font-semibold uppercase tracking-widest text-[#848E9C] block font-mono">Ҳисоби Маъкули Мӯҳлат</span>
                        <div className="text-3xl font-black font-mono text-[#F6465D] mt-1 animate-pulse drop-shadow-[0_0_20px_rgba(246,70,93,0.2)]">
                           {fiscalDaysLeft} РӮЗ
                        </div>
                     </div>
                 </div>

                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-[#2B2F36]/60 border border-white/5 rounded-sm">
                    <div>
                       <span className="text-[10px] font-semibold uppercase tracking-widest text-[#848E9C] font-mono">Сармояи Асосӣ</span>
                       <div className="text-xl font-black font-mono text-white mt-1">
                          ${safeLoan.principal.toLocaleString('en-US')}
                       </div>
                    </div>
                    <div>
                       <span className="text-[10px] font-semibold uppercase tracking-widest text-[#848E9C] font-mono">Фоизи Солона</span>
                       <div className="text-xl font-black font-mono text-white mt-1">
                          {safeLoan.interestRate}%
                       </div>
                    </div>
                    <div>
                       <span className="text-[10px] font-semibold uppercase tracking-widest text-[#848E9C] font-mono">Пардохти Умумии Қарз</span>
                       <div className="text-xl font-black font-mono text-[#F6465D] mt-1">
                          ${safeLoan.totalDue.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                       </div>
                    </div>
                 </div>

                 <div className="bg-[#F6465D]/10 border border-[#F6465D]/20 p-4 flex gap-4 items-center rounded-sm">
                    <AlertCircle className="w-5 h-5 text-[#F6465D] shrink-0" />
                    <p className="text-[11px] font-bold text-[#F6465D]/80 leading-relaxed uppercase tracking-wider font-mono">
                       ОГОҲӢ: Агар ҳисоби маъкул ба 0 РӮЗ расад ва қарз пардохт нашавад, Бонки Марказӣ чораҳои таъзирӣ андешида, 10% ҷаримаи иловагӣ талаб мекунад.
                    </p>
                 </div>

                 <button 
                   onClick={() => repayLoan()}
                   disabled={balance < safeLoan.totalDue}
                   className={`w-full py-4 text-center text-[10px] font-black uppercase tracking-[0.3em] transition-all cursor-pointer rounded-sm ${
                     balance >= safeLoan.totalDue 
                       ? "bg-[#F6465D] text-white hover:bg-[#F6465D]/90 shadow-[0_0_20px_rgba(246,70,93,0.2)]" 
                       : "bg-white/5 border border-white/10 text-white/20 cursor-not-allowed"
                   }`}
                 >
                    {balance >= safeLoan.totalDue ? "ТАСДИҚИ ПАРДОХТИ ҚАРЗ" : `ТАВОЗУНИ НОКОФӢ (НИЁЗ БА $${Math.ceil(safeLoan.totalDue).toLocaleString('en-US')})`}
                 </button>
              </MonolithCard>
           ) : (
              <>
                {/* CREDIT DECISION SHOWDOWN */}
                {decision ? (
                   <MonolithCard className={`p-8 border relative overflow-hidden backdrop-blur-xl rounded-sm space-y-8 ${
                     decision.approved 
                       ? "border-[#F0B90B]/20 bg-[#F0B90B]/5" 
                       : "border-[#F6465D]/20 bg-[#F6465D]/5"
                   }`}>
                      <div className="absolute top-0 right-0 p-4 opacity-15 pointer-events-none">
                         {decision.approved ? (
                           <CheckCircle2 className="w-24 h-24 text-[#F0B90B]" />
                         ) : (
                           <AlertCircle className="w-24 h-24 text-[#F6465D]" />
                         )}
                      </div>

                      <div className="flex justify-between items-center border-b border-white/5 pb-6">
                         <div className="flex items-center gap-4">
                            {decision.approved ? (
                              <CheckCircle2 className="w-6 h-6 text-[#F0B90B] animate-pulse" />
                            ) : (
                              <AlertCircle className="w-6 h-6 text-[#F6465D]" />
                            )}
                            <h3 className={`text-2xl font-black uppercase tracking-tight italic ${
                              decision.approved ? "text-[#F0B90B]" : "text-[#F6465D]"
                            }`}>
                               {decision.approved ? "ДАРХОСТИ ҚАРЗ ТАСДИҚ ШУД" : "ДАРХОСТ РАД ШУД"}
                            </h3>
                         </div>
                      </div>

                      {/* AI Verdict Rationale */}
                      <div className="space-y-4">
                         <span className="text-[10px] font-semibold uppercase tracking-widest text-[#848E9C] flex items-center gap-2 font-mono">
                            <Brain className="w-4 h-4 text-[#F0B90B] animate-pulse" /> ҲУКМИ АНДЕРРАЙТЕРИ МАРКАЗӢ
                         </span>
                         <p className={`text-sm font-semibold italic border-l-2 pl-4 py-2 leading-relaxed font-mono ${
                           decision.approved ? "border-[#F0B90B] text-white/90" : "border-[#F6465D] text-white/60"
                         }`}>
                            <Typewriter text={decision.verdict} />
                         </p>
                      </div>

                      {decision.approved && (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-[#2B2F36]/60 border border-white/5 rounded-sm">
                           <div>
                              <span className="text-[10px] font-semibold uppercase tracking-widest text-[#848E9C] font-mono">Сармояи Асосӣ</span>
                              <div className="text-lg font-black font-mono text-white mt-1">
                                 ${loanAmount.toLocaleString('en-US')}
                              </div>
                           </div>
                           <div>
                              <span className="text-[10px] font-semibold uppercase tracking-widest text-[#848E9C] font-mono">Фоизи Таъйиншуда</span>
                              <div className="text-lg font-black font-mono text-[#F0B90B] mt-1">
                                 {decision.apr}%
                              </div>
                           </div>
                           <div>
                              <span className="text-[10px] font-semibold uppercase tracking-widest text-[#848E9C] font-mono">Давомнокии Мӯҳлат</span>
                              <div className="text-lg font-black font-mono text-white mt-1">
                                 {loanTerm} Рӯз
                              </div>
                           </div>
                        </div>
                      )}

                      <div className="flex gap-4 pt-6 border-t border-white/5">
                         <button 
                           onClick={cancelDecision}
                           className="flex-1 py-4 text-center text-[10px] font-black uppercase tracking-[0.2em] bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-all rounded-sm cursor-pointer"
                         >
                            РАД КАРДАНИ АУДИТ
                         </button>
                         {decision.approved && (
                           <button 
                             onClick={acceptLoan}
                             className="flex-1 py-4 text-center text-[10px] font-black uppercase tracking-[0.2em] bg-[#F0B90B] hover:bg-[#F0B90B]/90 text-black shadow-[0_0_20px_rgba(240,185,11,0.15)] transition-all rounded-sm cursor-pointer"
                           >
                              ҚАБУЛИ САРМОЯИ ҚАРЗӢ
                           </button>
                         )}
                      </div>
                   </MonolithCard>
                ) : (
                  <>
                    {/* LOAN APPLICATION FORM */}
                    <MonolithCard className="p-8 space-y-8 relative overflow-hidden border-white/10 bg-[#2B2F36]/40 rounded-sm">
                       {isUnderwriting && (
                         <div className="absolute inset-0 bg-[#0B0E11]/95 backdrop-blur-xl z-50 flex flex-col items-center justify-center text-center p-12 gap-8">
                            <Brain className="w-16 h-16 text-[#F0B90B] animate-pulse" />
                            <h4 className="text-xl font-bold uppercase tracking-wide text-white animate-bounce font-mono">
                               АНДЕРРАЙТИНГИ AI ДАР ҲОЛИ ИҶРО
                            </h4>
                            <p className="text-[12px] font-mono text-[#F0B90B] tracking-wider h-8">
                               {underwritingStatus}
                            </p>
                            <div className="w-64 h-1 bg-white/10 relative overflow-hidden rounded-full">
                               <motion.div 
                                 className="h-full bg-[#F0B90B] rounded-full"
                                 initial={{ x: "-100%" }}
                                 animate={{ x: "100%" }}
                                 transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                                 style={{ width: "40%" }}
                               />
                            </div>
                         </div>
                       )}

                       <div className="flex items-center gap-4">
                          <Scale className="w-5 h-5 text-[#F0B90B] animate-pulse" />
                          <h3 className="text-2xl font-bold uppercase tracking-tight text-[#EAECEF]">
                             Хатти Қарзии Соҳибихтиёрӣ
                          </h3>
                       </div>

                       <form onSubmit={handleApplyLoan} className="space-y-8">
                          {/* Slider for Loan Amount */}
                          <div>
                             <div className="flex justify-between items-center mb-4">
                                <span className="text-[10px] font-semibold uppercase tracking-widest text-[#848E9C] font-mono">
                                   Сармояи Қарзии Дархостшуда
                                </span>
                                <span className="text-2xl font-black font-mono text-[#F0B90B] drop-shadow-[0_0_20px_rgba(240,185,11,0.15)]">
                                   ${loanAmount.toLocaleString('en-US')}
                                </span>
                             </div>
                             <input 
                               type="range"
                               min="10000"
                               max="1000000"
                               step="10000"
                               value={loanAmount}
                               onChange={(e) => setLoanAmount(Number(e.target.value))}
                               className="w-full accent-[#F0B90B] bg-white/10 h-1 rounded-full cursor-pointer hover:bg-white/20 transition-all duration-300"
                             />
                             <div className="flex justify-between text-[8px] font-mono text-white/30 mt-2">
                                <span>$10,000</span>
                                <span>$500,000</span>
                                <span>$1,000,000</span>
                             </div>
                          </div>

                          {/* Maturity Selection */}
                          <div>
                             <span className="text-[10px] font-semibold uppercase tracking-widest text-[#848E9C] block mb-4 font-mono">
                                Мӯҳлати Пардохти Қарз
                             </span>
                             <div className="flex gap-4">
                                {[
                                  { val: 90, label: "90 РӮЗ (3 МОҲ)" },
                                  { val: 180, label: "180 РӮЗ (6 МОҲ)" },
                                  { val: 360, label: "360 РӮЗ (1 СОЛ)" }
                                ].map(t => (
                                  <button 
                                    key={t.val}
                                    type="button"
                                    onClick={() => setLoanTerm(t.val)}
                                    className={`flex-1 py-3.5 rounded-sm text-[9px] font-black uppercase tracking-widest border transition-all duration-300 font-mono ${
                                      loanTerm === t.val 
                                        ? "bg-[#F0B90B] text-black border-transparent shadow-[0_0_20px_rgba(240,185,11,0.15)] font-bold" 
                                        : "bg-transparent text-white/40 border-white/10 hover:border-white/30 hover:text-white"
                                    }`}
                                  >
                                     {t.label}
                                  </button>
                                ))}
                             </div>
                          </div>

                          {/* Rationale / Justification */}
                          <div>
                             <span className="text-[10px] font-semibold uppercase tracking-widest text-[#848E9C] block mb-4 font-mono">
                                Асосноккунии Стратегии Қарзӣ (Шакли R-2)
                             </span>
                             
                             {/* Suggested Quick Buttons */}
                             <div className="flex flex-col gap-3 mb-4">
                                {SUGGESTED_PURPOSES.map(p => (
                                  <button 
                                    key={p.label}
                                    type="button"
                                    onClick={() => setLoanPurpose(p.text)}
                                    className={`text-left p-4 text-[10px] font-semibold border transition-all duration-300 rounded-sm leading-relaxed font-mono ${
                                      loanPurpose === p.text 
                                        ? "border-[#F0B90B]/40 bg-[#F0B90B]/5 text-white" 
                                        : "border-white/10 bg-[#1E2026] text-white/40 hover:border-white/30 hover:text-white/60"
                                    }`}
                                  >
                                     <span className={`block font-black text-[8px] uppercase tracking-widest mb-1 ${loanPurpose === p.text ? 'text-[#F0B90B]' : 'text-white/40'}`}>{p.label}</span>
                                     {p.text}
                                  </button>
                                ))}
                                <button 
                                  type="button"
                                  onClick={() => setLoanPurpose("custom")}
                                  className={`text-left p-4 text-[10px] font-black uppercase tracking-widest border transition-all duration-300 rounded-sm font-mono ${
                                    loanPurpose === "custom" 
                                      ? "border-[#F0B90B]/40 bg-[#F0B90B]/5 text-[#F0B90B]" 
                                      : "border-white/10 bg-[#1E2026] text-white/40 hover:border-[#F0B90B]/30 hover:text-white/60"
                                  }`}
                                >
                                   НАВИШТАНИ АСОСНОКИИ ХУД
                                </button>
                             </div>

                             {loanPurpose === "custom" && (
                               <textarea 
                                 placeholder="Нақшаи тақсимоти стратегии худро дар ин ҷо нависед... Бигзор AI-и андеррайтинг фаҳмад, ки чӣ гуна шумо гардиши пулиро барои пӯшонидани пардохтҳо таъмин мекунед."
                                 value={customPurpose}
                                 onChange={(e) => setCustomPurpose(e.target.value)}
                                 className="w-full bg-[#2B2F36]/40 border border-white/10 focus:border-[#F0B90B] rounded-sm p-4 font-mono text-xs text-white focus:outline-none backdrop-blur-xl transition-all duration-300 h-28 resize-none leading-relaxed"
                               />
                             )}
                          </div>

                          <button 
                            type="submit"
                            disabled={!loanPurpose || (loanPurpose === "custom" && !customPurpose.trim())}
                            className={`w-full py-5 border font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 rounded-sm shadow-[0_0_20px_rgba(240,185,11,0.15)] cursor-pointer ${
                              (loanPurpose && (loanPurpose !== "custom" || customPurpose.trim()))
                                ? "border-[#F0B90B] bg-[#F0B90B]/10 text-[#F0B90B] hover:bg-[#F0B90B] hover:text-black shadow-[0_0_20px_rgba(240,185,11,0.15)]" 
                                : "border-white/10 text-white/20 bg-white/5 cursor-not-allowed"
                            }`}
                          >
                             SUBMIT FOR AI UNDERWRITING AUDIT
                          </button>
                       </form>
                    </MonolithCard>
                  </>
                )}
              </>
            )}
          </div>

        </div>
      </div>
  );
}
