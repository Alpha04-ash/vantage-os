"use client";
import React, { useState, useMemo } from "react";
import { useVantageStore } from "@/store/useVantageStore";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Landmark, ShieldAlert, Brain, TrendingUp, Coins, 
  AlertCircle, CheckCircle2, DollarSign, Percent, Scale,
  ChevronDown, ChevronUp, ShieldCheck, ArrowRight, Sparkles, Activity
} from "lucide-react";
import { MonolithCard, Typewriter, SovereignButton } from "./SovereignUI";
import { generateCreditDecision, CreditDecision } from "@/services/aiOracle";

declare var pendo: any;

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
    repayLoan,
    timeSpeed
  } = useVantageStore();

  const currentUser = useVantageStore(state => state.currentUser);
  const currentOperator = currentUser?.operatorId || "OPERATOR_01";
  const speed = timeSpeed ?? 1;

  // Accordion drawer states
  const [activeCardDrawer, setActiveCardDrawer] = useState<"savings" | "loan" | null>("savings");

  // Savings form state
  const [savingsInput, setSavingsInput] = useState("");
  const [savingsAction, setSavingsAction] = useState<"deposit" | "withdraw">("deposit");

  // Loan form state
  const [loanAmount, setLoanAmount] = useState<number>(100000);
  const [loanTerm, setLoanTerm] = useState<number>(180); // Default to 180 days
  const [loanPurpose, setLoanPurpose] = useState<string>("");
  const [customPurpose, setCustomPurpose] = useState<string>("");

  // Underwriting states
  const [isUnderwriting, setIsUnderwriting] = useState(false);
  const [underwritingStatus, setUnderwritingStatus] = useState("");
  const [decision, setDecision] = useState<CreditDecision | null>(null);

  // Suggested Purposes
  const SUGGESTED_PURPOSES = [
    { label: "DeFi Yield Leverage", text: "To inject credit liquidity into DeFi arbitrage pools for immediate yield generation." },
    { label: "SaaS Infrastructure Scaling", text: "To fund the expansion of software infrastructure and improve LTV and CAC metrics." },
    { label: "Orbital Satellite Acquisition", text: "To secure capital expenditure for acquiring supplementary PropTech imaging spots." }
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
      if (typeof pendo !== "undefined") {
        pendo.track("savings_deposited", {
          depositAmount: val,
          totalSavingsAfter: (savingsDeposited ?? 0) + val,
          balanceAfter: balance - val
        });
      }
    } else {
      if (val > (savingsDeposited ?? 0)) return;
      withdrawSavings(val);
      if (typeof pendo !== "undefined") {
        pendo.track("savings_withdrawn", {
          withdrawalAmount: val,
          totalSavingsAfter: (savingsDeposited ?? 0) - val,
          balanceAfter: balance + val
        });
      }
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
      "Connecting to Sovereign central network...",
      "Analyzing operator's total collateral base...",
      "Simulating repayment cash flow over the loan term...",
      "Invoking Gemini central underwriting module...",
      "Generating sovereign risk audit..."
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
      if (typeof pendo !== "undefined") {
        pendo.track("credit_decision_generated", {
          loanAmount,
          loanTerm,
          purpose: finalPurpose,
          approved: res.approved,
          apr: res.apr,
          totalEquity
        });
      }
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
    if (typeof pendo !== "undefined") {
      pendo.track("loan_applied", {
        loanAmount,
        loanTerm,
        apr: decision.apr,
        verdict: decision.verdict,
        purpose: finalPurpose,
        totalDue: loanAmount * (1 + decision.apr / 100),
        totalEquity
      });
    }
    setDecision(null);
    setLoanPurpose("");
    setCustomPurpose("");
  };

  const cancelDecision = () => {
    setDecision(null);
  };

  const safeLoan = activeLoan;
  const fiscalDaysLeft = safeLoan ? Math.ceil(safeLoan.timeLeft / 120) : 0;

  // Custom SVG render for the gold and platinum chips
  const renderCardChip = (color: "gold" | "platinum") => (
    <svg className="w-12 h-9 rounded-sm" viewBox="0 0 48 36" fill="none">
      <rect width="48" height="36" rx="4" fill={color === "gold" ? "url(#gold-chip)" : "url(#plat-chip)"} />
      <path d="M6 18H42" stroke={color === "gold" ? "#F0B90B" : "#B2B8C4"} strokeWidth="0.5" opacity="0.4" />
      <path d="M24 0V36" stroke={color === "gold" ? "#F0B90B" : "#B2B8C4"} strokeWidth="0.5" opacity="0.4" />
      <path d="M12 0V36" stroke={color === "gold" ? "#F0B90B" : "#B2B8C4"} strokeWidth="0.5" opacity="0.4" />
      <path d="M36 0V36" stroke={color === "gold" ? "#F0B90B" : "#B2B8C4"} strokeWidth="0.5" opacity="0.4" />
      <rect x="18" y="10" width="12" height="16" rx="2" stroke={color === "gold" ? "#E3A300" : "#8A94A6"} strokeWidth="1" fill="none" />
      <defs>
        <linearGradient id="gold-chip" x1="0" y1="0" x2="48" y2="36" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F9D423" />
          <stop offset="0.5" stopColor="#FF4E50" />
          <stop offset="1" stopColor="#F9D423" />
        </linearGradient>
        <linearGradient id="plat-chip" x1="0" y1="0" x2="48" y2="36" gradientUnits="userSpaceOnUse">
          <stop stopColor="#EAECEF" />
          <stop offset="0.5" stopColor="#848E9C" />
          <stop offset="1" stopColor="#363C45" />
        </linearGradient>
      </defs>
    </svg>
  );

  return (
    <div className="pt-24 sm:pt-32 px-4 sm:px-10 max-w-[1550px] mx-auto space-y-12 pb-40 no-scrollbar relative z-10">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start border-l-4 border-[#F0B90B]/50 py-5 pl-6 gap-4 relative overflow-hidden bg-gradient-to-r from-[#1E2026] via-transparent to-transparent rounded-r-xl border border-y-white/5 border-r-white/5 pr-6">
        <div className="space-y-3">
          <div className="flex items-center gap-4 text-white/20">
             <Landmark className="w-4 h-4 text-[#F0B90B] animate-pulse" />
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#848E9C] font-mono">VANTAGE_CENTRAL_BANKING_PROTOCOL</span>
          </div>
          <h2 className="text-3xl sm:text-6xl font-black text-[#EAECEF] tracking-tight font-sans">BANKING_SYSTEM</h2>
        </div>

        <div className="flex items-center gap-6 mt-2 md:mt-0 font-mono">
           <div className="text-left md:text-right bg-[#1E2026] border border-[#2B2F36] rounded-xl px-6 py-4 shadow-[inset_0_0_15px_rgba(240,185,11,0.03)]">
              <span className="text-[9px] font-black uppercase tracking-widest text-[#848E9C] block mb-1">Operator_Total_Equity</span>
              <div className="text-2xl sm:text-3xl font-black text-[#F0B90B] drop-shadow-[0_0_15px_rgba(240,185,11,0.2)]">
                ${totalEquity.toLocaleString('en-US', { maximumFractionDigits: 0 })}
              </div>
           </div>
        </div>
      </div>

      {/* TWO LUXURY BANK CARDS CONTAINER */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* CARD 1: SAVINGS FACILITY (GOLD PREMIUM DEPOSIT CARD) */}
        <motion.div 
          onClick={() => setActiveCardDrawer(activeCardDrawer === "savings" ? null : "savings")}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className={`relative h-[250px] sm:h-[280px] rounded-2xl p-6 sm:p-8 cursor-pointer flex flex-col justify-between overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.4)] transition-all duration-300 group border ${
            activeCardDrawer === "savings" 
              ? "border-[#F0B90B]/60 shadow-[0_0_30px_rgba(240,185,11,0.15)] scale-[1.01]" 
              : "border-white/10 hover:border-white/20"
          }`}
          style={{
            background: "linear-gradient(135deg, rgba(240, 185, 11, 0.15) 0%, rgba(43, 47, 54, 0.95) 50%, rgba(20, 21, 26, 1) 100%)"
          }}
        >
          {/* Futuristic circuits bg pattern */}
          <div className="absolute inset-0 opacity-[0.04] bg-grid-pattern pointer-events-none group-hover:opacity-[0.06] transition-opacity duration-300" />
          {/* Interactive golden dust flow */}
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-[#F0B90B]/10 rounded-full blur-[80px] group-hover:bg-[#F0B90B]/15 transition-all duration-500" />
          <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-[#E3A300]/10 rounded-full blur-[80px]" />

          {/* Top Row: Brand & Product Type */}
          <div className="flex justify-between items-start z-10">
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 bg-[#F0B90B] rotate-45 rounded-sm flex-shrink-0" />
              <span className="text-[10px] font-black tracking-[0.25em] text-[#EAECEF] uppercase font-mono">VANTAGE APEX</span>
            </div>
            <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest bg-[#F0B90B]/10 border border-[#F0B90B]/30 text-[#F0B90B] px-2.5 py-1 rounded-sm font-mono flex items-center gap-1.5 shadow-[0_0_15px_rgba(240,185,11,0.1)]">
              <Sparkles className="w-3 h-3 animate-spin" /> SOVEREIGN SAVINGS
            </span>
          </div>

          {/* Middle Row: Gold Chip & Live Growth Indicator */}
          <div className="flex justify-between items-end z-10">
            {renderCardChip("gold")}
            <div className="text-right">
              <span className="text-[8px] font-bold text-white/30 tracking-widest uppercase font-mono block">Annual Yield // APY</span>
              <span className="text-2xl sm:text-3xl font-black text-[#F0B90B] font-mono tracking-tight flex items-center justify-end gap-1">
                5.50<span className="text-lg text-[#F0B90B]/70">%</span>
              </span>
            </div>
          </div>

          {/* Bottom Row: Card Balance, Name, Drawer Arrow */}
          <div className="flex justify-between items-end z-10 border-t border-white/5 pt-4">
            <div className="space-y-1">
              <span className="text-[8px] font-black tracking-widest text-white/30 uppercase font-mono block">ACTIVE DEPOSIT BALANCE</span>
              <div className="text-xl sm:text-2xl font-black text-white font-mono leading-none tracking-wider">
                ${(savingsDeposited ?? 0).toLocaleString('en-US')}
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="text-right hidden sm:block">
                 <span className="text-[8px] font-bold text-white/30 tracking-widest uppercase font-mono block">Operator Sign</span>
                 <span className="text-[10px] font-black text-white/80 font-mono tracking-widest">{currentOperator}</span>
              </div>
              <motion.div 
                animate={{ y: activeCardDrawer === "savings" ? 2 : 0 }}
                className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center bg-[#1E2026]/80 text-[#848E9C] group-hover:text-white group-hover:border-[#F0B90B]/30"
              >
                {activeCardDrawer === "savings" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* CARD 2: LENDING FACILITY (CYBER OBSIDIAN CREDIT CARD) */}
        <motion.div 
          onClick={() => setActiveCardDrawer(activeCardDrawer === "loan" ? null : "loan")}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className={`relative h-[250px] sm:h-[280px] rounded-2xl p-6 sm:p-8 cursor-pointer flex flex-col justify-between overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.4)] transition-all duration-300 group border ${
            activeCardDrawer === "loan" 
              ? "border-[#F6465D]/60 shadow-[0_0_30px_rgba(246,70,93,0.15)] scale-[1.01]" 
              : "border-white/10 hover:border-white/20"
          }`}
          style={{
            background: safeLoan
              ? "linear-gradient(135deg, rgba(246, 70, 93, 0.15) 0%, rgba(43, 47, 54, 0.95) 50%, rgba(20, 21, 26, 1) 100%)"
              : "linear-gradient(135deg, rgba(54, 60, 69, 0.25) 0%, rgba(30, 32, 38, 0.95) 50%, rgba(11, 14, 17, 1) 100%)"
          }}
        >
          {/* Futuristic circuits bg pattern */}
          <div className="absolute inset-0 opacity-[0.03] bg-grid-pattern pointer-events-none group-hover:opacity-[0.05] transition-opacity duration-300" />
          {/* Glow effects */}
          {safeLoan ? (
            <div className="absolute -top-12 -left-12 w-48 h-48 bg-[#F6465D]/10 rounded-full blur-[80px] animate-pulse" />
          ) : (
            <div className="absolute -top-12 -left-12 w-48 h-48 bg-white/5 rounded-full blur-[80px]" />
          )}

          {/* Top Row: Brand & Product Type */}
          <div className="flex justify-between items-start z-10">
            <div className="flex items-center gap-2">
              <div className={`w-3.5 h-3.5 rotate-45 rounded-sm flex-shrink-0 ${safeLoan ? "bg-[#F6465D]" : "bg-[#848E9C]"}`} />
              <span className="text-[10px] font-black tracking-[0.25em] text-[#EAECEF] uppercase font-mono">VANTAGE APEX</span>
            </div>
            <span className={`text-[8px] sm:text-[9px] font-black uppercase tracking-widest border px-2.5 py-1 rounded-sm font-mono flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,0,0,0.2)] ${
              safeLoan
                ? "bg-[#F6465D]/10 border-[#F6465D]/40 text-[#F6465D] animate-pulse"
                : "bg-white/5 border-white/10 text-white/50"
            }`}>
              {safeLoan ? "🚨 ACTIVE SYSTEM LOAN" : "🛡️ CREDIT LINE AVAILABLE"}
            </span>
          </div>

          {/* Middle Row: Platinum Chip & Debt details */}
          <div className="flex justify-between items-end z-10">
            {renderCardChip("platinum")}
            <div className="text-right">
              {safeLoan ? (
                <>
                  <span className="text-[8px] font-bold text-white/30 tracking-widest uppercase font-mono block">Interest // APR</span>
                  <span className="text-2xl sm:text-3xl font-black text-[#F6465D] font-mono tracking-tight">{safeLoan.interestRate}%</span>
                </>
              ) : (
                <>
                  <span className="text-[8px] font-bold text-white/30 tracking-widest uppercase font-mono block">Max Term Limit // MAX LIMIT</span>
                  <span className="text-xl sm:text-2xl font-black text-white/80 font-mono tracking-tight">$1,000,000</span>
                </>
              )}
            </div>
          </div>

          {/* Bottom Row: Balance (Due or Available), Name, Drawer Arrow */}
          <div className="flex justify-between items-end z-10 border-t border-white/5 pt-4">
            <div className="space-y-1">
              <span className="text-[8px] font-black tracking-widest text-white/30 uppercase font-mono block">
                {safeLoan ? "OUTSTANDING DUE" : "UNDERWRITING AUDIT // STATUS"}
              </span>
              <div className={`text-xl sm:text-2xl font-black font-mono leading-none tracking-wider ${safeLoan ? "text-[#F6465D]" : "text-emerald-400"}`}>
                {safeLoan ? `$${Math.ceil(safeLoan.totalDue).toLocaleString('en-US')}` : "READY TO AUDIT"}
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right hidden sm:block">
                 <span className="text-[8px] font-bold text-white/30 tracking-widest uppercase font-mono block">Term Limit</span>
                 <span className="text-[10px] font-black text-white/80 font-mono tracking-widest">
                   {safeLoan ? `${fiscalDaysLeft} DAYS LEFT` : "ELIGIBLE"}
                 </span>
              </div>
              <motion.div 
                animate={{ y: activeCardDrawer === "loan" ? 2 : 0 }}
                className={`w-8 h-8 rounded-full border flex items-center justify-center bg-[#1E2026]/80 text-[#848E9C] group-hover:text-white ${
                  safeLoan 
                    ? "border-white/10 group-hover:border-[#F6465D]/30" 
                    : "border-white/10 group-hover:border-white/30"
                }`}
              >
                {activeCardDrawer === "loan" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </motion.div>
            </div>
          </div>
        </motion.div>

      </div>

      {/* EXPANDABLE TRANSACTION DRAWERS */}
      <AnimatePresence mode="wait">
        
        {/* DRAWER 1: DEPOSIT / WITHDRAW CONTROLS */}
        {activeCardDrawer === "savings" && (
          <motion.div 
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <MonolithCard className="p-6 sm:p-10 border-[#F0B90B]/20 bg-[#F0B90B]/[0.01] rounded-2xl relative shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
              <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none">
                 <Coins className="w-40 h-40 text-[#F0B90B]" />
              </div>
              
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/5 pb-6 mb-8 gap-4">
                 <div>
                    <h3 className="text-xl font-bold uppercase tracking-tight text-white flex items-center gap-3 italic">
                      <TrendingUp className="w-5 h-5 text-[#F0B90B] animate-pulse" /> Treasury Deposit Vault
                    </h3>
                    <p className="text-xs text-white/50 font-mono mt-1">Instant management of corporate liquidity with stable APY yield.</p>
                 </div>
                 <div className="px-4 py-2 border border-white/5 bg-[#2B2F36]/60 rounded-xl font-mono text-[10px] text-[#848E9C] flex items-center gap-3">
                   <span>INTEREST GROWTH RATIO (CALIBRATED):</span>
                   <span className="text-[#F0B90B] font-bold">
                     +${(((savingsDeposited ?? 0) * 0.055) / 12 * speed).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}/month ({speed}x)
                   </span>
                 </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Form Inputs (Left - 7 Cols) */}
                <div className="lg:col-span-7 space-y-6">
                  <form onSubmit={handleDepositSavings} className="space-y-6">
                     <div className="flex bg-[#2B2F36]/40 border border-white/10 p-1.5 rounded-xl">
                        <button 
                          type="button"
                          onClick={() => setSavingsAction("deposit")}
                          className={`flex-1 py-3 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all duration-300 font-mono ${
                            savingsAction === "deposit" 
                              ? "bg-[#F0B90B] text-black shadow-[0_0_15px_rgba(240,185,11,0.2)] font-black" 
                              : "text-white/40 hover:text-white hover:bg-white/5"
                          }`}
                        >
                           DEPOSIT CAPITAL // DEPOSIT
                        </button>
                        <button 
                          type="button"
                          onClick={() => setSavingsAction("withdraw")}
                          className={`flex-1 py-3 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all duration-300 font-mono ${
                            savingsAction === "withdraw" 
                              ? "bg-[#F0B90B] text-black shadow-[0_0_15px_rgba(240,185,11,0.2)] font-black" 
                              : "text-white/40 hover:text-white hover:bg-white/5"
                          }`}
                        >
                           WITHDRAW CAPITAL // WITHDRAW
                        </button>
                     </div>

                     <div className="relative">
                        <input 
                          type="number"
                          placeholder="0.00"
                          value={savingsInput}
                          onChange={(e) => setSavingsInput(e.target.value)}
                          className="w-full bg-[#2B2F36]/40 border border-white/10 focus:border-[#F0B90B]/50 rounded-xl p-5 font-mono text-xl text-white focus:outline-none backdrop-blur-xl transition-all duration-300 pl-14 shadow-inner"
                         />
                         <DollarSign className="w-6 h-6 text-white/30 absolute left-5 top-1/2 -translate-y-1/2" />
                         
                         <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
                           <button 
                             type="button"
                             onClick={() => setSavingsInput((balance * 0.5).toFixed(0))}
                             className="px-3 py-1.5 border border-white/10 rounded text-[8px] font-black font-mono tracking-widest bg-[#1E2026] hover:bg-white/5 hover:border-white/30 text-white/60 hover:text-white transition-all duration-150"
                           >
                              50%
                           </button>
                           <button 
                             type="button"
                             onClick={() => setSavingsInput((savingsAction === "deposit" ? balance : (savingsDeposited ?? 0)).toFixed(0))}
                             className="px-3 py-1.5 border border-white/10 rounded text-[8px] font-black font-mono tracking-widest bg-[#1E2026] hover:bg-white/5 hover:border-white/30 text-white/60 hover:text-white transition-all duration-150"
                           >
                              MAX
                           </button>
                         </div>
                      </div>

                      <button
                        type="submit"
                        disabled={!savingsInput || parseFloat(savingsInput) <= 0 || (savingsAction === "deposit" ? parseFloat(savingsInput) > balance : parseFloat(savingsInput) > (savingsDeposited ?? 0))}
                        className="w-full py-4 text-center text-[10px] font-black uppercase tracking-[0.25em] bg-[#F0B90B] text-black hover:bg-[#F8D33A] active:scale-[0.99] disabled:opacity-30 disabled:pointer-events-none transition-all rounded-xl shadow-[0_0_20px_rgba(240,185,11,0.15)] cursor-pointer flex items-center justify-center gap-2 font-mono"
                      >
                         {savingsAction === "deposit" ? "CONFIRM DEPOSIT TRANSACTION" : "CONFIRM WITHDRAWAL TRANSACTION"}
                         <ArrowRight className="w-4 h-4" />
                      </button>
                  </form>
                </div>

                {/* Explanatory notes (Right - 5 Cols) */}
                <div className="lg:col-span-5 h-full flex flex-col justify-between space-y-6">
                   <div className="p-6 bg-[#2B2F36]/60 border border-white/5 rounded-xl space-y-4 font-mono text-xs">
                      <h4 className="text-[10px] font-black tracking-widest uppercase text-[#F0B90B] flex items-center gap-2">
                         <ShieldCheck className="w-4 h-4 text-[#F0B90B]" /> Financial Manual // INSTRUCTIONAL DOCS
                      </h4>
                      <p className="leading-relaxed text-white/70">
                         Central deposits are a secure hedge against market matrix volatility. Interest is calculated in real-time at **5.5% annual yield (APY)** and added to your balance.
                      </p>
                      <p className="leading-relaxed text-[#848E9C]">
                         The current rate is automatically accelerated by your sovereign time calibration **({speed}x)**, enhancing aggregate earnings.
                      </p>
                   </div>
                </div>
              </div>
            </MonolithCard>
          </motion.div>
        )}

        {/* DRAWER 2: CREDIT / LENDING CONTROLS */}
        {activeCardDrawer === "loan" && (
          <motion.div 
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            {safeLoan ? (
              /* ACTIVE LOAN PANEL */
              <MonolithCard className="p-6 sm:p-10 border-[#F6465D]/20 bg-[#F6465D]/[0.01] rounded-2xl relative shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
                <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none">
                   <ShieldAlert className="w-40 h-40 text-[#F6465D]" />
                </div>
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-white/5 pb-6 mb-8 gap-4">
                   <div>
                     <h3 className="text-xl font-bold uppercase tracking-tight text-white flex items-center gap-3 italic">
                       <ShieldAlert className="w-5 h-5 text-[#F6465D] animate-bounce" /> System Debt Protocol
                     </h3>
                     <p className="text-xs text-white/50 font-mono mt-1">Repayment of high-leverage corporate capital expenditures.</p>
                   </div>
                   <div className="text-left sm:text-right font-mono">
                      <span className="text-[9px] font-black uppercase tracking-widest text-[#848E9C] block">Maturity Deadline</span>
                      <div className="text-2xl font-black text-[#F6465D] mt-1 animate-pulse drop-shadow-[0_0_15px_rgba(246,70,93,0.15)]">
                         {fiscalDaysLeft} DAYS ({Math.ceil(fiscalDaysLeft / speed)}s left at {speed}x)
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 bg-[#2B2F36]/60 border border-white/5 rounded-xl font-mono text-xs">
                   <div className="space-y-1">
                      <span className="text-[10px] font-bold text-white/30 tracking-widest uppercase block">Principal // PRINCIPAL</span>
                      <div className="text-xl font-black text-white">${safeLoan.principal.toLocaleString('en-US')}</div>
                   </div>
                   <div className="space-y-1 border-l-0 lg:border-l border-white/5 pl-0 lg:pl-6">
                      <span className="text-[10px] font-bold text-white/30 tracking-widest uppercase block">Interest Rate // APR</span>
                      <div className="text-xl font-black text-white">{safeLoan.interestRate}%</div>
                   </div>
                   <div className="space-y-1 border-l-0 lg:border-l border-white/5 pl-0 lg:pl-6">
                      <span className="text-[10px] font-bold text-white/30 tracking-widest uppercase block">Total Due</span>
                      <div className="text-xl font-black text-[#F6465D]">${safeLoan.totalDue.toLocaleString('en-US', { maximumFractionDigits: 0 })}</div>
                   </div>
                </div>

                <div className="bg-[#F6465D]/5 border border-[#F6465D]/20 p-5 flex gap-4 items-start rounded-xl mt-6 font-mono text-xs text-[#F6465D]/90">
                   <AlertCircle className="w-5 h-5 text-[#F6465D] shrink-0 mt-0.5 animate-pulse" />
                   <div className="space-y-1 leading-relaxed">
                      <h5 className="font-black uppercase tracking-widest">SOLVENCY PROTOCOL // TERMS OF LIABILITY</h5>
                      <p>
                        If the account goes past maturity, the Central Bank will charge an additional **10% liquidation penalty** and auto-liquidate collateral positions.
                      </p>
                   </div>
                </div>

                <button 
                  onClick={() => { if (typeof pendo !== "undefined") { pendo.track("loan_repaid", { totalDue: safeLoan?.totalDue, principal: safeLoan?.principal, interestRate: safeLoan?.interestRate }); } repayLoan(); }}
                  disabled={balance < safeLoan.totalDue}
                  className={`w-full py-4 text-center text-[10px] font-black uppercase tracking-[0.25em] transition-all cursor-pointer rounded-xl mt-8 flex items-center justify-center gap-2 font-mono ${
                    balance >= safeLoan.totalDue 
                      ? "bg-[#F6465D] text-white hover:bg-[#F6465D]/90 shadow-[0_0_20px_rgba(246,70,93,0.25)]" 
                      : "bg-white/5 border border-white/10 text-white/20 cursor-not-allowed"
                  }`}
                >
                  {balance >= safeLoan.totalDue ? "CONFIRM LOAN REPAYMENT TRANSACTION" : `INSUFFICIENT FUNDS (REQUIRES $${Math.ceil(safeLoan.totalDue).toLocaleString('en-US')})`}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </MonolithCard>
            ) : (
              /* APPLY FOR LOAN PANEL & AI DECISION DRAWER */
              <div className="space-y-8">
                {decision ? (
                  /* UNDERWRITING RECOMMENDATION CARD */
                  <MonolithCard className={`p-6 sm:p-10 border rounded-2xl relative backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.25)] ${
                    decision.approved 
                      ? "border-[#F0B90B]/30 bg-[#F0B90B]/[0.01]" 
                      : "border-[#F6465D]/30 bg-[#F6465D]/[0.01]"
                  }`}>
                    <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none">
                       {decision.approved ? (
                         <CheckCircle2 className="w-40 h-40 text-[#F0B90B]" />
                       ) : (
                         <AlertCircle className="w-40 h-40 text-[#F6465D]" />
                       )}
                    </div>

                    <div className="flex justify-between items-center border-b border-white/5 pb-6 mb-6">
                       <div className="flex items-center gap-4">
                          {decision.approved ? (
                            <CheckCircle2 className="w-6 h-6 text-[#F0B90B] animate-pulse" />
                          ) : (
                            <AlertCircle className="w-6 h-6 text-[#F6465D]" />
                          )}
                          <h3 className={`text-xl font-black uppercase tracking-tight italic ${
                            decision.approved ? "text-[#F0B90B]" : "text-[#F6465D]"
                          }`}>
                             {decision.approved ? "ALGORITHMIC LOAN REQUEST APPROVED" : "LOAN APPLICATION REJECTED"}
                          </h3>
                       </div>
                    </div>

                    {/* Verdict rational block */}
                    <div className="space-y-4 mb-6">
                       <span className="text-[9px] font-black uppercase tracking-widest text-[#848E9C] flex items-center gap-2 font-mono">
                          <Brain className="w-4.5 h-4.5 text-[#F0B90B] animate-pulse" /> AI UNDERWRITING ANALYTICS // UNDERWRITING ENGINE VERDICT
                       </span>
                       <p className={`text-xs sm:text-sm font-semibold italic border-l-2 pl-4 py-3 leading-relaxed font-mono ${
                         decision.approved ? "border-[#F0B90B] text-white/90" : "border-[#F6465D] text-white/60"
                       }`}>
                          <Typewriter text={decision.verdict} speed={15} />
                       </p>
                    </div>

                    {decision.approved && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-5 bg-[#2B2F36]/60 border border-white/5 rounded-xl font-mono text-xs">
                         <div>
                            <span className="text-[9px] font-bold text-white/30 tracking-widest uppercase block">Requested Principal</span>
                            <div className="text-lg font-black text-white mt-1">
                               ${loanAmount.toLocaleString('en-US')}
                            </div>
                         </div>
                         <div className="border-l-0 sm:border-l border-white/5 pl-0 sm:pl-6">
                            <span className="text-[9px] font-bold text-white/30 tracking-widest uppercase block">Offered Interest</span>
                            <div className="text-lg font-black text-[#F0B90B] mt-1">
                               {decision.apr}% APR
                            </div>
                         </div>
                         <div className="border-l-0 sm:border-l border-white/5 pl-0 sm:pl-6">
                            <span className="text-[9px] font-bold text-white/30 tracking-widest uppercase block">Contract Duration</span>
                            <div className="text-lg font-black text-white mt-1">
                               {loanTerm} Days ({Math.ceil(loanTerm / speed)}s at {speed}x)
                            </div>
                         </div>
                      </div>
                    )}

                    <div className="flex gap-4 mt-8 pt-6 border-t border-white/5">
                       <button 
                         onClick={cancelDecision}
                         className="flex-1 py-4 text-center text-[10px] font-black uppercase tracking-[0.2em] bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-all rounded-xl cursor-pointer font-mono"
                       >
                          REJECT AUDIT
                       </button>
                       {decision.approved && (
                         <button 
                           onClick={acceptLoan}
                           className="flex-1 py-4 text-center text-[10px] font-black uppercase tracking-[0.2em] bg-[#F0B90B] hover:bg-[#F8D33A] text-black shadow-[0_0_20px_rgba(240,185,11,0.2)] transition-all rounded-xl cursor-pointer font-mono"
                         >
                            ACCEPT LOAN CAPITAL
                         </button>
                       )}
                    </div>
                  </MonolithCard>
                ) : (
                  /* LOAN SLIDER & INPUT FORM */
                  <MonolithCard className="p-6 sm:p-10 border-white/10 bg-[#2B2F36]/40 rounded-2xl relative shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
                     {isUnderwriting && (
                       <div className="absolute inset-0 bg-[#0B0E11]/95 backdrop-blur-xl z-50 flex flex-col items-center justify-center text-center p-12 gap-8 rounded-2xl">
                          <Brain className="w-16 h-16 text-[#F0B90B] animate-pulse" />
                          <h4 className="text-xl font-bold uppercase tracking-wide text-white animate-bounce font-mono">
                             AI UNDERWRITING ANALYSIS IN PROGRESS
                          </h4>
                          <p className="text-[11px] font-mono text-[#F0B90B] tracking-wider h-8 max-w-md">
                             {underwritingStatus}
                          </p>
                          <div className="w-64 h-1.5 bg-white/10 relative overflow-hidden rounded-full">
                             <motion.div 
                               className="h-full bg-[#F0B90B] rounded-full"
                               initial={{ x: "-100%" }}
                               animate={{ x: "100%" }}
                               transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                               style={{ width: "45%" }}
                             />
                          </div>
                       </div>
                     )}

                     <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-white/5 pb-6 mb-8 gap-4">
                       <div>
                         <h3 className="text-xl font-bold uppercase tracking-tight text-white flex items-center gap-3 italic">
                           <Scale className="w-5 h-5 text-[#F0B90B] animate-pulse" /> Sovereign Credit Line // LENDING MATRIX
                         </h3>
                         <p className="text-xs text-white/50 font-mono mt-1">Collateral risk underwriting for corporate leverage.</p>
                       </div>
                     </div>

                     <form onSubmit={handleApplyLoan} className="space-y-8">
                        {/* Interactive Credit Slider */}
                        <div className="space-y-4">
                           <div className="flex justify-between items-end">
                              <span className="text-[10px] font-black uppercase tracking-widest text-[#848E9C] font-mono">
                                 Requested Credit Capital // CAPITAL REQUEST
                              </span>
                              <span className="text-3xl font-black font-mono text-[#F0B90B] drop-shadow-[0_0_15px_rgba(240,185,11,0.2)]">
                                 ${loanAmount.toLocaleString('en-US')}
                              </span>
                           </div>
                           <input 
                             type="range"
                             min="20000"
                             max="1000000"
                             step="20000"
                             value={loanAmount}
                             onChange={(e) => setLoanAmount(Number(e.target.value))}
                             className="w-full accent-[#F0B90B] bg-white/10 h-1.5 rounded-full cursor-pointer hover:bg-white/20 transition-all duration-300"
                           />
                           <div className="flex justify-between text-[8px] font-mono text-white/30 font-bold uppercase">
                              <span>$20,000</span>
                              <span>$500,000</span>
                              <span>$1,000,000 (Limit)</span>
                           </div>
                        </div>

                        {/* Custom Term selection buttons */}
                        <div className="space-y-4">
                           <span className="text-[10px] font-black uppercase tracking-widest text-[#848E9C] block font-mono">
                              Loan Maturity Period // MATURITY TERM
                           </span>
                           <div className="grid grid-cols-3 gap-4">
                              {[
                                { val: 90, label: "90 DAYS (3 MONTHS)" },
                                { val: 180, label: "180 DAYS (6 MONTHS)" },
                                { val: 360, label: "360 DAYS (1 YEAR)" }
                              ].map(t => (
                                <button 
                                  key={t.val}
                                  type="button"
                                  onClick={() => setLoanTerm(t.val)}
                                  className={`py-3.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all duration-300 font-mono cursor-pointer ${
                                    loanTerm === t.val 
                                      ? "bg-[#F0B90B] text-black border-transparent shadow-[0_0_15px_rgba(240,185,11,0.2)]" 
                                      : "bg-transparent text-white/40 border-white/10 hover:border-white/30 hover:text-white"
                                  }`}
                                >
                                   {t.label}
                                </button>
                              ))}
                           </div>
                        </div>

                        {/* Rationale and strategy templates */}
                        <div className="space-y-4">
                           <span className="text-[10px] font-black uppercase tracking-widest text-[#848E9C] block font-mono">
                              Sovereign Strategy Rationale (Form R-2) // STRATEGY RATIONALE
                           </span>
                           
                           <div className="flex flex-col gap-3">
                              {SUGGESTED_PURPOSES.map(p => (
                                <button 
                                  key={p.label}
                                  type="button"
                                  onClick={() => setLoanPurpose(p.text)}
                                  className={`text-left p-4 text-[10px] font-semibold border transition-all duration-300 rounded-xl leading-relaxed font-mono cursor-pointer ${
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
                                className={`text-left p-4 text-[10px] font-black uppercase tracking-widest border transition-all duration-300 rounded-xl font-mono cursor-pointer ${
                                  loanPurpose === "custom" 
                                    ? "border-[#F0B90B]/40 bg-[#F0B90B]/5 text-[#F0B90B]" 
                                    : "border-white/10 bg-[#1E2026] text-white/40 hover:border-[#F0B90B]/30 hover:text-white/60"
                                }`}
                              >
                                 WRITE CUSTOM RATIONALE // WRITE CUSTOM PLAN
                              </button>
                           </div>

                           {loanPurpose === "custom" && (
                             <textarea 
                               placeholder="Write your custom allocation plan here... Convince the AI underwriter how this leverage will expand your cash flows to support debt servicing."
                               value={customPurpose}
                               onChange={(e) => setCustomPurpose(e.target.value)}
                               className="w-full bg-[#2B2F36]/40 border border-white/10 focus:border-[#F0B90B] rounded-xl p-4 font-mono text-[11px] text-white focus:outline-none backdrop-blur-xl transition-all duration-300 h-28 resize-none leading-relaxed"
                             />
                           )}
                        </div>

                        <button 
                          type="submit"
                          disabled={!loanPurpose || (loanPurpose === "custom" && !customPurpose.trim())}
                          className={`w-full py-5 border font-black text-[10px] uppercase tracking-[0.25em] transition-all flex items-center justify-center gap-2 rounded-xl shadow-[0_0_20px_rgba(240,185,11,0.15)] cursor-pointer font-mono ${
                            (loanPurpose && (loanPurpose !== "custom" || customPurpose.trim()))
                              ? "border-[#F0B90B] bg-[#F0B90B]/10 text-[#F0B90B] hover:bg-[#F0B90B] hover:text-black" 
                              : "border-white/10 text-white/20 bg-white/5 cursor-not-allowed"
                          }`}
                        >
                           SUBMIT FOR CENTRAL AI UNDERWRITING AUDIT
                           <ArrowRight className="w-4 h-4" />
                        </button>
                     </form>
                  </MonolithCard>
                )}
              </div>
            )}
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
