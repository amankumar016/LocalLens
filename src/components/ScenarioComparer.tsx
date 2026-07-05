import React, { useState, useEffect } from "react";
import { 
  Layers, 
  Sparkles, 
  Bookmark, 
  Trash2, 
  ArrowRight, 
  GitCompare, 
  TrendingUp, 
  Shield, 
  AlertTriangle, 
  Info, 
  Check, 
  ArrowUpRight, 
  ArrowDownRight,
  Share2
} from "lucide-react";
import { PolicyInputs, SimulationResult, SavedScenario } from "../types";

interface ScenarioComparerProps {
  activeCity: 'varanasi' | 'jaipur' | 'kochi' | 'hampi' | null;
  currentInputs: PolicyInputs;
  currentMetrics: SimulationResult;
  onLoadInputs: (inputs: PolicyInputs) => void;
}

// Preset baseline comparison models for each city
const PRESET_SCENARIOS: Record<string, Omit<SavedScenario, 'timestamp'>[]> = {
  varanasi: [
    {
      id: "varanasi-unregulated",
      name: "Middlemen Dominant (Low Regulation)",
      city: "varanasi",
      isCustom: false,
      inputs: {
        city: "varanasi",
        rickshawSubsidy: 1500,
        wasteManagementBudget: 80,
        safetyPatrolIntensity: 2,
        middlemenCommissionCap: 45,
        standardizedRatesEnabled: false,
        touristMultiplier: 2.0,
        weatherHazard: "low"
      },
      metrics: {
        economicDistribution: 22,
        safetyTrustRating: 44,
        merchantRevenueGrowth: 28,
        complaintsRate: 35,
        trafficCongestion: 68,
        weaverCooperativeIncome: 4,
        ghatCleanliness: 40,
        aiPolicyBrief: "High merchant turnover with highly depressed local weaver and driver wages. Scams on Dashashwamedh Ghat are high due to minimal patrol presence. Standardized fares are absent, yielding peak pricing complaints."
      }
    },
    {
      id: "varanasi-swadeshi",
      name: "Swadeshi Progressive (High Support)",
      city: "varanasi",
      isCustom: false,
      inputs: {
        city: "varanasi",
        rickshawSubsidy: 7500,
        wasteManagementBudget: 350,
        safetyPatrolIntensity: 12,
        middlemenCommissionCap: 15,
        standardizedRatesEnabled: true,
        touristMultiplier: 1.5,
        weatherHazard: "low"
      },
      metrics: {
        economicDistribution: 76,
        safetyTrustRating: 88,
        merchantRevenueGrowth: 18,
        complaintsRate: 6,
        trafficCongestion: 30,
        weaverCooperativeIncome: 32,
        ghatCleanliness: 82,
        aiPolicyBrief: "Superb wealth distribution with weaver and river boatman incomes peaking. High safety patrols combined with standard rates have completely neutralized the local commission lobby. Lanes are highly walkable."
      }
    }
  ],
  jaipur: [
    {
      id: "jaipur-unregulated",
      name: "Middlemen Dominant (Low Regulation)",
      city: "jaipur",
      isCustom: false,
      inputs: {
        city: "jaipur",
        rickshawSubsidy: 2000,
        wasteManagementBudget: 100,
        safetyPatrolIntensity: 3,
        middlemenCommissionCap: 48,
        standardizedRatesEnabled: false,
        touristMultiplier: 2.5,
        weatherHazard: "low"
      },
      metrics: {
        economicDistribution: 26,
        safetyTrustRating: 48,
        merchantRevenueGrowth: 32,
        complaintsRate: 29,
        trafficCongestion: 70,
        weaverCooperativeIncome: 5,
        ghatCleanliness: 45,
        aiPolicyBrief: "High volume sales in the Johari Bazaar corridor, but blue pottery artisans and traditional puppeteers receive very minor portions of margins. Rickshaw cart drivers face severe congestion and poor battery support."
      }
    },
    {
      id: "jaipur-swadeshi",
      name: "Swadeshi Progressive (High Support)",
      city: "jaipur",
      isCustom: false,
      inputs: {
        city: "jaipur",
        rickshawSubsidy: 8000,
        wasteManagementBudget: 400,
        safetyPatrolIntensity: 14,
        middlemenCommissionCap: 10,
        standardizedRatesEnabled: true,
        touristMultiplier: 1.8,
        weatherHazard: "low"
      },
      metrics: {
        economicDistribution: 80,
        safetyTrustRating: 92,
        merchantRevenueGrowth: 20,
        complaintsRate: 4,
        trafficCongestion: 35,
        weaverCooperativeIncome: 36,
        ghatCleanliness: 88,
        aiPolicyBrief: "Regulated commission ceilings ensure local pottery cooperatives and puppet makers retain 90% of their craftsmanship retail values. Clean air corridors are active with standard rate registries working seamlessly."
      }
    }
  ],
  kochi: [
    {
      id: "kochi-unregulated",
      name: "Middlemen Dominant (Low Regulation)",
      city: "kochi",
      isCustom: false,
      inputs: {
        city: "kochi",
        rickshawSubsidy: 1800,
        wasteManagementBudget: 90,
        safetyPatrolIntensity: 2,
        middlemenCommissionCap: 40,
        standardizedRatesEnabled: false,
        touristMultiplier: 2.2,
        weatherHazard: "low"
      },
      metrics: {
        economicDistribution: 24,
        safetyTrustRating: 50,
        merchantRevenueGrowth: 26,
        complaintsRate: 25,
        trafficCongestion: 58,
        weaverCooperativeIncome: 6,
        ghatCleanliness: 48,
        aiPolicyBrief: "Chinese fishing net operators and coir weavers struggle with high middleman broker levies. Traditional performance actors and mask makers are poorly funded, though tourist spending is high."
      }
    },
    {
      id: "kochi-swadeshi",
      name: "Swadeshi Progressive (High Support)",
      city: "kochi",
      isCustom: false,
      inputs: {
        city: "kochi",
        rickshawSubsidy: 7000,
        wasteManagementBudget: 380,
        safetyPatrolIntensity: 11,
        middlemenCommissionCap: 15,
        standardizedRatesEnabled: true,
        touristMultiplier: 1.4,
        weatherHazard: "low"
      },
      metrics: {
        economicDistribution: 74,
        safetyTrustRating: 90,
        merchantRevenueGrowth: 17,
        complaintsRate: 5,
        trafficCongestion: 28,
        weaverCooperativeIncome: 30,
        ghatCleanliness: 85,
        aiPolicyBrief: "Massive support for the local fishermen and coir workers union. High waste budgets clean Mattancherry Spice channels effectively, attracting high-trust regional eco-explorers."
      }
    }
  ],
  hampi: [
    {
      id: "hampi-unregulated",
      name: "Middlemen Dominant (Low Regulation)",
      city: "hampi",
      isCustom: false,
      inputs: {
        city: "hampi",
        rickshawSubsidy: 1200,
        wasteManagementBudget: 60,
        safetyPatrolIntensity: 1,
        middlemenCommissionCap: 50,
        standardizedRatesEnabled: false,
        touristMultiplier: 2.0,
        weatherHazard: "low"
      },
      metrics: {
        economicDistribution: 20,
        safetyTrustRating: 42,
        merchantRevenueGrowth: 24,
        complaintsRate: 38,
        trafficCongestion: 60,
        weaverCooperativeIncome: 3,
        ghatCleanliness: 38,
        aiPolicyBrief: "Severe overcharging for coracle boat river crossings. Banana fiber crafters have limited market linkages and pocket extremely slim revenues compared to corporate resort distributors."
      }
    },
    {
      id: "hampi-swadeshi",
      name: "Swadeshi Progressive (High Support)",
      city: "hampi",
      isCustom: false,
      inputs: {
        city: "hampi",
        rickshawSubsidy: 7200,
        wasteManagementBudget: 320,
        safetyPatrolIntensity: 10,
        middlemenCommissionCap: 12,
        standardizedRatesEnabled: true,
        touristMultiplier: 1.3,
        weatherHazard: "low"
      },
      metrics: {
        economicDistribution: 78,
        safetyTrustRating: 89,
        merchantRevenueGrowth: 15,
        complaintsRate: 7,
        trafficCongestion: 25,
        weaverCooperativeIncome: 28,
        ghatCleanliness: 80,
        aiPolicyBrief: "Coracle boat associations run standardized ticket lines securely. Banana fiber eco-handicrafts are booming, backed by strong cooperative micro-credits and pristine archaeological pathways."
      }
    }
  ]
};

export default function ScenarioComparer({
  activeCity,
  currentInputs,
  currentMetrics,
  onLoadInputs
}: ScenarioComparerProps) {
  
  const [scenarios, setScenarios] = useState<SavedScenario[]>([]);
  const [selectedScenarioAId, setSelectedScenarioAId] = useState<string>("active");
  const [selectedScenarioBId, setSelectedScenarioBId] = useState<string>("");
  const [newScenarioName, setNewScenarioName] = useState<string>("");
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Load scenarios from localStorage and prepend current presets
  useEffect(() => {
    if (!activeCity) {
      setScenarios([]);
      return;
    }
    const saved = localStorage.getItem("civic_heritage_scenarios");
    const parsed: SavedScenario[] = saved ? JSON.parse(saved) : [];
    
    // Filter down to the presets for the activeCity + saved scenarios for activeCity
    const presetsForCity = (PRESET_SCENARIOS[activeCity] || []).map(p => ({
      ...p,
      timestamp: new Date().toLocaleDateString()
    }));

    const finalScenariosList = [
      ...presetsForCity,
      ...parsed.filter(s => s.city === activeCity)
    ];

    setScenarios(finalScenariosList);

    // Default Scenario B to the swadeshi preset if available
    const swadeshiPreset = presetsForCity.find(p => p.id.includes("swadeshi"));
    if (swadeshiPreset) {
      setSelectedScenarioBId(swadeshiPreset.id);
    } else if (finalScenariosList.length > 0) {
      setSelectedScenarioBId(finalScenariosList[0].id);
    }
  }, [activeCity]);

  // Handle saving the CURRENT simulation state
  const handleSaveCurrentState = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newScenarioName.trim() || !activeCity) return;

    const newScenario: SavedScenario = {
      id: "custom-" + Date.now(),
      name: newScenarioName.trim(),
      timestamp: new Date().toLocaleString(),
      city: activeCity,
      inputs: { ...currentInputs },
      metrics: { ...currentMetrics },
      isCustom: true
    };

    // Save to localStorage
    const saved = localStorage.getItem("civic_heritage_scenarios");
    const parsed: SavedScenario[] = saved ? JSON.parse(saved) : [];
    const updated = [newScenario, ...parsed];
    localStorage.setItem("civic_heritage_scenarios", JSON.stringify(updated));

    // Update state
    const presetsForCity = (PRESET_SCENARIOS[activeCity] || []).map(p => ({
      ...p,
      timestamp: new Date().toLocaleDateString()
    }));
    
    setScenarios([
      ...presetsForCity,
      ...updated.filter(s => s.city === activeCity)
    ]);

    setNewScenarioName("");
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);

    // Set comparison selection to this newly saved custom scenario
    setSelectedScenarioAId(newScenario.id);
  };

  // Handle deleting a custom scenario
  const handleDeleteScenario = (id: string) => {
    const saved = localStorage.getItem("civic_heritage_scenarios");
    const parsed: SavedScenario[] = saved ? JSON.parse(saved) : [];
    const filtered = parsed.filter(s => s.id !== id);
    localStorage.setItem("civic_heritage_scenarios", JSON.stringify(filtered));

    const presetsForCity = (PRESET_SCENARIOS[activeCity] || []).map(p => ({
      ...p,
      timestamp: new Date().toLocaleDateString()
    }));

    setScenarios([
      ...presetsForCity,
      ...filtered.filter(s => s.city === activeCity)
    ]);

    // Reset selection if deleted
    if (selectedScenarioAId === id) setSelectedScenarioAId("active");
    if (selectedScenarioBId === id) {
      const remaining = presetsForCity.find(p => p.id.includes("swadeshi"));
      setSelectedScenarioBId(remaining ? remaining.id : "active");
    }
  };

  // Build temporary object for "active" simulation to compare with saved
  const activeScenario: SavedScenario = {
    id: "active",
    name: "Active Simulation State",
    timestamp: "Real-time",
    city: activeCity,
    inputs: currentInputs,
    metrics: currentMetrics,
    isCustom: false
  };

  const getScenarioById = (id: string): SavedScenario | undefined => {
    if (id === "active") return activeScenario;
    return scenarios.find(s => s.id === id);
  };

  const scenarioA = getScenarioById(selectedScenarioAId) || activeScenario;
  const scenarioB = getScenarioById(selectedScenarioBId);

  // Helper to draw clean comparison indicators
  const renderComparisonRow = (
    label: string, 
    valA: number, 
    valB: number, 
    unit: string = "%", 
    higherIsBetter: boolean = true
  ) => {
    const diff = valB - valA;
    const isNeutral = diff === 0;
    const isPositiveChange = diff > 0;
    const isGoodChange = higherIsBetter ? isPositiveChange : !isPositiveChange;
    
    let diffColorClass = "text-slate-400";
    let Icon = null;
    
    if (!isNeutral) {
      if (isGoodChange) {
        diffColorClass = "text-brand-teal font-extrabold";
        Icon = ArrowUpRight;
      } else {
        diffColorClass = "text-brand-rose font-extrabold";
        Icon = ArrowDownRight;
      }
    }

    return (
      <div className="bg-brand-bg/30 p-4 rounded-2xl border border-brand-teal/10 hover:border-brand-teal/20 transition-all flex flex-col space-y-3">
        <span className="text-[10px] font-mono font-extrabold text-slate-400 uppercase tracking-widest">{label}</span>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <span className="text-[9px] text-slate-500 uppercase tracking-wider">Scenario A</span>
              <span className="text-xl font-mono font-black text-slate-200">{valA}{unit}</span>
            </div>
            
            <ArrowRight className="h-4 w-4 text-slate-600 shrink-0 self-end mb-1" />

            <div className="flex flex-col">
              <span className="text-[9px] text-brand-teal uppercase tracking-wider">Scenario B</span>
              <span className="text-xl font-mono font-black text-white">{valB}{unit}</span>
            </div>
          </div>

          <div className="flex flex-col items-end">
            <span className="text-[8.5px] text-slate-500 uppercase tracking-wider">Variance</span>
            <div className={`flex items-center gap-0.5 text-sm ${diffColorClass}`}>
              {Icon && <Icon className="h-4 w-4 shrink-0" />}
              <span>{diff > 0 ? `+${diff.toFixed(0)}` : diff.toFixed(0)}{unit}</span>
            </div>
          </div>
        </div>

        {/* Dual dynamic overlapping bar chart */}
        <div className="relative h-2 bg-brand-bg rounded-full overflow-hidden">
          {/* Scenario A (Background) */}
          <div 
            className="absolute top-0 left-0 h-full bg-slate-500/40 rounded-full transition-all duration-500" 
            style={{ width: `${Math.min(100, Math.max(0, valA))}%` }} 
          />
          {/* Scenario B (Foreground) */}
          <div 
            className={`absolute top-0 left-0 h-full rounded-full transition-all duration-500 ${isGoodChange ? 'bg-brand-teal' : 'bg-brand-rose'}`} 
            style={{ width: `${Math.min(100, Math.max(0, valB))}%`, opacity: 0.85 }} 
          />
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-10 lg:col-span-12" id="scenario-comparer-viewport">
      
      {/* Banner introduction with color palette style */}
      <div className="relative p-8 md:p-10 rounded-[40px] overflow-hidden bg-brand-dark border border-brand-teal/20 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-rose/10 rounded-full blur-3xl pointer-events-none -translate-y-20 translate-x-10" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-teal/5 rounded-full blur-3xl pointer-events-none translate-y-20 -translate-x-10" />
        
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-teal/15 rounded-full text-[10px] font-bold uppercase tracking-wider text-brand-teal border border-brand-teal/20">
            <GitCompare className="h-3.5 w-3.5" />
            <span>Policy Variance Matrix</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-none font-display">
            Scenario Comparison <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-rose to-amber-300">Analyzer</span>
          </h2>
          
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed max-w-2xl font-medium">
            Lock active simulation metrics and compare them side-by-side with municipal guidelines or custom policy combinations. Understand how strategic adjustments directly move livelihoods, safety, and sanitation indices.
          </p>
        </div>
      </div>

      {/* TWO COLUMN INTERACTION PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT DECK: SAVE SCENARIO & CHOOSE TARGETS */}
        <div className="lg:col-span-4 bg-brand-dark p-6 rounded-[32px] border border-brand-teal/20 shadow-xl space-y-6 text-white">
          
          {/* Action 1: Save Current Simulation State */}
          <div className="space-y-4">
            <div className="border-b border-brand-teal/10 pb-3">
              <h3 className="text-xs font-extrabold text-white font-display uppercase tracking-widest flex items-center gap-1.5">
                <Bookmark className="h-4 w-4 text-brand-rose" />
                Capture Current Scenario
              </h3>
              <p className="text-[10px] text-slate-400 mt-1">Snapshot the active sliders & metrics on your screen.</p>
            </div>

            <form onSubmit={handleSaveCurrentState} className="space-y-3">
              <div>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Swadeshi Weavers Push"
                  value={newScenarioName}
                  onChange={(e) => setNewScenarioName(e.target.value)}
                  className="w-full bg-brand-bg border border-brand-teal/15 focus:border-brand-rose/50 rounded-xl px-3.5 py-2 text-xs font-bold text-white transition-all outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-brand-rose hover:bg-brand-rose/90 text-brand-deep rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Sparkles className="h-4 w-4" />
                Save Scenario State
              </button>
            </form>

            {saveSuccess && (
              <div className="flex items-center gap-1.5 p-3.5 bg-brand-teal/10 border border-brand-teal/30 rounded-xl text-brand-teal text-xs font-bold leading-none animate-fade-in">
                <Check className="h-4 w-4 text-brand-teal" />
                <span>Simulation Captured Successfully!</span>
              </div>
            )}
          </div>

          {/* Action 2: Select comparison slots */}
          <div className="space-y-4 pt-4 border-t border-brand-teal/10">
            <div className="border-b border-brand-teal/10 pb-3">
              <h3 className="text-xs font-extrabold text-white font-display uppercase tracking-widest flex items-center gap-1.5">
                <GitCompare className="h-4 w-4 text-brand-rose" />
                Compare Configuration
              </h3>
              <p className="text-[10px] text-slate-400 mt-1">Select any saved snapshot as your Scenario A and Scenario B.</p>
            </div>

            <div className="space-y-3">
              
              {/* Select Scenario A */}
              <div className="space-y-1.5">
                <label className="text-[9.5px] font-extrabold uppercase tracking-wider text-slate-400">Scenario A (Baseline)</label>
                <select 
                  value={selectedScenarioAId}
                  onChange={(e) => setSelectedScenarioAId(e.target.value)}
                  className="w-full bg-brand-bg border border-brand-teal/15 focus:border-brand-teal/50 rounded-xl px-3 py-2.5 text-xs font-bold text-white transition-all outline-none"
                >
                  <option value="active">Active Simulator Controls (Real-time)</option>
                  {scenarios.map((sc) => (
                    <option key={sc.id} value={sc.id}>
                      {sc.isCustom ? "★ " : "⚖ "}{sc.name} ({sc.timestamp})
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Scenario B */}
              <div className="space-y-1.5">
                <label className="text-[9.5px] font-extrabold uppercase tracking-wider text-brand-teal">Scenario B (Target / Overlay)</label>
                <select 
                  value={selectedScenarioBId}
                  onChange={(e) => setSelectedScenarioBId(e.target.value)}
                  className="w-full bg-brand-bg border border-brand-teal/15 focus:border-brand-teal/50 rounded-xl px-3 py-2.5 text-xs font-bold text-white transition-all outline-none"
                >
                  {selectedScenarioAId !== "active" && (
                    <option value="active">Active Simulator Controls (Real-time)</option>
                  )}
                  {scenarios.map((sc) => (
                    <option key={sc.id} value={sc.id}>
                      {sc.isCustom ? "★ " : "⚖ "}{sc.name} ({sc.timestamp})
                    </option>
                  ))}
                </select>
              </div>

            </div>
          </div>

          {/* Action 3: List custom captures */}
          <div className="space-y-3 pt-4 border-t border-brand-teal/10">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block font-mono">Custom Saved Snapshots</span>
            
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {scenarios.filter(s => s.isCustom).length === 0 ? (
                <div className="text-[10px] text-slate-500 italic py-2 text-center">No custom snapshots captured yet</div>
              ) : (
                scenarios.filter(s => s.isCustom).map((sc) => (
                  <div key={sc.id} className="flex justify-between items-center p-2 bg-brand-bg/30 rounded-xl border border-brand-teal/10 text-xs font-bold">
                    <div className="truncate pr-2">
                      <span className="text-white block truncate">{sc.name}</span>
                      <span className="text-[9px] text-slate-500 font-mono block">{sc.timestamp}</span>
                    </div>
                    
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        title="Load into Simulator"
                        onClick={() => {
                          onLoadInputs(sc.inputs);
                          // Signal action is done
                          alert("Loaded scenario configuration into simulator! Switch back to Scenario Simulator to view and edit.");
                        }}
                        className="p-1 text-brand-teal hover:text-white hover:bg-brand-bg rounded transition-all cursor-pointer"
                      >
                        <TrendingUp className="h-3.5 w-3.5" />
                      </button>

                      <button
                        title="Delete Capture"
                        onClick={() => handleDeleteScenario(sc.id)}
                        className="p-1 text-brand-rose hover:text-white hover:bg-brand-bg rounded transition-all cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: SIDE-BY-SIDE ANALYZER VIEWPORT */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* COMPARISON BAR CARD */}
          {!scenarioB ? (
            <div className="bg-brand-dark/40 p-12 rounded-[32px] border border-brand-teal/10 shadow-md text-center flex flex-col items-center justify-center min-h-[400px] text-slate-300">
              <GitCompare className="h-10 w-10 text-brand-teal mb-4 animate-pulse" />
              <h4 className="text-lg font-bold text-white font-display">Awaiting Scenario Overlay selection</h4>
              <p className="text-xs text-slate-400 mt-2 max-w-sm mx-auto leading-relaxed">
                Choose a baseline and a comparison target in the left deck parameter settings. Our Swadeshi decision models will map out a custom delta analysis.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* COMPARED OVERVIEW TITLES HEADER */}
              <div className="bg-brand-dark p-6 rounded-[32px] border border-brand-teal/20 shadow-xl flex flex-col md:flex-row items-center justify-between text-white gap-4">
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <div className="w-10 h-10 rounded-xl bg-brand-rose/10 flex items-center justify-center text-brand-rose text-lg font-black shrink-0">
                    A
                  </div>
                  <div className="truncate">
                    <span className="text-[10px] font-mono font-extrabold uppercase text-slate-400 block tracking-widest">Baseline Configuration</span>
                    <strong className="text-base text-slate-200 block truncate">{scenarioA.name}</strong>
                  </div>
                </div>

                <div className="h-px w-full md:w-px md:h-10 bg-brand-teal/20" />

                <div className="flex items-center gap-4 w-full md:w-auto">
                  <div className="w-10 h-10 rounded-xl bg-brand-teal/10 flex items-center justify-center text-brand-teal text-lg font-black shrink-0">
                    B
                  </div>
                  <div className="truncate">
                    <span className="text-[10px] font-mono font-extrabold uppercase text-brand-teal block tracking-widest">Overlay target</span>
                    <strong className="text-base text-white block truncate">{scenarioB.name}</strong>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onLoadInputs(scenarioA.inputs);
                    alert(`Loaded ${scenarioA.name} parameters into simulator workspace.`);
                  }}
                  className="px-4 py-2 bg-brand-bg hover:bg-brand-bg/80 border border-brand-teal/15 text-[11px] font-bold uppercase rounded-xl tracking-wider cursor-pointer"
                >
                  Load A To Active
                </button>
              </div>

              {/* CORE METRIC INDEXES GRID */}
              <div className="space-y-4">
                <div className="flex justify-between items-end px-2">
                  <div>
                    <h3 className="text-sm font-extrabold text-white uppercase tracking-wider font-display">Calculated Swadeshi Civic Health Variance</h3>
                    <p className="text-[10px] text-slate-400">Comparing outcomes across essential community parameters</p>
                  </div>
                  <span className="text-[9.5px] font-mono font-black text-brand-rose uppercase">6 Metrics</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderComparisonRow("Livelihood Capital Share", scenarioA.metrics.economicDistribution, scenarioB.metrics.economicDistribution, "%", true)}
                  {renderComparisonRow("Visitor Safety Trust", scenarioA.metrics.safetyTrustRating, scenarioB.metrics.safetyTrustRating, "/100", true)}
                  {renderComparisonRow("Merchant Revenue Growth", scenarioA.metrics.merchantRevenueGrowth, scenarioB.metrics.merchantRevenueGrowth, "%", true)}
                  {renderComparisonRow("Traffic Lanes Congestion", scenarioA.metrics.trafficCongestion, scenarioB.metrics.trafficCongestion, "%", false)}
                  {renderComparisonRow("Cooperative income Growth", scenarioA.metrics.weaverCooperativeIncome, scenarioB.metrics.weaverCooperativeIncome, "%", true)}
                  {renderComparisonRow("Sanitation Cleanliness", scenarioA.metrics.ghatCleanliness, scenarioB.metrics.ghatCleanliness, "%", true)}
                </div>
              </div>

              {/* SLIDERS / CONTROLS DIFFERENCE DECK */}
              <div className="bg-brand-dark p-6 rounded-[32px] border border-brand-teal/20 shadow-xl text-white space-y-4">
                <div className="border-b border-brand-teal/10 pb-3">
                  <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-300 font-mono">
                    Policy Slider Configurations Comparison
                  </h4>
                </div>

                <div className="divide-y divide-brand-teal/10 text-xs">
                  
                  {/* Row 1 */}
                  <div className="py-3 flex justify-between items-center gap-4">
                    <span className="font-semibold text-slate-400">Eco-Vehicle Subsidy:</span>
                    <div className="flex items-center gap-3 font-mono font-extrabold text-right">
                      <span className="text-slate-400">₹{scenarioA.inputs.rickshawSubsidy}/mo</span>
                      <ArrowRight className="h-3 w-3 text-slate-600" />
                      <span className="text-brand-rose">₹{scenarioB.inputs.rickshawSubsidy}/mo</span>
                    </div>
                  </div>

                  {/* Row 2 */}
                  <div className="py-3 flex justify-between items-center gap-4">
                    <span className="font-semibold text-slate-400">Preservation Budget:</span>
                    <div className="flex items-center gap-3 font-mono font-extrabold text-right">
                      <span className="text-slate-400">₹{scenarioA.inputs.wasteManagementBudget} L</span>
                      <ArrowRight className="h-3 w-3 text-slate-600" />
                      <span className="text-brand-rose">₹{scenarioB.inputs.wasteManagementBudget} L</span>
                    </div>
                  </div>

                  {/* Row 3 */}
                  <div className="py-3 flex justify-between items-center gap-4">
                    <span className="font-semibold text-slate-400">Safety patrol presence:</span>
                    <div className="flex items-center gap-3 font-mono font-extrabold text-right">
                      <span className="text-slate-400">{scenarioA.inputs.safetyPatrolIntensity} daily</span>
                      <ArrowRight className="h-3 w-3 text-slate-600" />
                      <span className="text-brand-rose">{scenarioB.inputs.safetyPatrolIntensity} daily</span>
                    </div>
                  </div>

                  {/* Row 4 */}
                  <div className="py-3 flex justify-between items-center gap-4">
                    <span className="font-semibold text-slate-400">Middlemen Commission Cap:</span>
                    <div className="flex items-center gap-3 font-mono font-extrabold text-right">
                      <span className="text-slate-400">{scenarioA.inputs.middlemenCommissionCap}% cap</span>
                      <ArrowRight className="h-3 w-3 text-slate-600" />
                      <span className="text-brand-rose">{scenarioB.inputs.middlemenCommissionCap}% cap</span>
                    </div>
                  </div>

                  {/* Row 5 */}
                  <div className="py-3 flex justify-between items-center gap-4">
                    <span className="font-semibold text-slate-400">Standardized fare registry:</span>
                    <div className="flex items-center gap-3 font-semibold text-right">
                      <span className="text-slate-400">{scenarioA.inputs.standardizedRatesEnabled ? "Enabled" : "Disabled"}</span>
                      <ArrowRight className="h-3 w-3 text-slate-600" />
                      <span className="text-brand-teal font-extrabold">{scenarioB.inputs.standardizedRatesEnabled ? "Enabled" : "Disabled"}</span>
                    </div>
                  </div>

                  {/* Row 6 */}
                  <div className="py-3 flex justify-between items-center gap-4">
                    <span className="font-semibold text-slate-400">Environmental Hazard stress level:</span>
                    <div className="flex items-center gap-3 uppercase font-mono font-extrabold text-right">
                      <span className="text-slate-400">{scenarioA.inputs.weatherHazard}</span>
                      <ArrowRight className="h-3 w-3 text-slate-600" />
                      <span className="text-brand-rose">{scenarioB.inputs.weatherHazard}</span>
                    </div>
                  </div>

                </div>
              </div>

              {/* SIDE BY SIDE POLICY BRIEFS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Brief A */}
                <div className="bg-brand-dark p-6 rounded-[32px] border border-brand-teal/20 text-white space-y-3 shadow-md">
                  <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-slate-400 block border-b border-brand-teal/15 pb-2">
                    A: Baseline Strategic Narrative
                  </span>
                  <p className="text-[11px] text-slate-300 leading-relaxed font-semibold italic">
                    "{scenarioA.metrics.aiPolicyBrief || "No brief synthesized for this snapshot configuration."}"
                  </p>
                </div>

                {/* Brief B */}
                <div className="bg-brand-dark p-6 rounded-[32px] border border-brand-teal/20 text-white space-y-3 shadow-md">
                  <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-brand-teal block border-b border-brand-teal/15 pb-2">
                    B: Overlay Strategic Narrative
                  </span>
                  <p className="text-[11px] text-slate-300 leading-relaxed font-semibold italic">
                    "{scenarioB.metrics.aiPolicyBrief || "No brief synthesized for this snapshot configuration."}"
                  </p>
                </div>

              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}
