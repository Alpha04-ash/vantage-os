"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AVAILABLE_NODES } from "@/data/empireNodes";

// --- TYPES ---
export interface Asset {
  id: string; symbol: string; name: string; amount: number; avgPrice: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  progress: number; // 0 to 100
  target: number;
  current: number;
  unlockedAt: string | null;
}

export interface InfrastructureNode {
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

export type VantageTab = "dashboard" | "portfolio" | "market" | "academy" | "settings" | "empire" | "bank" | "realestate" | "casino";

export interface PropertyAsset {
  id: string;
  name: string;
  type: "residential" | "commercial" | "industrial" | "luxury" | "hypercar" | "supercar" | "yacht" | "jet";
  category: "property" | "lifestyle";
  location: string;
  purchasePrice: number;
  currentValue: number;
  rentPerSecond: number;
  owned: number;
  renovationLevel: number;
  tenantQualityLevel: number;
  appreciationMultiplier: number;
  rentedCount: number;
}

export interface UserData {
  operatorId: string;
  accessKey: string;
  clearance: string;
  balance: number;
  portfolio: Asset[];
  learningXP: number;
  impactPoints: number;
  portfolioAudit: string;
  academyDirectives: string;
  infrastructure: InfrastructureNode[];
  savingsDeposited: number;
  activeLoan: {
    principal: number;
    interestRate: number;
    totalDue: number;
    timeLeft: number;
    purpose: string;
  } | null;
  properties: PropertyAsset[];
  fiscalDays?: number;
  achievements?: Achievement[];
  lastSavedTimestamp?: number;
}

interface VantageState {
  users: Record<string, UserData>;
  currentUser: UserData | null;
  isAuthenticated: boolean;
  
  login: (operatorId: string, accessKey: string) => boolean;
  register: (operatorId: string, accessKey: string, clearance: string) => boolean;
  logout: () => void;
  
  activeTab: VantageTab;
  setActiveTab: (tab: VantageTab) => void;
  
  // Current Session Data
  balance: number;
  portfolio: Asset[];
  learningXP: number;
  impactPoints: number;
  portfolioAudit: string;
  academyDirectives: string;
  infrastructure: InfrastructureNode[];
  savingsDeposited: number;
  activeLoan: {
    principal: number;
    interestRate: number;
    totalDue: number;
    timeLeft: number;
    purpose: string;
  } | null;
  properties: PropertyAsset[];
  fiscalDays: number;
  tickFiscalTime: () => void;
  lastSavedTimestamp: number;
  achievements: Achievement[];
  unlockAchievement: (id: string) => void;
  updateAchievementProgress: (id: string, current: number) => void;

  // Real Estate / Lifestyle Actions
  buyProperty: (propDef: Omit<PropertyAsset, 'owned' | 'renovationLevel' | 'tenantQualityLevel' | 'appreciationMultiplier' | 'currentValue' | 'rentedCount'>) => void;
  sellProperty: (propertyId: string) => void;
  renovateProperty: (propertyId: string, cost: number) => void;
  upgradePropertyTenants: (propertyId: string, cost: number) => void;
  collectPropertyRent: () => void;
  leaseUnit: (propertyId: string) => void;
  recallUnit: (propertyId: string) => void;
  updateValuations: (marketAdjustments: Record<string, number>) => void;

  invest: (asset: any, amount: number, currentPrice: number) => void;
  sell: (assetId: string, amount: number, currentPrice: number) => void;
  requestPortfolioAudit: () => Promise<void>;
  requestAcademyAudit: () => Promise<void>;
  
  // Empire Engine
  buyNode: (nodeDef: Omit<InfrastructureNode, 'owned' | 'marketingLevel' | 'efficiencyLevel' | 'customYieldMultiplier'>) => void;
  sellNode: (nodeId: string, baseCost: number) => void;
  upgradeNode: (nodeId: string, upgradeType: 'marketing' | 'efficiency', cost: number) => void;
  applyCorporateStrategy: (nodeId: string, strategyId: string, cost: number, yieldBoostPercent: number) => void;
  collectYield: () => void;
  addXP: (amount: number) => void;
  completeMission: (missionId: string, xpReward: number, impactReward: number) => void;
  reset: () => void;
  sanitizeState: () => void;

  // Central Banking System Actions
  depositSavings: (amount: number) => void;
  withdrawSavings: (amount: number) => void;
  applyForLoan: (amount: number, term: number, apr: number, verdict: string, purpose: string) => void;
  repayLoan: () => void;
  tickLoanTimer: () => void;
}

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_invest",
    title: "Аввалин Сармоягузорӣ",
    description: "Хуш омадед ба бозор! Ягон дороиро бомуваффақият харидорӣ намоед.",
    xpReward: 100,
    progress: 0,
    target: 1,
    current: 0,
    unlockedAt: null
  },
  {
    id: "empire_owner",
    title: "Императори Саноатӣ",
    description: "Аввалин гиреҳи инфрасохтории худро дар Империя харидорӣ кунед.",
    xpReward: 200,
    progress: 0,
    target: 1,
    current: 0,
    unlockedAt: null
  },
  {
    id: "savings_master",
    title: "Наҷотбахши Молиявӣ",
    description: "Маблағи $50,000 ё бештарро дар суратҳисоби амонатӣ пасандоз кунед.",
    xpReward: 150,
    progress: 0,
    target: 50000,
    current: 0,
    unlockedAt: null
  },
  {
    id: "scholar_lvl",
    title: "Олими Иқтисод",
    description: "Сатҳи дониши худро бо ба даст овардани 500 XP дар Академия баланд бардоред.",
    xpReward: 300,
    progress: 0,
    target: 500,
    current: 0,
    unlockedAt: null
  },
  {
    id: "millionaire_dream",
    title: "Миллиардери Оянда",
    description: "Арзиши умумии сармояи худро (Net Worth) ба $1,000,000 расонед.",
    xpReward: 500,
    progress: 0,
    target: 1000000,
    current: 0,
    unlockedAt: null
  },
  {
    id: "neural_audit",
    title: "Алоқаи Нейронӣ",
    description: "Дархости таҳлили нейронии портфел ё дастури академияро пешниҳод кунед.",
    xpReward: 120,
    progress: 0,
    target: 1,
    current: 0,
    unlockedAt: null
  }
];

const DEFAULT_USER_DATA = {
  balance: 250000,
  portfolio: [],
  learningXP: 0,
  impactPoints: 0,
  portfolioAudit: "Таҳлили нейронӣ интизор аст. Сканкунии пардохтпазириро оғоз кунед.",
  academyDirectives: "Интизори харитасозии когнитивӣ барои роҳҳои оптималии омӯзиш.",
  infrastructure: [] as InfrastructureNode[],
  savingsDeposited: 0,
  activeLoan: null as {
    principal: number;
    interestRate: number;
    totalDue: number;
    timeLeft: number;
    purpose: string;
  } | null,
  properties: [] as PropertyAsset[],
  fiscalDays: 1,
  achievements: INITIAL_ACHIEVEMENTS,
  lastSavedTimestamp: 0
};

export function playAchievementSynthesizer() {
  // Silent professional environment override
}

export const useVantageStore = create<VantageState>()(
  persist(
    (set, get) => ({
      users: {},
      currentUser: null,
      isAuthenticated: false,

      login: (operatorId, accessKey) => {
        const state = get();
        const user = state.users[operatorId];
        if (user && user.accessKey === accessKey) {
          set({
            isAuthenticated: true,
            currentUser: user,
            balance: user.balance,
            portfolio: user.portfolio,
            learningXP: user.learningXP,
            impactPoints: user.impactPoints,
            portfolioAudit: user.portfolioAudit,
            academyDirectives: user.academyDirectives,
            infrastructure: user.infrastructure || [],
            savingsDeposited: user.savingsDeposited ?? 0,
            activeLoan: user.activeLoan ?? null,
            properties: user.properties || [],
            fiscalDays: user.fiscalDays ?? 1,
            achievements: user.achievements || INITIAL_ACHIEVEMENTS,
            lastSavedTimestamp: user.lastSavedTimestamp ?? 0
          });
          return true;
        }
        return false;
      },

      register: (operatorId, accessKey, clearance) => {
        const state = get();
        if (state.users[operatorId]) return false; // Already exists

        const newUser: UserData = {
          operatorId,
          accessKey,
          clearance,
          ...DEFAULT_USER_DATA,
          fiscalDays: 1
        };

        set({
          users: { ...state.users, [operatorId]: newUser },
          isAuthenticated: true,
          currentUser: newUser,
          ...DEFAULT_USER_DATA,
          fiscalDays: 1
        });
        return true;
      },

      logout: () => set({ 
        isAuthenticated: false, 
        currentUser: null,
        ...DEFAULT_USER_DATA,
        fiscalDays: 1
      }),
      
      activeTab: "dashboard",
      setActiveTab: (tab) => set({ activeTab: tab }),
      
      ...DEFAULT_USER_DATA,

      unlockAchievement: (id) => {
        const { achievements, currentUser, users } = get();
        if (!currentUser) return;
        
        const activeList = Array.isArray(achievements) ? achievements : INITIAL_ACHIEVEMENTS;
        const exists = activeList.find(a => a.id === id);
        if (!exists || exists.unlockedAt) return;
        
        const updated = activeList.map(a => {
          if (a.id === id) {
            return {
              ...a,
              current: a.target,
              progress: 100,
              unlockedAt: new Date().toISOString()
            };
          }
          return a;
        });
        
        const xpBonus = exists.xpReward;
        const newXP = get().learningXP + xpBonus;
        
        const newUsers = { ...users };
        newUsers[currentUser.operatorId] = {
          ...newUsers[currentUser.operatorId],
          learningXP: newXP,
          achievements: updated
        };
        
        set({
          learningXP: newXP,
          achievements: updated,
          users: newUsers,
          currentUser: newUsers[currentUser.operatorId]
        });
        
        playAchievementSynthesizer();
      },

      updateAchievementProgress: (id, current) => {
        const { achievements, currentUser, users } = get();
        if (!currentUser) return;
        
        const activeList = Array.isArray(achievements) ? achievements : INITIAL_ACHIEVEMENTS;
        const targetAch = activeList.find(a => a.id === id);
        if (!targetAch || targetAch.unlockedAt) return;
        
        const nextVal = Math.min(targetAch.target, Math.max(0, current));
        const nextProgress = Math.floor((nextVal / targetAch.target) * 100);
        
        if (nextVal >= targetAch.target) {
          get().unlockAchievement(id);
          return;
        }
        
        const updated = activeList.map(a => {
          if (a.id === id) {
            return {
              ...a,
              current: nextVal,
              progress: nextProgress
            };
          }
          return a;
        });
        
        const newUsers = { ...users };
        newUsers[currentUser.operatorId] = {
          ...newUsers[currentUser.operatorId],
          achievements: updated
        };
        
        set({
          achievements: updated,
          users: newUsers,
          currentUser: newUsers[currentUser.operatorId]
        });
      },

      invest: (asset, amount, currentPrice) => {
        const cost = amount * currentPrice;
        if (get().balance < cost) return;
        set((state) => {
          const existing = state.portfolio.find((a) => a.id === asset.id);
          let newPortfolio;
          if (existing) {
            const totalAmount = existing.amount + amount;
            const avgPrice = (existing.avgPrice * existing.amount + cost) / totalAmount;
            newPortfolio = state.portfolio.map((a) => a.id === asset.id ? { ...a, amount: totalAmount, avgPrice } : a);
          } else {
            newPortfolio = [...state.portfolio, { ...asset, amount, avgPrice: currentPrice }];
          }
          
          const newBalance = state.balance - cost;
          
          // Sync to users DB
          const newUsers = { ...state.users };
          let newCurrentUser = state.currentUser;
          if (state.currentUser) {
            newUsers[state.currentUser.operatorId] = {
              ...newUsers[state.currentUser.operatorId],
              balance: newBalance,
              portfolio: newPortfolio
            };
            newCurrentUser = newUsers[state.currentUser.operatorId];
          }

          return { balance: newBalance, portfolio: newPortfolio, users: newUsers, currentUser: newCurrentUser };
        });

        // Trigger achievements
        get().updateAchievementProgress("first_invest", 1);
        
        // Calculate net worth and trigger millionaire_dream
        const portfolioValue = get().portfolio.reduce((sum, a) => sum + a.amount * (a.avgPrice || currentPrice), 0);
        const propertiesValue = get().properties.reduce((sum, p) => sum + p.owned * p.currentValue * (p.appreciationMultiplier || 1.0), 0);
        const totalNetWorth = get().balance + portfolioValue + propertiesValue;
        get().updateAchievementProgress("millionaire_dream", totalNetWorth);
      },

      sell: (assetId, amount, currentPrice) => {
        set((state) => {
          const existing = state.portfolio.find((a) => a.id === assetId);
          if (!existing || existing.amount < amount) return state;
          
          const newAmount = existing.amount - amount;
          const newPortfolio = newAmount === 0 
            ? state.portfolio.filter((a) => a.id !== assetId) 
            : state.portfolio.map((a) => a.id === assetId ? { ...a, amount: newAmount } : a);
          
          const newBalance = state.balance + amount * currentPrice;

          // Sync to users DB
          const newUsers = { ...state.users };
          let newCurrentUser = state.currentUser;
          if (state.currentUser) {
            newUsers[state.currentUser.operatorId] = {
              ...newUsers[state.currentUser.operatorId],
              balance: newBalance,
              portfolio: newPortfolio
            };
            newCurrentUser = newUsers[state.currentUser.operatorId];
          }

          return { balance: newBalance, portfolio: newPortfolio, users: newUsers, currentUser: newCurrentUser };
        });
      },

      buyNode: (nodeDef) => {
        console.log("[VANTAGE DEBUG] buyNode triggered with:", nodeDef);
        const { balance, infrastructure, currentUser, users } = get();
        console.log("[VANTAGE DEBUG] Current Store Balance:", balance);
        console.log("[VANTAGE DEBUG] Current Store Infrastructure:", infrastructure);
        console.log("[VANTAGE DEBUG] Current Operator:", currentUser);
        
        if (!currentUser) {
          console.warn("[VANTAGE DEBUG] Cannot buy: currentUser is null or undefined!");
          return;
        }
        
        const safeInfrastructure = Array.isArray(infrastructure) ? infrastructure : [];
        const existingNode = safeInfrastructure.find(n => n.id === nodeDef.id);
        const ownedCount = existingNode?.owned || 0;
        const currentCost = nodeDef.cost * Math.pow(1.5, ownedCount);
        console.log("[VANTAGE DEBUG] Calculated Cost for next unit:", currentCost);

        if (balance < currentCost) {
          console.warn("[VANTAGE DEBUG] Cannot buy: insufficient balance!");
          return;
        }

        const newBalance = balance - currentCost;
        let newInfrastructure = [...safeInfrastructure];
        
        if (existingNode) {
          newInfrastructure = newInfrastructure.map(n => 
            n.id === nodeDef.id ? { ...n, owned: (n.owned || 0) + 1 } : n
          );
        } else {
          newInfrastructure.push({ ...nodeDef, owned: 1, marketingLevel: 0, efficiencyLevel: 0, customYieldMultiplier: 1.0 });
        }

        const newUsers = { ...users };
        newUsers[currentUser.operatorId] = {
          ...newUsers[currentUser.operatorId],
          balance: newBalance,
          infrastructure: newInfrastructure
        };

        console.log("[VANTAGE DEBUG] Setting new balance:", newBalance);
        console.log("[VANTAGE DEBUG] Setting new infrastructure:", newInfrastructure);

        set({ balance: newBalance, infrastructure: newInfrastructure, users: newUsers, currentUser: newUsers[currentUser.operatorId] });

        // Trigger achievements
        get().updateAchievementProgress("empire_owner", 1);
        
        // Calculate net worth and trigger millionaire_dream
        const portfolioValue = get().portfolio.reduce((sum, a) => sum + a.amount * (a.avgPrice || 0), 0);
        const propertiesValue = get().properties.reduce((sum, p) => sum + p.owned * p.currentValue * (p.appreciationMultiplier || 1.0), 0);
        const totalNetWorth = get().balance + portfolioValue + propertiesValue;
        get().updateAchievementProgress("millionaire_dream", totalNetWorth);
      },

      sellNode: (nodeId, baseCost) => {
        const { balance, infrastructure, currentUser, users } = get();
        if (!currentUser) return;

        const existingNode = infrastructure.find(n => n.id === nodeId);
        if (!existingNode || existingNode.owned <= 0) return;

        // Calculate liquidation value (75% of current cost * yield multiplier)
        const currentCost = baseCost * Math.pow(1.5, existingNode.owned - 1);
        const multiplier = existingNode.customYieldMultiplier ?? 1.0;
        const liquidationValue = currentCost * multiplier * 0.75;

        const newBalance = balance + liquidationValue;
        const newInfrastructure = infrastructure.map(n => 
          n.id === nodeId ? { ...n, owned: n.owned - 1 } : n
        ).filter(n => n.owned > 0);

        const newUsers = { ...users };
        newUsers[currentUser.operatorId] = {
          ...newUsers[currentUser.operatorId],
          balance: newBalance,
          infrastructure: newInfrastructure
        };

        set({ balance: newBalance, infrastructure: newInfrastructure, users: newUsers, currentUser: newUsers[currentUser.operatorId] });
      },

      upgradeNode: (nodeId, upgradeType, cost) => {
        const { balance, infrastructure, currentUser, users } = get();
        if (!currentUser || balance < cost) return;

        const existingNode = infrastructure.find(n => n.id === nodeId);
        if (!existingNode || existingNode.owned <= 0) return;

        const newBalance = balance - cost;
        const newInfrastructure = infrastructure.map(n => {
          if (n.id === nodeId) {
            return {
              ...n,
              marketingLevel: upgradeType === 'marketing' ? (n.marketingLevel ?? 0) + 1 : (n.marketingLevel ?? 0),
              efficiencyLevel: upgradeType === 'efficiency' ? (n.efficiencyLevel ?? 0) + 1 : (n.efficiencyLevel ?? 0),
            };
          }
          return n;
        });

        const newUsers = { ...users };
        newUsers[currentUser.operatorId] = {
          ...newUsers[currentUser.operatorId],
          balance: newBalance,
          infrastructure: newInfrastructure
        };

        set({ balance: newBalance, infrastructure: newInfrastructure, users: newUsers, currentUser: newUsers[currentUser.operatorId] });
      },

      applyCorporateStrategy: (nodeId, strategyId, cost, yieldBoostPercent) => {
        const { balance, infrastructure, currentUser, users } = get();
        if (!currentUser || balance < cost) return;

        const existingNode = infrastructure.find(n => n.id === nodeId);
        if (!existingNode || existingNode.owned <= 0) return;

        const newBalance = balance - cost;
        const newInfrastructure = infrastructure.map(n => {
          if (n.id === nodeId) {
            const currentMult = n.customYieldMultiplier ?? 1.0;
            return {
              ...n,
              customYieldMultiplier: currentMult + (yieldBoostPercent / 100)
            };
          }
          return n;
        });

        const newUsers = { ...users };
        newUsers[currentUser.operatorId] = {
          ...newUsers[currentUser.operatorId],
          balance: newBalance,
          infrastructure: newInfrastructure
        };

        set({ balance: newBalance, infrastructure: newInfrastructure, users: newUsers, currentUser: newUsers[currentUser.operatorId] });
      },

      collectYield: () => {
        const { balance, infrastructure, currentUser, users, savingsDeposited } = get();
        if (!currentUser) return;

        const baseYield = (infrastructure || []).reduce((sum, node) => {
          const mLevel = node.marketingLevel ?? 0;
          const eLevel = node.efficiencyLevel ?? 0;
          const legacyMultiplier = 1 + (mLevel * 0.15) + (eLevel * 0.10);
          const customMultiplier = node.customYieldMultiplier ?? 1.0;
          return sum + ((node.yieldPerSecond ?? 0) * (node.owned ?? 0) * legacyMultiplier * customMultiplier);
        }, 0);

        const savingsInterest = ((savingsDeposited ?? 0) * 0.055) / 60;
        const totalYield = baseYield + savingsInterest;
        
        if (totalYield === 0) return;

        const newBalance = balance + totalYield;
        const newUsers = { ...users };
        newUsers[currentUser.operatorId] = {
          ...newUsers[currentUser.operatorId],
          balance: newBalance
        };

        set({ balance: newBalance, users: newUsers, currentUser: newUsers[currentUser.operatorId] });
      },

      collectPropertyRent: () => {
        const { balance, properties, currentUser, users } = get();
        if (!currentUser) return;

        const rentYield = (properties || []).reduce((sum, prop) => {
          const rLevel = prop.renovationLevel ?? 0;
          const tLevel = prop.tenantQualityLevel ?? 0;
          const mult = (prop.appreciationMultiplier ?? 1.0) * (1 + rLevel * 0.12) * (1 + tLevel * 0.10);
          const activeRenters = prop.rentedCount ?? 0;
          return sum + ((prop.rentPerSecond ?? 0) * activeRenters * mult);
        }, 0);

        if (rentYield === 0) return;

        const newBalance = balance + rentYield;
        const newUsers = { ...users };
        newUsers[currentUser.operatorId] = {
          ...newUsers[currentUser.operatorId],
          balance: newBalance
        };
        set({ balance: newBalance, users: newUsers, currentUser: newUsers[currentUser.operatorId] });
      },

      buyProperty: (propDef) => {
        const { balance, properties, currentUser, users } = get();
        if (!currentUser) return;

        const existing = properties.find(p => p.id === propDef.id);
        const ownedCount = existing?.owned || 0;
        const cost = propDef.purchasePrice * Math.pow(1.4, ownedCount);
        if (balance < cost) return;

        const newBalance = balance - cost;
        let newProperties = [...properties];
        
        if (existing) {
          // Increment owned count only, keeping current rentedCount intact so users manually lease new units.
          newProperties = newProperties.map(p => 
            p.id === propDef.id ? { ...p, owned: p.owned + 1 } : p
          );
        } else {
          // Initial purchase: rentedCount starts at 0 for all properties, especially homes (personal residence)
          newProperties.push({ 
            ...propDef, 
            owned: 1, 
            rentedCount: 0, 
            renovationLevel: 0, 
            tenantQualityLevel: 0, 
            appreciationMultiplier: 1.0, 
            currentValue: propDef.purchasePrice 
          });
        }

        const newUsers = { ...users };
        newUsers[currentUser.operatorId] = { ...newUsers[currentUser.operatorId], balance: newBalance, properties: newProperties };
        set({ balance: newBalance, properties: newProperties, users: newUsers, currentUser: newUsers[currentUser.operatorId] });
      },

      sellProperty: (propertyId) => {
        const { balance, properties, currentUser, users } = get();
        if (!currentUser) return;

        const existing = properties.find(p => p.id === propertyId);
        if (!existing || existing.owned <= 0) return;

        const saleValue = existing.currentValue * (existing.appreciationMultiplier ?? 1.0) * 0.80;
        const newBalance = balance + saleValue;
        const newProperties = properties
          .map(p => {
            if (p.id === propertyId) {
              const nextOwned = p.owned - 1;
              const nextRented = Math.min(p.rentedCount ?? 0, nextOwned);
              return { ...p, owned: nextOwned, rentedCount: nextRented };
            }
            return p;
          })
          .filter(p => p.owned > 0);

        const newUsers = { ...users };
        newUsers[currentUser.operatorId] = { ...newUsers[currentUser.operatorId], balance: newBalance, properties: newProperties };
        set({ balance: newBalance, properties: newProperties, users: newUsers, currentUser: newUsers[currentUser.operatorId] });
      },

      renovateProperty: (propertyId, cost) => {
        const { balance, properties, currentUser, users } = get();
        if (!currentUser || balance < cost) return;

        const newBalance = balance - cost;
        const newProperties = properties.map(p =>
          p.id === propertyId ? { ...p, renovationLevel: (p.renovationLevel ?? 0) + 1, currentValue: p.currentValue * 1.08 } : p
        );

        const newUsers = { ...users };
        newUsers[currentUser.operatorId] = { ...newUsers[currentUser.operatorId], balance: newBalance, properties: newProperties };
        set({ balance: newBalance, properties: newProperties, users: newUsers, currentUser: newUsers[currentUser.operatorId] });
      },

      upgradePropertyTenants: (propertyId, cost) => {
        const { balance, properties, currentUser, users } = get();
        if (!currentUser || balance < cost) return;

        const newBalance = balance - cost;
        const newProperties = properties.map(p =>
          p.id === propertyId ? { ...p, tenantQualityLevel: (p.tenantQualityLevel ?? 0) + 1, appreciationMultiplier: (p.appreciationMultiplier ?? 1.0) + 0.08 } : p
        );

        const newUsers = { ...users };
        newUsers[currentUser.operatorId] = { ...newUsers[currentUser.operatorId], balance: newBalance, properties: newProperties };
        set({ balance: newBalance, properties: newProperties, users: newUsers, currentUser: newUsers[currentUser.operatorId] });
      },

      leaseUnit: (propertyId) => {
        const { properties, currentUser, users } = get();
        if (!currentUser) return;

        const newProperties = properties.map(p => {
          if (p.id === propertyId) {
            const currentRented = p.rentedCount ?? 0;
            // Residential and luxury assets require at least 1 unit reserved for personal residency
            const isHome = p.type === "residential" || p.type === "luxury";
            const maxRentable = isHome ? Math.max(0, p.owned - 1) : p.owned;
            
            const nextRented = Math.min(maxRentable, currentRented + 1);
            return { ...p, rentedCount: nextRented };
          }
          return p;
        });

        const newUsers = { ...users };
        newUsers[currentUser.operatorId] = { ...newUsers[currentUser.operatorId], properties: newProperties };
        set({ properties: newProperties, users: newUsers, currentUser: newUsers[currentUser.operatorId] });
      },

      recallUnit: (propertyId) => {
        const { properties, currentUser, users } = get();
        if (!currentUser) return;

        const newProperties = properties.map(p => {
          if (p.id === propertyId) {
            const currentRented = p.rentedCount ?? 0;
            const nextRented = Math.max(0, currentRented - 1);
            return { ...p, rentedCount: nextRented };
          }
          return p;
        });

        const newUsers = { ...users };
        newUsers[currentUser.operatorId] = { ...newUsers[currentUser.operatorId], properties: newProperties };
        set({ properties: newProperties, users: newUsers, currentUser: newUsers[currentUser.operatorId] });
      },

      updateValuations: (marketAdjustments) => {
        const { properties, currentUser, users } = get();
        if (!currentUser) return;

        const newProperties = properties.map(p => {
          const adj = marketAdjustments[p.id] ?? 0;
          if (adj === 0) return p;
          const nextVal = Math.max(1000, p.currentValue * (1 + adj));
          return { ...p, currentValue: nextVal };
        });

        const newUsers = { ...users };
        newUsers[currentUser.operatorId] = { ...newUsers[currentUser.operatorId], properties: newProperties };
        set({ properties: newProperties, users: newUsers, currentUser: newUsers[currentUser.operatorId] });
      },

      requestPortfolioAudit: async () => {
        const { generatePortfolioAudit } = await import("@/services/aiOracle");
        const audit = await generatePortfolioAudit(get().portfolio);
        
        set((state) => {
          const newUsers = { ...state.users };
          let newCurrentUser = state.currentUser;
          if (state.currentUser) {
            newUsers[state.currentUser.operatorId] = {
              ...newUsers[state.currentUser.operatorId],
              portfolioAudit: audit
            };
            newCurrentUser = newUsers[state.currentUser.operatorId];
          }
          return { portfolioAudit: audit, users: newUsers, currentUser: newCurrentUser };
        });

        // Trigger neural_audit achievement
        get().updateAchievementProgress("neural_audit", 1);
      },

      requestAcademyAudit: async () => {
        const { generateAcademyDirective } = await import("@/services/aiOracle");
        const directive = await generateAcademyDirective(get().learningXP);
        
        set((state) => {
          const newUsers = { ...state.users };
          let newCurrentUser = state.currentUser;
          if (state.currentUser) {
            newUsers[state.currentUser.operatorId] = {
              ...newUsers[state.currentUser.operatorId],
              academyDirectives: directive
            };
            newCurrentUser = newUsers[state.currentUser.operatorId];
          }
          return { academyDirectives: directive, users: newUsers, currentUser: newCurrentUser };
        });

        // Trigger neural_audit achievement
        get().updateAchievementProgress("neural_audit", 1);
      },

      addXP: (amount) => {
        set((state) => {
          const newXP = state.learningXP + amount;
          
          const newUsers = { ...state.users };
          let newCurrentUser = state.currentUser;
          if (state.currentUser) {
            newUsers[state.currentUser.operatorId] = {
              ...newUsers[state.currentUser.operatorId],
              learningXP: newXP
            };
            newCurrentUser = newUsers[state.currentUser.operatorId];
          }
          
          return { learningXP: newXP, users: newUsers, currentUser: newCurrentUser };
        });
        get().updateAchievementProgress("scholar_lvl", get().learningXP);
      },

      completeMission: (missionId, xpReward, impactReward) => {
        set((state) => {
          const newXP = state.learningXP + xpReward;
          const newImpact = state.impactPoints + impactReward;
          
          const newUsers = { ...state.users };
          let newCurrentUser = state.currentUser;
          if (state.currentUser) {
            newUsers[state.currentUser.operatorId] = {
              ...newUsers[state.currentUser.operatorId],
              learningXP: newXP,
              impactPoints: newImpact
            };
            newCurrentUser = newUsers[state.currentUser.operatorId];
          }
          
          return { learningXP: newXP, impactPoints: newImpact, users: newUsers, currentUser: newCurrentUser };
        });
        get().updateAchievementProgress("scholar_lvl", get().learningXP);
      },

      reset: () => set((state) => {
        const newUsers = { ...state.users };
        let newCurrentUser = state.currentUser;
        if (state.currentUser) {
          newUsers[state.currentUser.operatorId] = {
            ...newUsers[state.currentUser.operatorId],
            ...DEFAULT_USER_DATA
          };
          newCurrentUser = newUsers[state.currentUser.operatorId];
        }
        return { 
          ...DEFAULT_USER_DATA,
          activeTab: "dashboard",
          users: newUsers,
          currentUser: newCurrentUser
        };
      }),

      sanitizeState: () => {
        const { balance, currentUser, users, savingsDeposited, activeLoan } = get();
        let needsUpdate = false;
        let cleanBalance = balance;
        let cleanSavings = savingsDeposited ?? 0;
        let cleanLoan = activeLoan ?? null;
        const cleanUsers = { ...users };

        if (balance === null || balance === undefined || isNaN(balance) || balance < 0) {
          cleanBalance = 250000;
          needsUpdate = true;
        }

        if (savingsDeposited === undefined || savingsDeposited === null || isNaN(savingsDeposited)) {
          cleanSavings = 0;
          needsUpdate = true;
        }

        if (currentUser) {
          const user = cleanUsers[currentUser.operatorId];
          if (user) {
            if (user.balance === null || user.balance === undefined || isNaN(user.balance) || user.balance < 0) {
              user.balance = cleanBalance;
              needsUpdate = true;
            }
            if (user.savingsDeposited === undefined || user.savingsDeposited === null || isNaN(user.savingsDeposited)) {
              user.savingsDeposited = cleanSavings;
              needsUpdate = true;
            }
            if (user.activeLoan === undefined) {
              user.activeLoan = null;
              needsUpdate = true;
            }
            if (!user.infrastructure || !Array.isArray(user.infrastructure)) {
              user.infrastructure = [];
              needsUpdate = true;
            } else {
              user.infrastructure.forEach(n => {
                if (n.marketingLevel === undefined || isNaN(n.marketingLevel)) { n.marketingLevel = 0; needsUpdate = true; }
                if (n.efficiencyLevel === undefined || isNaN(n.efficiencyLevel)) { n.efficiencyLevel = 0; needsUpdate = true; }
                if (n.owned === undefined || isNaN(n.owned)) { n.owned = 0; needsUpdate = true; }
                
                // Align yieldPerSecond and other base stats with official AVAILABLE_NODES definitions
                const officialDef = AVAILABLE_NODES.find(o => o.id === n.id);
                if (officialDef) {
                  if (n.yieldPerSecond !== officialDef.yieldPerSecond) {
                    n.yieldPerSecond = officialDef.yieldPerSecond;
                    needsUpdate = true;
                  }
                  if (n.cost !== officialDef.cost) {
                    n.cost = officialDef.cost;
                    needsUpdate = true;
                  }
                  if (n.name !== officialDef.name) {
                    n.name = officialDef.name;
                    needsUpdate = true;
                  }
                }
              });
            }
            if (!user.properties || !Array.isArray(user.properties)) {
              user.properties = [];
              needsUpdate = true;
            } else {
              user.properties.forEach(p => {
                if (p.renovationLevel === undefined || isNaN(p.renovationLevel)) { p.renovationLevel = 0; needsUpdate = true; }
                if (p.tenantQualityLevel === undefined || isNaN(p.tenantQualityLevel)) { p.tenantQualityLevel = 0; needsUpdate = true; }
                if (p.owned === undefined || isNaN(p.owned)) { p.owned = 0; needsUpdate = true; }
                if (p.rentedCount === undefined || isNaN(p.rentedCount)) { p.rentedCount = p.owned; needsUpdate = true; }
                if (p.category === undefined) { p.category = p.id.startsWith("prop_") ? "property" : "lifestyle"; needsUpdate = true; }
              });
            }
            if (!user.achievements || !Array.isArray(user.achievements)) {
              user.achievements = INITIAL_ACHIEVEMENTS;
              needsUpdate = true;
            }
          }
        }

        if (needsUpdate) {
          const cleanInfrastructure = currentUser && cleanUsers[currentUser.operatorId]
            ? cleanUsers[currentUser.operatorId].infrastructure
            : get().infrastructure;

          const cleanAchievements = currentUser && cleanUsers[currentUser.operatorId]
            ? cleanUsers[currentUser.operatorId].achievements
            : get().achievements;

          set({
            balance: cleanBalance,
            savingsDeposited: cleanSavings,
            activeLoan: cleanLoan,
            infrastructure: cleanInfrastructure,
            achievements: cleanAchievements || INITIAL_ACHIEVEMENTS,
            users: cleanUsers,
            currentUser: currentUser ? cleanUsers[currentUser.operatorId] : null
          });
        }
      },

      depositSavings: (amount) => {
        const { balance, savingsDeposited, currentUser, users } = get();
        if (!currentUser || balance < amount) return;

        const newBalance = balance - amount;
        const newSavings = (savingsDeposited ?? 0) + amount;

        const newUsers = { ...users };
        newUsers[currentUser.operatorId] = {
          ...newUsers[currentUser.operatorId],
          balance: newBalance,
          savingsDeposited: newSavings
        };

        set({ balance: newBalance, savingsDeposited: newSavings, users: newUsers, currentUser: newUsers[currentUser.operatorId] });

        // Trigger achievements
        get().updateAchievementProgress("savings_master", newSavings);
      },

      withdrawSavings: (amount) => {
        const { balance, savingsDeposited, currentUser, users } = get();
        if (!currentUser || (savingsDeposited ?? 0) < amount) return;

        const newBalance = balance + amount;
        const newSavings = (savingsDeposited ?? 0) - amount;

        const newUsers = { ...users };
        newUsers[currentUser.operatorId] = {
          ...newUsers[currentUser.operatorId],
          balance: newBalance,
          savingsDeposited: newSavings
        };

        set({ balance: newBalance, savingsDeposited: newSavings, users: newUsers, currentUser: newUsers[currentUser.operatorId] });
      },

      applyForLoan: (amount, term, apr, verdict, purpose) => {
        const { balance, currentUser, users } = get();
        if (!currentUser) return;

        const totalDue = amount * (1 + apr / 100);
        const newBalance = balance + amount;
        const newLoan = {
          principal: amount,
          interestRate: apr,
          totalDue,
          timeLeft: term * 120,
          purpose
        };

        const newUsers = { ...users };
        newUsers[currentUser.operatorId] = {
          ...newUsers[currentUser.operatorId],
          balance: newBalance,
          activeLoan: newLoan
        };

        set({ balance: newBalance, activeLoan: newLoan, users: newUsers, currentUser: newUsers[currentUser.operatorId] });
      },

      repayLoan: () => {
        const { balance, activeLoan, currentUser, users } = get();
        if (!currentUser || !activeLoan || balance < activeLoan.totalDue) return;

        const newBalance = balance - activeLoan.totalDue;

        const newUsers = { ...users };
        newUsers[currentUser.operatorId] = {
          ...newUsers[currentUser.operatorId],
          balance: newBalance,
          activeLoan: null
        };

        set({ balance: newBalance, activeLoan: null, users: newUsers, currentUser: newUsers[currentUser.operatorId] });
      },

      tickLoanTimer: () => {
        const { activeLoan, balance, currentUser, users } = get();
        if (!currentUser || !activeLoan) return;

        if (activeLoan.timeLeft <= 1) {
          // Solvency breach! Force liquidation penalty
          const penaltyFee = activeLoan.totalDue * 0.10; // 10% penalty
          const newBalance = balance - activeLoan.totalDue - penaltyFee;

          const newUsers = { ...users };
          newUsers[currentUser.operatorId] = {
            ...newUsers[currentUser.operatorId],
            balance: newBalance,
            activeLoan: null
          };

          set({ balance: newBalance, activeLoan: null, users: newUsers, currentUser: newUsers[currentUser.operatorId] });
        } else {
          // Tick timer down by 1 Fiscal Day
          const newLoan = {
            ...activeLoan,
            timeLeft: activeLoan.timeLeft - 1
          };

          const newUsers = { ...users };
          newUsers[currentUser.operatorId] = {
            ...newUsers[currentUser.operatorId],
            activeLoan: newLoan
          };

          set({ activeLoan: newLoan, users: newUsers, currentUser: newUsers[currentUser.operatorId] });
        }
      },

      tickFiscalTime: () => {
        const { fiscalDays, currentUser, users } = get();
        if (!currentUser) return;

        const nextDays = fiscalDays + (1 / 120);

        const newUsers = { ...users };
        newUsers[currentUser.operatorId] = {
          ...newUsers[currentUser.operatorId],
          fiscalDays: nextDays
        };

        set({ fiscalDays: nextDays, users: newUsers, currentUser: newUsers[currentUser.operatorId] });
      },
    }),
    { name: "vantage-v15-multiflow" }
  )
);

// --- TWO-WAY LOCAL DATABASE (DB.JSON) SYNCHRONIZATION PIPELINE ---
if (typeof window !== "undefined") {
  let isHydrated = false;

  // 1. Central Hydration Fetch on App Boot
  fetch("/api/vantage-sync")
    .then((res) => res.json())
    .then((data) => {
      if (data && data.users) {
        console.log("[VANTAGE DB] Hydrating and merging Zustand store from db.json:", data);
        
        const state = useVantageStore.getState();
        const mergedUsers = { ...state.users, ...data.users };
        
        if (state.isAuthenticated && state.currentUser) {
          const operatorId = state.currentUser.operatorId;
          const dbUser = mergedUsers[operatorId];
          if (dbUser) {
            console.log("[VANTAGE DB] Found active local user in DB, updating session details for operatorId:", operatorId);
            
            // --- IDLE / OFFLINE INCOME ENGINE ---
            if (dbUser.lastSavedTimestamp && dbUser.lastSavedTimestamp > 0) {
              const elapsedSeconds = Math.floor((Date.now() - dbUser.lastSavedTimestamp) / 1000);
              if (elapsedSeconds > 5) { // Only award if away for more than 5 seconds
                console.log(`[VANTAGE OFFLINE] Operator was offline for ${elapsedSeconds} seconds.`);
                
                // 1. Calculate SaaS & Business nodes passive yield
                const baseYield = (dbUser.infrastructure || []).reduce((sum: number, node: any) => {
                  const mLevel = node.marketingLevel ?? 0;
                  const eLevel = node.efficiencyLevel ?? 0;
                  const legacyMultiplier = 1 + (mLevel * 0.15) + (eLevel * 0.10);
                  const customMultiplier = node.customYieldMultiplier ?? 1.0;
                  return sum + ((node.yieldPerSecond ?? 0) * (node.owned ?? 0) * legacyMultiplier * customMultiplier);
                }, 0);

                // 2. Calculate savings APY interest
                const savingsInterest = ((dbUser.savingsDeposited ?? 0) * 0.055) / 60;

                // 3. Calculate leased real estate passive rent
                const rentYield = (dbUser.properties || []).reduce((sum: number, prop: any) => {
                  const rLevel = prop.renovationLevel ?? 0;
                  const tLevel = prop.tenantQualityLevel ?? 0;
                  const mult = (prop.appreciationMultiplier ?? 1.0) * (1 + rLevel * 0.12) * (1 + tLevel * 0.10);
                  const activeRenters = prop.rentedCount ?? 0;
                  return sum + ((prop.rentPerSecond ?? 0) * activeRenters * mult);
                }, 0);

                const totalYieldPerSecond = baseYield + savingsInterest + rentYield;
                const totalOfflineEarnings = totalYieldPerSecond * elapsedSeconds;

                // Update database user session data
                if (totalOfflineEarnings > 0) {
                  dbUser.balance = (dbUser.balance ?? 0) + totalOfflineEarnings;
                  const tgEarningsMsg = `💰 ДАРОМАДИ ҒАЙРИФАЪОЛ: Шумо пас аз ${elapsedSeconds} сония баргаштед ва ба маблағи $${Math.floor(totalOfflineEarnings).toLocaleString()} даромади ғайрифаъол ба даст овардед!`;
                  if (typeof window !== "undefined") {
                    localStorage.setItem("vantage_offline_earnings_msg", tgEarningsMsg);
                  }
                }

                // 4. Tick Fiscal Days elapsed
                dbUser.fiscalDays = (dbUser.fiscalDays ?? 1) + (elapsedSeconds / 120);

                // 5. Tick Active Loan Time limits
                if (dbUser.activeLoan) {
                  const remainingTime = dbUser.activeLoan.timeLeft - elapsedSeconds;
                  if (remainingTime <= 0) {
                    const penaltyFee = dbUser.activeLoan.totalDue * 0.10;
                    dbUser.balance = Math.max(0, (dbUser.balance ?? 0) - dbUser.activeLoan.totalDue - penaltyFee);
                    dbUser.activeLoan = null;
                    if (typeof window !== "undefined") {
                      localStorage.setItem("vantage_offline_loan_breach", "🚨 ОГОҲИИ ҚАРЗ: Мӯҳлати пардохти қарзи фаъоли шумо дар давраи набуданатон ба охир расид ва тавозунатон якҷоя бо 10% ҷаримаи иҷборӣ ситонида шуд!");
                    }
                  } else {
                    dbUser.activeLoan.timeLeft = remainingTime;
                  }
                }
              }
            }

            useVantageStore.setState({
              users: mergedUsers,
              currentUser: dbUser,
              balance: typeof dbUser.balance === 'number' ? dbUser.balance : state.balance,
              portfolio: Array.isArray(dbUser.portfolio) ? dbUser.portfolio : state.portfolio,
              learningXP: typeof dbUser.learningXP === 'number' ? dbUser.learningXP : state.learningXP,
              impactPoints: typeof dbUser.impactPoints === 'number' ? dbUser.impactPoints : state.impactPoints,
              portfolioAudit: typeof dbUser.portfolioAudit === 'string' ? dbUser.portfolioAudit : state.portfolioAudit,
              academyDirectives: typeof dbUser.academyDirectives === 'string' ? dbUser.academyDirectives : state.academyDirectives,
              infrastructure: Array.isArray(dbUser.infrastructure) ? dbUser.infrastructure : (state.infrastructure || []),
              savingsDeposited: typeof dbUser.savingsDeposited === 'number' ? dbUser.savingsDeposited : state.savingsDeposited,
              activeLoan: dbUser.activeLoan !== undefined ? dbUser.activeLoan : state.activeLoan,
              properties: Array.isArray(dbUser.properties) ? dbUser.properties : state.properties,
              fiscalDays: typeof dbUser.fiscalDays === 'number' ? dbUser.fiscalDays : state.fiscalDays,
              achievements: Array.isArray(dbUser.achievements) ? dbUser.achievements : state.achievements,
              lastSavedTimestamp: dbUser.lastSavedTimestamp ?? 0
            });
          } else {
            console.log("[VANTAGE DB] Active user not found in DB users dictionary. Hydrating merged users.");
            useVantageStore.setState({ users: mergedUsers });
          }
        } else {
          console.log("[VANTAGE DB] No active local user. Hydrating merged users database.");
          useVantageStore.setState({ users: mergedUsers });
        }
      }
      isHydrated = true;
    })
    .catch((err) => {
      console.error("[VANTAGE DB] Initial database fetch failed:", err);
      isHydrated = true; // Fail-safe: enable saving anyway
    });

  // 2. Real-Time Background Autosave Sync on State Change
  useVantageStore.subscribe((state) => {
    if (!isHydrated) return;

    // Inject timestamp in users copy
    const usersCopy = { ...state.users };
    const now = Date.now();
    if (state.currentUser && usersCopy[state.currentUser.operatorId]) {
      usersCopy[state.currentUser.operatorId] = {
        ...usersCopy[state.currentUser.operatorId],
        lastSavedTimestamp: now
      };
    }

    fetch("/api/vantage-sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        users: usersCopy,
        currentUser: state.currentUser ? { ...state.currentUser, lastSavedTimestamp: now } : null,
        isAuthenticated: state.isAuthenticated,
        balance: state.balance,
        portfolio: state.portfolio,
        learningXP: state.learningXP,
        impactPoints: state.impactPoints,
        portfolioAudit: state.portfolioAudit,
        academyDirectives: state.academyDirectives,
        infrastructure: state.infrastructure,
        savingsDeposited: state.savingsDeposited,
        activeLoan: state.activeLoan,
        properties: state.properties,
        fiscalDays: state.fiscalDays,
        achievements: state.achievements,
        lastSavedTimestamp: now
      })
    }).catch((err) => console.error("[VANTAGE DB] Autosave failed:", err));
  });
}

