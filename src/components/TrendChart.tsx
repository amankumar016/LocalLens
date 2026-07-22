import React, { useState, useMemo } from "react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  CartesianGrid
} from "recharts";
import { TrendingUp, Award, ShieldAlert, Heart, Sprout, Check, Square, CheckSquare } from "lucide-react";
import { SimulationResult } from "../types";

interface TrendChartProps {
  metrics: SimulationResult;
  activeCity: string;
}

type MetricKey = 'economicDistribution' | 'safetyTrustRating' | 'weaverCooperativeIncome' | 'ghatCleanliness';

interface MetricConfig {
  key: MetricKey;
  label: string;
  shortLabel: string;
  icon: React.ComponentType<any>;
  color: string;
  gradientId: string;
  unit: string;
  description: string;
}

const METRIC_CONFIGS: MetricConfig[] = [
  {
    key: "economicDistribution",
    label: "Artisan Income Support",
    shortLabel: "Artisan Income",
    icon: Award,
    color: "#376e6f", // Brand Teal
    gradientId: "colorArtisan",
    unit: "%",
    description: "Share of tourist capital retained directly by grassroots creators."
  },
  {
    key: "safetyTrustRating",
    label: "Safety & Trust Level",
    shortLabel: "Safety & Trust",
    icon: Heart,
    color: "#da7b93", // Brand Rose
    gradientId: "colorSafety",
    unit: "%",
    description: "Perceived security and transaction transparency index."
  },
  {
    key: "weaverCooperativeIncome",
    label: "Cooperative Growth",
    shortLabel: "Co-op Growth",
    icon: Sprout,
    color: "#fbbf24", // Amber
    gradientId: "colorCoop",
    unit: "%",
    description: "Revenue trajectory of local weaver and craft collectives."
  },
  {
    key: "ghatCleanliness",
    label: "Ghat Cleanliness",
    shortLabel: "Cleanliness",
    icon: TrendingUp,
    color: "#10b981", // Emerald
    gradientId: "colorClean",
    unit: "%",
    description: "Preservation quality and waste compliance scores."
  }
];

export default function TrendChart({ metrics, activeCity }: TrendChartProps) {
  // Store visibility state of each metric as a boolean mapping
  const [visibleMetrics, setVisibleMetrics] = useState<Record<MetricKey, boolean>>({
    economicDistribution: true,
    safetyTrustRating: true,
    weaverCooperativeIncome: false,
    ghatCleanliness: false
  });

  // Toggle metric visibility handler
  const handleToggleMetric = (key: MetricKey) => {
    setVisibleMetrics(prev => {
      const updated = { ...prev, [key]: !prev[key] };
      // Ensure at least one metric remains visible
      const activeCount = Object.values(updated).filter(Boolean).length;
      if (activeCount === 0) {
        return prev; // keep previous if user tries to deselect the last one
      }
      return updated;
    });
  };

  // Generate 7-day trend data dynamically and deterministically for all metrics
  const chartData = useMemo(() => {
    const citySeed = activeCity.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const data = [];

    for (let i = 0; i < 7; i++) {
      const isToday = i === 6;
      const dataPoint: any = {
        day: isToday ? "Today" : `Day -${6 - i}`,
      };

      METRIC_CONFIGS.forEach(cfg => {
        const currentValue = metrics[cfg.key] || 0;
        let val = currentValue;

        if (!isToday) {
          const dayOffset = 6 - i;
          // Deterministic variation unique to each metric key length to separate them
          const wave = Math.sin(citySeed + i * 2.3 + cfg.key.length * 5) * 5;
          const trend = -dayOffset * 1.5;
          val = Math.max(5, Math.min(100, Math.round(currentValue + wave + trend)));
        }
        dataPoint[cfg.key] = val;
      });

      data.push(dataPoint);
    }

    return data;
  }, [metrics, activeCity]);

  // Calculate stats for all visible metrics
  const visibleStats = useMemo(() => {
    return METRIC_CONFIGS.filter(cfg => visibleMetrics[cfg.key]).map(cfg => {
      const values = chartData.map(d => d[cfg.key]);
      const avg = Math.round(values.reduce((a, b) => a + b, 0) / values.length);
      const first = values[0];
      const last = values[values.length - 1];
      const diff = last - first;
      return {
        ...cfg,
        avg,
        diff,
        direction: diff >= 0 ? "increase" : "decrease"
      };
    });
  }, [chartData, visibleMetrics]);

  return (
    <div className="space-y-4 bg-brand-deep/35 p-5 rounded-2xl border border-brand-teal/10" id="trend-chart-component">
      {/* Chart Header & Comparison Summary */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-brand-teal/5 pb-3">
        <div>
          <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block">Comparative Forecasts</span>
          <h4 className="text-xs font-black text-white flex items-center gap-1.5 mt-0.5">
            <TrendingUp className="h-3.5 w-3.5 text-brand-teal" />
            7-Day Heritage Metric Comparison
          </h4>
        </div>
        
        {/* Indicators of active trends */}
        <div className="flex flex-wrap gap-1.5 items-center">
          {visibleStats.map(stat => (
            <div 
              key={stat.key} 
              className="flex items-center gap-1 bg-brand-dark/60 px-2 py-0.5 rounded-lg border border-brand-teal/5 text-[8.5px] font-mono font-bold"
              style={{ borderColor: `${stat.color}15` }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: stat.color }} />
              <span className="text-slate-400">{stat.shortLabel}:</span>
              <span style={{ color: stat.color }}>
                {stat.diff >= 0 ? "+" : ""}{stat.diff}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Toggle Pill row */}
      <div className="space-y-1">
        <label className="text-[8.5px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-1">
          Toggle Datasets to Compare
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
          {METRIC_CONFIGS.map((cfg) => {
            const isVisible = visibleMetrics[cfg.key];
            const CfgIcon = cfg.icon;
            return (
              <button
                key={cfg.key}
                type="button"
                onClick={() => handleToggleMetric(cfg.key)}
                className={`px-2.5 py-2 rounded-xl border text-[9px] font-extrabold uppercase tracking-wider flex items-center justify-between gap-1.5 transition-all cursor-pointer select-none ${
                  isVisible 
                    ? "bg-brand-teal/10 border-brand-teal/35 text-white shadow-md" 
                    : "bg-brand-dark/40 border-brand-teal/5 text-slate-400 hover:text-slate-200 hover:bg-brand-dark/70"
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <CfgIcon className="h-3 w-3" style={{ color: isVisible ? cfg.color : '#64748b' }} />
                  <span>{cfg.shortLabel}</span>
                </div>
                <div 
                  className={`w-3.5 h-3.5 rounded flex items-center justify-center border transition-all ${
                    isVisible 
                      ? "bg-brand-teal/20 text-brand-rose" 
                      : "bg-transparent text-slate-600"
                  }`}
                  style={{ borderColor: isVisible ? cfg.color : '#376e6f20' }}
                >
                  {isVisible && <Check className="h-2.5 w-2.5 stroke-[3px]" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Datasets Descriptions */}
      <div className="text-[9px] text-slate-400 space-y-1 bg-brand-deep/20 p-2.5 rounded-xl border border-brand-teal/5">
        {METRIC_CONFIGS.filter(cfg => visibleMetrics[cfg.key]).map(cfg => (
          <div key={cfg.key} className="flex gap-1.5 items-start">
            <span className="font-bold text-slate-300 min-w-[70px] uppercase font-mono" style={{ color: cfg.color }}>
              • {cfg.shortLabel}:
            </span>
            <span className="italic leading-normal">{cfg.description}</span>
          </div>
        ))}
      </div>

      {/* Recharts Multi-Area Container */}
      <div className="h-52 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 5, right: 10, left: -25, bottom: 0 }}
          >
            <defs>
              {METRIC_CONFIGS.map(cfg => (
                <linearGradient key={cfg.gradientId} id={cfg.gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={cfg.color} stopOpacity={0.25}/>
                  <stop offset="95%" stopColor={cfg.color} stopOpacity={0.0}/>
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              vertical={false} 
              stroke="rgba(55, 110, 111, 0.08)" 
            />
            <XAxis 
              dataKey="day" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 8, fontWeight: '700', fontFamily: 'monospace' }}
            />
            <YAxis 
              domain={[0, 100]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 8, fontWeight: '700', fontFamily: 'monospace' }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-brand-deep border border-brand-teal/20 p-3 rounded-2xl shadow-xl space-y-1.5 min-w-[130px]">
                      <p className="text-[8.5px] font-mono font-bold text-slate-400 uppercase tracking-widest border-b border-brand-teal/10 pb-1 mb-1">
                        {payload[0].payload.day} Target
                      </p>
                      {payload.map((entry: any) => {
                        const cfg = METRIC_CONFIGS.find(c => c.key === entry.name);
                        if (!cfg) return null;
                        return (
                          <div key={entry.name} className="flex justify-between items-center gap-4 text-[9.5px]">
                            <span className="font-bold flex items-center gap-1 text-slate-300">
                              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: cfg.color }} />
                              {cfg.shortLabel}
                            </span>
                            <span className="font-mono font-black" style={{ color: cfg.color }}>
                              {entry.value}%
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  );
                }
                return null;
              }}
            />
            {METRIC_CONFIGS.map(cfg => {
              if (!visibleMetrics[cfg.key]) return null;
              return (
                <Area
                  key={cfg.key}
                  type="monotone"
                  dataKey={cfg.key}
                  name={cfg.key}
                  stroke={cfg.color}
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill={`url(#${cfg.gradientId})`}
                  activeDot={{ r: 5, strokeWidth: 1.5 }}
                />
              );
            })}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Mini Legend Row */}
      <div className="flex justify-between items-center text-[8px] font-mono font-extrabold text-slate-500 uppercase tracking-wider">
        <div className="flex gap-3">
          {visibleStats.map(stat => (
            <span key={stat.key}>Avg {stat.shortLabel}: {stat.avg}%</span>
          ))}
        </div>
        <span>Selected Location: {activeCity}</span>
      </div>
    </div>
  );
}
