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
  AlertCircle
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
    image: "https://images.unsplash.com/photo-1561361513-2d000a45f1d2?auto=format&fit=crop&q=80&w=600",
    tagline: "The Eternal Light on the Ganges",
    budgetGuide: "₹8,000 - ₹25,000"
  },
  {
    id: "jaipur",
    name: "Jaipur",
    state: "Rajasthan",
    image: "https://images.unsplash.com/photo-1477584322811-2a1876b658f7?auto=format&fit=crop&q=80&w=600",
    tagline: "Gilded Palaces & Royal Legacies",
    budgetGuide: "₹10,000 - ₹35,000"
  },
  {
    id: "kochi",
    name: "Kochi",
    state: "Kerala",
    image: "https://images.unsplash.com/photo-1588598126702-8610738a1a3e?auto=format&fit=crop&q=80&w=600",
    tagline: "Malabar Breezes & Spice Channels",
    budgetGuide: "₹12,000 - ₹45,000"
  },
  {
    id: "hampi",
    name: "Hampi",
    state: "Karnataka",
    image: "https://images.unsplash.com/photo-1600100397608-f010e408fc69?auto=format&fit=crop&q=80&w=600",
    tagline: "Granite Monuments of a Lost Empire",
    budgetGuide: "₹7,500 - ₹22,000"
  }
];

interface TravelPlannerProps {
  activeCity: string | null;
  onCitySelected: (city: string) => void;
  setActiveTab: (tab: 'explore' | 'simulator' | 'compare' | 'hub' | 'navigator' | 'feeds' | 'alerts') => void;
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
  setActiveTab
}: TravelPlannerProps) {
  // Input fields state
  const [destination, setDestination] = useState<string>("Anywhere");
  const [budget, setBudget] = useState<number>(25000);
  const [duration, setDuration] = useState<number>(3);
  const [style, setStyle] = useState<string>("Heritage & Culture");
  const [companions, setCompanions] = useState<string>("Solo");
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  
  // High-fidelity image toggle and fallback states
  const [useVectorArt, setUseVectorArt] = useState<boolean>(false);
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
          companions
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
            <span className="text-[10px] font-bold text-brand-rose uppercase tracking-wider font-mono bg-brand-rose/10 px-2 py-1 rounded-lg border border-brand-rose/25 hidden sm:inline-block">4 Hubs</span>
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
                  /* Gorgeous CSS Swadeshi Art Gradient background fallback */
                  <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} flex flex-col justify-between p-4 overflow-hidden`}>
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
          
          {/* 1. LOADING SCREEN STATE */}
          {loading && (
            <div className="bg-brand-dark p-12 rounded-[32px] border border-brand-teal/20 shadow-md text-center flex flex-col items-center justify-center min-h-[500px]">
              <div className="relative mb-6">
                <div className="w-16 h-16 rounded-full border-4 border-brand-rose/10 border-t-brand-rose animate-spin" />
                <Compass className="h-6 w-6 text-brand-rose absolute top-5 left-5 animate-pulse" />
              </div>
              
              <h4 className="text-lg font-bold text-white font-display mb-2">Generating Cultural Architectural Matrix</h4>
              
              <div className="h-5 overflow-hidden relative max-w-sm w-full mx-auto">
                <AnimatePresence mode="wait">
                  <motion.p 
                    key={loadingStep}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-xs font-semibold text-slate-400 font-mono"
                  >
                    {stepsText[loadingStep]}
                  </motion.p>
                </AnimatePresence>
              </div>

              <div className="mt-8 flex gap-2 items-center text-[9px] font-mono text-slate-500 uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-teal animate-ping" />
                <span>Gemini Core Active</span>
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
                      
                      {/* TAB: DAY BY DAY ITINERARY (VERTICAL TIMELINE) */}
                      {activeResultTab === 'itinerary' && (
                        <div className="space-y-6 pt-2">
                          <div className="space-y-8 relative before:absolute before:top-4 before:bottom-4 before:left-3.5 before:w-0.5 before:bg-brand-teal/15">
                            {sug.itinerary.map((dayItem) => (
                              <div key={dayItem.day} className="relative pl-10 space-y-3">
                                
                                {/* Day number ring marker */}
                                <div className="absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-brand-dark border-2 border-brand-rose flex items-center justify-center text-brand-rose text-[10px] font-mono font-black">
                                  {dayItem.day}
                                </div>

                                <div className="bg-brand-bg/40 p-4 rounded-2xl border border-brand-teal/10 space-y-3.5">
                                  <h4 className="text-xs font-black font-display text-white uppercase tracking-wider border-b border-brand-teal/5 pb-2">
                                    {dayItem.title}
                                  </h4>

                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                                    <div className="space-y-1 bg-brand-dark/30 p-2.5 rounded-xl border border-brand-teal/5">
                                      <span className="text-[8.5px] font-mono font-extrabold uppercase tracking-widest text-brand-rose flex items-center gap-1">
                                        <Sun className="h-3 w-3 text-brand-rose" />
                                        Morning
                                      </span>
                                      <p className="text-[11px] text-slate-300 leading-normal">{dayItem.morning}</p>
                                    </div>

                                    <div className="space-y-1 bg-brand-dark/30 p-2.5 rounded-xl border border-brand-teal/5">
                                      <span className="text-[8.5px] font-mono font-extrabold uppercase tracking-widest text-brand-rose flex items-center gap-1">
                                        <Sun className="h-3 w-3 text-amber-500 rotate-90" />
                                        Afternoon
                                      </span>
                                      <p className="text-[11px] text-slate-300 leading-normal">{dayItem.afternoon}</p>
                                    </div>

                                    <div className="space-y-1 bg-brand-dark/30 p-2.5 rounded-xl border border-brand-teal/5">
                                      <span className="text-[8.5px] font-mono font-extrabold uppercase tracking-widest text-brand-rose flex items-center gap-1">
                                        <Clock className="h-3 w-3 text-slate-400" />
                                        Evening
                                      </span>
                                      <p className="text-[11px] text-slate-300 leading-normal">{dayItem.evening}</p>
                                    </div>
                                  </div>

                                  {/* Day Recommended food footer */}
                                  <div className="flex items-center gap-2 bg-brand-dark/50 px-3.5 py-2.5 rounded-xl border border-brand-teal/5 text-xs text-slate-300 font-semibold">
                                    <Coffee className="h-3.5 w-3.5 text-brand-teal shrink-0" />
                                    <span>
                                      <strong className="text-brand-teal">Recommended Local Bite:</strong> {dayItem.recommendedFood}
                                    </span>
                                  </div>
                                </div>

                              </div>
                            ))}
                          </div>
                        </div>
                      )}

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
