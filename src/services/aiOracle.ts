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

export async function generatePortfolioAudit(portfolio: any[]) {
  const assets = portfolio.length > 0 
    ? portfolio.map(a => `${a.symbol} (${a.amount})`).join(", ")
    : "Ягон дороии фаъол нест. Ҳамаи пардохтпазирӣ дар шакли пули нақд.";
    
  const prompt = `You are the VANTAGE PORTFOLIO AI. Analyze these holdings: ${assets}.
Provide a highly professional, cinematic, institutional-grade risk assessment.
CRITICAL: You must write your complete response STRICTLY in the Tajik language.
Keep it very short, absolute maximum 20 words. Speak like a cyberpunk financial operating system.
Example in Tajik: "Алоқамандии дороиҳо оптималӣ аст. Ба ҷамъоварии хашмгин идома диҳед."`;

  try {
    return await callGemini(prompt, 50);
  } catch (error) {
    return "Консентратсияи пардохтпазирӣ оптималӣ аст. Мавқеъҳоро нигоҳ доред.";
  }
}

export async function generateAcademyDirective(xp: number) {
  const prompt = `You are the VANTAGE COGNITIVE TUTOR. The operator has ${xp} XP.
Suggest a futuristic, highly advanced financial concept they should master next.
CRITICAL: You must write your complete response STRICTLY in the Tajik language.
Keep it very short, absolute maximum 15 words. Speak like a cyberpunk AI.
Example in Tajik: "Минбаъд азхудкунии протоколҳои қарзии фаврии ғайримарказиро оғоз кунед."`;

  try {
    return await callGemini(prompt, 40);
  } catch (error) {
    return "Минбаъд Протоколҳои Пардохтпазирии Ғайримарказиро азхуд кунед.";
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
      title: "Гузариш ба Шартномаҳои Пардохти Солона",
      rationale: "Меъёри аз даст додани муштариёнро аз 2.1% то 1.2% тавассути пешниҳоди 10% тахфиф дар пардохтҳои пешакӣ коҳиш медиҳад ва устувории ARR-ро ба таври назаррас афзоиш медиҳад.",
      cost: 15000,
      yieldBoostPercent: 25
    },
    {
      id: "saas_strat_2",
      title: "Автоматикунонии Низоми Муваффақияти Муштариён",
      rationale: "Мониторинги автоматии вазъи муштариёнро барои муайян кардани пешгирии рафтани онҳо дар марҳилаҳои аввал роҳандозӣ мекунад ва LTV-ро ба 4.8 баробар афзоиш медиҳад.",
      cost: 8000,
      yieldBoostPercent: 15
    },
    {
      id: "saas_strat_3",
      title: "Бозсозии Корхонаҳои Насли Нав",
      rationale: "Системаҳои пешрафтаи амнияти корпоративӣ ва SSO-ро барои ҷалби муштариёни калони Fortune 500 роҳандозӣ менамояд.",
      cost: 30000,
      yieldBoostPercent: 40
    }
  ],
  "node_sat_1": [
    {
      id: "prop_strat_1",
      title: "Оптимизатсияи Шабакаи Хушманди Энергия",
      rationale: "Хароҷоти иловагии биноро тавассути тақсимоти автоматии энергияи сабз ва танзими алгоритмии масраф 15% коҳиш медиҳад.",
      cost: 45000,
      yieldBoostPercent: 20
    },
    {
      id: "prop_strat_2",
      title: "Шартномаҳои Динамикии Иҷораи Хушманд",
      rationale: "Маълумоти мустақими талаботи идоравиро барои танзими динамикии хароҷоти иҷора истифода мебарад ва сатҳи бандшавии ҷойҳоро то 98.2% зиёд мекунад.",
      cost: 60000,
      yieldBoostPercent: 30
    },
    {
      id: "prop_strat_3",
      title: "Маблағгузории Дубораи Уҳдадориҳои Қарзӣ",
      rationale: "Шартҳои фоизии қарзи амволи ғайриманқулро бозсозӣ мекунад, пардохтҳои ҳармоҳаро кам ва даромади EBITDA-ро васеъ менамояд.",
      cost: 100000,
      yieldBoostPercent: 45
    }
  ],
  "node_quant_1": [
    {
      id: "defi_strat_1",
      title: "Хеҷи Алгоритмии Аз Даст Додани Муваққатӣ",
      rationale: "Шартномаҳои фаврии опсиониро барои пӯшонидани хавфи аз даст додани маблағ дар давраи ноустувории баланди бозор истифода мебарад.",
      cost: 150000,
      yieldBoostPercent: 35
    },
    {
      id: "defi_strat_2",
      title: "Масири Хушманди Муҳофизати MEV",
      rationale: "Барои пешгирӣ аз ҳамлаҳои сендвичӣ ва пешгузарии транзаксияҳо шабакаҳои хусусиро истифода мебарад ва +15% даромади иловагӣ меорад.",
      cost: 100000,
      yieldBoostPercent: 20
    },
    {
      id: "defi_strat_3",
      title: "Маркази Арбитражи Пардохтпазирии байни Шабакаҳо",
      rationale: "Пардохтпазириро дар шабакаҳои Layer-2 барои ба даст овардани мукофотпулиҳои баланди даромад дар ҷуфтҳои бозорҳои навбунёд васеъ менамояд.",
      cost: 250000,
      yieldBoostPercent: 50
    }
  ],
  "node_ai_1": [
    {
      id: "ai_strat_1",
      title: "Танзими Топологияи Шабакаи AI",
      rationale: "Моделҳои нейронии масирро барои коҳиш додани таъхири иҷрои вазифаҳо ба андозаи 32% беҳтар мекунад ва маржаи амалиётиро ба таври назаррас афзоиш медиҳад.",
      cost: 600000,
      yieldBoostPercent: 30
    },
    {
      id: "ai_strat_2",
      title: "Автоматикунонии Флоти Худгард",
      rationale: "Хизматрасониҳои хаткашони беруниро бо гиреҳҳои логистикии автоматӣ иваз намуда, маржаи EBITDA-ро то 78% баланд мебардорад.",
      cost: 900000,
      yieldBoostPercent: 45
    },
    {
      id: "ai_strat_3",
      title: "Шабакаи Пешгӯии Занҷири Таъминот",
      rationale: "Барои пешакӣ ҷойгир кардани молҳои ҷисмонӣ дар наздикии марказҳои сераҳолӣ моделсозии пешгӯии талаботкунандаро истифода мебарад.",
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
CRITICAL: You must write all output strings ("title", "rationale") strictly in the Tajik language.
Return ONLY a valid JSON array of 3 objects containing exactly these fields: "id", "title", "rationale", "cost", "yieldBoostPercent".
Do not wrap it in markdown block tags, code blocks, or include any extra text.

Rules:
1. "id" must be strings like "${nodeId}_strat_1", "${nodeId}_strat_2", "${nodeId}_strat_3".
2. "title" must be a highly realistic financial restructuring action written in TAJIK.
3. "rationale" must be a professional justification written in TAJIK outlining the CAC, LTV, EBITDA, or Margin improvements.
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
    ? `Қарз тасдиқ шуд (Ҳадди қобилияти пардохтпазирии соҳибихтиёр қонеъ гардонида шуд). Сармояи оператор ба маблағи $${totalEquity.toLocaleString()} фишанги қарзиро дастгирӣ мекунад. Меъёри 12% APR барои давраи ${term} сония муқаррар карда шуд.` 
    : `Рад карда шуд: Дархости стратегӣ ба маблағи $${amount.toLocaleString()} аз имкониятҳои фишанги молиявии оператор нисбат ба ҳавзи сармояи $${totalEquity.toLocaleString()} зиёд аст. Дастурҳои андеррайтинг вайрон карда шуданд.`;
    
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
CRITICAL: You must write the underwriting "verdict" STRICTLY in the Tajik language.
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
CRITICAL: You must write the complete response STRICTLY in the Tajik language.
- Break your response into a short executive overview and then 2-3 bulleted strategic points in Tajik.
- Speak in a sleek, cyber-industrial, professional tone.
- Keep the entire reply under 60-70 words so it stays ultra-focused, sharp, and easy to read.`;

  try {
    return await callGemini(prompt, 200);
  } catch (error) {
    console.error("generateSynapseResponse failed, falling back:", error);
    // Local offline mock responses in Tajik based on queries
    const cleanQuery = query.toLowerCase();
    if (cleanQuery.includes("arr") || cleanQuery.includes("cac") || cleanQuery.includes("sass") || cleanQuery.includes("empire")) {
      return `АУДИТИ АМАЛИЁТИИ SYNAPSE:
• Диққати бозсозиро ба васеъ кардани гиреҳҳои SaaS ё AI-и худ равона кунед.
• Хароҷоти маркетингӣ ва бозсозии стратегиро ҳамзамон зиёд кунед, то мултипликаторҳои умумии даромадро афзоиш диҳед.
• Дороиҳои SaaS-ро дар давраҳои мултипликатори баланд фурӯшед, то фоидаи бузурги сармоя ба даст оред.`;
    }
    if (cleanQuery.includes("debt") || cleanQuery.includes("credit") || cleanQuery.includes("loan") || cleanQuery.includes("bank")) {
      return `ТАҲЛИЛИ ФИШАНГИ МОЛИЯВИИ SYNAPSE:
• Имкониятҳои қарзии Бонки Марказиро дар марҳилаҳои аввали хариди дороиҳо истифода баред.
• Сармояи қарзии зиёдатиро фавран дар Хазинаи Амонатӣ (даромади 5.5% дар як соат) ҷойгир кунед, то хароҷоти қарзро ҷуброн намоед.
• Пеш аз ба охир расидани ҳисоби ақиб, пардохти пурраи қарзро таъмин кунед, то аз ҷаримаи мусодираи дороиҳо аз сабаби дефолт пешгирӣ намоед.`;
    }
    return `ҶАВОБИ УМУМИИ НЕЙРОНИИ SYNAPSE:
• Мувозинати стратегиро байни гиреҳҳои тиҷоратии сердаромад ва токенҳои криптографии ноустувор нигоҳ доред.
• Барои ба даст овардани таҷриба ва кушодани бозсозиҳои сатҳи боло, дарсҳои омӯзиширо идома диҳед.
• Барои гирифтани огоҳиҳои хавф дар вақти воқеӣ, навсозиҳои Қарори Нейрониро назорат кунед.`;
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
      headline: `ФЕҲРИСТИ СУРЪАТИ НЕЙРОНИИ ${symbol} БОЛО МЕРАВАД`,
      description: `Воридшавии рекордии сармояи соҳибихтиёр ба ${symbol} дар сатҳи $${price.toLocaleString()} сабт гардид. Шӯрои нейронӣ афзоиши фаъолияти тиҷоратиро пешгӯӣ мекунад.`,
      sentiment: "BULLISH",
      sentimentScore: 88,
      timestamp: now
    },
    {
      headline: `ФИШОРИ ЛИКВИДАТСИЯИ БОЗОРИ ДУЮМДАРАҶАИ ${symbol}`,
      description: `Афзоиши фишори фурӯш дар бозори ${symbol} дар марзи $${price.toLocaleString()} ба мушоҳида мерасад. Эҳтимоли ислоҳоти кӯтоҳмуддати нархҳо баланд аст.`,
      sentiment: "BEARISH",
      sentimentScore: 19,
      timestamp: now
    },
    {
      headline: `КОНСОЛИДАТСИЯИ ДИНАМИКИИ ${symbol} ДАР САҲНАИ БАЙНАЛМИЛАЛӢ`,
      description: `Нархи ${symbol} дар сатҳи $${price.toLocaleString()} ба эътидол омад. Санҷиши нейронии пардохтпазирӣ нишон медиҳад, ки бозор дар марҳилаи ҷамъкунӣ қарор дорад.`,
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
CRITICAL: You must write the "headline" and "description" STRICTLY in the Tajik language. Speak like a cyberpunk Bloomberg terminal or institutional finance intelligence oracle.
Return ONLY a valid JSON object containing exactly these fields: "headline", "description", "sentiment", "sentimentScore".
Do not wrap it in markdown block tags, code blocks, or include any extra text.

Rules:
1. "headline" must be a sleek, high-impact news title in Tajik.
2. "description" must be an advanced macroeconomic analysis in Tajik describing interest rates, liquidity flows, geopolitical risk, or central banking policy for ${symbol}.
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
