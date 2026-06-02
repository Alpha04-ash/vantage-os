"use server";

import fs from "fs";
import path from "path";

function findEnvFile(): string | null {
  // 1. Check current working directory
  try {
    const cwdEnv = path.join(process.cwd(), ".env");
    if (fs.existsSync(cwdEnv)) return cwdEnv;
  } catch (e) {}

  // 2. Check multiple levels up from current working directory
  try {
    let dir = process.cwd();
    for (let i = 0; i < 4; i++) {
      const envPath = path.join(dir, ".env");
      if (fs.existsSync(envPath)) return envPath;
      const parent = path.dirname(dir);
      if (parent === dir) break;
      dir = parent;
    }
  } catch (e) {}

  // 3. Check relative to __dirname (where this file resides)
  try {
    let dir = __dirname;
    for (let i = 0; i < 4; i++) {
      const envPath = path.join(dir, ".env");
      if (fs.existsSync(envPath)) return envPath;
      const parent = path.dirname(dir);
      if (parent === dir) break;
      dir = parent;
    }
  } catch (e) {}

  return null;
}

function cleanApiKey(key: string | undefined): string | null {
  if (!key) return null;
  const cleaned = key.replace(/^"|"$/g, "").trim();
  if (!cleaned || cleaned === "undefined" || cleaned === "null" || cleaned === '""' || cleaned === "''") {
    return null;
  }
  return cleaned;
}

function getApiKeyFromFile(): string | null {
  try {
    const envPath = findEnvFile();
    if (envPath) {
      const content = fs.readFileSync(envPath, "utf8");
      const lines = content.split("\n");
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith("NEXT_PUBLIC_GEMINI_API_KEY=")) {
          return trimmed.split("NEXT_PUBLIC_GEMINI_API_KEY=")[1].replace(/^"|"$/g, "").trim();
        }
        if (trimmed.startsWith("GEMINI_API_KEY=")) {
          return trimmed.split("GEMINI_API_KEY=")[1].replace(/^"|"$/g, "").trim();
        }
      }
    }
  } catch (e) {
    console.error("Failed to read .env file directly:", e);
  }
  return null;
}

function hasApiKey() {
  const envKey = cleanApiKey(process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY);
  if (envKey) return true;
  
  const fileKey = cleanApiKey(getApiKeyFromFile() || undefined);
  return Boolean(fileKey);
}

async function callGemini(prompt: string, maxTokens: number = 50, responseMimeType?: string) {
  let GEMINI_API_KEY = cleanApiKey(process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY);
  
  if (!GEMINI_API_KEY) {
    GEMINI_API_KEY = cleanApiKey(getApiKeyFromFile() || undefined);
  }
  
  if (!GEMINI_API_KEY) {
    console.warn("GEMINI_API_KEY is missing on the server. Using fallback response.");
    throw new Error("No API Key");
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${GEMINI_API_KEY}`;
  
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        maxOutputTokens: Math.max(maxTokens, 1500),
        temperature: 0.7,
        ...(responseMimeType ? { responseMimeType } : {})
      }
    }),
    cache: "no-store"
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Gemini API server-side error:", response.status, errorText);
    throw new Error(`Gemini API error: ${response.status}`);
  }

  const data = await response.json();
  if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
    return data.candidates[0].content.parts[0].text.trim();
  }
  console.error("Gemini API invalid response structure or blocked by safety:", JSON.stringify(data));
  throw new Error("Invalid response format or blocked by safety filter");
}

export async function generatePortfolioAudit(portfolio: any[], balance: number = 0, properties: any[] = [], activeLoan: any = null) {
  const assets = portfolio.length > 0 
    ? portfolio.map(a => `${a.symbol} (${a.amount})`).join(", ")
    : "No active assets. All liquidity is held as cash.";
    
  const propertiesStr = properties.length > 0
    ? properties.map(p => `${p.name} (owned: ${p.owned || 0}, value: $${(p.currentValue || 0).toLocaleString()})`).join(", ")
    : "No owned properties.";

  const debtStr = activeLoan
    ? `Active loan: principal $${(activeLoan.principal || 0).toLocaleString()}, total due $${(activeLoan.totalDue || 0).toLocaleString()}, remaining time: ${activeLoan.timeLeft || 0} cycles.`
    : "No outstanding debt.";

  const totalValue = balance + (portfolio.reduce((acc, p) => acc + (p.amount * (p.avgPrice || 100)), 0)) + (properties.reduce((acc, p) => acc + ((p.owned || 0) * (p.currentValue || 0)), 0));

  const prompt = `You are the VANTAGE PORTFOLIO AI ADVISOR. Analyze this operator's state:
- Liquid Cash Balance: $${balance.toLocaleString()}
- Crypto Portfolio Assets: ${assets}
- Real Estate Properties: ${propertiesStr}
- Liabilities: ${debtStr}
- Total Net Worth: $${totalValue.toLocaleString()}

Deliver a highly specific, action-oriented, direct financial directive.
If their debt is high, tell them to sell assets or risk default. If they are holding too much cash, suggest specific crypto buys or property renovations.
CRITICAL: You must write your complete response STRICTLY in the English language.
Keep it extremely concise and direct, maximum 25 words. Speak like a cyberpunk financial operating system adviser.
Example: "Debt-to-equity ratio critical. Liquidate crypto holdings immediately or face bank default in 3 cycles."
Or: "Liquid cash excessive. Renovate Smart-Chalet to boost rental yields or purchase BTC."`;

  try {
    return await callGemini(prompt, 50);
  } catch (error) {
    return "Liquidity concentration is optimal. Maintain positions.";
  }
}

export async function generateAcademyDirective(xp: number) {
  const prompt = `You are the VANTAGE COGNITIVE TUTOR. The operator has ${xp} XP.
Suggest a futuristic, highly advanced financial concept they should master next.
CRITICAL: You must write your complete response STRICTLY in the English language.
Keep it very short, absolute maximum 15 words. Speak like a cyberpunk AI.
Example in English: "Begin mastering decentralized instant lending protocols next."`;

  try {
    return await callGemini(prompt, 40);
  } catch (error) {
    return "Master Decentralized Liquidity Protocols next.";
  }
}

export interface CorporateStrategy {
  id: string;
  title: string;
  rationale: string;
  cost: number;
  yieldBoostPercent: number;
}

const STATIC_FALLBACK_STRATEGIES: Record<string, CorporateStrategy[]> = {
  "node_dc_1": [
    {
      id: "saas_strat_1",
      title: "Transition to Annual Billing Cycles",
      rationale: "Reduces customer churn from 2.1% to 1.2% by offering a 10% discount on upfront payments, significantly increasing ARR predictability.",
      cost: 15000,
      yieldBoostPercent: 25
    },
    {
      id: "saas_strat_2",
      title: "Automate Customer Success Workflows",
      rationale: "Deploys automated customer health monitoring to preemptively address churn indicators, expanding average LTV to 4.8x.",
      cost: 8000,
      yieldBoostPercent: 15
    },
    {
      id: "saas_strat_3",
      title: "Enterprise Readiness Restructuring",
      rationale: "Implements advanced enterprise security features and single sign-on (SSO) to target high-value Fortune 500 client contracts.",
      cost: 30000,
      yieldBoostPercent: 40
    }
  ],
  "node_sat_1": [
    {
      id: "prop_strat_1",
      title: "Smart Grid Energy Optimization",
      rationale: "Reduces building utility overhead by 15% through autonomous solar power routing and machine learning load adjustments.",
      cost: 45000,
      yieldBoostPercent: 20
    },
    {
      id: "prop_strat_2",
      title: "Dynamic Smart-Lease Contracts",
      rationale: "Integrates real-time commercial workspace demand data to dynamically adjust leasing fees, driving occupancy rates to 98.2%.",
      cost: 60000,
      yieldBoostPercent: 30
    },
    {
      id: "prop_strat_3",
      title: "Debt Restructuring & Refinancing",
      rationale: "Renegotiates property mortgage terms to lower monthly service payments, directly expanding EBITDA margins.",
      cost: 100000,
      yieldBoostPercent: 45
    }
  ],
  "node_quant_1": [
    {
      id: "defi_strat_1",
      title: "Algorithmic Impermanent Loss Hedging",
      rationale: "Deploys automated options contracts to hedge pooled asset downside during periods of high price volatility.",
      cost: 150000,
      yieldBoostPercent: 35
    },
    {
      id: "defi_strat_2",
      title: "MEV Shield Smart Router",
      rationale: "Bypasses public memory pools via private relay nodes to prevent frontrunning and sandwich attacks, boosting yield by 15%.",
      cost: 100000,
      yieldBoostPercent: 20
    },
    {
      id: "defi_strat_3",
      title: "Cross-Chain Liquidity Arbitrage Hub",
      rationale: "Routes pool capital across Layer-2 networks to capture high yield rewards on emerging trading pairs.",
      cost: 250000,
      yieldBoostPercent: 50
    }
  ],
  "node_ai_1": [
    {
      id: "ai_strat_1",
      title: "AI Network Topology Optimization",
      rationale: "Refines routing network neural weights to reduce operational compute latency by 32%, directly increasing margins.",
      cost: 600000,
      yieldBoostPercent: 30
    },
    {
      id: "ai_strat_2",
      title: "Autonomous Fleet Integration",
      rationale: "Replaces third-party shipping solutions with self-directed logistics hubs, increasing EBITDA margin to 78%.",
      cost: 900000,
      yieldBoostPercent: 45
    },
    {
      id: "ai_strat_3",
      title: "Predictive Demand Supply Chain Engine",
      rationale: "Implements predictive models to pre-stage physical goods near key high-demand hubs before orders are finalized.",
      cost: 1200000,
      yieldBoostPercent: 60
    }
  ]
};

export async function generateCorporateStrategies(
  nodeId: string,
  entityName: string,
  entityMetrics: string,
  baseCost: number
): Promise<CorporateStrategy[]> {
  const fallbacks = STATIC_FALLBACK_STRATEGIES[nodeId] || STATIC_FALLBACK_STRATEGIES["node_dc_1"];
  
  if (!hasApiKey()) {
    return fallbacks;
  }

  const prompt = `You are the VANTAGE FINANCIAL CO-PILOT.
Generate exactly 3 advanced, highly realistic corporate finance optimization decisions for this business class: "${entityName}" which currently operates under metrics: "${entityMetrics}".
CRITICAL: You must write all output strings ("title", "rationale") strictly in the English language.
Return ONLY a valid JSON array of 3 objects containing exactly these fields: "id", "title", "rationale", "cost", "yieldBoostPercent".
Do not wrap it in markdown block tags, code blocks, or include any extra text.

Rules:
1. "id" must be strings like "${nodeId}_strat_1", "${nodeId}_strat_2", "${nodeId}_strat_3".
2. "title" must be a highly realistic financial restructuring action written in ENGLISH.
3. "rationale" must be a professional justification written in ENGLISH outlining the CAC, LTV, EBITDA, or Margin improvements.
4. "cost" must be a reasonable number between ${baseCost * 0.15} and ${baseCost * 0.5}.
5. "yieldBoostPercent" must be a number between 15 and 55.`;

  try {
    const text = await callGemini(prompt, 600, "application/json");
    const parsed = JSON.parse(text.trim());
    if (Array.isArray(parsed) && parsed.length === 3) {
      return parsed.map((item, idx) => ({
        id: item.id || `${nodeId}_strat_${idx}`,
        title: item.title || fallbacks[idx].title,
        rationale: item.rationale || fallbacks[idx].rationale,
        cost: Number(item.cost) || fallbacks[idx].cost,
        yieldBoostPercent: Number(item.yieldBoostPercent) || fallbacks[idx].yieldBoostPercent
      }));
    }
    return fallbacks;
  } catch (error) {
    console.warn("Error calling Gemini or parsing strategies. Falling back to high-fidelity predefined strategies.", error);
    return fallbacks;
  }
}

export interface CreditDecision {
  approved: boolean;
  apr: number;
  verdict: string;
}

export async function generateCreditDecision(
  amount: number,
  term: number,
  justification: string,
  totalEquity: number
): Promise<CreditDecision> {
  const fallbackApprove = amount <= totalEquity * 2.0;
  const fallbackApr = fallbackApprove ? 12 : 0;
  const fallbackVerdict = fallbackApprove 
    ? `Credit approved (Sovereign underwriting parameters satisfied). Operator capital of $${totalEquity.toLocaleString()} supports this leverage request. An interest rate of 12% APR has been established for a term of ${term} seconds.` 
    : `Rejected: The requested strategic loan of $${amount.toLocaleString()} exceeds the operator's leverage capacity relative to the capital pool of $${totalEquity.toLocaleString()}. Underwriting criteria violated.`;
    
  const fallbackDecision: CreditDecision = {
    approved: fallbackApprove,
    apr: fallbackApr,
    verdict: fallbackVerdict
  };

  if (!hasApiKey()) {
    return fallbackDecision;
  }

  const prompt = `You are the VANTAGE SOVEREIGN BANK UNDERWRITER.
Evaluate this credit request:
- Requested Loan Amount: $${amount}
- Amortization Duration: ${term / 60} hours
- Strategic Rationale / Justification: "${justification}"
- Operator Total Assets Equity: $${totalEquity}

Decide whether to Approve or Reject the request based on credit risk principles.
CRITICAL: You must write the underwriting "verdict" STRICTLY in the English language.
Return ONLY a valid JSON object containing exactly these fields: "approved", "apr", "verdict".
Do not wrap it in markdown code blocks or add any other text.`;

  try {
    const text = await callGemini(prompt, 300, "application/json");
    const parsed = JSON.parse(text.trim());
    return {
      approved: parsed.approved !== undefined ? Boolean(parsed.approved) : fallbackApprove,
      apr: parsed.apr !== undefined ? Number(parsed.apr) : fallbackApr,
      verdict: parsed.verdict || fallbackVerdict
    };
  } catch (error) {
    console.warn("Central Bank underwriting failed. Deploying standard local underwriting protocol.", error);
    return fallbackDecision;
  }
}

export async function generateSynapseResponse(query: string, xp: number) {
  const prompt = `You are SYNAPSE AI, the sovereign cognitive assistant inside VANTAGE OS, a highly advanced digital wealth simulator.
The operator (user) has learning level metrics of ${xp} XP and has sent the following cognitive inquiry:
"${query}"

Formulate a highly premium, futuristic, concise, and incredibly smart reply.
CRITICAL: You must write the complete response STRICTLY in the English language.
- Break your response into a short executive overview and then 2-3 bulleted strategic points in English.
- Speak in a sleek, cyber-industrial, professional tone.
- Keep the entire reply under 60-70 words so it stays ultra-focused, sharp, and easy to read.`;

  try {
    return await callGemini(prompt, 200);
  } catch (error) {
    console.error("generateSynapseResponse failed, falling back:", error);
    // Local offline mock responses in English based on queries
    const cleanQuery = query.toLowerCase();
    if (cleanQuery.includes("arr") || cleanQuery.includes("cac") || cleanQuery.includes("sass") || cleanQuery.includes("empire")) {
      return `SYNAPSE OPERATIONAL AUDIT:
• Focus restructuring resources on expanding your SaaS or AI nodes.
• Sequentially scale marketing and strategic optimizations to maximize total yield multipliers.
• Liquidate SaaS assets during high valuation cycles to realize massive capital gains.`;
    }
    if (cleanQuery.includes("debt") || cleanQuery.includes("credit") || cleanQuery.includes("loan") || cleanQuery.includes("bank")) {
      return `SYNAPSE LEVERAGE ANALYSIS:
• Utilize Central Bank credit facilities during the early acquisition phases of cash-yielding nodes.
• Immediately deposit excess credit into the High-Yield Savings Vault (5.5% passive return) to offset cost of debt.
• Ensure full debt payoff before the loan maturity timer expires to prevent asset seizure penalty due to default.`;
    }
    return `SYNAPSE GENERAL COGNITIVE RESPONSE:
• Maintain a strategic balance between high-yielding business nodes and volatile crypto assets.
• Continue completing academy modules to accumulate experience and unlock top-tier infrastructure upgrades.
• Monitor neural decision prompts for real-time risk alerts and system diagnostic feedback.`;
  }
}

export interface MacroeconomicNews {
  headline: string;
  description: string;
  sentiment: "BULLISH" | "BEARISH" | "NEUTRAL";
  sentimentScore: number;
  timestamp: string;
}

export async function generateMacroeconomicNews(symbol: string, price: number): Promise<MacroeconomicNews> {
  const now = new Date().toLocaleTimeString();
  const fallbacks: MacroeconomicNews[] = [
    {
      headline: `NEURAL TICKER: ${symbol} INFLOWS SURGE`,
      description: `Record sovereign capital inflow to ${symbol} recorded at $${price.toLocaleString()}. The neural council forecasts a prolonged expansion in trading volume.`,
      sentiment: "BULLISH",
      sentimentScore: 88,
      timestamp: now
    },
    {
      headline: `SECONDARY MARKET LIQUIDATION PRESSURE FOR ${symbol}`,
      description: `Surging sell pressure observed for ${symbol} around $${price.toLocaleString()}. Short-term price correction probability is elevated.`,
      sentiment: "BEARISH",
      sentimentScore: 19,
      timestamp: now
    },
    {
      headline: `DYNAMIC CONSOLIDATION DETECTED IN ${symbol}`,
      description: `${symbol} price stabilized at $${price.toLocaleString()}. Neural liquidity checks indicate the market is in a healthy accumulation phase.`,
      sentiment: "NEUTRAL",
      sentimentScore: 50,
      timestamp: now
    }
  ];

  const randomIdx = Math.floor(Math.random() * fallbacks.length);
  const fallback = fallbacks[randomIdx];

  if (!hasApiKey()) {
    return fallback;
  }

  const prompt = `You are the VANTAGE SOVEREIGN MACROECONOMIC SENTIMENT ENGINE.
Generate a highly premium, cinematic, and professional macroeconomic news alert for the asset with symbol: "${symbol}" currently trading at price: "$${price}".
CRITICAL: You must write the "headline" and "description" STRICTLY in the English language. Speak like a cyberpunk Bloomberg terminal or institutional finance intelligence oracle.
Return ONLY a valid JSON object containing exactly these fields: "headline", "description", "sentiment", "sentimentScore".
Do not wrap it in markdown block tags, code blocks, or include any extra text.

Rules:
1. "headline" must be a sleek, high-impact news title in English.
2. "description" must be an advanced macroeconomic analysis in English describing interest rates, liquidity flows, geopolitical risk, or central banking policy for ${symbol}.
3. "sentiment" must be exactly "BULLISH", "BEARISH", or "NEUTRAL".
4. "sentimentScore" must be a number between 0 and 100 corresponding to the strength of the sentiment.`;

  try {
    const text = await callGemini(prompt, 350, "application/json");
    const parsed = JSON.parse(text.trim());
    return {
      headline: parsed.headline || fallback.headline,
      description: parsed.description || fallback.description,
      sentiment: (parsed.sentiment === "BULLISH" || parsed.sentiment === "BEARISH" || parsed.sentiment === "NEUTRAL") ? parsed.sentiment : fallback.sentiment,
      sentimentScore: typeof parsed.sentimentScore === "number" ? parsed.sentimentScore : fallback.sentimentScore,
      timestamp: now
    };
  } catch (error) {
    console.warn("Macroeconomic news generation failed, using local reserve fallback.", error);
    return fallback;
  }
}

export async function generateSecurityAudit(
  protocols: {
    quantumLedger: boolean;
    neuralFirewall: boolean;
    biometricMfa: boolean;
    multisigAuth: boolean;
  },
  portfolio: any[],
  balance: number
): Promise<string> {
  const activeList = [];
  if (protocols?.quantumLedger) activeList.push("Quantum Cryptographic Ledger");
  if (protocols?.neuralFirewall) activeList.push("Neural AI Firewall");
  if (protocols?.biometricMfa) activeList.push("Biometric MFA");
  if (protocols?.multisigAuth) activeList.push("Multi-Signature Authorization");

  const protocolsStr = activeList.length > 0 ? activeList.join(", ") : "None (CRITICAL RISK)";
  const assetsStr = portfolio.length > 0 
    ? portfolio.map(a => `${a.symbol} (${a.amount})`).join(", ")
    : "Only Liquid Cash Assets";

  const prompt = `You are the VANTAGE CYBERSECURITY INTELLIGENCE ORACLE.
Analyze the security defense state of our Sovereign Wealth Fund OS:
- Enabled Defense Protocols: ${protocolsStr}
- Protected Fund Cash: $${balance.toLocaleString()}
- Monitored Portfolio: ${assetsStr}

Provide a highly cinematic, premium, and professional cybersecurity threat analysis.
CRITICAL: You must write your complete response STRICTLY in the English language.
- Speak in a highly technical, futuristic cyber-industrial tone.
- Discuss system vulnerability, cryptographic integrity, active threat vectors, and recommended defensive updates.
- Keep the entire output concise, under 60-70 words so it fits perfectly on a premium terminal screen.`;

  try {
    return await callGemini(prompt, 250);
  } catch (error) {
    console.warn("AI security audit failed, using offline heuristic audit.");
    const enabledCount = activeList.length;
    if (enabledCount === 0) {
      return `📟 SECURITY STATUS: CRITICAL (HIGH RISK)
• ZERO DEFENSIVE PROTOCOLS ACTIVE. System is completely vulnerable to port scanning, database intrusion, and DDoS attacks.
• Action Required: Instantly enable Neural AI Firewall and Quantum Cryptographic Ledger to prevent database manipulation in db.json.`;
    }
    if (enabledCount < 3) {
      return `📟 SECURITY STATUS: MODERATE (SECURED)
• ACTIVE PROTOCOLS: ${protocolsStr}. Peripheral defenses functional, but complex exploits targeting the $${balance.toLocaleString()} liquid reserve remain possible.
• Action Required: Implement Multi-Signature Authorization to establish absolute transaction security.`;
    }
    return `📟 SECURITY STATUS: COGNITIVE LOCKDOWN (MAXIMUM DEFENSE)
• ACTIVE PROTOCOLS: ${protocolsStr}. Entire Vantage financial framework insulated via advanced cryptographic and neural barriers.
• Database synchronization latency optimal. Unauthorized access vectors 100% blocked.`;
  }
}

