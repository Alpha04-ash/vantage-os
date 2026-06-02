# ✺ Vantage OS // AI Financial Simulator

Start with $100K. Reach $1M without going bankrupt.  
Learn real money decisions by actually making them.

Built for West Hacks 2026.

---

Vantage OS is an interactive AI-powered financial simulator designed to help users learn real-world money decisions by running their own economy.

Start with $100,000 in seed capital and grow your wealth to $1,000,000 through three core pillars:

📈 **Invest** — Trade crypto and acquire cash-generating businesses  
🏠 **Own** — Buy real estate and earn rental income  
🏦 **Leverage** — Use AI-underwritten loans and high-yield savings  

Every decision is analyzed in real time by AI, acting as your financial advisor.  
Make the wrong decisions — and you go bankrupt.

No spreadsheets. No theory. Just decisions.

You are not watching finance.  
You are operating it.

---

## ⌬ How It Works

Vantage OS is structured around three actionable pathways to wealth accumulation, monitored by a central dashboard and supported by an interactive advisor:

```
                          ┌──────────────────────────┐
                          │    NET WORTH DASHBOARD   │
                          └────────────┬─────────────┘
                                       │
         ┌─────────────────────────────┼─────────────────────────────┐
         ▼                             ▼                             ▼
  ┌───────────────┐             ┌───────────────┐             ┌───────────────┐
  │   1. INVEST   │             │    2. OWN     │             │  3. LEVERAGE  │
  ├───────────────┤             ├───────────────┤             ├───────────────┤
  │ Crypto Assets │             │ Real Estate   │             │ Loan Facility │
  │ SaaS Holdings │             │ Rent & Yields │             │ 5.5% Yield    │
  └───────────────┘             └───────────────┘             └───────────────┘
                                       │
                        ┌──────────────┴──────────────┐
                        ▼                             ▼
                ┌───────────────┐             ┌───────────────┐
                │   DASHBOARD   │             │  AI ADVISOR   │
                ├───────────────┤             ├───────────────┤
                │ Net Worth     │             │ Real-time     │
                │ Goal Progress │             │ Directives    │
                └───────────────┘             └───────────────┘
```

### 1. 🖥️ Dashboard & Net Worth Tracker
* **Real-time Net Worth Goal Tracker**: Consolidates liquid capital, tokenized holdings, outstanding liabilities, and property equity. Displays real-time progress toward the $1,000,000 target.
* **Gemini Neural Audit**: Direct integration with the Gemini Oracle to perform deep structural audits of portfolio asset allocation, risk exposure ratios, and leverage thresholds, generating tactical recommendations.

### 2. 📈 Crypto Trading Terminal
* **Arbitrage Spot Markets**: Real-time order desks tracking `BTC`, `ETH`, and `SOL` feed streams connected directly to the Binance Spot WebSocket API.
* **Order Depth Book & Whale Radar**: Live order book visualizations featuring cumulative depth scales and an AI-driven Whale Alert scanner that logs high-value block trades (>$75k) and simulated liquidations.

### 3. 🏢 Business Investments Restructuring
* **Industrial Asset Scale**: Acquire SaaS conglomerates, DeFi nodes, PropTech infrastructure, and AI clusters. Features **8 distinct enterprise portfolio nodes**.
* **Dynamic Search & Query Filtering**: Complex filtering capabilities allowing text search, categorization (Fintech, SaaS, Biotech), and sorting by price, Annual Recurring revenue (ARR), and holdings count.
* **Gemini Corporate Restructuring**: Submit corporate configurations directly to the Gemini Oracle. The AI performs structural cost audits, cuts operational bloat, and **permanently increases ARR and Enterprise Valuation multipliers**.
* **Modular Pagination**: Renders enterprise nodes in clean, paginated layouts to maintain high readability.

### 4. 🏠 Properties & Asset Leasing
* **16 Premium Assets**: 8 high-yield real estate properties (Co-Living Capsule, Geothermal Mega-Node, Alpine Smart-Chalet) and 8 luxury lifestyle assets (Hypercars, Supersonic Jets, Megayachts) across Switzerland, Monaco, Zurich, and Manhattan.
* **Appreciation & Leasing System**: Rent out real estate to earn passive income, while lifestyle assets generate a dynamic influence multiplier (+15% for residential properties, +25% for transports).
* **Primary Residency Protocol**: Enforces realistic residency restrictions requiring the operator's first acquired residential asset to be locked as their personal home, leaving subsequent units open for active leasing.
* **Real-time Market Inflation Engine**: Simulates dynamic market conditions, fluctuating property acquisition prices and lease yields every 8 seconds, visualised with active marquee feeds.

### 5. 🏦 Reserve Savings & Loan Bank
* **Gemini Underwriter**: Submit commercial loan applications with structured financials. The AI underwriting model calculates credit ratings based on debt-to-income and asset backing, approving or declining credit limits.
* **5.5% Compound Interest Reserve**: A high-yield savings engine that compounds interest directly on every **Fiscal Minute** (1 actual second), monitored via an active Accrual Velocity speedometer.
* **Maturity Periods & Debt Management**: Track loan amortization timers, remaining payments, and default thresholds.

### 6. 🧠 AI Financial Advisor
* **Interactive Financial Scenarios**: Dynamic modules analyzing real-world business concepts (capital leverage, CAC/ARR, financial psychology) using smooth hardware-accelerated visuals.
* **Gemini AI Advisor**: A floating, context-aware advisor present across all views that inspects the operator's real-time financial stats to answer questions with customized, state-specific financial advice.

---

## 💾 Bidirectional Server Synchronization (`db.json`)

VANTAGE OS utilizes an automated server synchronization mechanism to guarantee persistent state preservation:

* **Next.js API Synchronization Endpoint**: A dedicated background service at `/api/vantage-sync` reads and updates a local database file (`db.json`) in the project root.
* **Central Hydration**: On application initialization, the Zustand client store reads state from the local JSON database to populate cash balances, assets, loans, and XP.
* **Autosave Loops**: State modifications (asset acquisitions, security events, trade executions) trigger reactive store updates that sync automatically in the background to `db.json`.

---

## 🎬 Web Audio API Sound Synthesizer

VANTAGE OS is equipped with a custom synthesized sound engine to prevent asset loading latency and create a fully cohesive cyber-industrial soundscape:

* **Spaceship Hum (Ambient hum)**: Generates a low-frequency `55Hz Sawtooth LFO` filtered through a low-pass filter (LPF) to produce an immersive industrial background drone.
* **Hover Chirps**: Cursor movements over interactive UI elements trigger high-frequency frequency sweeps (`900Hz to 1450Hz over 80ms`).
* **Action Clicks**: Button clicks and tab switches generate sharp, satisfying tone drops (`440Hz -> 100Hz`).

---

## ⚙️ Installation & Deployment

Set up and run VANTAGE OS locally:

```bash
# 1. Clone the repository
git clone https://github.com/your-username/vantage-sovereign.git

# 2. Navigate to the project root
cd vantage-sovereign

# 3. Install dependencies
npm install

# 4. Configure Environment Variables
# Create a .env file in the root directory and add your Gemini API Key:
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here

# 5. Start the Development Server
npm run dev
```

---

## ⌬ File & Codebase Structure

The project follows a modular Next.js structure:
* `src/app/` — Main page routing and server configurations.
* `src/components/` — Client-side interface modules (Views, Charts, Trade Desk, Quests, 3D Canvas).
* `src/data/` — Static catalogs for properties and lessons.
* `src/services/` — Core simulation services (Market, AI Oracle prompts, WebSocket connections).
* `src/store/` — Zustand store for state management and local database synchronization.

---
**Developed for West Hacks 2026**  
*Sovereign Fintech. High Technical Performance.*
