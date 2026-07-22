import React, { useState, useEffect, useMemo } from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  CartesianGrid,
  LineChart,
  Line
} from "recharts";
import { 
  Database, 
  AlertTriangle, 
  Activity, 
  RefreshCw, 
  Wrench, 
  CheckCircle, 
  Users, 
  TrendingUp, 
  Cpu, 
  LayoutDashboard,
  ShieldCheck,
  Send,
  Zap,
  MapPin
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface StakeholderDashboardProps {
  activeCity: string;
  onShowToast: (message: string, type?: "success" | "warning" | "info") => void;
}

interface AssetHealth {
  id: string;
  name: string;
  category: "sanitation" | "infrastructure" | "logistics" | "energy";
  health: number;
  location: string;
  status: "nominal" | "warning" | "critical";
  lastMaintenance: string;
}

interface HotspotCrowd {
  name: string;
  currentTraffic: number;
  capacityLimit: number;
  riskLevel: "low" | "medium" | "high";
  recommendation: string;
}

// Tailored metadata for city-specific administrative monitoring
const MUNICIPAL_METADATA: Record<string, {
  department: string;
  hotspots: HotspotCrowd[];
  assets: AssetHealth[];
}> = {
  varanasi: {
    department: "Varanasi Municipal & Ghat Cleanliness Board",
    hotspots: [
      { name: "Dashashwamedh Ghat (Aarti Loop)", currentTraffic: 1420, capacityLimit: 1200, riskLevel: "high", recommendation: "Divert boats towards Assi Ghat corridor" },
      { name: "Kashi Vishwanath Corridor Outer Plaza", currentTraffic: 980, capacityLimit: 1000, riskLevel: "medium", recommendation: "Enable staggered entry sequence at gate 3" },
      { name: "Madanpura Weaver Guild Alleyway", currentTraffic: 320, capacityLimit: 500, riskLevel: "low", recommendation: "Optimal flow, maintain current parameters" }
    ],
    assets: [
      { id: "v_1", name: "Ganga Floating Trash Skimmer Sensors", category: "sanitation", health: 34, location: "Dashashwamedh Ghatfront", status: "critical", lastMaintenance: "4 days ago" },
      { id: "v_2", name: "Corridor Smart LED Grid & CCTV Nodes", category: "energy", health: 88, location: "Vishwanath Pathway", status: "nominal", lastMaintenance: "Yesterday" },
      { id: "v_3", name: "Cooperative Folk Stall Canvas Shelters", category: "infrastructure", health: 55, location: "Godowlia Handicrafts Market", status: "warning", lastMaintenance: "2 weeks ago" }
    ]
  },
  jaipur: {
    department: "Jaipur Smart Heritage Development Authority",
    hotspots: [
      { name: "Amber Fort Elephant-Alternative Shuttles", currentTraffic: 650, capacityLimit: 500, riskLevel: "high", recommendation: "Deploy 4 backup cooperative e-rickshaws" },
      { name: "Hawa Mahal Frontage Overlook Area", currentTraffic: 820, capacityLimit: 800, riskLevel: "medium", recommendation: "Restrict curb parking and expand pedestrian bypass" },
      { name: "Sanganer Blue Pottery Guild Center", currentTraffic: 150, capacityLimit: 300, riskLevel: "low", recommendation: "Optimal flow, maintain current parameters" }
    ],
    assets: [
      { id: "j_1", name: "Eco Shuttle Fast Charging Bays", category: "energy", health: 42, location: "Amber Fort Gateway Hub", status: "warning", lastMaintenance: "3 days ago" },
      { id: "j_2", name: "Sanganer Artisan Drainage Filter Systems", category: "sanitation", health: 92, location: "Artisan Printing Quarter", status: "nominal", lastMaintenance: "2 days ago" },
      { id: "j_3", name: "Heritage Wall Dynamic Surcharge Displays", category: "infrastructure", health: 48, location: "Johri Bazaar Roadway", status: "warning", lastMaintenance: "1 week ago" }
    ]
  },
  kochi: {
    department: "Kochi Marine & Queen-Port Co-operative Council",
    hotspots: [
      { name: "Fort Kochi Chinese Fishing Nets Walkway", currentTraffic: 720, capacityLimit: 600, riskLevel: "medium", recommendation: "Redirect crowds to Vasco da Gama Square" },
      { name: "Mattancherry Jew Town Spice Market", currentTraffic: 480, capacityLimit: 400, riskLevel: "medium", recommendation: "Deploy municipal volunteers for pedestrian flow control" },
      { name: "Vembanad Backwater Boat Landing Hub", currentTraffic: 110, capacityLimit: 250, riskLevel: "low", recommendation: "Optimal flow, maintain current parameters" }
    ],
    assets: [
      { id: "k_1", name: "Traditional Net Structure Anchor Winches", category: "infrastructure", health: 25, location: "Fort Kochi Shoreline", status: "critical", lastMaintenance: "1 month ago" },
      { id: "k_2", name: "Backwater Solar Water Taxi Batteries", category: "energy", health: 95, location: "Marine Drive Jetty", status: "nominal", lastMaintenance: "Today" },
      { id: "k_3", name: "Sustainably-Harvested Coir Matting Floors", category: "sanitation", health: 70, location: "Jew Town Artisan Corridor", status: "nominal", lastMaintenance: "5 days ago" }
    ]
  },
  hampi: {
    department: "Hampi Monument Archeological & Tribal Welfare Board",
    hotspots: [
      { name: "Virupaksha Temple Main Entrance Plaza", currentTraffic: 1100, capacityLimit: 900, riskLevel: "high", recommendation: "Divert evening tourists to Hemakuta Hill" },
      { name: "Vittala Temple Stone Chariot Compound", currentTraffic: 640, capacityLimit: 700, riskLevel: "medium", recommendation: "Rotate shuttle entry frequencies" },
      { name: "Anegundi Banana Fiber Weaving Guild", currentTraffic: 90, capacityLimit: 200, riskLevel: "low", recommendation: "Optimal flow, maintain current parameters" }
    ],
    assets: [
      { id: "h_1", name: "Solar-Battery Monument Uplighting", category: "energy", health: 85, location: "Vittala Complex Roadway", status: "nominal", lastMaintenance: "3 days ago" },
      { id: "h_2", name: "Eco-Friendly Toilet Recirculation Pumps", category: "sanitation", health: 28, location: "Hampi Bazaar Walkway", status: "critical", lastMaintenance: "12 days ago" },
      { id: "h_3", name: "Tribal Artisan Booth Shading Canopies", category: "infrastructure", health: 78, location: "Kamalapura Crafts Center", status: "nominal", lastMaintenance: "1 week ago" }
    ]
  }
};

export default function StakeholderDashboard({ activeCity, onShowToast }: StakeholderDashboardProps) {
  const cityKey = activeCity?.toLowerCase() || "varanasi";
  const cityData = useMemo(() => {
    return MUNICIPAL_METADATA[cityKey] || MUNICIPAL_METADATA.varanasi;
  }, [cityKey]);

  // Local states for simulations and dispatch events
  const [assets, setAssets] = useState<AssetHealth[]>([]);
  const [hotspots, setHotspots] = useState<HotspotCrowd[]>([]);
  const [ingestRate, setIngestRate] = useState<number>(312);
  const [streamActive, setStreamActive] = useState<boolean>(true);
  const [telemetryLogs, setTelemetryLogs] = useState<string[]>([]);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [selectedChartRange, setSelectedChartRange] = useState<"24h" | "7d">("24h");

  // Keep assets and hotspots updated with city data changes
  useEffect(() => {
    setAssets(cityData.assets);
    setHotspots(cityData.hotspots);
    // Initialize custom simulated telemetry logs
    setTelemetryLogs([
      `[BigQuery] Established stream pipeline 'bigquery-lens-routes-v1' for ${activeCity.toUpperCase()}`,
      `[Looker Engine] Hydrated visualization cache. Active session standard token: JWT_889F`,
      `[Pub/Sub] Ingested 1,422 telemetry events from anonymous user navigation routes`,
      `[RAG Anchor] Mapped 34 community hazard reports against local municipal coordinates`
    ]);
  }, [cityData, activeCity]);

  // Simulate live ingestion of real-time routes from BigQuery stream
  useEffect(() => {
    if (!streamActive) return;

    const interval = setInterval(() => {
      // Slightly fluctuate rate
      setIngestRate(prev => {
        const delta = Math.floor(Math.random() * 21) - 10;
        return Math.max(150, Math.min(600, prev + delta));
      });

      // Randomly append a telemetry log
      setTelemetryLogs(prev => {
        const events = [
          `[Pub/Sub] Streamed GPS route packet for tourist_session_${Math.floor(Math.random()*10000)}`,
          `[AlloyDB] Spatial vector query resolved: Found closest safe-haven node in 3.4ms`,
          `[BigQuery] Aggregated anonymous foot-traffic at ${cityData.hotspots[Math.floor(Math.random() * cityData.hotspots.length)].name}`,
          `[Looker API] Dashboard rendering update broadcast to stakeholder_JWT_889F`
        ];
        const newLog = events[Math.floor(Math.random() * events.length)];
        return [newLog, ...prev.slice(0, 15)];
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [streamActive, cityData]);

  // Simulated Looker / BigQuery Chart Data for 24-hour peak predictions
  const predictiveChartData = useMemo(() => {
    const data = [];
    const baseHour = new Date().getHours();
    
    for (let i = 0; i < 12; i++) {
      const hour = (baseHour + i) % 24;
      const hourStr = `${hour.toString().padStart(2, '0')}:00`;
      
      // Calculate realistic traffic fluctuations with a midday and evening peak
      let factor = 1.0;
      if (hour >= 17 && hour <= 21) factor = 1.95; // Aarti / evening peak
      else if (hour >= 9 && hour <= 12) factor = 1.45; // Morning peak
      else if (hour >= 1 && hour <= 5) factor = 0.25; // Night low
      else factor = 0.85;

      const baseTraffic = 400;
      const predictedTraffic = Math.round(baseTraffic * factor + Math.sin(i) * 50);
      const capacityBaseline = 650;

      data.push({
        time: hourStr,
        predicted: predictedTraffic,
        capacityLimit: capacityBaseline,
        streamedPackets: Math.round(predictedTraffic * 1.5)
      });
    }
    return data;
  }, [activeCity]);

  // Simulated 7-day Looker chart data
  const weeklyChartData = useMemo(() => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return days.map((day, i) => {
      const isWeekend = day === "Sat" || day === "Sun";
      const baseValue = isWeekend ? 850 : 540;
      const noise = Math.sin(i * 1.8) * 80;
      return {
        day,
        predicted: Math.round(baseValue + noise),
        capacityLimit: 700,
        streamedPackets: Math.round((baseValue + noise) * 1.2)
      };
    });
  }, []);

  // Handler to dispatch maintenance workers to clean/repair asset
  const handleDispatchMaintenance = (assetId: string) => {
    const assetToRepair = assets.find(a => a.id === assetId);
    if (assetToRepair) {
      onShowToast(`🔧 Despatched cooperative maintenance crew to ${assetToRepair.name}! Status restored to nominal.`, "success");
    }
    setAssets(prev => prev.map(asset => {
      if (asset.id === assetId) {
        return {
          ...asset,
          health: 100,
          status: "nominal",
          lastMaintenance: "Just Now"
        };
      }
      return asset;
    }));
  };

  // Handler to broadcast a Looker-triggered Crowd Diversion alert to tourists' navigation systems
  const handleBroadcastDiversion = (hotspot: HotspotCrowd) => {
    onShowToast(`🚨 Sent BigQuery-Looker traffic diversion guidance to local guides: "${hotspot.recommendation}".`, "info");
    
    // Temporarily reduce traffic in the local simulation to show dynamic response
    setHotspots(prev => prev.map(h => {
      if (h.name === hotspot.name) {
        return {
          ...h,
          currentTraffic: Math.round(h.currentTraffic * 0.75),
          riskLevel: h.currentTraffic * 0.75 > h.capacityLimit ? "medium" : "low"
        };
      }
      return h;
    }));
  };

  // Trigger manual refresh of the municipal database and Looker tables
  const handleManualRefresh = () => {
    setIsRefreshing(true);
    onShowToast("⚡ Querying BigQuery partition tables and recalculating asset health indices...", "info");
    
    setTimeout(() => {
      setIsRefreshing(false);
      onShowToast("✓ Looker administrative dashboard synchronized with live AlloyDB and BigQuery cluster.", "success");
      
      // Slightly improve asset health or randomize slightly to make it feel super dynamic
      setAssets(prev => prev.map(asset => {
        if (asset.health < 95 && asset.status !== "nominal" && Math.random() > 0.5) {
          const added = Math.floor(Math.random() * 15) + 5;
          const nextHealth = Math.min(100, asset.health + added);
          return {
            ...asset,
            health: nextHealth,
            status: nextHealth > 80 ? "nominal" : nextHealth > 50 ? "warning" : "critical"
          };
        }
        return asset;
      }));
    }, 1200);
  };

  return (
    <div className="space-y-8 lg:col-span-12 w-full h-full text-white" id="stakeholder-dashboard">
      
      {/* Premium Stakeholder Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-brand-dark p-6 rounded-[32px] border border-brand-teal/20 shadow-2xl">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="h-5 w-5 text-brand-rose" />
            <span className="text-[9px] font-mono font-black text-brand-rose uppercase tracking-widest bg-brand-rose/10 px-2 py-0.5 rounded border border-brand-rose/20">
              Administrative Control Console
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black font-display text-white">
            Predictive Foot-Traffic & Asset Health
          </h2>
          <p className="text-xs text-slate-400">
            {cityData.department} • Live streams from <strong>Google Cloud BigQuery</strong>
          </p>
        </div>

        {/* Real-time status indicators */}
        <div className="flex flex-wrap gap-2 items-center">
          <button
            onClick={() => setStreamActive(!streamActive)}
            className={`px-3 py-1.5 rounded-xl text-[10px] font-extrabold uppercase tracking-wider border transition-all cursor-pointer flex items-center gap-1.5 ${
              streamActive 
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                : "bg-brand-bg/50 border-brand-teal/10 text-slate-400"
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${streamActive ? "bg-emerald-400 animate-ping" : "bg-slate-500"}`} />
            <span>{streamActive ? "BigQuery Ingestion: Active" : "Stream Paused"}</span>
          </button>

          <button
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="p-2.5 bg-brand-teal/25 hover:bg-brand-teal/40 text-brand-rose hover:text-white rounded-xl border border-brand-teal/20 hover:border-brand-rose/30 transition-all cursor-pointer flex items-center justify-center disabled:opacity-40"
            title="Force Query BigQuery Tables"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* THREE-COLUMN METRICS OVERVIEW CARD */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Metric 1 */}
        <div className="bg-brand-dark p-5 rounded-[24px] border border-brand-teal/15 flex items-center gap-4 shadow-lg">
          <div className="p-3.5 bg-brand-teal/10 rounded-2xl border border-brand-teal/25 text-brand-teal">
            <Cpu className="h-6 w-6 text-brand-rose" />
          </div>
          <div>
            <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block">Stream Rate</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-black text-white font-mono">{ingestRate}</span>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider font-mono">ev/sec</span>
            </div>
            <p className="text-[9.5px] text-slate-400 mt-1">Live Pub/Sub telemetry ingress</p>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-brand-dark p-5 rounded-[24px] border border-brand-teal/15 flex items-center gap-4 shadow-lg">
          <div className="p-3.5 bg-amber-500/10 rounded-2xl border border-amber-500/25 text-amber-400">
            <AlertTriangle className="h-6 w-6 text-amber-400 animate-pulse" />
          </div>
          <div>
            <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block">Overcrowd Risks</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-black text-white font-mono">
                {hotspots.filter(h => h.riskLevel !== "low").length}
              </span>
              <span className="text-[9px] font-extrabold text-brand-rose uppercase tracking-wider">
                Attractions
              </span>
            </div>
            <p className="text-[9.5px] text-slate-400 mt-1">Strained municipal limits</p>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-brand-dark p-5 rounded-[24px] border border-brand-teal/15 flex items-center gap-4 shadow-lg">
          <div className="p-3.5 bg-emerald-500/10 rounded-2xl border border-emerald-500/25 text-emerald-400">
            <ShieldCheck className="h-6 w-6 text-emerald-400" />
          </div>
          <div>
            <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block">Avg Asset Health</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-black text-white font-mono">
                {Math.round(assets.reduce((acc, a) => acc + a.health, 0) / (assets.length || 1))}%
              </span>
              <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider font-mono">nominal</span>
            </div>
            <p className="text-[9.5px] text-slate-400 mt-1">Cooperative infrastructure state</p>
          </div>
        </div>

      </div>

      {/* MAIN DATA SECTION: LEFT CHART, RIGHT HOTSPOTS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: LOOKER EMBED & BIGQUERY HOURLY FORECAST (COL-SPAN-7) */}
        <div className="lg:col-span-7 bg-brand-dark p-6 rounded-[32px] border border-brand-teal/20 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-brand-teal/10 pb-4">
            <div>
              <div className="flex items-center gap-1.5">
                <Database className="h-4 w-4 text-brand-teal" />
                <span className="text-[8px] font-mono font-black text-brand-teal uppercase tracking-widest bg-brand-teal/10 px-1.5 py-0.5 rounded border border-brand-teal/20">
                  LOOKER INSIGHT ENGINE
                </span>
              </div>
              <h3 className="text-sm font-black text-white font-display uppercase tracking-wider mt-1">
                Predictive Foot-Traffic Forecasting
              </h3>
            </div>

            {/* Time range switcher */}
            <div className="flex bg-brand-bg/85 p-0.5 rounded-xl border border-brand-teal/10 gap-0.5 self-end">
              <button
                type="button"
                onClick={() => setSelectedChartRange("24h")}
                className={`px-3 py-1 text-[9px] font-mono font-bold rounded-lg transition-all cursor-pointer ${
                  selectedChartRange === "24h"
                    ? "bg-brand-rose text-brand-deep font-black"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                24h Forecast
              </button>
              <button
                type="button"
                onClick={() => setSelectedChartRange("7d")}
                className={`px-3 py-1 text-[9px] font-mono font-bold rounded-lg transition-all cursor-pointer ${
                  selectedChartRange === "7d"
                    ? "bg-brand-rose text-brand-deep font-black"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Weekly View
              </button>
            </div>
          </div>

          <p className="text-[10px] text-slate-400 leading-normal font-semibold">
            Real-time telemetry streams from user routes are fed directly to <strong>BigQuery partitioned tables</strong>, allowing Looker BI models to project high-occupancy strain before bottlenecks happen.
          </p>

          {/* Recharts Area/Line Chart */}
          <div className="h-64 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={selectedChartRange === "24h" ? predictiveChartData : weeklyChartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(55, 110, 111, 0.08)" />
                <XAxis 
                  dataKey={selectedChartRange === "24h" ? "time" : "day"} 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 9, fontWeight: '700', fontFamily: 'monospace' }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 9, fontWeight: '700', fontFamily: 'monospace' }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-brand-deep border border-brand-teal/20 p-3 rounded-2xl shadow-xl space-y-1 text-[10px]">
                          <p className="font-mono font-bold text-slate-400 uppercase tracking-widest">
                            {payload[0].payload.time || payload[0].payload.day} Target
                          </p>
                          <p className="font-semibold text-white">
                            Predicted Traffic: <span className="text-brand-rose font-black font-mono">{payload[0].value}</span> pax
                          </p>
                          <p className="font-semibold text-slate-400">
                            Telemetry Packets: <span className="text-brand-teal font-black font-mono">{payload[1]?.value || 0}</span>
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="predicted" 
                  stroke="#da7b93" 
                  strokeWidth={3} 
                  dot={{ r: 4, strokeWidth: 1 }}
                  activeDot={{ r: 6 }} 
                  name="Predicted Traffic"
                />
                <Line 
                  type="monotone" 
                  dataKey="streamedPackets" 
                  stroke="#376e6f" 
                  strokeWidth={2} 
                  strokeDasharray="4 4"
                  dot={false}
                  name="Streamed Packets"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Looker Bottom Info Block */}
          <div className="p-3.5 bg-brand-bg/40 rounded-2xl border border-brand-teal/10 flex items-center justify-between text-[10px] font-mono">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-brand-rose animate-pulse" />
              <span className="text-slate-300 font-bold">
                Looker Alert: Peak load expected in the next {selectedChartRange === "24h" ? "4 hours" : "weekend window"}.
              </span>
            </div>
            <span className="text-brand-rose font-extrabold tracking-wider animate-pulse">OVERLOAD PROJECTION</span>
          </div>

        </div>

        {/* RIGHT COLUMN: REAL-TIME HOTSPOTS & ACTION BROADCAST (COL-SPAN-5) */}
        <div className="lg:col-span-5 bg-brand-dark p-6 rounded-[32px] border border-brand-teal/20 shadow-xl space-y-6">
          <div className="border-b border-brand-teal/10 pb-4">
            <span className="text-[8px] font-mono font-black text-brand-rose uppercase tracking-widest block">
              REAL-TIME OVERCROWDING
            </span>
            <h3 className="text-sm font-black text-white font-display uppercase tracking-wider mt-1">
              Active Crowding Hazards
            </h3>
          </div>

          <div className="space-y-4">
            {hotspots.map((hotspot, idx) => {
              const occupancyPercent = Math.round((hotspot.currentTraffic / hotspot.capacityLimit) * 100);
              const isStrained = hotspot.riskLevel !== "low";
              return (
                <div 
                  key={idx}
                  className={`p-4 rounded-2xl border transition-all ${
                    hotspot.riskLevel === "high"
                      ? "bg-brand-rose/5 border-brand-rose/25"
                      : hotspot.riskLevel === "medium"
                        ? "bg-amber-400/5 border-amber-400/25"
                        : "bg-brand-bg/20 border-brand-teal/10"
                  }`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <span className="text-[11px] font-extrabold text-white block leading-tight">
                        {hotspot.name}
                      </span>
                      <span className="text-[9px] text-slate-400 mt-1 block">
                        Limit: {hotspot.capacityLimit} pax • Current: <strong className="text-white">{hotspot.currentTraffic}</strong>
                      </span>
                    </div>

                    <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${
                      hotspot.riskLevel === "high"
                        ? "bg-brand-rose/20 text-brand-rose border-brand-rose/30"
                        : hotspot.riskLevel === "medium"
                          ? "bg-amber-400/20 text-amber-400 border-amber-400/30"
                          : "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                    }`}>
                      {hotspot.riskLevel} load
                    </span>
                  </div>

                  {/* Occupancy Indicator bar */}
                  <div className="space-y-1.5 mt-3">
                    <div className="flex justify-between items-center text-[9px] font-mono">
                      <span className="text-slate-400 font-bold">Occupancy Capacity Rate</span>
                      <span className={`font-black ${isStrained ? "text-brand-rose" : "text-brand-teal"}`}>
                        {occupancyPercent}%
                      </span>
                    </div>
                    <div className="w-full bg-brand-deep/60 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 ${
                          hotspot.riskLevel === "high"
                            ? "bg-brand-rose"
                            : hotspot.riskLevel === "medium"
                              ? "bg-amber-400"
                              : "bg-brand-teal"
                        }`}
                        style={{ width: `${Math.min(100, occupancyPercent)}%` }}
                      />
                    </div>
                  </div>

                  {/* Recommendation action block */}
                  {isStrained && (
                    <div className="mt-3.5 pt-3.5 border-t border-brand-teal/5 flex flex-col sm:flex-row gap-2 justify-between items-start sm:items-center">
                      <p className="text-[9.5px] text-slate-300 italic font-medium leading-tight">
                        💡 <strong>Looker Advice:</strong> {hotspot.recommendation}
                      </p>
                      <button
                        type="button"
                        onClick={() => handleBroadcastDiversion(hotspot)}
                        className="px-2.5 py-1.5 bg-brand-rose hover:bg-brand-rose/95 text-brand-deep font-black text-[9px] uppercase tracking-wider rounded-lg transition-all cursor-pointer shadow-md self-end"
                      >
                        Broadcast Diversion
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* BOTTOM SECTION: MUNICIPAL ASSETS HEALTH (LEFT) & REAL-TIME TELEMETRY EVENT STREAMS (RIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* MUNICIPAL ASSETS SYSTEM (COL-SPAN-7) */}
        <div className="lg:col-span-7 bg-brand-dark p-6 rounded-[32px] border border-brand-teal/20 shadow-xl space-y-6">
          <div className="border-b border-brand-teal/10 pb-4">
            <span className="text-[8px] font-mono font-black text-brand-teal uppercase tracking-widest block">
              COOPERATIVE ASSETS HEALTH INDEX
            </span>
            <h3 className="text-sm font-black text-white font-display uppercase tracking-wider mt-1">
              Municipal Asset & Infrastructure Care Desk
            </h3>
          </div>

          <p className="text-[10px] text-slate-400 leading-relaxed font-semibold">
            We track high-strain physical nodes such as river filtration systems, e-shuttle grids, and tribal storefront shade canopies. Prevent degradation of local craft centers before they crash.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {assets.map((asset) => (
              <div 
                key={asset.id} 
                className={`p-4 rounded-2xl bg-brand-bg/40 border border-brand-teal/10 flex flex-col justify-between space-y-4 transition-all hover:bg-brand-bg/60`}
              >
                <div className="space-y-1">
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-[10px] font-black text-white leading-tight uppercase tracking-wide">
                      {asset.name}
                    </span>
                  </div>
                  <span className="text-[8.5px] font-mono text-brand-teal block font-semibold uppercase tracking-wider mt-1">
                    📍 {asset.location}
                  </span>
                </div>

                {/* Health indicator bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-[9px] font-mono">
                    <span className="text-slate-400 font-bold">Health Index</span>
                    <span className={`font-black ${
                      asset.status === "critical"
                        ? "text-brand-rose"
                        : asset.status === "warning"
                          ? "text-amber-400"
                          : "text-emerald-400"
                    }`}>
                      {asset.health}%
                    </span>
                  </div>
                  <div className="w-full bg-brand-deep/60 h-1 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${
                        asset.status === "critical"
                          ? "bg-brand-rose"
                          : asset.status === "warning"
                            ? "bg-amber-400"
                            : "bg-emerald-400"
                      }`}
                      style={{ width: `${asset.health}%` }}
                    />
                  </div>
                  <span className="text-[8px] text-slate-500 block font-mono">
                    Last check: {asset.lastMaintenance}
                  </span>
                </div>

                {asset.health < 100 ? (
                  <button
                    type="button"
                    onClick={() => handleDispatchMaintenance(asset.id)}
                    className="w-full py-1.5 bg-brand-teal hover:bg-brand-teal/90 text-brand-cream hover:text-white font-extrabold text-[9px] uppercase tracking-wider rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Wrench className="h-3 w-3" />
                    <span>Dispatch Service Team</span>
                  </button>
                ) : (
                  <div className="py-1.5 bg-emerald-500/10 border border-emerald-500/25 rounded-lg text-emerald-400 text-[9px] font-extrabold uppercase tracking-widest text-center flex items-center justify-center gap-1 font-mono">
                    <CheckCircle className="h-3 w-3 text-emerald-400" />
                    <span>Nominal Health</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* REAL-TIME LOG PIPELINE STREAM (COL-SPAN-5) */}
        <div className="lg:col-span-5 bg-brand-dark p-6 rounded-[32px] border border-brand-teal/20 shadow-xl space-y-4">
          <div className="border-b border-brand-teal/10 pb-4">
            <span className="text-[8px] font-mono font-black text-brand-rose uppercase tracking-widest block">
              GCP REAL-TIME EVENT STREAM
            </span>
            <h3 className="text-sm font-black text-white font-display uppercase tracking-wider mt-1">
              BigQuery Telemetry Pipelines
            </h3>
          </div>

          <div className="bg-brand-deep/50 p-4 rounded-2xl border border-brand-teal/15 font-mono text-[9px] text-brand-cream space-y-2 h-72 overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-center text-slate-400 border-b border-brand-teal/10 pb-1.5 mb-1.5 font-bold">
              <span>Streaming Event Logs</span>
              <span className="text-[8px] uppercase text-emerald-400 bg-emerald-500/10 px-1.5 rounded-md animate-pulse">
                Live Pipe
              </span>
            </div>
            
            <AnimatePresence initial={false}>
              {telemetryLogs.map((log, idx) => {
                const isPubSub = log.includes("[Pub/Sub]");
                const isAlloy = log.includes("[AlloyDB]");
                const isLooker = log.includes("[Looker");
                const colorClass = isPubSub 
                  ? "text-brand-teal" 
                  : isAlloy 
                    ? "text-brand-rose" 
                    : isLooker 
                      ? "text-amber-300 font-bold" 
                      : "text-emerald-400";
                
                return (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                    className="py-1 border-b border-brand-teal/5 last:border-0 leading-normal"
                  >
                    <span className={colorClass}>{log}</span>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

      </div>

    </div>
  );
}
