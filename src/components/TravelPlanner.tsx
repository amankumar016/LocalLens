import React, { useState } from "react";
import { 
  Compass, 
  MapPin, 
  Sparkles, 
  IndianRupee, 
  Calendar, 
  Heart, 
  Users, 
  ChevronRight, 
  Activity, 
  ArrowRight, 
  ShoppingBag, 
  Coffee, 
  Clock, 
  HelpCircle, 
  CheckCircle, 
  RefreshCw,
  Sun,
  Shield,
  Send,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Map,
  Leaf,
  Info,
  Utensils
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ArtisanAndCraft {
  craftName: string;
  description: string;
  location: string;
}

interface ItineraryDay {
  day: number;
  title: string;
  morning: string;
  afternoon: string;
  evening: string;
  recommendedFood: string;
}

interface ExpenseBreakdown {
  stay: number;
  transport: number;
  food: number;
  activities: number;
}

interface SuggestionResult {
  destinationName: string;
  state: string;
  tagline: string;
  estimatedCost: number;
  suitabilityScore: number;
  safetyScore?: number;
  safetyDetails?: string;
  keyHighlights: string[];
  localArtisansAndCrafts: ArtisanAndCraft[];
  expenseBreakdown: ExpenseBreakdown;
  itinerary: ItineraryDay[];
  plannerAdvice: string;
}

const PRESET_DESTINATIONS = [
  {
    id: "varanasi",
    name: "Varanasi",
    state: "Uttar Pradesh",
    image: "https://images.unsplash.com/photo-1561244243-73a44c69d565?auto=format&fit=crop&q=80&w=600",
    tagline: "The Eternal Light on the Ganges",
    budgetGuide: "₹8,000 - ₹25,000"
  },
  {
    id: "jaipur",
    name: "Jaipur",
    state: "Rajasthan",
    image: "https://images.unsplash.com/photo-1599661046289-e31887846eac?auto=format&fit=crop&q=80&w=600",
    tagline: "Gilded Palaces & Royal Legacies",
    budgetGuide: "₹10,000 - ₹35,000"
  },
  {
    id: "kochi",
    name: "Kochi",
    state: "Kerala",
    image: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&q=80&w=600",
    tagline: "Malabar Breezes & Spice Channels",
    budgetGuide: "₹12,000 - ₹45,000"
  },
  {
    id: "hampi",
    name: "Hampi",
    state: "Karnataka",
    image: "https://images.unsplash.com/photo-1580541631972-1402737ad74a?auto=format&fit=crop&q=80&w=600",
    tagline: "Granite Monuments of a Lost Empire",
    budgetGuide: "₹7,500 - ₹22,000"
  }
];

const EXTRA_PRESET_DESTINATIONS = [
  {
    id: "udaipur",
    name: "Udaipur",
    state: "Rajasthan",
    image: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&q=80&w=600",
    tagline: "Lake Palaces & Miniature Painting Guilds",
    budgetGuide: "₹12,000 - ₹38,000"
  },
  {
    id: "srinagar",
    name: "Srinagar",
    state: "Kashmir",
    image: "https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&q=80&w=600",
    tagline: "Pashmina Weavers & Shikara Lake Cruises",
    budgetGuide: "₹15,000 - ₹45,000"
  },
  {
    id: "mysore",
    name: "Mysore",
    state: "Karnataka",
    image: "https://images.unsplash.com/photo-1600100397990-24b5e28a491a?auto=format&fit=crop&q=80&w=600",
    tagline: "Sandalwood Carvings & Royal Palaces",
    budgetGuide: "₹8,000 - ₹24,000"
  },
  {
    id: "darjeeling",
    name: "Darjeeling",
    state: "West Bengal",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=600",
    tagline: "Himalayan Toy Train & Tea Walks",
    budgetGuide: "₹10,000 - ₹30,000"
  },
  {
    id: "agra",
    name: "Agra",
    state: "Uttar Pradesh",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&q=80&w=600",
    tagline: "Taj Mahal & Mughal Marble Artisans",
    budgetGuide: "₹6,000 - ₹22,000"
  },
  {
    id: "amritsar",
    name: "Amritsar",
    state: "Punjab",
    image: "https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&q=80&w=600",
    tagline: "Golden Temple & Phulkari Embroidery",
    budgetGuide: "₹7,000 - ₹22,000"
  },
  {
    id: "jaisalmer",
    name: "Jaisalmer",
    state: "Rajasthan",
    image: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&q=80&w=600",
    tagline: "Golden Fort & Leather Embroidery Guilds",
    budgetGuide: "₹9,000 - ₹28,000"
  },
  {
    id: "madurai",
    name: "Madurai",
    state: "Tamil Nadu",
    image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&q=80&w=600",
    tagline: "Temple Gopurams & Jasmine Weavers",
    budgetGuide: "₹7,500 - ₹21,000"
  },
  {
    id: "goa",
    name: "Goa",
    state: "West Coast",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600",
    tagline: "Portuguese Heritage & Beach Potters",
    budgetGuide: "₹12,000 - ₹40,000"
  },
  {
    id: "pondicherry",
    name: "Pondicherry",
    state: "Puducherry",
    image: "https://images.unsplash.com/photo-1590050752117-238cb0612b1b?auto=format&fit=crop&q=80&w=600",
    tagline: "French Alleys & Terracotta Potteries",
    budgetGuide: "₹9,500 - ₹32,000"
  },
  {
    id: "gokarna",
    name: "Gokarna",
    state: "Karnataka",
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=600",
    tagline: "Pristine Beaches & Sacred Temple Walks",
    budgetGuide: "₹6,000 - ₹18,000"
  }
];

interface TravelPlannerProps {
  activeCity: string | null;
  onCitySelected: (city: string) => void;
  setActiveTab: (tab: 'explore' | 'simulator' | 'compare' | 'hub' | 'navigator' | 'feeds' | 'alerts') => void;
  activeHazard?: string;
  activeAlerts?: string[];
}

const PLACE_SUGGESTIONS = [
  { name: "Varanasi", state: "Uttar Pradesh", description: "Ancient Ghats & Banarasi Loom Walks" },
  { name: "Jaipur", state: "Rajasthan", description: "Royal Forts & Blue Pottery Studios" },
  { name: "Kochi", state: "Kerala", description: "Coir Weavers & Malabar Backwaters" },
  { name: "Hampi", state: "Karnataka", description: "Granite Monoliths & Banana Fiber Crafts" },
  { name: "Goa", state: "West Coast", description: "Portuguese Heritage & Sun-kissed Forts" },
  { name: "Udaipur", state: "Rajasthan", description: "Lake Palaces & Miniature Painting Guilds" },
  { name: "Agra", state: "Uttar Pradesh", description: "Taj Mahal & Marble Inlay Artisans" },
  { name: "Srinagar", state: "Kashmir", description: "Pashmina Weavers & Shikara Lake Cruising" },
  { name: "Jaisalmer", state: "Rajasthan", description: "Golden Sandstone Fort & Leather Embroidery" },
  { name: "Mysore", state: "Karnataka", description: "Royal Sandalwood Carvings & Rosewood Inlay" },
  { name: "Madurai", state: "Tamil Nadu", description: "Meenakshi Temple & Jasmine Garland Weavers" },
  { name: "Amritsar", state: "Punjab", description: "Golden Temple Precinct & Phulkari Embroidery" },
  { name: "Bhuj", state: "Gujarat", description: "Kutch Rabari Hand-Embroidery & Block Printing" },
  { name: "Darjeeling", state: "West Bengal", description: "Himalayan Toy Train & Organic Tea Estate Walks" }
];

export default function TravelPlanner({
  activeCity,
  onCitySelected,
  setActiveTab,
  activeHazard = "low",
  activeAlerts = []
}: TravelPlannerProps) {
  // Input fields state
  const [destination, setDestination] = useState<string>("Anywhere");
  const [budget, setBudget] = useState<number>(25000);
  const [duration, setDuration] = useState<number>(3);
  const [style, setStyle] = useState<string>("Heritage & Culture");
  const [companions, setCompanions] = useState<string>("Solo");
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  
  // States for interactive itinerary view
  const [expandedDays, setExpandedDays] = useState<Record<number, boolean>>({ 1: true });
  const [hoveredLandmark, setHoveredLandmark] = useState<string | null>(null);
  const [selectedLandmark, setSelectedLandmark] = useState<string | null>(null);
  
  // High-fidelity image toggle and fallback states
  const [useVectorArt, setUseVectorArt] = useState<boolean>(false);
  const [showAllCities, setShowAllCities] = useState<boolean>(false);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const handleImageError = (id: string) => {
    setImageErrors(prev => ({ ...prev, [id]: true }));
  };

  const GRADIENT_THEMES: Record<string, { gradient: string; localScript: string; iconLabel: string; bgEffect: string }> = {
    varanasi: {
      gradient: "from-orange-600 via-rose-950 to-[#122223]",
      localScript: "काशी",
      iconLabel: "⚓ River Ghats",
      bgEffect: "radial-gradient(circle at top right, rgba(251, 146, 60, 0.15), transparent)"
    },
    jaipur: {
      gradient: "from-[#DA7B93] via-[#E64833] to-stone-900",
      localScript: "जयपुर",
      iconLabel: "👑 Pink Palace",
      bgEffect: "radial-gradient(circle at top right, rgba(218, 123, 147, 0.15), transparent)"
    },
    kochi: {
      gradient: "from-teal-700 via-[#1C3334] to-blue-950",
      localScript: "കൊച്ചി",
      iconLabel: "⛵ Spice Port",
      bgEffect: "radial-gradient(circle at top right, rgba(45, 212, 191, 0.15), transparent)"
    },
    hampi: {
      gradient: "from-amber-600 via-stone-700 to-stone-900",
      localScript: "ಹಂಪಿ",
      iconLabel: "🏛️ Stone Chariot",
      bgEffect: "radial-gradient(circle at top right, rgba(245, 158, 11, 0.15), transparent)"
    },
    udaipur: {
      gradient: "from-blue-600 via-indigo-950 to-stone-900",
      localScript: "उदयपुर",
      iconLabel: "⛵ Lake Pichola",
      bgEffect: "radial-gradient(circle at top right, rgba(37, 99, 235, 0.15), transparent)"
    },
    srinagar: {
      gradient: "from-teal-600 via-slate-900 to-indigo-950",
      localScript: "श्रीनगर",
      iconLabel: "🌸 Dal Lake",
      bgEffect: "radial-gradient(circle at top right, rgba(13, 148, 136, 0.15), transparent)"
    },
    mysore: {
      gradient: "from-amber-700 via-red-950 to-[#122223]",
      localScript: "ಮೈಸೂರು",
      iconLabel: "👑 Mysore Palace",
      bgEffect: "radial-gradient(circle at top right, rgba(180, 83, 9, 0.15), transparent)"
    },
    darjeeling: {
      gradient: "from-emerald-700 via-teal-950 to-stone-900",
      localScript: "দার্জিলিং",
      iconLabel: "🚂 Toy Train",
      bgEffect: "radial-gradient(circle at top right, rgba(4, 120, 87, 0.15), transparent)"
    },
    agra: {
      gradient: "from-yellow-600 via-orange-950 to-stone-900",
      localScript: "आगरा",
      iconLabel: "🏛️ Taj Mahal",
      bgEffect: "radial-gradient(circle at top right, rgba(202, 138, 4, 0.15), transparent)"
    },
    amritsar: {
      gradient: "from-amber-500 via-yellow-700 to-amber-950",
      localScript: "ਅੰਮ੍ਰਿਤਸਰ",
      iconLabel: "🛕 Golden Temple",
      bgEffect: "radial-gradient(circle at top right, rgba(245, 158, 11, 0.15), transparent)"
    },
    jaisalmer: {
      gradient: "from-yellow-600 via-amber-800 to-stone-950",
      localScript: "जैसलमेर",
      iconLabel: "🐪 Thar Desert",
      bgEffect: "radial-gradient(circle at top right, rgba(217, 119, 6, 0.15), transparent)"
    },
    madurai: {
      gradient: "from-purple-700 via-rose-950 to-stone-900",
      localScript: "மதுரை",
      iconLabel: "🛕 Meenakshi Temple",
      bgEffect: "radial-gradient(circle at top right, rgba(109, 40, 217, 0.15), transparent)"
    },
    goa: {
      gradient: "from-cyan-600 via-sky-850 to-blue-950",
      localScript: "गोंय",
      iconLabel: "⛵ Fort Aguada",
      bgEffect: "radial-gradient(circle at top right, rgba(8, 145, 178, 0.15), transparent)"
    },
    pondicherry: {
      gradient: "from-yellow-500 via-teal-900 to-slate-900",
      localScript: "புதுச்சேரி",
      iconLabel: "🏺 Auroville Clay",
      bgEffect: "radial-gradient(circle at top right, rgba(234, 179, 8, 0.15), transparent)"
    },
    gokarna: {
      gradient: "from-teal-600 via-emerald-900 to-blue-950",
      localScript: "ಗೋಕರ್ಣ",
      iconLabel: "🏖️ Om Beach",
      bgEffect: "radial-gradient(circle at top right, rgba(13, 148, 136, 0.15), transparent)"
    }
  };

  // Filtered suggestions based on user input
  const filteredSuggestions = PLACE_SUGGESTIONS.filter(item => {
    if (!destination || destination.toLowerCase() === "anywhere") {
      return true;
    }
    return (
      item.name.toLowerCase().includes(destination.toLowerCase()) ||
      item.state.toLowerCase().includes(destination.toLowerCase()) ||
      item.description.toLowerCase().includes(destination.toLowerCase())
    );
  });

  // API response and status
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SuggestionResult[] | null>(null);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number>(0);
  const [chosenOptionIndex, setChosenOptionIndex] = useState<number>(0);
  
  // Tab within suggestion results: 'itinerary' | 'crafts' | 'breakdown'
  const [activeResultTab, setActiveResultTab] = useState<'itinerary' | 'crafts' | 'breakdown'>('itinerary');
  const [loadingStep, setLoadingStep] = useState<number>(0);

  const stepsText = [
    "Consulting local trade guides & municipal rosters...",
    "Calibrating micro-entrepreneur services & rate boards...",
    "Querying regional climate & geographic registries...",
    "Structuring deep day-wise cultural itineraries..."
  ];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    setSelectedOptionIndex(0);
    setChosenOptionIndex(0);

    // Staggered loading text transitions
    setLoadingStep(0);
    const interval = setInterval(() => {
      setLoadingStep(prev => (prev < 3 ? prev + 1 : prev));
    }, 1500);

    try {
      const res = await fetch("/api/travel/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination,
          budget,
          duration,
          style,
          companions,
          activeHazard,
          activeAlerts
        })
      });

      if (!res.ok) {
        throw new Error("Municipal API failed to return valid travel suggestions. Please retry.");
      }

      const data = await res.json();
      if (data.suggestions) {
        setResult(data.suggestions);
        setSelectedOptionIndex(0);
        setChosenOptionIndex(0);
        if (data.suggestions.length > 0) {
          const firstSug = data.suggestions[0];
          const name = firstSug.destinationName.toLowerCase();
          if (name.includes("varanasi")) {
            onCitySelected("varanasi");
          } else if (name.includes("jaipur")) {
            onCitySelected("jaipur");
          } else if (name.includes("kochi") || name.includes("kerala")) {
            onCitySelected("kochi");
          } else if (name.includes("hampi")) {
            onCitySelected("hampi");
          }
        }
      } else {
        throw new Error("No suggestions found. Try adjusting budget or style.");
      }
    } catch (err: any) {
      setError(err.message || "Connection timed out.");
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  const handleQuickDestinationSelect = (destName: string, destId: string) => {
    setDestination(destName);
    onCitySelected(destId as any);
    // Auto scroll down to planner setup form
    const formElement = document.getElementById("planner-form-panel");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="space-y-10 lg:col-span-12" id="india-travel-planner-root">
      
      {/* QUICK SELECT INSPIRATION CARDS */}
      <div className="space-y-4">
        <div className="flex justify-between items-end">
          <div>
            <h3 className="text-lg font-extrabold text-white font-display">Select Pre-Audited Heritage Cities</h3>
            <p className="text-xs text-slate-400">Jumpstart your trip setup with verified municipal corridors</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setUseVectorArt(prev => !prev)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-bg hover:bg-brand-bg/85 border border-brand-teal/15 hover:border-brand-rose/40 rounded-xl text-[10px] font-bold text-slate-300 uppercase tracking-wider transition-all cursor-pointer shadow-sm select-none"
            >
              {useVectorArt ? "🖼️ Show Stock Photos" : "🎨 Show Swadeshi Gradients"}
            </button>
            <span className="text-[10px] font-bold text-brand-rose uppercase tracking-wider font-mono bg-brand-rose/10 px-2 py-1 rounded-lg border border-brand-rose/25 hidden sm:inline-block">
              {showAllCities ? "15 Cities Active" : "4 Primary Hubs"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PRESET_DESTINATIONS.map((preset) => {
            const hasError = imageErrors[preset.id];
            const shouldShowVector = useVectorArt || hasError;
            const theme = GRADIENT_THEMES[preset.id as keyof typeof GRADIENT_THEMES] || {
              gradient: "from-teal-700 via-slate-800 to-slate-900",
              localScript: "भारत",
              iconLabel: "📍 Corridor",
              bgEffect: ""
            };

            return (
              <div 
                key={preset.id}
                onClick={() => handleQuickDestinationSelect(preset.name, preset.id)}
                className="group relative h-48 rounded-[24px] overflow-hidden border border-brand-teal/15 hover:border-brand-rose/40 cursor-pointer shadow-lg transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between"
              >
                {shouldShowVector ? (
                  /* Gorgeous CSS Swadeshi Art Gradient background with authentic photo blend */
                  <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} flex flex-col justify-between p-4 overflow-hidden`}>
                    {!hasError && (
                      <img 
                        src={preset.image} 
                        alt={preset.name}
                        referrerPolicy="no-referrer"
                        onError={() => handleImageError(preset.id)}
                        className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-luminosity pointer-events-none transition-transform duration-500 group-hover:scale-110"
                      />
                    )}
                    {/* Background geometric texture overlay */}
                    <div className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "12px 12px" }} />
                    {theme.bgEffect && <div className="absolute inset-0 pointer-events-none" style={{ background: theme.bgEffect }} />}
                    
                    {/* Top row with localized authentic script */}
                    <div className="flex justify-between items-start z-10">
                      <span className="text-[10px] font-bold text-brand-rose uppercase tracking-wider font-mono">{preset.state}</span>
                      <span className="text-lg font-black font-display text-white/20 select-none tracking-widest">{theme.localScript}</span>
                    </div>

                    {/* Emblem Badge indicator */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center opacity-60 group-hover:scale-110 group-hover:opacity-100 transition-all duration-300">
                      <span className="text-xl font-bold select-none text-white/80">{preset.name.charAt(0)}</span>
                    </div>
                  </div>
                ) : (
                  /* Standard Image container */
                  <>
                    <img 
                      src={preset.image} 
                      alt={preset.name}
                      referrerPolicy="no-referrer"
                      onError={() => handleImageError(preset.id)}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/10" />
                  </>
                )}

                {/* Shared Text overlay so they are perfectly consistent in layout */}
                <div className="absolute inset-x-0 bottom-0 p-4 flex flex-col justify-end text-white z-20">
                  {!shouldShowVector && (
                    <span className="text-[9px] font-mono font-bold text-brand-rose uppercase tracking-wider">{preset.state}</span>
                  )}
                  <h4 className="text-lg font-black font-display tracking-tight leading-tight mt-0.5 group-hover:text-brand-rose transition-colors flex items-center gap-1.5">
                    {preset.name}
                    {shouldShowVector && (
                      <span className="text-[9px] font-mono font-bold text-brand-teal tracking-normal normal-case opacity-90">({theme.iconLabel})</span>
                    )}
                  </h4>
                  <p className="text-[10px] text-slate-300 mt-1 truncate font-semibold">{preset.tagline}</p>
                  
                  <div className="mt-3 pt-2 border-t border-white/10 flex justify-between items-center text-[9px] font-mono">
                    <span className="text-slate-400">Cost bracket:</span>
                    <span className="text-brand-teal font-black">{preset.budgetGuide}</span>
                  </div>
                </div>
              </div>
            );
          })}

          <AnimatePresence>
            {showAllCities && EXTRA_PRESET_DESTINATIONS.map((preset) => {
              const hasError = imageErrors[preset.id];
              const shouldShowVector = useVectorArt || hasError;
              const theme = GRADIENT_THEMES[preset.id as keyof typeof GRADIENT_THEMES] || {
                gradient: "from-teal-700 via-slate-800 to-slate-900",
                localScript: "भारत",
                iconLabel: "📍 Corridor",
                bgEffect: ""
              };

              return (
                <motion.div 
                  key={preset.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => handleQuickDestinationSelect(preset.name, preset.id)}
                  className="group relative h-48 rounded-[24px] overflow-hidden border border-brand-teal/15 hover:border-brand-rose/40 cursor-pointer shadow-lg transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between"
                >
                  {shouldShowVector ? (
                    /* Gorgeous CSS Swadeshi Art Gradient background with authentic photo blend */
                    <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} flex flex-col justify-between p-4 overflow-hidden`}>
                      {!hasError && (
                        <img 
                          src={preset.image} 
                          alt={preset.name}
                          referrerPolicy="no-referrer"
                          onError={() => handleImageError(preset.id)}
                          className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-luminosity pointer-events-none transition-transform duration-500 group-hover:scale-110"
                        />
                      )}
                      {/* Background geometric texture overlay */}
                      <div className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "12px 12px" }} />
                      {theme.bgEffect && <div className="absolute inset-0 pointer-events-none" style={{ background: theme.bgEffect }} />}
                      
                      {/* Top row with localized authentic script */}
                      <div className="flex justify-between items-start z-10">
                        <span className="text-[10px] font-bold text-brand-rose uppercase tracking-wider font-mono">{preset.state}</span>
                        <span className="text-lg font-black font-display text-white/20 select-none tracking-widest">{theme.localScript}</span>
                      </div>

                      {/* Emblem Badge indicator */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center opacity-60 group-hover:scale-110 group-hover:opacity-100 transition-all duration-300">
                        <span className="text-xl font-bold select-none text-white/80">{preset.name.charAt(0)}</span>
                      </div>
                    </div>
                  ) : (
                    /* Standard Image container */
                    <>
                      <img 
                        src={preset.image} 
                        alt={preset.name}
                        referrerPolicy="no-referrer"
                        onError={() => handleImageError(preset.id)}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/10" />
                    </>
                  )}

                  {/* Shared Text overlay so they are perfectly consistent in layout */}
                  <div className="absolute inset-x-0 bottom-0 p-4 flex flex-col justify-end text-white z-20">
                    {!shouldShowVector && (
                      <span className="text-[9px] font-mono font-bold text-brand-rose uppercase tracking-wider">{preset.state}</span>
                    )}
                    <h4 className="text-lg font-black font-display tracking-tight leading-tight mt-0.5 group-hover:text-brand-rose transition-colors flex items-center gap-1.5">
                      {preset.name}
                      {shouldShowVector && (
                        <span className="text-[9px] font-mono font-bold text-brand-teal tracking-normal normal-case opacity-90">({theme.iconLabel})</span>
                      )}
                    </h4>
                    <p className="text-[10px] text-slate-300 mt-1 truncate font-semibold">{preset.tagline}</p>
                    
                    <div className="mt-3 pt-2 border-t border-white/10 flex justify-between items-center text-[9px] font-mono">
                      <span className="text-slate-400">Cost bracket:</span>
                      <span className="text-brand-teal font-black">{preset.budgetGuide}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        <div className="flex justify-center pt-4">
          <button
            type="button"
            onClick={() => setShowAllCities(prev => !prev)}
            className="group/btn flex items-center gap-2 px-6 py-2.5 bg-brand-bg hover:bg-brand-bg/85 border border-brand-teal/20 hover:border-brand-rose/50 rounded-2xl text-xs font-extrabold text-white uppercase tracking-wider transition-all duration-300 cursor-pointer shadow-lg hover:shadow-brand-rose/5 select-none"
          >
            <Compass className={`h-4 w-4 text-brand-rose transition-transform duration-500 ${showAllCities ? "rotate-180" : "group-hover/btn:rotate-90"}`} />
            {showAllCities ? "Show Fewer Cities" : "Explore More Indian Tourist Cities (+11)"}
          </button>
        </div>
      </div>

      {/* TRIP PLANNER FORM & RESULTS VIEWPORT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" id="planner-form-panel">
        
        {/* LEFT COLUMN: PARAMETERS CONSOLE */}
        <div className="lg:col-span-4 bg-brand-dark p-6 rounded-[32px] border border-brand-teal/20 shadow-xl space-y-6 text-white sticky top-24">
          <div className="border-b border-brand-teal/10 pb-4">
            <h3 className="text-sm font-extrabold text-white font-display uppercase tracking-widest flex items-center gap-2">
              <Activity className="h-4.5 w-4.5 text-brand-rose" />
              Planner Parameter Deck
            </h3>
            <p className="text-[10px] text-slate-400 mt-1">Calibrate constraints to feed the Swadeshi suggestion core.</p>
          </div>

          <form onSubmit={handleGenerate} className="space-y-4 text-slate-200">
            
            {/* Input 1: Destination Selection */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-1">
                <MapPin className="h-3 w-3 text-brand-rose" />
                Selected Destination / Region
              </label>
              <div className="relative flex items-center">
                <MapPin className="absolute left-3 h-3.5 w-3.5 text-brand-rose pointer-events-none" />
                <input 
                  type="text" 
                  value={destination}
                  onChange={(e) => {
                    setDestination(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => {
                    // Small timeout to allow mouseDown execution before dropdown unmounts
                    setTimeout(() => setShowSuggestions(false), 200);
                  }}
                  placeholder="e.g. Jaipur, Varanasi, Goa, Anywhere"
                  className="w-full bg-brand-bg/70 hover:bg-brand-bg focus:bg-brand-bg border border-brand-teal/20 hover:border-brand-rose/35 focus:border-brand-rose focus:ring-2 focus:ring-brand-rose/15 rounded-xl pl-9 pr-20 py-2.5 text-xs font-bold text-white transition-all duration-300 outline-none shadow-inner"
                />
                <button
                  type="button"
                  onClick={() => setDestination("Anywhere")}
                  className="absolute right-2.5 py-1 px-2.5 bg-brand-dark/90 hover:bg-brand-dark hover:text-brand-rose text-[8.5px] font-bold rounded text-slate-300 border border-brand-teal/10 hover:border-brand-rose/30 transition-all uppercase cursor-pointer"
                >
                  Anywhere
                </button>

                {showSuggestions && filteredSuggestions.length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-2 bg-brand-dark/95 backdrop-blur-md border border-brand-teal/30 rounded-xl shadow-2xl z-50 p-1.5 max-h-56 overflow-y-auto space-y-0.5 animate-fade-in scrollbar-thin scrollbar-thumb-brand-teal/20">
                    {filteredSuggestions.map((item, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onMouseDown={() => {
                          setDestination(`${item.name}, ${item.state}`);
                          setShowSuggestions(false);
                        }}
                        className="w-full flex items-start gap-2 px-3 py-2 text-left rounded-lg hover:bg-brand-bg/80 transition-all duration-200 group cursor-pointer"
                      >
                        <MapPin className="h-3.5 w-3.5 text-brand-rose mt-0.5 group-hover:scale-110 transition-transform flex-shrink-0" />
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-bold text-white group-hover:text-brand-rose transition-colors">
                            {item.name}, <span className="text-[10px] text-brand-teal font-semibold">{item.state}</span>
                          </span>
                          <span className="text-[9px] text-slate-400 font-medium truncate mt-0.5">
                            {item.description}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Input 2: Total Budget */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-1">
                  <IndianRupee className="h-3 w-3 text-brand-rose" />
                  Trip Target Budget
                </label>
                <span className="text-xs font-mono font-extrabold text-brand-teal bg-brand-teal/10 px-2 py-0.5 rounded border border-brand-teal/20">
                  ₹{budget.toLocaleString('en-IN')}
                </span>
              </div>
              
              <div className="p-3 bg-brand-bg/40 rounded-xl border border-brand-teal/10 space-y-2">
                <input 
                  type="range"
                  min="3000"
                  max="150000"
                  step="2500"
                  value={budget}
                  onChange={(e) => setBudget(parseInt(e.target.value))}
                  className="w-full h-1 cursor-pointer bg-brand-bg accent-brand-rose"
                />
                <div className="flex justify-between text-[9px] font-mono text-slate-500">
                  <span>₹3K (Backpacker)</span>
                  <span>₹50K (Heritage)</span>
                  <span>₹1.5L (Luxury)</span>
                </div>
              </div>
            </div>

            {/* Input 3: Duration selection */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-1">
                <Calendar className="h-3 w-3 text-brand-rose" />
                Travel Duration
              </label>
              <div className="grid grid-cols-5 gap-2">
                {[2, 3, 5, 7, 10].map((days) => (
                  <button
                    key={days}
                    type="button"
                    onClick={() => setDuration(days)}
                    className={`py-2 rounded-xl text-xs font-extrabold uppercase transition-all border cursor-pointer ${
                      duration === days 
                        ? "bg-brand-rose text-brand-deep border-brand-rose shadow-sm" 
                        : "bg-brand-bg hover:bg-brand-bg/80 border-brand-teal/10 text-slate-300"
                    }`}
                  >
                    {days}D
                  </button>
                ))}
              </div>
            </div>

            {/* Input 4: Travel Vibe Style */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-1">
                <Heart className="h-3 w-3 text-brand-rose" />
                Travel Vibe / Style
              </label>
              <select 
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full bg-brand-bg hover:bg-brand-bg/80 focus:bg-brand-bg border border-brand-teal/15 rounded-xl px-3.5 py-2.5 text-xs font-bold text-white transition-all outline-none"
              >
                <option value="Heritage & Culture">Heritage, History & Arts</option>
                <option value="Spiritual & Peace">Spiritual Seeker & Peace</option>
                <option value="Adventure & Nature">Nature Wanderer & Trekking</option>
                <option value="Beach & Relaxation">Tropical Beach & Coastal Life</option>
                <option value="Luxury & Royal">Royal Palace Luxury Escapes</option>
              </select>
            </div>

            {/* Input 5: Companions */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-1">
                <Users className="h-3 w-3 text-brand-rose" />
                Companions Type
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {["Solo", "Couple", "Friends", "Family"].map((comp) => (
                  <button
                    key={comp}
                    type="button"
                    onClick={() => setCompanions(comp)}
                    className={`py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all border cursor-pointer ${
                      companions === comp 
                        ? "bg-brand-teal text-brand-deep border-brand-teal" 
                        : "bg-brand-bg hover:bg-brand-bg/80 border-brand-teal/10 text-slate-300"
                    }`}
                  >
                    {comp}
                  </button>
                ))}
              </div>
            </div>

            {/* Generation Trigger Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-brand-rose hover:bg-brand-rose/90 disabled:opacity-50 text-brand-deep rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 mt-4"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin text-brand-deep" />
                  Generating Plan...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 text-brand-deep fill-brand-deep" />
                  Architect Itinerary
                </>
              )}
            </button>

          </form>

          {/* Quick Disclaimer / Support Badge */}
          <div className="p-3 bg-brand-bg/30 rounded-2xl border border-brand-teal/10 flex items-start gap-2.5">
            <Shield className="h-4 w-4 text-brand-teal shrink-0 mt-0.5" />
            <div className="text-[9.5px] text-slate-400 leading-normal font-medium">
              Every curated suggestion highlights authentic regional crafts and micro-entrepreneurs, allowing you to directly inject cash into the grass-roots Swadeshi economy.
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: SUITE OF RECOMMENDATION RESULTS */}
        <div className="lg:col-span-8 space-y-8" id="suggestion-results-panel">
          
          {/* 1. SKELETON LOADING SCREEN STATE (AI GENERATION) */}
          {loading && (
            <div className="space-y-6">
              {/* Header Status Bar */}
              <div className="bg-brand-dark p-6 rounded-3xl border border-brand-teal/20 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full border-2 border-brand-rose/25 border-t-brand-rose animate-spin" />
                    <Compass className="h-4.5 w-4.5 text-brand-rose absolute top-2.5 left-2.5 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black font-display text-white uppercase tracking-wider">
                      Architecting Swadeshi Corridor
                    </h4>
                    <span className="text-[9px] text-brand-teal font-mono uppercase tracking-widest block animate-pulse">
                      Gemini Core 3.5 Active & Calibrating
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-brand-bg px-4 py-2.5 rounded-xl border border-brand-teal/10 w-full md:w-auto">
                  <span className="w-2 h-2 rounded-full bg-brand-rose animate-ping shrink-0" />
                  <div className="h-5 overflow-hidden relative w-56 text-left">
                    <AnimatePresence mode="wait">
                      <motion.p 
                        key={loadingStep}
                        initial={{ y: 15, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -15, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="text-[10px] font-bold text-slate-300 font-mono tracking-tight leading-normal"
                      >
                        {stepsText[loadingStep]}
                      </motion.p>
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {/* Split Screen Desktop Skeletons */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left side: Route & Timeline Cards Skeletons (lg:col-span-7) */}
                <div className="lg:col-span-7 xl:col-span-8 space-y-6">
                  
                  {/* Generated Heritage Corridors Skeleton Header */}
                  <div className="bg-brand-dark p-5 rounded-3xl border border-brand-teal/15 space-y-4">
                    <div className="h-4 bg-slate-800 rounded w-1/3 animate-pulse" />
                    
                    {/* Pulsing Option Skeletons */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[1, 2].map((i) => (
                        <div key={i} className="p-4 bg-brand-bg/30 rounded-2xl border border-brand-teal/10 space-y-3 animate-pulse">
                          <div className="flex justify-between">
                            <div className="h-3 bg-slate-800 rounded w-1/4" />
                            <div className="h-4 bg-slate-800 rounded-full w-12" />
                          </div>
                          <div className="h-4 bg-slate-700 rounded w-2/3" />
                          <div className="space-y-1.5">
                            <div className="h-2.5 bg-slate-800 rounded w-full" />
                            <div className="h-2.5 bg-slate-800 rounded w-5/6" />
                          </div>
                          <div className="flex justify-between items-center pt-2 border-t border-brand-teal/5">
                            <div className="h-3 bg-slate-800 rounded w-1/3" />
                            <div className="flex gap-2">
                              <div className="h-5 bg-slate-800 rounded w-12" />
                              <div className="h-5 bg-slate-700 rounded w-12" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Day Timeline Route Cards Skeleton */}
                  <div className="bg-brand-dark p-5 rounded-3xl border border-brand-teal/15 space-y-6">
                    <div className="flex items-center justify-between border-b border-brand-teal/10 pb-3">
                      <div className="h-4 bg-slate-800 rounded w-1/4 animate-pulse" />
                      <div className="h-4 bg-slate-800 rounded w-1/6 animate-pulse" />
                    </div>

                    {/* Timeline vertical bar & dots */}
                    <div className="space-y-6 relative before:absolute before:top-4 before:bottom-4 before:left-3.5 before:w-0.5 before:bg-slate-800/80 pl-10">
                      {[1, 2].map((i) => (
                        <div key={i} className="space-y-3 relative">
                          {/* Circle Day Marker */}
                          <div className="absolute top-0.5 -left-10 w-6 h-6 rounded-full bg-slate-800 border-2 border-slate-700 animate-pulse flex items-center justify-center text-[8px] font-mono font-bold text-slate-500">
                            D{i}
                          </div>

                          <div className="bg-brand-bg/25 p-4 rounded-2xl border border-brand-teal/5 space-y-4 animate-pulse">
                            <div className="h-4 bg-slate-800 rounded w-1/2" />
                            
                            {/* Three columns morning/afternoon/evening skeleton */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              {[1, 2, 3].map((j) => (
                                <div key={j} className="p-2.5 bg-brand-dark/20 rounded-xl border border-brand-teal/5 space-y-2">
                                  <div className="h-2.5 bg-slate-800 rounded w-1/3" />
                                  <div className="space-y-1">
                                    <div className="h-2 bg-slate-800 rounded w-full" />
                                    <div className="h-2 bg-slate-800 rounded w-5/6" />
                                    <div className="h-2 bg-slate-800 rounded w-4/6" />
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Food footer and Green Impact bar skeleton */}
                            <div className="h-8 bg-brand-dark/40 rounded-xl border border-brand-teal/5" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Right side: Topographical Scanning Radar Map (lg:col-span-5) */}
                <div className="lg:col-span-5 xl:col-span-4 bg-brand-dark p-6 rounded-3xl border border-brand-teal/20 min-h-[450px] relative overflow-hidden flex flex-col justify-between">
                  {/* Glowing Radar Mesh Grid background */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(18,34,35,0.8)_1px,transparent_1px),linear-gradient(90deg,rgba(18,34,35,0.8)_1px,transparent_1px)] bg-[size:24px_24px] opacity-25" />
                  
                  {/* Concentric expanding scanning rings */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full border border-brand-teal/10 animate-ping opacity-30" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-brand-rose/5 animate-pulse" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full border border-brand-teal/15" />

                  {/* Swiveling sweep line */}
                  <div className="absolute top-1/2 left-1/2 w-1/2 h-0.5 bg-gradient-to-r from-brand-teal/40 to-transparent origin-left rotate-45 animate-[spin_4s_linear_infinite]" />

                  {/* Map Header */}
                  <div className="relative space-y-1">
                    <span className="text-[8.5px] font-mono font-extrabold text-brand-rose uppercase tracking-widest block">
                      Spatial Radar Mapping
                    </span>
                    <h5 className="text-xs font-black font-display text-white uppercase tracking-wider">
                      Calibrating Geographic Nodes
                    </h5>
                  </div>

                  {/* Pulsing Landmark coordinates */}
                  <div className="relative flex flex-col items-center justify-center my-12 py-10 space-y-4">
                    <div className="absolute top-1/4 left-1/3 w-2 h-2 rounded-full bg-brand-teal animate-pulse" />
                    <div className="absolute bottom-1/3 right-1/4 w-2 h-2 rounded-full bg-brand-rose animate-pulse" />
                    <div className="absolute top-2/3 left-1/2 w-1.5 h-1.5 rounded-full bg-brand-teal/80 animate-ping" />
                    
                    <div className="p-3.5 bg-brand-bg/80 backdrop-blur rounded-2xl border border-brand-teal/20 text-center max-w-[200px] shadow-lg animate-bounce">
                      <MapPin className="h-5 w-5 text-brand-rose mx-auto mb-1 animate-pulse" />
                      <span className="text-[10px] font-mono font-black text-slate-300 uppercase tracking-wider block">
                        Plotting Terrain
                      </span>
                    </div>
                  </div>

                  {/* Map Footer */}
                  <div className="relative pt-4 border-t border-brand-teal/10 text-[9px] font-mono text-slate-500 uppercase tracking-widest flex items-center justify-between">
                    <span>Grid: 24-B / Swadeshi</span>
                    <span className="animate-pulse text-brand-teal font-extrabold">Locking Coordinates...</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. INITIAL IDLE / INTRO EXPLAINER STATE */}
          {!loading && !result && !error && (
            <div className="bg-brand-dark/40 p-12 rounded-[32px] border border-brand-teal/10 shadow-md text-center flex flex-col items-center justify-center min-h-[500px] text-slate-300">
              <div className="w-16 h-16 rounded-2xl bg-brand-teal/10 flex items-center justify-center mb-6 border border-brand-teal/20 text-brand-teal">
                <Compass className="h-8 w-8" />
              </div>
              
              <h4 className="text-xl font-bold text-white font-display">Awaiting Custom Architectural Directives</h4>
              <p className="text-xs text-slate-400 mt-2 max-w-md mx-auto leading-relaxed">
                Provide travel specifications or pick a preset heritage corridor to query municipal rates, artisan cooperatives, and a custom budget-locked day-by-day itinerary.
              </p>

              {/* Little tip row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mt-10 text-left border-t border-brand-teal/10 pt-8">
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold uppercase font-mono text-brand-rose">01. Dynamic Cost Sync</span>
                  <p className="text-[10px] text-slate-400 leading-normal">Our model matches stays, local guides, and food prices to stay securely under your cap.</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold uppercase font-mono text-brand-rose">02. Artisan Network</span>
                  <p className="text-[10px] text-slate-400 leading-normal">Connects travelers straight with registered master weavers, potters, and fiber cooperatives.</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold uppercase font-mono text-brand-rose">03. Custom Day Steps</span>
                  <p className="text-[10px] text-slate-400 leading-normal">Delivers structured morning, afternoon, and evening timelines with local food spots.</p>
                </div>
              </div>
            </div>
          )}

          {/* 3. ERROR FALLBACK STATE */}
          {error && (
            <div className="bg-brand-dark p-8 rounded-[32px] border border-brand-rose/20 shadow-md text-center flex flex-col items-center justify-center text-slate-300">
              <AlertCircle className="h-10 w-10 text-brand-rose mb-4" />
              <h4 className="text-base font-bold text-white">Simulation Engine Issue</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">{error}</p>
              <button
                onClick={handleGenerate}
                className="mt-4 px-4 py-2 bg-brand-bg hover:bg-brand-bg/85 border border-brand-teal/15 rounded-xl text-xs font-bold uppercase text-white cursor-pointer"
              >
                Retry Calibrations
              </button>
            </div>
          )}

          {/* 4. ACTUAL RESULTS PRESENTATION */}
          {result && result.length > 0 && (
            <div className="space-y-6">
              {/* Site Selection Grid */}
              <div className="bg-brand-dark p-5 rounded-[32px] border border-brand-teal/20 space-y-4 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-brand-teal/10 pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4.5 w-4.5 text-brand-rose" />
                    <h4 className="text-sm font-black font-display text-white uppercase tracking-wider">
                      Generated Heritage Corridors ({result.length})
                    </h4>
                  </div>
                  <span className="text-[9.5px] text-slate-400 font-mono font-bold">
                    Select a corridor below to inspect and activate your trip plan.
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.map((item, idx) => {
                    const isSelected = selectedOptionIndex === idx;
                    const isChosen = chosenOptionIndex === idx;
                    return (
                      <div
                        key={idx}
                        onClick={() => setSelectedOptionIndex(idx)}
                        className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between gap-3 group ${
                          isSelected
                            ? "bg-brand-bg border-brand-rose shadow-lg shadow-brand-rose/10"
                            : "bg-brand-bg/40 border-brand-teal/15 hover:border-brand-teal/45 hover:bg-brand-bg/60"
                        }`}
                      >
                        {/* Status badges inside option card */}
                        <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5">
                          {isChosen && (
                            <span className="bg-brand-teal text-brand-deep font-black text-[8px] uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                              <CheckCircle className="h-2.5 w-2.5 text-brand-deep fill-brand-deep" /> Chosen
                            </span>
                          )}
                          {isSelected && (
                            <span className="bg-brand-rose/15 text-brand-rose border border-brand-rose/30 font-bold text-[8px] uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm flex items-center gap-0.5">
                              <Sparkles className="h-2.5 w-2.5" /> Inspecting
                            </span>
                          )}
                        </div>

                        <div className="space-y-1 pr-20">
                          <span className="text-[9px] font-mono font-bold text-brand-teal uppercase tracking-wider block">
                            {item.state}
                          </span>
                          <h5 className="text-sm font-black font-display text-white leading-tight group-hover:text-brand-rose transition-colors">
                            {item.destinationName}
                          </h5>
                          <p className="text-[10.5px] text-slate-300 italic font-medium leading-snug line-clamp-2 mt-1">
                            {item.tagline}
                          </p>
                        </div>

                        <div className="flex justify-between items-center pt-2.5 border-t border-brand-teal/10 mt-1">
                          <span className="text-[11px] font-mono font-bold text-slate-300">
                            Est: <span className="text-brand-rose font-black text-xs">₹{item.estimatedCost.toLocaleString('en-IN')}</span>
                          </span>
                          <div className="flex gap-1.5" onClick={(e) => e.stopPropagation()}>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedOptionIndex(idx);
                              }}
                              className={`px-3 py-1 text-[9px] font-black uppercase rounded-lg transition-all cursor-pointer ${
                                isSelected
                                  ? "bg-brand-rose text-brand-deep font-black"
                                  : "bg-brand-dark/50 text-slate-400 hover:text-white border border-brand-teal/10"
                              }`}
                            >
                              {isSelected ? "🔍 Details Shown" : "View Details"}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedOptionIndex(idx);
                                setChosenOptionIndex(idx);
                                const name = item.destinationName.toLowerCase();
                                if (name.includes("varanasi")) {
                                  onCitySelected("varanasi");
                                } else if (name.includes("jaipur")) {
                                  onCitySelected("jaipur");
                                } else if (name.includes("kochi") || name.includes("kerala")) {
                                  onCitySelected("kochi");
                                } else if (name.includes("hampi")) {
                                  onCitySelected("hampi");
                                } else {
                                  const rawCity = item.destinationName.split(',')[0].trim().toLowerCase().replace(/[^a-z0-9]/g, '');
                                  onCitySelected(rawCity);
                                }
                              }}
                              className={`px-3 py-1 text-[9px] font-black uppercase rounded-lg transition-all cursor-pointer ${
                                isChosen
                                  ? "bg-brand-teal text-brand-deep shadow-md"
                                  : "bg-brand-bg text-brand-teal border border-brand-teal/30 hover:bg-brand-rose hover:text-brand-deep hover:border-brand-rose"
                              }`}
                            >
                              {isChosen ? "✓ Chosen" : "Choose Site"}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Detailed presentation of selected option */}
              {(() => {
                const sug = result[selectedOptionIndex] || result[0];
                const isChosen = chosenOptionIndex === selectedOptionIndex;
                return (
                  <div 
                    className="bg-brand-dark p-6 rounded-[32px] border border-brand-teal/25 shadow-xl text-white space-y-6 animate-fade-in"
                    id={`suggestion-card-${selectedOptionIndex}`}
                  >
                    {/* Destination name banner header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-brand-teal/15 pb-6 gap-4">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2.5 py-0.5 bg-brand-teal/10 text-brand-teal border border-brand-teal/25 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider">
                            {sug.state}
                          </span>
                          <span className="text-[10px] text-slate-400 font-bold font-mono">
                            Suitability: <span className="text-brand-teal font-extrabold">{sug.suitabilityScore}%</span>
                          </span>
                          {isChosen ? (
                            <span className="px-2.5 py-1 bg-brand-teal/10 text-brand-teal border border-brand-teal/30 font-black font-mono text-[9px] uppercase tracking-wider rounded-full shadow-sm flex items-center gap-1.5 animate-pulse">
                              <CheckCircle className="h-3 w-3 text-brand-teal fill-brand-teal/20" /> Active Chosen Destination
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                setChosenOptionIndex(selectedOptionIndex);
                                const name = sug.destinationName.toLowerCase();
                                if (name.includes("varanasi")) {
                                  onCitySelected("varanasi");
                                } else if (name.includes("jaipur")) {
                                  onCitySelected("jaipur");
                                } else if (name.includes("kochi") || name.includes("kerala")) {
                                  onCitySelected("kochi");
                                } else if (name.includes("hampi")) {
                                  onCitySelected("hampi");
                                } else {
                                  const rawCity = sug.destinationName.split(',')[0].trim().toLowerCase().replace(/[^a-z0-9]/g, '');
                                  onCitySelected(rawCity);
                                }
                              }}
                              className="px-3 py-1 bg-brand-rose hover:bg-brand-rose/90 text-brand-deep font-black font-mono text-[9px] uppercase tracking-wider rounded-full shadow-md transition-all cursor-pointer hover:scale-105 active:scale-95 flex items-center gap-1"
                            >
                              🎯 Choose as Active Destination & Plan
                            </button>
                          )}
                        </div>

                        <h3 className="text-2xl md:text-3xl font-black font-display tracking-tight leading-none text-white">
                          {sug.destinationName}
                        </h3>
                        <p className="text-xs text-slate-400 italic font-medium">{sug.tagline}</p>
                      </div>

                      {/* Pricing badge */}
                      <div className="bg-brand-bg p-3.5 rounded-2xl border border-brand-teal/15 text-right flex flex-col justify-center min-w-[150px]">
                        <span className="text-[8.5px] font-mono font-extrabold uppercase tracking-wider text-slate-400 block mb-0.5">Estimated Total Expense</span>
                        <span className="text-xl font-mono font-black text-brand-rose">
                          ₹{sug.estimatedCost.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[8.5px] text-slate-500 font-bold">Includes lodging & transit</span>
                      </div>
                    </div>

                    {/* KEY HIGHLIGHTS BULLETS BAR */}
                    <div className="flex flex-wrap items-center gap-2.5 bg-brand-bg/50 p-3 rounded-2xl border border-brand-teal/10">
                      <span className="text-[9.5px] font-mono font-extrabold text-slate-400 uppercase tracking-widest mr-1 flex items-center gap-1 shrink-0">
                        <Sparkles className="h-3.5 w-3.5 text-brand-rose" />
                        Trip Spotlights:
                      </span>
                      {sug.keyHighlights.map((high, idx) => (
                        <span 
                          key={idx}
                          className="px-2.5 py-1 bg-brand-dark/80 text-[10.5px] font-semibold text-slate-200 border border-brand-teal/10 rounded-xl"
                        >
                          {high}
                        </span>
                      ))}
                    </div>

                    {/* Swadeshi Green Impact Tracker Progress Bar */}
                    {(() => {
                      const stayCost = sug.expenseBreakdown.stay || 0;
                      const transportCost = sug.expenseBreakdown.transport || 0;
                      const foodCost = sug.expenseBreakdown.food || 0;
                      const activitiesCost = sug.expenseBreakdown.activities || 0;

                      // Dynamic direct local infusion calculations based on Swadeshi policies
                      const localArtisanInfusion = Math.round(activitiesCost * 0.95 + stayCost * 0.1); 
                      const ecoTransitInfusion = Math.round(transportCost * 0.90);
                      const communityLodgingInfusion = Math.round(stayCost * 0.85);
                      const nativeCulinaryInfusion = Math.round(foodCost * 0.92);

                      const totalDirectInfusion = localArtisanInfusion + ecoTransitInfusion + communityLodgingInfusion + nativeCulinaryInfusion;
                      const greenImpactPercentage = Math.min(96, Math.max(74, Math.round((totalDirectInfusion / sug.estimatedCost) * 100)));

                      return (
                        <div className="bg-brand-bg/60 p-4.5 rounded-2xl border border-brand-teal/20 space-y-3 shadow-md">
                          <div className="flex justify-between items-center flex-wrap gap-2">
                            <div className="flex items-center gap-2">
                              <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                <Leaf className="h-4.5 w-4.5 animate-pulse" />
                              </span>
                              <div>
                                <span className="text-[10px] font-mono font-extrabold text-brand-teal uppercase tracking-widest block leading-tight">Swadeshi Audit Verified</span>
                                <h4 className="text-xs font-black text-white uppercase tracking-wider">
                                  Green Capital Local Impact
                                </h4>
                              </div>
                            </div>
                            <div className="flex items-baseline gap-1 bg-brand-dark px-3 py-1.5 rounded-xl border border-brand-teal/15">
                              <span className="text-sm font-mono font-black text-emerald-400">{greenImpactPercentage}%</span>
                              <span className="text-[8.5px] font-mono text-slate-400 uppercase tracking-wider">Supports Locals</span>
                            </div>
                          </div>

                          {/* Pulsing Vibrant Progress Bar */}
                          <div className="space-y-1.5">
                            <div className="w-full bg-brand-dark/80 h-3 rounded-full overflow-hidden p-0.5 border border-brand-teal/10 relative">
                              <div 
                                className="bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 h-full rounded-full transition-all duration-1000 relative shadow-sm"
                                style={{ width: `${greenImpactPercentage}%` }}
                              >
                                <div className="absolute right-0 top-0 w-2 h-full bg-white/40 rounded-full animate-pulse" />
                              </div>
                            </div>
                            <div className="flex justify-between text-[9px] font-mono text-slate-400 leading-normal font-semibold">
                              <span>Zero Brokerage Leakage: <strong className="text-white">{(100 - greenImpactPercentage)}% Max</strong></span>
                              <span>Direct Infusion: <span className="text-emerald-400 font-black">₹{totalDirectInfusion.toLocaleString('en-IN')}</span></span>
                            </div>
                          </div>

                          {/* Quick impact distribution labels */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 pt-1 text-[9.5px]">
                            <div className="px-2.5 py-1.5 bg-brand-dark/30 rounded-xl border border-brand-teal/5 flex items-center justify-between">
                              <span className="text-slate-400 font-bold">Lodging Co-ops:</span>
                              <span className="text-white font-black font-mono">₹{communityLodgingInfusion.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="px-2.5 py-1.5 bg-brand-dark/30 rounded-xl border border-brand-teal/5 flex items-center justify-between">
                              <span className="text-slate-400 font-bold">Weavers/Artisans:</span>
                              <span className="text-white font-black font-mono">₹{localArtisanInfusion.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="px-2.5 py-1.5 bg-brand-dark/30 rounded-xl border border-brand-teal/5 flex items-center justify-between">
                              <span className="text-slate-400 font-bold">Local Food Co:</span>
                              <span className="text-white font-black font-mono">₹{nativeCulinaryInfusion.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="px-2.5 py-1.5 bg-brand-dark/30 rounded-xl border border-brand-teal/5 flex items-center justify-between">
                              <span className="text-slate-400 font-bold">Rowers/Transit:</span>
                              <span className="text-white font-black font-mono">₹{ecoTransitInfusion.toLocaleString('en-IN')}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })()}

                    {/* CIVIC SAFETY SENTINEL SECTION */}
                    {sug.safetyScore !== undefined && (
                      <div className="bg-brand-bg/60 p-4.5 rounded-2xl border border-brand-teal/15 flex flex-col md:flex-row gap-4 items-start md:items-center">
                        <div className="flex items-center gap-3 shrink-0">
                          <div className={`p-3 rounded-xl border ${
                            sug.safetyScore >= 90 
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/25" 
                              : sug.safetyScore >= 80 
                                ? "bg-amber-500/10 text-amber-400 border-amber-500/25" 
                                : "bg-rose-500/10 text-rose-400 border-rose-500/25"
                          }`}>
                            <Shield className="h-6 w-6" />
                          </div>
                          <div>
                            <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Heritage Safety Rating</span>
                            <div className="flex items-baseline gap-1.5">
                              <span className="text-2xl font-mono font-black text-white">{sug.safetyScore}</span>
                              <span className="text-xs text-slate-500 font-bold">/ 100</span>
                              <span className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full ml-2 ${
                                sug.safetyScore >= 90 
                                  ? "bg-emerald-500/15 text-emerald-400" 
                                  : sug.safetyScore >= 80 
                                    ? "bg-amber-500/15 text-amber-400" 
                                    : "bg-rose-500/15 text-rose-400"
                              }`}>
                                {sug.safetyScore >= 90 ? "Excellent Safety" : sug.safetyScore >= 80 ? "Moderate Safety" : "Caution Urged"}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="border-t md:border-t-0 md:border-l border-brand-teal/10 pt-3 md:pt-0 md:pl-4.5 flex-1">
                          <span className="text-[8.5px] font-mono font-extrabold text-slate-400 uppercase tracking-widest block mb-1">Incident Report Logs & Precautionary Insights</span>
                          <p className="text-xs text-slate-300 leading-relaxed font-semibold">
                            {sug.safetyDetails || "No severe historic incidents recorded. Municipal safety patrols active."}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* DYNAMIC CITY ASPECT REDIRECT ACTIONS */}
                    {(() => {
                      const matchedCityId = sug.destinationName.toLowerCase().includes("varanasi") 
                        ? "varanasi" 
                        : sug.destinationName.toLowerCase().includes("jaipur") 
                          ? "jaipur" 
                          : sug.destinationName.toLowerCase().includes("kochi") || sug.destinationName.toLowerCase().includes("kerala") 
                            ? "kochi" 
                            : sug.destinationName.toLowerCase().includes("hampi") 
                              ? "hampi" 
                              : sug.destinationName.split(',')[0].trim().toLowerCase().replace(/[^a-z0-9]/g, '');
                      
                      if (!matchedCityId) return null;

                      return (
                        <div className="bg-brand-teal/10 p-5 rounded-2xl border border-brand-teal/30 space-y-3 animate-fade-in">
                          <div className="flex items-center gap-2">
                            <Sparkles className="h-4.5 w-4.5 text-brand-teal" />
                            <span className="text-xs font-mono font-black text-brand-teal uppercase tracking-wider">
                              Active Swadeshi City Hub Unlocked: {sug.destinationName.split(',')[0]}
                            </span>
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed font-semibold">
                            Your trip selection has activated the <strong>{sug.destinationName.split(',')[0]} Decision Matrix</strong>. You can now direct and test civic policies, evaluate artisan cooperatives, or check real-time telemetry overlays. Select an aspect to redirect instantly:
                          </p>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1.5">
                            <button
                              onClick={() => {
                                onCitySelected(matchedCityId);
                                setActiveTab('simulator');
                              }}
                              className="py-2.5 px-3 bg-brand-rose text-brand-deep font-extrabold text-[10px] rounded-xl hover:bg-brand-rose/95 transition-all cursor-pointer text-center uppercase tracking-wide shadow-sm"
                            >
                              🎛️ Scenario Simulator
                            </button>
                            <button
                              onClick={() => {
                                onCitySelected(matchedCityId);
                                setActiveTab('compare');
                              }}
                              className="py-2.5 px-3 bg-brand-bg hover:bg-brand-bg/85 border border-brand-teal/20 text-brand-teal font-extrabold text-[10px] rounded-xl transition-all cursor-pointer text-center uppercase tracking-wide"
                            >
                              📊 Compare Policies
                            </button>
                            <button
                              onClick={() => {
                                onCitySelected(matchedCityId);
                                setActiveTab('hub');
                              }}
                              className="py-2.5 px-3 bg-brand-bg hover:bg-brand-bg/85 border border-brand-teal/20 text-brand-teal font-extrabold text-[10px] rounded-xl transition-all cursor-pointer text-center uppercase tracking-wide"
                            >
                              🤝 MicroPreneur Hub
                            </button>
                            <button
                              onClick={() => {
                                onCitySelected(matchedCityId);
                                setActiveTab('navigator');
                              }}
                              className="py-2.5 px-3 bg-brand-bg hover:bg-brand-bg/85 border border-brand-teal/20 text-brand-teal font-extrabold text-[10px] rounded-xl transition-all cursor-pointer text-center uppercase tracking-wide"
                            >
                              📍 Radar Navigation
                            </button>
                          </div>
                        </div>
                      );
                    })()}

                    {/* SUITE OF DETAIL TABS */}
                    <div className="border-b border-brand-teal/10 flex gap-4 text-xs font-bold uppercase tracking-wider">
                      <button
                        onClick={() => setActiveResultTab('itinerary')}
                        className={`pb-3 border-b-2 transition-all cursor-pointer ${
                          activeResultTab === 'itinerary' 
                            ? "border-brand-rose text-brand-rose font-black" 
                            : "border-transparent text-slate-400 hover:text-white"
                        }`}
                      >
                        Day-By-Day Itinerary
                      </button>
                      <button
                        onClick={() => setActiveResultTab('crafts')}
                        className={`pb-3 border-b-2 transition-all cursor-pointer ${
                          activeResultTab === 'crafts' 
                            ? "border-brand-rose text-brand-rose font-black" 
                            : "border-transparent text-slate-400 hover:text-white"
                        }`}
                      >
                        Local Artisans & Crafts
                      </button>
                      <button
                        onClick={() => setActiveResultTab('breakdown')}
                        className={`pb-3 border-b-2 transition-all cursor-pointer ${
                          activeResultTab === 'breakdown' 
                            ? "border-brand-rose text-brand-rose font-black" 
                            : "border-transparent text-slate-400 hover:text-white"
                        }`}
                      >
                        Budget Breakdown
                      </button>
                    </div>

                    {/* TAB CONTENT MODULES */}
                    <div>
                      
                      {/* TAB: DAY BY DAY ITINERARY (VERTICAL TIMELINE - SPLIT SCREEN DESKTOP LAYOUT) */}
                      {activeResultTab === 'itinerary' && (() => {
                        // 1. Defined local landmarks database for high-fidelity maps
                        const cityLandmarks: Record<string, { name: string; x: number; y: number; desc: string; type: 'artisan' | 'sight' | 'eatery' }[]> = {
                          varanasi: [
                            { name: "Dashashwamedh Ghat", x: 45, y: 65, desc: "Fabled evening Ganga Aarti & boat rower cooperative", type: 'sight' },
                            { name: "Kashi Vishwanath Corridor", x: 40, y: 50, desc: "Ancient spiritual heart & handloom silk district", type: 'sight' },
                            { name: "Madanpura Weavers Co-op", x: 65, y: 40, desc: "Zero-markup master weaver handloom studios", type: 'artisan' },
                            { name: "Assi Clay Pottery Guild", x: 50, y: 85, desc: "Traditional terracotta throwing workshop & chai stalls", type: 'artisan' },
                            { name: "Sarnath Deer Park Corridor", x: 30, y: 20, desc: "Peaceful Buddhist stupas & stone carving ateliers", type: 'sight' }
                          ],
                          jaipur: [
                            { name: "Hawa Mahal (Palace of Winds)", x: 50, y: 45, desc: "Stunning display architecture & block print guilds", type: 'sight' },
                            { name: "Amber Fort & Shila Devi", x: 40, y: 22, desc: "Glorious hilltop palace and low-emission shared rides", type: 'sight' },
                            { name: "Johari Bazaar Gem & Textile Guild", x: 62, y: 55, desc: "Vibrant ancient merchant lanes, bandhani textiles", type: 'artisan' },
                            { name: "Sanganer Blue Pottery Atelier", x: 60, y: 82, desc: "Eco-friendly natural clay artisan throwing kilns", type: 'artisan' },
                            { name: "Laxmi Misthan Bhandar", x: 48, y: 65, desc: "Legendary local culinary heritage of sweet ghewar", type: 'eatery' }
                          ],
                          kochi: [
                            { name: "Fort Kochi Fishing Nets", x: 35, y: 25, desc: "Iconic Chinese cantilever net fisherman co-op", type: 'sight' },
                            { name: "Jew Town & Mattancherry Palace", x: 52, y: 50, desc: "Spice trading houses & wood carving workshops", type: 'artisan' },
                            { name: "Kumbalangi Eco-tourism Village", x: 65, y: 80, desc: "Crab farming, coir weaving, and organic lunch", type: 'artisan' },
                            { name: "Vypeen Coir & Fiber Weavers", x: 28, y: 15, desc: "Local women-led coconut husk weaving looms", type: 'artisan' },
                            { name: "Fort Kochi Seafood Stalls", x: 32, y: 32, desc: "Fresh catch direct buy & local pan-fry grills", type: 'eatery' }
                          ],
                          hampi: [
                            { name: "Virupaksha Temple Compound", x: 45, y: 45, desc: "Towering ancient active sanctuary on the Tungabhadra", type: 'sight' },
                            { name: "Vittala Temple Stone Chariot", x: 68, y: 40, desc: "Architectural acoustic pillars and chariot carving", type: 'sight' },
                            { name: "Anegundi Handloom & Crafts", x: 72, y: 18, desc: "Banana fiber crafts & handloom weaving cooperatives", type: 'artisan' },
                            { name: "Lotus Mahal & Royal Stables", x: 40, y: 72, desc: "Beautiful indo-islamic arches & royal water basins", type: 'sight' },
                            { name: "Sanapur Lake Coracle Station", x: 32, y: 22, desc: "Traditional circular coracle rowers association", type: 'sight' }
                          ]
                        };

                        // 2. Procedural landmark generator for dynamic destinations
                        const getDynamicLandmarks = (itinerary: typeof sug.itinerary) => {
                          const list: { name: string; x: number; y: number; desc: string; type: 'artisan' | 'sight' | 'eatery' }[] = [];
                          const coordinates = [
                            { x: 35, y: 30 },
                            { x: 65, y: 45 },
                            { x: 45, y: 75 },
                            { x: 55, y: 20 },
                            { x: 72, y: 70 }
                          ];
                          itinerary.forEach((day, i) => {
                            const coord = coordinates[i % coordinates.length];
                            let name = day.title ? day.title.split(":")[0] : `Day ${day.day} Landmark`;
                            if (name.length > 28) name = name.substring(0, 25) + "...";
                            let type: 'artisan' | 'sight' | 'eatery' = 'sight';
                            const low = (day.morning + " " + day.afternoon + " " + day.evening).toLowerCase();
                            if (low.includes("weaver") || low.includes("artisan") || low.includes("potter") || low.includes("shop")) {
                              type = 'artisan';
                            } else if (low.includes("food") || low.includes("eatery") || low.includes("cafe") || low.includes("lunch")) {
                              type = 'eatery';
                            }
                            list.push({
                              name,
                              x: coord.x,
                              y: coord.y,
                              desc: `Heritage nodes matching your custom Day ${day.day} corridor`,
                              type
                            });
                          });
                          return list;
                        };

                        // 3. Dynamic category tag generation based on activity analysis
                        const getCategoryTags = (text: string, title?: string, recommendedFood?: string) => {
                          const tags: { label: string; style: string }[] = [];
                          const low = (text + " " + (title || "") + " " + (recommendedFood || "")).toLowerCase();
                          
                          if (low.includes("weaver") || low.includes("artisan") || low.includes("potter") || low.includes("craft") || low.includes("handloom") || low.includes("shopping") || low.includes("workshop") || low.includes("cooperative") || low.includes("saree") || low.includes("textile")) {
                            tags.push({ label: "Verified Local Artisan", style: "border-emerald-500/30 text-emerald-400 bg-emerald-500/5 hover:bg-emerald-500/10" });
                          }
                          if (low.includes("food") || low.includes("culinary") || low.includes("bite") || low.includes("cuisine") || low.includes("eatery") || low.includes("restaurant") || low.includes("café") || low.includes("chai") || low.includes("tea") || low.includes("snack") || low.includes("kulfi") || low.includes("chaat") || low.includes("lassi") || low.includes("bite")) {
                            tags.push({ label: "Budget Eatery", style: "border-amber-500/30 text-amber-400 bg-amber-500/5 hover:bg-amber-500/10" });
                          }
                          if (low.includes("ferry") || low.includes("boat") || low.includes("rickshaw") || low.includes("walk") || low.includes("bicycle") || low.includes("coracle") || low.includes("shuttle")) {
                            tags.push({ label: "Low-Emission Transit", style: "border-brand-teal/30 text-brand-teal bg-brand-teal/5" });
                          }
                          if (low.includes("temple") || low.includes("palace") || low.includes("fort") || low.includes("monument") || low.includes("heritage") || low.includes("ghat")) {
                            tags.push({ label: "Cultural Heritage", style: "border-purple-500/30 text-purple-400 bg-purple-500/5 hover:bg-purple-500/10" });
                          }
                          
                          if (tags.length === 0) {
                            tags.push({ label: "Eco-Friendly Route", style: "border-brand-teal/30 text-brand-teal bg-brand-teal/5" });
                          }
                          if (tags.length < 2) {
                            tags.push({ label: "Community Owned", style: "border-blue-500/30 text-blue-400 bg-blue-500/5" });
                          }
                          return tags;
                        };

                        const matchedCityKey = sug.destinationName.toLowerCase().includes("varanasi") 
                          ? "varanasi" 
                          : sug.destinationName.toLowerCase().includes("jaipur") 
                            ? "jaipur" 
                            : sug.destinationName.toLowerCase().includes("kochi") || sug.destinationName.toLowerCase().includes("kerala") 
                              ? "kochi" 
                              : sug.destinationName.toLowerCase().includes("hampi") 
                                ? "hampi" 
                                : "dynamic";

                        const landmarks = matchedCityKey === "dynamic" 
                          ? getDynamicLandmarks(sug.itinerary) 
                          : (cityLandmarks[matchedCityKey] || getDynamicLandmarks(sug.itinerary));

                        return (
                          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4 items-start">
                            
                            {/* LEFT SIDE: COLLAPSIBLE DAY TIMELINE CARDS */}
                            <div className="lg:col-span-7 xl:col-span-8 space-y-5">
                              <div className="flex items-center justify-between border-b border-brand-teal/10 pb-3">
                                <span className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest">
                                  Corridor Progression Sequence
                                </span>
                                <span className="text-[10px] font-mono font-black text-brand-rose uppercase tracking-widest animate-pulse">
                                  Click Card to Toggle View
                                </span>
                              </div>

                              <div className="space-y-5 relative before:absolute before:top-4 before:bottom-4 before:left-3.5 before:w-0.5 before:bg-brand-teal/15 pl-10">
                                {sug.itinerary.map((dayItem) => {
                                  const isExpanded = expandedDays[dayItem.day] !== false;
                                  const dayTags = getCategoryTags(dayItem.morning + " " + dayItem.afternoon + " " + dayItem.evening, dayItem.title, dayItem.recommendedFood);

                                  return (
                                    <div key={dayItem.day} className="relative space-y-2">
                                      
                                      {/* Vertical timeline bubble */}
                                      <div 
                                        className={`absolute top-0.5 -left-10 w-7 h-7 rounded-full flex items-center justify-center font-mono font-black border-2 transition-all ${
                                          isExpanded 
                                            ? "bg-brand-dark border-brand-rose text-brand-rose scale-110 shadow-lg" 
                                            : "bg-brand-bg border-slate-600 text-slate-400"
                                        }`}
                                      >
                                        D{dayItem.day}
                                      </div>

                                      {/* Collapsible Card Main Container */}
                                      <div className="bg-brand-bg/40 border border-brand-teal/10 rounded-2xl overflow-hidden transition-all duration-300 hover:border-brand-teal/25 shadow-md">
                                        
                                        {/* Header Row */}
                                        <button
                                          onClick={() => {
                                            setExpandedDays(prev => ({
                                              ...prev,
                                              [dayItem.day]: !isExpanded
                                            }));
                                          }}
                                          className="w-full text-left p-4 flex items-center justify-between gap-4 bg-brand-bg/20 hover:bg-brand-bg/40 transition-colors cursor-pointer"
                                        >
                                          <div className="flex-1 min-w-0">
                                            <span className="text-[9px] font-mono font-black text-brand-teal uppercase tracking-widest block mb-0.5">
                                              Day {dayItem.day} Itinerary Corridor
                                            </span>
                                            <h4 className="text-sm font-black font-display text-white uppercase tracking-tight leading-tight truncate">
                                              {dayItem.title}
                                            </h4>
                                          </div>
                                          <div className="flex items-center gap-3 shrink-0">
                                            <div className="hidden sm:flex flex-wrap gap-1.5 justify-end">
                                              {dayTags.slice(0, 2).map((tag, tIdx) => (
                                                <span key={tIdx} className={`px-2 py-0.5 text-[8px] font-mono font-bold border rounded ${tag.style.split(' ')[0]}`}>
                                                  {tag.label}
                                                </span>
                                              ))}
                                            </div>
                                            {isExpanded ? (
                                              <ChevronUp className="h-4.5 w-4.5 text-brand-rose" />
                                            ) : (
                                              <ChevronDown className="h-4.5 w-4.5 text-slate-400" />
                                            )}
                                          </div>
                                        </button>

                                        {/* Collapsed view micro summary row */}
                                        {!isExpanded && (
                                          <div className="px-4 pb-4 pt-1 flex items-center justify-between gap-4">
                                            <p className="text-[10.5px] text-slate-400 leading-normal font-semibold italic truncate max-w-lg">
                                              Morning: {dayItem.morning.substring(0, 70)}...
                                            </p>
                                            <span className="text-[9px] text-brand-teal font-mono font-bold shrink-0">
                                              + {dayItem.recommendedFood ? "Local Bite" : "Details"}
                                            </span>
                                          </div>
                                        )}

                                        {/* Expanded Detailed Content Panel */}
                                        {isExpanded && (
                                          <div className="p-4 pt-2 space-y-4 border-t border-brand-teal/5 animate-fade-in">
                                            
                                            {/* Category badges for the entire day */}
                                            <div className="flex flex-wrap gap-2 pb-1">
                                              {dayTags.map((tag, tIdx) => (
                                                <span 
                                                  key={tIdx} 
                                                  className={`px-2.5 py-1 text-[9.5px] font-bold border rounded-full transition-colors flex items-center gap-1 ${tag.style}`}
                                                >
                                                  <span className="w-1 h-1 rounded-full bg-current" />
                                                  {tag.label}
                                                </span>
                                              ))}
                                            </div>

                                            {/* 3 columns morning/afternoon/evening display */}
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-1">
                                              <div 
                                                onMouseEnter={() => setHoveredLandmark(dayItem.morning)}
                                                onMouseLeave={() => setHoveredLandmark(null)}
                                                className="space-y-1 bg-brand-dark/30 hover:bg-brand-dark/50 p-3 rounded-xl border border-brand-teal/5 transition-all group"
                                              >
                                                <span className="text-[8.5px] font-mono font-black uppercase tracking-widest text-brand-rose flex items-center gap-1.5">
                                                  <Sun className="h-3.5 w-3.5 text-brand-rose group-hover:rotate-45 transition-transform" />
                                                  Morning Hub
                                                </span>
                                                <p className="text-[11px] text-slate-200 leading-normal font-semibold">{dayItem.morning}</p>
                                              </div>

                                              <div 
                                                onMouseEnter={() => setHoveredLandmark(dayItem.afternoon)}
                                                onMouseLeave={() => setHoveredLandmark(null)}
                                                className="space-y-1 bg-brand-dark/30 hover:bg-brand-dark/50 p-3 rounded-xl border border-brand-teal/5 transition-all group"
                                              >
                                                <span className="text-[8.5px] font-mono font-black uppercase tracking-widest text-brand-rose flex items-center gap-1.5">
                                                  <Sun className="h-3.5 w-3.5 text-amber-500 rotate-90" />
                                                  Afternoon Tour
                                                </span>
                                                <p className="text-[11px] text-slate-200 leading-normal font-semibold">{dayItem.afternoon}</p>
                                              </div>

                                              <div 
                                                onMouseEnter={() => setHoveredLandmark(dayItem.evening)}
                                                onMouseLeave={() => setHoveredLandmark(null)}
                                                className="space-y-1 bg-brand-dark/30 hover:bg-brand-dark/50 p-3 rounded-xl border border-brand-teal/5 transition-all group"
                                              >
                                                <span className="text-[8.5px] font-mono font-black uppercase tracking-widest text-brand-rose flex items-center gap-1.5">
                                                  <Clock className="h-3.5 w-3.5 text-purple-400" />
                                                  Evening Aarti
                                                </span>
                                                <p className="text-[11px] text-slate-200 leading-normal font-semibold">{dayItem.evening}</p>
                                              </div>
                                            </div>

                                            {/* Local Culinary Bite */}
                                            {dayItem.recommendedFood && (
                                              <div className="flex items-center gap-2.5 bg-brand-dark/50 px-3.5 py-2.5 rounded-xl border border-brand-teal/5 text-xs text-slate-300 font-semibold hover:border-amber-500/20 transition-colors">
                                                <Utensils className="h-4 w-4 text-amber-400 shrink-0" />
                                                <span>
                                                  <strong className="text-brand-teal">Recommended Local Bite:</strong> {dayItem.recommendedFood}
                                                </span>
                                              </div>
                                            )}

                                            {/* Surge Pricing / Peak congestion warnings */}
                                            <div className="p-3 bg-brand-rose/10 rounded-xl border border-brand-rose/15 flex items-start gap-2.5 text-slate-300">
                                              <AlertCircle className="h-4 w-4 text-brand-rose shrink-0 mt-0.5 animate-pulse" />
                                              <div className="space-y-0.5">
                                                <span className="text-brand-rose font-black text-[9px] font-mono tracking-wider uppercase block">BigQuery ML Peak Congestion Forecast</span>
                                                <p className="text-[10px] leading-relaxed text-slate-300 font-semibold">
                                                  {sug.destinationName.toLowerCase().includes("varanasi") ? (
                                                    dayItem.day === 1 
                                                      ? "Visiting Dashashwamedh Ghat between 5 PM–8 PM might incur surged boat-ride rates; try 10 AM or early morning for 20% savings."
                                                      : "Madanpura weaver lanes peak between 2 PM–4 PM. Visit at 10 AM for quieter exploration and 15% transit savings."
                                                  ) : sug.destinationName.toLowerCase().includes("jaipur") ? (
                                                    dayItem.day === 1 
                                                      ? "Johari Bazaar & Palace route predicted peak congestion between 1 PM–3 PM. Auto rates surged +25%. Schedule at 10 AM for optimal savings."
                                                      : "Amber Palace Gateway transit peaks 12 PM–2 PM. Travel early or utilize low-emission state shared shuttles."
                                                  ) : sug.destinationName.toLowerCase().includes("kochi") ? (
                                                    "Fort Kochi ferries and spice corridors peak between 2 PM–5 PM (+20% wait times). Schedule at 9:30 AM for a smoother trip."
                                                  ) : (
                                                    "Central artisan hubs experience peak foot traffic between 2 PM–4 PM. Visit in the morning to save up to 20% on local transit."
                                                  )}
                                                </p>
                                              </div>
                                            </div>

                                          </div>
                                        )}

                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {/* RIGHT SIDE: INTERACTIVE HERITAGE SPATIAL RADAR MAP */}
                            <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-6 bg-brand-dark p-5 rounded-3xl border border-brand-teal/20 overflow-hidden relative shadow-2xl min-h-[500px] flex flex-col justify-between">
                              
                              {/* Blueprint topological grids */}
                              <div className="absolute inset-0 bg-[linear-gradient(rgba(20,184,166,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(20,184,166,0.03)_1px,transparent_1px)] bg-[size:16px_16px]" />
                              
                              {/* Decorative Concentric radar circles */}
                              <div className="absolute top-[48%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full border border-brand-teal/5" />
                              <div className="absolute top-[48%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-52 h-52 rounded-full border border-brand-teal/5 border-dashed" />
                              <div className="absolute top-[48%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full border border-brand-teal/5" />

                              {/* Map Header */}
                              <div className="relative border-b border-brand-teal/10 pb-3 flex justify-between items-center bg-brand-dark/90 backdrop-blur-xs p-1 rounded-xl">
                                <div className="space-y-0.5">
                                  <span className="text-[8.5px] font-mono font-extrabold text-brand-rose uppercase tracking-widest block">
                                    Autonomous Heritage Telemetry
                                  </span>
                                  <h5 className="text-xs font-black font-display text-white uppercase tracking-wider">
                                    Spatial Radar Map
                                  </h5>
                                </div>
                                <span className="text-[8.5px] font-mono font-black text-brand-teal bg-brand-teal/10 px-2 py-0.5 border border-brand-teal/20 rounded">
                                  Active: {matchedCityKey.toUpperCase()}
                                </span>
                              </div>

                              {/* Map Canvas / Plotting Area */}
                              <div className="relative flex-1 min-h-[280px] my-4 bg-brand-bg/25 rounded-2xl border border-brand-teal/10 overflow-hidden shadow-inner flex items-center justify-center">
                                
                                {/* Topological design flourishes (e.g. river flow or fort boundary lines for high fidelity) */}
                                {matchedCityKey === "varanasi" && (
                                  <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" viewBox="0 0 100 100">
                                    {/* Varanasi Ganga River bend curving south to north */}
                                    <path d="M 15,100 C 35,90 60,65 55,0" fill="none" stroke="#14B8A6" strokeWidth="12" strokeLinecap="round" />
                                    <path d="M 15,100 C 35,90 60,65 55,0" fill="none" stroke="#0D9488" strokeWidth="1" strokeDasharray="3,3" />
                                  </svg>
                                )}
                                {matchedCityKey === "jaipur" && (
                                  <svg className="absolute inset-0 w-full h-full opacity-15 pointer-events-none" viewBox="0 0 100 100">
                                    {/* Jaipur Octagonal walled city bounds */}
                                    <polygon points="30,20 70,20 85,50 70,80 30,80 15,50" fill="none" stroke="#E64833" strokeWidth="2" strokeDasharray="4,4" />
                                  </svg>
                                )}
                                {matchedCityKey === "kochi" && (
                                  <svg className="absolute inset-0 w-full h-full opacity-25 pointer-events-none" viewBox="0 0 100 100">
                                    {/* Kochi backwaters islands */}
                                    <circle cx="20" cy="30" r="15" fill="#1e3a8a" opacity="0.3" />
                                    <circle cx="75" cy="70" r="22" fill="#1e3a8a" opacity="0.3" />
                                    <path d="M 10,60 Q 40,40 90,80" fill="none" stroke="#14B8A6" strokeWidth="4" />
                                  </svg>
                                )}

                                {/* Connected Dotted Itinerary Route Path */}
                                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                                  {landmarks.length > 1 && (
                                    <path
                                      d={`M ${landmarks.map(l => `${l.x},${l.y}`).join(' L ')}`}
                                      fill="none"
                                      stroke="url(#map-route-gradient)"
                                      strokeWidth="1.2"
                                      strokeDasharray="4,4"
                                      className="animate-pulse"
                                    />
                                  )}
                                  <defs>
                                    <linearGradient id="map-route-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                      <stop offset="0%" stopColor="#FB923C" />
                                      <stop offset="100%" stopColor="#14B8A6" />
                                    </linearGradient>
                                  </defs>
                                </svg>

                                {/* Landmarks Coordinate Markers */}
                                {landmarks.map((landmark, lIdx) => {
                                  // Determine if this landmark is currently highlighted (via hover on timeline or hover on marker)
                                  const matchesHoverState = 
                                    hoveredLandmark?.toLowerCase().includes(landmark.name.toLowerCase().split(' ')[0]) ||
                                    selectedLandmark === landmark.name;

                                  return (
                                    <button
                                      key={lIdx}
                                      onClick={() => setSelectedLandmark(landmark.name)}
                                      onMouseEnter={() => setSelectedLandmark(landmark.name)}
                                      className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 group focus:outline-none"
                                      style={{ left: `${landmark.x}%`, top: `${landmark.y}%`, zIndex: matchesHoverState ? 40 : 20 }}
                                    >
                                      {/* Glowing aura */}
                                      <span className={`absolute -inset-3 rounded-full transition-all duration-300 opacity-60 ${
                                        matchesHoverState 
                                          ? "bg-brand-rose/25 scale-125 animate-ping" 
                                          : "bg-brand-teal/5 group-hover:bg-brand-teal/20 scale-100"
                                      }`} />

                                      {/* Outer indicator circle */}
                                      <span className={`flex items-center justify-center w-6 h-6 rounded-full border transition-all ${
                                        matchesHoverState 
                                          ? "bg-brand-rose border-brand-rose text-brand-deep scale-125 shadow-lg shadow-brand-rose/30" 
                                          : landmark.type === 'artisan'
                                            ? "bg-brand-dark border-emerald-500 text-emerald-400"
                                            : landmark.type === 'eatery'
                                              ? "bg-brand-dark border-amber-500 text-amber-500"
                                              : "bg-brand-dark border-brand-teal text-brand-teal"
                                      }`}>
                                        <MapPin className="h-3.5 w-3.5" />
                                      </span>

                                      {/* Landmark name tooltips */}
                                      <span className={`absolute top-7 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-mono font-bold px-2 py-0.5 rounded shadow-xl border transition-all ${
                                        matchesHoverState
                                          ? "bg-brand-rose border-brand-rose text-brand-deep opacity-100 translate-y-0"
                                          : "bg-brand-dark border-brand-teal/20 text-slate-300 opacity-0 group-hover:opacity-100 translate-y-1"
                                      }`}>
                                        {landmark.name}
                                      </span>
                                    </button>
                                  );
                                })}

                                {/* Dynamic Compass overlay */}
                                <div className="absolute bottom-3 right-3 opacity-30 pointer-events-none">
                                  <Compass className="h-10 w-10 text-brand-teal animate-[spin_60s_linear_infinite]" />
                                </div>
                              </div>

                              {/* Interactive Selected Node Disclosure Card */}
                              {(() => {
                                const activeLandmark = landmarks.find(l => l.name === selectedLandmark) || landmarks[0];
                                if (!activeLandmark) return null;

                                return (
                                  <div className="relative bg-brand-bg/90 border border-brand-teal/20 p-3.5 rounded-2xl shadow-xl space-y-2 animate-fade-in">
                                    <div className="flex items-center justify-between gap-2">
                                      <div className="flex items-center gap-1.5 min-w-0">
                                        <span className={`w-2 h-2 rounded-full ${
                                          activeLandmark.type === 'artisan' 
                                            ? 'bg-emerald-400' 
                                            : activeLandmark.type === 'eatery' 
                                              ? 'bg-amber-400' 
                                              : 'bg-brand-teal'
                                        }`} />
                                        <h6 className="text-[11px] font-black font-display text-white uppercase tracking-wider truncate">
                                          {activeLandmark.name}
                                        </h6>
                                      </div>
                                      <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded border leading-none uppercase ${
                                        activeLandmark.type === 'artisan' 
                                          ? 'border-emerald-500/25 bg-emerald-500/10 text-emerald-400' 
                                          : activeLandmark.type === 'eatery' 
                                            ? 'border-amber-500/25 bg-amber-500/10 text-amber-400' 
                                            : 'border-brand-teal/25 bg-brand-teal/10 text-brand-teal'
                                      }`}>
                                        {activeLandmark.type === 'artisan' ? 'Verified Artisan' : activeLandmark.type === 'eatery' ? 'Budget Eatery' : 'Cultural Sight'}
                                      </span>
                                    </div>
                                    <p className="text-[10px] text-slate-300 leading-normal font-semibold">
                                      {activeLandmark.desc}
                                    </p>
                                    <div className="flex justify-between items-center text-[8.5px] text-slate-500 font-mono border-t border-brand-teal/5 pt-1.5 uppercase tracking-wider">
                                      <span>Direct Swadeshi Support Verified</span>
                                      <span className="text-emerald-400 font-bold">100% Brokerage Free</span>
                                    </div>
                                  </div>
                                );
                              })()}

                            </div>

                          </div>
                        );
                      })()}

                      {/* TAB: LOCAL ARTISANS & CRAFTS */}
                      {activeResultTab === 'crafts' && (
                        <div className="space-y-4 pt-2">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {sug.localArtisansAndCrafts.map((art, idx) => (
                              <div 
                                key={idx}
                                className="p-4 bg-brand-bg/55 rounded-2xl border border-brand-teal/15 flex flex-col justify-between h-44"
                              >
                                <div className="space-y-2">
                                  <div className="flex items-center gap-1.5 text-xs font-mono font-black text-brand-rose">
                                    <ShoppingBag className="h-4 w-4 text-brand-rose" />
                                    <span>{art.craftName}</span>
                                  </div>
                                  <p className="text-[11px] text-slate-300 leading-relaxed font-semibold">
                                    {art.description}
                                  </p>
                                </div>

                                <div className="mt-3 pt-2 border-t border-brand-teal/5 flex items-center gap-1 text-[9px] font-mono font-bold text-brand-teal">
                                  <MapPin className="h-3 w-3 text-brand-teal" />
                                  <span>Workshop Hub: {art.location}</span>
                                </div>
                              </div>
                            ))}
                          </div>

                          <p className="text-[9.5px] text-slate-400 leading-normal italic text-center mt-3">
                            *Support these traditional workshops directly instead of purchasing from commercial tourist showrooms to escape middlemen broker markups.
                          </p>
                        </div>
                      )}

                      {/* TAB: BUDGET BREAKDOWN WIDGET */}
                      {activeResultTab === 'breakdown' && (
                        <div className="pt-2 space-y-6">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            
                            <div className="p-3.5 bg-brand-bg/40 rounded-2xl border border-brand-teal/10 space-y-1 text-center">
                              <span className="text-[8.5px] font-mono text-slate-400 uppercase tracking-wider block">Stays / Hostels</span>
                              <span className="text-base font-mono font-black text-white">₹{sug.expenseBreakdown.stay.toLocaleString('en-IN')}</span>
                              <div className="w-full bg-brand-dark h-1 rounded-full overflow-hidden mt-2">
                                <div className="bg-brand-teal h-full" style={{ width: `${(sug.expenseBreakdown.stay / sug.estimatedCost) * 100}%` }} />
                              </div>
                              <span className="text-[8px] text-slate-500 font-bold block">{Math.round((sug.expenseBreakdown.stay / sug.estimatedCost) * 100)}% of total</span>
                            </div>

                            <div className="p-3.5 bg-brand-bg/40 rounded-2xl border border-brand-teal/10 space-y-1 text-center">
                              <span className="text-[8.5px] font-mono text-slate-400 uppercase tracking-wider block">Transit / Rickshaw</span>
                              <span className="text-base font-mono font-black text-white">₹{sug.expenseBreakdown.transport.toLocaleString('en-IN')}</span>
                              <div className="w-full bg-brand-dark h-1 rounded-full overflow-hidden mt-2">
                                <div className="bg-brand-rose h-full" style={{ width: `${(sug.expenseBreakdown.transport / sug.estimatedCost) * 100}%` }} />
                              </div>
                              <span className="text-[8px] text-slate-500 font-bold block">{Math.round((sug.expenseBreakdown.transport / sug.estimatedCost) * 100)}% of total</span>
                            </div>

                            <div className="p-3.5 bg-brand-bg/40 rounded-2xl border border-brand-teal/10 space-y-1 text-center">
                              <span className="text-[8.5px] font-mono text-slate-400 uppercase tracking-wider block">Food / Culinary</span>
                              <span className="text-base font-mono font-black text-white">₹{sug.expenseBreakdown.food.toLocaleString('en-IN')}</span>
                              <div className="w-full bg-brand-dark h-1 rounded-full overflow-hidden mt-2">
                                <div className="bg-amber-500 h-full" style={{ width: `${(sug.expenseBreakdown.food / sug.estimatedCost) * 100}%` }} />
                              </div>
                              <span className="text-[8px] text-slate-500 font-bold block">{Math.round((sug.expenseBreakdown.food / sug.estimatedCost) * 100)}% of total</span>
                            </div>

                            <div className="p-3.5 bg-brand-bg/40 rounded-2xl border border-brand-teal/10 space-y-1 text-center">
                              <span className="text-[8.5px] font-mono text-slate-400 uppercase tracking-wider block">Activities / Craft Purchases</span>
                              <span className="text-base font-mono font-black text-white">₹{sug.expenseBreakdown.activities.toLocaleString('en-IN')}</span>
                              <div className="w-full bg-brand-dark h-1 rounded-full overflow-hidden mt-2">
                                <div className="bg-purple-500 h-full" style={{ width: `${(sug.expenseBreakdown.activities / sug.estimatedCost) * 100}%` }} />
                              </div>
                              <span className="text-[8px] text-slate-500 font-bold block">{Math.round((sug.expenseBreakdown.activities / sug.estimatedCost) * 100)}% of total</span>
                            </div>

                          </div>

                          {/* "Where Your Money Goes" Micro-Splitting Swadeshi Economic Impact Visualizer */}
                          <div className="p-5 bg-brand-bg/55 rounded-2xl border border-brand-teal/15 space-y-5">
                            <div className="flex justify-between items-center border-b border-brand-teal/10 pb-3">
                              <div>
                                <span className="text-[10px] font-extrabold text-brand-rose uppercase tracking-widest block font-mono">
                                  Swadeshi Economic Impact Ledger
                                </span>
                                <h4 className="text-xs font-extrabold text-white mt-0.5">"Where Your Money Goes" Micro-Splitting</h4>
                              </div>
                              <span className="px-2 py-0.5 bg-brand-teal/10 text-brand-teal border border-brand-teal/20 rounded text-[9px] font-bold font-mono">
                                ♻️ Direct Grassroots Infusion
                              </span>
                            </div>

                            {/* Stacked Percentage Impact Bar */}
                            <div className="space-y-3">
                              <div className="flex h-3 rounded-lg overflow-hidden border border-white/5 bg-brand-dark shadow-inner">
                                <div className="bg-brand-rose h-full group relative cursor-pointer" style={{ width: '40%' }} title="Artisan Cooperatives" />
                                <div className="bg-amber-500 h-full group relative cursor-pointer" style={{ width: '25%' }} title="Local Culinary" />
                                <div className="bg-brand-teal h-full group relative cursor-pointer" style={{ width: '20%' }} title="Low-Emission Transit" />
                                <div className="bg-indigo-500 h-full group relative cursor-pointer" style={{ width: '15%' }} title="Heritage site preservation" />
                              </div>
                              
                              {/* Legend labels */}
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-1.5 text-[10px] font-semibold">
                                <div className="p-2.5 bg-brand-dark/40 rounded-xl border border-brand-rose/10 flex flex-col gap-1">
                                  <div className="flex items-center gap-1.5 text-brand-rose">
                                    <span className="w-2 h-2 rounded-full bg-brand-rose" />
                                    <span className="font-extrabold uppercase text-[8px] tracking-wider">Artisans</span>
                                  </div>
                                  <span className="text-xs font-black text-white font-mono">40%</span>
                                  <span className="text-[9px] text-slate-400">₹{Math.round(sug.estimatedCost * 0.40).toLocaleString('en-IN')} direct infusion</span>
                                </div>
                                <div className="p-2.5 bg-brand-dark/40 rounded-xl border border-amber-500/10 flex flex-col gap-1">
                                  <div className="flex items-center gap-1.5 text-amber-400">
                                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                                    <span className="font-extrabold uppercase text-[8px] tracking-wider">Culinary</span>
                                  </div>
                                  <span className="text-xs font-black text-white font-mono">25%</span>
                                  <span className="text-[9px] text-slate-400">₹{Math.round(sug.estimatedCost * 0.25).toLocaleString('en-IN')} local eateries</span>
                                </div>
                                <div className="p-2.5 bg-brand-dark/40 rounded-xl border border-brand-teal/10 flex flex-col gap-1">
                                  <div className="flex items-center gap-1.5 text-brand-teal">
                                    <span className="w-2 h-2 rounded-full bg-brand-teal" />
                                    <span className="font-extrabold uppercase text-[8px] tracking-wider">Transit</span>
                                  </div>
                                  <span className="text-xs font-black text-white font-mono">20%</span>
                                  <span className="text-[9px] text-slate-400">₹{Math.round(sug.estimatedCost * 0.20).toLocaleString('en-IN')} clean rickshaws</span>
                                </div>
                                <div className="p-2.5 bg-brand-dark/40 rounded-xl border border-indigo-500/10 flex flex-col gap-1">
                                  <div className="flex items-center gap-1.5 text-indigo-400">
                                    <span className="w-2 h-2 rounded-full bg-indigo-500" />
                                    <span className="font-extrabold uppercase text-[8px] tracking-wider">Preservation</span>
                                  </div>
                                  <span className="text-xs font-black text-white font-mono">15%</span>
                                  <span className="text-[9px] text-slate-400">₹{Math.round(sug.estimatedCost * 0.15).toLocaleString('en-IN')} monument upkeep</span>
                                </div>
                              </div>
                            </div>

                            <p className="text-[10px] text-slate-400 leading-relaxed font-semibold italic border-t border-brand-teal/5 pt-3">
                              🛡️ <strong>Economic Safeguard:</strong> This itinerary directly bypasses middleman markups, ensuring that your travel capital supports grassroot self-employed craftsmen, boatmen unions, and clean state-affiliated eco-homestays.
                            </p>
                          </div>

                          {/* Interactive budget safety widget */}
                          <div className="p-4 bg-brand-bg/50 rounded-2xl border border-brand-teal/10 flex items-start gap-3.5">
                            <CheckCircle className="h-5 w-5 text-brand-teal shrink-0 mt-0.5" />
                            <div className="space-y-1">
                              <span className="text-[11px] font-black uppercase font-mono text-brand-teal">Safety Status: Budget Secured</span>
                              <p className="text-[11px] text-slate-300 leading-normal">
                                Our calculations show a budget margin of <strong className="text-white">₹{(budget - sug.estimatedCost) > 0 ? (budget - sug.estimatedCost).toLocaleString('en-IN') : 0}</strong> remaining for emergency buffers. Stays utilize verified budget tariffs and localized rates.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                    </div>

                    {/* ADVICE CHIP FROM THE ARCHITECT */}
                    <div className="p-4.5 bg-brand-rose/5 rounded-2xl border border-brand-rose/15 space-y-1">
                      <span className="text-[9.5px] font-mono font-extrabold uppercase tracking-widest text-brand-rose flex items-center gap-1">
                        <Compass className="h-3.5 w-3.5" />
                        Heritage Travel Specialist Advice:
                      </span>
                      <p className="text-[11px] text-slate-300 leading-relaxed font-semibold">
                        {sug.plannerAdvice}
                      </p>
                    </div>

                  </div>
                );
              })()}
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
