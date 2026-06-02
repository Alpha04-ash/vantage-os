"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { ControlCenter } from "@/components/layout/ControlCenter";
import { MarketView } from "@/components/layout/MarketView";
import { PortfolioView } from "@/components/layout/PortfolioView";
import { AcademyView } from "@/components/layout/AcademyView";

import { BankView } from "@/components/layout/BankView";
import { EmpireView } from "@/components/layout/EmpireView";
import { RealEstateView } from "@/components/layout/RealEstateView";
import { CasinoView } from "@/components/layout/CasinoView";
import { AssetDetails } from "@/components/terminal/AssetDetails";
import { AssetTrade } from "@/components/terminal/AssetTrade";
import { useVantageStore } from "@/store/useVantageStore";
import { CryptoPrice } from "@/services/market";
import { marketSimulator } from "@/services/MarketSimulator";
import { motion, AnimatePresence } from "framer-motion";
import { Scanlines } from "@/components/layout/SovereignUI";
import { NeuralField3D } from "@/components/layout/NeuralField3D";
import { NeuralTicker } from "@/components/terminal/NeuralTicker";
import { SynapseTutor } from "@/components/layout/SynapseTutor";
import { SettingsWidget } from "@/components/layout/SettingsWidget";
import { SettingsView } from "@/components/layout/SettingsView";

export default function Home() {
  const { activeTab, collectYield, sanitizeState, tickLoanTimer, activeLoan, collectPropertyRent, tickFiscalTime } = useVantageStore();
  const [prices, setPrices] = useState<CryptoPrice[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<CryptoPrice | null>(null);
  const [selectedDetails, setSelectedDetails] = useState<CryptoPrice | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [offlineNotice, setOfflineNotice] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const msg = localStorage.getItem("vantage_offline_earnings_msg");
      const breachMsg = localStorage.getItem("vantage_offline_loan_breach");
      if (msg || breachMsg) {
        setOfflineNotice((msg || "") + (msg && breachMsg ? "\n\n" : "") + (breachMsg || ""));
        localStorage.removeItem("vantage_offline_earnings_msg");
        localStorage.removeItem("vantage_offline_loan_breach");
      }
    }
  }, []);

  // --- DATA SYNC ---
  const initSimulator = async () => {
    setIsSyncing(true);
    await marketSimulator.init();
    useVantageStore.getState().requestPortfolioAudit();
    setIsSyncing(false);
  };

  useEffect(() => {
    sanitizeState();
    initSimulator();
    const unsubscribe = marketSimulator.subscribe((newPrices) => {
      setPrices(newPrices);
    });
    return () => unsubscribe();
  }, []);

  // --- PASSIVE YIELD ENGINE ---
  useEffect(() => {
    const yieldInterval = setInterval(() => {
      collectYield();
      collectPropertyRent();
      tickFiscalTime();
      if (activeLoan) {
        tickLoanTimer();
      }
    }, 1000);
    return () => clearInterval(yieldInterval);
  }, [collectYield, collectPropertyRent, tickFiscalTime, activeLoan, tickLoanTimer]);

  // --- RENDER CONTENT ---
  const renderContent = () => {
    switch(activeTab) {
      case "dashboard": 
        return <ControlCenter prices={prices} isSyncing={isSyncing} onSync={initSimulator} />;
      case "empire":
        return <EmpireView />;
      case "market": 
        return <MarketView onTrade={setSelectedAsset} onDetails={setSelectedDetails} />;
      case "portfolio":
        return <PortfolioView />;
      case "academy":
        return <AcademyView />;

      case "bank":
        return <BankView />;
      case "realestate":
        return <RealEstateView />;
      case "casino":
        return <CasinoView />;
      case "settings":
        return <SettingsView />;
      default: 
        return <ControlCenter prices={prices} isSyncing={isSyncing} onSync={initSimulator} />;
    }
  };

  return (
    <main className="min-h-screen bg-[#0B0E11] text-white selection:bg-white selection:text-black overflow-x-hidden no-scrollbar relative">
      <NeuralField3D />
      <Scanlines />
      
      <Navbar />
      
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>

      {/* Modals */}
      <AnimatePresence>
        {selectedAsset && (
          <AssetTrade 
            asset={selectedAsset} 
            onClose={() => setSelectedAsset(null)} 
          />
        )}
        {selectedDetails && (
          <AssetDetails 
            asset={selectedDetails} 
            onClose={() => setSelectedDetails(null)} 
            onTrade={(asset) => {
              setSelectedDetails(null);
              setSelectedAsset(asset);
            }}
          />
        )}
      </AnimatePresence>

      {/* Offline Earnings Notification Toast */}
      <AnimatePresence>
        {offlineNotice && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-20 right-6 z-[10000] max-w-sm w-full bg-[#1E2026]/95 border border-[#F0B90B]/30 rounded-xl p-6 shadow-[0_0_30px_rgba(240,185,11,0.15)] backdrop-blur-xl"
          >
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-[#F0B90B]/10 border border-[#F0B90B]/20 text-[#F0B90B] text-base">
                💸
              </div>
              <div className="flex-1 space-y-3">
                <h4 className="text-xs font-black uppercase tracking-widest text-[#F0B90B] font-mono">
                  OFFLINE_REPORT // IDLE_REPORT
                </h4>
                <p className="text-[11px] text-[#EAECEF] font-mono leading-relaxed whitespace-pre-line">
                  {offlineNotice}
                </p>
                <button 
                  onClick={() => setOfflineNotice(null)}
                  className="px-4 py-1.5 bg-[#F0B90B] text-black font-black uppercase tracking-wider text-[9px] rounded hover:bg-[#F8D33A] active:scale-95 transition-all cursor-pointer"
                >
                  DISMISS
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <NeuralTicker />
      <SynapseTutor />
      <SettingsWidget />
    </main>
  );
}
