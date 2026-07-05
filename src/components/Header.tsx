import React, { useState } from "react";
import { Compass, Menu, X, ShieldAlert, Users, Layers, AlertTriangle, MapPin, ChevronDown, Radio, GitCompare, Search } from "lucide-react";
import { motion } from "motion/react";

interface HeaderProps {
  activeTab: 'explore' | 'simulator' | 'compare' | 'hub' | 'navigator' | 'feeds' | 'alerts';
  setActiveTab: (tab: 'explore' | 'simulator' | 'compare' | 'hub' | 'navigator' | 'feeds' | 'alerts') => void;
  activeCity: string | null;
  setActiveCity: (city: string) => void;
  onOpenReportModal?: () => void;
  alertsCount?: number;
}

const cityMetaData = {
  varanasi: {
    name: "Varanasi",
    subtitle: "Kashi Heritage",
    logoChar: "V",
    colorClass: "bg-orange-600",
    textClass: "text-orange-700",
    hoverClass: "hover:bg-orange-700"
  },
  jaipur: {
    name: "Jaipur",
    subtitle: "Pink City Craft",
    logoChar: "J",
    colorClass: "bg-rose-600",
    textClass: "text-rose-700",
    hoverClass: "hover:bg-rose-700"
  },
  kochi: {
    name: "Kochi",
    subtitle: "Malabar Queen",
    logoChar: "K",
    colorClass: "bg-emerald-600",
    textClass: "text-emerald-700",
    hoverClass: "hover:bg-emerald-700"
  },
  hampi: {
    name: "Hampi",
    subtitle: "Vijayanagara Ruins",
    logoChar: "H",
    colorClass: "bg-amber-600",
    textClass: "text-amber-700",
    hoverClass: "hover:bg-amber-700"
  }
} as const;

const HERITAGE_SUGGESTIONS = [
  // Varanasi
  { name: "Varanasi", type: "city", cityId: "varanasi", subtitle: "Kashi Heritage Corridor" },
  { name: "Dashashwamedh Ghat", type: "landmark", cityId: "varanasi", subtitle: "Varanasi - River Front Purification" },
  { name: "Assi Ghat", type: "landmark", cityId: "varanasi", subtitle: "Varanasi - Boatmen Tourism Hub" },
  { name: "Godowlia Crossing", type: "landmark", cityId: "varanasi", subtitle: "Varanasi - Narrow Lane Gridlock Node" },
  { name: "Manikarnika Lane", type: "landmark", cityId: "varanasi", subtitle: "Varanasi - Ancient Corridor" },
  { name: "Madanpura Saree Lane", type: "landmark", cityId: "varanasi", subtitle: "Varanasi - Banarasi Weavers Co-op" },
  
  // Jaipur
  { name: "Jaipur", type: "city", cityId: "jaipur", subtitle: "Pink City Craft Corridor" },
  { name: "Hawa Mahal Crossing", type: "landmark", cityId: "jaipur", subtitle: "Jaipur - Palace Transit Gridlock" },
  { name: "Amber Fort Gateway", type: "landmark", cityId: "jaipur", subtitle: "Jaipur - Heritage Guides Assembly" },
  { name: "Johari Bazaar Lane", type: "landmark", cityId: "jaipur", subtitle: "Jaipur - Historic Palace Bazaar" },
  { name: "Sanganer Textile Lane", type: "landmark", cityId: "jaipur", subtitle: "Jaipur - Block Printing Hub" },
  { name: "Sanganer Craft Guild", type: "landmark", cityId: "jaipur", subtitle: "Jaipur - Blue Pottery Kilns" },
  { name: "Bapu Bazaar", type: "landmark", cityId: "jaipur", subtitle: "Jaipur - Craft Bazaar" },

  // Kochi
  { name: "Kochi", type: "city", cityId: "kochi", subtitle: "Malabar Queen Corridor" },
  { name: "Fort Kochi Nets", type: "landmark", cityId: "kochi", subtitle: "Kochi - Cantilever Fishing Nets" },
  { name: "Mattancherry Spice Street", type: "landmark", cityId: "kochi", subtitle: "Kochi - Spice Lane Gridlock" },
  { name: "Kalady Weavers Guild", type: "landmark", cityId: "kochi", subtitle: "Kochi - Coir Rug Spinning" },
  { name: "Vypin Ferry Dock", type: "landmark", cityId: "kochi", subtitle: "Kochi - Backwater Boat Ferries" },
  { name: "Jewish Town Lane", type: "landmark", cityId: "kochi", subtitle: "Kochi - Spices & Antiques" },

  // Hampi
  { name: "Hampi", type: "city", cityId: "hampi", subtitle: "Vijayanagara Ruins Corridor" },
  { name: "Virupaksha Temple Lane", type: "landmark", cityId: "hampi", subtitle: "Hampi - Shrines & Ancient Corridors" },
  { name: "Hampi Bazaar Walkway", type: "landmark", cityId: "hampi", subtitle: "Hampi - Solar Cart Shuttles" },
  { name: "Anegundi Craft Guild", type: "landmark", cityId: "hampi", subtitle: "Hampi - Banana Fiber Looms" },
  { name: "Kamalapura Sculpting Plaza", type: "landmark", cityId: "hampi", subtitle: "Hampi - Miniature Replica Carvers" },
  { name: "Vittala Temple Area", type: "landmark", cityId: "hampi", subtitle: "Hampi - Stone Chariot Complex" }
];

export default function Header({ 
  activeTab, 
  setActiveTab, 
  activeCity,
  setActiveCity,
  onOpenReportModal,
  alertsCount 
}: HeaderProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);

  const exactMatchExists = HERITAGE_SUGGESTIONS.some(item => 
    item.name.toLowerCase() === searchQuery.toLowerCase().trim()
  );

  const baseFiltered = searchQuery.trim() === ""
    ? HERITAGE_SUGGESTIONS
    : HERITAGE_SUGGESTIONS.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
      );

  const filteredSuggestions = [...baseFiltered];
  if (searchQuery.trim().length > 0 && !exactMatchExists) {
    const cleanQuery = searchQuery.trim();
    const cleanId = cleanQuery.toLowerCase().replace(/[^a-z0-9]/g, '');
    filteredSuggestions.push({
      name: `Initialize ${cleanQuery} Corridor`,
      type: "city",
      cityId: cleanId,
      subtitle: `✨ Generate dynamic AI metrics and policy hub for ${cleanQuery}`
    });
  }

  const navItems = [
    { id: 'explore', label: 'Explore & Plan', icon: Compass },
    { id: 'simulator', label: 'Scenario Simulator', icon: Layers },
    { id: 'compare', label: 'Scenario Comparison', icon: GitCompare },
    { id: 'hub', label: 'MicroPreneur Hub', icon: Users },
    { id: 'navigator', label: 'Trip Navigator', icon: MapPin },
    { id: 'feeds', label: 'Real-Time Feeds', icon: Radio },
    { id: 'alerts', label: 'Civic Security Logs', icon: ShieldAlert }
  ] as const;

  const currentCity = activeCity ? (cityMetaData[activeCity as keyof typeof cityMetaData] || {
    name: activeCity.charAt(0).toUpperCase() + activeCity.slice(1),
    subtitle: "Custom AI Corridor",
    logoChar: activeCity.charAt(0).toUpperCase(),
    colorClass: "bg-teal-600",
    textClass: "text-teal-700",
    hoverClass: "hover:bg-teal-700"
  }) : null;

  const selectCity = (city: string) => {
    setActiveCity(city);
    setIsCityDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-brand-dark/95 backdrop-blur-md border-b border-brand-teal/20 shadow-md text-white w-full">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
        
        {/* City/Landmark Search Bar */}
        <div className="relative flex-1 max-w-xs sm:max-w-sm hidden md:block" id="header-city-search-container">
          <div className="relative flex items-center">
            <Search className="absolute left-3 h-4 w-4 text-brand-teal pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchDropdownOpen(true);
              }}
              onFocus={() => setIsSearchDropdownOpen(true)}
              onBlur={() => {
                // Small delay to allow clicking suggestions before onBlur closes it
                setTimeout(() => setIsSearchDropdownOpen(false), 200);
              }}
              placeholder="Search heritage cities & landmarks..."
              className="w-full bg-brand-bg/70 hover:bg-brand-bg/90 focus:bg-brand-bg border border-brand-teal/25 hover:border-brand-rose/40 focus:border-brand-rose focus:ring-2 focus:ring-brand-rose/15 rounded-xl pl-9 pr-8 py-1.5 text-xs font-bold text-white transition-all duration-300 outline-none shadow-inner"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute right-3 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Search Dropdown Suggestions */}
          {isSearchDropdownOpen && filteredSuggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-brand-dark/95 backdrop-blur-md border border-brand-teal/30 rounded-xl shadow-2xl z-50 p-1.5 max-h-64 overflow-y-auto space-y-0.5 animate-fade-in scrollbar-thin scrollbar-thumb-brand-teal/20">
              {filteredSuggestions.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onMouseDown={() => {
                    selectCity(item.cityId);
                    setSearchQuery(item.name);
                    setIsSearchDropdownOpen(false);
                    // Navigate to explore to see changes
                    if (activeTab !== "explore" && activeTab !== "simulator") {
                      setActiveTab("explore");
                    }
                  }}
                  className="w-full flex items-start gap-2 px-3 py-1.5 text-left rounded-lg hover:bg-brand-bg/80 transition-all duration-200 group cursor-pointer"
                >
                  <MapPin className={`h-3.5 w-3.5 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform ${item.type === 'city' ? 'text-brand-rose' : 'text-brand-teal'}`} />
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-white group-hover:text-brand-rose transition-colors">
                      {item.name}
                    </span>
                    <span className="text-[9px] text-slate-400 font-medium truncate mt-0.5">
                      {item.subtitle}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Desktop Navigation - Pill styled */}
        <nav className="hidden lg:flex items-center bg-brand-bg/50 p-1 rounded-full border border-brand-teal/15 gap-0.5 xl:gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative px-2.5 xl:px-4 py-1.5 text-[11px] xl:text-xs font-bold rounded-full transition-all duration-300 flex items-center gap-1 xl:gap-1.5 cursor-pointer whitespace-nowrap ${
                  isActive
                    ? "text-brand-deep font-extrabold z-10"
                    : "text-slate-200 hover:text-white hover:bg-white/5"
                }`}
                id={`nav-item-${item.id}`}
              >
                {isActive && (
                  <motion.div
                    layoutId="headerActiveTabPill"
                    className="absolute inset-0 bg-brand-rose rounded-full -z-10 shadow-md"
                    transition={{ type: "spring", stiffness: 350, damping: 28 }}
                  />
                )}
                <Icon className={`h-3.5 w-3.5 flex-shrink-0 ${isActive ? "text-brand-deep" : "text-brand-teal"}`} />
                <span className="relative z-10">{item.label}</span>
                {item.id === 'alerts' && alertsCount > 0 && (
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-rose animate-pulse ml-0.5 flex-shrink-0 relative z-10" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Controls */}
        <div className="hidden lg:block w-4" />

        {/* Mobile Menu Trigger */}
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="lg:hidden p-2 text-slate-300 hover:text-white cursor-pointer"
          id="mobile-menu-trigger"
        >
          {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

      </div>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="lg:hidden border-t border-brand-teal/20 bg-brand-dark px-6 py-4 space-y-4 animate-fade-in absolute top-14 left-0 w-full shadow-lg z-50 text-white max-h-[85vh] overflow-y-auto">
          
          {/* Mobile Search input */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-brand-teal pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchDropdownOpen(true);
              }}
              onFocus={() => setIsSearchDropdownOpen(true)}
              onBlur={() => {
                setTimeout(() => setIsSearchDropdownOpen(false), 200);
              }}
              placeholder="Search cities & landmarks..."
              className="w-full bg-brand-bg/70 border border-brand-teal/20 focus:border-brand-rose focus:ring-2 focus:ring-brand-rose/15 rounded-xl pl-9 pr-8 py-2 text-xs font-bold text-white outline-none"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            )}

            {isSearchDropdownOpen && filteredSuggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-brand-dark border border-brand-teal/20 rounded-xl shadow-xl z-50 p-1.5 max-h-48 overflow-y-auto space-y-0.5">
                {filteredSuggestions.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onMouseDown={() => {
                      selectCity(item.cityId);
                      setSearchQuery(item.name);
                      setIsSearchDropdownOpen(false);
                      setIsMobileOpen(false);
                      if (activeTab !== "explore" && activeTab !== "simulator") {
                        setActiveTab("explore");
                      }
                    }}
                    className="w-full flex items-start gap-2 px-3 py-1.5 text-left rounded-lg hover:bg-brand-bg/80 transition-all duration-200"
                  >
                    <MapPin className={`h-3.5 w-3.5 mt-0.5 flex-shrink-0 ${item.type === 'city' ? 'text-brand-rose' : 'text-brand-teal'}`} />
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-bold text-white">
                        {item.name}
                      </span>
                      <span className="text-[9px] text-slate-400 font-medium truncate">
                        {item.subtitle}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 text-sm font-bold rounded-xl flex items-center gap-3 ${
                    isActive
                      ? "bg-brand-rose text-brand-deep"
                      : "text-slate-300 hover:bg-brand-bg/50"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? "text-brand-deep" : "text-brand-teal"}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="h-px bg-brand-teal/10 my-2" />

          {/* Mobile city choices list */}
          <div className="space-y-1">
            <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400 block px-2.5 font-mono">
              Active Destination
            </span>
            <div className="grid grid-cols-2 gap-2 p-1 bg-brand-bg/40 rounded-2xl border border-brand-teal/10">
              {Object.entries(cityMetaData).map(([id, data]) => (
                <button
                  key={id}
                  onClick={() => {
                    selectCity(id as any);
                    setIsMobileOpen(false);
                  }}
                  className={`py-2 text-center text-xs font-bold rounded-xl transition-all ${
                    activeCity === id 
                      ? "bg-brand-rose text-brand-deep shadow-sm" 
                      : "text-slate-300 hover:bg-brand-bg/60"
                  }`}
                >
                  {data.name}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile report action removed to put in Civic Security Logs */}
        </div>
      )}
    </header>
  );
}
