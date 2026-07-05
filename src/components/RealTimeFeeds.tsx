import React, { useState, useEffect } from "react";
import { 
  Activity, 
  Wifi, 
  Cpu, 
  TrendingUp, 
  ShieldAlert, 
  Sparkles, 
  RefreshCw, 
  Sliders, 
  MessageSquare, 
  Flame, 
  Wind, 
  Droplet, 
  CheckCircle2, 
  AlertTriangle, 
  Radio, 
  Terminal, 
  Zap,
  Play,
  Check
} from "lucide-react";
import { PolicyInputs, RealTimeFeedData } from "../types";

interface RealTimeFeedsProps {
  activeCity: 'varanasi' | 'jaipur' | 'kochi' | 'hampi' | null;
  inputs: PolicyInputs;
  onUpdatePolicy: (key: keyof PolicyInputs, value: any) => void;
}

interface AutomationRule {
  id: string;
  name: string;
  description: string;
  conditionLabel: string;
  actionLabel: string;
  enabled: boolean;
  status: 'monitoring' | 'triggered' | 'idle';
}

export default function RealTimeFeeds({ activeCity, inputs, onUpdatePolicy }: RealTimeFeedsProps) {
  const [feedData, setFeedData] = useState<RealTimeFeedData | null>(null);
  const [isAutoRefreshing, setIsAutoRefreshing] = useState<boolean>(true);
  const [isRefreshingOnce, setIsRefreshingOnce] = useState<boolean>(false);
  const [logs, setLogs] = useState<string[]>([]);

  // Simulation Overrides State
  const [pm25Override, setPm25Override] = useState<number>(100);
  const [turbidityOverride, setTurbidityOverride] = useState<number>(50);
  const [tempOverride, setTempOverride] = useState<number>(30);
  const [isInjecting, setIsInjecting] = useState<boolean>(false);
  const [injectSuccess, setInjectSuccess] = useState<boolean>(false);

  // Automated Rules Configuration
  const [rules, setRules] = useState<AutomationRule[]>([
    {
      id: "sanitation_surge",
      name: "Eco-Preservation Silt Trigger",
      description: "Triggers when river turbidity exceeds 75 NTU or dust particles rise above 130 AQI to double cleanup sweeps.",
      conditionLabel: "Turbidity > 75 NTU / AQI > 130",
      actionLabel: "Set Preservation Budget to ₹350 L/mo",
      enabled: true,
      status: "monitoring"
    },
    {
      id: "thermal_protection",
      name: "Extreme Climate Subsidy Shield",
      description: "Triggers when peak ambient heat exceeds 40°C or PM2.5 crosses 140 µg/m³ to subsidize artisan battery/green travel.",
      conditionLabel: "Temp > 40°C / PM2.5 > 140 µg/m³",
      actionLabel: "Set Eco-Vehicle Subsidy to ₹7,500/mo",
      enabled: true,
      status: "monitoring"
    },
    {
      id: "integrity_shield",
      name: "Social Security & Fare Lock Trigger",
      description: "Triggers when social sentiment falls below 62% or viral scam tweets exceed 8/hr to enforce standard pricing & double policing.",
      conditionLabel: "Sentiment < 62% or Scam rate > 8 posts/hr",
      actionLabel: "Standard Fares = On, Safety Patrols = 12/Ward",
      enabled: true,
      status: "monitoring"
    }
  ]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [`[${timestamp}] ${message}`, ...prev.slice(0, 19)]);
  };

  const fetchFeed = async () => {
    try {
      const queryParams = new URLSearchParams({
        city: activeCity,
        rickshawSubsidy: inputs.rickshawSubsidy.toString(),
        wasteManagementBudget: inputs.wasteManagementBudget.toString(),
        safetyPatrolIntensity: inputs.safetyPatrolIntensity.toString(),
        middlemenCommissionCap: inputs.middlemenCommissionCap.toString(),
        standardizedRatesEnabled: inputs.standardizedRatesEnabled.toString(),
        touristMultiplier: inputs.touristMultiplier.toString(),
        weatherHazard: inputs.weatherHazard
      });

      const res = await fetch(`/api/feeds/realtime?${queryParams.toString()}`);
      if (res.ok) {
        const data: RealTimeFeedData = await res.json();
        setFeedData(data);
        evaluateRules(data);
      }
    } catch (err) {
      console.error("Failed to load real-time feeds:", err);
    }
  };

  // Poll real-time feeds
  useEffect(() => {
    fetchFeed();
    addLog(`System initialized. Connecting to active telemetry streams for ${activeCity.toUpperCase()}...`);

    let intervalId: NodeJS.Timeout;
    if (isAutoRefreshing) {
      intervalId = setInterval(() => {
        fetchFeed();
      }, 5000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [activeCity, isAutoRefreshing, inputs]);

  // Handle manual single refresh
  const handleManualRefresh = async () => {
    setIsRefreshingOnce(true);
    await fetchFeed();
    addLog("Manual telemetry scan initiated.");
    setTimeout(() => setIsRefreshingOnce(false), 500);
  };

  // Evaluate Automation Rules against fresh sensor inputs
  const evaluateRules = (data: RealTimeFeedData) => {
    const updatedRules = rules.map((rule) => {
      let isTriggered = false;
      let actionLog = "";

      if (!rule.enabled) return { ...rule, status: "idle" as const };

      // Rule 1: Silt Surge
      if (rule.id === "sanitation_surge") {
        const turbidityMetric = data.environmental.metrics.find(m => m.label.includes("Turbidity") || m.label.includes("Dust") || m.label.includes("Discharge"));
        if (turbidityMetric) {
          const val = parseFloat(turbidityMetric.value.toString().replace(/[^0-9.]/g, ''));
          if (data.city === 'varanasi' || data.city === 'kochi') {
            if (val > 75) isTriggered = true;
          } else if (data.city === 'jaipur') {
            if (val > 130) isTriggered = true;
          } else if (data.city === 'hampi') {
            if (val > 6500) isTriggered = true;
          }
        }

        if (isTriggered && inputs.wasteManagementBudget < 350) {
          onUpdatePolicy("wasteManagementBudget", 350);
          actionLog = `Rule Triggered: Environmental Silt/Dust limits exceeded! Preserving heritage corridors, automatically adjusted Preservation budget to ₹350L/mo.`;
        }
      }

      // Rule 2: Peak Thermal Shield
      if (rule.id === "thermal_protection") {
        const tempMetric = data.environmental.metrics.find(m => m.label.includes("Temp") || m.label.includes("Air") || m.label.includes("Heat"));
        const pm25Metric = data.environmental.metrics.find(m => m.label.includes("PM2.5") || m.label.includes("Hyacinth"));
        
        let tempVal = 0;
        let pm25Val = 0;

        if (tempMetric) tempVal = parseFloat(tempMetric.value.toString().replace(/[^0-9.]/g, ''));
        if (pm25Metric) pm25Val = parseFloat(pm25Metric.value.toString().replace(/[^0-9.]/g, ''));

        if (tempVal > 40 || pm25Val > 140) {
          isTriggered = true;
        }

        if (isTriggered && inputs.rickshawSubsidy < 7500) {
          onUpdatePolicy("rickshawSubsidy", 7500);
          actionLog = `Rule Triggered: Extreme Heatwave / Air Hazard! Automatically raised Eco-Vehicle Subsidy to ₹7,500/mo to offset operating strain.`;
        }
      }

      // Rule 3: Integrity Shield
      if (rule.id === "integrity_shield") {
        const scamMetric = data.social.metrics.find(m => m.label.includes("Complaint"));
        const sentimentVal = data.social.sentimentScore;
        let scamRate = 0;

        if (scamMetric) scamRate = parseFloat(scamMetric.value.toString().replace(/[^0-9.]/g, ''));

        if (sentimentVal < 62 || scamRate > 8) {
          isTriggered = true;
        }

        if (isTriggered) {
          let updatedAny = false;
          if (!inputs.standardizedRatesEnabled) {
            onUpdatePolicy("standardizedRatesEnabled", true);
            updatedAny = true;
          }
          if (inputs.safetyPatrolIntensity < 12) {
            onUpdatePolicy("safetyPatrolIntensity", 12);
            updatedAny = true;
          }
          if (updatedAny) {
            actionLog = `Rule Triggered: Low Visitor Sentiment / Scam spike on social media! Automatically locked Standardized Tariffs and deployed 12 Safety Patrols/Ward.`;
          }
        }
      }

      if (isTriggered && actionLog) {
        addLog(actionLog);
        return { ...rule, status: "triggered" as const };
      }

      return { ...rule, status: rule.enabled ? "monitoring" : "idle" };
    });

    // Only update rule states if different to prevent re-render loops
    const hasRuleStateChanged = JSON.stringify(updatedRules.map(r => r.status)) !== JSON.stringify(rules.map(r => r.status));
    if (hasRuleStateChanged) {
      setRules(updatedRules);
    }
  };

  const handleRuleToggle = (id: string) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, enabled: !r.enabled, status: !r.enabled ? 'monitoring' : 'idle' } : r));
    const target = rules.find(r => r.id === id);
    addLog(`Automation rule [${target?.name}] ${!target?.enabled ? "ENABLED" : "DISABLED"}.`);
  };

  // POST Custom Override alert injection
  const handleIngressInjection = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsInjecting(true);
    try {
      const res = await fetch("/api/feeds/override", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          city: activeCity,
          pm25: pm25Override,
          turbidity: turbidityOverride,
          temperature: tempOverride
        })
      });

      if (res.ok) {
        setInjectSuccess(true);
        addLog(`ALERT INJECTED: Set sensor overrides (PM2.5: ${pm25Override}, Silt/Turbidity: ${turbidityOverride}, Temp: ${tempOverride}°C). processing...`);
        await fetchFeed();
        setTimeout(() => {
          setInjectSuccess(false);
        }, 2000);
      }
    } catch (err) {
      console.error("Failed to inject custom override:", err);
    } finally {
      setIsInjecting(false);
    }
  };

  const resetOverrides = async () => {
    setIsInjecting(true);
    try {
      await fetch("/api/feeds/override", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          city: activeCity,
          pm25: undefined,
          turbidity: undefined,
          temperature: undefined
        })
      });
      addLog(`Sensor overrides cleared. Restoring automatic baseline calibration.`);
      // Reset sliders back to city defaults
      setPm25Override(activeCity === 'varanasi' ? 100 : activeCity === 'jaipur' ? 120 : activeCity === 'kochi' ? 80 : 70);
      setTurbidityOverride(50);
      setTempOverride(30);
      await fetchFeed();
    } catch (err) {
      console.error(err);
    } finally {
      setIsInjecting(false);
    }
  };

  if (!feedData) {
    return (
      <div className="py-20 text-center flex flex-col items-center justify-center space-y-4">
        <RefreshCw className="h-8 w-8 animate-spin text-brand-rose" />
        <p className="text-sm font-semibold text-slate-400">Loading municipal real-time ingestion sockets...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 lg:col-span-12 animate-fade-in" id="realtime-feeds-panel">
      
      {/* Overview stats bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: ACTIVE SENSOR FEEDS */}
        <div className="md:col-span-8 space-y-8">
          
          {/* Main Telemetry Panel Header */}
          <div className="bg-brand-dark p-6 rounded-[32px] border border-brand-teal/20 shadow-md text-white">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-brand-teal/10 pb-4 gap-4">
              <div>
                <h3 className="text-sm font-extrabold text-white font-display flex items-center gap-2">
                  <Activity className="h-5 w-5 text-brand-rose" />
                  Real-Time Civic Telemetry & Sensor Streams
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Active live socket reading of transit systems, climate indices, and tourist sentiments.
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsAutoRefreshing(!isAutoRefreshing)}
                  className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer border ${
                    isAutoRefreshing
                      ? "bg-brand-rose/10 text-brand-rose border-brand-rose/20"
                      : "bg-brand-bg text-slate-400 border-brand-teal/10 hover:text-white"
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isAutoRefreshing ? "bg-brand-rose animate-pulse" : "bg-slate-500"}`} />
                  {isAutoRefreshing ? "Streaming Live" : "Paused"}
                </button>

                <button
                  onClick={handleManualRefresh}
                  disabled={isRefreshingOnce}
                  className="p-1.5 bg-brand-bg hover:bg-brand-bg/80 border border-brand-teal/15 rounded-xl text-slate-300 hover:text-white transition-all disabled:opacity-50 cursor-pointer"
                  title="Scan Sensors Now"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${isRefreshingOnce ? "animate-spin" : ""}`} />
                </button>
              </div>
            </div>

            {/* Ingestion stream indicators */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
              
              {/* Stream 1: Public Transit API */}
              <div className="p-4.5 bg-brand-bg/50 rounded-2xl border border-brand-teal/10 flex flex-col justify-between h-44">
                <div className="flex justify-between items-center border-b border-brand-teal/10 pb-2">
                  <span className="text-[10px] font-mono font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Wifi className="h-3 w-3 text-brand-rose" />
                    Public Transit API
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase ${
                    feedData.transit.status === 'optimal' ? "bg-brand-teal/10 text-brand-teal border border-brand-teal/20" : "bg-brand-rose/10 text-brand-rose border border-brand-rose/20"
                  }`}>
                    {feedData.transit.status}
                  </span>
                </div>

                <div className="py-2.5">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-extrabold text-white font-mono">{feedData.transit.routeScore}%</span>
                    <span className="text-[9px] text-slate-400 font-bold uppercase">Transit Index</span>
                  </div>
                  <div className="w-full bg-brand-bg h-1 rounded-full mt-1">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${feedData.transit.routeScore > 75 ? 'bg-brand-teal' : 'bg-brand-rose'}`}
                      style={{ width: `${feedData.transit.routeScore}%` }} 
                    />
                  </div>
                </div>

                <div className="space-y-1 bg-brand-dark/50 p-2 rounded-xl text-[9px] font-semibold text-slate-300">
                  {feedData.transit.metrics.map((metric, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <span className="text-slate-400 truncate max-w-[130px]">{metric.label}:</span>
                      <span className={`font-mono truncate max-w-[80px] ${metric.status === 'danger' ? 'text-brand-rose' : 'text-slate-200'}`}>{metric.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stream 2: Environmental IoT Sensors */}
              <div className="p-4.5 bg-brand-bg/50 rounded-2xl border border-brand-teal/10 flex flex-col justify-between h-44">
                <div className="flex justify-between items-center border-b border-brand-teal/10 pb-2">
                  <span className="text-[10px] font-mono font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Cpu className="h-3 w-3 text-brand-rose" />
                    IoT Sensors
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase ${
                    feedData.environmental.status === 'normal' ? "bg-brand-teal/10 text-brand-teal border border-brand-teal/20" : "bg-brand-rose/10 text-brand-rose border border-brand-rose/20"
                  }`}>
                    {feedData.environmental.status}
                  </span>
                </div>

                <div className="py-2.5">
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-extrabold text-slate-100 font-mono">Telemetry</span>
                    <span className="text-[9px] text-slate-500 font-bold uppercase ml-1">Live Calibrations</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1 truncate">Monitoring PM2.5, surface temp & waterways</p>
                </div>

                <div className="space-y-1 bg-brand-dark/50 p-2 rounded-xl text-[9px] font-semibold text-slate-300">
                  {feedData.environmental.metrics.map((metric, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <span className="text-slate-400 truncate max-w-[130px]">{metric.label}:</span>
                      <span className={`font-mono truncate max-w-[80px] ${
                        metric.status === 'danger' ? 'text-brand-rose' : metric.status === 'warning' ? 'text-amber-500' : 'text-brand-teal'
                      }`}>{metric.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stream 3: Social Sentiment Ingestor */}
              <div className="p-4.5 bg-brand-bg/50 rounded-2xl border border-brand-teal/10 flex flex-col justify-between h-44">
                <div className="flex justify-between items-center border-b border-brand-teal/10 pb-2">
                  <span className="text-[10px] font-mono font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <MessageSquare className="h-3 w-3 text-brand-rose" />
                    Social Sentiment
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase bg-brand-teal/10 text-brand-teal border border-brand-teal/20`}>
                    ONLINE
                  </span>
                </div>

                <div className="py-2.5">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-extrabold text-white font-mono">{feedData.social.sentimentScore}%</span>
                    <span className="text-[9px] text-slate-400 font-bold uppercase">Positive Tone</span>
                  </div>
                  <div className="w-full bg-brand-bg h-1 rounded-full mt-1">
                    <div 
                      className="bg-brand-rose h-full rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(218,123,147,0.4)]" 
                      style={{ width: `${feedData.social.sentimentScore}%` }} 
                    />
                  </div>
                </div>

                <div className="space-y-1 bg-brand-dark/50 p-2 rounded-xl text-[9px] font-semibold text-slate-300">
                  {feedData.social.metrics.map((metric, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <span className="text-slate-400 truncate max-w-[130px]">{metric.label}:</span>
                      <span className={`font-mono truncate max-w-[80px] ${metric.status === 'danger' ? 'text-brand-rose' : 'text-slate-200'}`}>{metric.value}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Trending tags on Social Media */}
            <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-brand-teal/10 pt-4.5">
              <span className="text-[10px] font-extrabold font-mono text-slate-400 uppercase tracking-wider mr-2">
                Trending #Hashtags (24h):
              </span>
              {feedData.social.trendingTags.map((tag, i) => (
                <span 
                  key={i} 
                  className="px-2.5 py-1 bg-brand-bg text-[10px] font-bold text-slate-300 rounded-lg hover:text-white transition-all cursor-pointer border border-brand-teal/5"
                >
                  {tag}
                </span>
              ))}
            </div>

          </div>

          {/* AUTOMATED DECISION RULES ENGINE */}
          <div className="bg-brand-dark p-6 rounded-[32px] border border-brand-teal/20 shadow-md text-white">
            <div className="border-b border-brand-teal/10 pb-4">
              <h3 className="text-sm font-extrabold text-white font-display flex items-center gap-2">
                <Cpu className="h-5 w-5 text-brand-rose animate-pulse" />
                Closed-Loop Automated Policy Trigger Rules
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Establish thresholds. When a trigger condition is met, the system automatically writes policy parameters back to the municipality database.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
              {rules.map((rule) => {
                const isMonitoring = rule.status === "monitoring";
                const isTriggered = rule.status === "triggered";
                
                return (
                  <div 
                    key={rule.id}
                    className={`p-4 rounded-2xl border flex flex-col justify-between h-[210px] transition-all relative overflow-hidden ${
                      isTriggered 
                        ? "bg-brand-deep/60 border-brand-rose/45 shadow-[0_0_15px_rgba(218,123,147,0.15)] animate-pulse" 
                        : isMonitoring 
                        ? "bg-brand-bg/40 border-brand-teal/15" 
                        : "bg-brand-bg/10 border-brand-teal/5 opacity-50"
                    }`}
                  >
                    {/* Status ribbon */}
                    {isTriggered && (
                      <div className="absolute top-0 right-0 bg-brand-rose text-brand-deep text-[7.5px] font-black uppercase px-2 py-0.5 tracking-wider rounded-bl-lg font-mono">
                        Rule Fired
                      </div>
                    )}

                    <div className="space-y-2">
                      <div className="flex justify-between items-start gap-1">
                        <h4 className="text-xs font-extrabold text-white leading-snug">{rule.name}</h4>
                        <input 
                          type="checkbox"
                          checked={rule.enabled}
                          onChange={() => handleRuleToggle(rule.id)}
                          className="h-3.5 w-3.5 rounded text-brand-rose focus:ring-brand-rose border-brand-teal/30 cursor-pointer"
                        />
                      </div>
                      <p className="text-[10px] text-slate-400 leading-normal">{rule.description}</p>
                    </div>

                    <div className="space-y-2 border-t border-brand-teal/10 pt-3">
                      <div className="flex justify-between items-center text-[9px] font-bold">
                        <span className="text-slate-400 uppercase">Condition:</span>
                        <span className="text-amber-500 font-mono truncate max-w-[150px]">{rule.conditionLabel}</span>
                      </div>
                      
                      <div className="flex justify-between items-center text-[9px] font-bold">
                        <span className="text-slate-400 uppercase">Action Response:</span>
                        <span className="text-brand-teal font-mono truncate max-w-[130px]">{rule.actionLabel}</span>
                      </div>

                      <div className="flex items-center justify-between text-[9px] font-bold pt-1">
                        <span className="text-slate-500">Automation status:</span>
                        <span className={`font-mono uppercase font-black tracking-wider flex items-center gap-1 ${
                          isTriggered ? "text-brand-rose" : isMonitoring ? "text-brand-teal animate-pulse" : "text-slate-500"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isTriggered ? "bg-brand-rose" : isMonitoring ? "bg-brand-teal" : "bg-slate-500"}`} />
                          {rule.status}
                        </span>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: CONTROL CONSOLE LOGS & OVERRIDES INJECTION */}
        <div className="md:col-span-4 space-y-8">
          
          {/* Mock Ingress Injection Drawer */}
          <div className="bg-brand-dark p-6 rounded-[32px] border border-brand-teal/20 shadow-md text-white">
            <div className="border-b border-brand-teal/10 pb-4 flex justify-between items-center">
              <div>
                <h3 className="text-xs font-extrabold uppercase tracking-widest text-white font-mono">
                  Stress Test Sensor Ingress
                </h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Inject customized readings to trigger decision logic</p>
              </div>
              <Zap className="h-4 w-4 text-brand-rose shrink-0" />
            </div>

            <form onSubmit={handleIngressInjection} className="space-y-4.5 pt-4 text-slate-300">
              
              {/* PM2.5 Ingress Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[10px] font-bold">
                  <span className="text-slate-400 uppercase">Custom PM2.5 Intersector Air</span>
                  <span className="text-brand-rose font-mono">{pm25Override} µg/m³</span>
                </div>
                <input 
                  type="range"
                  min="20"
                  max="250"
                  step="5"
                  value={pm25Override}
                  onChange={(e) => setPm25Override(parseInt(e.target.value))}
                  className="w-full h-1 cursor-pointer bg-brand-bg accent-brand-rose"
                />
              </div>

              {/* Turbidity Ingress Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[10px] font-bold">
                  <span className="text-slate-400 uppercase">
                    {activeCity === 'jaipur' ? "Custom Dust AQI" : activeCity === 'hampi' ? "Custom River Velocity" : "Custom Turbidity"}
                  </span>
                  <span className="text-brand-rose font-mono">
                    {turbidityOverride} {activeCity === 'jaipur' ? 'AQI' : activeCity === 'hampi' ? 'cusecs' : 'NTU'}
                  </span>
                </div>
                <input 
                  type="range"
                  min={activeCity === 'hampi' ? 1000 : 10}
                  max={activeCity === 'hampi' ? 12000 : 150}
                  step={activeCity === 'hampi' ? 500 : 5}
                  value={turbidityOverride}
                  onChange={(e) => setTurbidityOverride(parseInt(e.target.value))}
                  className="w-full h-1 cursor-pointer bg-brand-bg accent-brand-rose"
                />
              </div>

              {/* Ambient Temp Ingress Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[10px] font-bold">
                  <span className="text-slate-400 uppercase">Custom Ambient Temperature</span>
                  <span className="text-brand-rose font-mono">{tempOverride}°C</span>
                </div>
                <input 
                  type="range"
                  min="15"
                  max="52"
                  step="1"
                  value={tempOverride}
                  onChange={(e) => setTempOverride(parseInt(e.target.value))}
                  className="w-full h-1 cursor-pointer bg-brand-bg accent-brand-rose"
                />
              </div>

              {/* Buttons Row */}
              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  disabled={isInjecting}
                  className="flex-1 py-2.5 bg-brand-rose hover:bg-brand-rose/90 disabled:opacity-50 text-brand-deep rounded-xl text-xs font-extrabold uppercase transition-all shadow-sm cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {injectSuccess ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      Injected
                    </>
                  ) : (
                    <>
                      <Play className="h-3.5 w-3.5 fill-brand-deep" />
                      Inject Alert
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={resetOverrides}
                  disabled={isInjecting}
                  className="px-3.5 py-2.5 bg-brand-bg hover:bg-brand-bg/80 border border-brand-teal/15 rounded-xl text-xs font-bold uppercase transition-all text-slate-300 hover:text-white cursor-pointer"
                >
                  Clear
                </button>
              </div>

              <p className="text-[9px] text-slate-500 leading-relaxed text-center">
                Injecting overrides bypasses standard mathematical jitter and triggers the rules engine immediately.
              </p>

            </form>
          </div>

          {/* Decision Core Shell Terminal Logs */}
          <div className="bg-brand-dark p-6 rounded-[32px] border border-brand-teal/20 shadow-md text-white h-80 flex flex-col justify-between">
            <div className="border-b border-brand-teal/10 pb-3 flex justify-between items-center">
              <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400 font-mono flex items-center gap-1.5">
                <Terminal className="h-4 w-4 text-brand-rose" />
                Municipal Audit Trail
              </span>
              <span className="text-[8px] font-mono text-brand-rose bg-brand-deep px-1.5 py-0.5 rounded border border-brand-rose/20 animate-pulse">
                Secure
              </span>
            </div>

            {/* Logs Area */}
            <div className="flex-1 overflow-y-auto mt-4 space-y-2.5 pr-1 text-[9.5px] font-mono text-slate-300">
              {logs.map((log, index) => {
                const isTriggeredLog = log.includes("Rule Triggered");
                const isAlertInjectedLog = log.includes("ALERT INJECTED");
                return (
                  <div 
                    key={index} 
                    className={`leading-relaxed p-1.5 rounded ${
                      isTriggeredLog 
                        ? "text-brand-rose bg-brand-rose/5 border border-brand-rose/10" 
                        : isAlertInjectedLog 
                        ? "text-amber-500 bg-amber-500/5 border border-amber-500/10" 
                        : "text-slate-400"
                    }`}
                  >
                    {log}
                  </div>
                );
              })}
            </div>

            <div className="text-[8.5px] text-slate-500 border-t border-brand-teal/10 pt-2 text-right">
              Console Logs: {logs.length} stored logs
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
