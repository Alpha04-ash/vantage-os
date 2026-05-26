"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Activity, Fingerprint, ArrowRight } from "lucide-react";
import { CryptoPrice } from "@/services/market";
import { Asset3D } from "./Asset3D";

export function AssetDetails({ asset, onClose, onTrade }: { asset: CryptoPrice, onClose: () => void, onTrade: (asset: CryptoPrice) => void }) {
  if (!asset) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[600] flex items-center justify-center p-0 md:p-10 bg-[#0B0E11]/95 backdrop-blur-3xl"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 40 }}
        className="w-full max-w-7xl h-full md:h-[85vh] bg-[#1E2026] relative overflow-hidden flex flex-col md:flex-row shadow-[0_0_100px_rgba(0,0,0,0.5)] border border-[#2B2F36]"
        onClick={e => e.stopPropagation()}
      >
        {/* CINEMATIC 3D SHOWCASE (LEFT) */}
        <div className="flex-1 relative border-r border-[#2B2F36] bg-gradient-to-br from-[#0B0E11] to-[#1E2026]">
           <Asset3D asset={asset} />
           
           <div className="absolute top-12 left-12 z-20">
              <div className="flex items-center gap-6 mb-4">
                 <div className="w-2 h-2 bg-white animate-pulse" />
                 <span className="text-[11px] font-black uppercase tracking-[0.8em] text-white/40 font-mono">БОРКУНИИ_ФАЪОЛИ_ГИРЕҲ</span>
              </div>
              <h2 className="text-8xl font-black uppercase tracking-tighter italic leading-none text-white/90">
                 {asset.symbol.toUpperCase()}
              </h2>
           </div>
        </div>

        {/* INFORMATION MATRIX (RIGHT) */}
        <div className="w-full md:w-[450px] p-12 md:p-16 flex flex-col justify-between bg-[#1E2026]/40 backdrop-blur-xl relative z-10">
           <div className="absolute top-0 right-0 p-8">
              <button onClick={onClose} className="w-14 h-14 border border-[#2B2F36] flex items-center justify-center hover:border-white transition-all group">
                 <X className="w-8 h-8 text-white/20 group-hover:text-white" />
              </button>
           </div>

           <div className="space-y-16">
              <div>
                 <h3 className="text-[12px] font-black uppercase tracking-[0.5em] text-white/20 mb-6 flex items-center gap-3">
                    <Fingerprint className="w-4 h-4" /> МУШАХХАСОТИ_ДОРОӢ
                 </h3>
                 <h4 className="text-5xl font-black uppercase tracking-tighter italic text-white/80 leading-none">{asset.name}</h4>
              </div>

              <div className="grid grid-cols-1 gap-8">
                 {[
                   { label: "Даромади_Истихроҷ", value: `$${(asset.current_price || 0).toLocaleString()}`, sub: "НАРХИ_БОЗОРИИ_USD" },
                   { label: "Сармояи_Шабака", value: `$${(asset.market_cap || 0).toLocaleString()}`, sub: "АРЗИШИ_УМУМӢ" },
                   { label: "Тағйирёбии_Давра", value: `${asset.price_change_percentage_24h?.toFixed(2)}%`, sub: "ТАҒЙИРОТИ_24-СОАТА", color: asset.price_change_percentage_24h >= 0 ? "text-white" : "text-white/40" }
                 ].map(m => (
                   <div key={m.label} className="border-l border-white/10 pl-8 py-2">
                      <div className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-2">{m.label}</div>
                      <div className={`text-3xl font-black font-mono tracking-tighter ${m.color || 'text-white/90'}`}>{m.value}</div>
                      <div className="text-[9px] font-black uppercase tracking-widest text-white/10 mt-1">{m.sub}</div>
                   </div>
                 ))}
              </div>

              <div className="space-y-6 pt-10 border-t border-[#2B2F36]">
                 <div className="flex items-center gap-4 text-white/20">
                    <Activity className="w-5 h-5" />
                    <span className="text-[11px] font-black uppercase tracking-[0.4em]">АУДИТИ_НЕЙРОНИИ_УСТУВОР</span>
                 </div>
                 <p className="text-sm text-white/40 italic leading-relaxed font-mono">
                    Резонанси системавӣ пардохтпазирии оптималиро барои ин гиреҳ нишон медиҳад. Самаранокии пешбинишудаи истихроҷ дар доираи параметрҳои алфа мебошад.
                 </p>
              </div>
           </div>

           <div className="mt-16">
              <button 
                onClick={() => onTrade(asset)}
                className="w-full py-8 bg-white text-black text-[12px] font-black uppercase tracking-[0.6em] hover:bg-white/90 transition-all flex items-center justify-center gap-6 group"
              >
                 ОҒОЗ_КАРДАНИ_САВДО
                 <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </button>
           </div>
        </div>
        
        {/* DECORATIVE ELEMENTS */}
        <div className="absolute bottom-0 right-0 w-[50%] h-[1px] bg-gradient-to-l from-white/20 to-transparent" />
        <div className="absolute top-0 left-0 w-[1px] h-[50%] bg-gradient-to-b from-white/20 to-transparent" />
      </motion.div>
    </motion.div>
  );
}
