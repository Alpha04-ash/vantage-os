"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, TrendingUp, TrendingDown, Wallet, Zap, ShieldCheck, Activity, Target, Fingerprint, Box } from "lucide-react";
import { CryptoPrice } from "@/services/market";
import { useVantageStore } from "@/store/useVantageStore";
import { MonolithCard } from "@/components/layout/SovereignUI";

export function AssetTrade({ asset, onClose }: { asset: CryptoPrice, onClose: () => void }) {
  const { balance, invest, sell, portfolio } = useVantageStore();
  const [amount, setAmount] = useState<string>("");
  const [type, setType] = useState<"buy" | "sell">("buy");

  if (!asset) return null;

  const currentHolding = portfolio.find(a => a.id === asset.id);
  const totalCost = Number(amount || 0) * (asset.current_price || 0);

  const handleExecute = () => {
    if (!amount || Number(amount) <= 0) return;
    if (type === "buy") {
      if (balance < totalCost) return;
      invest(asset, Number(amount), asset.current_price || 0);
    } else {
      if (!currentHolding || currentHolding.amount < Number(amount)) return;
      sell(asset.id, Number(amount), asset.current_price || 0);
    }
    onClose();
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[700] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="w-full max-w-2xl monolith-card rounded-sm bg-[#080808] p-12 relative overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="scanning-line opacity-30" />
        
        <div className="flex justify-between items-center mb-12">
           <div className="space-y-3">
              <div className="flex items-center gap-3 text-white/20">
                 <Box className="w-4 h-4" />
                 <span className="text-[10px] font-black uppercase tracking-[0.5em]">ORDER_INTERFACE_v4.2</span>
              </div>
              <h2 className="text-5xl font-black uppercase tracking-tighter italic leading-none text-white/90">TRANSACTION_CENTER</h2>
           </div>
           <button onClick={onClose} className="w-12 h-12 border border-white/10 flex items-center justify-center hover:border-white transition-all">
              <X className="w-6 h-6 text-white/40" />
           </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-10">
           <button 
             onClick={() => setType("buy")}
             className={`py-5 border text-[11px] font-black uppercase tracking-[0.4em] transition-all ${type === "buy" ? "bg-white text-black border-white" : "border-white/10 text-white/20 hover:border-white/40"}`}
           >
              Capital_Allocation
           </button>
           <button 
             onClick={() => setType("sell")}
             className={`py-5 border text-[11px] font-black uppercase tracking-[0.4em] transition-all ${type === "sell" ? "bg-white text-black border-white" : "border-white/10 text-white/20 hover:border-white/40"}`}
           >
              Capital_Harvest
           </button>
        </div>

        <div className="space-y-8 mb-12">
           <div className="p-8 border border-white/5 bg-white/[0.01]">
              <div className="flex justify-between items-center mb-4">
                 <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Quantity_Limit</span>
                 <span className="text-[10px] font-black font-mono text-white/40">Available: {currentHolding?.amount || 0} {asset.symbol.toUpperCase()}</span>
              </div>
              <div className="relative">
                 <input 
                   type="number" 
                   value={amount}
                   onChange={(e) => setAmount(e.target.value)}
                   placeholder="0.00"
                   className="w-full bg-transparent border-b-2 border-white/10 focus:border-white outline-none text-5xl font-black font-mono text-white/80 py-4 transition-all"
                 />
                 <span className="absolute right-0 top-1/2 -translate-y-1/2 text-xl font-black text-white/10 uppercase">{asset.symbol}</span>
              </div>
           </div>

           <div className="grid grid-cols-2 gap-6 px-4">
              <div>
                 <div className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-2">Unit_Acquisition_Price</div>
                 <div className="text-xl font-black font-mono text-white/60">${(asset.current_price || 0).toLocaleString()}</div>
              </div>
              <div className="text-right">
                 <div className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-2">Total_Estimated_Cost</div>
                 <div className="text-xl font-black font-mono text-white">${totalCost.toLocaleString()}</div>
              </div>
           </div>
        </div>

        <div className="flex items-center gap-6 pt-10 border-t border-white/5">
           <div className="flex-1">
              <div className="text-[9px] font-black uppercase tracking-widest text-white/10 mb-1">Liquid_Sovereign_Balance</div>
              <div className="text-2xl font-black font-mono text-white/40">${balance.toLocaleString()}</div>
           </div>
           <button 
             onClick={handleExecute}
             className="px-12 py-6 bg-white text-black text-[12px] font-black uppercase tracking-[0.5em] hover:bg-white/90 active:scale-95 transition-all shadow-2xl"
           >
              {type === "buy" ? "CONFIRM_ALLOCATION" : "CONFIRM_HARVEST"}
           </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
