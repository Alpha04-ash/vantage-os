"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { useVantageStore } from "@/store/useVantageStore";
import { marketSimulator } from "@/services/MarketSimulator";
import { CryptoPrice } from "@/services/market";
import { motion, AnimatePresence } from "framer-motion";
import { 
  TrendingUp, TrendingDown, Clock, ArrowLeft, BookOpen, 
  Activity, Wallet, Landmark, ChevronUp, ChevronDown, 
  HelpCircle, RefreshCw, BarChart2, DollarSign, Award, Percent,
  Plus, Minus, RotateCcw, MousePointer, Brush, Type, Ruler, Trash2
} from "lucide-react";
import { NeuralField, Scanlines } from "@/components/layout/SovereignUI";
import { SynapseTutor } from "@/components/layout/SynapseTutor";

declare var pendo: any;

const playTradeSound = (type?: string) => {};
const playAlertSynth = (type?: string) => {};

// --- GLOBAL COIN METADATA FALLBACKS ---
const COIN_METADATA: Record<string, { name: string, image: string, fallbackPrice: number }> = {
  btc: { name: "Bitcoin", image: "https://assets.coingecko.com/coins/images/1/small/bitcoin.png", fallbackPrice: 65420 },
  eth: { name: "Ethereum", image: "https://assets.coingecko.com/coins/images/279/small/ethereum.png", fallbackPrice: 3420 },
  sol: { name: "Solana", image: "https://assets.coingecko.com/coins/images/4128/small/solana.png", fallbackPrice: 178.5 },
  ada: { name: "Cardano", image: "https://assets.coingecko.com/coins/images/975/small/cardano.png", fallbackPrice: 0.48 },
  xrp: { name: "Ripple", image: "https://assets.coingecko.com/coins/images/44/small/xrp.png", fallbackPrice: 0.52 },
  dot: { name: "Polkadot", image: "https://assets.coingecko.com/coins/images/12171/small/polkadot.png", fallbackPrice: 6.8 },
  doge: { name: "Dogecoin", image: "https://assets.coingecko.com/coins/images/75/small/dogecoin.png", fallbackPrice: 0.14 },
  matic: { name: "Polygon", image: "https://assets.coingecko.com/coins/images/4713/small/polygon.png", fallbackPrice: 0.65 },
  link: { name: "Chainlink", image: "https://assets.coingecko.com/coins/images/877/small/chainlink.png", fallbackPrice: 15.3 },
  trx: { name: "Tron", image: "https://assets.coingecko.com/coins/images/1094/small/tron.png", fallbackPrice: 0.11 }
};

interface Candle {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface TradeLog {
  time: string;
  price: number;
  amount: number;
  side: "buy" | "sell";
}

// --- SCALE-INDEPENDENT GRAPHIC DRAWING ANNOTATIONS ---
type DrawingType = "trendline" | "fibonacci" | "brush" | "text" | "ruler";

interface DrawingPoint {
  time: string;
  price: number;
}

interface Drawing {
  id: string;
  type: DrawingType;
  points: DrawingPoint[];
  text?: string;
  color: string;
}

export interface WhaleAlert {
  id: string;
  type: "WHALE" | "LIQUIDATION";
  message: string;
  timestamp: string;
}

export default function TradeTerminalPage() {
  const params = useParams();
  const router = useRouter();
  const symbolParam = (params?.symbol as string) || "BTC_USDT";
  
  // Extract canonical asset name and symbol details
  const symbolNormalized = symbolParam.toUpperCase();
  const assetId = symbolParam.split("_")[0].toLowerCase();
  const assetMeta = COIN_METADATA[assetId] || { name: symbolNormalized, image: "", fallbackPrice: 1.0 };
  const binancePair = `${assetId.toUpperCase()}USDT`;

  // Store access
  const { 
    balance, invest, sell, portfolio, sanitizeState, 
    collectYield, collectPropertyRent, tickFiscalTime, activeLoan, tickLoanTimer 
  } = useVantageStore();

  // Whale Alerts state & helper
  const [whaleAlerts, setWhaleAlerts] = useState<WhaleAlert[]>([]);

  const addWhaleAlert = (type: "WHALE" | "LIQUIDATION", message: string) => {
    const newAlert: WhaleAlert = {
      id: Math.random().toString(),
      type,
      message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };
    setWhaleAlerts(prev => [newAlert, ...prev].slice(0, 10)); // Limit to rolling 10 alerts
    playAlertSynth(type);
  };

  const addWhaleAlertRef = useRef<any>(null);
  addWhaleAlertRef.current = addWhaleAlert;

  // Simulated Liquidation Engine (triggers once every 15-25 seconds)
  useEffect(() => {
    const coinNames = ["BTC", "ETH", "SOL", "ADA", "XRP", "DOT", "DOGE"];
    const triggerLiquidation = () => {
      const sym = coinNames[Math.floor(Math.random() * coinNames.length)];
      const side = Math.random() > 0.5 ? "LONG" : "SHORT";
      const leverages = [20, 50, 100];
      const leverage = leverages[Math.floor(Math.random() * leverages.length)];
      const amount = Math.floor(25000 + Math.random() * 250000);
      
      const msg = `🚨 FORCED LEVERAGE LIQUIDATION ${leverage}x: ${side} contract on ${sym} of $${amount.toLocaleString()} has been liquidated!`;
      addWhaleAlertRef.current?.("LIQUIDATION", msg);
    };

    // Trigger the first simulation after 5 seconds, then schedule subsequent random fires
    const initialTimer = setTimeout(triggerLiquidation, 5000);

    const interval = setInterval(() => {
      triggerLiquidation();
    }, 15000 + Math.random() * 10000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, []);

  // State parameters
  const [candles, setCandles] = useState<Candle[]>([]);
  const [trades, setTrades] = useState<TradeLog[]>(() => {
    const base = COIN_METADATA[symbolParam.split("_")[0].toLowerCase()]?.fallbackPrice || 100.0;
    const mockTrades: TradeLog[] = [];
    const now = Date.now();
    for (let i = 0; i < 15; i++) {
      const timeStr = new Date(now - i * 3000).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const side: "buy" | "sell" = Math.random() > 0.5 ? "buy" : "sell";
      const price = base * (1 + (Math.random() - 0.5) * 0.0008);
      const amount = Math.random() * 1.2 + 0.05;
      mockTrades.push({ time: timeStr, price, amount, side });
    }
    return mockTrades;
  });
  const [activeTimeframe, setActiveTimeframe] = useState<"Time" | "1s" | "15m" | "1H" | "4H" | "1D" | "1W">("15m");
  const [prevPrice, setPrevPrice] = useState<number>(0);
  const [priceFlash, setPriceFlash] = useState<"up" | "down" | null>(null);

  // Zooming & Sidebar Drawing parameters
  const [visibleCandlesCount, setVisibleCandlesCount] = useState<number>(50);
  const [activeDrawTool, setActiveDrawTool] = useState<"cursor" | "trendline" | "fibonacci" | "brush" | "text" | "ruler">("cursor");
  const [drawings, setDrawings] = useState<Drawing[]>([]);
  const [activeDrawing, setActiveDrawing] = useState<Drawing | null>(null);

  // Live WebSocket Ticker Info
  const [tickerStats, setTickerStats] = useState<{
    current_price: number;
    price_change_percentage_24h: number;
    high_24h: number;
    low_24h: number;
    total_volume: number;
    volume_asset: number;
  }>({
    current_price: assetMeta.fallbackPrice,
    price_change_percentage_24h: 1.5,
    high_24h: assetMeta.fallbackPrice * 1.03,
    low_24h: assetMeta.fallbackPrice * 0.97,
    total_volume: 54000000,
    volume_asset: 54000000 / assetMeta.fallbackPrice
  });

  // Live WebSocket Order Book Info
  const [orderBookMode, setOrderBookMode] = useState<"both" | "asks" | "bids">("both");
  
  // Calculate default decimal options based on asset price scale
  const defaultDecimals = useMemo(() => {
    const base = COIN_METADATA[symbolParam.split("_")[0].toLowerCase()]?.fallbackPrice || 100.0;
    if (base >= 1000) return 2;
    if (base >= 100) return 2;
    if (base >= 1) return 3;
    return 4;
  }, [symbolParam]);

  const [decimalPrecision, setDecimalPrecision] = useState<number>(2);

  // Sync decimal precision when defaultDecimals changes
  useEffect(() => {
    setDecimalPrecision(defaultDecimals);
  }, [defaultDecimals]);

  const [orderBook, setOrderBook] = useState<{
    asks: { price: number; amount: number; cumulative: number }[];
    bids: { price: number; amount: number; cumulative: number }[];
  }>(() => {
    const base = COIN_METADATA[symbolParam.split("_")[0].toLowerCase()]?.fallbackPrice || 100.0;
    const asks = [];
    const bids = [];
    
    // Generate 24 realistic asks/bids for maximum screen filling
    for (let i = 0; i < 24; i++) {
      const askPrice = base * (1 + (i + 1) * 0.00012 + Math.random() * 0.00012);
      const askAmount = Math.random() * 1.8 + 0.1;
      asks.push({ price: askPrice, amount: askAmount, cumulative: 0 });
    }
    asks.reverse(); // Order asks descending
    
    for (let i = 0; i < 24; i++) {
      const bidPrice = base * (1 - (i + 1) * 0.00012 - Math.random() * 0.00012);
      const bidAmount = Math.random() * 1.8 + 0.1;
      bids.push({ price: bidPrice, amount: bidAmount, cumulative: 0 });
    }
    
    // Calculate cumulative asks
    let sumAsk = 0;
    for (let i = asks.length - 1; i >= 0; i--) {
      sumAsk += asks[i].amount;
      asks[i].cumulative = sumAsk;
    }
    
    // Calculate cumulative bids
    let sumBid = 0;
    for (let i = 0; i < bids.length; i++) {
      sumBid += bids[i].amount;
      bids[i].cumulative = sumBid;
    }
    
    return { asks, bids };
  });

  const slicedAsks = useMemo(() => {
    if (orderBookMode === "both") {
      return orderBook.asks.slice(-14);
    } else if (orderBookMode === "asks") {
      return orderBook.asks.slice(-28);
    }
    return [];
  }, [orderBook.asks, orderBookMode]);

  const slicedBids = useMemo(() => {
    if (orderBookMode === "both") {
      return orderBook.bids.slice(0, 14);
    } else if (orderBookMode === "bids") {
      return orderBook.bids.slice(0, 28);
    }
    return [];
  }, [orderBook.bids, orderBookMode]);

  // Form parameters
  const [orderType, setOrderType] = useState<"limit" | "market">("limit");
  const [tradeSide, setTradeSide] = useState<"buy" | "sell">("buy");
  const [limitPrice, setLimitPrice] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [total, setTotal] = useState<string>("");
  const [orderNotification, setOrderNotification] = useState<{ message: string, success: boolean } | null>(null);

  // References
  const wsRef = useRef<WebSocket | null>(null);
  const chartSvgRef = useRef<SVGSVGElement | null>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [hoverCoords, setHoverCoords] = useState<{ x: number, y: number } | null>(null);
  const lastSoundTickRef = useRef<number>(0);

  const currentPrice = tickerStats.current_price;

  // Initialize trade forms with live price
  useEffect(() => {
    if (currentPrice && !limitPrice) {
      setLimitPrice(currentPrice.toFixed(2));
    }
  }, [currentPrice]);

  // Clean and initialize historical klines from Binance API
  const loadHistoricalKlines = async (symbol: string, tf: string) => {
    const pair = symbol.replace("_", "").toUpperCase();
    let interval = "15m";
    if (tf === "1s") interval = "1s";
    else if (tf === "Time") interval = "1m"; // "Time" represents 1-minute close price line chart on Binance
    else if (tf === "15m") interval = "15m";
    else if (tf === "1H") interval = "1h";
    else if (tf === "4H") interval = "4h";
    else if (tf === "1D") interval = "1d";
    else if (tf === "1W") interval = "1w";

    try {
      let res = await fetch(`https://api.binance.com/api/v3/klines?symbol=${pair}&interval=${interval}&limit=150`);
      if (!res.ok && interval === "1s") {
        // Fall back to 1m interval if 1s isn't supported for this pair in the historical API
        res = await fetch(`https://api.binance.com/api/v3/klines?symbol=${pair}&interval=1m&limit=150`);
      }
      if (!res.ok) throw new Error("Binance REST error");
      const data = await res.json();
      const mapped = data.map((item: any) => {
        const d = new Date(item[0]);
        let timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: tf === "1s" ? '2-digit' : undefined });
        if (tf === "1D" || tf === "1W") {
          timeStr = d.toLocaleDateString([], { month: 'short', day: '2-digit' });
        }
        return {
          time: timeStr,
          open: parseFloat(item[1]),
          high: parseFloat(item[2]),
          low: parseFloat(item[3]),
          close: parseFloat(item[4]),
          volume: parseFloat(item[5]) / 1000
        };
      });
      setCandles(mapped);
    } catch (e) {
      console.warn("[VANTAGE WS] Failed to fetch REST klines, pre-generating mock fallbacks:", e);
      // Fallback
      const base = currentPrice || assetMeta.fallbackPrice;
      const mock = [];
      let tempPrice = base * 0.96;
      const now = new Date();
      for (let i = 150; i > 0; i--) {
        const d = new Date(now.getTime() - i * 60000);
        const timeStr = tf === "1D" ? d.toLocaleDateString([], { month: 'short', day: '2-digit' }) : d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const open = tempPrice;
        const close = tempPrice + (Math.random() - 0.48) * (base * 0.005);
        mock.push({
          time: timeStr,
          open,
          high: Math.max(open, close) + Math.random() * (base * 0.002),
          low: Math.min(open, close) - Math.random() * (base * 0.002),
          close,
          volume: Math.random() * 40 + 10
        });
        tempPrice = close;
      }
      setCandles(mock);
    }
  };

  // --- PASSIVE ENGINE YIELDS ---
  useEffect(() => {
    sanitizeState();
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

  // --- CONNECT LIVE BINANCE WEBSOCKET ---
  useEffect(() => {
    // Initial fetch of klines
    loadHistoricalKlines(symbolParam, activeTimeframe);

    const pairLower = binancePair.toLowerCase();
    let binanceInterval = "15m";
    if (activeTimeframe === "1s") binanceInterval = "1s";
    else if (activeTimeframe === "Time") binanceInterval = "1m";
    else if (activeTimeframe === "15m") binanceInterval = "15m";
    else if (activeTimeframe === "1H") binanceInterval = "1h";
    else if (activeTimeframe === "4H") binanceInterval = "4h";
    else if (activeTimeframe === "1D") binanceInterval = "1d";
    else if (activeTimeframe === "1W") binanceInterval = "1w";
    
    // Construct single multiplex connection URL
    const streams = [
      `${pairLower}@ticker`,
      `${pairLower}@trade`,
      `${pairLower}@depth20`,
      `${pairLower}@kline_${binanceInterval}`
    ].join("/");

    const wsUrl = `wss://stream.binance.com:9443/ws/${streams}`;
    console.log("[VANTAGE WS] Connecting to Binance WebSocket:", wsUrl);

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        
        // Handle stream multiplex wrappers
        const stream = msg.stream || "";
        const data = msg.data || msg; // Extract multiplex payload if present, else fallback
        lastWsMsgTimeRef.current = Date.now(); // Reset fallback sleep timer



        // 1. Ticker Stream
        if (stream.endsWith("@ticker")) {
          const price = parseFloat(data.c);
          setTickerStats({
            current_price: price,
            price_change_percentage_24h: parseFloat(data.P),
            high_24h: parseFloat(data.h),
            low_24h: parseFloat(data.l),
            total_volume: parseFloat(data.q),
            volume_asset: parseFloat(data.v)
          });

          // Play high-frequency tick sound throttled to max once every 200ms for user comfort
          if (price !== prevPrice) {
            const now = Date.now();
            if (now - lastSoundTickRef.current > 200) {
              playTradeSound("tick");
              lastSoundTickRef.current = now;
            }
            const dir = price > prevPrice ? "up" : "down";
            setPriceFlash(dir);
            setTimeout(() => setPriceFlash(null), 150);
            setPrevPrice(price);
          }
        }
        
        // 2. Depth Stream (Order Book)
        else if (stream.endsWith("@depth20")) {
          const asks = data.a.map((a: any) => ({
            price: parseFloat(a[0]),
            amount: parseFloat(a[1]),
            cumulative: 0
          })).reverse(); // Red asks descending

          const bids = data.b.map((b: any) => ({
            price: parseFloat(b[0]),
            amount: parseFloat(b[1]),
            cumulative: 0
          }));

          // Calculate cumulative values
          let accumAsk = 0;
          for (let i = asks.length - 1; i >= 0; i--) {
            accumAsk += asks[i].amount;
            asks[i].cumulative = accumAsk;
          }

          let accumBid = 0;
          for (let i = 0; i < bids.length; i++) {
            accumBid += bids[i].amount;
            bids[i].cumulative = accumBid;
          }

          setOrderBook({ asks, bids });
        }

        // 3. Trade Stream
        else if (stream.endsWith("@trade")) {
          const side = data.m ? "sell" : "buy"; // m=true means buyer is market maker (sell taker)
          const tradePrice = parseFloat(data.p);
          const tradeAmount = parseFloat(data.q);
          const totalVal = tradePrice * tradeAmount;
          
          const newTrade: TradeLog = {
            time: new Date(data.T).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            price: tradePrice,
            amount: tradeAmount,
            side
          };
          setTrades(prev => [newTrade, ...prev].slice(0, 20));

          // Whale Trade Alert Interceptor (threshold >= $75,000)
          if (totalVal >= 75000) {
            const sym = symbolNormalized.split("_")[0];
            const sideWord = side === "buy" ? "BOUGHT" : "SOLD";
            const sideColor = side === "buy" ? "🟢" : "🔴";
            const msg = `🐳 ${sideColor} WHALE TRANSACTION DETECTED: A volume of $${Math.floor(totalVal).toLocaleString()} on ${sym} was ${sideWord} (Price: $${tradePrice.toLocaleString()}).`;
            addWhaleAlertRef.current?.("WHALE", msg);
          }
        }

        // 4. Kline (Candlesticks) Stream
        else if (stream.includes("@kline_")) {
          const kline = data.k;
          const klineTimeStr = activeTimeframe === "1D" || activeTimeframe === "1W"
            ? new Date(kline.t).toLocaleDateString([], { month: 'short', day: '2-digit' })
            : new Date(kline.t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: activeTimeframe === "1s" ? '2-digit' : undefined });

          const newCandle: Candle = {
            time: klineTimeStr,
            open: parseFloat(kline.o),
            high: parseFloat(kline.h),
            low: parseFloat(kline.l),
            close: parseFloat(kline.c),
            volume: parseFloat(kline.v) / 1000
          };

          setCandles(prev => {
            if (prev.length === 0) return [newCandle];
            const next = [...prev];
            const last = next[next.length - 1];

            // If time window matches last candle, overwrite it; else add new rolling node
            if (last.time === klineTimeStr) {
              next[next.length - 1] = newCandle;
            } else {
              next.push(newCandle);
              if (next.length > 150) next.shift();
            }
            return next;
          });
        }
      } catch (err) {
        console.error("[VANTAGE WS] Error parsing ws data:", err);
      }
    };

    ws.onclose = () => {
      console.log("[VANTAGE WS] WebSocket connection closed cleanly.");
    };

    ws.onerror = (err) => {
      console.error("[VANTAGE WS] WebSocket connection error:", err);
    };

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [symbolParam, activeTimeframe]);

  // Track the timestamp of the last message received from the live WebSocket feed
  const lastWsMsgTimeRef = useRef<number>(Date.now());

  // Generate highly realistic mock order book and mock trades when currentPrice or fallback changes
  useEffect(() => {
    if (!currentPrice) return;
    
    // Only generate if we don't have active live WS updates yet
    setOrderBook(prev => {
      if (prev.asks.length > 0 && prev.bids.length > 0 && prev.asks.length >= 20) return prev;
      
      const asks = [];
      const bids = [];
      
      for (let i = 0; i < 24; i++) {
        const askPrice = currentPrice * (1 + (i + 1) * 0.00012 + Math.random() * 0.00012);
        const askAmount = Math.random() * 1.8 + 0.1;
        asks.push({ price: askPrice, amount: askAmount, cumulative: 0 });
      }
      asks.reverse(); // Order asks descending
      
      for (let i = 0; i < 24; i++) {
        const bidPrice = currentPrice * (1 - (i + 1) * 0.00012 - Math.random() * 0.00012);
        const bidAmount = Math.random() * 1.8 + 0.1;
        bids.push({ price: bidPrice, amount: bidAmount, cumulative: 0 });
      }
      
      // Calculate cumulative asks
      let sumAsk = 0;
      for (let i = asks.length - 1; i >= 0; i--) {
        sumAsk += asks[i].amount;
        asks[i].cumulative = sumAsk;
      }
      
      // Calculate cumulative bids
      let sumBid = 0;
      for (let i = 0; i < bids.length; i++) {
        sumBid += bids[i].amount;
        bids[i].cumulative = sumBid;
      }
      
      return { asks, bids };
    });

    setTrades(prev => {
      if (prev.length > 0) return prev;
      const mockTrades: TradeLog[] = [];
      const now = Date.now();
      for (let i = 0; i < 15; i++) {
        const timeStr = new Date(now - i * 3000).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const side: "buy" | "sell" = Math.random() > 0.5 ? "buy" : "sell";
        const price = currentPrice * (1 + (Math.random() - 0.5) * 0.0008);
        const amount = Math.random() * 1.2 + 0.05;
        mockTrades.push({ time: timeStr, price, amount, side });
      }
      return mockTrades;
    });
  }, [currentPrice]);

  // Fallback simulator loop in case WebSocket is blocked, restricted, or slow
  useEffect(() => {
    const currentWs = wsRef.current;
    
    // Intercept WebSocket messages to update our active message timestamp tracker
    if (currentWs) {
      const originalHandler = currentWs.onmessage;
      currentWs.onmessage = (e) => {
        lastWsMsgTimeRef.current = Date.now();
        if (originalHandler) originalHandler.call(currentWs, e);
      };
    }
    
    const interval = setInterval(() => {
      const timeSinceLastMessage = Date.now() - lastWsMsgTimeRef.current;
      
      // If we haven't received a live message in 2.5 seconds, trigger the fallback simulator loop!
      if (timeSinceLastMessage > 2500 && currentPrice) {
        const changePercent = (Math.random() - 0.495) * 0.0005; // slight upward drift for exciting charts
        const nextPrice = currentPrice * (1 + changePercent);
        
        setTickerStats(prev => {
          const high = Math.max(prev.high_24h, nextPrice);
          const low = Math.min(prev.low_24h, nextPrice);
          return {
            ...prev,
            current_price: nextPrice,
            high_24h: high,
            low_24h: low,
            total_volume: prev.total_volume + Math.random() * 600,
            volume_asset: prev.volume_asset + Math.random() * 0.15
          };
        });
        
        // Trigger delicate tick noise and flashing visual feedback
        const now = Date.now();
        if (now - lastSoundTickRef.current > 250) {
          playTradeSound("tick");
          lastSoundTickRef.current = now;
        }
        setPriceFlash(changePercent >= 0 ? "up" : "down");
        setTimeout(() => setPriceFlash(null), 150);
        
        // Dynamically shift order book bid/ask queues based on Simulated tick
        setOrderBook(prev => {
          if (prev.asks.length === 0 || prev.bids.length === 0) return prev;
          const nextAsks = prev.asks.map(a => ({
            ...a,
            price: a.price * (1 + changePercent),
            amount: Math.max(0.01, a.amount + (Math.random() - 0.5) * 0.18)
          }));
          const nextBids = prev.bids.map(b => ({
            ...b,
            price: b.price * (1 + changePercent),
            amount: Math.max(0.01, b.amount + (Math.random() - 0.5) * 0.18)
          }));
          
          let accumAsk = 0;
          for (let i = nextAsks.length - 1; i >= 0; i--) {
            accumAsk += nextAsks[i].amount;
            nextAsks[i].cumulative = accumAsk;
          }
          let accumBid = 0;
          for (let i = 0; i < nextBids.length; i++) {
            accumBid += nextBids[i].amount;
            nextBids[i].cumulative = accumBid;
          }
          return { asks: nextAsks, bids: nextBids };
        });
        
        // Prepend simulated matched trade tick
        const side: "buy" | "sell" = Math.random() > 0.48 ? "buy" : "sell";
        const randomAmount = Math.random() > 0.95 ? (Math.random() * 5 + 2) : (Math.random() * 0.8 + 0.01);
        const totalVal = nextPrice * randomAmount;

        const newTrade: TradeLog = {
          time: new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          price: nextPrice * (1 + (Math.random() - 0.5) * 0.0003),
          amount: randomAmount,
          side
        };
        setTrades(prev => [newTrade, ...prev].slice(0, 20));

        if (totalVal >= 75000) {
          const sym = symbolNormalized.split("_")[0];
          const sideWord = side === "buy" ? "BOUGHT" : "SOLD";
          const sideColor = side === "buy" ? "🟢" : "🔴";
          const msg = `🐳 ${sideColor} WHALE TRANSACTION DETECTED: A volume of $${Math.floor(totalVal).toLocaleString()} on ${sym} was ${sideWord} (Price: $${newTrade.price.toLocaleString()}).`;
          addWhaleAlertRef.current?.("WHALE", msg);
        }
        
        // Dynamically age the latest candlestick
        setCandles(prev => {
          if (prev.length === 0) return prev;
          const next = [...prev];
          const last = { ...next[next.length - 1] };
          
          last.close = nextPrice;
          last.high = Math.max(last.high, nextPrice);
          last.low = Math.min(last.low, nextPrice);
          last.volume = last.volume + Math.random() * 0.15;
          
          next[next.length - 1] = last;
          return next;
        });
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [currentPrice]);


  // Handle timeframe swaps
  const handleTimeframeChange = (tf: "Time" | "1s" | "15m" | "1H" | "4H" | "1D" | "1W") => {
    const previousTimeframe = activeTimeframe;
    playTradeSound("click");
    setActiveTimeframe(tf);
    setCandles([]); // clear to trigger reload
    if (typeof pendo !== "undefined") {
      pendo.track("chart_timeframe_changed", {
        timeframe: tf,
        assetId,
        previousTimeframe
      });
    }
  };

  // --- ARITHMETIC SYNC ON ORDER ENTRY ---
  const handleAmountChange = (val: string) => {
    setAmount(val);
    const p = orderType === "limit" ? Number(limitPrice) : currentPrice;
    if (val && p) {
      setTotal((Number(val) * p).toFixed(2));
    } else {
      setTotal("");
    }
  };

  const handleTotalChange = (val: string) => {
    setTotal(val);
    const p = orderType === "limit" ? Number(limitPrice) : currentPrice;
    if (val && p) {
      setAmount((Number(val) / p).toFixed(6));
    } else {
      setAmount("");
    }
  };

  const handleLimitPriceChange = (val: string) => {
    setLimitPrice(val);
    if (amount && val) {
      setTotal((Number(amount) * Number(val)).toFixed(2));
    }
  };

  const handleQuickPercent = (pct: number) => {
    playTradeSound("click");
    if (!currentPrice) return;
    const p = orderType === "limit" ? Number(limitPrice) : currentPrice;
    if (!p || p <= 0) return;

    if (tradeSide === "buy") {
      const allocableCash = balance * pct;
      setTotal(allocableCash.toFixed(2));
      setAmount((allocableCash / p).toFixed(6));
    } else {
      const holding = portfolio.find(a => a.id === assetId);
      if (holding) {
        const allocableAsset = holding.amount * pct;
        setAmount(allocableAsset.toFixed(6));
        setTotal((allocableAsset * p).toFixed(2));
      } else {
        setAmount("0.00");
        setTotal("0.00");
      }
    }
  };

  // --- ORDER EXECUTION DISPATCH ---
  const handlePlaceOrder = () => {
    if (!amount || Number(amount) <= 0) return;
    const p = orderType === "limit" ? Number(limitPrice) : currentPrice;
    if (!p || p <= 0) return;

    const transactionCost = Number(amount) * p;
    
    // Map properties for portfolio invest action
    const mockAsset: CryptoPrice = {
      id: assetId,
      symbol: assetId.toUpperCase(),
      name: assetMeta.name,
      current_price: currentPrice,
      price_change_percentage_24h: tickerStats.price_change_percentage_24h
    };

    if (tradeSide === "buy") {
      if (balance < transactionCost) {
        setOrderNotification({ message: "ORDER FAILED: INSUFFICIENT LIQUID BALANCE", success: false });
        setTimeout(() => setOrderNotification(null), 3000);
        return;
      }
      invest(mockAsset, Number(amount), p);
      playTradeSound("success");
      if (typeof pendo !== "undefined") {
        pendo.track("crypto_trade_executed", {
          tradeSide: "buy",
          assetId,
          assetSymbol: assetId.toUpperCase(),
          amount: Number(amount),
          executionPrice: p,
          totalCost: transactionCost,
          orderType
        });
      }
      setOrderNotification({ message: `ORDER EXECUTED: BOUGHT ${Number(amount).toFixed(4)} ${assetId.toUpperCase()} AT $${p.toFixed(2)}`, success: true });
      setAmount("");
      setTotal("");
    } else {
      const holding = portfolio.find(a => a.id === assetId);
      if (!holding || holding.amount < Number(amount)) {
        setOrderNotification({ message: "ORDER FAILED: INSUFFICIENT PORTFOLIO HOLDINGS", success: false });
        setTimeout(() => setOrderNotification(null), 3000);
        return;
      }
      sell(assetId, Number(amount), p);
      playTradeSound("success");
      if (typeof pendo !== "undefined") {
        pendo.track("crypto_trade_executed", {
          tradeSide: "sell",
          assetId,
          assetSymbol: assetId.toUpperCase(),
          amount: Number(amount),
          executionPrice: p,
          totalCost: transactionCost,
          orderType
        });
      }
      setOrderNotification({ message: `ORDER EXECUTED: SOLD ${Number(amount).toFixed(4)} ${assetId.toUpperCase()} AT $${p.toFixed(2)}`, success: true });
      setAmount("");
      setTotal("");
    }

    setTimeout(() => setOrderNotification(null), 4000);
  };

  // Instant liquidation trigger
  const handleLiquidateAll = () => {
    const holding = portfolio.find(a => a.id === assetId);
    if (!holding || holding.amount <= 0) return;
    playTradeSound("click");
    sell(assetId, holding.amount, currentPrice);
    playTradeSound("success");
    if (typeof pendo !== "undefined") {
      pendo.track("position_liquidated", {
        assetId,
        totalAmount: holding.amount,
        executionPrice: currentPrice,
        totalProceeds: holding.amount * currentPrice
      });
    }
    setOrderNotification({ message: `FAST AUDIT: TOTAL LIQUIDATION OF ${assetId.toUpperCase()} AT MARKET PRICE`, success: true });
    setTimeout(() => setOrderNotification(null), 3000);
  };

  const position = useMemo(() => {
    return portfolio.find(a => a.id === assetId) || null;
  }, [portfolio, assetId]);

  const pnl = useMemo(() => {
    if (!position || !currentPrice) return { value: 0, pct: 0, isPositive: true };
    const cost = position.amount * position.avgPrice;
    const value = position.amount * currentPrice;
    const diff = value - cost;
    const pct = cost > 0 ? (diff / cost) * 100 : 0;
    return {
      value: diff,
      pct,
      isPositive: diff >= 0
    };
  }, [position, currentPrice]);

  // --- SVG CANDLESTICK GRAPHIC PARAMETERS ---
  const width = 800;
  const height = 380;
  const chartPadding = { top: 20, bottom: 30, left: 15, right: 75 };

  // Sliced subset for current zoomed viewing window
  const visibleCandles = useMemo(() => {
    if (candles.length === 0) return [];
    return candles.slice(-visibleCandlesCount);
  }, [candles, visibleCandlesCount]);

  // Recalculated scaling parameters strictly bound to visible kline slice (dynamic auto-scaling)
  const chartScale = useMemo(() => {
    if (visibleCandles.length === 0) return { minPrice: 0, maxPrice: 100, maxVolume: 100 };
    const pricesList = visibleCandles.flatMap(c => [c.high, c.low]);
    const maxP = Math.max(...pricesList);
    const minP = Math.min(...pricesList);
    const diff = maxP - minP;
    const minPrice = Math.max(0, minP - (diff * 0.1 || minP * 0.05));
    const maxPrice = maxP + (diff * 0.1 || maxP * 0.05);

    const maxVolume = Math.max(...visibleCandles.map(c => c.volume));
    return { minPrice, maxPrice, maxVolume };
  }, [visibleCandles]);

  const { minPrice, maxPrice, maxVolume } = chartScale;

  const getX = (index: number) => {
    const count = visibleCandles.length;
    const usableW = width - chartPadding.left - chartPadding.right;
    return chartPadding.left + (index / Math.max(1, count - 1)) * usableW;
  };

  const getY = (price: number) => {
    const usableH = height - chartPadding.top - chartPadding.bottom;
    const ratio = (price - minPrice) / (maxPrice - minPrice);
    return height - chartPadding.bottom - ratio * usableH;
  };

  // Maps drawing point reference invariant to zoom operations (scale-independent relative offsets)
  const getXForTime = (time: string) => {
    const idx = visibleCandles.findIndex(c => c.time === time);
    if (idx === -1) {
      const fullIdx = candles.findIndex(c => c.time === time);
      if (fullIdx === -1) return null;
      const visibleStartIndex = candles.length - visibleCandles.length;
      const relativeIdx = fullIdx - visibleStartIndex;
      const count = visibleCandles.length;
      const usableW = width - chartPadding.left - chartPadding.right;
      return chartPadding.left + (relativeIdx / Math.max(1, count - 1)) * usableW;
    }
    return getX(idx);
  };

  // Click & Drag Annotation mouse operations
  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    if (activeDrawTool === "cursor" || !chartSvgRef.current || visibleCandles.length === 0 || hoverIndex === null) return;
    
    const rect = chartSvgRef.current.getBoundingClientRect();
    const scaleY = height / rect.height;
    const localY = (e.clientY - rect.top) * scaleY;
    
    const usableH = height - chartPadding.top - chartPadding.bottom;
    const ratio = (height - chartPadding.bottom - localY) / usableH;
    const price = minPrice + ratio * (maxPrice - minPrice);
    
    const time = visibleCandles[hoverIndex].time;
    const initialPoint = { time, price };
    
    const newDrawing: Drawing = {
      id: Math.random().toString(36).substring(7),
      type: activeDrawTool,
      points: [initialPoint, initialPoint],
      color: "#F0B90B"
    };

    if (activeDrawTool === "text") {
      const txt = window.prompt("Enter text annotation:", "Annotation");
      if (txt) {
        newDrawing.text = txt;
        setDrawings(prev => [...prev, newDrawing]);
      }
    } else {
      setActiveDrawing(newDrawing);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!chartSvgRef.current || visibleCandles.length === 0) return;
    const rect = chartSvgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const scaleX = width / rect.width;
    const scaleY = height / rect.height;
    const localX = x * scaleX;
    const localY = y * scaleY;

    const usableW = width - chartPadding.left - chartPadding.right;
    const pct = (localX - chartPadding.left) / usableW;
    const count = visibleCandles.length;
    let idx = Math.round(pct * (count - 1));
    idx = Math.max(0, Math.min(count - 1, idx));

    setHoverIndex(idx);
    setHoverCoords({ x: getX(idx), y: localY });

    const usableH = height - chartPadding.top - chartPadding.bottom;
    const ratio = (height - chartPadding.bottom - localY) / usableH;
    const price = minPrice + ratio * (maxPrice - minPrice);

    if (activeDrawing && idx !== null && visibleCandles[idx]) {
      const time = visibleCandles[idx].time;
      const currentPoint = { time, price };

      if (activeDrawing.type === "brush") {
        const lastPoint = activeDrawing.points[activeDrawing.points.length - 1];
        if (lastPoint.time !== time || Math.abs(lastPoint.price - price) > (maxPrice - minPrice) * 0.005) {
          setActiveDrawing({
            ...activeDrawing,
            points: [...activeDrawing.points, currentPoint]
          });
        }
      } else {
        setActiveDrawing({
          ...activeDrawing,
          points: [activeDrawing.points[0], currentPoint]
        });
      }
    }
  };

  const handleMouseUp = () => {
    if (activeDrawing) {
      setDrawings(prev => [...prev, activeDrawing]);
      if (typeof pendo !== "undefined") {
        pendo.track("chart_drawing_created", {
          drawingType: activeDrawing.type,
          assetId
        });
      }
      setActiveDrawing(null);
    }
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
    setHoverCoords(null);
    if (activeDrawing) {
      setActiveDrawing(null);
    }
  };

  const handleClearDrawings = () => {
    playTradeSound("click");
    setDrawings([]);
    setActiveDrawing(null);
  };

  const handleZoom = (dir: "in" | "out" | "reset") => {
    playTradeSound("click");
    if (dir === "in") {
      setVisibleCandlesCount(prev => Math.max(15, prev - 5));
    } else if (dir === "out") {
      setVisibleCandlesCount(prev => Math.min(120, prev + 5));
    } else {
      setVisibleCandlesCount(50);
    }
  };

  const handleWheel = (e: React.WheelEvent<SVGSVGElement>) => {
    // Zoom in on wheel scroll up, Zoom out on wheel scroll down
    if (e.deltaY < 0) {
      setVisibleCandlesCount(prev => Math.max(15, prev - 5));
    } else {
      setVisibleCandlesCount(prev => Math.min(120, prev + 5));
    }
  };


  const renderDrawing = (drawing: Drawing, isActive = false) => {
    if (drawing.points.length < 2) return null;
    const p0 = drawing.points[0];
    const p1 = drawing.points[drawing.points.length - 1];
    
    const x0 = getXForTime(p0.time);
    const y0 = getY(p0.price);
    const x1 = getXForTime(p1.time);
    const y1 = getY(p1.price);
    
    if (x0 === null || y0 === null) return null;

    const color = drawing.color;
    const opacity = isActive ? 0.8 : 0.6;

    switch (drawing.type) {
      case "trendline": {
        if (x1 === null || y1 === null) return null;
        return (
          <line
            key={drawing.id}
            x1={x0}
            y1={y0}
            x2={x1}
            y2={y1}
            stroke={color}
            strokeWidth={2}
            strokeOpacity={opacity}
          />
        );
      }
      case "fibonacci": {
        if (x1 === null || y1 === null) return null;
        const levels = [
          { val: 0.0, label: "0.000" },
          { val: 0.236, label: "0.236" },
          { val: 0.382, label: "0.382" },
          { val: 0.5, label: "0.500" },
          { val: 0.618, label: "0.618" },
          { val: 0.786, label: "0.786" },
          { val: 1.0, label: "1.000" }
        ];
        const priceDiff = p1.price - p0.price;
        return (
          <g key={drawing.id}>
            <rect
              x={Math.min(x0, x1)}
              y={Math.min(y0, y1)}
              width={Math.abs(x1 - x0)}
              height={Math.abs(y1 - y0)}
              fill="none"
              stroke={color}
              strokeWidth={1}
              strokeDasharray="2,2"
              strokeOpacity={0.3}
            />
            {levels.map((lvl) => {
              const priceVal = p0.price + lvl.val * priceDiff;
              const yLvl = getY(priceVal);
              return (
                <g key={lvl.val}>
                  <line
                    x1={chartPadding.left}
                    y1={yLvl}
                    x2={width - chartPadding.right}
                    y2={yLvl}
                    stroke={color}
                    strokeWidth={1.2}
                    strokeOpacity={opacity}
                  />
                  <text
                    x={chartPadding.left + 5}
                    y={yLvl - 4}
                    fill={color}
                    fontSize={8}
                    fontWeight="bold"
                    fontFamily="monospace"
                    fillOpacity={opacity}
                  >
                    {lvl.label} (${priceVal.toFixed(2)})
                  </text>
                </g>
              );
            })}
          </g>
        );
      }
      case "brush": {
        const pointsStr = drawing.points
          .map((pt) => {
            const x = getXForTime(pt.time);
            const y = getY(pt.price);
            return x !== null && y !== null ? `${x},${y}` : "";
          })
          .filter(Boolean)
          .join(" L ");
        if (!pointsStr) return null;
        return (
          <path
            key={drawing.id}
            d={`M ${pointsStr}`}
            fill="none"
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeOpacity={opacity}
          />
        );
      }
      case "text": {
        return (
          <g key={drawing.id}>
            <circle cx={x0} cy={y0} r={4} fill={color} opacity={opacity} />
            <rect
              x={x0 + 8}
              y={y0 - 10}
              width={(drawing.text?.length || 4) * 6 + 10}
              height={16}
              fill="#1E2026"
              stroke={color}
              strokeWidth={1}
              rx={3}
              opacity={0.9}
            />
            <text
              x={x0 + 13}
              y={y0 + 2}
              fill="#FFFFFF"
              fontSize={9}
              fontWeight="bold"
              fontFamily="monospace"
            >
              {drawing.text || "Text"}
            </text>
          </g>
        );
      }
      case "ruler": {
        if (x1 === null || y1 === null) return null;
        const priceDelta = p1.price - p0.price;
        const pctDelta = (priceDelta / p0.price) * 100;
        const idx0 = candles.findIndex(c => c.time === p0.time);
        const idx1 = candles.findIndex(c => c.time === p1.time);
        const barCount = idx0 !== -1 && idx1 !== -1 ? Math.abs(idx1 - idx0) + 1 : 1;
        const rectX = Math.min(x0, x1);
        const rectY = Math.min(y0, y1);
        const rectW = Math.abs(x1 - x0);
        const rectH = Math.abs(y1 - y0);
        const isPositive = priceDelta >= 0;
        const boxColor = isPositive ? "#0ECB81" : "#F6465D";
        return (
          <g key={drawing.id}>
            <rect
              x={rectX}
              y={rectY}
              width={rectW}
              height={rectH}
              fill={boxColor}
              fillOpacity={0.15}
              stroke={boxColor}
              strokeWidth={1.5}
              strokeDasharray="4,4"
              strokeOpacity={opacity}
            />
            <rect
              x={rectX + rectW / 2 - 60}
              y={rectY + rectH / 2 - 18}
              width={120}
              height={36}
              fill="#1E2026"
              stroke={boxColor}
              strokeWidth={1}
              rx={4}
              opacity={0.9}
            />
            <text
              x={rectX + rectW / 2}
              y={rectY + rectH / 2 - 4}
              textAnchor="middle"
              fill={boxColor}
              fontSize={8}
              fontWeight="bold"
              fontFamily="monospace"
            >
              {isPositive ? "+" : ""}{pctDelta.toFixed(2)}%
            </text>
            <text
              x={rectX + rectW / 2}
              y={rectY + rectH / 2 + 8}
              textAnchor="middle"
              fill="#EAECEF"
              fontSize={7}
              fontWeight="semibold"
              fontFamily="monospace"
            >
              {priceDelta >= 0 ? "+" : ""}${priceDelta.toFixed(2)} | {barCount} bars
            </text>
          </g>
        );
      }
      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen bg-[#0B0E11] text-white selection:bg-[#F0B90B] selection:text-black overflow-x-hidden relative">
      <NeuralField />
      <Scanlines />
      
      {/* Top Navbar */}
      <Navbar />

      <div className="pt-14 pb-8 flex flex-col min-h-screen max-w-full font-mono text-xs">
        
        {/* Whale Alerts & Liquidations Ticker Banner */}
        {(() => {
          const scrollingAlerts = whaleAlerts.length === 0 ? [
            { id: "fallback-1", type: "WHALE" as const, message: "📡 Awaiting large whale transactions and spot leverage liquidations on Binance Spot...", timestamp: "--:--:--" },
            { id: "fallback-2", type: "WHALE" as const, message: "📡 Vantage neural grid ready for sovereign liquidity surveillance...", timestamp: "--:--:--" }
          ] : whaleAlerts;

          return (
            <div className="bg-[#1E2026] border-b border-[#2B2F36] h-8 flex items-center overflow-hidden relative select-none z-35">
              <div className="bg-[#F0B90B] text-black text-[9px] font-extrabold uppercase px-3 h-full flex items-center z-10 shadow-[2px_0_5px_rgba(0,0,0,0.4)] whitespace-nowrap tracking-wider shrink-0">
                🔥 Live Signals
              </div>
              <div className="flex-1 overflow-hidden relative flex items-center h-full bg-[#181A20]">
                <motion.div 
                  animate={{ x: ["0%", "-50%"] }}
                  transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
                  className="flex items-center gap-16 whitespace-nowrap pr-16"
                >
                  {[...scrollingAlerts, ...scrollingAlerts].map((alert, idx) => (
                    <span 
                      key={alert.id + "-" + idx} 
                      className={`text-[10px] font-bold tracking-wide flex items-center gap-1.5 ${
                        alert.type === "LIQUIDATION" ? "text-[#F6465D]" : "text-[#F0B90B]"
                      }`}
                    >
                      <span className="font-mono text-[#848E9C]">[{alert.timestamp}]</span>
                      <span>{alert.message}</span>
                    </span>
                  ))}
                </motion.div>
              </div>
            </div>
          );
        })()}
        
        {/* ============================================================ */}
        {/* ROW 1: BINANCE PRO STATS BAR */}
        {/* ============================================================ */}
        <header className="bg-[#1E2026] border-b border-[#2B2F36] px-6 py-3 flex flex-wrap items-center justify-between gap-4 select-none relative z-40">
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => { playTradeSound("click"); router.push('/dashboard'); }}
              className="p-1.5 border border-[#2B2F36] hover:border-white transition-all text-[#848E9C] hover:text-white"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
            <div className="flex items-center gap-2">
              {assetMeta.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={assetMeta.image} alt={assetId} className="w-5 h-5 rounded-full object-contain" />
              )}
              <h1 className="text-sm font-extrabold text-[#EAECEF] tracking-wider uppercase">
                {symbolNormalized.replace("_", " / ")}
              </h1>
            </div>
            <div className="hidden lg:block text-[#848E9C] text-[10px] uppercase font-bold tracking-widest border-l border-[#2B2F36] pl-4">
              {assetMeta.name} Spot
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-8">
            {/* Live Price Display */}
            <div>
              <div className="text-[10px] text-[#848E9C] mb-0.5">Current Market Price (Binance)</div>
              <div className={`text-base font-extrabold font-mono transition-all duration-150 ${
                priceFlash === "up" 
                  ? "text-[#0ECB81] scale-105" 
                  : priceFlash === "down" 
                    ? "text-[#F6465D] scale-105" 
                    : "text-[#EAECEF]"
              }`}>
                ${currentPrice ? currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 }) : "---"}
              </div>
            </div>

            {/* 24h Change */}
            <div>
              <div className="text-[10px] text-[#848E9C] mb-0.5">24h Change</div>
              <div className={`font-bold font-mono flex items-center gap-0.5 ${
                tickerStats.price_change_percentage_24h >= 0 ? "text-[#0ECB81]" : "text-[#F6465D]"
              }`}>
                {tickerStats.price_change_percentage_24h >= 0 ? "+" : ""}
                {tickerStats.price_change_percentage_24h?.toFixed(2)}%
              </div>
            </div>

            {/* 24h High */}
            <div className="hidden sm:block">
              <div className="text-[10px] text-[#848E9C] mb-0.5">24h High</div>
              <div className="font-semibold text-[#EAECEF] font-mono">
                ${tickerStats.high_24h ? tickerStats.high_24h.toLocaleString(undefined, { maximumFractionDigits: 2 }) : "---"}
              </div>
            </div>

            {/* 24h Low */}
            <div className="hidden sm:block">
              <div className="text-[10px] text-[#848E9C] mb-0.5">24h Low</div>
              <div className="font-semibold text-[#EAECEF] font-mono">
                ${tickerStats.low_24h ? tickerStats.low_24h.toLocaleString(undefined, { maximumFractionDigits: 2 }) : "---"}
              </div>
            </div>

            {/* Volume in Asset */}
            <div className="hidden md:block">
              <div className="text-[10px] text-[#848E9C] mb-0.5 font-bold uppercase">24h Volume ({assetId.toUpperCase()})</div>
              <div className="font-semibold text-[#EAECEF] font-mono">
                {tickerStats.volume_asset ? tickerStats.volume_asset.toLocaleString(undefined, { maximumFractionDigits: 0 }) : "---"}
              </div>
            </div>

            {/* Volume in USDT */}
            <div className="hidden md:block">
              <div className="text-[10px] text-[#848E9C] mb-0.5 font-bold uppercase">24h Volume (USDT)</div>
              <div className="font-semibold text-[#EAECEF] font-mono">
                ${tickerStats.total_volume ? tickerStats.total_volume.toLocaleString(undefined, { maximumFractionDigits: 0 }) : "---"}
              </div>
            </div>
          </div>

        </header>

        {/* ============================================================ */}
        {/* ROW 2: MAIN WORKSTATION GRID */}
        {/* ============================================================ */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-[320px_1fr_330px] border-b border-[#2B2F36] min-h-0 bg-[#0B0E11]">

          {/* -------------------------------------------------------- */}
          {/* PANEL 1: LIVE ORDER BOOK FROM BINANCE (LEFT)             */}
          {/* -------------------------------------------------------- */}
          <aside className="border-r border-[#2B2F36] flex flex-col bg-[#1E2026]/20 select-none">
            <div className="px-4 py-3 border-b border-[#2B2F36] flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[#848E9C] font-extrabold text-[10px]">
                <BookOpen className="w-3.5 h-3.5 text-[#F0B90B]" />
                <span className="uppercase tracking-wider">Order Book</span>
              </div>
              
              {/* Layout Mode controls & Decimal Dropdown in a single horizontal row */}
              <div className="flex items-center gap-2">
                <div className="flex bg-[#2B2F36]/50 p-0.5 rounded gap-0.5">
                  <button 
                    onClick={() => { playTradeSound("click"); setOrderBookMode("both"); }} 
                    title="Both Asks and Bids"
                    className={`p-1 rounded transition-all ${orderBookMode === "both" ? "bg-[#363C45] text-[#F0B90B]" : "text-[#848E9C] hover:text-white"}`}
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
                      <rect x="2" y="2" width="12" height="2" fill="#F6465D" />
                      <rect x="2" y="5" width="12" height="2" fill="#F6465D" />
                      <rect x="2" y="9" width="12" height="2" fill="#0ECB81" />
                      <rect x="2" y="12" width="12" height="2" fill="#0ECB81" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => { playTradeSound("click"); setOrderBookMode("asks"); }} 
                    title="Asks Only"
                    className={`p-1 rounded transition-all ${orderBookMode === "asks" ? "bg-[#363C45] text-[#F6465D]" : "text-[#848E9C] hover:text-white"}`}
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
                      <rect x="2" y="2" width="12" height="2" fill="#F6465D" />
                      <rect x="2" y="5" width="12" height="2" fill="#F6465D" />
                      <rect x="2" y="8" width="12" height="2" fill="#F6465D" />
                      <rect x="2" y="11" width="12" height="2" fill="#848E9C" opacity="0.2" />
                      <rect x="2" y="14" width="12" height="2" fill="#848E9C" opacity="0.2" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => { playTradeSound("click"); setOrderBookMode("bids"); }} 
                    title="Bids Only"
                    className={`p-1 rounded transition-all ${orderBookMode === "bids" ? "bg-[#363C45] text-[#0ECB81]" : "text-[#848E9C] hover:text-white"}`}
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
                      <rect x="2" y="2" width="12" height="2" fill="#848E9C" opacity="0.2" />
                      <rect x="2" y="5" width="12" height="2" fill="#848E9C" opacity="0.2" />
                      <rect x="2" y="8" width="12" height="2" fill="#0ECB81" />
                      <rect x="2" y="11" width="12" height="2" fill="#0ECB81" />
                      <rect x="2" y="14" width="12" height="2" fill="#0ECB81" />
                    </svg>
                  </button>
                </div>

                {/* Decimal precision Selector */}
                <select
                  value={decimalPrecision}
                  onChange={(e) => setDecimalPrecision(Number(e.target.value))}
                  className="bg-[#2B2F36] text-[#EAECEF] hover:bg-[#363C45] px-1.5 py-0.5 rounded text-[9px] font-bold font-mono focus:outline-none border-none cursor-pointer"
                >
                  <option value={defaultDecimals}>{(1 / Math.pow(10, defaultDecimals)).toFixed(defaultDecimals)}</option>
                  {defaultDecimals - 1 >= 0 && (
                    <option value={defaultDecimals - 1}>{(1 / Math.pow(10, defaultDecimals - 1)).toFixed(defaultDecimals - 1)}</option>
                  )}
                  {defaultDecimals - 2 >= 0 && (
                    <option value={defaultDecimals - 2}>{(1 / Math.pow(10, defaultDecimals - 2)).toFixed(defaultDecimals - 2)}</option>
                  )}
                  {defaultDecimals - 3 >= 0 && (
                    <option value={defaultDecimals - 3}>{(1 / Math.pow(10, defaultDecimals - 3)).toFixed(defaultDecimals - 3)}</option>
                  )}
                </select>
              </div>
            </div>

            {/* Header Columns */}
            <div className="px-4 py-2 grid grid-cols-3 text-[#848E9C] text-[9px] border-b border-[#2B2F36]/30 font-semibold uppercase tracking-wider">
              <span>Price(USDT)</span>
              <span className="text-right">Quantity({assetId.toUpperCase()})</span>
              <span className="text-right">Total</span>
            </div>

            {/* ASKS (RED) - Sell Offers */}
            {orderBookMode !== "bids" && (
              <div className="flex-1 flex flex-col justify-end overflow-hidden py-1">
                <div className="space-y-[1.5px]">
                  {slicedAsks.length > 0 ? (
                    slicedAsks.map((ask, i) => {
                      const maxCumulative = orderBook.asks[0]?.cumulative || 1;
                      const pct = Math.min(100, (ask.cumulative / maxCumulative) * 100);
                      return (
                        <div 
                          key={i} 
                          onClick={() => { playTradeSound("click"); setLimitPrice(ask.price.toString()); }}
                          className="px-4 py-[3.5px] grid grid-cols-3 hover:bg-white/5 cursor-pointer relative text-[10px] font-mono leading-none transition-all duration-100"
                        >
                          <div className="absolute right-0 top-0 bottom-0 bg-[#F6465D]/[0.08] transition-all duration-300 pointer-events-none" style={{ width: `${pct}%` }} />
                          <span className="text-[#F6465D] font-bold relative z-10">{ask.price.toFixed(decimalPrecision)}</span>
                          <span className="text-[#EAECEF] text-right font-medium relative z-10">{ask.amount.toFixed(4)}</span>
                          <span className="text-[#848E9C] text-right relative z-10">{(ask.price * ask.amount).toFixed(1)}</span>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8 text-[#848E9C]/60 text-[9px] uppercase tracking-wider animate-pulse">Awaiting depth data...</div>
                  )}
                </div>
              </div>
            )}

            {/* SPREAD INDICATOR */}
            <div className="bg-[#1E2026]/80 py-2.5 px-4 border-y border-[#2B2F36] flex flex-col justify-center select-none">
              <div className="flex items-center justify-between">
                <span className={`text-sm font-black font-mono flex items-center gap-0.5 leading-none transition-all duration-150 ${
                  tickerStats.price_change_percentage_24h >= 0 ? "text-[#0ECB81]" : "text-[#F6465D]"
                }`}>
                  {currentPrice ? currentPrice.toLocaleString(undefined, { minimumFractionDigits: decimalPrecision, maximumFractionDigits: decimalPrecision }) : "---"}
                  {tickerStats.price_change_percentage_24h >= 0 ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </span>
                <span className="text-[10px] text-[#EAECEF] font-bold leading-none font-mono">
                  {tickerStats.price_change_percentage_24h >= 0 ? "+" : ""}{tickerStats.price_change_percentage_24h?.toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between text-[8px] text-[#848E9C] mt-1 font-bold tracking-wider font-mono">
                <span>SPREAD: ${(currentPrice * 0.00015).toFixed(decimalPrecision)}</span>
                <span className="text-[#F0B90B]">100% LIVE</span>
              </div>
            </div>

            {/* BIDS (GREEN) - Buy Offers */}
            {orderBookMode !== "asks" && (
              <div className="flex-1 flex flex-col justify-start overflow-hidden py-1">
                <div className="space-y-[1.5px]">
                  {slicedBids.length > 0 ? (
                    slicedBids.map((bid, i) => {
                      const maxCumulative = orderBook.bids[orderBook.bids.length - 1]?.cumulative || 1;
                      const pct = Math.min(100, (bid.cumulative / maxCumulative) * 100);
                      return (
                        <div 
                          key={i} 
                          onClick={() => { playTradeSound("click"); setLimitPrice(bid.price.toString()); }}
                          className="px-4 py-[3.5px] grid grid-cols-3 hover:bg-white/5 cursor-pointer relative text-[10px] font-mono leading-none transition-all duration-100"
                        >
                          <div className="absolute right-0 top-0 bottom-0 bg-[#0ECB81]/[0.08] transition-all duration-300 pointer-events-none" style={{ width: `${pct}%` }} />
                          <span className="text-[#0ECB81] font-bold relative z-10">{bid.price.toFixed(decimalPrecision)}</span>
                          <span className="text-[#EAECEF] text-right font-medium relative z-10">{bid.amount.toFixed(4)}</span>
                          <span className="text-[#848E9C] text-right relative z-10">{(bid.price * bid.amount).toFixed(1)}</span>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8 text-[#848E9C]/60 text-[9px] uppercase tracking-wider animate-pulse">Awaiting depth data...</div>
                  )}
                </div>
              </div>
            )}
          </aside>

          {/* -------------------------------------------------------- */}
          {/* PANEL 2: REAL BINANCE CHART GRAPHICS MATRIX (MIDDLE)     */}
          {/* -------------------------------------------------------- */}
          <section className="flex flex-col min-h-0 bg-[#0B0E11]/45">
            
            {/* Chart Toolbar */}
            <div className="border-b border-[#2B2F36] bg-[#1E2026]/40 px-6 py-2 flex items-center justify-between select-none">
              <div className="flex items-center gap-1 sm:gap-2">
                {["Time", "1s", "15m", "1H", "4H", "1D", "1W"].map((tf) => (
                  <button
                    key={tf}
                    onClick={() => handleTimeframeChange(tf as any)}
                    className={`px-2 py-0.5 sm:px-3 sm:py-1 rounded text-[11px] font-bold transition-all ${
                      activeTimeframe === tf 
                        ? "text-[#F0B90B] bg-[#2B2F36]/60" 
                        : "text-[#848E9C] hover:text-[#EAECEF] hover:bg-[#2B2F36]/30"
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>

              {/* Dynamic Telemetry Status */}
              <div className="flex items-center gap-4 text-[#848E9C] text-[9px] font-bold uppercase">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#0ECB81] animate-pulse" />
                  <span className="text-white/60">Binance WS Connected</span>
                </div>
                <div className="hidden sm:block text-[#F0B90B] border border-[#F0B90B]/30 px-2 py-0.5 rounded font-mono">
                  WEBSOCKET GATEWAY // ACTIVE LIVE FEED
                </div>
              </div>
            </div>

            {/* Chart Area Row with Left Toolbar */}
            <div className="flex-1 flex border-b border-[#2B2F36] min-h-[380px]">
              
              {/* Binance Spot Pro Left Sidebar for Drawing Tools */}
              <aside className="w-[45px] bg-[#1E2026] border-r border-[#2B2F36] flex flex-col items-center py-3 gap-3 select-none z-10">
                <button
                  onClick={() => { playTradeSound("click"); setActiveDrawTool("cursor"); }}
                  title="Cursor Select"
                  className={`p-2 rounded transition-all ${
                    activeDrawTool === "cursor" 
                      ? "text-[#F0B90B] bg-[#2B2F36]" 
                      : "text-[#848E9C] hover:text-[#EAECEF] hover:bg-[#2B2F36]/40"
                  }`}
                >
                  <MousePointer className="w-4 h-4" />
                </button>
                <button
                  onClick={() => { playTradeSound("click"); setActiveDrawTool("trendline"); }}
                  title="Trend Line"
                  className={`p-2 rounded transition-all ${
                    activeDrawTool === "trendline" 
                      ? "text-[#F0B90B] bg-[#2B2F36]" 
                      : "text-[#848E9C] hover:text-[#EAECEF] hover:bg-[#2B2F36]/40"
                  }`}
                >
                  <TrendingUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => { playTradeSound("click"); setActiveDrawTool("fibonacci"); }}
                  title="Fibonacci Retracement"
                  className={`p-2 rounded transition-all ${
                    activeDrawTool === "fibonacci" 
                      ? "text-[#F0B90B] bg-[#2B2F36]" 
                      : "text-[#848E9C] hover:text-[#EAECEF] hover:bg-[#2B2F36]/40"
                  }`}
                >
                  <Award className="w-4 h-4" />
                </button>
                <button
                  onClick={() => { playTradeSound("click"); setActiveDrawTool("brush"); }}
                  title="Brush Tool"
                  className={`p-2 rounded transition-all ${
                    activeDrawTool === "brush" 
                      ? "text-[#F0B90B] bg-[#2B2F36]" 
                      : "text-[#848E9C] hover:text-[#EAECEF] hover:bg-[#2B2F36]/40"
                  }`}
                >
                  <Brush className="w-4 h-4" />
                </button>
                <button
                  onClick={() => { playTradeSound("click"); setActiveDrawTool("text"); }}
                  title="Text Annotation"
                  className={`p-2 rounded transition-all ${
                    activeDrawTool === "text" 
                      ? "text-[#F0B90B] bg-[#2B2F36]" 
                      : "text-[#848E9C] hover:text-[#EAECEF] hover:bg-[#2B2F36]/40"
                  }`}
                >
                  <Type className="w-4 h-4" />
                </button>
                <button
                  onClick={() => { playTradeSound("click"); setActiveDrawTool("ruler"); }}
                  title="Ruler / Measure"
                  className={`p-2 rounded transition-all ${
                    activeDrawTool === "ruler" 
                      ? "text-[#F0B90B] bg-[#2B2F36]" 
                      : "text-[#848E9C] hover:text-[#EAECEF] hover:bg-[#2B2F36]/40"
                  }`}
                >
                  <Ruler className="w-4 h-4" />
                </button>
                
                <div className="w-6 border-t border-[#2B2F36] my-1" />

                <button
                  onClick={handleClearDrawings}
                  title="Clear Drawings"
                  className="p-2 rounded text-[#848E9C] hover:text-[#F6465D] hover:bg-[#F6465D]/10 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </aside>

              {/* Main Chart Workspace SVG Area */}
              <div className="flex-1 relative bg-[#1E2026]/5 overflow-hidden">
                
                {/* OHLC Interactive Cursor Tooltip */}
                <div className="absolute top-4 left-6 z-10 flex flex-wrap gap-4 text-[10px] font-mono select-none bg-[#1E2026]/85 p-2.5 border border-[#2B2F36] rounded backdrop-blur-md">
                  {hoverIndex !== null && visibleCandles[hoverIndex] ? (
                    <>
                      <span className="text-[#848E9C]">TIME: <span className="text-[#EAECEF] font-bold">{visibleCandles[hoverIndex].time}</span></span>
                      <span className="text-[#848E9C]">OPEN: <span className="text-[#EAECEF] font-bold">${visibleCandles[hoverIndex].open.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span></span>
                      <span className="text-[#848E9C]">HIGH: <span className="text-[#0ECB81] font-bold">${visibleCandles[hoverIndex].high.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span></span>
                      <span className="text-[#848E9C]">LOW: <span className="text-[#F6465D] font-bold">${visibleCandles[hoverIndex].low.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span></span>
                      <span className="text-[#848E9C]">CLOSE: <span className={`font-bold ${visibleCandles[hoverIndex].close >= visibleCandles[hoverIndex].open ? "text-[#0ECB81]" : "text-[#F6465D]"}`}>${visibleCandles[hoverIndex].close.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span></span>
                      <span className="text-[#848E9C]">VOLUME: <span className="text-[#F0B90B] font-bold">{visibleCandles[hoverIndex].volume.toFixed(2)}K</span></span>
                    </>
                  ) : (
                    <>
                      <span className="text-white/60 font-bold uppercase tracking-wider flex items-center gap-1.5"><BarChart2 className="w-3.5 h-3.5 text-[#F0B90B]" /> Chart Analysis for {assetId.toUpperCase()}</span>
                      <span className="text-[#848E9C]/60 italic font-medium font-mono">// Real-time feed from Binance Spot API</span>
                      {activeDrawTool !== "cursor" && (
                        <span className="text-[#F0B90B] font-bold animate-pulse">// DRAWING MODE: {activeDrawTool.toUpperCase()} // CLICK & DRAG TO DRAW</span>
                      )}
                    </>
                  )}
                </div>

                {/* Floating Zoom Controls Overlay */}
                <div className="absolute bottom-4 right-20 z-10 flex items-center gap-1.5 bg-[#1E2026]/85 border border-[#2B2F36] p-1.5 rounded-lg shadow-xl backdrop-blur-md select-none">
                  <button
                    onClick={() => handleZoom("in")}
                    title="Zoom In (Make Candles Bigger)"
                    className="p-1.5 rounded hover:bg-[#2B2F36] text-[#848E9C] hover:text-white transition-all"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleZoom("out")}
                    title="Zoom Out (Make Candles Smaller)"
                    className="p-1.5 rounded hover:bg-[#2B2F36] text-[#848E9C] hover:text-white transition-all"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <div className="w-px h-4 bg-[#2B2F36] mx-0.5" />
                  <button
                    onClick={() => handleZoom("reset")}
                    title="Reset Chart View"
                    className="p-1.5 rounded hover:bg-[#2B2F36] text-[#848E9C] hover:text-white transition-all"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>

                {/* Chart SVG */}
                {visibleCandles.length > 0 ? (
                  <svg
                    ref={chartSvgRef}
                    width="100%"
                    height="100%"
                    viewBox={`0 0 ${width} ${height}`}
                    preserveAspectRatio="none"
                    className={`absolute inset-0 z-0 ${activeDrawTool === "cursor" ? "cursor-crosshair" : "cursor-cell"}`}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    onWheel={handleWheel}
                  >

                    {/* Grid Lines */}
                    {Array.from({ length: 5 }).map((_, i) => {
                      const priceVal = maxPrice - (i / 4) * (maxPrice - minPrice);
                      const y = getY(priceVal);
                      return (
                        <g key={i}>
                          <line
                            x1={chartPadding.left}
                            y1={y}
                            x2={width - chartPadding.right}
                            y2={y}
                            stroke="#2B2F36"
                            strokeDasharray="4,4"
                            strokeWidth={1}
                          />
                          <text
                            x={width - chartPadding.right + 8}
                            y={y + 4}
                            fill="#848E9C"
                            fontSize={9}
                            fontWeight="bold"
                            fontFamily="monospace"
                          >
                            ${priceVal.toLocaleString(undefined, { maximumFractionDigits: 1 })}
                          </text>
                        </g>
                      );
                    })}

                    {/* Horizontal Time Labels */}
                    {Array.from({ length: 4 }).map((_, i) => {
                      const idx = Math.floor((i / 3) * (visibleCandles.length - 1));
                      if (idx < 0 || idx >= visibleCandles.length) return null;
                      const x = getX(idx);
                      return (
                        <text
                          key={i}
                          x={x}
                          y={height - 8}
                          textAnchor="middle"
                          fill="#848E9C"
                          fontSize={8}
                          fontWeight="semibold"
                          fontFamily="monospace"
                        >
                          {visibleCandles[idx].time}
                        </text>
                      );
                    })}

                    {/* Volume Bars Area */}
                    {visibleCandles.map((c, i) => {
                      const x = getX(i);
                      const candleW = Math.max(2, (width - chartPadding.left - chartPadding.right) / visibleCandles.length - 3);
                      const volH = (c.volume / (maxVolume || 1)) * 55;
                      const volY = height - chartPadding.bottom - volH;
                      const color = c.close >= c.open ? "#0ECB81" : "#F6465D";
                      return (
                        <rect
                          key={`vol-${i}`}
                          x={x - candleW / 2}
                          y={volY}
                          width={candleW}
                          height={volH}
                          fill={color}
                          opacity={0.16}
                        />
                      );
                    })}

                    {/* Time (Line / Area Chart) View */}
                    {activeTimeframe === "Time" && (
                      <g>
                        <defs>
                          <linearGradient id="timeChartGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#F0B90B" stopOpacity="0.25" />
                            <stop offset="100%" stopColor="#F0B90B" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        <path
                          d={`M ${visibleCandles.map((c, i) => `${getX(i)},${getY(c.close)}`).join(" L ")}`}
                          fill="none"
                          stroke="#F0B90B"
                          strokeWidth={1.8}
                        />
                        <path
                          d={`M ${getX(0)},${height - chartPadding.bottom} L ${visibleCandles.map((c, i) => `${getX(i)},${getY(c.close)}`).join(" L ")} L ${getX(visibleCandles.length - 1)},${height - chartPadding.bottom} Z`}
                          fill="url(#timeChartGrad)"
                        />
                      </g>
                    )}

                    {/* Candlestick Bars */}
                    {activeTimeframe !== "Time" && visibleCandles.map((c, i) => {
                      const x = getX(i);
                      const yOpen = getY(c.open);
                      const yClose = getY(c.close);
                      const yHigh = getY(c.high);
                      const yLow = getY(c.low);
                      const candleW = Math.max(2, (width - chartPadding.left - chartPadding.right) / visibleCandles.length - 3);
                      const isGreen = c.close >= c.open;
                      const color = isGreen ? "#0ECB81" : "#F6465D";
                      return (
                        <g key={i}>
                          <line
                            x1={x}
                            y1={yHigh}
                            x2={x}
                            y2={yLow}
                            stroke={color}
                            strokeWidth={1.2}
                          />
                          <rect
                            x={x - candleW / 2}
                            y={Math.min(yOpen, yClose)}
                            width={candleW}
                            height={Math.max(1.5, Math.abs(yOpen - yClose))}
                            fill={color}
                            stroke={color}
                            strokeWidth={0.5}
                          />
                        </g>
                      );
                    })}

                    {/* Saved Drawings */}
                    {drawings.map((drawing) => renderDrawing(drawing))}

                    {/* Active Dragging Drawing */}
                    {activeDrawing && renderDrawing(activeDrawing, true)}

                    {/* Horizontal Line for current active price */}
                    {currentPrice && (
                      <g>
                        <line
                          x1={chartPadding.left}
                          y1={getY(currentPrice)}
                          x2={width - chartPadding.right}
                          y2={getY(currentPrice)}
                          stroke="#F0B90B"
                          strokeWidth={0.8}
                          strokeDasharray="2,2"
                          opacity={0.7}
                        />
                        <rect
                          x={width - chartPadding.right + 2}
                          y={getY(currentPrice) - 7}
                          width={65}
                          height={14}
                          fill="#F0B90B"
                          rx={2}
                        />
                        <text
                          x={width - chartPadding.right + 34}
                          y={getY(currentPrice) + 3}
                          fill="#000000"
                          fontSize={8}
                          fontWeight="black"
                          fontFamily="monospace"
                          textAnchor="middle"
                        >
                          ${currentPrice.toFixed(2)}
                        </text>
                      </g>
                    )}

                    {/* Interactive Crosshairs */}
                    {hoverCoords && hoverIndex !== null && visibleCandles[hoverIndex] && (
                      <g>
                        <line
                          x1={hoverCoords.x}
                          y1={chartPadding.top}
                          x2={hoverCoords.x}
                          y2={height - chartPadding.bottom}
                          stroke="#EAECEF"
                          strokeDasharray="2,2"
                          strokeWidth={0.8}
                          opacity={0.4}
                        />
                        <line
                          x1={chartPadding.left}
                          y1={hoverCoords.y}
                          x2={width - chartPadding.right}
                          y2={hoverCoords.y}
                          stroke="#EAECEF"
                          strokeDasharray="2,2"
                          strokeWidth={0.8}
                          opacity={0.4}
                        />
                        <circle
                          cx={hoverCoords.x}
                          cy={getY(visibleCandles[hoverIndex].close)}
                          r={4}
                          fill="#F0B90B"
                          stroke="#FFFFFF"
                          strokeWidth={1}
                        />
                      </g>
                    )}
                  </svg>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-[#848E9C] gap-3 font-bold select-none uppercase tracking-wider animate-pulse">
                    <RefreshCw className="w-6 h-6 animate-spin text-[#F0B90B]" />
                    Awaiting connection network...
                  </div>
                )}
              </div>
            </div>

            {/* -------------------------------------------------------- */}
            {/* PANEL 3: USER PORTFOLIO LEDGER WITH LIVE VALUES          */}
            {/* -------------------------------------------------------- */}
            <div className="p-6 bg-[#1E2026]/40 select-none">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[10px] font-black uppercase tracking-wider text-[#848E9C] flex items-center gap-1.5">
                  <Wallet className="w-3.5 h-3.5" /> Portfolio Position // PORTFOLIO POSITION
                </h3>
                {position && (
                  <button 
                    onClick={handleLiquidateAll}
                    className="px-3 py-1 rounded bg-[#F6465D]/10 border border-[#F6465D]/30 hover:bg-[#F6465D] hover:text-white text-[#F6465D] text-[9px] font-bold transition-all uppercase"
                  >
                    INSTANT LIQUIDATION
                  </button>
                )}
              </div>

              {position ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-4 border border-[#2B2F36] bg-[#0B0E11]/40 rounded-xl relative overflow-hidden">
                  
                  {/* Position volume */}
                  <div>
                    <div className="text-[9px] text-[#848E9C] uppercase mb-1">Asset Amount</div>
                    <div className="text-lg font-black text-[#EAECEF] font-mono leading-none">
                      {position.amount.toFixed(6)} <span className="text-[#848E9C] text-xs font-bold">{assetId.toUpperCase()}</span>
                    </div>
                    <div className="text-[8px] text-[#848E9C] font-medium font-mono mt-1">
                      Value: ${(position.amount * currentPrice).toLocaleString(undefined, { maximumFractionDigits: 2 })} USDT
                    </div>
                  </div>

                  {/* Avg buy price */}
                  <div>
                    <div className="text-[9px] text-[#848E9C] uppercase mb-1">Average Entry Price</div>
                    <div className="text-lg font-black text-[#EAECEF] font-mono leading-none">
                      ${position.avgPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div className="text-[8px] text-[#848E9C] font-medium font-mono mt-1">
                      Initial acquisition cost basis
                    </div>
                  </div>

                  {/* PnL dollar */}
                  <div>
                    <div className="text-[9px] text-[#848E9C] uppercase mb-1">Profit & Loss (PnL)</div>
                    <div className={`text-lg font-black font-mono leading-none ${pnl.isPositive ? "text-[#0ECB81]" : "text-[#F6465D]"}`}>
                      {pnl.isPositive ? "+" : ""}${pnl.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div className="text-[8px] text-[#848E9C] font-medium font-mono mt-1">
                      Calculated against real-time market value
                    </div>
                  </div>

                  {/* PnL percentage */}
                  <div>
                    <div className="text-[9px] text-[#848E9C] uppercase mb-1">Return on Investment (ROI)</div>
                    <div className={`text-lg font-black font-mono leading-none ${pnl.isPositive ? "text-[#0ECB81]" : "text-[#F6465D]"}`}>
                      {pnl.isPositive ? "+" : ""}{pnl.pct.toFixed(2)}%
                    </div>
                    <div className="text-[8px] text-[#848E9C] font-medium font-mono mt-1">
                      Relative to capital entry basis
                    </div>
                  </div>

                </div>
              ) : (
                <div className="border border-dashed border-[#2B2F36] py-8 text-center text-[#848E9C] rounded-xl font-mono text-[10px] leading-relaxed">
                  No open positions active. <br />
                  <span className="text-[#F0B90B] font-bold">// Allocate capital from the order entry desk to establish a position.</span>
                </div>
              )}
            </div>

          </section>

          {/* -------------------------------------------------------- */}
          {/* PANEL 4: DYNAMIC TRADING DESK & REAL-TIME WS TRADES      */}
          {/* -------------------------------------------------------- */}
          <aside className="border-l border-[#2B2F36] flex flex-col min-h-0 bg-[#1E2026]/20 relative">
            
            {/* Floating Order confirmation alert */}
            <AnimatePresence>
              {orderNotification && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`absolute top-14 left-4 right-4 z-50 p-3 border rounded text-[10px] font-black uppercase text-center tracking-wider shadow-2xl backdrop-blur-md ${
                    orderNotification.success 
                      ? "bg-[#0ECB81]/20 border-[#0ECB81] text-[#0ECB81]" 
                      : "bg-[#F6465D]/20 border-[#F6465D] text-[#F6465D]"
                  }`}
                >
                  {orderNotification.message}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Side Tabs */}
            <div className="grid grid-cols-2 border-b border-[#2B2F36] select-none text-[10px] uppercase font-bold text-center">
              <button
                onClick={() => { playTradeSound("click"); setTradeSide("buy"); }}
                className={`py-3.5 transition-all border-b-2 ${
                  tradeSide === "buy" 
                    ? "bg-[#0ECB81]/10 text-[#0ECB81] border-[#0ECB81]" 
                    : "text-[#848E9C] border-transparent hover:text-white"
                }`}
              >
                BUY
              </button>
              <button
                onClick={() => { playTradeSound("click"); setTradeSide("sell"); }}
                className={`py-3.5 transition-all border-b-2 ${
                  tradeSide === "sell" 
                    ? "bg-[#F6465D]/10 text-[#F6465D] border-[#F6465D]" 
                    : "text-[#848E9C] border-transparent hover:text-white"
                }`}
              >
                SELL
              </button>
            </div>

            {/* Exec Desk Container */}
            <div className="p-4 border-b border-[#2B2F36] space-y-4">
              
              {/* Limit vs Market selectors */}
              <div className="flex gap-1.5 select-none bg-[#2B2F36]/40 p-0.5 rounded">
                {["limit", "market"].map(type => (
                  <button
                    key={type}
                    onClick={() => { playTradeSound("click"); setOrderType(type as any); }}
                    className={`flex-1 py-1.5 rounded text-[9px] font-bold uppercase transition-all ${
                      orderType === type 
                        ? "bg-[#2B2F36] text-[#EAECEF]" 
                        : "text-[#848E9C] hover:text-white"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              {/* Wallet balances */}
              <div className="flex justify-between items-center text-[10px] font-semibold text-[#848E9C]">
                <span className="flex items-center gap-1"><Wallet className="w-3.5 h-3.5 text-[#F0B90B]" /> Available:</span>
                {tradeSide === "buy" ? (
                  <span className="text-[#EAECEF] font-bold font-mono">${balance.toLocaleString(undefined, { maximumFractionDigits: 2 })} USDT</span>
                ) : (
                  <span className="text-[#EAECEF] font-bold font-mono">
                    {position ? position.amount.toFixed(6) : "0.00"} {assetId.toUpperCase()}
                  </span>
                )}
              </div>

              {/* Limit input */}
              {orderType === "limit" ? (
                <div className="space-y-1">
                  <label className="text-[9px] text-[#848E9C] font-semibold uppercase">Limit Price (USDT)</label>
                  <div className="relative flex items-center bg-[#2B2F36] border border-[#474D57] rounded-lg focus-within:border-[#F0B90B]/60 transition-all px-3 py-2">
                    <input 
                      type="number"
                      value={limitPrice}
                      onChange={(e) => handleLimitPriceChange(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-transparent text-white font-mono font-extrabold focus:outline-none text-right"
                    />
                    <span className="text-[#848E9C] font-bold ml-2">USDT</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <label className="text-[9px] text-[#848E9C] font-semibold uppercase">Market Price</label>
                  <div className="relative flex items-center bg-[#2B2F36]/50 border border-[#2B2F36] rounded-lg px-3 py-2 text-[#848E9C]/60 select-none font-bold">
                    <span className="text-[9px] uppercase tracking-wider font-extrabold text-[#F0B90B]">EXECUTE INSTANT // MARKET</span>
                    <span className="ml-auto">${currentPrice ? currentPrice.toFixed(2) : "---"} USDT</span>
                  </div>
                </div>
              )}

              {/* Amount input */}
              <div className="space-y-1">
                <label className="text-[9px] text-[#848E9C] font-semibold uppercase">Order Quantity ({assetId.toUpperCase()})</label>
                <div className="relative flex items-center bg-[#2B2F36] border border-[#474D57] rounded-lg focus-within:border-[#F0B90B]/60 transition-all px-3 py-2">
                  <input 
                    type="number"
                    value={amount}
                    onChange={(e) => handleAmountChange(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-transparent text-white font-mono font-extrabold focus:outline-none text-right"
                  />
                  <span className="text-[#848E9C] font-bold ml-2">{assetId.toUpperCase()}</span>
                </div>
              </div>

              {/* Allocation quick percent buttons */}
              <div className="grid grid-cols-4 gap-1.5">
                {[0.25, 0.50, 0.75, 1.0].map((pct, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleQuickPercent(pct)}
                    className="bg-[#2B2F36] hover:bg-[#363C45] text-[#848E9C] hover:text-white border border-[#474D57]/30 text-[9px] font-extrabold rounded py-1 transition-all uppercase"
                  >
                    {pct * 100}%
                  </button>
                ))}
              </div>

              {/* Total USDT */}
              <div className="space-y-1">
                <label className="text-[9px] text-[#848E9C] font-semibold uppercase">Total Cost (USDT)</label>
                <div className="relative flex items-center bg-[#2B2F36] border border-[#474D57] rounded-lg focus-within:border-[#F0B90B]/60 transition-all px-3 py-2">
                  <input 
                    type="number"
                    value={total}
                    onChange={(e) => handleTotalChange(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-transparent text-white font-mono font-extrabold focus:outline-none text-right"
                  />
                  <span className="text-[#848E9C] font-bold ml-2">USDT</span>
                </div>
              </div>

              {/* Place Order button */}
              <button
                type="button"
                onClick={handlePlaceOrder}
                className={`w-full py-4 text-xs font-black uppercase tracking-[0.25em] text-black transition-all transform active:scale-98 rounded-lg shadow-xl cursor-pointer ${
                  tradeSide === "buy" 
                    ? "bg-[#0ECB81] hover:bg-[#12e090] text-black" 
                    : "bg-[#F6465D] hover:bg-[#ff5b73] text-white"
                }`}
              >
                {tradeSide === "buy" ? "PLACE BUY ORDER" : "PLACE SELL ORDER"}
              </button>

            </div>

            {/* -------------------------------------------------------- */}
            {/* PANEL 5: REAL-TIME matched trade ticks from binance      */}
            {/* -------------------------------------------------------- */}
            <div className="flex-1 flex flex-col min-h-0 select-none bg-[#1E2026]/10">
              
              <div className="px-4 py-3 border-b border-[#2B2F36] text-[10px] font-bold uppercase text-[#848E9C] tracking-wider flex items-center gap-1.5 select-none">
                <Activity className="w-3.5 h-3.5 text-[#F0B90B]" /> Recent Live Trades (Binance)
              </div>

              {/* Table Column headers */}
              <div className="px-4 py-2 grid grid-cols-3 text-[9px] font-semibold text-[#848E9C] border-b border-[#2B2F36]/20 uppercase">
                <span>Price(USDT)</span>
                <span className="text-right">Amount</span>
                <span className="text-right">Time</span>
              </div>

              {/* Scrolling levels */}
              <div className="flex-1 overflow-y-auto no-scrollbar py-1 space-y-1.5 max-h-[220px]">
                {trades.length > 0 ? (
                  trades.map((t, idx) => (
                    <div key={idx} className="px-4 grid grid-cols-3 text-[10px] font-mono leading-none hover:bg-white/5 py-0.5">
                      <span className={`font-bold ${t.side === "buy" ? "text-[#0ECB81]" : "text-[#F6465D]"}`}>
                        {t.price.toFixed(2)}
                      </span>
                      <span className="text-[#EAECEF] text-right font-medium">{t.amount.toFixed(4)}</span>
                      <span className="text-[#848E9C]/80 text-right">{t.time}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 text-[#848E9C]/60 text-[9px] uppercase tracking-wider animate-pulse">Awaiting live transaction feed...</div>
                )}
              </div>

            </div>

          </aside>

        </div>

      </div>

      <SynapseTutor />
    </main>
  );
}
