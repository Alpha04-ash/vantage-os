export interface SharedPropertyAsset {
  id: string;
  name: string;
  type: "residential" | "commercial" | "industrial" | "luxury" | "hypercar" | "supercar" | "yacht" | "jet";
  category: "property" | "lifestyle";
  location: string;
  purchasePrice: number;
  rentPerSecond: number;
  description: string;
  equityRatio: string;
  risk: "Low" | "Medium" | "High";
  educationalTakeaway: string;
  realWorldMetric: string;
  strategyDocs: string;
}

export const AVAILABLE_ASSETS: SharedPropertyAsset[] = [
  // PROPERTIES (Category: property) - 8 Diverse Options
  {
    id: "prop_res_1",
    name: "Neo-Tokyo Co-Living Capsule",
    type: "residential",
    category: "property",
    location: "Sector 7 - Shinjuku District",
    purchasePrice: 65000,
    rentPerSecond: 1.3, // ~$4,680/mo (payback: ~13.8 mos)
    description: "Autonomous micro-capsules leased to high-velocity tech operators.",
    equityRatio: "85/15 LTV",
    risk: "Low",
    educationalTakeaway: "Micro-apartments operate with high volume and lower CapEx, yielding steady passive cash flow.",
    realWorldMetric: "Target Yield: 7.2%",
    strategyDocs: "Stable co-living occupancy metrics. Upgrades increase rental capacity by +12% per level."
  },
  {
    id: "prop_res_2",
    name: "Metaverse Agency Headquarters",
    type: "commercial",
    category: "property",
    location: "Decentraland Central Plaza",
    purchasePrice: 150000,
    rentPerSecond: 3.0, // ~$10,800/mo (payback: ~13.8 mos)
    description: "Holographic commercial slots leased to digital marketing agencies.",
    equityRatio: "No Leverage",
    risk: "High",
    educationalTakeaway: "Virtual real estate avoids physical depreciation costs but exhibits extreme volatility and platform dependency.",
    realWorldMetric: "Traffic Yield: 9.8%",
    strategyDocs: "Virtual commercial spaces scale inline with active metaverse user index trends."
  },
  {
    id: "prop_res_3",
    name: "Zurich Alpine Brain Chalet",
    type: "luxury",
    category: "property",
    location: "Residential Peak - Swiss Alps",
    purchasePrice: 240000,
    rentPerSecond: 4.5, // ~$16,200/mo (payback: ~14.8 mos)
    description: "Modern solar-heated chalets with geothermal heat pumps and alpine wellness retreats.",
    equityRatio: "75/25 LTV",
    risk: "Medium",
    educationalTakeaway: "Alpine properties act as inflation hedges. Scenic tourist locations drive high short-term occupancy.",
    realWorldMetric: "Tourism Premium: +15%",
    strategyDocs: "Elite luxury residential. Proper tenant screening maximizes baseline asset valuation and appreciation rates."
  },
  {
    id: "prop_com_1",
    name: "Sovereign Web3 Silicon Tower",
    type: "commercial",
    category: "property",
    location: "Manhattan Silicon Block",
    purchasePrice: 480000,
    rentPerSecond: 8.5, // ~$30,600/mo (payback: ~15.6 mos)
    description: "High-rise corporate office tower leased to FinTech conglomerates.",
    equityRatio: "70/30 LTV",
    risk: "Medium",
    educationalTakeaway: "Triple-Net (NNN) commercial leases shift all property taxes, insurance, and maintenance costs to the tenant.",
    realWorldMetric: "Occupancy Index: 94%",
    strategyDocs: "Securing stable institutional tenants directly insulates cash flows from regional downturns."
  },
  {
    id: "prop_ind_2",
    name: "Zurich Geothermal Mega-Node",
    type: "industrial",
    category: "property",
    location: "Zurich Biotech Core",
    purchasePrice: 950000,
    rentPerSecond: 16.0, // ~$57,600/mo (payback: ~16.5 mos)
    description: "Deep geothermal industrial facility supplying green energy to regional laboratories.",
    equityRatio: "60/40 Utility",
    risk: "Low",
    educationalTakeaway: "Utility-based industrial real estate provides exceptional lease reliability due to long-term government contracts.",
    realWorldMetric: "Energy Yield: 8.9%",
    strategyDocs: "Critical industrial infrastructure node. Turbine efficiency upgrades lower operational maintenance costs."
  },
  {
    id: "prop_lux_1",
    name: "Cyber-Villa 'Monolith'",
    type: "luxury",
    category: "property",
    location: "Monaco Elite Heights",
    purchasePrice: 1800000,
    rentPerSecond: 30.0, // ~$108,000/mo (payback: ~16.6 mos)
    description: "Oceanfront luxury fortress featuring minimalist obsidian and titanium-glass architecture.",
    equityRatio: "50/50 LTV",
    risk: "High",
    educationalTakeaway: "Super-luxury properties experience sharp price swings, offering high appreciation but limited secondary market liquidity.",
    realWorldMetric: "Annual Appreciation: +16.8%",
    strategyDocs: "Highest prestige class. Leveraging this luxury villa for personal use accelerates prestige indices."
  },
  {
    id: "prop_lux_2",
    name: "Aether Stratosphere Penthouse",
    type: "luxury",
    category: "property",
    location: "High Orbit 350km",
    purchasePrice: 3800000,
    rentPerSecond: 60.0, // ~$216,000/mo (payback: ~17.6 mos)
    description: "Premium space property featuring micro-meteorite shields and gravity-insulated sleeping quarters.",
    equityRatio: "40/60 Speculative",
    risk: "High",
    educationalTakeaway: "Extreme speculative assets are highly volatile, built on exclusivity and restricted orbital slots.",
    realWorldMetric: "Premium Access: 100%",
    strategyDocs: "Technological orbital assets. High-tech life-support upgrades attract premium international residents."
  },
  {
    id: "prop_ind_1",
    name: "Singularity Logistics Hyper-Grid",
    type: "industrial",
    category: "property",
    location: "Pacific Autonomous Seaboard",
    purchasePrice: 7500000,
    rentPerSecond: 110.0, // ~$396,000/mo (payback: ~18.9 mos)
    description: "Industrial logistics hyper-grid featuring landing strips for heavy autonomous cargo drones.",
    equityRatio: "65/35 NNN",
    risk: "Low",
    educationalTakeaway: "Logistics infrastructure forms the backbone of physical commerce, guaranteeing long-term tenant stability.",
    realWorldMetric: "Cap Rate: 9.1%",
    strategyDocs: "Steady cash flow from heavy industrial leases. Optimal drone port spacing minimizes vacancy cycles."
  },

  // GARAGE & VEHICLES (Category: lifestyle) - 8 Diverse Options
  {
    id: "car_bike_1",
    name: "Aeon V-2 Superbike",
    type: "supercar",
    category: "lifestyle",
    location: "Shinjuku Grid Garage",
    purchasePrice: 18000,
    rentPerSecond: 0.4, // ~$1,440/mo (payback: ~12.5 mos)
    description: "Electric racing superbike optimized for high-speed transit through metropolitan streets.",
    equityRatio: "All Cash",
    risk: "Low",
    educationalTakeaway: "Low-cost bikes are highly liquid entry-level assets that generate immediate short-term rental yields.",
    realWorldMetric: "Utilization Rate: 92%",
    strategyDocs: "Agile network transit assets. Tuning battery cells boosts rental reservation rates by +12%."
  },
  {
    id: "car_super_1",
    name: "Cyber-Cruiser Model GT",
    type: "supercar",
    category: "lifestyle",
    location: "Obsidian Private Hangar",
    purchasePrice: 38000,
    rentPerSecond: 0.8, // ~$2,880/mo (payback: ~13.2 mos)
    description: "Aerodynamic sports coupe optimized for peer-to-peer (P2P) sharing networks.",
    equityRatio: "Financed",
    risk: "Low",
    educationalTakeaway: "Personal vehicles depreciate rapidly. Deploying supercars into premium rental pools transforms this liability into active cash flow.",
    realWorldMetric: "Utilization: 88%",
    strategyDocs: "Supercar fleet leasing assets. Upgrading powertrains boosts rental yields by +12% per level."
  },
  {
    id: "car_super_2",
    name: "Chronos Electric Hyper-SUV",
    type: "supercar",
    category: "lifestyle",
    location: "Geneva Transit Hub",
    purchasePrice: 72000,
    rentPerSecond: 1.4, // ~$5,040/mo (payback: ~14.2 mos)
    description: "Armored luxury SUV powered by cutting-edge solid-state battery matrices.",
    equityRatio: "Outright Purchase",
    risk: "Low",
    educationalTakeaway: "Premium-grade transport acts as a high-yield asset, generating stable returns from corporate executives during global summits.",
    realWorldMetric: "Corporate Lease: $950/day",
    strategyDocs: "Heavy luxury transit. Cabin comfort upgrades directly improve customer retention and lease stability."
  },
  {
    id: "car_hyper_1",
    name: "Vantage SV-9 Apex Roadster",
    type: "hypercar",
    category: "lifestyle",
    location: "Sovereign Executive Garage",
    purchasePrice: 150000,
    rentPerSecond: 2.8, // ~$10,080/mo (payback: ~14.8 mos)
    description: "High-performance hypercar featuring a carbon-monocoque frame and sub-second electric powertrain system.",
    equityRatio: "Prestige Lease",
    risk: "Medium",
    educationalTakeaway: "Limited-edition hypercars appreciate over time if kept pristine, providing massive prestige for corporate networking.",
    realWorldMetric: "Prestige Multiplier: +15%",
    strategyDocs: "Executive hypercars represent the pinnacle of modern engineering. Personal usage accelerates Academy XP gains."
  },
  {
    id: "car_hyper_2",
    name: "Aether-GT Phantom Roadster",
    type: "hypercar",
    category: "lifestyle",
    location: "Zurich Skyline Port",
    purchasePrice: 320000,
    rentPerSecond: 5.8, // ~$20,880/mo (payback: ~15.3 mos)
    description: "Concept aerodynamic hypercar with composite alloy plating and sub-sonic flight matrices.",
    equityRatio: "Financed",
    risk: "High",
    educationalTakeaway: "Concept aerodynamic hypercars face heavy wear and tear, but secure premium rental margins in executive transit loops.",
    realWorldMetric: "Lease Index: $3.2k/day",
    strategyDocs: "Sub-orbital flight hypercars. Upgrading thruster efficiency expands the margin of corporate charter contracts."
  },
  {
    id: "car_yacht_1",
    name: "Sovereign Apex-6 Super-Yacht",
    type: "yacht",
    category: "lifestyle",
    location: "Monaco Yacht Club Marina",
    purchasePrice: 950000,
    rentPerSecond: 16.0, // ~$57,600/mo (payback: ~16.5 mos)
    description: "Smart luxury yacht featuring composite teak decks and zero-emission hydrogen fuel cells.",
    equityRatio: "Syndicated Co-ownership",
    risk: "High",
    educationalTakeaway: "Yachts command heavy maintenance overhead (CapEx). Syndicated co-ownership models optimize charter weeks to cover operations.",
    realWorldMetric: "Charter Booking: $42k/week",
    strategyDocs: "Autonomous luxury yacht leasing. High-end hospitality upgrades capture high-value corporate charter agreements."
  },
  {
    id: "car_jet_1",
    name: "Aeon Stratosphere Private Jet",
    type: "jet",
    category: "lifestyle",
    location: "Aether Aviation Port",
    purchasePrice: 4200000,
    rentPerSecond: 65.0, // ~$234,000/mo (payback: ~17.9 mos)
    description: "Sub-orbital business jet with intelligent avionics optimized for instant global flight routing.",
    equityRatio: "Fractional Ownership",
    risk: "High",
    educationalTakeaway: "Private jets represent the pinnacle of lifestyle asset leverage, converting high-maintenance liabilities into corporate charter assets.",
    realWorldMetric: "Aviation Yield: 11.5%",
    strategyDocs: "Private business jet fleets. Long-term corporate fractional leases secure reliable capital appreciation."
  },
  {
    id: "car_jet_2",
    name: "Orbital Eclipse Starship",
    type: "jet",
    category: "lifestyle",
    location: "Aerospace Launch Facility",
    purchasePrice: 11500000,
    rentPerSecond: 170.0, // ~$612,000/mo (payback: ~18.7 mos)
    description: "Commercial orbital rocket designed for rapid point-to-point transport between hemispheres.",
    equityRatio: "Syndicated Lease",
    risk: "High",
    educationalTakeaway: "Aerospace rocket assets command the highest acquisition cost but yield unprecedented charter pricing power.",
    realWorldMetric: "Starship Yield: 12.8%",
    strategyDocs: "Sub-orbital starships. Heat-shield upgrades reduce mechanical depreciation and maintenance intervals."
  }
];
