import React, { useState, useEffect, useMemo } from "react";
import { 
  motion, 
  AnimatePresence 
} from "motion/react";
import { 
  GitCompare, 
  ArrowRight, 
  ArrowUpRight, 
  ArrowDownRight, 
  Sparkles, 
  Check, 
  Info, 
  Shield, 
  MapPin, 
  Building, 
  Globe, 
  RefreshCw, 
  Layers, 
  Sliders, 
  Award,
  AlertTriangle,
  BookOpen,
  Share2
} from "lucide-react";
import { PolicyInputs, SimulationResult } from "../types";

interface MultiCityCompareProps {
  currentInputs: PolicyInputs;
  currentMetrics: SimulationResult;
}

// Default presets for the 4 heritage cities
const BASELINE_PRESETS: Record<string, PolicyInputs> = {
  varanasi: {
    city: "varanasi",
    rickshawSubsidy: 1500,
    wasteManagementBudget: 80,
    safetyPatrolIntensity: 2,
    middlemenCommissionCap: 45,
    standardizedRatesEnabled: false,
    touristMultiplier: 2.0,
    weatherHazard: "low"
  },
  jaipur: {
    city: "jaipur",
    rickshawSubsidy: 2000,
    wasteManagementBudget: 100,
    safetyPatrolIntensity: 3,
    middlemenCommissionCap: 48,
    standardizedRatesEnabled: false,
    touristMultiplier: 2.5,
    weatherHazard: "low"
  },
  kochi: {
    city: "kochi",
    rickshawSubsidy: 1800,
    wasteManagementBudget: 90,
    safetyPatrolIntensity: 2,
    middlemenCommissionCap: 40,
    standardizedRatesEnabled: false,
    touristMultiplier: 2.2,
    weatherHazard: "low"
  },
  hampi: {
    city: "hampi",
    rickshawSubsidy: 1200,
    wasteManagementBudget: 60,
    safetyPatrolIntensity: 1,
    middlemenCommissionCap: 50,
    standardizedRatesEnabled: false,
    touristMultiplier: 2.0,
    weatherHazard: "low"
  }
};

const SWADESHI_PRESETS: Record<string, PolicyInputs> = {
  varanasi: {
    city: "varanasi",
    rickshawSubsidy: 7500,
    wasteManagementBudget: 350,
    safetyPatrolIntensity: 12,
    middlemenCommissionCap: 15,
    standardizedRatesEnabled: true,
    touristMultiplier: 1.5,
    weatherHazard: "low"
  },
  jaipur: {
    city: "jaipur",
    rickshawSubsidy: 8000,
    wasteManagementBudget: 400,
    safetyPatrolIntensity: 14,
    middlemenCommissionCap: 10,
    standardizedRatesEnabled: true,
    touristMultiplier: 1.8,
    weatherHazard: "low"
  },
  kochi: {
    city: "kochi",
    rickshawSubsidy: 7000,
    wasteManagementBudget: 380,
    safetyPatrolIntensity: 11,
    middlemenCommissionCap: 15,
    standardizedRatesEnabled: true,
    touristMultiplier: 1.4,
    weatherHazard: "low"
  },
  hampi: {
    city: "hampi",
    rickshawSubsidy: 7200,
    wasteManagementBudget: 320,
    safetyPatrolIntensity: 10,
    middlemenCommissionCap: 12,
    standardizedRatesEnabled: true,
    touristMultiplier: 1.3,
    weatherHazard: "low"
  }
};

const CITY_LABELS: Record<string, { name: string; tag: string; icon: string; color: string }> = {
  varanasi: { name: "Varanasi (Kashi)", tag: "Ganga Ghats & Silk Weaving", icon: "🕉️", color: "from-amber-500 to-orange-600" },
  jaipur: { name: "Jaipur (Pink City)", tag: "Palace Bazaars & Pottery", icon: "🏰", color: "from-rose-400 to-pink-600" },
  kochi: { name: "Kochi (Malabar)", tag: "Fishing Nets & Coir Weaving", icon: "🌴", color: "from-emerald-400 to-teal-600" },
  hampi: { name: "Hampi (Vijayanagara)", tag: "Ancient Ruins & Coracles", icon: "⛰️", color: "from-blue-500 to-indigo-600" }
};

// Client-side replication of simulation logic for instant real-time slider sliding!
function calculateCivicMetrics(inputs: PolicyInputs): SimulationResult {
  const city = inputs.city || 'varanasi';
  const {
    rickshawSubsidy,
    wasteManagementBudget,
    safetyPatrolIntensity,
    middlemenCommissionCap,
    standardizedRatesEnabled,
    touristMultiplier,
    weatherHazard
  } = inputs;

  let baseEcon = 38;
  let baseSafety = 52;
  let baseGrowth = 5;
  let baseComplaints = 42;
  let baseCongestion = 40;
  let baseCoop = 4;
  let baseClean = 48;

  if (city === 'jaipur') {
    baseEcon = 32;
    baseSafety = 56;
    baseCongestion = 45;
    baseClean = 50;
  } else if (city === 'kochi') {
    baseEcon = 40;
    baseSafety = 60;
    baseCongestion = 35;
    baseClean = 44;
  } else if (city === 'hampi') {
    baseEcon = 35;
    baseSafety = 50;
    baseCongestion = 30;
    baseClean = 55;
  }

  // 1. Economic Distribution Index (%)
  const commCapEffect = (50 - middlemenCommissionCap) * 0.82;
  const subsidyEffect = (rickshawSubsidy / 1000) * 1.5;
  const ratesEffect = standardizedRatesEnabled ? 10 : 0;
  let economicDistribution = baseEcon + commCapEffect + subsidyEffect + ratesEffect;
  economicDistribution = Math.min(96, Math.max(20, economicDistribution));

  // 2. Traveler Safety Trust Rating (1-100)
  const patrolEffect = safetyPatrolIntensity * 2.0;
  const ratesTrust = standardizedRatesEnabled ? 15 : -6;
  const weatherEffect = weatherHazard === 'high' ? -18 : weatherHazard === 'medium' ? -6 : 0;
  const touristStrain = (touristMultiplier - 1) * 8;
  let safetyTrustRating = baseSafety + patrolEffect + ratesTrust + weatherEffect - touristStrain;
  safetyTrustRating = Math.min(98, Math.max(22, safetyTrustRating));

  // 3. Local Merchant Revenue Growth (%)
  const tourEffect = touristMultiplier * 11.5;
  const trustGrowth = (safetyTrustRating - 50) * 0.18;
  const weatherSqueeze = weatherHazard === 'high' ? -14 : weatherHazard === 'medium' ? -4 : 0;
  const cleanGrowth = (wasteManagementBudget / 100) * 2.2;
  let merchantRevenueGrowth = baseGrowth + tourEffect + trustGrowth + weatherSqueeze + cleanGrowth;
  merchantRevenueGrowth = Math.min(50, Math.max(-18, merchantRevenueGrowth));

  // 4. Scam & Overcharging Complaints (per 1k tourists)
  const patrolDeterrent = safetyPatrolIntensity * 1.7;
  const standardRatesCut = standardizedRatesEnabled ? 22 : 0;
  const middlemanGreed = (middlemenCommissionCap - 10) * 0.28;
  const crowdFriction = (touristMultiplier - 1) * 9.5;
  let complaintsRate = baseComplaints - patrolDeterrent - standardRatesCut + middlemanGreed + crowdFriction;
  complaintsRate = Math.min(88, Math.max(1, complaintsRate));

  // 5. Traffic Congestion Index (%)
  const rickshawDensity = (rickshawSubsidy / 1000) * 1.6;
  const touristGridlock = touristMultiplier * 15.5;
  const trafficPatrolGuard = safetyPatrolIntensity * 0.7;
  const weatherDetour = weatherHazard === 'high' ? 24 : weatherHazard === 'medium' ? 8 : 0;
  let trafficCongestion = baseCongestion + rickshawDensity + touristGridlock - trafficPatrolGuard + weatherDetour;
  trafficCongestion = Math.min(98, Math.max(15, trafficCongestion));

  // 6. Cooperative Net Income Growth (%)
  const commissionSave = (50 - middlemenCommissionCap) * 0.98;
  const touristVolumeBoost = touristMultiplier * 5.5;
  let weaverCooperativeIncome = baseCoop + commissionSave + touristVolumeBoost;
  weaverCooperativeIncome = Math.min(55, Math.max(-8, weaverCooperativeIncome));

  // 7. Sanitation / Cleanliness Score (%)
  const budgetCleaning = (wasteManagementBudget / 10) * 0.92;
  const crowdDebris = (touristMultiplier - 1) * 11.5;
  const weatherSilt = weatherHazard === 'high' ? -19 : weatherHazard === 'medium' ? -5 : 0;
  const patrolFines = safetyPatrolIntensity * 0.85;
  let ghatCleanliness = baseClean + budgetCleaning - crowdDebris + weatherSilt + patrolFines;
  ghatCleanliness = Math.min(99, Math.max(18, ghatCleanliness));

  return {
    economicDistribution: parseFloat(economicDistribution.toFixed(1)),
    safetyTrustRating: parseFloat(safetyTrustRating.toFixed(1)),
    merchantRevenueGrowth: parseFloat(merchantRevenueGrowth.toFixed(1)),
    complaintsRate: parseFloat(complaintsRate.toFixed(1)),
    trafficCongestion: parseFloat(trafficCongestion.toFixed(1)),
    weaverCooperativeIncome: parseFloat(weaverCooperativeIncome.toFixed(1)),
    ghatCleanliness: parseFloat(ghatCleanliness.toFixed(1))
  };
}

export default function MultiCityCompare({
  currentInputs,
  currentMetrics
}: MultiCityCompareProps) {
  
  // Select which two cities to compare
  const [cityAId, setCityAId] = useState<'varanasi' | 'jaipur' | 'kochi' | 'hampi'>("varanasi");
  const [cityBId, setCityBId] = useState<'varanasi' | 'jaipur' | 'kochi' | 'hampi'>("jaipur");

  // Selection presets: 'unregulated' | 'swadeshi' | 'simulator'
  const [presetModeA, setPresetModeA] = useState<'unregulated' | 'swadeshi' | 'simulator'>("unregulated");
  const [presetModeB, setPresetModeB] = useState<'unregulated' | 'swadeshi' | 'simulator'>("swadeshi");

  // Keep separate mutable policy configurations for City A and City B
  const [inputsA, setInputsA] = useState<PolicyInputs>({ ...BASELINE_PRESETS.varanasi });
  const [inputsB, setInputsB] = useState<PolicyInputs>({ ...SWADESHI_PRESETS.jaipur });

  // Tab to control which city's sliders are active/focused
  const [focusedControlCity, setFocusedControlCity] = useState<'A' | 'B'>('A');

  // AI comparison states
  const [aiBrief, setAiBrief] = useState<string>("");
  const [isLoadingAi, setIsLoadingAi] = useState<boolean>(false);
  const [shareSuccess, setShareSuccess] = useState<boolean>(false);

  // Sync inputs on preset change or city selection change
  useEffect(() => {
    let resolvedInputs: PolicyInputs;
    if (presetModeA === 'unregulated') {
      resolvedInputs = { ...BASELINE_PRESETS[cityAId] };
    } else if (presetModeA === 'swadeshi') {
      resolvedInputs = { ...SWADESHI_PRESETS[cityAId] };
    } else {
      // simulator values adapted for cityAId
      resolvedInputs = { ...currentInputs, city: cityAId };
    }
    setInputsA(resolvedInputs);
  }, [cityAId, presetModeA, currentInputs]);

  useEffect(() => {
    let resolvedInputs: PolicyInputs;
    if (presetModeB === 'unregulated') {
      resolvedInputs = { ...BASELINE_PRESETS[cityBId] };
    } else if (presetModeB === 'swadeshi') {
      resolvedInputs = { ...SWADESHI_PRESETS[cityBId] };
    } else {
      // simulator values adapted for cityBId
      resolvedInputs = { ...currentInputs, city: cityBId };
    }
    setInputsB(resolvedInputs);
  }, [cityBId, presetModeB, currentInputs]);

  // Compute metrics in real-time
  const metricsA = useMemo(() => calculateCivicMetrics(inputsA), [inputsA]);
  const metricsB = useMemo(() => calculateCivicMetrics(inputsB), [inputsB]);

  // Get dynamic AI Comparative report from the backend
  const fetchAiComparison = async () => {
    setIsLoadingAi(true);
    setAiBrief("");
    try {
      const response = await fetch("/api/scenarios/compare-cities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inputsA, inputsB })
      });
      if (response.ok) {
        const data = await response.json();
        setAiBrief(data.aiBrief);
      } else {
        setAiBrief("Error loading AI comparative brief. Please verify backend connection.");
      }
    } catch (err) {
      console.error("Failed to query comparison brief:", err);
      setAiBrief("Failed to load Gemini analysis. Running in offline mode.");
    } finally {
      setIsLoadingAi(false);
    }
  };

  const handleShareResult = () => {
    const shareText = `Comparing ${CITY_LABELS[cityAId].name} vs ${CITY_LABELS[cityBId].name}:\n` +
      `- Economic Distribution: ${metricsA.economicDistribution}% vs ${metricsB.economicDistribution}%\n` +
      `- Safety Trust: ${metricsA.safetyTrustRating}/100 vs ${metricsB.safetyTrustRating}/100\n` +
      `- Cleanliness: ${metricsA.ghatCleanliness}% vs ${metricsB.ghatCleanliness}%\n` +
      `Synthesized with Swadeshi Civic Planner!`;
    navigator.clipboard.writeText(shareText);
    setShareSuccess(true);
    setTimeout(() => setShareSuccess(false), 2500);
  };

  const handleSliderChange = (cityKey: 'A' | 'B', key: keyof PolicyInputs, value: any) => {
    if (cityKey === 'A') {
      setPresetModeA('simulator'); // mark custom
      setInputsA(prev => ({ ...prev, [key]: value }));
    } else {
      setPresetModeB('simulator'); // mark custom
      setInputsB(prev => ({ ...prev, [key]: value }));
    }
  };

  // Helper list to iterate through compared metrics
  const metricSpecs = [
    { key: "economicDistribution", label: "Economic Distribution Share", unit: "%", higherIsBetter: true },
    { key: "safetyTrustRating", label: "Visitor Safety Trust Rating", unit: "/100", higherIsBetter: true },
    { key: "merchantRevenueGrowth", label: "Merchant Revenue Growth", unit: "%", higherIsBetter: true },
    { key: "complaintsRate", label: "Scam & Overcharge Complaints", unit: " per 1k", higherIsBetter: false },
    { key: "trafficCongestion", label: "Heritage Lane Gridlock", unit: "%", higherIsBetter: false },
    { key: "weaverCooperativeIncome", label: "Cooperative Net Income Growth", unit: "%", higherIsBetter: true },
    { key: "ghatCleanliness", label: "Heritage Sanitation Rating", unit: "%", higherIsBetter: true },
  ];

  return (
    <div className="space-y-10" id="multi-city-compare-viewport">
      
      {/* Intro Banner */}
      <div className="relative p-8 md:p-10 rounded-[40px] overflow-hidden bg-brand-dark border border-brand-teal/20 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-rose/10 rounded-full blur-3xl pointer-events-none -translate-y-20 translate-x-10" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-teal/5 rounded-full blur-3xl pointer-events-none translate-y-20 -translate-x-10" />
        
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-rose/15 rounded-full text-[10px] font-bold uppercase tracking-wider text-brand-rose border border-brand-rose/20">
            <GitCompare className="h-3.5 w-3.5" />
            <span>Side-by-Side Municipal Benchmarking</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-none font-display">
            Multi-City <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-teal to-amber-300">Compare Dashboard</span>
          </h2>
          
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed max-w-2xl font-medium">
            Contrast performance metrics across ancient Indian heritage cities. Select any two destinations, tune their governance sliders, and analyze variance in cooperative growth, visitor confidence, and environmental resilience side-by-side.
          </p>
        </div>
      </div>

      {/* SELECTION CARD ROW */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* City A Selector */}
        <div className="bg-brand-dark p-6 rounded-[32px] border border-brand-teal/20 text-white space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-mono font-extrabold uppercase text-slate-400 tracking-widest">Heritage City A</span>
            <span className="text-xl">{CITY_LABELS[cityAId].icon}</span>
          </div>

          <div className="space-y-3">
            <select
              value={cityAId}
              onChange={(e) => {
                const nextVal = e.target.value as any;
                if (nextVal === cityBId) {
                  // Swap if selected the same
                  setCityBId(cityAId);
                }
                setCityAId(nextVal);
              }}
              className="w-full bg-brand-bg border border-brand-teal/20 focus:border-brand-rose/50 rounded-xl px-4 py-3 text-sm font-bold text-white outline-none transition-all cursor-pointer"
            >
              <option value="varanasi">Varanasi (Kashi)</option>
              <option value="jaipur">Jaipur (Pink City)</option>
              <option value="kochi">Kochi (Malabar)</option>
              <option value="hampi">Hampi (Vijayanagara)</option>
            </select>

            <div className="grid grid-cols-3 gap-1.5">
              {(['unregulated', 'swadeshi', 'simulator'] as const).map((mode) => {
                const modeLabels = { unregulated: "Low Reg", swadeshi: "Swadeshi", simulator: "Custom" };
                const isActive = presetModeA === mode;
                return (
                  <button
                    key={mode}
                    onClick={() => setPresetModeA(mode)}
                    className={`py-1.5 text-[10px] font-bold rounded-lg uppercase tracking-wide border transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-brand-rose/20 text-brand-rose border-brand-rose/30' 
                        : 'bg-brand-bg/50 text-slate-400 border-brand-teal/10 hover:border-brand-teal/20'
                    }`}
                  >
                    {modeLabels[mode]}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-2 flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${CITY_LABELS[cityAId].color}`} />
            <span className="text-xs text-slate-300 font-semibold truncate">
              {CITY_LABELS[cityAId].name} — {CITY_LABELS[cityAId].tag}
            </span>
          </div>
        </div>

        {/* City B Selector */}
        <div className="bg-brand-dark p-6 rounded-[32px] border border-brand-teal/20 text-white space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-mono font-extrabold uppercase text-brand-teal tracking-widest">Heritage City B</span>
            <span className="text-xl">{CITY_LABELS[cityBId].icon}</span>
          </div>

          <div className="space-y-3">
            <select
              value={cityBId}
              onChange={(e) => {
                const nextVal = e.target.value as any;
                if (nextVal === cityAId) {
                  // Swap if selected the same
                  setCityAId(cityBId);
                }
                setCityBId(nextVal);
              }}
              className="w-full bg-brand-bg border border-brand-teal/20 focus:border-brand-teal/50 rounded-xl px-4 py-3 text-sm font-bold text-white outline-none transition-all cursor-pointer"
            >
              <option value="varanasi">Varanasi (Kashi)</option>
              <option value="jaipur">Jaipur (Pink City)</option>
              <option value="kochi">Kochi (Malabar)</option>
              <option value="hampi">Hampi (Vijayanagara)</option>
            </select>

            <div className="grid grid-cols-3 gap-1.5">
              {(['unregulated', 'swadeshi', 'simulator'] as const).map((mode) => {
                const modeLabels = { unregulated: "Low Reg", swadeshi: "Swadeshi", simulator: "Custom" };
                const isActive = presetModeB === mode;
                return (
                  <button
                    key={mode}
                    onClick={() => setPresetModeB(mode)}
                    className={`py-1.5 text-[10px] font-bold rounded-lg uppercase tracking-wide border transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-brand-teal/20 text-brand-teal border-brand-teal/30' 
                        : 'bg-brand-bg/50 text-slate-400 border-brand-teal/10 hover:border-brand-teal/20'
                    }`}
                  >
                    {modeLabels[mode]}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-2 flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${CITY_LABELS[cityBId].color}`} />
            <span className="text-xs text-slate-300 font-semibold truncate">
              {CITY_LABELS[cityBId].name} — {CITY_LABELS[cityBId].tag}
            </span>
          </div>
        </div>

      </div>

      {/* CORE PERFORMANCE SIDE-BY-SIDE ANALYZER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: VISUAL COMPARISON CHART PILE */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex justify-between items-center px-1">
            <div>
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider font-display flex items-center gap-1.5">
                <Building className="h-4 w-4 text-brand-rose" />
                Live Civic Metric Variance
              </h3>
              <p className="text-[10px] text-slate-400">Comparing real-time calculated indices of both administrations</p>
            </div>
            
            <button
              onClick={handleShareResult}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-bg border border-brand-teal/15 hover:border-brand-teal/30 text-slate-300 text-[10.5px] font-bold uppercase rounded-lg tracking-wider transition-all cursor-pointer"
            >
              <Share2 className="h-3.5 w-3.5" />
              <span>{shareSuccess ? "Copied!" : "Copy Report"}</span>
            </button>
          </div>

          <div className="bg-brand-dark p-6 rounded-[32px] border border-brand-teal/20 shadow-xl text-white space-y-5">
            {metricSpecs.map((spec) => {
              const valA = metricsA[spec.key as keyof SimulationResult] as number;
              const valB = metricsB[spec.key as keyof SimulationResult] as number;
              const diff = valB - valA;
              const isNeutral = diff === 0;
              const isPositiveChange = diff > 0;
              const cityBIsBetter = spec.higherIsBetter ? isPositiveChange : !isPositiveChange;
              
              // Winner designation color
              const isCityAWinner = isNeutral ? false : !cityBIsBetter;
              const isCityBWinner = isNeutral ? false : cityBIsBetter;

              return (
                <div key={spec.key} className="space-y-2 pb-4 border-b border-brand-teal/5 last:border-0 last:pb-0">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-mono font-extrabold text-slate-300 uppercase tracking-widest">{spec.label}</span>
                    <span className="text-[10px] text-slate-500">Unit: {spec.unit}</span>
                  </div>

                  <div className="grid grid-cols-12 gap-4 items-center">
                    
                    {/* City A Bar Value */}
                    <div className="col-span-5 flex items-center gap-2">
                      <div className="text-right w-14 shrink-0">
                        <span className={`text-sm font-mono font-black ${isCityAWinner ? "text-brand-rose" : "text-slate-400"}`}>
                          {valA}{spec.unit}
                        </span>
                      </div>
                      
                      <div className="relative h-2 w-full bg-brand-bg rounded-full overflow-hidden">
                        <motion.div 
                          className={`absolute right-0 top-0 h-full rounded-full bg-gradient-to-r ${CITY_LABELS[cityAId].color}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(100, Math.max(0, spec.unit === "/100" ? valA : valA))}%` }}
                          transition={{ duration: 0.4 }}
                        />
                      </div>
                    </div>

                    {/* Metric Label / Delta */}
                    <div className="col-span-2 text-center flex flex-col justify-center items-center">
                      {isNeutral ? (
                        <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-widest bg-brand-bg px-1.5 py-0.5 rounded-md">Equal</span>
                      ) : (
                        <div className={`flex items-center text-[9px] font-mono font-black px-1.5 py-0.5 rounded-md ${
                          cityBIsBetter ? 'bg-brand-teal/10 text-brand-teal' : 'bg-brand-rose/10 text-brand-rose'
                        }`}>
                          {diff > 0 ? `+${diff.toFixed(1)}` : diff.toFixed(1)}
                        </div>
                      )}
                    </div>

                    {/* City B Bar Value */}
                    <div className="col-span-5 flex items-center gap-2">
                      <div className="relative h-2 w-full bg-brand-bg rounded-full overflow-hidden">
                        <motion.div 
                          className={`absolute left-0 top-0 h-full rounded-full bg-gradient-to-r ${CITY_LABELS[cityBId].color}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(100, Math.max(0, spec.unit === "/100" ? valB : valB))}%` }}
                          transition={{ duration: 0.4 }}
                        />
                      </div>

                      <div className="text-left w-14 shrink-0">
                        <span className={`text-sm font-mono font-black ${isCityBWinner ? "text-brand-teal" : "text-slate-400"}`}>
                          {valB}{spec.unit}
                        </span>
                      </div>
                    </div>

                  </div>

                  {/* Highlights */}
                  <div className="flex justify-between items-center px-1 text-[9px] font-bold">
                    <span className={`${isCityAWinner ? 'text-brand-rose' : 'text-slate-500'}`}>
                      {isCityAWinner ? "🏆 Outperforming" : ""}
                    </span>
                    <span className={`${isCityBWinner ? 'text-brand-teal' : 'text-slate-500'}`}>
                      {isCityBWinner ? "🏆 Outperforming" : ""}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* AI GENERATOR TRIGGER CARD */}
          <div className="bg-brand-dark p-6 rounded-[32px] border border-brand-teal/20 text-white space-y-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-brand-rose/10 border border-brand-rose/20 rounded-xl text-brand-rose">
                <Sparkles className="h-5 w-5 animate-pulse" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-200 font-display">Swadeshi Comparison Brain</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Let Gemini analyze trade-offs, cooperative metrics, and strategic variances.</p>
              </div>
            </div>

            <button
              onClick={fetchAiComparison}
              disabled={isLoadingAi}
              className="w-full py-3 bg-gradient-to-r from-brand-rose to-brand-teal hover:opacity-90 text-brand-deep rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoadingAi ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Synthesizing comparative model...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate AI Comparative Assessment
                </>
              )}
            </button>

            {/* AI BRIEF VISUALIZATION CONTAINER */}
            <AnimatePresence mode="wait">
              {aiBrief && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-brand-bg/50 p-5 rounded-2xl border border-brand-teal/15 text-xs text-slate-300 leading-relaxed font-medium space-y-4 overflow-hidden"
                >
                  <div className="flex items-center gap-1.5 border-b border-brand-teal/10 pb-2.5 text-brand-teal font-extrabold text-[10px] uppercase tracking-wider">
                    <BookOpen className="h-4 w-4 shrink-0" />
                    <span>Gemini Strategic Report</span>
                  </div>
                  
                  <div className="prose prose-invert max-w-none text-slate-300 space-y-3 font-semibold">
                    {aiBrief.split("\n\n").map((para, i) => {
                      if (para.startsWith("###")) {
                        return <h4 key={i} className="text-sm font-black text-white font-display border-t border-brand-teal/5 pt-3 first:border-0 first:pt-0 mt-3">{para.replace("###", "").trim()}</h4>;
                      }
                      if (para.startsWith("* ")) {
                        return (
                          <ul key={i} className="space-y-1.5 pl-4 list-disc">
                            {para.split("\n").map((li, idx) => (
                              <li key={idx} className="marker:text-brand-teal">{li.replace("* ", "").trim()}</li>
                            ))}
                          </ul>
                        );
                      }
                      return <p key={i}>{para}</p>;
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

        {/* RIGHT COLUMN: DOUBLE POLICY TWEAK PANEL */}
        <div className="lg:col-span-5 space-y-6 bg-brand-dark p-6 rounded-[32px] border border-brand-teal/20 text-white shadow-xl">
          
          <div className="border-b border-brand-teal/10 pb-3 flex justify-between items-center">
            <div>
              <h3 className="text-xs font-extrabold text-white font-display uppercase tracking-widest flex items-center gap-1.5">
                <Sliders className="h-4 w-4 text-brand-rose" />
                Comparative Slider Deck
              </h3>
              <p className="text-[10px] text-slate-400 mt-1">Directly adjust policies of each city to watch metrics change.</p>
            </div>
          </div>

          {/* Quick city tuner selector tabs */}
          <div className="flex bg-brand-bg rounded-xl p-1 border border-brand-teal/10">
            <button
              onClick={() => setFocusedControlCity('A')}
              className={`flex-1 py-2 text-center text-xs font-extrabold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                focusedControlCity === 'A' 
                  ? 'bg-brand-rose text-brand-deep shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Tune {CITY_LABELS[cityAId].name}
            </button>
            <button
              onClick={() => setFocusedControlCity('B')}
              className={`flex-1 py-2 text-center text-xs font-extrabold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                focusedControlCity === 'B' 
                  ? 'bg-brand-teal text-brand-deep shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Tune {CITY_LABELS[cityBId].name}
            </button>
          </div>

          {/* Dynamic Sliders for focused city */}
          {focusedControlCity === 'A' ? (
            <div className="space-y-5 animate-fade-in">
              <div className="bg-brand-bg/40 p-4 rounded-2xl border border-brand-teal/10">
                <span className="text-[9px] font-mono text-brand-rose font-bold uppercase tracking-widest block mb-1">Target Active</span>
                <span className="text-xs font-bold text-white">{CITY_LABELS[cityAId].name} Configuration</span>
              </div>

              {/* Slider 1 */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-semibold">Eco-Vehicle Subsidy</span>
                  <span className="font-mono font-extrabold text-brand-rose">₹{inputsA.rickshawSubsidy}/mo</span>
                </div>
                <input 
                  type="range"
                  min="1000"
                  max="10000"
                  step="500"
                  value={inputsA.rickshawSubsidy}
                  onChange={(e) => handleSliderChange('A', 'rickshawSubsidy', parseInt(e.target.value))}
                  className="w-full accent-brand-rose h-1 bg-brand-bg rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-[9px] text-slate-500 block leading-tight">Controls EV battery grants for rickshaw/boat operators</span>
              </div>

              {/* Slider 2 */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-semibold">Preservation Budget</span>
                  <span className="font-mono font-extrabold text-brand-rose">₹{inputsA.wasteManagementBudget} Lakhs</span>
                </div>
                <input 
                  type="range"
                  min="50"
                  max="500"
                  step="10"
                  value={inputsA.wasteManagementBudget}
                  onChange={(e) => handleSliderChange('A', 'wasteManagementBudget', parseInt(e.target.value))}
                  className="w-full accent-brand-rose h-1 bg-brand-bg rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-[9px] text-slate-500 block leading-tight">Monthly sanitation and water channel sweeping funding</span>
              </div>

              {/* Slider 3 */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-semibold">Safety Patrol Intensity</span>
                  <span className="font-mono font-extrabold text-brand-rose">{inputsA.safetyPatrolIntensity} daily</span>
                </div>
                <input 
                  type="range"
                  min="1"
                  max="20"
                  step="1"
                  value={inputsA.safetyPatrolIntensity}
                  onChange={(e) => handleSliderChange('A', 'safetyPatrolIntensity', parseInt(e.target.value))}
                  className="w-full accent-brand-rose h-1 bg-brand-bg rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-[9px] text-slate-500 block leading-tight">Patrols per tourist lane daily to prevent guide/scam traps</span>
              </div>

              {/* Slider 4 */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-semibold">Middlemen Commission Cap</span>
                  <span className="font-mono font-extrabold text-brand-rose">{inputsA.middlemenCommissionCap}% maximum</span>
                </div>
                <input 
                  type="range"
                  min="5"
                  max="50"
                  step="1"
                  value={inputsA.middlemenCommissionCap}
                  onChange={(e) => handleSliderChange('A', 'middlemenCommissionCap', parseInt(e.target.value))}
                  className="w-full accent-brand-rose h-1 bg-brand-bg rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-[9px] text-slate-500 block leading-tight">Limits profit cut extracted by emporiums/middlemen brokers</span>
              </div>

              {/* Toggle Rate Registry */}
              <div className="flex justify-between items-center p-3 bg-brand-bg/40 rounded-xl border border-brand-teal/10">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold block text-white">Standard Fares Registry</span>
                  <span className="text-[9px] text-slate-400 block">Requires fixed boat/cart fares</span>
                </div>
                <button
                  onClick={() => handleSliderChange('A', 'standardizedRatesEnabled', !inputsA.standardizedRatesEnabled)}
                  className={`w-12 h-6 rounded-full p-1 transition-all cursor-pointer ${
                    inputsA.standardizedRatesEnabled ? "bg-brand-rose" : "bg-slate-700"
                  }`}
                >
                  <div className={`bg-brand-dark w-4 h-4 rounded-full shadow-md transition-all ${
                    inputsA.standardizedRatesEnabled ? "translate-x-6" : ""
                  }`} />
                </button>
              </div>

              {/* Tourist multiplier */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-semibold">Tourist Load Multiplier</span>
                  <span className="font-mono font-extrabold text-brand-rose">{inputsA.touristMultiplier}x</span>
                </div>
                <input 
                  type="range"
                  min="0.5"
                  max="3.0"
                  step="0.1"
                  value={inputsA.touristMultiplier}
                  onChange={(e) => handleSliderChange('A', 'touristMultiplier', parseFloat(e.target.value))}
                  className="w-full accent-brand-rose h-1 bg-brand-bg rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Environmental stress */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase text-slate-400">Weather Hazard Stress</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['low', 'medium', 'high'] as const).map((h) => {
                    const isActive = inputsA.weatherHazard === h;
                    return (
                      <button
                        key={h}
                        onClick={() => handleSliderChange('A', 'weatherHazard', h)}
                        className={`py-2 text-xs font-bold rounded-lg uppercase border transition-all cursor-pointer ${
                          isActive 
                            ? 'bg-brand-rose text-brand-deep border-brand-rose/30 font-black' 
                            : 'bg-brand-bg/50 text-slate-400 border-brand-teal/10'
                        }`}
                      >
                        {h}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          ) : (
            <div className="space-y-5 animate-fade-in">
              <div className="bg-brand-bg/40 p-4 rounded-2xl border border-brand-teal/10">
                <span className="text-[9px] font-mono text-brand-teal font-bold uppercase tracking-widest block mb-1">Target Active</span>
                <span className="text-xs font-bold text-white">{CITY_LABELS[cityBId].name} Configuration</span>
              </div>

              {/* Slider 1 */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-semibold">Eco-Vehicle Subsidy</span>
                  <span className="font-mono font-extrabold text-brand-teal">₹{inputsB.rickshawSubsidy}/mo</span>
                </div>
                <input 
                  type="range"
                  min="1000"
                  max="10000"
                  step="500"
                  value={inputsB.rickshawSubsidy}
                  onChange={(e) => handleSliderChange('B', 'rickshawSubsidy', parseInt(e.target.value))}
                  className="w-full accent-brand-teal h-1 bg-brand-bg rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-[9px] text-slate-500 block leading-tight">Controls EV battery grants for rickshaw/boat operators</span>
              </div>

              {/* Slider 2 */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-semibold">Preservation Budget</span>
                  <span className="font-mono font-extrabold text-brand-teal">₹{inputsB.wasteManagementBudget} Lakhs</span>
                </div>
                <input 
                  type="range"
                  min="50"
                  max="500"
                  step="10"
                  value={inputsB.wasteManagementBudget}
                  onChange={(e) => handleSliderChange('B', 'wasteManagementBudget', parseInt(e.target.value))}
                  className="w-full accent-brand-teal h-1 bg-brand-bg rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-[9px] text-slate-500 block leading-tight">Monthly sanitation and water channel sweeping funding</span>
              </div>

              {/* Slider 3 */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-semibold">Safety Patrol Intensity</span>
                  <span className="font-mono font-extrabold text-brand-teal">{inputsB.safetyPatrolIntensity} daily</span>
                </div>
                <input 
                  type="range"
                  min="1"
                  max="20"
                  step="1"
                  value={inputsB.safetyPatrolIntensity}
                  onChange={(e) => handleSliderChange('B', 'safetyPatrolIntensity', parseInt(e.target.value))}
                  className="w-full accent-brand-teal h-1 bg-brand-bg rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-[9px] text-slate-500 block leading-tight">Patrols per tourist lane daily to prevent guide/scam traps</span>
              </div>

              {/* Slider 4 */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-semibold">Middlemen Commission Cap</span>
                  <span className="font-mono font-extrabold text-brand-teal">{inputsB.middlemenCommissionCap}% maximum</span>
                </div>
                <input 
                  type="range"
                  min="5"
                  max="50"
                  step="1"
                  value={inputsB.middlemenCommissionCap}
                  onChange={(e) => handleSliderChange('B', 'middlemenCommissionCap', parseInt(e.target.value))}
                  className="w-full accent-brand-teal h-1 bg-brand-bg rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-[9px] text-slate-500 block leading-tight">Limits profit cut extracted by emporiums/middlemen brokers</span>
              </div>

              {/* Toggle Rate Registry */}
              <div className="flex justify-between items-center p-3 bg-brand-bg/40 rounded-xl border border-brand-teal/10">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold block text-white">Standard Fares Registry</span>
                  <span className="text-[9px] text-slate-400 block">Requires fixed boat/cart fares</span>
                </div>
                <button
                  onClick={() => handleSliderChange('B', 'standardizedRatesEnabled', !inputsB.standardizedRatesEnabled)}
                  className={`w-12 h-6 rounded-full p-1 transition-all cursor-pointer ${
                    inputsB.standardizedRatesEnabled ? "bg-brand-teal" : "bg-slate-700"
                  }`}
                >
                  <div className={`bg-brand-dark w-4 h-4 rounded-full shadow-md transition-all ${
                    inputsB.standardizedRatesEnabled ? "translate-x-6" : ""
                  }`} />
                </button>
              </div>

              {/* Tourist multiplier */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-semibold">Tourist Load Multiplier</span>
                  <span className="font-mono font-extrabold text-brand-teal">{inputsB.touristMultiplier}x</span>
                </div>
                <input 
                  type="range"
                  min="0.5"
                  max="3.0"
                  step="0.1"
                  value={inputsB.touristMultiplier}
                  onChange={(e) => handleSliderChange('B', 'touristMultiplier', parseFloat(e.target.value))}
                  className="w-full accent-brand-teal h-1 bg-brand-bg rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Environmental stress */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase text-slate-400">Weather Hazard Stress</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['low', 'medium', 'high'] as const).map((h) => {
                    const isActive = inputsB.weatherHazard === h;
                    return (
                      <button
                        key={h}
                        onClick={() => handleSliderChange('B', 'weatherHazard', h)}
                        className={`py-2 text-xs font-bold rounded-lg uppercase border transition-all cursor-pointer ${
                          isActive 
                            ? 'bg-brand-teal text-brand-deep border-brand-teal/30 font-black' 
                            : 'bg-brand-bg/50 text-slate-400 border-brand-teal/10'
                        }`}
                      >
                        {h}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}
