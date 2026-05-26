"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useVantageStore, PropertyAsset } from "@/store/useVantageStore";
import { MonolithCard } from "./SovereignUI";
import { 
  Home, Building2, Landmark, Factory, ShieldAlert,
  ArrowUpRight, ArrowLeft, Award, Sparkles, UserCheck,
  ArrowDownRight, BarChart3, Terminal as TermIcon, LineChart,
  Brain, Clock, ShieldCheck, Gem, Car, Navigation, Plane, Anchor,
  Coins, Info, ArrowUp, ArrowDown, ChevronRight, Search, SlidersHorizontal,
  ChevronLeft, ArrowUpDown
} from "lucide-react";

interface EducationalAsset {
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

const AVAILABLE_ASSETS: EducationalAsset[] = [
  // PROPERTIES (Category: property) - 8 Diverse Options
  {
    id: "prop_res_1",
    name: "Капсулаи Ҳамзистии Нео-Токио",
    type: "residential",
    category: "property",
    location: "Бахши 7 - Ноҳияи Синдзюку",
    purchasePrice: 65000,
    rentPerSecond: 30,
    description: "Капсулаҳои хурди автономӣ ба технологҳои суръатбахш ба иҷора дода мешаванд.",
    equityRatio: "85/15 LTV",
    risk: "Low",
    educationalTakeaway: "Микро-квартираҳо бо ҳаҷми калон ва CapEx-и камтар кор мекунанд ва гардиши пулии ғайрифаъоли устувор меоранд.",
    realWorldMetric: "Ҳадафи Даромад: 7.2%",
    strategyDocs: "Нишондиҳандаҳои устувори истиқоматии ҳамзистӣ. Навсозӣ қобилияти иҷораро +12% дар як сатҳ зиёд мекунад."
  },
  {
    id: "prop_res_2",
    name: "Идораи Марказии Агентии Метаверс",
    type: "commercial",
    category: "property",
    location: "Плазаи Марказии Десентраленд",
    purchasePrice: 150000,
    rentPerSecond: 85,
    description: "Нуқтаҳои тиҷоратии голографӣ, ки ба агентиҳои маркетинги рақамӣ иҷора дода мешаванд.",
    equityRatio: "Бе Ливерҷ",
    risk: "High",
    educationalTakeaway: "Амволи ғайриманқули маҷозӣ аз хароҷоти фарсудашавии ҷисмонӣ канорагирӣ мекунад, аммо ноустувории шадид ва вобастагии платформаро нишон медиҳад.",
    realWorldMetric: "Даромади Трафик: 9.8%",
    strategyDocs: "Ҷойҳои тиҷоратии маҷозӣ бо тамоюли шохиси корбарони фаъоли метаверс васеъ мешаванд."
  },
  {
    id: "prop_res_3",
    name: "Шалеи Ақли Алпии Сюрих",
    type: "luxury",
    category: "property",
    location: "Қуллаи Истиқоматӣ - Қаторкӯҳҳои Алп",
    purchasePrice: 240000,
    rentPerSecond: 130,
    description: "Шалеҳои муосири дорои гармидиҳии офтобӣ, насосҳои геотермалӣ ва истироҳатгоҳҳои алпӣ.",
    equityRatio: "75/25 LTV",
    risk: "Medium",
    educationalTakeaway: "Амлокҳои алпӣ ҳамчун чархи дугонаи муҳофизат аз таваррум амал мекунанд. Ҷойҳои сайёҳии хушманзара боиси бандшавии баланди кӯтоҳмӯҳлат мегарданд.",
    realWorldMetric: "Иловаи Сайёҳӣ: +15%",
    strategyDocs: "Истиқоматии боҳашамати элитӣ. Интихоби дурусти иҷорагир арзиши асосии дороӣ ва суръати афзоиши онро зиёд мекунад."
  },
  {
    id: "prop_com_1",
    name: "Бурҷи Кремнии Веб3 Соҳибихтиёр",
    type: "commercial",
    category: "property",
    location: "Блоки Кремнии Манҳеттен",
    purchasePrice: 480000,
    rentPerSecond: 320,
    description: "Бурҷи баландошёнаи идоравии корпоративӣ, ки ба конгломератҳои FinTech иҷора дода мешавад.",
    equityRatio: "70/30 LTV",
    risk: "Medium",
    educationalTakeaway: "Иҷораи тиҷоратии Triple-Net (NNN) андоз, суғурта ва хароҷоти нигоҳдории амволро пурра ба дӯши иҷорагир мегузорад.",
    realWorldMetric: "Шохиси Бандшавӣ: 94%",
    strategyDocs: "Таъмини иҷорагирони устувори институтсионалӣ гардиши пулиро мустақиман аз таназзулҳои минтақавӣ муҳофизат мекунад."
  },
  {
    id: "prop_ind_2",
    name: "Мега-Гиреҳи Геотермалии Сюрих",
    type: "industrial",
    category: "property",
    location: "Ҳастаи Биотехнологии Сюрих",
    purchasePrice: 950000,
    rentPerSecond: 680,
    description: "Маркази саноатии геотермалии чуқур, ки энергияро ба лабораторияҳои минтақавӣ интиқол медиҳад.",
    equityRatio: "60/40 Utility",
    risk: "Low",
    educationalTakeaway: "Амволи ғайриманқули саноатии коммуналӣ аз сабаби шартномаҳои дарозмуддати давлатӣ эътимоднокии бениҳоят баланди иҷораро таъмин мекунад.",
    realWorldMetric: "Даромади Энергетикӣ: 8.9%",
    strategyDocs: "Гиреҳи муҳими инфрасохтори саноатӣ. Баланд бардоштани самаранокии турбина хароҷоти нигоҳдории амалиётиро кам мекунад."
  },
  {
    id: "prop_lux_1",
    name: "Кибер-Вилла 'Монолит'",
    type: "luxury",
    category: "property",
    location: "Баландиҳои Элитии Монако",
    purchasePrice: 1800000,
    rentPerSecond: 1400,
    description: "Қалъаи боҳашамати соҳили уқёнус бо услуби меъмории консервативии обсидиан ва шишаи титанӣ.",
    equityRatio: "50/50 LTV",
    risk: "High",
    educationalTakeaway: "Амлокҳои супер-люкс ба тағйироти шадиди нарх дучор мешаванд, ки афзоиши босуръат ва аммо бозори маҳдуди фурӯшро нишон медиҳанд.",
    realWorldMetric: "Арзёбии Солона: +16.8%",
    strategyDocs: "Баландтарин синфи нуфуз. Истифодаи ин виллаи боҳашамат барои эҳтиёҷоти шахсӣ нишондиҳандаҳои нуфузро зуд афзоиш медиҳад."
  },
  {
    id: "prop_lux_2",
    name: "Пентҳауси Стратосфераи Аэтер",
    type: "luxury",
    category: "property",
    location: "Орбитаи Баландии 350км",
    purchasePrice: 3800000,
    rentPerSecond: 3100,
    description: "Амлоки олии кайҳонӣ бо сипарҳои зидди микро-метеоритҳо ва хобгоҳҳои аз ҷозиба изолятсияшуда.",
    equityRatio: "40/60 Speculative",
    risk: "High",
    educationalTakeaway: "Дороиҳои шадиди спекулятивӣ ноустуворанд ва дар асоси дастрасии истисноӣ ва роҳҳои маҳдуди орбиталӣ сохта мешаванд.",
    realWorldMetric: "Дастрасии Премиум: 100%",
    strategyDocs: "Дороиҳои орбитавии технологӣ. Навсозиҳои пешрафта боиси ба даст овардани резидентҳои сатҳи баланди байналмилалӣ мешаванд."
  },
  {
    id: "prop_ind_1",
    name: "Гипер-Шабакаи Логистикии Сингулярият",
    type: "industrial",
    category: "property",
    location: "Соҳили Автономии Уқёнуси Ором",
    purchasePrice: 7500000,
    rentPerSecond: 6800,
    description: "Гипер-шабакаи саноатии логистикӣ бо хатҳои фуруд омадани дронҳои вазнини боркаш.",
    equityRatio: "65/35 NNN",
    risk: "Low",
    educationalTakeaway: "Инфрасохтори логистикӣ таҳкурсии вазнини тиҷорати ҷисмонӣ буда, устувории бениҳоят баланди иҷорагиронро ба муддати дароз кафолат медиҳад.",
    realWorldMetric: "Меъёри Кап: 9.1%",
    strategyDocs: "Гардиши пулии устувор аз иҷораи саноатии вазнин. Танзими дурусти бандарҳои дронҳо давраи холигии амволро кам мекунад."
  },

  // GARAGE & VEHICLES (Category: lifestyle) - 8 Diverse Options
  {
    id: "car_bike_1",
    name: "Супербайки Аэон V-2",
    type: "supercar",
    category: "lifestyle",
    location: "Гаражи Шабакаи Синдзюку",
    purchasePrice: 18000,
    rentPerSecond: 10,
    description: "Супербайки пойгавии барқӣ барои транзити босуръат дар кӯчаҳои метрополитен оптимизатсия шудааст.",
    equityRatio: "Бо пули нақд",
    risk: "Low",
    educationalTakeaway: "Супербайкҳои камхарҷ дороиҳои сатҳи ибтидоии пардохтпазиранд, ки даромади фаврии иҷораи кӯтоҳмӯҳлатро таъмин мекунанд.",
    realWorldMetric: "Меъёри Бандшавӣ: 92%",
    strategyDocs: "Дороиҳои нақлиётии шабакавии чолок. Танзими ҳуҷайраҳои барқӣ меъёри фармоишро +12% баланд мебардорад."
  },
  {
    id: "car_super_1",
    name: "Кибер-Крузери Модели GT",
    type: "supercar",
    category: "lifestyle",
    location: "Ангари Шахсии Обсидиан",
    purchasePrice: 38000,
    rentPerSecond: 20,
    description: "Купеи варзишии аэродинамикӣ барои шабакаҳои муштараки ҳамсол ба ҳамсол (P2P) оптимизатсия шудааст.",
    equityRatio: "Маблағгузорӣ шудааст",
    risk: "Low",
    educationalTakeaway: "Нақлиёти шахсӣ зуд фарсуда мешавад. Интиқоли суперкарҳо ба ҳалқаҳои иҷораи премиум ин ӯҳдадориро ба гардиши фаъоли пулӣ табдил медиҳад.",
    realWorldMetric: "Истифодабарӣ: 88%",
    strategyDocs: "Дороиҳои флоти иҷораи суперкарҳо. Муҳаррикҳои такмилёфта даромади иҷораро дар як сатҳ +12% зиёд мекунанд."
  },
  {
    id: "car_super_2",
    name: "Гипер-SUV-и Барқии Хронос",
    type: "supercar",
    category: "lifestyle",
    location: "Маркази Транзити Женева",
    purchasePrice: 72000,
    rentPerSecond: 45,
    description: "SUV-и боҳашамати зиреҳпӯш, ки бо матритсаҳои батареяи муосири сахт кор мекунад.",
    equityRatio: "Хариди мустақим",
    risk: "Low",
    educationalTakeaway: "Нақлиёти дараҷаи премиум ҳамчун дороиҳои дорои самаранокии баланд амал карда, аз роҳбарони корпоративӣ дар рафти конфронсҳои ҷаҳонӣ даромади устувор меорад.",
    realWorldMetric: "Иҷораи Корпоративӣ: $950/рӯз",
    strategyDocs: "Транзити боҳашамати вазнин. Такмилдиҳӣ нишондиҳандаҳои меҳмоннавозӣ ва устувории иҷораро беҳтар мекунад."
  },
  {
    id: "car_hyper_1",
    name: "Вантаж SV-9 Апекс Родстер",
    type: "hypercar",
    category: "lifestyle",
    location: "Гаражи Маъмурии Соҳибихтиёр",
    purchasePrice: 150000,
    rentPerSecond: 100,
    description: "Гиперкари баландсифат бо корпуси карбон-монокок ва системаи муҳаррики барқии зерсониявӣ.",
    equityRatio: "Иҷораи Нуфузӣ",
    risk: "Medium",
    educationalTakeaway: "Гиперкарҳои маҳдуд бо гузашти вақт арзиши худро зиёд мекунанд, агар тоза нигоҳ дошта шаванд, ва нуфузи олиро барои робитаҳои тиҷоратӣ таъмин месозанд.",
    realWorldMetric: "Даромади Нуфузӣ: +15%",
    strategyDocs: "Гиперкарҳои элитаи маъмурӣ намояндаи авҷи муҳандисии муосир мебошанд. Истифодаи шахсӣ афзоиши XP-и академияро суръат мебахшад."
  },
  {
    id: "car_hyper_2",
    name: "Аэтер-GT Фантом Родстер",
    type: "hypercar",
    category: "lifestyle",
    location: "Порти Скайлайни Сюрих",
    purchasePrice: 320000,
    rentPerSecond: 230,
    description: "Гиперкари консептуалии аэродинамикӣ бо плитаҳои хӯлаи композитӣ ва матритсаи парвози зерсониявӣ.",
    equityRatio: "Маблағгузорӣ шудааст",
    risk: "High",
    educationalTakeaway: "Гиперкарҳои консептуалии аэродинамикӣ ба фарсудашавии вазнин дучор мешаванд, аммо дар шабакаҳои транзити роҳбарикунанда маржаи баланди иҷораро таъмин мекунанд.",
    realWorldMetric: "Шохиси Иҷора: $3.2k/рӯз",
    strategyDocs: "Гиперкарҳои парвозкунандаи кайҳонӣ. Такмил додани нишондиҳандаҳои техникӣ маржаи шартномаҳои корпоративиро зиёд мекунад."
  },
  {
    id: "car_yacht_1",
    name: "Супер-Яхтаи Соҳибихтиёр Апекс-6",
    type: "yacht",
    category: "lifestyle",
    location: "Маринаи Элитии Монако",
    purchasePrice: 950000,
    rentPerSecond: 650,
    description: "Яхтаи боҳашамати интеллектуалӣ бо палубаҳои композитии чӯб ва ҳуҷайраҳои гидрогенӣ.",
    equityRatio: "Муштараки Синдикатӣ",
    risk: "High",
    educationalTakeaway: "Яхтаҳо хароҷоти зиёди нигоҳдорӣ (CapEx) доранд. Платформаҳои муштараки синдикатӣ ҳафтаҳои чартериро барои пурра пӯшонидани хароҷот оптимизатсия мекунанд.",
    realWorldMetric: "Фармоиши Чартер: $42k/ҳафта",
    strategyDocs: "Иҷораи яхтаҳои боҳашамати автономӣ. Танзими сифати хидматрасонӣ шартномаҳои чартерии гаронбаҳоро таъмин мекунад."
  },
  {
    id: "car_jet_1",
    name: "Тайёраи Шахсии Аэон Стратосфера",
    type: "jet",
    category: "lifestyle",
    location: "Порти Авиатсияи Аэтер",
    purchasePrice: 4200000,
    rentPerSecond: 3600,
    description: "Ҷети тиҷоратии зер-орбиталӣ бо авионикаи интеллектуалӣ барои парвозҳои фаврии ҷаҳонӣ.",
    equityRatio: "Иштироки Фраксионӣ",
    risk: "High",
    educationalTakeaway: "Тайёраҳои шахсӣ авҷи ливерҷи дороиҳои тарзи ҳаётро намояндагӣ мекунанд ва ӯҳдадориҳои гаронарзишро ба дороиҳои чартерии корпоративӣ табдил медиҳанд.",
    realWorldMetric: "Даромади Аэро: 11.5%",
    strategyDocs: "Флотҳои ҷетҳои тиҷоратии шахсӣ. Шартномаҳои дарозмуддати корпоративӣ афзоиши арзиши сармояро мустаҳкам мекунанд."
  },
  {
    id: "car_jet_2",
    name: "Киштии Кайҳонии Орбитал Иклипс",
    type: "jet",
    category: "lifestyle",
    location: "Пойгоҳи Парвози Аэрокосмосӣ",
    purchasePrice: 11500000,
    rentPerSecond: 11200,
    description: "Ракетаи тиҷоратии орбиталӣ барои саёҳати босуръат байни нимкураҳои замин тарҳрезӣ шудааст.",
    equityRatio: "Иҷораи Синдикатӣ",
    risk: "High",
    educationalTakeaway: "Дороиҳои ракетавии аэрокосмосӣ хароҷоти баландтарини харидро талаб мекунанд, аммо қудрати бесобиқаи нархгузории чартериро таъмин месозанд.",
    realWorldMetric: "Даромади Ракета: 12.8%",
    strategyDocs: "Киштиҳои кайҳонии саёҳати зер-орбиталӣ. Такмилдиҳии сипарҳои гармидиҳӣ хароҷоти фарсудашавии механикиро кам мекунад."
  }
];

const ICONS = {
  residential: Home,
  commercial: Building2,
  luxury: Gem,
  industrial: Factory,
  supercar: Car,
  hypercar: Car,
  yacht: Anchor,
  jet: Plane,
};

const RISK_COLORS = {
  Low: "text-[#F0B90B] bg-[#F0B90B]/10 border-[#F0B90B]/20",
  Medium: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  High: "text-red-400 bg-red-500/10 border-red-500/20",
};

export function RealEstateView() {
  const { balance, properties, buyProperty, sellProperty, renovateProperty, upgradePropertyTenants, leaseUnit, recallUnit, updateValuations } = useVantageStore();
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<"property" | "lifestyle">("property");
  
  // Real-time market index & inflation adjustments
  const [inflationTicker, setInflationTicker] = useState<string>("Маркази бозор устувор аст. Мониторинги бахшҳои амволи минтақавӣ...");
  const [localIndexTrends, setLocalIndexTrends] = useState<Record<string, number>>({});

  // 📝 PAGINATION & FILTERS STATE
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [subTypeFilter, setSubTypeFilter] = useState<string>("all");
  const [ownershipFilter, setOwnershipFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("price-asc");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 4;

  // Dynamic Valuation Inflation Loop
  useEffect(() => {
    const updateInterval = setInterval(() => {
      const adjustments: Record<string, number> = {};
      const newTrends: Record<string, number> = {};

      AVAILABLE_ASSETS.forEach(asset => {
        const baseMin = asset.category === "property" ? -0.008 : -0.015;
        const baseMax = asset.category === "property" ? 0.024 : 0.018;
        const fluctuation = Number((Math.random() * (baseMax - baseMin) + baseMin).toFixed(4));
        
        adjustments[asset.id] = fluctuation;
        newTrends[asset.id] = fluctuation * 100;
      });

      const highlights = AVAILABLE_ASSETS.map(a => {
        const trend = newTrends[a.id] ?? 0;
        const arrow = trend >= 0 ? "▲" : "▼";
        const sign = trend >= 0 ? "+" : "";
        return `${a.name} (${a.location}) арзиш ${trend >= 0 ? 'баланд шуд' : 'танзим шуд'} ба андозаи ${sign}${trend.toFixed(1)}% ${arrow}`;
      });

      const randomHighlight = highlights[Math.floor(Math.random() * highlights.length)];
      setInflationTicker(`МОНИТОРИНГИ ТАВАРРУМ: ${randomHighlight}`);
      setLocalIndexTrends(newTrends);

      updateValuations(adjustments);
    }, 8000);

    return () => clearInterval(updateInterval);
  }, [updateValuations]);

  // Find selected definition and owned state
  const selectedDef = useMemo(() => {
    return AVAILABLE_ASSETS.find(a => a.id === selectedAssetId);
  }, [selectedAssetId]);

  const selectedOwned = useMemo(() => {
    return properties.find(p => p.id === selectedAssetId) || {
      id: selectedAssetId || "",
      name: "",
      type: "residential",
      category: "property",
      location: "",
      purchasePrice: 0,
      currentValue: 0,
      rentPerSecond: 0,
      owned: 0,
      renovationLevel: 0,
      tenantQualityLevel: 0,
      appreciationMultiplier: 1.0,
      rentedCount: 0
    } as PropertyAsset;
  }, [properties, selectedAssetId]);

  // Calculations for Prestige and Rent Yields
  const prestigeScore = useMemo(() => {
    return (properties || []).reduce((score, asset) => {
      const personalCount = (asset.owned ?? 0) - (asset.rentedCount ?? 0);
      if (personalCount <= 0) return score;
      const baseBoost = asset.category === "property" ? 15 : 25;
      return score + (baseBoost * personalCount);
    }, 0);
  }, [properties]);

  const totalRent = useMemo(() => {
    return (properties || []).reduce((sum, prop) => {
      const rLevel = prop.renovationLevel ?? 0;
      const tLevel = prop.tenantQualityLevel ?? 0;
      const mult = (prop.appreciationMultiplier ?? 1.0) * (1 + rLevel * 0.12) * (1 + tLevel * 0.10);
      const activeRenters = prop.rentedCount ?? 0;
      return sum + ((prop.rentPerSecond ?? 0) * activeRenters * mult);
    }, 0);
  }, [properties]);

  // Detailed view calculations
  const currentCost = selectedDef ? selectedDef.purchasePrice * Math.pow(1.4, selectedOwned.owned ?? 0) : 0;
  const sellValue = selectedDef ? (selectedOwned.currentValue * (selectedOwned.appreciationMultiplier ?? 1.0) * 0.80) : 0;

  const currentRentMultiplier = (1 + ((selectedOwned.renovationLevel ?? 0) * 0.12) + ((selectedOwned.tenantQualityLevel ?? 0) * 0.10)) * (selectedOwned.appreciationMultiplier ?? 1.0);
  const currentSingleRent = selectedDef ? selectedDef.rentPerSecond * currentRentMultiplier : 0;

  const upgradeRenovationCost = selectedDef ? selectedDef.purchasePrice * 0.25 * Math.pow(1.5, selectedOwned.renovationLevel ?? 0) : 0;
  const upgradeTenantCost = selectedDef ? selectedDef.purchasePrice * 0.30 * Math.pow(1.6, selectedOwned.tenantQualityLevel ?? 0) : 0;

  // 📝 FILTER & SORT & SEARCH LOGIC
  const filteredAndSortedAssets = useMemo(() => {
    let result = AVAILABLE_ASSETS.filter(a => a.category === activeCategory);

    // 1. Search Query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      result = result.filter(a => 
        a.name.toLowerCase().includes(query) || 
        a.location.toLowerCase().includes(query) ||
        a.description.toLowerCase().includes(query)
      );
    }

    // 2. Sub-Type Filter
    if (subTypeFilter !== "all") {
      result = result.filter(a => a.type === subTypeFilter);
    }

    // 3. Ownership Filter
    if (ownershipFilter !== "all") {
      result = result.filter(a => {
        const ownedState = properties.find(p => p.id === a.id);
        const owned = ownedState?.owned || 0;
        if (ownershipFilter === "owned") return owned > 0;
        if (ownershipFilter === "leased") return (ownedState?.rentedCount || 0) > 0;
        if (ownershipFilter === "personal") return (owned - (ownedState?.rentedCount || 0)) > 0;
        if (ownershipFilter === "unowned") return owned === 0;
        return true;
      });
    }

    // 4. Sorting
    result.sort((a, b) => {
      const ownedA = properties.find(p => p.id === a.id);
      const ownedB = properties.find(p => p.id === b.id);
      const priceA = a.purchasePrice * Math.pow(1.4, ownedA?.owned || 0);
      const priceB = b.purchasePrice * Math.pow(1.4, ownedB?.owned || 0);

      if (sortBy === "price-asc") return priceA - priceB;
      if (sortBy === "price-desc") return priceB - priceA;
      if (sortBy === "rent-desc") return b.rentPerSecond - a.rentPerSecond;
      if (sortBy === "owned-desc") return (ownedB?.owned || 0) - (ownedA?.owned || 0);
      return 0;
    });

    return result;
  }, [activeCategory, searchQuery, subTypeFilter, ownershipFilter, sortBy, properties]);

  // Pagination bounds
  const paginatedAssets = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedAssets.slice(startIdx, startIdx + itemsPerPage);
  }, [filteredAndSortedAssets, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedAssets.length / itemsPerPage) || 1;

  // Reset page when category, search, or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, searchQuery, subTypeFilter, ownershipFilter, sortBy]);

  if (selectedAssetId && selectedDef) {
    const Icon = ICONS[selectedDef.type];
    const personalUnits = (selectedOwned.owned ?? 0) - (selectedOwned.rentedCount ?? 0);
    const indexTrend = localIndexTrends[selectedDef.id] ?? 0;
    const isHome = selectedDef.type === "residential" || selectedDef.type === "luxury";
    const maxRentable = isHome ? Math.max(0, (selectedOwned.owned ?? 0) - 1) : (selectedOwned.owned ?? 0);

    return (
      <div className="pt-24 sm:pt-32 px-4 sm:px-10 max-w-[1400px] mx-auto space-y-10 pb-32 no-scrollbar">
        {/* BACK TO REGISTRY */}
        <button 
          onClick={() => setSelectedAssetId(null)}
          className="flex items-center gap-3 text-white/40 hover:text-white transition-colors group text-xs font-black uppercase tracking-[0.2em]"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Бозгашт ба Феҳристи Дороиҳо
        </button>

        {/* DETAILED HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start border-l-4 border-[#F0B90B]/50 py-5 sm:py-4 mb-8 gap-4">
          <div className="space-y-4">
            <div className="flex items-center gap-4 text-white/20">
               <Icon className="w-4 h-4 text-[#F0B90B]" />
               <span className="text-[11px] font-black uppercase tracking-[0.6em]">{selectedDef.name} _Идоракунии Дороиҳо</span>
            </div>
            <h1 className="text-3xl sm:text-6xl font-extrabold text-[#EAECEF] tracking-tight ">НАЗОРАТИ_ДОРОӢ</h1>
          </div>
          
          <div className="text-left sm:text-right">
             <div className="text-[10px] font-semibold uppercase tracking-wide text-[#F0B90B] mb-2">Даромади Ғайрифаъоли Иҷора (Умумӣ)</div>
             <div className="text-2xl sm:text-4xl font-black font-mono text-[#F0B90B]">
               +${(currentSingleRent * (selectedOwned.rentedCount ?? 0) * 3600).toLocaleString(undefined, { maximumFractionDigits: 0 })}<span className="text-xl text-[#F0B90B]/50">/моҳ</span>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT: LEASE/RECALL CONTROLS & TUNING */}
          <div className="lg:col-span-8 space-y-8">
             {/* DETAILED LEASE CONTROLS */}
             <MonolithCard className="p-6 sm:p-10 space-y-6 border-[#F0B90B]/20 bg-[#F0B90B]/[0.02]">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                   <h3 className="text-lg font-black uppercase tracking-widest text-white/90 italic flex items-center gap-2">
                      <Coins className="w-5 h-5 text-[#F0B90B]" /> Иҷораи Динамикӣ ва Танзими Стратегия
                   </h3>
                   <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest">Воҳидҳои Фаъол: {selectedOwned.owned}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                   <div className="space-y-3">
                      <p className="text-xs text-white/60 font-mono leading-relaxed">
                         Воҳидҳои худро байни тавлиди пули нақд ва мултипликаторҳои нуфуз тақсим кунед:
                      </p>
                      <div className="space-y-1 text-[11px] font-mono text-white/40">
                         <div className="flex justify-between">
                            <span>💼 Иҷора / Омода барои тиҷорат:</span>
                            <span className="text-[#F0B90B] font-bold">{selectedOwned.rentedCount} воҳидҳо</span>
                         </div>
                         <div className="flex justify-between">
                            <span>🏡 Истифодаи Шахсӣ / Иқоматгоҳи Шахсӣ:</span>
                            <span className="text-white font-bold">{personalUnits} {isHome && personalUnits === 1 ? "воҳид (Иқоматгоҳи Асосӣ)" : "воҳидҳо"}</span>
                         </div>
                      </div>
                      
                      {isHome && selectedOwned.owned === 1 && (
                         <div className="p-3 border border-[#F0B90B]/20 bg-[#F0B90B]/5 text-[10px] text-[#F0B90B] font-mono rounded-sm leading-relaxed uppercase tracking-wider flex items-center gap-2">
                            <ShieldAlert className="w-4 h-4 animate-pulse flex-shrink-0" />
                            Протоколи Иқомат: Аввалин хонаи шумо ҳамчун хонаи шахсии шумо фармоиш дода мешавад. Барои фаъол кардани иҷора, боз як воҳиди дигарро аз ин макон харед!
                         </div>
                      )}
                   </div>

                   {/* CONTROLS BUTTON GROUP */}
                   <div className="bg-[#2B2F36]/50 border border-white/5 p-6 rounded-sm flex items-center justify-between gap-6">
                      <div className="flex flex-col">
                         <span className="text-[9px] font-mono text-white/20 uppercase tracking-widest mb-1">Таносуби Иҷора</span>
                         <span className="text-2xl font-black font-mono text-white/80">{selectedOwned.rentedCount} / {selectedOwned.owned}</span>
                      </div>
                      
                      <div className="flex gap-2">
                         <button
                           onClick={() => recallUnit(selectedDef.id)}
                           disabled={selectedOwned.rentedCount <= 0}
                           className="w-12 h-12 border border-white/10 hover:border-red-500/50 hover:bg-red-500/10 text-white font-mono font-black text-lg flex items-center justify-center rounded-sm transition-all disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer"
                           title="Бозхонд ба истифодаи шахсӣ (-1 воҳиди иҷора, +Нуфуз)"
                         >
                           -
                         </button>
                         <button
                           onClick={() => leaseUnit(selectedDef.id)}
                           disabled={selectedOwned.rentedCount >= maxRentable}
                           className="w-12 h-12 border border-white/10 hover:border-[#F0B90B]/50 hover:bg-[#F0B90B]/10 text-white font-mono font-black text-lg flex items-center justify-center rounded-sm transition-all disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer"
                           title={isHome && selectedOwned.owned <= 1 ? "Протоколи Иқомат: Воҳиди аввал банд аст" : "Интиқол ба бозори иҷора (+1 воҳиди иҷора)"}
                         >
                           +
                         </button>
                      </div>
                   </div>
                </div>
             </MonolithCard>

             {/* UPGRADES & HOSPITALITY TUNING */}
             <MonolithCard className="p-4 sm:p-10 space-y-8 bg-gradient-to-br from-[#F0B90B]/[0.01] to-transparent border-[#F0B90B]/10">
                <div className="flex items-center justify-between border-b border-white/5 pb-6">
                   <h3 className="text-xl font-bold uppercase tracking-wide flex items-center gap-3 text-[#F0B90B]">
                     <Sparkles className="w-6 h-6 text-[#F0B90B] animate-pulse" /> Фардикунонии Дороӣ ва Танзими Самаранокӣ
                   </h3>
                   <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest">Матритсаи Муҳандисии Оптимизатсияшуда</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {/* RENOVATIONS / PERFORMANCE */}
                   <div className="p-6 bg-white/[0.01] border border-white/5 hover:border-[#F0B90B]/20 rounded-sm flex flex-col justify-between transition-all group">
                      <div className="space-y-3">
                         <div className="flex items-center justify-between">
                            <h4 className="text-lg font-black uppercase tracking-wider text-white/90 group-hover:text-[#F0B90B] transition-colors flex items-center gap-2">
                               <Sparkles className="w-4 h-4 text-[#F0B90B]" /> {selectedDef.category === "property" ? "Навсозӣ" : "Танзими Самаранокӣ"}
                            </h4>
                            <span className="text-[10px] font-black uppercase tracking-widest bg-[#F0B90B]/10 text-[#F0B90B] border border-[#F0B90B]/20 px-2 py-0.5 rounded-sm">
                               Сатҳи {selectedOwned.renovationLevel ?? 0}
                            </span>
                         </div>
                         <p className="text-xs text-white/50 font-mono leading-relaxed">
                            {selectedDef.category === "property" ? (
                              "Такмили меъморӣ ва беҳбудии эстетикиро иҷро кунед. Нархи бозорро баланд мебардорад ва даромади иҷораро дар як сатҳ +12% зиёд мекунад."
                            ) : (
                              "Upgrade системаҳои барқӣ, матритсаҳои автономии роҳнамоии AI ва панелҳои карбон. Даромади чартериро дар як сатҳ +12% зиёд мекунад."
                            )}
                         </p>
                      </div>

                      <button
                        onClick={() => renovateProperty(selectedDef.id, upgradeRenovationCost)}
                        disabled={balance < upgradeRenovationCost || (selectedOwned.owned ?? 0) <= 0}
                        className={`w-full mt-6 px-4 py-3 border font-black text-[10px] uppercase tracking-[0.2em] transition-all rounded-sm flex items-center justify-center gap-2 cursor-pointer ${
                          balance >= upgradeRenovationCost && (selectedOwned.owned ?? 0) > 0
                            ? "border-[#F0B90B] bg-[#F0B90B]/10 text-[#F0B90B] hover:bg-[#F0B90B] hover:text-black shadow-[0_0_20px_rgba(240,185,11,0.05)]"
                            : "border-white/5 bg-white/[0.01] text-white/20 cursor-not-allowed"
                        }`}
                      >
                         Оптимизатсия: ${upgradeRenovationCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                         <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                   </div>

                   {/* TENANT UPGRADE / LUXURY OPTIMIZATION */}
                   <div className="p-6 bg-white/[0.01] border border-white/5 hover:border-[#F0B90B]/20 rounded-sm flex flex-col justify-between transition-all group">
                      <div className="space-y-3">
                         <div className="flex items-center justify-between">
                            <h4 className="text-lg font-black uppercase tracking-wider text-white/90 group-hover:text-[#F0B90B] transition-colors flex items-center gap-2">
                               <UserCheck className="w-4 h-4 text-[#F0B90B]" /> {selectedDef.category === "property" ? "Интихоби Иҷорагирон" : "Оптимизатсияи Шартнома"}
                            </h4>
                            <span className="text-[10px] font-black uppercase tracking-widest bg-[#F0B90B]/10 text-[#F0B90B] border border-[#F0B90B]/20 px-2 py-0.5 rounded-sm">
                               Сатҳи {selectedOwned.tenantQualityLevel ?? 0}
                            </span>
                         </div>
                         <p className="text-xs text-white/50 font-mono leading-relaxed">
                            {selectedDef.category === "property" ? (
                              "Ҷалб намудани сокинони институтсионалӣ ё дорои эътибори баланди кредитӣ. Устувории сохтории иҷораро мустаҳкам мекунад ва афзоиши мураккаби арзиши амволро +8% зиёд менамояд."
                            ) : (
                              "Ба роҳ мондани шартномаҳои дарозмуддати парвозҳои роҳбарикунанда ё транзитӣ. Нишондиҳандаҳои арзёбиро мустаҳкам мекунад ва афзоиши мураккаби арзиши сармояро +8% зиёд менамояд."
                            )}
                         </p>
                      </div>

                      <button
                        onClick={() => upgradePropertyTenants(selectedDef.id, upgradeTenantCost)}
                        disabled={balance < upgradeTenantCost || (selectedOwned.owned ?? 0) <= 0}
                        className={`w-full mt-6 px-4 py-3 border font-black text-[10px] uppercase tracking-[0.2em] transition-all rounded-sm flex items-center justify-center gap-2 cursor-pointer ${
                          balance >= upgradeTenantCost && (selectedOwned.owned ?? 0) > 0
                            ? "border-[#F0B90B] bg-[#F0B90B]/10 text-[#F0B90B] hover:bg-[#F0B90B] hover:text-black shadow-[0_0_20px_rgba(240,185,11,0.05)]"
                            : "border-white/5 bg-white/[0.01] text-white/20 cursor-not-allowed"
                        }`}
                      >
                         Танзими Шартнома: ${upgradeTenantCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                         <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                   </div>
                </div>
             </MonolithCard>
          </div>

          {/* RIGHT: DETAILED STATS & VALUATION */}
          <div className="lg:col-span-4 space-y-8">
             {/* VALUATION STATISTICS */}
             <MonolithCard className="p-10 space-y-6">
                <div className="flex items-center justify-between">
                   <h3 className="text-lg font-bold uppercase tracking-wide">Профили Молиявӣ ва Дороӣ</h3>
                   {indexTrend !== 0 && (
                      <div className={`text-[10px] font-black font-mono flex items-center gap-1 ${indexTrend >= 0 ? 'text-[#F0B90B]' : 'text-red-400'}`}>
                         {indexTrend >= 0 ? "▲" : "▼"} {indexTrend >= 0 ? "+" : ""}{indexTrend.toFixed(1)}%
                      </div>
                   )}
                </div>
                <div className="space-y-4">
                   <div className="flex justify-between border-b border-white/5 pb-2 text-xs">
                      <span className="text-white/30 font-mono">Макон / Пойгоҳ:</span>
                      <span className="text-white font-mono truncate max-w-[180px]">{selectedDef.location}</span>
                   </div>
                   <div className="flex justify-between border-b border-white/5 pb-2 text-xs">
                      <span className="text-white/30 font-mono">Миқдори Дар даст Буда:</span>
                      <span className="text-white font-mono font-bold">{selectedOwned.owned} воҳидҳо</span>
                   </div>
                   <div className="flex justify-between border-b border-white/5 pb-2 text-xs">
                      <span className="text-white/30 font-mono">Нархи Харид (Воҳид):</span>
                      <span className="text-white font-mono">${selectedDef.purchasePrice.toLocaleString()}</span>
                   </div>
                   <div className="flex justify-between border-b border-white/5 pb-2 text-xs">
                      <span className="text-white/30 font-mono">Нархи Хариди Навбатӣ:</span>
                      <span className="text-white font-mono">${currentCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                   </div>
                   <div className="flex justify-between border-b border-white/5 pb-2 text-xs">
                      <span className="text-white/30 font-mono">Арзиши Арзёбишуда (Воҳид):</span>
                      <span className="text-[#F0B90B] font-mono font-bold">${(selectedOwned.currentValue * (selectedOwned.appreciationMultiplier ?? 1.0)).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                   </div>
                   <div className="flex justify-between border-b border-white/5 pb-2 text-xs">
                      <span className="text-white/30 font-mono">Арзиши Умумии Фурӯш:</span>
                      <span className="text-[#F0B90B] font-mono">${sellValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                   </div>
                   <div className="flex justify-between border-b border-white/5 pb-2 text-xs">
                      <span className="text-white/30 font-mono">Воҳидҳои Фаъоли Иҷора:</span>
                      <span className="text-[#F0B90B] font-mono font-black">{selectedOwned.rentedCount} воҳидҳо</span>
                   </div>
                   <div className="flex justify-between border-b border-white/5 pb-2 text-xs">
                      <span className="text-white/30 font-mono">Воҳидҳои Шахсии Фаъол:</span>
                      <span className="text-white font-mono font-black">{personalUnits} воҳидҳо</span>
                   </div>
                   <div className="flex justify-between text-xs">
                      <span className="text-white/30 font-mono">Сатҳи Хавф:</span>
                      <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-sm border ${RISK_COLORS[selectedDef.risk]}`}>
                         {selectedDef.risk === "Low" ? "Паст" : selectedDef.risk === "Medium" ? "Миёна" : "Баланд"}
                      </span>
                   </div>
                </div>
             </MonolithCard>

             {/* STRATEGIC INTEL */}
             <MonolithCard className="p-10 space-y-6 bg-gradient-to-br from-[#F0B90B]/[0.01] to-transparent">
                <h3 className="text-lg font-semibold uppercase tracking-wide flex items-center gap-2 text-[#F0B90B]">
                   <Award className="w-5 h-5" /> Маълумоти Стратегии Дороӣ
                </h3>
                <p className="text-xs text-white/60 font-mono leading-relaxed">
                   {selectedDef.strategyDocs}
                </p>
                <div className="pt-4 border-t border-white/5 text-[10px] font-mono text-white/40 flex items-center justify-between">
                   <span>НИШОНДИҲАНДАИ АСОСӢ:</span>
                   <span className="text-white font-bold">{selectedDef.realWorldMetric}</span>
                </div>
             </MonolithCard>

             {/* TRANSACTION PANEL */}
             <div className="space-y-4">
                <button 
                  onClick={() => buyProperty(selectedDef)}
                  disabled={balance < currentCost}
                  className={`w-full py-5 border font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 rounded-sm shadow-[0_0_30px_rgba(240,185,11,0.05)] cursor-pointer ${
                    balance >= currentCost 
                      ? "border-[#F0B90B] bg-[#F0B90B]/10 text-[#F0B90B] hover:bg-[#F0B90B] hover:text-black" 
                      : "border-white/5 text-white/10 bg-white/[0.01] cursor-not-allowed"
                  }`}
                >
                  Хариди Воҳид: ${currentCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  <ArrowUpRight className="w-4 h-4" />
                </button>

                <button 
                  onClick={() => {
                    sellProperty(selectedDef.id);
                    if (selectedOwned.owned <= 1) {
                      setSelectedAssetId(null);
                    }
                  }}
                  disabled={(selectedOwned.owned ?? 0) <= 0}
                  className={`w-full py-5 border font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 rounded-sm cursor-pointer ${
                    (selectedOwned.owned ?? 0) > 0 
                      ? "border-red-500/50 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-black hover:shadow-[0_0_30px_rgba(239,68,68,0.2)]" 
                      : "border-white/5 text-white/10 bg-white/[0.01] cursor-not-allowed"
                  }`}
                >
                  Фурӯши 1 Воҳид: +${(sellValue / selectedOwned.owned).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  <ArrowDownRight className="w-4 h-4" />
                </button>
             </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 sm:pt-32 px-4 sm:px-10 max-w-[1400px] mx-auto space-y-8 pb-32 no-scrollbar">
      {/* GLOBAL HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start border-l-4 border-[#F0B90B]/50 py-5 sm:py-4 mb-2 gap-4">
        <div className="space-y-4">
          <div className="flex items-center gap-4 text-white/20">
             <Landmark className="w-4 h-4" />
             <span className="text-[10px] font-semibold uppercase tracking-widest text-[#848E9C]">Дафтари_Дороиҳои_Система_Тарзи_Ҳаёт</span>
          </div>
          <h1 className="text-3xl sm:text-6xl font-extrabold text-[#EAECEF] tracking-tight ">АМВОЛИ БОҲАШАМАТ & ХОНАҲО</h1>
        </div>
        
        <div className="text-left md:text-right mt-4 md:mt-0 flex gap-8 items-center">
           <div>
              <div className="text-[10px] font-semibold uppercase tracking-wide text-[#F0B90B] mb-2 flex items-center md:justify-end gap-2">
                <Award className="w-3.5 h-3.5 animate-pulse" /> Афзоиши_Нуфуз
              </div>
              <div className="text-4xl font-black font-mono text-white">
                +{prestigeScore}%<span className="text-xl text-white/50"> Мулт</span>
              </div>
           </div>
           <div>
              <div className="text-[10px] font-semibold uppercase tracking-wide text-[#F0B90B] mb-2 flex items-center md:justify-end gap-2">
                <Sparkles className="w-3 h-3 animate-pulse" /> Ҷараёни_Умумии_Иҷора
              </div>
              <div className="text-4xl font-black font-mono text-[#F0B90B]">
                +${(totalRent * 3600).toLocaleString(undefined, { maximumFractionDigits: 0 })}<span className="text-xl text-[#F0B90B]/50">/моҳ</span>
              </div>
           </div>
        </div>
      </div>

      {/* REAL-TIME INFLATION MARKET TICKER */}
      <div className="w-full bg-[#F0B90B]/5 border border-[#F0B90B]/20 py-3.5 px-6 rounded-sm flex items-center gap-3 overflow-hidden">
         <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wide text-[#F0B90B] shrink-0 bg-[#F0B90B]/10 px-2.5 py-1 border border-[#F0B90B]/20 rounded-sm">
            <LineChart className="w-3.5 h-3.5 animate-pulse" /> ТЕЛЕМЕТРИЯИ МУСТАҚИМ
         </div>
         <div className="text-[11px] font-mono text-[#F0B90B]/90 tracking-wide font-medium marquee-scroll truncate">
            {inflationTicker}
         </div>
      </div>

      {/* CATEGORY SWITCHERS */}
      <div className="flex gap-4 border-b border-white/5 pb-4">
         <button 
           onClick={() => setActiveCategory("property")}
           className={`px-6 py-3 border font-black text-xs uppercase tracking-[0.2em] transition-all rounded-sm flex items-center gap-2 cursor-pointer ${
             activeCategory === "property" 
               ? "border-[#F0B90B] bg-[#F0B90B]/10 text-[#F0B90B] shadow-[0_0_15px_rgba(240,185,11,0.05)]" 
               : "border-white/5 text-white/30 hover:text-white"
           }`}
         >
           <Building2 className="w-4 h-4" /> 🏢 Амволи Ғайриманқул & Шалеҳо
         </button>
         <button 
           onClick={() => setActiveCategory("lifestyle")}
           className={`px-6 py-3 border font-black text-xs uppercase tracking-[0.2em] transition-all rounded-sm flex items-center gap-2 cursor-pointer ${
             activeCategory === "lifestyle" 
               ? "border-[#F0B90B] bg-[#F0B90B]/10 text-[#F0B90B] shadow-[0_0_15px_rgba(240,185,11,0.05)]" 
               : "border-white/5 text-white/30 hover:text-white"
           }`}
         >
           <Car className="w-4 h-4" /> 🏎️ Гараж & Мошинҳои Боҳашамат
         </button>
      </div>

      {/* 📝 FILTERS AND SEARCH PANEL */}
      <MonolithCard className="p-4 sm:p-6 bg-gradient-to-br from-white/[0.01] to-transparent border border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          {/* SEARCH INPUT */}
          <div className="relative">
            <Search className="w-4 h-4 text-white/20 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Ҷустуҷӯи дороиҳо ё макон..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#2B2F36]/40 border border-white/10 hover:border-white/20 focus:border-[#F0B90B]/50 rounded-sm pl-10 pr-4 py-2.5 text-xs text-white placeholder-white/20 font-mono outline-none transition-all"
            />
          </div>

          {/* TYPE FILTER */}
          <div className="relative">
            <SlidersHorizontal className="w-3.5 h-3.5 text-white/20 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <select
              value={subTypeFilter}
              onChange={(e) => setSubTypeFilter(e.target.value)}
              className="w-full bg-[#2B2F36]/40 border border-white/10 hover:border-white/20 focus:border-[#F0B90B]/50 rounded-sm pl-10 pr-4 py-2.5 text-xs text-white font-mono outline-none transition-all appearance-none cursor-pointer"
            >
              <option value="all">Ҳамаи зер-намудҳо</option>
              {activeCategory === "property" ? (
                <>
                  <option value="residential">Истиқоматӣ</option>
                  <option value="commercial">Тиҷоратӣ</option>
                  <option value="luxury">Шалеҳо & Виллаҳои Боҳашамат</option>
                  <option value="industrial">Инфрасохтори Саноатӣ</option>
                </>
              ) : (
                <>
                  <option value="supercar">Суперкарҳо & SUV-ҳо</option>
                  <option value="hypercar">Гиперкарҳои Самаранокӣ</option>
                  <option value="yacht">Яхтаҳои Боҳашамати Офтобӣ</option>
                  <option value="jet">Ҷетҳои Шахсии Аэро</option>
                </>
              )}
            </select>
          </div>

          {/* OWNERSHIP FILTER */}
          <div className="relative">
            <UserCheck className="w-3.5 h-3.5 text-white/20 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <select
              value={ownershipFilter}
              onChange={(e) => setOwnershipFilter(e.target.value)}
              className="w-full bg-[#2B2F36]/40 border border-white/10 hover:border-white/20 focus:border-[#F0B90B]/50 rounded-sm pl-10 pr-4 py-2.5 text-xs text-white font-mono outline-none transition-all appearance-none cursor-pointer"
            >
              <option value="all">Моликият: Ҳамаи Дороиҳо</option>
              <option value="owned">Танҳо Дороиҳои Шахсӣ</option>
              <option value="leased">Танҳо Иҷораҳои Фаъол</option>
              <option value="personal">Танҳо Иқоматгоҳҳои Шахсӣ</option>
              <option value="unowned">Танҳо Воҳидҳои Қулфшуда</option>
            </select>
          </div>

          {/* SORTING SELECT */}
          <div className="relative">
            <ArrowUpDown className="w-3.5 h-3.5 text-white/20 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-[#2B2F36]/40 border border-white/10 hover:border-white/20 focus:border-[#F0B90B]/50 rounded-sm pl-10 pr-4 py-2.5 text-xs text-white font-mono outline-none transition-all appearance-none cursor-pointer"
            >
              <option value="price-asc">Нарх: Аз Паст ба Баланд</option>
              <option value="price-desc">Нарх: Аз Баланд ба Паст</option>
              <option value="rent-desc">Даромад: Аввал Баландтарин</option>
              <option value="owned-desc">Миқдор: Аввал Аксарият</option>
            </select>
          </div>
        </div>
      </MonolithCard>

      {/* REGISTRY ASSET GRID */}
      {paginatedAssets.length > 0 ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {paginatedAssets.map((asset) => {
            const ownedState = properties.find(p => p.id === asset.id);
            const owned = ownedState?.owned || 0;
            const rentedCount = ownedState?.rentedCount || 0;
            const currentCost = asset.purchasePrice * Math.pow(1.4, owned);
            const canAfford = balance >= currentCost;
            const Icon = ICONS[asset.type];
            
            const appraisedValue = ownedState 
              ? ownedState.currentValue * (ownedState.appreciationMultiplier ?? 1.0) 
              : asset.purchasePrice;

            const trend = localIndexTrends[asset.id] ?? 0;

            return (
              <MonolithCard key={asset.id} className="p-6 sm:p-10 flex flex-col justify-between group relative overflow-hidden bg-gradient-to-br from-white/[0.01] to-transparent border border-white/5 hover:border-[#F0B90B]/10 transition-all">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#F0B90B]/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)]" />
                
                <div className="space-y-8">
                  {/* HEADER */}
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                     <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-white/5 flex items-center justify-center rounded-sm border border-white/10 group-hover:border-[#F0B90B]/50 transition-colors">
                           <Icon className="w-6 h-6 text-white/40 group-hover:text-[#F0B90B] transition-colors" />
                        </div>
                        <div>
                           <h3 className="text-2xl font-bold uppercase tracking-wide text-white/90 leading-none mb-2">{asset.name}</h3>
                           <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest flex items-center gap-2">
                             <Navigation className="w-3.5 h-3.5 text-[#F0B90B]/50" /> {asset.location}
                           </span>
                        </div>
                     </div>
                     
                     <div className="text-right">
                        <div className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">Миқдори Дар даст Буда</div>
                        <div className="text-3xl font-black font-mono text-white/80">{owned}</div>
                     </div>
                  </div>

                  {/* MATRIX RATIOS */}
                  <div className="grid grid-cols-3 gap-4 border-y border-white/5 py-6">
                     <div>
                        <div className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-1">Даромади Иҷора (Воҳид)</div>
                        <div className="text-base font-black font-mono text-[#F0B90B]">
                           +${(asset.rentPerSecond * 3600).toLocaleString()}/моҳ
                        </div>
                     </div>
                     <div>
                        <div className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-1">Арзиши Арзёбишуда</div>
                        <div className="text-base font-black font-mono text-white/85 flex items-center gap-1.5">
                           ${Math.floor(appraisedValue).toLocaleString()}
                           {trend !== 0 && (
                             <span className={`text-[9px] font-black font-mono ${trend >= 0 ? 'text-[#F0B90B]' : 'text-red-400'}`}>
                               {trend >= 0 ? "▲" : "▼"}
                             </span>
                           )}
                        </div>
                     </div>
                     <div>
                        <div className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-1">Сатҳи Хавф</div>
                        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-sm border ${RISK_COLORS[asset.risk]}`}>
                           {asset.risk === "Low" ? "Паст" : asset.risk === "Medium" ? "Миёна" : "Баланд"}
                        </span>
                     </div>
                  </div>

                  {/* INDIVIDUAL DEPLOYMENT STATUS */}
                  {owned > 0 && (
                     <div className="bg-[#F0B90B]/5 border border-[#F0B90B]/20 p-4 rounded-sm flex flex-col gap-2 font-mono text-xs">
                        <div className="flex justify-between text-white/40 border-b border-white/5 pb-2">
                           <span>Таносуби Истифодаи Воҳидҳо:</span>
                           <span className="text-[#F0B90B] font-bold uppercase">{owned} Санади Фаъол</span>
                        </div>
                        <div className="flex justify-between text-[11px] items-center">
                           <span className="text-white/30">💼 Иҷораҳои Бозорӣ (Даромад меорад):</span>
                           <span className="text-[#F0B90B] font-bold font-mono">{rentedCount} / {owned} воҳидҳо</span>
                        </div>
                        <div className="flex justify-between text-[11px] items-center">
                           <span className="text-white/30">🏡 Истифодаи Шахсӣ (Афзоиши Нуфуз):</span>
                           <span className="text-white font-bold font-mono">{owned - rentedCount} / {owned} воҳидҳо</span>
                        </div>
                     </div>
                  )}

                  {/* CASE STUDY */}
                  <div className="bg-white/[0.02] border border-white/5 p-5 rounded-sm space-y-3">
                     <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wide text-[#F0B90B]">
                        <Award className="w-4 h-4" /> Таҳлили Академикии Кор
                     </div>
                     <p className="text-xs text-white/60 font-mono leading-relaxed">
                       {asset.educationalTakeaway}
                     </p>
                  </div>
                </div>

                {/* TRANSACTIONS */}
                <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                   <div className="flex flex-col">
                      <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest mb-1">Сармояи Харид</span>
                      <span className="text-2xl font-black font-mono text-white/80">
                        ${currentCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </span>
                   </div>

                   <div className="flex flex-wrap sm:flex-nowrap gap-3 w-full sm:w-auto">
                      {owned > 0 && (
                        <button 
                          onClick={() => setSelectedAssetId(asset.id)}
                          className="flex-1 sm:flex-none px-6 py-4 border border-white/10 hover:border-[#F0B90B]/30 hover:bg-white/5 text-white font-black text-xs uppercase tracking-[0.2em] transition-all rounded-sm flex items-center justify-center gap-2 min-h-[44px] active:scale-95 cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-[#F0B90B] animate-pulse" />
                          Идора & Иҷора
                        </button>
                      )}
                      
                      <button 
                        onClick={() => buyProperty(asset)}
                        disabled={!canAfford}
                        className={`flex-1 sm:flex-none px-8 py-4 border font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 rounded-sm min-h-[44px] active:scale-95 cursor-pointer ${
                          canAfford 
                            ? "border-[#F0B90B] bg-[#F0B90B]/10 text-[#F0B90B] hover:bg-[#F0B90B] hover:text-black shadow-[0_0_20px_rgba(240,185,11,0.1)]" 
                            : "border-white/10 text-white/20 bg-white/5 cursor-not-allowed"
                        }`}
                      >
                        Хариди Санад
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                   </div>
                </div>
              </MonolithCard>
            );
          })}
        </div>
      ) : (
        <MonolithCard className="p-16 text-center space-y-4 border-dashed border-white/10 bg-white/[0.01]">
           <ShieldAlert className="w-12 h-12 text-[#F0B90B]/35 mx-auto animate-pulse" />
           <h3 className="text-xl font-bold uppercase tracking-wide text-white/80">Ҳеҷ Мутобиқате Ёфт Нашуд</h3>
           <p className="text-xs text-white/40 font-mono max-w-md mx-auto leading-relaxed">
             Ҳеҷ амволи боҳашамат ё мошинҳои гараж ба параметрҳои ҷустуҷӯ, филтр ё танзимоти шумо мувофиқат намекунанд. Филтрҳои худро аз нав барқарор кунед.
           </p>
           <button 
             onClick={() => {
               setSearchQuery("");
               setSubTypeFilter("all");
               setOwnershipFilter("all");
               setSortBy("price-asc");
             }}
             className="mt-4 px-6 py-2.5 border border-[#F0B90B]/30 hover:border-[#F0B90B] bg-[#F0B90B]/5 hover:bg-[#F0B90B]/10 text-[#F0B90B] text-xs font-black uppercase tracking-[0.2em] transition-all rounded-sm cursor-pointer"
           >
             Барқароркунии Ҷустуҷӯ
           </button>
        </MonolithCard>
      )}

      {/* 📝 SLEEK CYBERNETIC PAGINATION CONTROLS */}
      {filteredAndSortedAssets.length > itemsPerPage && (
        <div className="flex justify-between items-center border-t border-white/5 pt-6 font-mono text-[11px] text-white/40">
           <div>
              Нишон додани <span className="text-[#F0B90B] font-bold">{Math.min(filteredAndSortedAssets.length, (currentPage - 1) * itemsPerPage + 1)}-{Math.min(filteredAndSortedAssets.length, currentPage * itemsPerPage)}</span> аз <span className="text-white font-bold">{filteredAndSortedAssets.length}</span> дороиҳои мувофиқ
           </div>
           
           <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="w-10 h-10 border border-white/10 hover:border-[#F0B90B]/40 hover:bg-white/5 rounded-sm flex items-center justify-center transition-all disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer"
              >
                 <ChevronLeft className="w-4 h-4 text-white" />
              </button>
              
              <div className="px-4 py-2 border border-white/5 bg-white/[0.01] rounded-sm text-xs font-bold text-white tracking-widest font-mono">
                 {currentPage} / {totalPages}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="w-10 h-10 border border-white/10 hover:border-[#F0B90B]/40 hover:bg-white/5 rounded-sm flex items-center justify-center transition-all disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer"
              >
                 <ChevronRight className="w-4 h-4 text-white" />
              </button>
           </div>
        </div>
      )}
    </div>
  );
}
