import React, { useState } from "react";
import { 
  Compass, 
  Users, 
  Layers, 
  AlertTriangle, 
  MapPin, 
  ChevronDown, 
  Radio, 
  ShieldAlert, 
  GitCompare,
  PlusCircle,
  HelpCircle,
  LayoutDashboard,
  Volume2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface SidebarProps {
  activeTab: 'explore' | 'simulator' | 'compare' | 'hub' | 'navigator' | 'feeds' | 'alerts' | 'dashboard' | 'storyteller';
  setActiveTab: (tab: 'explore' | 'simulator' | 'compare' | 'hub' | 'navigator' | 'feeds' | 'alerts' | 'dashboard' | 'storyteller') => void;
  activeCity: string | null;
  setActiveCity: (city: string) => void;
  onOpenReportModal: () => void;
  alertsCount: number;
}

const cityMetaData = {
  varanasi: {
    name: "Varanasi",
    subtitle: "Kashi Heritage",
    logoChar: "V",
    colorClass: "bg-orange-600",
    textClass: "text-orange-400"
  },
  jaipur: {
    name: "Jaipur",
    subtitle: "Pink City Craft",
    logoChar: "J",
    colorClass: "bg-rose-600",
    textClass: "text-rose-400"
  },
  kochi: {
    name: "Kochi",
    subtitle: "Malabar Queen",
    logoChar: "K",
    colorClass: "bg-emerald-600",
    textClass: "text-emerald-400"
  },
  hampi: {
    name: "Hampi",
    subtitle: "Vijayanagara Ruins",
    logoChar: "H",
    colorClass: "bg-amber-600",
    textClass: "text-amber-400"
  }
} as const;

export default function Sidebar({
  activeTab,
  setActiveTab,
  activeCity,
  setActiveCity,
  onOpenReportModal,
  alertsCount
}: SidebarProps) {
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);

  const navItems = [
    { id: 'explore', label: 'Explore & Plan', icon: Compass, badge: null },
    { id: 'dashboard', label: 'Stakeholder Board', icon: LayoutDashboard, badge: "GCP" },
    { id: 'storyteller', label: 'Cultural Storyteller', icon: Volume2, badge: "RAG" },
    { id: 'simulator', label: 'Scenario Simulator', icon: Layers, badge: null },
    { id: 'compare', label: 'Scenario Comparison', icon: GitCompare, badge: null },
    { id: 'hub', label: 'MicroPreneur Hub', icon: Users, badge: null },
    { id: 'navigator', label: 'Trip Navigator', icon: MapPin, badge: null },
    { id: 'feeds', label: 'Real-Time Feeds', icon: Radio, badge: "Live" },
    { id: 'alerts', label: 'Civic Security Logs', icon: ShieldAlert, badge: alertsCount > 0 ? `${alertsCount}` : null }
  ] as const;

  const currentCity = activeCity ? (cityMetaData[activeCity as keyof typeof cityMetaData] || {
    name: activeCity.charAt(0).toUpperCase() + activeCity.slice(1),
    subtitle: "Custom AI Corridor",
    logoChar: activeCity.charAt(0).toUpperCase(),
    colorClass: "bg-teal-600",
    textClass: "text-teal-400"
  }) : null;

  const selectCity = (city: string) => {
    setActiveCity(city);
    setIsCityDropdownOpen(false);
  };

  return (
    <aside 
      className="hidden lg:flex flex-col w-64 xl:w-72 h-screen sticky top-0 bg-gradient-to-b from-brand-deep to-brand-dark border-r border-brand-teal/15 text-white flex-shrink-0 select-none z-30"
      id="desktop-sidebar-pane"
    >
      {/* Brand Section */}
      <div className="p-6 border-b border-brand-teal/10 flex flex-col gap-1.5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-brand-rose flex items-center justify-center text-brand-deep font-extrabold text-xl shadow-md border border-brand-rose/20">
            {currentCity ? currentCity.logoChar : "L"}
          </div>
          <div>
            <h1 className="text-sm font-extrabold tracking-tight leading-none font-display text-white uppercase">
              LocalLens
            </h1>
            <p className="text-[10px] font-extrabold text-brand-rose tracking-wider uppercase mt-1 font-mono">
              Decision Platform
            </p>
          </div>
        </div>
      </div>

      {/* Selector Area (City Choice) */}
      <div className="px-4 py-4 border-b border-brand-teal/10">
        <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400 block mb-2 px-2 font-mono">
          Active Workspace
        </span>
        
        <div className="relative">
          <button
            onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
            className="w-full flex items-center justify-between gap-2.5 px-3.5 py-3 rounded-2xl bg-brand-bg/60 hover:bg-brand-bg/85 text-left text-xs font-bold text-slate-100 transition-all cursor-pointer border border-brand-teal/20 shadow-inner group"
            id="sidebar-city-selector-btn"
          >
            <div className="flex items-center gap-2 min-w-0">
              <MapPin className="h-4 w-4 text-brand-rose flex-shrink-0" />
              <div className="truncate">
                {currentCity ? (
                  <div className="flex flex-col">
                    <span className="font-extrabold text-xs text-white leading-none">{currentCity.name}</span>
                    <span className="text-[9px] text-brand-teal font-semibold mt-0.5">{currentCity.subtitle}</span>
                  </div>
                ) : (
                  <span className="text-slate-400 font-bold">Select Destination</span>
                )}
              </div>
            </div>
            <ChevronDown className={`h-3.5 w-3.5 text-slate-400 flex-shrink-0 transition-transform duration-200 ${isCityDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {isCityDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15 }}
                className="absolute left-0 right-0 mt-2 bg-brand-dark border border-brand-teal/20 rounded-2xl p-1.5 z-50 shadow-2xl"
              >
                {Object.entries(cityMetaData).map(([id, data]) => (
                  <button
                    key={id}
                    onClick={() => selectCity(id as any)}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer text-left ${
                      activeCity === id 
                        ? "bg-brand-rose text-brand-deep shadow-md font-extrabold" 
                        : "text-slate-300 hover:bg-brand-bg/50 hover:text-white"
                    }`}
                  >
                    <div className={`w-5.5 h-5.5 rounded-lg flex items-center justify-center font-extrabold text-[10px] ${
                      activeCity === id ? "bg-brand-deep text-brand-rose" : "bg-brand-teal text-white"
                    }`}>
                      {data.logoChar}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="leading-none text-xs">{data.name}</span>
                      <span className={`text-[9px] font-semibold mt-0.5 truncate ${
                        activeCity === id ? "text-brand-deep/85" : "text-brand-teal"
                      }`}>
                        {data.subtitle}
                      </span>
                    </div>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto custom-scrollbar">
        <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400 block mb-3 px-3 font-mono">
          Simulations & Plans
        </span>
        
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full relative px-3.5 py-3 text-xs font-bold rounded-xl transition-all duration-200 flex items-center justify-between gap-2.5 cursor-pointer group ${
                isActive
                  ? "text-brand-deep font-extrabold"
                  : "text-slate-300 hover:text-white hover:bg-white/5"
              }`}
              id={`sidebar-item-${item.id}`}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebarActivePill"
                  className="absolute inset-0 bg-brand-rose rounded-xl shadow-md"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              
              <div className="flex items-center gap-3 relative z-10 min-w-0">
                <Icon className={`h-4 w-4 flex-shrink-0 transition-colors ${
                  isActive ? "text-brand-deep" : "text-brand-teal group-hover:text-brand-rose"
                }`} />
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge && (
                <span className={`px-2 py-0.5 rounded-full text-[8px] font-extrabold uppercase tracking-wider relative z-10 ${
                  isActive
                    ? "bg-brand-deep text-brand-rose"
                    : item.id === 'alerts' 
                      ? "bg-brand-rose/20 text-brand-rose animate-pulse" 
                      : "bg-brand-teal/20 text-brand-teal"
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-brand-teal/10 space-y-3">
        {/* Active Logs Summary Widget */}
        <div className="p-3 bg-brand-deep/60 rounded-2xl border border-brand-rose/15 flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-brand-rose animate-ping flex-shrink-0" />
          <div className="min-w-0">
            <span className="text-[8px] font-bold text-slate-400 block uppercase tracking-widest font-mono">Civic Health</span>
            <span className="text-[10px] font-extrabold text-brand-rose uppercase tracking-wider">
              {alertsCount} Live Warnings
            </span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={onOpenReportModal}
          className="w-full py-3 bg-brand-rose hover:bg-brand-rose/95 text-brand-deep font-extrabold text-xs rounded-2xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 hover:shadow-[0_0_15px_rgba(230,72,51,0.25)] uppercase tracking-wider"
          id="sidebar-action-btn"
        >
          <PlusCircle className="h-4 w-4 flex-shrink-0" />
          <span>Report Incident</span>
        </button>
      </div>
    </aside>
  );
}
