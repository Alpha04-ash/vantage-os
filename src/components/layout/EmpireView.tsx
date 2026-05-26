"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useVantageStore, InfrastructureNode } from "@/store/useVantageStore";
import { MonolithCard } from "./SovereignUI";
import { 
  Server, Building, Coins, Cpu, Network, Zap, 
  ArrowUpRight, ArrowLeft, Award, ShieldAlert, 
  ArrowDownRight, BarChart3, Terminal as TermIcon, LineChart,
  Brain, RefreshCw, CheckCircle2, Clock, Landmark, Search,
  SlidersHorizontal, UserCheck, ChevronLeft, ChevronRight, ArrowUpDown
} from "lucide-react";
import { generateCorporateStrategies, CorporateStrategy } from "@/services/aiOracle";

import { AVAILABLE_NODES, EducationalBusiness } from "@/data/empireNodes";

const ICONS = {
  data_center: Server,
  orbital_satellite: Building,
  quantum_rig: Coins,
  ai_cluster: Cpu,
};

const RISK_COLORS = {
  Low: "text-[#F0B90B] bg-[#F0B90B]/10 border-[#F0B90B]/20",
  Medium: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  High: "text-red-400 bg-red-500/10 border-red-500/20",
};

export function EmpireView() {
  const { balance, infrastructure, buyNode, sellNode, applyCorporateStrategy } = useVantageStore();
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [simulatedLogs, setSimulatedLogs] = useState<string[]>([]);
  
  // AI Strategies States
  const [aiStrategies, setAiStrategies] = useState<CorporateStrategy[]>([]);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [scanningStatus, setScanningStatus] = useState("");

  // 📝 SEARCH, FILTER, AND PAGINATION STATE
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [ownershipFilter, setOwnershipFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("price-asc");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 4;

  // Fetch Strategies via Gemini on Node Selection
  useEffect(() => {
    if (!selectedNodeId || !selectedDef) return;

    const fetchStrategies = async () => {
      setIsLoadingAI(true);
      setAiStrategies([]);
      
      const statuses = [
        "Initializing neural scan...",
        "Interrogating operator ledger...",
        "Compiling ARR, CAC, and LTV telemetry...",
        "Structuring EBITDA optimization paths via Gemini...",
        "Finalizing financial restructuring solutions..."
      ];

      // Simulate status text progression
      let statusIdx = 0;
      setScanningStatus(statuses[0]);
      const statusInterval = setInterval(() => {
        statusIdx++;
        if (statusIdx < statuses.length) {
          setScanningStatus(statuses[statusIdx]);
        }
      }, 900);

      try {
        const escalatedCost = selectedDef.cost * (selectedOwned.customYieldMultiplier ?? 1.0);
        const results = await generateCorporateStrategies(
          selectedDef.id,
          selectedDef.name,
          selectedDef.description,
          escalatedCost
        );
        setAiStrategies(results);
      } catch (err) {
        console.error("Failed loading AI strategies", err);
      } finally {
        clearInterval(statusInterval);
        setIsLoadingAI(false);
      }
    };

    fetchStrategies();
  }, [selectedNodeId]);

  // Generate mock logs
  useEffect(() => {
    if (!selectedNodeId) return;
    const actions = [
      "Optimizing network packets...",
      "Validating smart contract liquidity balances...",
      "Running corporate tax shield parameters...",
      "Calibrating system operating metrics...",
      "Compiling Q3 financial reports...",
      "Adjusting dynamic scaling algorithms...",
    ];
    setSimulatedLogs([
      `[INIT] Booting Restructuring Interface for ${selectedDef?.name}...`,
      `[OK] Fetching corporate ledger records...`,
      `[INFO] Current LTV/CAC: ${selectedDef?.ltvCac}`,
    ]);

    const logInterval = setInterval(() => {
      const nextLog = actions[Math.floor(Math.random() * actions.length)];
      setSimulatedLogs(prev => [
        `[${new Date().toLocaleTimeString()}] ${nextLog}`,
        ...prev.slice(0, 8)
      ]);
    }, 3000);

    return () => clearInterval(logInterval);
  }, [selectedNodeId]);

  // Find selected definition and owned state
  const selectedDef = useMemo(() => {
    return AVAILABLE_NODES.find(n => n.id === selectedNodeId);
  }, [selectedNodeId]);

  const selectedOwned = useMemo(() => {
    return infrastructure.find(n => n.id === selectedNodeId) || {
      id: selectedNodeId || "",
      name: "",
      type: "data_center",
      cost: 0,
      yieldPerSecond: 0,
      owned: 0,
      marketingLevel: 0,
      efficiencyLevel: 0,
      customYieldMultiplier: 1.0
    } as InfrastructureNode;
  }, [infrastructure, selectedNodeId]);

  const totalYield = useMemo(() => {
    return (infrastructure || []).reduce((sum, node) => {
      const mLevel = node.marketingLevel ?? 0;
      const eLevel = node.efficiencyLevel ?? 0;
      const legacyMultiplier = 1 + (mLevel * 0.15) + (eLevel * 0.10);
      const customMultiplier = node.customYieldMultiplier ?? 1.0;
      return sum + ((node.yieldPerSecond ?? 0) * (node.owned ?? 0) * legacyMultiplier * customMultiplier);
    }, 0);
  }, [infrastructure]);

  // Sub-view values
  const currentCost = selectedDef ? selectedDef.cost * Math.pow(1.5, selectedOwned.owned ?? 0) : 0;
  const sellValue = selectedDef ? (selectedDef.cost * Math.pow(1.5, Math.max(0, (selectedOwned.owned ?? 0) - 1)) * (selectedOwned.customYieldMultiplier ?? 1.0)) * 0.75 : 0;

  const currentYieldMultiplier = (1 + ((selectedOwned.marketingLevel ?? 0) * 0.15) + ((selectedOwned.efficiencyLevel ?? 0) * 0.10)) * (selectedOwned.customYieldMultiplier ?? 1.0);
  const currentSingleYield = selectedDef ? selectedDef.yieldPerSecond * currentYieldMultiplier : 0;

  // 📝 SEARCH, FILTER, AND SORTING LOGIC
  const filteredAndSortedNodes = useMemo(() => {
    let result = [...AVAILABLE_NODES];

    // 1. Search Query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      result = result.filter(n => 
        n.name.toLowerCase().includes(query) || 
        n.description.toLowerCase().includes(query) ||
        n.educationalTakeaway.toLowerCase().includes(query)
      );
    }

    // 2. Type Filter
    if (typeFilter !== "all") {
      result = result.filter(n => n.type === typeFilter);
    }

    // 3. Ownership Filter
    if (ownershipFilter !== "all") {
      result = result.filter(n => {
        const ownedCount = infrastructure.find(inf => inf.id === n.id)?.owned || 0;
        if (ownershipFilter === "owned") return ownedCount > 0;
        if (ownershipFilter === "unowned") return ownedCount === 0;
        return true;
      });
    }

    // 4. Sorting
    result.sort((a, b) => {
      const ownedA = infrastructure.find(inf => inf.id === a.id)?.owned || 0;
      const ownedB = infrastructure.find(inf => inf.id === b.id)?.owned || 0;
      const priceA = a.cost * Math.pow(1.5, ownedA);
      const priceB = b.cost * Math.pow(1.5, ownedB);

      if (sortBy === "price-asc") return priceA - priceB;
      if (sortBy === "price-desc") return priceB - priceA;
      if (sortBy === "yield-desc") return b.yieldPerSecond - a.yieldPerSecond;
      if (sortBy === "owned-desc") return ownedB - ownedA;
      return 0;
    });

    return result;
  }, [searchQuery, typeFilter, ownershipFilter, sortBy, infrastructure]);

  // Paginated nodes
  const paginatedNodes = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedNodes.slice(startIdx, startIdx + itemsPerPage);
  }, [filteredAndSortedNodes, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedNodes.length / itemsPerPage) || 1;

  // Reset page
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, typeFilter, ownershipFilter, sortBy]);

  if (selectedNodeId && selectedDef) {
    const Icon = ICONS[selectedDef.type];
    
    return (
      <div className="pt-24 sm:pt-32 px-4 sm:px-10 max-w-[1400px] mx-auto space-y-10 pb-32 no-scrollbar">
        {/* BACK ACTION */}
        <button 
          onClick={() => setSelectedNodeId(null)}
          className="flex items-center gap-3 text-white/40 hover:text-white transition-colors group text-xs font-black uppercase tracking-[0.2em]"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Бозгашт ба Матритсаи Амалиётӣ
        </button>

        {/* HEADER DETAILED */}
        <div className="flex flex-col sm:flex-row justify-between items-start border-l-4 border-[#F0B90B]/50 py-5 sm:py-4 mb-8 gap-4">
          <div className="space-y-4">
            <div className="flex items-center gap-4 text-white/20">
               <Icon className="w-4 h-4 text-[#F0B90B]" />
               <span className="text-[11px] font-black uppercase tracking-[0.6em]">{selectedDef.name} _Барқарорсозӣ</span>
            </div>
            <h1 className="text-3xl sm:text-6xl font-extrabold text-[#EAECEF] tracking-tight ">ПАЙВАСТКУНАКИ_КОРХОНА</h1>
          </div>
          
          <div className="text-left sm:text-right">
             <div className="text-[10px] font-semibold uppercase tracking-wide text-[#F0B90B] mb-2">Даромади Гурӯҳ / Моҳ</div>
             <div className="text-2xl sm:text-4xl font-black font-mono text-[#F0B90B]">
               +${(currentSingleYield * (selectedOwned.owned ?? 0) * 3600).toLocaleString(undefined, { maximumFractionDigits: 0 })}<span className="text-xl text-[#F0B90B]/50">/моҳ</span>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT OPERATIONAL CONTROL PANEL */}
          <div className="lg:col-span-8 space-y-8">
             <MonolithCard className="p-4 sm:p-10 space-y-8 bg-gradient-to-br from-white/[0.01] to-transparent border-[#F0B90B]/10">
                <div className="flex items-center justify-between border-b border-white/5 pb-6">
                   <h3 className="text-xl font-bold uppercase tracking-wide flex items-center gap-3">
                     <Brain className="w-6 h-6 text-[#F0B90B] animate-pulse" /> Ёрдамчии AI-и Барқарорсозии VANTAGE
                   </h3>
                   <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest">Бо дастгирии Gemini</span>
                </div>

                {isLoadingAI ? (
                  <div className="flex flex-col items-center justify-center py-20 space-y-6">
                     <div className="text-xs font-mono text-[#F0B90B]/80 animate-pulse uppercase tracking-[0.2em]">
                        {scanningStatus}
                     </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                     {aiStrategies.map((strategy) => {
                        const canAffordStrategy = balance >= strategy.cost;
                        
                        return (
                           <div 
                             key={strategy.id} 
                             className="p-6 bg-white/[0.01] border border-white/5 rounded-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:bg-white/[0.02] hover:border-[#F0B90B]/20 transition-all group"
                           >
                              <div className="space-y-3 flex-1">
                                  <div className="flex items-center gap-3">
                                     <h4 className="text-lg font-black uppercase tracking-wider text-white/90 group-hover:text-[#F0B90B] transition-colors">
                                        {strategy.title}
                                     </h4>
                                     <span className="text-[10px] font-black uppercase tracking-widest bg-[#F0B90B]/10 text-[#F0B90B] border border-[#F0B90B]/20 px-2 py-0.5 rounded-sm">
                                        +{strategy.yieldBoostPercent}% ROI
                                     </span>
                                  </div>
                                  <p className="text-xs text-white/50 font-mono leading-relaxed max-w-[550px]">
                                     {strategy.rationale}
                                  </p>
                              </div>

                              <div className="text-right w-full md:w-auto">
                                 <button
                                   onClick={() => {
                                      applyCorporateStrategy(selectedDef.id, strategy.id, strategy.cost, strategy.yieldBoostPercent);
                                      setSimulatedLogs(prev => [
                                         `[${new Date().toLocaleTimeString()}] [RESTRENGTHEN] Дастури AI иҷро шуд: "${strategy.title}"`,
                                         `[OK] Нархи стратегия тарҳ шуд: $${strategy.cost.toLocaleString()}`,
                                         `[SUCCESS] Мултипликатори даромад навсозӣ шуд: +${strategy.yieldBoostPercent}%`,
                                         ...prev
                                      ]);
                                   }}
                                   disabled={!canAffordStrategy || (selectedOwned.owned ?? 0) <= 0}
                                   className={`w-full md:w-auto px-6 py-4 border font-black text-[10px] uppercase tracking-[0.2em] transition-all rounded-sm flex items-center justify-center gap-2 cursor-pointer ${
                                     canAffordStrategy && (selectedOwned.owned ?? 0) > 0
                                       ? "border-[#F0B90B] bg-[#F0B90B]/10 text-[#F0B90B] hover:bg-[#F0B90B] hover:text-black shadow-[0_0_20px_rgba(240,185,11,0.05)]"
                                       : "border-white/5 bg-white/[0.01] text-white/20 cursor-not-allowed"
                                   }`}
                                 >
                                    Иҷрои Стратегия: ${strategy.cost.toLocaleString()}
                                    <ArrowUpRight className="w-3.5 h-3.5" />
                                 </button>
                              </div>
                           </div>
                        );
                     })}
                  </div>
                )}
             </MonolithCard>

             {/* LIVE TERMINAL LOG PANEL */}
             <MonolithCard className="p-10 space-y-6">
                <h3 className="text-xl font-bold uppercase tracking-wide flex items-center gap-3">
                  <TermIcon className="w-5 h-5 text-white/40" /> Журнали Амалиётҳои ФАЪОЛ
                </h3>
                <div className="bg-[#0B0E11] border border-white/5 p-6 rounded-sm h-[200px] overflow-y-auto font-mono text-xs text-[#F0B90B]/80 space-y-2 no-scrollbar">
                   {simulatedLogs.map((log, idx) => (
                      <div key={idx} className="whitespace-pre-wrap">{log}</div>
                   ))}
                </div>
             </MonolithCard>
          </div>

          {/* RIGHT STATS & LIQUIDATION PANEL */}
          <div className="lg:col-span-4 space-y-8">
             {/* STATS MATRIX */}
             <MonolithCard className="p-10 space-y-6">
                <h3 className="text-lg font-bold uppercase tracking-wide mb-4">Омори Дороиҳо</h3>
                <div className="space-y-4">
                   <div className="flex justify-between border-b border-white/5 pb-2 text-xs">
                      <span className="text-white/30 font-mono">Корхонаҳои соҳибшуда:</span>
                      <span className="text-white font-mono font-bold">{selectedOwned.owned}</span>
                   </div>
                   <div className="flex justify-between border-b border-white/5 pb-2 text-xs">
                      <span className="text-white/30 font-mono">Нархи Воҳид:</span>
                      <span className="text-white font-mono">${currentCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                   </div>
                   <div className="flex justify-between border-b border-white/5 pb-2 text-xs">
                      <span className="text-white/30 font-mono">Арзиши Фурӯши Дубора:</span>
                      <span className="text-[#F0B90B] font-mono">${sellValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                   </div>
                   <div className="flex justify-between border-b border-white/5 pb-2 text-xs">
                      <span className="text-white/30 font-mono">Мултипликатори Умумӣ:</span>
                      <span className="text-[#F0B90B] font-mono font-bold">{(selectedOwned.customYieldMultiplier ?? 1.0).toFixed(2)}x</span>
                   </div>
                   <div className="flex justify-between border-b border-white/5 pb-2 text-xs">
                      <span className="text-white/30 font-mono">Суръати Даромади Умумӣ:</span>
                      <span className="text-[#F0B90B] font-mono font-black">${(currentSingleYield * (selectedOwned.owned ?? 0) * 3600).toFixed(1)}/моҳ</span>
                   </div>
                   <div className="flex justify-between text-xs">
                      <span className="text-white/30 font-mono">Профили Хавф:</span>
                      <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-sm border ${RISK_COLORS[selectedDef.risk]}`}>
                         {selectedDef.risk}
                      </span>
                   </div>
                </div>
             </MonolithCard>

             {/* CORPORATE INTEL */}
             <MonolithCard className="p-10 space-y-6 bg-gradient-to-br from-[#F0B90B]/[0.01] to-transparent">
                <h3 className="text-lg font-semibold uppercase tracking-wide flex items-center gap-2 text-[#F0B90B]">
                   <Award className="w-5 h-5" /> Маълумоти Молиявӣ
                </h3>
                <p className="text-xs text-white/60 font-mono leading-relaxed">
                   {selectedDef.strategyDocs}
                </p>
                <div className="pt-4 border-t border-white/5 text-[10px] font-mono text-white/40 flex items-center justify-between">
                   <span>КОЭФФИТСИЕНТИ МЕЪЁРӢ:</span>
                   <span className="text-white font-bold">{selectedDef.realWorldMetric}</span>
                </div>
             </MonolithCard>

             {/* ACQUIRE & LIQUIDATE ACTIONS */}
             <div className="space-y-4">
                <button 
                  onClick={() => buyNode(selectedDef)}
                  disabled={balance < currentCost}
                  className={`w-full py-5 border font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 rounded-sm shadow-[0_0_30px_rgba(240,185,11,0.05)] cursor-pointer ${
                    balance >= currentCost 
                      ? "border-[#F0B90B] bg-[#F0B90B]/10 text-[#F0B90B] hover:bg-[#F0B90B] hover:text-black" 
                      : "border-white/5 text-white/10 bg-white/[0.01] cursor-not-allowed"
                  }`}
                >
                  Харидани Корхона: ${currentCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  <ArrowUpRight className="w-4 h-4" />
                </button>

                <button 
                  onClick={() => {
                    sellNode(selectedDef.id, selectedDef.cost);
                    if (selectedOwned.owned <= 1) {
                      setSelectedNodeId(null);
                    }
                  }}
                  disabled={(selectedOwned.owned ?? 0) <= 0}
                  className={`w-full py-5 border font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 rounded-sm cursor-pointer ${
                    (selectedOwned.owned ?? 0) > 0 
                      ? "border-red-500/50 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-black hover:shadow-[0_0_30px_rgba(239,68,68,0.2)]" 
                      : "border-white/5 text-white/10 bg-white/[0.01] cursor-not-allowed"
                  }`}
                >
                  Барҳам додани Корхона: +${sellValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  <ArrowDownRight className="w-4 h-4" />
                </button>
             </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 sm:pt-32 px-4 sm:px-10 max-w-[1400px] mx-auto space-y-8 pb-32 no-scrollbar">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start border-l-4 border-[#F0B90B]/50 py-5 sm:py-4 mb-2 gap-4">
        <div className="space-y-4">
          <div className="flex items-center gap-4 text-white/20">
             <Network className="w-4 h-4 animate-pulse" />
             <span className="text-[10px] font-semibold uppercase tracking-widest text-[#848E9C]">Матритсаи_Инфрасохтори_Система</span>
          </div>
          <h1 className="text-3xl sm:text-6xl font-extrabold text-[#EAECEF] tracking-tight ">ИМПЕРИЯИ_ТИҶОРАТӢ</h1>
          <div className="inline-flex items-center gap-2 text-[9px] font-semibold uppercase tracking-wide text-[#F0B90B] border border-[#F0B90B]/20 bg-[#F0B90B]/5 px-3 py-1 rounded-sm">
             <Clock className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '60s' }} /> ⌬ ДАВРАИ ФАЪОЛИЯТ: 1 Моҳ = 1 Соат (1 Рӯз = 120 Сония)
          </div>
        </div>
        <div className="text-left md:text-right mt-4 md:mt-0">
           <div className="text-[10px] font-semibold uppercase tracking-wide text-[#F0B90B] mb-2 flex items-center md:justify-end gap-2">
             <Zap className="w-3.5 h-3.5 animate-pulse" /> Даромади_Умумӣ
           </div>
           <div className="text-4xl font-black font-mono text-[#F0B90B]">
             +${(totalYield * 3600).toLocaleString(undefined, { maximumFractionDigits: 0 })}<span className="text-xl text-[#F0B90B]/50">/моҳ</span>
           </div>
        </div>
      </div>

      {/* MINIMALISTIC SEARCH & FILTERS FOR BUSINESSES */}
      <MonolithCard className="p-4 sm:p-6 bg-gradient-to-br from-white/[0.01] to-transparent border border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          {/* SEARCH INPUT */}
          <div className="relative">
            <Search className="w-4 h-4 text-white/20 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Ҷустуҷӯи тиҷоратҳо..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#2B2F36]/40 border border-white/10 hover:border-white/20 focus:border-[#F0B90B]/50 rounded-sm pl-10 pr-4 py-2.5 text-xs text-white placeholder-white/20 font-mono outline-none transition-all"
            />
          </div>

          {/* TYPE FILTER */}
          <div className="relative">
            <SlidersHorizontal className="w-3.5 h-3.5 text-white/20 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full bg-[#2B2F36]/40 border border-white/10 hover:border-white/20 focus:border-[#F0B90B]/50 rounded-sm pl-10 pr-4 py-2.5 text-xs text-white font-mono outline-none transition-all appearance-none cursor-pointer"
            >
              <option value="all">Ҳамаи намудҳои инфрасохтор</option>
              <option value="data_center">SaaS ва CDN-ҳо</option>
              <option value="orbital_satellite">FinTech ва PropTech</option>
              <option value="quantum_rig">Лабораторияҳои Квантӣ</option>
              <option value="ai_cluster">AGI ва Системаҳои Захиравӣ</option>
            </select>
          </div>

          {/* OWNERSHIP FILTER */}
          <div className="relative">
            <UserCheck className="w-3.5 h-3.5 text-white/20 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <select
              value={ownershipFilter}
              onChange={(e) => setOwnershipFilter(e.target.value)}
              className="w-full bg-[#2B2F36]/40 border border-white/10 hover:border-white/20 focus:border-[#F0B90B]/50 rounded-sm pl-10 pr-4 py-2.5 text-xs text-white font-mono outline-none transition-all appearance-none cursor-pointer"
            >
              <option value="all">Моликият: Ҳамаи Корхонаҳо</option>
              <option value="owned">Танҳо Корхонаҳои Ман</option>
              <option value="unowned">Танҳо Корхонаҳои Қулфшуда</option>
            </select>
          </div>

          {/* SORTING SELECT */}
          <div className="relative">
            <ArrowUpDown className="w-3.5 h-3.5 text-white/20 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-[#2B2F36]/40 border border-white/10 hover:border-white/20 focus:border-[#F0B90B]/50 rounded-sm pl-10 pr-4 py-2.5 text-xs text-white font-mono outline-none transition-all appearance-none cursor-pointer"
            >
              <option value="price-asc">Нарх: Аз арзон ба қимат</option>
              <option value="price-desc">Нарх: Аз қимат ба арзон</option>
              <option value="yield-desc">Даромад: Аввал даромади баланд</option>
              <option value="owned-desc">Миқдори соҳибшуда: Аввал аз ҳама зиёд</option>
            </select>
          </div>
        </div>
      </MonolithCard>

      {/* MINIMALISTIC BUSINESS TILES */}
      {paginatedNodes.length > 0 ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {paginatedNodes.map((node) => {
            const owned = infrastructure.find(n => n.id === node.id)?.owned || 0;
            const currentCost = node.cost * Math.pow(1.5, owned);
            const canAfford = balance >= currentCost;
            const Icon = ICONS[node.type];

            return (
              <MonolithCard key={node.id} className="p-6 sm:p-10 flex flex-col justify-between group relative overflow-hidden bg-gradient-to-br from-white/[0.01] to-transparent border border-white/5 hover:border-[#F0B90B]/10 transition-all">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#F0B90B]/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)]" />
                
                <div className="space-y-8">
                  {/* CARD HEADER */}
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                     <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-white/5 flex items-center justify-center rounded-sm border border-white/10 group-hover:border-[#F0B90B]/50 transition-colors">
                           <Icon className="w-6 h-6 text-white/40 group-hover:text-[#F0B90B] transition-colors" />
                        </div>
                        <div>
                           <h3 className="text-2xl font-bold uppercase tracking-wide text-white/90 leading-none mb-2">{node.name}</h3>
                           <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">{node.description}</span>
                        </div>
                     </div>
                     
                     <div className="text-right">
                        <div className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">Корхонаҳои соҳибшуда</div>
                        <div className="text-3xl font-black font-mono text-white/80">{owned}</div>
                     </div>
                  </div>

                  {/* METRICS & RATIOS GRID */}
                  <div className="grid grid-cols-3 gap-4 border-y border-white/5 py-6">
                     <div>
                        <div className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-1">Суръати Даромад</div>
                        <div className="text-base font-black font-mono text-[#F0B90B]">+${(node.yieldPerSecond * 3600).toLocaleString()}/моҳ</div>
                     </div>
                     <div>
                        <div className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-1">Коэффитсиенти LTV/CAC</div>
                        <div className="text-base font-black font-mono text-white/85">{node.ltvCac}</div>
                     </div>
                     <div>
                        <div className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-1">Профили Хавф</div>
                        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-sm border ${RISK_COLORS[node.risk]}`}>
                           {node.risk}
                        </span>
                     </div>
                  </div>

                  {/* EDUCATIONAL DIRECTIVE */}
                  <div className="bg-white/[0.02] border border-white/5 p-5 rounded-sm space-y-3">
                     <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wide text-[#F0B90B]">
                        <Award className="w-4 h-4" /> Маълумоти Молиявии Корпоративӣ
                     </div>
                     <p className="text-xs text-white/60 font-mono leading-relaxed">
                       {node.educationalTakeaway}
                     </p>
                  </div>
                </div>

                {/* ACTION BUTTONS (ACQUIRE & RESTRENGTHEN) */}
                <div className="mt-8 pt-6 border-t border-white/5 flex flex-col gap-4">
                   {/* Row 1: Capital info & owned status check */}
                   <div className="flex justify-between items-center">
                      <div className="flex flex-col">
                         <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest mb-1">Сармояи Зарурӣ</span>
                         <span className="text-2xl font-black font-mono text-white/80">
                           ${currentCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                         </span>
                      </div>
                      
                      {owned > 0 && (
                         <div className="inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest bg-[#F0B90B]/10 text-[#F0B90B] border border-[#F0B90B]/20 px-2.5 py-1 rounded-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#F0B90B] animate-pulse"></span>
                            ФАЪОЛ: {owned} адад
                         </div>
                      )}
                   </div>

                   {/* Row 2: Action buttons */}
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                      {owned > 0 && (
                        <button 
                          onClick={() => setSelectedNodeId(node.id)}
                          className="w-full px-6 py-4 border border-white/10 hover:border-[#F0B90B]/30 hover:bg-white/5 text-white font-black text-xs uppercase tracking-[0.2em] transition-all rounded-sm flex items-center justify-center gap-2 min-h-[44px] active:scale-95 cursor-pointer"
                        >
                          <Brain className="w-3.5 h-3.5 text-[#F0B90B] animate-pulse" />
                          Барқарорсозии AI
                        </button>
                      )}
                      
                      <button 
                        onClick={() => buyNode(node)}
                        disabled={!canAfford}
                        className={`w-full px-8 py-4 border font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 rounded-sm min-h-[44px] active:scale-95 cursor-pointer ${
                          owned > 0 ? "col-span-1" : "sm:col-span-2"
                        } ${
                          canAfford 
                            ? "border-[#F0B90B] bg-[#F0B90B]/10 text-[#F0B90B] hover:bg-[#F0B90B] hover:text-black shadow-[0_0_20px_rgba(240,185,11,0.1)]" 
                            : "border-white/10 text-white/20 bg-white/5 cursor-not-allowed"
                        }`}
                      >
                        Харидани Корхона
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                   </div>
                </div>
              </MonolithCard>
            );
          })}
        </div>
      ) : (
        <MonolithCard className="p-16 text-center space-y-4 border-dashed border-white/10 bg-white/[0.01]">
           <ShieldAlert className="w-12 h-12 text-[#F0B90B]/35 mx-auto animate-pulse" />
           <h3 className="text-xl font-bold uppercase tracking-wide text-white/80">Ҳеҷ гуна амалиёт ёфт нашуд</h3>
           <p className="text-xs text-white/40 font-mono max-w-md mx-auto leading-relaxed">
             Ҳеҷ як корхонаи инфрасохторӣ ба ҷустуҷӯ ва филтрҳои шумо мувофиқат намекунад. Филтрҳоро аз нав танзим кунед.
           </p>
           <button 
             onClick={() => {
               setSearchQuery("");
               setTypeFilter("all");
               setOwnershipFilter("all");
               setSortBy("price-asc");
             }}
             className="mt-4 px-6 py-2.5 border border-[#F0B90B]/30 hover:border-[#F0B90B] bg-[#F0B90B]/5 hover:bg-[#F0B90B]/10 text-[#F0B90B] text-xs font-black uppercase tracking-[0.2em] transition-all rounded-sm cursor-pointer"
           >
             Танзими дубораи филтрҳо
           </button>
        </MonolithCard>
      )}

      {/* Sleek Pagination controls */}
      {filteredAndSortedNodes.length > itemsPerPage && (
        <div className="flex justify-between items-center border-t border-white/5 pt-6 font-mono text-[11px] text-white/40">
           <div>
              Намоиши <span className="text-[#F0B90B] font-bold">{Math.min(filteredAndSortedNodes.length, (currentPage - 1) * itemsPerPage + 1)}-{Math.min(filteredAndSortedNodes.length, currentPage * itemsPerPage)}</span> аз <span className="text-white font-bold">{filteredAndSortedNodes.length}</span> корхонаҳои корпоративии мувофиқ
           </div>
           
           <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="w-10 h-10 border border-white/10 hover:border-[#F0B90B]/40 hover:bg-white/5 rounded-sm flex items-center justify-center transition-all disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer"
              >
                 <ChevronLeft className="w-4 h-4 text-white" />
              </button>
              
              <div className="px-4 py-2 border border-white/5 bg-white/[0.01] rounded-sm text-xs font-bold text-white tracking-widest font-mono">
                 {currentPage} / {totalPages}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="w-10 h-10 border border-white/10 hover:border-[#F0B90B]/40 hover:bg-white/5 rounded-sm flex items-center justify-center transition-all disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer"
              >
                 <ChevronRight className="w-4 h-4 text-white" />
              </button>
           </div>
        </div>
      )}
    </div>
  );
}
