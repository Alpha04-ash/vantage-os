"use client";

import React, { useState, useEffect } from "react";
import { getTopAssets, subscribeToMultiplePrices, CryptoPrice } from "@/services/market";
import { motion, AnimatePresence } from "framer-motion";
import { Search, BarChart3, Globe, TrendingUp, TrendingDown } from "lucide-react";
import { MonolithCard, AssetIcon } from "./SovereignUI";
import { useRouter } from "next/navigation";

declare var pendo: any;

export function MarketView({ onTrade, onDetails }: { onTrade?: (asset: CryptoPrice) => void, onDetails?: (asset: CryptoPrice) => void }) {
  const [assets, setAssets] = useState<CryptoPrice[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      const data = await getTopAssets(50);
      setAssets(data);
      setLoading(false);
    };
    init();

    const symbols = ["btc", "eth", "sol", "ada", "xrp", "dot", "doge", "matic", "link", "trx"];
    const unsubscribe = subscribeToMultiplePrices(symbols, (update) => {
      setAssets(prev => prev.map(a => a.id === update.id ? { ...a, ...update } : a));
    });

    return () => unsubscribe();
  }, []);

  const filtered = assets.filter(a =>
    (a.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (a.symbol || "").toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (!search) return;
    const timer = setTimeout(() => {
      if (typeof pendo !== "undefined") {
        pendo.track("asset_search_executed", {
          searchQuery: search,
          resultsCount: filtered.length
        });
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const handleRouteToTrade = (symbol: string) => {
    router.push(`/trade/${symbol.toUpperCase()}_USDT`);
  };

  return (
    <div className="pt-20 sm:pt-24 px-4 sm:px-8 max-w-[1400px] mx-auto space-y-6 pb-24 no-scrollbar">
      {/* HEADER — Binance market style */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 py-5 border-b border-[#2B2F36]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Globe className="w-3.5 h-3.5 text-[#F0B90B]" />
            <span className="text-[10px] font-semibold uppercase tracking-widest text-[#848E9C]">LIVE_MARKET_FEED</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#EAECEF] tracking-tight">MARKET_METRICS</h2>
        </div>
        
        {/* Binance-style search */}
        <div className="relative group w-full md:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#848E9C] group-focus-within:text-[#F0B90B] transition-colors" />
          <input 
            type="text" 
            placeholder="Search assets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#2B2F36] border border-[#474D57] focus:border-[#F0B90B]/50 rounded-lg pl-10 pr-4 py-2.5 text-sm text-[#EAECEF] placeholder-[#848E9C] focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* ASSET GRID — Binance card style */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {loading ? (
          Array.from({ length: 15 }).map((_, i) => (
            <div key={i} className="bg-[#1E2026] border border-[#2B2F36] h-44 rounded-xl animate-pulse" />
          ))
        ) : (
          <AnimatePresence mode="popLayout">
            {filtered.map((asset, idx) => {
              const isPositive = asset.price_change_percentage_24h >= 0;
              return (
                <motion.div 
                  key={asset.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(idx * 0.02, 0.4) }}
                >
                  <MonolithCard className="p-4 group hover:border-[#474D57] transition-all h-full flex flex-col cursor-pointer">
                    <div className="flex justify-between items-start mb-4" onClick={() => handleRouteToTrade(asset.symbol)}>
                      <AssetIcon src={asset.image || ""} symbol={asset.symbol} className="w-9 h-9" />
                      <div className={`text-[10px] font-bold font-mono flex items-center gap-0.5 ${isPositive ? 'text-[#0ECB81]' : 'text-[#F6465D]'}`}>
                        {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {Math.abs(asset.price_change_percentage_24h).toFixed(2)}%
                      </div>
                    </div>

                    <div className="mb-4 flex-1" onClick={() => handleRouteToTrade(asset.symbol)}>
                      <h4 className="text-sm font-bold uppercase text-[#EAECEF] mb-0.5">{(asset.symbol || "").toString().toUpperCase()}</h4>
                      <div className="text-xs text-[#848E9C] mb-2 truncate">{asset.name}</div>
                      <div className="text-base font-bold font-mono text-[#EAECEF]">
                        ${(asset.current_price || 0).toLocaleString()}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleRouteToTrade(asset.symbol)}
                        className="flex-1 py-2 rounded-lg bg-[#F0B90B] text-black text-[10px] font-bold uppercase tracking-wider hover:bg-[#F8D33A] transition-colors"
                      >
                        TRADE
                      </button>
                      <button 
                        onClick={() => handleRouteToTrade(asset.symbol)}
                        className="w-9 h-9 rounded-lg border border-[#2B2F36] flex items-center justify-center hover:border-[#474D57] hover:bg-[#2B2F36] transition-all text-[#848E9C] hover:text-[#EAECEF]"
                      >
                        <BarChart3 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </MonolithCard>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
