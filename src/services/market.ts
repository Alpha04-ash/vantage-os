"use client";

import { fetchStableMarketData } from "@/app/actions/market";

export interface CryptoPrice {
  id: string;
  symbol: string;
  name: string;
  image?: string;
  current_price: number;
  price_change_percentage_24h: number;
  high_24h?: number;
  low_24h?: number;
  market_cap?: number;
  total_volume?: number;
}

export function subscribeToMultiplePrices(symbols: string[], onUpdate: (data: any) => void) {
  const streams = symbols.map(s => `${s.toLowerCase()}usdt@ticker`).join("/");
  const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${streams}`);

  ws.onmessage = (event) => {
    try {
      const raw = JSON.parse(event.data);
      const data = raw.data || raw;
      if (!data || !data.s) return;
      const sym = data.s.replace("USDT", "").toLowerCase();
      onUpdate({
        id: sym,
        current_price: parseFloat(data.c),
        price_change_percentage_24h: parseFloat(data.P),
        high_24h: parseFloat(data.h),
        low_24h: parseFloat(data.l),
        total_volume: parseFloat(data.q)
      });
    } catch (e) {
      console.error("[market.ts WS] Error parsing multiplex message:", e);
    }
  };

  return () => ws.close();
}

export async function getTopAssets(limit: number = 50): Promise<CryptoPrice[]> {
  const data = await fetchStableMarketData();
  return data.slice(0, limit);
}

export function getMockHistoricalData(basePrice: number = 60000) {
  const data = [];
  let current = basePrice * 0.95; // Start slightly lower
  
  for (let i = 0; i < 30; i++) {
    // Generate a realistic random walk
    const change = (Math.random() - 0.45) * (basePrice * 0.01); 
    current += change;
    data.push({
      time: i,
      value: current,
      impact: 500 + i * 10
    });
  }
  
  // Ensure the last point is close to the current price
  data[data.length - 1].value = basePrice;
  
  return data;
}
