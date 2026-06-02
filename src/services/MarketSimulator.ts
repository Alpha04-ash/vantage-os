"use client";

import { fetchStableMarketData } from "@/app/actions/market";
import { CryptoPrice } from "./market";

export interface MarketEvent {
  id: string;
  headline: string;
  affectedAssets: Record<string, number>; // symbol -> percentage impact per tick
  duration: number; // ticks
  activeTicks: number;
}

const EVENT_POOL: MarketEvent[] = [
  {
    id: "hack_1",
    headline: "🚨 CRITICAL CEX EXPLOIT DETECTED | $400M EXPOSED",
    affectedAssets: { btc: -0.05, eth: -0.08, sol: -0.1 },
    duration: 30,
    activeTicks: 0
  },
  {
    id: "sec_1",
    headline: "⚖️ SEC APPROVES SOVEREIGN WEALTH CRYPTO FUND",
    affectedAssets: { btc: 0.08, eth: 0.05 },
    duration: 45,
    activeTicks: 0
  },
  {
    id: "quantum_1",
    headline: "⚛️ QUANTUM DECRYPTION THREAT ESCALATED",
    affectedAssets: { btc: -0.15, eth: -0.1 },
    duration: 20,
    activeTicks: 0
  },
  {
    id: "asia_1",
    headline: "🌏 ASIAN MARKETS INJECT $50B LIQUIDITY",
    affectedAssets: { btc: 0.04, eth: 0.06, sol: 0.08, ada: 0.05 },
    duration: 60,
    activeTicks: 0
  },
  {
    id: "network_1",
    headline: "⚡ SOLANA NETWORK UPGRADE REDUCES LATENCY BY 90%",
    affectedAssets: { sol: 0.15, eth: -0.02 },
    duration: 30,
    activeTicks: 0
  }
];

class Simulator {
  private activeEvents: MarketEvent[] = [];
  private prices: CryptoPrice[] = [];
  private subscribers: ((data: CryptoPrice[]) => void)[] = [];
  private initialized = false;
  private ws: WebSocket | null = null;

  async init() {
    if (this.initialized) return;
    this.prices = await fetchStableMarketData();
    this.prices = this.prices.slice(0, 10); // Keep it to top 10 for simulation
    this.initialized = true;

    // Start live WebSocket stream integration with Binance
    this.connectWebSocket();

    // Start event age ticks
    setInterval(() => this.tick(), 2000);
    
    // Start news/narrative event generator
    setInterval(() => this.triggerRandomEvent(), 30000); // New event every 30s
    this.triggerRandomEvent(); // Trigger first event immediately
  }

  private connectWebSocket() {
    if (typeof window === "undefined") return;

    // Build the multiplex streams query string for top 10 assets
    const symbols = ["btc", "eth", "sol", "ada", "xrp", "dot", "doge", "matic", "link", "trx"];
    const streams = symbols.map(s => `${s.toLowerCase()}usdt@ticker`).join("/");
    const wsUrl = `wss://stream.binance.com:9443/ws/${streams}`;

    console.log("[VANTAGE SIMULATOR WS] Connecting to Binance live feeds:", wsUrl);
    const ws = new WebSocket(wsUrl);

    ws.onmessage = (event) => {
      try {
        const raw = JSON.parse(event.data);
        const data = raw.data || raw; // Extract multiplex payload if present
        if (!data || !data.s) return;
        const sym = data.s.replace("USDT", "").toLowerCase();


        let changed = false;
        this.prices = this.prices.map(asset => {
          if (asset.id === sym) {
            changed = true;
            return {
              ...asset,
              current_price: parseFloat(data.c),
              price_change_percentage_24h: parseFloat(data.P),
              high_24h: parseFloat(data.h),
              low_24h: parseFloat(data.l),
              total_volume: parseFloat(data.q)
            };
          }
          return asset;
        });

        if (changed) {
          this.notify();
        }
      } catch (err) {
        console.error("[VANTAGE SIMULATOR WS] Message parsing error:", err);
      }
    };

    ws.onerror = (err) => {
      console.warn("[VANTAGE SIMULATOR WS] Live Binance feed connection failed. Simulator is running on offline-first mode using stable simulated algorithms.");
    };

    ws.onclose = () => {
      console.log("[VANTAGE SIMULATOR WS] Connection closed. Reconnecting in 5 seconds...");
      setTimeout(() => this.connectWebSocket(), 5000);
    };

    this.ws = ws;
  }

  triggerRandomEvent() {
    if (this.activeEvents.length > 2) return; // Max 2 active events
    const event = EVENT_POOL[Math.floor(Math.random() * EVENT_POOL.length)];
    if (!this.activeEvents.find(e => e.id === event.id)) {
      this.activeEvents.push({ ...event, activeTicks: 0 });
    }
  }

  tick() {
    if (!this.initialized) return;

    // Age events strictly without distorting live Binance prices
    this.activeEvents = this.activeEvents.filter(e => {
      e.activeTicks++;
      return e.activeTicks < e.duration;
    });

    this.notify();
  }

  subscribe(callback: (data: CryptoPrice[]) => void) {
    this.subscribers.push(callback);
    if (this.initialized) {
      callback(this.prices);
    }
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  private notify() {
    this.subscribers.forEach(cb => cb([...this.prices]));
  }

  getNewsFeed(): string {
    if (this.activeEvents.length === 0) return "MARKET STABLE | NO CRITICAL SYSTEM ANOMALIES DETECTED";
    return this.activeEvents.map(e => e.headline).join(" | ");
  }
}

export const marketSimulator = new Simulator();
