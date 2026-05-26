"use client";

import React, { useState } from "react";
import { useVantageStore } from "@/store/useVantageStore";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, BookOpen, TrendingDown, Brain, Lock, CheckCircle2, ChevronRight, Award, HelpCircle, AlertTriangle } from "lucide-react";

export function CasinoView() {
  const { learningXP, addXP } = useVantageStore();
  const [prankActive, setPrankActive] = useState(true);
  const [activeLessonTab, setActiveLessonTab] = useState<"math" | "psychology" | "wealth">("math");
  const [simulationRun, setSimulationRun] = useState(false);
  const [simStep, setSimStep] = useState(0);
  const [simBalance, setSimBalance] = useState(10000);
  const [simHistory, setSimHistory] = useState<number[]>([]);
  const [lessonCompleted, setLessonCompleted] = useState(false);

  // Run the loss visualizer simulation (acts as an educational telemetric chart)
  const runEducationalSimulation = () => {
    setSimulationRun(true);
    setSimStep(0);
    setSimBalance(10000);
    setSimHistory([10000]);

    let currentBal = 10000;
    let step = 0;
    
    const interval = setInterval(() => {
      if (currentBal <= 0 || step >= 50) {
        clearInterval(interval);
        setSimBalance(0);
        setLessonCompleted(true);
        addXP(150); // Reward operator for completing this cognitive lesson
        return;
      }

      // 2.5% house edge mathematical formula
      const won = Math.random() < 0.475;
      const bet = Math.floor(currentBal * 0.08); // aggressive bet size
      currentBal = won ? currentBal + bet : currentBal - bet;
      
      step += 1;
      setSimStep(step);
      setSimBalance(currentBal);
      setSimHistory(prev => [...prev, currentBal]);
    }, 80);
  };

  const handleRevealLesson = () => {
    setPrankActive(false);
  };

  return (
    <div className="pt-20 sm:pt-24 px-4 sm:px-8 max-w-[1000px] mx-auto space-y-6 pb-24 no-scrollbar text-[#EAECEF]">
      
      <AnimatePresence mode="wait">
        {prankActive ? (
          /* THE PRANK SCREEN */
          <motion.div
            key="prank"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="max-w-[700px] mx-auto text-center py-16 px-6 sm:px-12 bg-[#1E2026] border border-red-500/25 rounded-2xl relative overflow-hidden shadow-[0_0_50px_rgba(246,70,93,0.08)] my-12 flex flex-col items-center justify-center"
          >
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-red-500 via-[#F0B90B] to-red-500" />
            
            {/* Pulsing hazard icon */}
            <div className="inline-flex p-4 bg-red-500/10 border border-red-500/30 rounded-full text-red-500 mb-6 animate-bounce">
              <AlertTriangle className="w-12 h-12" />
            </div>

            <div className="max-w-2xl mx-auto space-y-4">
              <span className="px-3 py-1 text-[9px] font-bold tracking-widest bg-red-500/20 text-red-400 border border-red-500/30 rounded-full font-mono uppercase">
                ҲУШДОРИ БЕХАТАРӢ // SECURITY THREAT DETECTED
              </span>
              
              <h1 className="text-3xl font-black tracking-tight text-white uppercase mt-2 leading-tight">
                Шумо дар ҳақиқат хостед ба Казино ворид шавед?! 😂
              </h1>
              
              <p className="text-sm font-mono text-[#848E9C] leading-relaxed">
                Система фавран кӯшиши воридшавии шуморо боздошт. Оё фикр кардед, ки ба осонӣ ва зуд пул кор карда, бой мешавед? Системаи <strong className="text-red-400">VANTAGE Sovereign OS</strong> норасоии ҷиддии интизоми молиявии шуморо ошкор кард!
              </p>

              <div className="bg-[#14151A]/90 border border-[#2B2F36] rounded-xl p-4 my-6 text-[12px] font-mono text-[#F6465D] inline-block">
                🚨 СИСТЕМА ДИД, КИ САРВАТИ ХУДРО БА ДАСТИ КАЗИНОҲО ХОЛИС КАРДАНӢ ШУДЕД!
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <button
                  onClick={handleRevealLesson}
                  className="px-8 py-3.5 bg-[#F0B90B] hover:bg-[#F8D33A] text-black font-black text-xs tracking-widest uppercase rounded-lg shadow-lg hover:shadow-[#F0B90B]/10 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <HelpCircle className="w-4 h-4" />
                  Бозҳам бештар донистан // WHY IS THIS DANGEROUS?
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          /* THE DETAILED LESSON SCREEN */
          <motion.div
            key="lesson"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* HEADER SECTION WITH LOCK THEME */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#2B2F36] pb-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-500">
                  <Lock className="w-8 h-8 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 text-[8px] font-bold tracking-widest bg-amber-500/20 text-amber-500 border border-amber-500/30 rounded">
                      ТАҲЛИЛИ МУФЛИСШАВӢ // SYSTEMIC HAZARDS
                    </span>
                  </div>
                  <h1 className="text-2xl font-extrabold tracking-tight uppercase mt-1">
                    МОДУЛИ МАЪРИФАТӢ: ЧАРО КАЗИНО ХАРОБКОР АСТ?
                  </h1>
                  <p className="text-[11px] text-[#848E9C] font-mono uppercase tracking-wider mt-0.5">
                    Дастури омӯзишии система оид ба муфлисшавии математикии қиморбозӣ
                  </p>
                </div>
              </div>

              <div className="bg-[#1E2026] border border-[#2B2F36] rounded-xl p-3 flex flex-col items-end leading-none font-mono">
                <span className="text-[9px] text-[#848E9C] uppercase tracking-wider mb-1">САТҲИ ДОНИШ // XP:</span>
                <span className="text-lg font-black text-amber-400">{learningXP} XP</span>
              </div>
            </div>

            {/* WHY CASINO IS BLOCKED SHIELD */}
            <div className="bg-[#1E2026] border border-amber-500/20 rounded-xl p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-500 via-red-500 to-transparent" />
              <div className="flex flex-col lg:flex-row items-center gap-6">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold uppercase">
                    <ShieldAlert className="w-4 h-4" />
                    Кӯшиши қиморбозӣ боздошт шуд // SYSTEMIC FINANCIAL WEAKNESS EXPOSED
                  </div>
                  <h2 className="text-lg font-black tracking-wider uppercase text-white">
                    Чаро дар ин система КАЗИНО комилан баста аст?
                  </h2>
                  <p className="text-[12px] font-mono text-[#848E9C] leading-relaxed">
                    Қиморбозӣ (Casino) як раванди **Арзиши Манфии Интизорӣ (-EV)** мебошад, ки ба таври математикӣ барои нест кардани сармоя ва заиф сохтани майна офарида шудааст. Барои озодии молиявии шумо, дастрасӣ ба бозиҳои қимор баста шудааст ва ба ҷои он ин <strong>Модули Маърифатӣ</strong> фаъол гардид, то риёзиёти пушти ин домро омӯзед.
                  </p>
                </div>
                <div className="px-5 py-4 bg-[#14151A] border border-[#2B2F36] rounded-xl text-center shrink-0 w-full lg:w-72">
                  <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest block font-mono mb-2">ХУЛОСАИ РИЁЗӢ</span>
                  <div className="text-2xl font-black text-red-500 font-mono">-100%</div>
                  <span className="text-[9px] text-[#848E9C] uppercase tracking-wider block font-mono mt-1">ИНТИЗОРИИ БАЛАНС ДАР ДАРОЗМУДДАТ</span>
                </div>
              </div>
            </div>

            {/* CORE LESSON STRUCTURE */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* LESSON NAVIGATION TABS */}
              <div className="lg:col-span-1 space-y-3">
                <span className="text-[9px] font-bold text-[#848E9C] font-mono uppercase tracking-widest block px-1">
                  // МЕНЮИ ДАРСҲО
                </span>
                <button
                  onClick={() => setActiveLessonTab("math")}
                  className={`w-full p-4 rounded-xl border text-left transition-all flex items-start gap-3 ${
                    activeLessonTab === "math"
                      ? "bg-amber-500/5 border-amber-500 text-[#EAECEF]"
                      : "border-[#2B2F36] bg-[#1E2026] hover:bg-[#2B2F36] text-[#848E9C]"
                  }`}
                >
                  <BookOpen className="w-5 h-5 mt-0.5 text-amber-500 shrink-0" />
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider">Дарси 1: Риёзиёти Харобшавӣ</h3>
                    <p className="text-[10px] font-mono mt-1 leading-normal text-[#848E9C]">
                      Омӯзиши House Edge ва эҳтимолияти манфии математикӣ.
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => setActiveLessonTab("psychology")}
                  className={`w-full p-4 rounded-xl border text-left transition-all flex items-start gap-3 ${
                    activeLessonTab === "psychology"
                      ? "bg-amber-500/5 border-amber-500 text-[#EAECEF]"
                      : "border-[#2B2F36] bg-[#1E2026] hover:bg-[#2B2F36] text-[#848E9C]"
                  }`}
                >
                  <Brain className="w-5 h-5 mt-0.5 text-amber-500 shrink-0" />
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider">Дарси 2: Домҳои Допаминӣ</h3>
                    <p className="text-[10px] font-mono mt-1 leading-normal text-[#848E9C]">
                      Чӣ тавр казино майнаи шуморо бар зидди худатон истифода мебарад.
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => setActiveLessonTab("wealth")}
                  className={`w-full p-4 rounded-xl border text-left transition-all flex items-start gap-3 ${
                    activeLessonTab === "wealth"
                      ? "bg-amber-500/5 border-amber-500 text-[#EAECEF]"
                      : "border-[#2B2F36] bg-[#1E2026] hover:bg-[#2B2F36] text-[#848E9C]"
                  }`}
                >
                  <TrendingDown className="w-5 h-5 mt-0.5 text-amber-500 shrink-0" />
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider">Дарси 3: Роҳи Суверенӣ</h3>
                    <p className="text-[10px] font-mono mt-1 leading-normal text-[#848E9C]">
                      Муқоисаи нестшавии сармоя бо сармоягузории фоидаовар.
                    </p>
                  </div>
                </button>
              </div>

              {/* ACTIVE LESSON VIEW CONTAINER */}
              <div className="lg:col-span-2 bg-[#1E2026] border border-[#2B2F36] rounded-xl p-6 flex flex-col justify-between">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeLessonTab}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    {activeLessonTab === "math" && (
                      <div className="space-y-3 font-mono text-[12px] text-[#848E9C] leading-relaxed">
                        <h3 className="text-sm font-extrabold text-[#EAECEF] uppercase tracking-wider border-b border-[#2B2F36] pb-2">
                          ДАРСИ 1: РИЁЗИЁТ ВА МАТЕМАТИКАИ КАЗИНО // -EV
                        </h3>
                        <p>
                          Дар казино, ҳама гуна бозӣ (рулетка, слот, блэкджек) дорои <strong className="text-red-400">Афзалияти Хона (House Edge)</strong> мебошад. Масалан, дар рулеткаи аврупоӣ ин афзалият <strong>2.7%</strong>-ро ташкил медиҳад. Ин маънои онро дорад, ки ба ҳисоби миёна одам барои ҳар як $100 гузоштааш, ба таври автоматӣ $2.7-ро комилан бой медиҳад.
                        </p>
                        <p>
                          Ба шарофати <strong>Қонуни Рақамҳои Калон (Law of Large Numbers)</strong>, агар шумо бозиро такрор кардан гиред, тавозуни шумо новобаста аз бурдҳои хурди тасодуфӣ, бемайлон ба сифр наздик мешавад. Ин риёзиёт аст, на бахт. Хона ҳамеша бозиро дар дарозмуддат бохт мегардонад.
                        </p>
                        <div className="p-3 bg-[#14151A] rounded-lg border border-[#2B2F36]">
                          <span className="text-[10px] text-amber-500 font-bold block mb-1">ФОРМУЛАИ МУФЛИСШАВӢ:</span>
                          <code className="text-xs text-[#EAECEF]">Lim (Bets -&gt; Infinity) [Balance] = $0</code>
                        </div>
                      </div>
                    )}

                    {activeLessonTab === "psychology" && (
                      <div className="space-y-3 font-mono text-[12px] text-[#848E9C] leading-relaxed">
                        <h3 className="text-sm font-extrabold text-[#EAECEF] uppercase tracking-wider border-b border-[#2B2F36] pb-2">
                          ДАРСИ 2: ДОМҲОИ НЕЙРОЛОГИИ ДОПАМИН
                        </h3>
                        <p>
                          Казиноҳо аз ҷониби нейробиологҳо барои идора ва ҳабс кардани системаи асаб тарҳрезӣ шудаанд. Вақте ки одам бозӣ мекунад, майнаи ӯ бо ҳар як бурди хурди тасодуфӣ миқдори зиёди <strong>Допамин</strong> хориҷ мекунад.
                        </p>
                        <p>
                          Ин боиси пайдоиши одати харобкори **"мукофоти зуд ва бе заҳмат"** мегардад. Ин раванд одати банақшагирии молиявии оқилона, сабр ва хоҳиши сохтани тиҷорати воқеиро дар майна пурра нест мекунад. Корбар оҳиста-оҳиста қобилияти қабули қарорҳои мантиқии молиявиро аз даст медиҳад.
                        </p>
                        <div className="p-3 bg-red-950/10 border border-red-500/20 rounded-lg flex items-center gap-3">
                          <ShieldAlert className="w-5 h-5 text-red-400 shrink-0" />
                          <span className="text-[10px] text-red-400 font-bold">ХАТАРИ СУСТШАВИИ СУВЕРЕНИТЕТИ ФАРДӢ.</span>
                        </div>
                      </div>
                    )}

                    {activeLessonTab === "wealth" && (
                      <div className="space-y-3 font-mono text-[12px] text-[#848E9C] leading-relaxed">
                        <h3 className="text-sm font-extrabold text-[#EAECEF] uppercase tracking-wider border-b border-[#2B2F36] pb-2">
                          ДАРСИ 3: РОҲИ МУТЛАҚИ СУВЕРЕНӢ ВА САРМОЯ
                        </h3>
                        <p>
                          Сармоягузори суверенӣ фарқияти куллии байни нест кардани сармоя ва зиёд кардани онро медонад. 
                        </p>
                        <p>
                          Баръакси казино, ки дороиҳои сохта ва беарзиш дорад, сармоягузорӣ ба <strong>Амволи Ғайриманқул (Real Estate)</strong> ва <strong>Гиреҳҳои Империя (SaaS, Data Centers)</strong> дороиҳои ҳақиқӣ мебошанд, ки барои шумо **Иҷорапулӣ (Yield)**, **Суръати афзоиши нарх (Appreciation)** ва **Фоизи Мураккаби мусбат** истеҳсол мекунанд. Ин роҳи ягонаи устувори бой шудан аст.
                        </p>
                        <div className="grid grid-cols-2 gap-3 mt-2 text-center">
                          <div className="p-3 bg-red-950/20 border border-red-500/20 rounded-lg">
                            <span className="text-[9px] text-[#848E9C] block">ҚИМОР / КАЗИНО</span>
                            <span className="text-xs font-black text-red-400 block mt-1">ЗАРАРИ АНИҚ (-EV)</span>
                          </div>
                          <div className="p-3 bg-emerald-950/20 border border-emerald-500/20 rounded-lg">
                            <span className="text-[9px] text-[#848E9C] block">САРМОЯИ ВОҚЕӢ</span>
                            <span className="text-xs font-black text-emerald-400 block mt-1">ФОИДАИ МУТЛАҚ (+EV)</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* TELEMETRIC RUIN DEMONSTRATION ENGINE */}
                <div className="mt-8 border-t border-[#2B2F36] pt-6 space-y-4">
                  <div>
                    <h4 className="text-xs font-bold text-[#EAECEF] uppercase tracking-wider flex items-center gap-1.5 font-mono">
                      <ChevronRight className="w-4 h-4 text-amber-500" />
                      ОЗМОИШИ ТЕЛЕМЕТРИИ ХАРОБШАВӢ (VISUAL DEMO)
                    </h4>
                    <p className="text-[10px] font-mono text-[#848E9C] mt-1 leading-normal">
                      Бо пахш кардани тугмаи поён, шумо симулятсияи автоматии муфлисшавии як қиморбозро бо $10,000 сармоя дар давоми 50 бозӣ мебинед. Ин исботи визуалии дарс мебошад.
                    </p>
                  </div>

                  {simulationRun && (
                    <div className="bg-[#14151A] border border-[#2B2F36] p-4 rounded-xl space-y-3 font-mono">
                      <div className="flex justify-between text-[10px]">
                        <span>Тавозуни Симулятсионӣ: <strong className="text-red-400">${simBalance}</strong></span>
                        <span>Қадамҳо (Bets): <strong>{simStep}/50</strong></span>
                      </div>
                      
                      {/* Telemetry wave */}
                      <div className="h-16 flex items-end gap-1 overflow-hidden relative border border-[#2B2F36]/50 rounded px-1">
                        {simHistory.map((val, idx) => {
                          const pct = Math.min(100, Math.floor((val / 10000) * 80));
                          return (
                            <div
                              key={idx}
                              style={{ height: `${Math.max(4, pct)}%` }}
                              className="flex-1 bg-red-500/50 rounded-sm"
                            />
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row items-center gap-4 justify-between">
                    {!simulationRun ? (
                      <button
                        onClick={runEducationalSimulation}
                        className="w-full sm:w-auto px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-black font-extrabold text-[10px] tracking-widest uppercase rounded-lg transition-all cursor-pointer"
                      >
                        ОҒОЗИ ВИЗУАЛИЗАТСИЯИ ДАРС
                      </button>
                    ) : (
                      <div className="text-[11px] font-mono text-amber-400 animate-pulse">
                        ⚡ ТАҲЛИЛИ РИЁЗӢ ДАР ҲОЛИ ИҶРО...
                      </div>
                    )}

                    {lessonCompleted && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-2 text-emerald-400 font-mono text-[11px] bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        ДАРС БО МУВАФФАҚИЯТ АДО ШУД // +150 XP REWARDED
                      </motion.div>
                    )}
                  </div>
                </div>

              </div>

            </div>

            {/* SOVEREIGN VERDICT BADGE */}
            <div className="bg-[#1E2026] border border-[#2B2F36] rounded-xl p-5 flex items-center justify-between gap-4 font-mono text-[11px]">
              <div className="flex items-center gap-3">
                <Award className="w-5 h-5 text-emerald-400 shrink-0 animate-bounce" />
                <span className="text-emerald-400 uppercase tracking-wide leading-relaxed">
                  ХУЛОСАИ ДАРС: ОПЕРАТОРИ ХУДМУХТОР ҲЕҶ ГОҲ САРМОЯИ ГИРОНҚАДРИ ХУДРО БА КАЗИНОҲО ҚУРБОН НЕСТ КУНАД, ЗЕРО МАТЕМАТИКАИ КАЗИНО ТАҲҚИРИ СУВЕРЕНИТЕТИ ШУМОСТ.
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
