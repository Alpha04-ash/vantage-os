export interface SharedInfrastructureNode {
  id: string;
  name: string;
  type: "data_center" | "orbital_satellite" | "quantum_rig" | "ai_cluster";
  cost: number;
  yieldPerSecond: number;
  owned: number;
  marketingLevel: number;
  efficiencyLevel: number;
  customYieldMultiplier?: number;
}

export interface EducationalBusiness extends Omit<SharedInfrastructureNode, 'owned' | 'marketingLevel' | 'efficiencyLevel'> {
  description: string;
  ltvCac: string;
  risk: "Low" | "Medium" | "High";
  educationalTakeaway: string;
  realWorldMetric: string;
  strategyDocs: string;
}

export const AVAILABLE_NODES: EducationalBusiness[] = [
  {
    id: "node_neural_1",
    name: "Neural Bio-Interface Lab",
    type: "quantum_rig",
    cost: 15000,
    yieldPerSecond: 0.35, // ~$1,260/mo, 1.0 yr payback
    description: "Specialized laboratory designing smart neural links for human-machine telemetry.",
    ltvCac: "3.5x",
    risk: "Low",
    educationalTakeaway: "Early-stage hardware operations require high research capital but command high defensibility through proprietary technology.",
    realWorldMetric: "R&D Efficiency: 86%",
    strategyDocs: "Bio-link development requires strict regulatory compliance. Capitalizing on IP scaling is key."
  },
  {
    id: "node_dc_1",
    name: "SaaS Enterprise Platform",
    type: "data_center",
    cost: 40000,
    yieldPerSecond: 0.8, // ~$2,880/mo, 1.15 yr payback
    description: "Cloud-based enterprise automation software with recurring licenses.",
    ltvCac: "4.2x",
    risk: "Medium",
    educationalTakeaway: "Software-as-a-Service scales fast because recurring subscription revenue (ARR) creates highly predictable cash flows with low variable delivery costs. To expand, focus heavily on improving the LTV/CAC ratio through CAC optimization.",
    realWorldMetric: "Monthly Churn: 2.1%",
    strategyDocs: "SaaS growth is highly dependent on compound customer retention. Lowering churn is the highest leverage action for value accumulation."
  },
  {
    id: "node_bank_1",
    name: "Sovereign Neo-Bank Hub",
    type: "orbital_satellite",
    cost: 110000,
    yieldPerSecond: 2.0, // ~$7,200/mo, 1.27 yr payback
    description: "Decentralized high-yield treasury neo-banking for corporate reserves.",
    ltvCac: "5.1x",
    risk: "Medium",
    educationalTakeaway: "Fintech neo-banks bypass retail branch overheads, allowing high capital efficiency and yield pass-throughs.",
    realWorldMetric: "Net Interest Margin: 3.4%",
    strategyDocs: "Liquidity distribution and low reserve friction optimize global capital deployment efficiency."
  },
  {
    id: "node_media_1",
    name: "Decentralized Media Hub",
    type: "data_center",
    cost: 350000,
    yieldPerSecond: 6.0, // ~$21,600/mo, 1.35 yr payback
    description: "Peer-to-peer content CDN nodes fueled by autonomous ad-revenue protocols.",
    ltvCac: "6.2x",
    risk: "High",
    educationalTakeaway: "P2P content networks achieve zero host cost but require heavy user acquisition spend to kickstart standard monetization cycles.",
    realWorldMetric: "MAU Growth: +14.2%",
    strategyDocs: "Growth relies on community engagement metrics. Onboarding content syndicates maximizes ad impressions."
  },
  {
    id: "node_sat_1",
    name: "PropTech Commercial Fund",
    type: "orbital_satellite",
    cost: 600000,
    yieldPerSecond: 10.0, // ~$36,000/mo, 1.39 yr payback
    description: "Asset-backed commercial real estate managed through smart-lease contracts.",
    ltvCac: "N/A (Asset-Backed)",
    risk: "Low",
    educationalTakeaway: "Real estate provides highly reliable yield backed by hard physical assets, but requires significant capital expenditure (CapEx) and has high vacancy risks. Efficiency upgrades optimize operational overhead.",
    realWorldMetric: "Occupancy Rate: 94.5%",
    strategyDocs: "PropTech scales through capital efficiency. Maximizing tenant yield through automated energy grids directly improves EBITDA margins."
  },
  {
    id: "node_quant_1",
    name: "DeFi Yield Optimizer",
    type: "quantum_rig",
    cost: 1500000,
    yieldPerSecond: 25.0, // ~$90,000/mo, 1.39 yr payback
    description: "Algorithmic liquidity provisioning across decentralized trading pools.",
    ltvCac: "7.5x (Leveraged)",
    risk: "High",
    educationalTakeaway: "DeFi protocols generate astronomical yield through automated market making, but expose operators to massive smart-contract breaches and market volatility. Risk mitigation scales safety.",
    realWorldMetric: "Impermanent Loss Hedge: 88%",
    strategyDocs: "Decentralized automated systems can amplify yield, but leverage introduces extreme downside risk. Robust smart contract audits are essential."
  },
  {
    id: "node_ai_1",
    name: "AGI-Automated Logistics Hub",
    type: "ai_cluster",
    cost: 3800000,
    yieldPerSecond: 60.0, // ~$216,000/mo, 1.47 yr payback
    description: "Fully automated supply chain network running on deep neural routing models.",
    ltvCac: "5.8x",
    risk: "Medium",
    educationalTakeaway: "AI-driven logistics replaces heavy operational labor costs with fixed server overhead, permanently expanding EBITDA operating margins and cutting fulfillment latency.",
    realWorldMetric: "Operating Margin: 64%",
    strategyDocs: "Artificial Intelligence automates operational logistics. Continual refinement of network topologies expands operational output exponentially."
  },
  {
    id: "node_mining_1",
    name: "Asteroid Resource Syndicate",
    type: "ai_cluster",
    cost: 8500000,
    yieldPerSecond: 120.0, // ~$432,000/mo, 1.64 yr payback
    description: "Automated space drone fleets surveying and mining heavy precious ores from asteroids.",
    ltvCac: "8.4x",
    risk: "High",
    educationalTakeaway: "Heavy space logistics commands astronomical barriers to entry but delivers unparalleled pricing power on scarce resources.",
    realWorldMetric: "Purity Index: 98.4%",
    strategyDocs: "Orbital asset extraction cycles. Upgrading thruster efficiency cuts extraction return times."
  }
];

