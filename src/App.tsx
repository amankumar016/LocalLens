import React, { useState, useEffect, useRef } from "react";
import { 
  Layers, 
  Users, 
  Compass, 
  ShieldAlert, 
  AlertTriangle, 
  HelpCircle, 
  ArrowRight, 
  Info, 
  Check, 
  ShieldCheck, 
  Waves, 
  Navigation, 
  MapPin, 
  Brain, 
  Sparkles, 
  Send, 
  X, 
  Clock, 
  Search, 
  DollarSign, 
  Briefcase, 
  AlertCircle,
  RefreshCw,
  Thermometer,
  Shield,
  HelpCircle as HelpIcon,
  Mail,
  MessageSquare,
  Sliders,
  Activity,
  Eye,
  EyeOff,
  GitCompare,
  Download,
  FileText,
  ChevronRight,
  Mic
} from "lucide-react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Preloader from "./components/Preloader";
import CustomCursor from "./components/CustomCursor";
import SmoothScroll from "./components/SmoothScroll";
import Heritage3DCanvas from "./components/Heritage3DCanvas";
import { motion, AnimatePresence } from "motion/react";
import RealTimeFeeds from "./components/RealTimeFeeds";
import TravelPlanner from "./components/TravelPlanner";
import ScenarioComparer from "./components/ScenarioComparer";
import MultiCityCompare from "./components/MultiCityCompare";
import AIModelLibrary from "./components/AIModelLibrary";
import HeritageChatBot from "./components/HeritageChatBot";
import TrendChart from "./components/TrendChart";
import StakeholderDashboard from "./components/StakeholderDashboard";
import CulturalStoryteller from "./components/CulturalStoryteller";
import { PolicyInputs, SimulationResult, Entrepreneur, CivicAlert, TrustReport } from "./types";
import gsap from "gsap";
import { ARTISAN_PORTFOLIOS } from "./data/portfolios";

// Artisan Avatar helper component with custom high-fidelity initial fallbacks
function ArtisanAvatar({ src, name, className = "w-10 h-10 rounded-xl" }: { src: string; name: string; className?: string }) {
  const [error, setError] = useState(false);
  
  if (error || !src) {
    const initial = name ? name.charAt(0).toUpperCase() : "A";
    const charCode = name ? name.charCodeAt(0) : 65;
    const gradients = [
      "from-orange-600 to-rose-700 text-orange-100",
      "from-teal-600 to-emerald-800 text-teal-100",
      "from-amber-500 to-[#E64833] text-amber-100",
      "from-pink-600 to-rose-950 text-pink-100"
    ];
    const gradient = gradients[charCode % gradients.length];
    
    return (
      <div className={`bg-gradient-to-br ${gradient} flex items-center justify-center font-display font-black text-xs select-none shadow-sm border border-white/10 shrink-0 ${className}`}>
        {initial}
      </div>
    );
  }

  return (
    <img 
      src={src} 
      alt={name} 
      referrerPolicy="no-referrer"
      onError={() => setError(true)}
      className={`object-cover shadow-sm bg-slate-800 shrink-0 ${className}`}
    />
  );
}

// Dynamic configuration dictionary for each supported heritage city
const cityConfigs = {
  varanasi: {
    id: "varanasi" as const,
    fullName: "Varanasi (Kashi)",
    tagline: "Holy Ganga Hydro-Civic Corridor",
    description: "Simulating capital flow sharing across wood boat cooperatives, traditional handloom silk saree weavers, lacquer toy carvers, and eco-rickshaws.",
    themeColor: "orange",
    colorClass: "text-orange-600 border-orange-200 bg-orange-50",
    sliderColor: "accent-orange-600",
    headerBg: "bg-gradient-to-r from-orange-600 to-amber-700",
    btnPrimary: "bg-orange-600 hover:bg-orange-700 focus:ring-orange-500",
    badgeClass: "bg-orange-100 text-orange-800",
    environmentalHazardLabel: "Monsoon Flood Silt Level",
    environmentalHazardDesc: "Simulates Ganga river surges. High hazard stops wooden boat navigation but shifts attention to craft bazaars.",
    sanitationLabel: "Ghat Cleanliness Score",
    congestionLabel: "Ancient Lane Transit Congestion",
    coopLabel: "Weaver Cooperative Payout Growth",
    incidentLocations: ["Dashashwamedh Ghat", "Assi Ghat", "Godowlia Crossing", "Manikarnika Lane", "Madanpura Weavers Lane"],
    scenicNodes: [
      { name: "Godowlia Crossing", description: "Narrow Lane Gridlock Node", x: "20%", y: "22%", iconType: "transit", metricKey: "trafficCongestion" },
      { name: "Madanpura Saree Lane", description: "Banarasi Weavers Co-op", x: "78%", y: "38%", iconType: "coop", metricKey: "weaverCooperativeIncome" },
      { name: "Dashashwamedh Ghat", description: "River Front Purification Node", x: "32%", y: "76%", iconType: "sanitation", metricKey: "ghatCleanliness" },
      { name: "Assi Ghat Anchor", description: "Boatmen Tourism Hub", x: "82%", y: "82%", iconType: "anchor", metricKey: "safetyTrustRating" }
    ],
    scenicRoutes: [
      { x1: "20%", y1: "22%", x2: "78%", y2: "38%" },
      { x1: "20%", y1: "22%", x2: "32%", y2: "76%" },
      { x1: "32%", y1: "76%", x2: "82%", y2: "82%" },
      { x1: "78%", y1: "38%", x2: "82%", y2: "82%" }
    ]
  },
  jaipur: {
    id: "jaipur" as const,
    fullName: "Jaipur (Pink City)",
    tagline: "Desert Craft & Palace Trade Corridor",
    description: "Modeling localized commissions across cobalt blue pottery kilns, Kathputli puppet artisans, traditional fort guides, and Hawa Mahal auto shuttles.",
    themeColor: "rose",
    colorClass: "text-rose-600 border-rose-200 bg-rose-50",
    sliderColor: "accent-rose-600",
    headerBg: "bg-gradient-to-r from-rose-600 to-pink-700",
    btnPrimary: "bg-rose-600 hover:bg-rose-700 focus:ring-rose-500",
    badgeClass: "bg-rose-100 text-rose-800",
    environmentalHazardLabel: "Extreme Summer Heat Intensity",
    environmentalHazardDesc: "Simulates peak desert aridity. Intense temperature restricts mid-day travel, stressing driver battery capacities.",
    sanitationLabel: "Historic Palace Bazaar Cleanliness",
    congestionLabel: "Old City Gate Transit Bottlenecks",
    coopLabel: "Blue Pottery Guild Net Profits",
    incidentLocations: ["Hawa Mahal Crossing", "Amber Fort Gateway", "Johari Bazaar Lane", "Sanganer Textile Lane", "Bapu Bazaar"],
    scenicNodes: [
      { name: "Hawa Mahal Crossing", description: "Palace Transit Gridlock Node", x: "24%", y: "24%", iconType: "transit", metricKey: "trafficCongestion" },
      { name: "Sanganer Craft Guild", description: "Artisan Blue Pottery Kilns", x: "72%", y: "35%", iconType: "coop", metricKey: "weaverCooperativeIncome" },
      { name: "Johari Bazaar Plaza", description: "Bazaar Sweep Zone", x: "35%", y: "72%", iconType: "sanitation", metricKey: "ghatCleanliness" },
      { name: "Amber Palace Gateway", description: "Heritage Guides Assembly", x: "80%", y: "78%", iconType: "anchor", metricKey: "safetyTrustRating" }
    ],
    scenicRoutes: [
      { x1: "24%", y1: "24%", x2: "72%", y2: "35%" },
      { x1: "24%", y1: "24%", x2: "35%", y2: "72%" },
      { x1: "35%", y1: "72%", x2: "80%", y2: "78%" },
      { x1: "72%", y1: "35%", x2: "80%", y2: "78%" }
    ]
  },
  kochi: {
    id: "kochi" as const,
    fullName: "Kochi (Malabar Coast)",
    tagline: "Coastal Backwater Heritage Corridor",
    description: "Analyzing earnings of cantilever Chinese fishing net cooperators, organic golden coir weavers, Kathakali wooden carvers, and narrow lane spice e-tuks.",
    themeColor: "emerald",
    colorClass: "text-emerald-600 border-emerald-200 bg-emerald-50",
    sliderColor: "accent-emerald-600",
    headerBg: "bg-gradient-to-r from-emerald-600 to-teal-700",
    btnPrimary: "bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500",
    badgeClass: "bg-emerald-100 text-emerald-800",
    environmentalHazardLabel: "Coastal Tide & Backwater Swell",
    environmentalHazardDesc: "Simulates ocean tidal ingress. Waves and floating water hyacinth silt require active harbor cleanup.",
    sanitationLabel: "Waterways Shore Cleanliness Score",
    congestionLabel: "Spice Street Narrow Corridor Gridlock",
    coopLabel: "Coir Weaver Union Profit Index",
    incidentLocations: ["Fort Kochi Nets", "Mattancherry Spice Street", "Kalady Weavers Guild", "Vypin Ferry Dock", "Jewish Town Lane"],
    scenicNodes: [
      { name: "Mattancherry Crossing", description: "Spice Lane Gridlock Node", x: "22%", y: "28%", iconType: "transit", metricKey: "trafficCongestion" },
      { name: "Kalady Handcraft Guild", description: "Coir rug spinning looms", x: "74%", y: "42%", iconType: "coop", metricKey: "weaverCooperativeIncome" },
      { name: "Fort Kochi Nets beach", description: "Hyacinth Silt sweeping zone", x: "36%", y: "74%", iconType: "sanitation", metricKey: "ghatCleanliness" },
      { name: "Vypin Ferry Dock", description: "Backwater boat ferries", x: "85%", y: "80%", iconType: "anchor", metricKey: "safetyTrustRating" }
    ],
    scenicRoutes: [
      { x1: "22%", y1: "28%", x2: "74%", y2: "42%" },
      { x1: "22%", y1: "28%", x2: "36%", y2: "74%" },
      { x1: "36%", y1: "74%", x2: "85%", y2: "80%" },
      { x1: "74%", y1: "42%", x2: "85%", y2: "80%" }
    ]
  },
  hampi: {
    id: "hampi" as const,
    fullName: "Hampi (Vijayanagara)",
    tagline: "Sacred Ruins Ancient Monument Sanctuary",
    description: "Evaluating stone carver wages, female banana-fiber weavers, Tungabhadra coracle rowers, and green solar electric passenger carts.",
    themeColor: "amber",
    colorClass: "text-amber-600 border-amber-200 bg-amber-50",
    sliderColor: "accent-amber-600",
    headerBg: "bg-gradient-to-r from-amber-600 to-indigo-800",
    btnPrimary: "bg-amber-600 hover:bg-amber-700 focus:ring-amber-500",
    badgeClass: "bg-amber-100 text-amber-800",
    environmentalHazardLabel: "Tungabhadra Silt Discharge Level",
    environmentalHazardDesc: "Simulates upstream reservoir dam releases. Heavy discharge surges halt coracle row boats but boost land shuttles.",
    sanitationLabel: "ASI Monument Ruins Protection Score",
    congestionLabel: "Heritage Plaza Monument Queues",
    coopLabel: "Kishkinda Fiber Guild Dividend",
    incidentLocations: ["Virupaksha Temple Lane", "Hampi Bazaar Walkway", "Anegundi Craft Guild", "Kamalapura Sculpting Plaza", "Vittala Temple Area"],
    scenicNodes: [
      { name: "Hampi Bazaar Way", description: "Shuttle Solar cart gridlock", x: "25%", y: "20%", iconType: "transit", metricKey: "trafficCongestion" },
      { name: "Anegundi Craft Guild", description: "Banana fiber splitting looms", x: "76%", y: "40%", iconType: "coop", metricKey: "weaverCooperativeIncome" },
      { name: "Virupaksha Plaza", description: "Archaeological Sweep Node", x: "30%", y: "70%", iconType: "sanitation", metricKey: "ghatCleanliness" },
      { name: "Tungabhadra Coracle Dock", description: "River rowers boarding bank", x: "82%", y: "84%", iconType: "anchor", metricKey: "safetyTrustRating" }
    ],
    scenicRoutes: [
      { x1: "25%", y1: "20%", x2: "76%", y2: "40%" },
      { x1: "25%", y1: "20%", x2: "30%", y2: "70%" },
      { x1: "30%", y1: "70%", x2: "82%", y2: "84%" },
      { x1: "76%", y1: "40%", x2: "82%", y2: "84%" }
    ]
  }
} as const;

const PALETTE_SWATCHES = [
  { hex: "#2F4454", color: "bg-[#2F4454]", name: "Steel" },
  { hex: "#2E151B", color: "bg-[#2E151B]", name: "Auber" },
  { hex: "#DA7B93", color: "bg-[#DA7B93]", name: "Rose" },
  { hex: "#376E6F", color: "bg-[#376E6F]", name: "Patina" },
  { hex: "#1C3334", color: "bg-[#1C3334]", name: "Forest" }
];

const CYCLE_TEXTS = [
  { main: "LET'S BE THINKERS", sub: "FOR HERITAGE CORRIDORS YOU SHAPE" },
  { main: "LET'S BE PRESERVERS", sub: "FOR ANCIENT CRAFTS YOU SPONSOR" },
  { main: "LET'S BE PLANNERS", sub: "FOR CIVIC SCENARIOS YOU SIMULATE" },
  { main: "LET'S BE ARCHITECTS", sub: "FOR SUSTAINABLE MUNICIPAL FUTURE" }
];

const DEFAULT_PRESETS: Record<string, { inputsA: PolicyInputs, inputsB: PolicyInputs }> = {
  varanasi: {
    inputsA: {
      city: 'varanasi',
      rickshawSubsidy: 1500,
      wasteManagementBudget: 80,
      safetyPatrolIntensity: 2,
      middlemenCommissionCap: 45,
      standardizedRatesEnabled: false,
      touristMultiplier: 2.0,
      weatherHazard: 'low'
    },
    inputsB: {
      city: 'varanasi',
      rickshawSubsidy: 7500,
      wasteManagementBudget: 350,
      safetyPatrolIntensity: 12,
      middlemenCommissionCap: 15,
      standardizedRatesEnabled: true,
      touristMultiplier: 1.5,
      weatherHazard: 'low'
    }
  },
  jaipur: {
    inputsA: {
      city: 'jaipur',
      rickshawSubsidy: 2000,
      wasteManagementBudget: 100,
      safetyPatrolIntensity: 3,
      middlemenCommissionCap: 48,
      standardizedRatesEnabled: false,
      touristMultiplier: 2.5,
      weatherHazard: 'low'
    },
    inputsB: {
      city: 'jaipur',
      rickshawSubsidy: 8000,
      wasteManagementBudget: 400,
      safetyPatrolIntensity: 14,
      middlemenCommissionCap: 10,
      standardizedRatesEnabled: true,
      touristMultiplier: 1.8,
      weatherHazard: 'low'
    }
  },
  kochi: {
    inputsA: {
      city: 'kochi',
      rickshawSubsidy: 1800,
      wasteManagementBudget: 90,
      safetyPatrolIntensity: 2,
      middlemenCommissionCap: 40,
      standardizedRatesEnabled: false,
      touristMultiplier: 2.2,
      weatherHazard: 'low'
    },
    inputsB: {
      city: 'kochi',
      rickshawSubsidy: 7000,
      wasteManagementBudget: 380,
      safetyPatrolIntensity: 11,
      middlemenCommissionCap: 15,
      standardizedRatesEnabled: true,
      touristMultiplier: 1.4,
      weatherHazard: 'low'
    }
  },
  hampi: {
    inputsA: {
      city: 'hampi',
      rickshawSubsidy: 1200,
      wasteManagementBudget: 60,
      safetyPatrolIntensity: 1,
      middlemenCommissionCap: 45,
      standardizedRatesEnabled: false,
      touristMultiplier: 2.0,
      weatherHazard: 'low'
    },
    inputsB: {
      city: 'hampi',
      rickshawSubsidy: 6500,
      wasteManagementBudget: 320,
      safetyPatrolIntensity: 10,
      middlemenCommissionCap: 12,
      standardizedRatesEnabled: true,
      touristMultiplier: 1.3,
      weatherHazard: 'low'
    }
  }
};

export default function App() {
  // Global active destination state
  const [activeCity, setActiveCity] = useState<string | null>(null);
  const [dynamicConfigs, setDynamicConfigs] = useState<Record<string, any>>({});

  // Dynamic Redesigned Landing Page States
  const [bannerTextIndex, setBannerTextIndex] = useState<number>(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const textTimer = setInterval(() => {
      setBannerTextIndex(prev => (prev + 1) % CYCLE_TEXTS.length);
    }, 4500);
    return () => clearInterval(textTimer);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!bannerRef.current) return;
    const rect = bannerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setMousePos({ x: x * 0.12, y: y * 0.12 });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };
  
  // Navigation Section State
  const [activeTab, setActiveTab] = useState<'explore' | 'simulator' | 'compare' | 'hub' | 'navigator' | 'feeds' | 'alerts' | 'dashboard' | 'storyteller'>('explore');
  const [compareMode, setCompareMode] = useState<'scenarios' | 'cities'>('scenarios');

  // Custom premium interactive states
  const [scrollRatio, setScrollRatio] = useState(0);
  const [preloaderComplete, setPreloaderComplete] = useState(false);

  // Toast notification state
  const [toast, setToast] = useState<{ message: string; type: "success" | "warning" | "info" } | null>(null);
  const toastTimeoutRef = useRef<any>(null);

  const showToast = (message: string, type: "success" | "warning" | "info" = "success") => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToast({ message, type });
    toastTimeoutRef.current = setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Policy Sliders Input States
  const [inputs, setInputs] = useState<PolicyInputs>({
    city: 'varanasi',
    rickshawSubsidy: 4000,
    wasteManagementBudget: 150,
    safetyPatrolIntensity: 6,
    middlemenCommissionCap: 30,
    standardizedRatesEnabled: true,
    touristMultiplier: 1.5,
    weatherHazard: 'low',
    activeDirectives: []
  });

  // Simulated Outcome Metrics States
  const [metrics, setMetrics] = useState<SimulationResult>({
    economicDistribution: 48,
    safetyTrustRating: 72,
    merchantRevenueGrowth: 15,
    complaintsRate: 18,
    trafficCongestion: 42,
    weaverCooperativeIncome: 12,
    ghatCleanliness: 65,
    aiPolicyBrief: ""
  });

  // Database lists fetched from backend
  const [entrepreneurs, setEntrepreneurs] = useState<Entrepreneur[]>([]);
  const [alerts, setAlerts] = useState<CivicAlert[]>([]);
  const [reports, setReports] = useState<TrustReport[]>([]);

  // Selection & Form Loading Toggles
  const [selectedEntrepreneurId, setSelectedEntrepreneurId] = useState<string | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [isAILoading, setIsAILoading] = useState<boolean>(false);
  const briefDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const [simulatorSubTab, setSimulatorSubTab] = useState<'policy' | 'models' | 'split'>('policy');
  
  // Split-Screen Side-by-Side Simulation States
  const [inputsA, setInputsA] = useState<PolicyInputs>({
    city: 'varanasi',
    rickshawSubsidy: 4000,
    wasteManagementBudget: 150,
    safetyPatrolIntensity: 6,
    middlemenCommissionCap: 30,
    standardizedRatesEnabled: true,
    touristMultiplier: 1.5,
    weatherHazard: 'low',
    activeDirectives: []
  });
  const [inputsB, setInputsB] = useState<PolicyInputs>({
    city: 'varanasi',
    rickshawSubsidy: 7500,
    wasteManagementBudget: 350,
    safetyPatrolIntensity: 12,
    middlemenCommissionCap: 15,
    standardizedRatesEnabled: true,
    touristMultiplier: 1.5,
    weatherHazard: 'low',
    activeDirectives: []
  });
  const [metricsA, setMetricsA] = useState<SimulationResult>({
    economicDistribution: 48,
    safetyTrustRating: 72,
    merchantRevenueGrowth: 15,
    complaintsRate: 18,
    trafficCongestion: 42,
    weaverCooperativeIncome: 12,
    ghatCleanliness: 65,
    aiPolicyBrief: ""
  });
  const [metricsB, setMetricsB] = useState<SimulationResult>({
    economicDistribution: 76,
    safetyTrustRating: 88,
    merchantRevenueGrowth: 18,
    complaintsRate: 6,
    trafficCongestion: 30,
    weaverCooperativeIncome: 32,
    ghatCleanliness: 82,
    aiPolicyBrief: ""
  });
  const [isSimulatingA, setIsSimulatingA] = useState<boolean>(false);
  const [isSimulatingB, setIsSimulatingB] = useState<boolean>(false);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [hubRoleFilter, setHubRoleFilter] = useState<string>("all");
  const [artisanSubTab, setArtisanSubTab] = useState<'audit' | 'portfolio' | 'storefront'>('audit');

  // Custom Report Form States
  const [reportName, setReportName] = useState<string>("");
  const [reportType, setReportType] = useState<'Overcharging' | 'Unlicensed Guide' | 'Harassment' | 'Ghat Littering' | 'Other'>("Overcharging");
  const [reportLocation, setReportLocation] = useState<string>("");
  const [reportDesc, setReportDesc] = useState<string>("");
  const [reportSuccess, setReportSuccess] = useState<boolean>(false);
  const [uploadedReceipt, setUploadedReceipt] = useState<any | null>(null);
  const [isExtractingReceipt, setIsExtractingReceipt] = useState<boolean>(false);
  const [extractionProgress, setExtractionProgress] = useState<string>("");

  // Voice Storefront States
  const [voiceRecordingActive, setVoiceRecordingActive] = useState<boolean>(false);
  const [voiceGenerating, setVoiceGenerating] = useState<boolean>(false);
  const [voiceStep, setVoiceStep] = useState<string>("");
  const [currentStorefrontProduct, setCurrentStorefrontProduct] = useState<any | null>(null);
  const [currentTwinLang, setCurrentTwinLang] = useState<string>("English");

  // Inquiry Modal Form States
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState<boolean>(false);
  const [inquiryName, setInquiryName] = useState<string>("");
  const [inquiryEmail, setInquiryEmail] = useState<string>("");
  const [inquiryType, setInquiryType] = useState<'Question' | 'Suggestion' | 'Support Request'>("Question");
  const [inquiryMessage, setInquiryMessage] = useState<string>("");
  const [inquirySuccess, setInquirySuccess] = useState<boolean>(false);

  // Heatmap Overlay Mode for Interactive Map
  const [heatmapMode, setHeatmapMode] = useState<'congestion' | 'cleanliness' | 'none'>('congestion');

  // Filter mode for interactive map nodes and routes
  const [nodeTypeFilter, setNodeTypeFilter] = useState<'all' | 'transit' | 'coop' | 'sanitation' | 'anchor'>('all');

  // Selected node for local inspection detail popup (Improvement 1)
  const [selectedNode, setSelectedNode] = useState<any>(null);

  // Hovered node state for showing metric details on hover (without requiring a click)
  const [hoveredNode, setHoveredNode] = useState<any>(null);

  // Toggle for backdrop 3D model opacity
  const [backdropVisible, setBackdropVisible] = useState<boolean>(true);

  // Active City Config values
  const currentCityConfig = activeCity ? (cityConfigs[activeCity as keyof typeof cityConfigs] || dynamicConfigs[activeCity]) : null;

  // Export functions
  const handleExportJSON = () => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(
        JSON.stringify({
          title: "Swaraj Ledger Simulation Report",
          timestamp: new Date().toISOString(),
          city: currentCityConfig?.fullName || activeCity || "Varanasi",
          policySettings: {
            rickshawSubsidyMonthly: `₹${inputs.rickshawSubsidy}`,
            wasteManagementBudgetMonthly: `₹${inputs.wasteManagementBudget || 150}k`,
            safetyPatrolIntensity: `${inputs.safetyPatrolIntensity}/15`,
            middlemenCommissionCap: `${inputs.middlemenCommissionCap}%`,
            standardizedRatesEnabled: inputs.standardizedRatesEnabled ? "Yes" : "No",
            touristMultiplier: `${inputs.touristMultiplier}x`
          },
          simulatedOutcomes: {
            artisanIncomeSupport: `${metrics.economicDistribution}%`,
            safetyTrustLevel: `${metrics.safetyTrustRating}%`,
            cooperativeGrowth: `+${metrics.weaverCooperativeIncome}%`,
            ghatCleanliness: `${metrics.ghatCleanliness}%`
          },
          aiPolicyBrief: metrics.aiPolicyBrief || "No brief compiled yet."
        }, null, 2)
      );
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `swaraj_simulation_${(activeCity || "varanasi").toLowerCase()}_${new Date().toISOString().slice(0,10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast("Simulation ledger downloaded as JSON successfully!", "success");
    } catch (err) {
      console.error(err);
      showToast("Failed to export JSON report", "warning");
    }
  };

  const handleExportPDF = () => {
    try {
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        showToast("Popup blocked! Please allow popups to view/print PDF report.", "warning");
        return;
      }

      const cityTitle = currentCityConfig?.fullName || activeCity || "Varanasi";
      const timestamp = new Date().toLocaleString();

      printWindow.document.write(`
        <html>
          <head>
            <title>Swaraj Ledger - Simulation Report - ${cityTitle}</title>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
            <style>
              body {
                font-family: 'Inter', sans-serif;
                color: #0f172a;
                background-color: #ffffff;
                margin: 0;
                padding: 40px;
                line-height: 1.6;
              }
              header {
                border-bottom: 4px solid #376e6f;
                padding-bottom: 20px;
                margin-bottom: 30px;
              }
              .logo {
                font-size: 24px;
                font-weight: 800;
                color: #376e6f;
                text-transform: uppercase;
                letter-spacing: 2px;
                margin: 0;
              }
              .subtitle {
                font-size: 11px;
                font-family: 'JetBrains Mono', monospace;
                color: #64748b;
                text-transform: uppercase;
                letter-spacing: 1px;
                margin: 4px 0 0 0;
              }
              h1 {
                font-size: 20px;
                font-weight: 800;
                color: #0f172a;
                margin: 20px 0 10px 0;
                text-transform: uppercase;
                letter-spacing: 0.5px;
              }
              .meta-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 20px;
                margin-bottom: 30px;
                background-color: #f8fafc;
                padding: 20px;
                border-radius: 12px;
                border: 1px solid #e2e8f0;
              }
              .meta-item {
                font-size: 13px;
              }
              .meta-label {
                font-weight: 700;
                color: #64748b;
                text-transform: uppercase;
                font-size: 10px;
                letter-spacing: 0.5px;
                margin-bottom: 4px;
              }
              .meta-val {
                font-weight: 600;
                color: #0f172a;
              }
              .section-title {
                font-size: 14px;
                font-weight: 800;
                text-transform: uppercase;
                letter-spacing: 1px;
                color: #376e6f;
                border-bottom: 2px solid #e2e8f0;
                padding-bottom: 6px;
                margin-top: 30px;
                margin-bottom: 15px;
              }
              .grid-2 {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 20px;
              }
              .card {
                background: #f8fafc;
                border: 1px solid #e2e8f0;
                padding: 15px;
                border-radius: 10px;
              }
              .card-title {
                font-weight: 700;
                font-size: 12px;
                color: #475569;
                text-transform: uppercase;
                margin-bottom: 10px;
                font-family: 'JetBrains Mono', monospace;
              }
              .metric-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px 0;
                border-bottom: 1px solid #e2e8f0;
                font-size: 13px;
              }
              .metric-row:last-child {
                border-bottom: none;
              }
              .metric-name {
                color: #334155;
                font-weight: 500;
              }
              .metric-value {
                font-weight: 700;
                color: #0f172a;
                font-family: 'JetBrains Mono', monospace;
              }
              .brief-content {
                font-size: 13px;
                color: #1e293b;
                line-height: 1.7;
              }
              .brief-p {
                margin-bottom: 12px;
              }
              footer {
                margin-top: 50px;
                border-top: 1px solid #e2e8f0;
                padding-top: 15px;
                font-size: 11px;
                color: #94a3b8;
                font-family: 'JetBrains Mono', monospace;
                text-align: center;
              }
              @media print {
                body {
                  padding: 20px;
                }
                .no-print {
                  display: none;
                }
              }
              .btn-print {
                display: inline-block;
                background-color: #376e6f;
                color: white;
                padding: 10px 20px;
                border-radius: 8px;
                text-decoration: none;
                font-weight: 700;
                font-size: 12px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                border: none;
                cursor: pointer;
                margin-bottom: 20px;
              }
              .btn-print:hover {
                background-color: #2c595a;
              }
            </style>
          </head>
          <body>
            <div class="no-print" style="text-align: right;">
              <button class="btn-print" onclick="window.print()">Print / Save as PDF</button>
            </div>
            <header>
              <div class="logo">Swaraj Ledger</div>
              <div class="subtitle">Decentralized Tourism Governance Framework</div>
            </header>
            
            <h1>Executive Simulation Report</h1>
            
            <div class="meta-grid">
              <div class="meta-item">
                <div class="meta-label">Selected Territory</div>
                <div class="meta-val">${cityTitle}</div>
              </div>
              <div class="meta-item">
                <div class="meta-label">Timestamp</div>
                <div class="meta-val">${timestamp}</div>
              </div>
            </div>

            <div class="grid-2">
              <div class="card">
                <div class="card-title">Applied Policy Variables</div>
                <div class="metric-row">
                  <span class="metric-name">Rickshaw Subsidy</span>
                  <span class="metric-value">₹${inputs.rickshawSubsidy}/mo</span>
                </div>
                <div class="metric-row">
                  <span class="metric-name">Waste Mgmt Budget</span>
                  <span class="metric-value">₹${inputs.wasteManagementBudget || 150}k</span>
                </div>
                <div class="metric-row">
                  <span class="metric-name">Safety Patrol Intensity</span>
                  <span class="metric-value">${inputs.safetyPatrolIntensity}/15</span>
                </div>
                <div class="metric-row">
                  <span class="metric-name">Middlemen Commission Cap</span>
                  <span class="metric-value">${inputs.middlemenCommissionCap}%</span>
                </div>
                <div class="metric-row">
                  <span class="metric-name">Standardized Rates</span>
                  <span class="metric-value">${inputs.standardizedRatesEnabled ? 'ENABLED' : 'DISABLED'}</span>
                </div>
                <div class="metric-row">
                  <span class="metric-name">Tourist Multiplier</span>
                  <span class="metric-value">${inputs.touristMultiplier}x</span>
                </div>
              </div>

              <div class="card">
                <div class="card-title">Simulated Outcomes</div>
                <div class="metric-row">
                  <span class="metric-name">Artisan Income Support</span>
                  <span class="metric-value">${metrics.economicDistribution}%</span>
                </div>
                <div class="metric-row">
                  <span class="metric-name">Safety & Trust Level</span>
                  <span class="metric-value">${metrics.safetyTrustRating}%</span>
                </div>
                <div class="metric-row">
                  <span class="metric-name">Cooperative Growth</span>
                  <span class="metric-value">+${metrics.weaverCooperativeIncome}%</span>
                </div>
                <div class="metric-row">
                  <span class="metric-name">Ghat Cleanliness</span>
                  <span class="metric-value">${metrics.ghatCleanliness}%</span>
                </div>
              </div>
            </div>

            <div class="section-title">Strategic Policy Briefing</div>
            <div class="brief-content">
              ${(metrics.aiPolicyBrief || "No briefing active. Calibrate sliders or apply a preset to synthesize an AI policy briefing.")
                .split('\n\n')
                .map(para => `<p class="brief-p">${para}</p>`)
                .join('')}
            </div>

            <footer>
              Swaraj Ledger - Algorithmic Simulation Module &copy; 2026. Confidential Policy Document.
            </footer>
          </body>
        </html>
      `);
      printWindow.document.close();
      showToast("PDF report preview generated. Use the print action to save as PDF.", "info");
    } catch (err) {
      console.error(err);
      showToast("Failed to generate PDF report", "warning");
    }
  };

  // Heatmap helper functions
  const findNodeNameByCoords = (x: string, y: string) => {
    const matched = currentCityConfig?.scenicNodes.find(node => node.x === x && node.y === y);
    return matched ? matched.name : "";
  };

  const getNodeMetric = (nodeName: string, mode: 'congestion' | 'cleanliness') => {
    const baseCongestion = metrics.trafficCongestion;
    const baseCleanliness = metrics.ghatCleanliness;
    
    if (mode === 'congestion') {
      if (nodeName.toLowerCase().includes('crossing') || nodeName.toLowerCase().includes('way') || nodeName.toLowerCase().includes('bazaar')) {
        return baseCongestion;
      }
      if (nodeName.toLowerCase().includes('guild') || nodeName.toLowerCase().includes('craft')) {
        return Math.max(15, Math.min(95, baseCongestion * 0.6 + (inputs.rickshawSubsidy > 5000 ? 15 : -10)));
      }
      if (nodeName.toLowerCase().includes('ghat') || nodeName.toLowerCase().includes('plaza') || nodeName.toLowerCase().includes('beach')) {
        return Math.max(10, Math.min(95, baseCongestion * 0.5));
      }
      return Math.max(10, Math.min(95, baseCongestion * 0.8 + (inputs.weatherHazard === 'high' ? 15 : -5)));
    } else {
      if (nodeName.toLowerCase().includes('ghat') || nodeName.toLowerCase().includes('plaza') || nodeName.toLowerCase().includes('beach') || nodeName.toLowerCase().includes('temple')) {
        return baseCleanliness;
      }
      if (nodeName.toLowerCase().includes('guild') || nodeName.toLowerCase().includes('craft')) {
        return Math.max(20, Math.min(100, baseCleanliness * 0.9));
      }
      if (nodeName.toLowerCase().includes('crossing') || nodeName.toLowerCase().includes('way') || nodeName.toLowerCase().includes('bazaar')) {
        return Math.max(10, Math.min(100, baseCleanliness * 0.6 - (baseCongestion > 60 ? 15 : 0)));
      }
      return Math.max(20, Math.min(100, baseCleanliness * 0.8));
    }
  };

  const getNodeMetricA = (nodeName: string, mode: 'congestion' | 'cleanliness') => {
    const baseCongestion = metricsA.trafficCongestion;
    const baseCleanliness = metricsA.ghatCleanliness;
    
    if (mode === 'congestion') {
      if (nodeName.toLowerCase().includes('crossing') || nodeName.toLowerCase().includes('way') || nodeName.toLowerCase().includes('bazaar')) {
        return baseCongestion;
      }
      if (nodeName.toLowerCase().includes('guild') || nodeName.toLowerCase().includes('craft')) {
        return Math.max(15, Math.min(95, baseCongestion * 0.6 + (inputsA.rickshawSubsidy > 5000 ? 15 : -10)));
      }
      if (nodeName.toLowerCase().includes('ghat') || nodeName.toLowerCase().includes('plaza') || nodeName.toLowerCase().includes('beach')) {
        return Math.max(10, Math.min(95, baseCongestion * 0.5));
      }
      return Math.max(10, Math.min(95, baseCongestion * 0.8 + (inputsA.weatherHazard === 'high' ? 15 : -5)));
    } else {
      if (nodeName.toLowerCase().includes('ghat') || nodeName.toLowerCase().includes('plaza') || nodeName.toLowerCase().includes('beach') || nodeName.toLowerCase().includes('temple')) {
        return baseCleanliness;
      }
      if (nodeName.toLowerCase().includes('guild') || nodeName.toLowerCase().includes('craft')) {
        return Math.max(20, Math.min(100, baseCleanliness * 0.9));
      }
      if (nodeName.toLowerCase().includes('crossing') || nodeName.toLowerCase().includes('way') || nodeName.toLowerCase().includes('bazaar')) {
        return Math.max(10, Math.min(100, baseCleanliness * 0.6 - (baseCongestion > 60 ? 15 : 0)));
      }
      return Math.max(20, Math.min(100, baseCleanliness * 0.8));
    }
  };

  const getNodeMetricB = (nodeName: string, mode: 'congestion' | 'cleanliness') => {
    const baseCongestion = metricsB.trafficCongestion;
    const baseCleanliness = metricsB.ghatCleanliness;
    
    if (mode === 'congestion') {
      if (nodeName.toLowerCase().includes('crossing') || nodeName.toLowerCase().includes('way') || nodeName.toLowerCase().includes('bazaar')) {
        return baseCongestion;
      }
      if (nodeName.toLowerCase().includes('guild') || nodeName.toLowerCase().includes('craft')) {
        return Math.max(15, Math.min(95, baseCongestion * 0.6 + (inputsB.rickshawSubsidy > 5000 ? 15 : -10)));
      }
      if (nodeName.toLowerCase().includes('ghat') || nodeName.toLowerCase().includes('plaza') || nodeName.toLowerCase().includes('beach')) {
        return Math.max(10, Math.min(95, baseCongestion * 0.5));
      }
      return Math.max(10, Math.min(95, baseCongestion * 0.8 + (inputsB.weatherHazard === 'high' ? 15 : -5)));
    } else {
      if (nodeName.toLowerCase().includes('ghat') || nodeName.toLowerCase().includes('plaza') || nodeName.toLowerCase().includes('beach') || nodeName.toLowerCase().includes('temple')) {
        return baseCleanliness;
      }
      if (nodeName.toLowerCase().includes('guild') || nodeName.toLowerCase().includes('craft')) {
        return Math.max(20, Math.min(100, baseCleanliness * 0.9));
      }
      if (nodeName.toLowerCase().includes('crossing') || nodeName.toLowerCase().includes('way') || nodeName.toLowerCase().includes('bazaar')) {
        return Math.max(10, Math.min(100, baseCleanliness * 0.6 - (baseCongestion > 60 ? 15 : 0)));
      }
      return Math.max(20, Math.min(100, baseCleanliness * 0.8));
    }
  };

  const getHeatColor = (value: number, mode: 'congestion' | 'cleanliness') => {
    if (mode === 'congestion') {
      if (value > 65) return "#DA7B93"; // Bad / Congested (Rose)
      if (value > 40) return "#EED6DC"; // Moderate (Cream)
      return "#376E6F"; // Clear / Flowing (Patina Teal)
    } else {
      if (value > 65) return "#376E6F"; // Clean / Pristine (Patina Teal)
      if (value > 40) return "#EED6DC"; // Moderate (Cream)
      return "#DA7B93"; // Littered / Poor (Rose)
    }
  };

  // Load dynamic config if not in hardcoded list
  useEffect(() => {
    if (!activeCity) return;
    const isPreseeded = ['varanasi', 'jaipur', 'kochi', 'hampi'].includes(activeCity.toLowerCase());
    if (isPreseeded) return;

    async function fetchConfig() {
      try {
        const res = await fetch(`/api/cities/config?city=${encodeURIComponent(activeCity)}`);
        if (res.ok) {
          const config = await res.json();
          setDynamicConfigs(prev => {
            if (prev[activeCity]) return prev;
            return {
              ...prev,
              [activeCity]: config
            };
          });
        }
      } catch (err) {
        console.error("Failed to fetch dynamic config:", err);
      }
    }
    fetchConfig();
  }, [activeCity]);

  // Fetch baseline static details from server whenever active city changes
  useEffect(() => {
    if (!activeCity || !currentCityConfig) return;
    async function loadData() {
      try {
        const [entRes, alertRes, repRes] = await Promise.all([
          fetch(`/api/entrepreneurs?city=${encodeURIComponent(activeCity)}`),
          fetch(`/api/alerts?city=${encodeURIComponent(activeCity)}`),
          fetch(`/api/reports?city=${encodeURIComponent(activeCity)}`)
        ]);
        if (entRes.ok) {
          const list = await entRes.json();
          setEntrepreneurs(list);
          if (list.length > 0) {
            setSelectedEntrepreneurId(list[0].id);
          }
        }
        if (alertRes.ok) setAlerts(await alertRes.json());
        if (repRes.ok) setReports(await repRes.json());
      } catch (err) {
        console.error(`Failed to fetch baseline for ${activeCity}:`, err);
      }
    }
    loadData();

    // Reset local report form options
    if (currentCityConfig.incidentLocations && currentCityConfig.incidentLocations.length > 0) {
      setReportLocation(currentCityConfig.incidentLocations[0]);
    }

    // Reset selected node and filters for interactive map on city change
    setSelectedNode(null);
    setNodeTypeFilter('all');

    // Build city-specific default inputs
    const updatedInputs: PolicyInputs = {
      ...inputs,
      city: activeCity
    };
    setInputs(updatedInputs);
    runSimulation(updatedInputs, true);
  }, [activeCity, currentCityConfig]);

  // GSAP animation for Active City Hero contents on activeCity change
  useEffect(() => {
    if (activeCity) {
      const ctx = gsap.context(() => {
        gsap.fromTo("#active-city-hero > div > *", 
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.65, stagger: 0.1, ease: "power2.out", delay: 0.05 }
        );
      });
      return () => ctx.revert();
    }
  }, [activeCity]);

  // GSAP staggering entrance animation for portfolio thumbnails when Portfolio is selected
  useEffect(() => {
    if (artisanSubTab === "portfolio" && selectedEntrepreneurId) {
      const timer = setTimeout(() => {
        const ctx = gsap.context(() => {
          gsap.fromTo(".artisan-portfolio-item",
            { opacity: 0, y: 25, scale: 0.94 },
            { 
              opacity: 1, 
              y: 0, 
              scale: 1,
              duration: 0.55, 
              stagger: 0.08, 
              ease: "back.out(1.2)",
              clearProps: "all"
            }
          );
        });
        return ctx.revert;
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [artisanSubTab, selectedEntrepreneurId]);

  // Trigger the backend policy simulation
  const runSimulation = async (activeInputs: PolicyInputs, generateBrief: boolean = false) => {
    if (generateBrief) {
      setIsAILoading(true);
    } else {
      setIsSimulating(true);
    }
    try {
      const res = await fetch("/api/scenarios/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...activeInputs, generateBrief })
      });
      if (res.ok) {
        const data = await res.json();
        setMetrics({
          economicDistribution: data.metrics.economicDistribution,
          safetyTrustRating: data.metrics.safetyTrustRating,
          merchantRevenueGrowth: data.metrics.merchantRevenueGrowth,
          complaintsRate: data.metrics.complaintsRate,
          trafficCongestion: data.metrics.trafficCongestion,
          weaverCooperativeIncome: data.metrics.weaverCooperativeIncome,
          ghatCleanliness: data.metrics.ghatCleanliness,
          aiPolicyBrief: data.aiPolicyBrief || metrics.aiPolicyBrief
        });
        setEntrepreneurs(data.entrepreneurs);
      }
    } catch (err) {
      console.error("Failed to run scenario calculation:", err);
    } finally {
      setIsSimulating(false);
      setIsAILoading(false);
    }
  };

  // Trigger simulation dynamically on slider change for instantaneous feedback
  const handleSliderChange = (key: keyof PolicyInputs, value: any) => {
    const updated = {
      ...inputs,
      [key]: value
    };
    setInputs(updated);
    runSimulation(updated, false);

    // Debounce the premium Gemini brief generation by 1.2s to prevent 429 rate limit quota exhaustion
    if (briefDebounceRef.current) {
      clearTimeout(briefDebounceRef.current);
    }
    briefDebounceRef.current = setTimeout(() => {
      runSimulation(updated, true);
    }, 1200);
  };

  // Submit active sliders on click
  const handleSimulateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (briefDebounceRef.current) {
      clearTimeout(briefDebounceRef.current);
    }
    runSimulation(inputs, true);
  };

  // Split-Screen simulation engines
  const runSimulationA = async (activeInputs: PolicyInputs, generateBrief: boolean = false) => {
    setIsSimulatingA(true);
    try {
      const res = await fetch("/api/scenarios/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...activeInputs, generateBrief })
      });
      if (res.ok) {
        const data = await res.json();
        setMetricsA({
          economicDistribution: data.metrics.economicDistribution,
          safetyTrustRating: data.metrics.safetyTrustRating,
          merchantRevenueGrowth: data.metrics.merchantRevenueGrowth,
          complaintsRate: data.metrics.complaintsRate,
          trafficCongestion: data.metrics.trafficCongestion,
          weaverCooperativeIncome: data.metrics.weaverCooperativeIncome,
          ghatCleanliness: data.metrics.ghatCleanliness,
          aiPolicyBrief: data.aiPolicyBrief || metricsA.aiPolicyBrief
        });
      }
    } catch (err) {
      console.error("Failed A simulation:", err);
    } finally {
      setIsSimulatingA(false);
    }
  };

  const runSimulationB = async (activeInputs: PolicyInputs, generateBrief: boolean = false) => {
    setIsSimulatingB(true);
    try {
      const res = await fetch("/api/scenarios/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...activeInputs, generateBrief })
      });
      if (res.ok) {
        const data = await res.json();
        setMetricsB({
          economicDistribution: data.metrics.economicDistribution,
          safetyTrustRating: data.metrics.safetyTrustRating,
          merchantRevenueGrowth: data.metrics.merchantRevenueGrowth,
          complaintsRate: data.metrics.complaintsRate,
          trafficCongestion: data.metrics.trafficCongestion,
          weaverCooperativeIncome: data.metrics.weaverCooperativeIncome,
          ghatCleanliness: data.metrics.ghatCleanliness,
          aiPolicyBrief: data.aiPolicyBrief || metricsB.aiPolicyBrief
        });
      }
    } catch (err) {
      console.error("Failed B simulation:", err);
    } finally {
      setIsSimulatingB(false);
    }
  };

  const handleSliderChangeA = (key: keyof PolicyInputs, value: any) => {
    const updated = {
      ...inputsA,
      [key]: value
    };
    setInputsA(updated);
    runSimulationA(updated, false);
  };

  const handleSliderChangeB = (key: keyof PolicyInputs, value: any) => {
    const updated = {
      ...inputsB,
      [key]: value
    };
    setInputsB(updated);
    runSimulationB(updated, false);
  };

  // Sync split screen when activeCity changes
  useEffect(() => {
    if (!activeCity) return;
    const cityKey = activeCity.toLowerCase();
    const presets = DEFAULT_PRESETS[cityKey] || {
      inputsA: {
        city: activeCity, rickshawSubsidy: 3000, wasteManagementBudget: 120, safetyPatrolIntensity: 4,
        middlemenCommissionCap: 35, standardizedRatesEnabled: false, touristMultiplier: 1.8, weatherHazard: 'low'
      },
      inputsB: {
        city: activeCity, rickshawSubsidy: 8000, wasteManagementBudget: 400, safetyPatrolIntensity: 12,
        middlemenCommissionCap: 15, standardizedRatesEnabled: true, touristMultiplier: 1.2, weatherHazard: 'low'
      }
    };

    setInputsA(presets.inputsA);
    setInputsB(presets.inputsB);

    // Run simulations for both sides to populate initial values
    runSimulationA(presets.inputsA, false);
    runSimulationB(presets.inputsB, false);
  }, [activeCity]);

  // Handle reporting an incident
  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportName || !reportDesc) return;

    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reporterName: reportName,
          incidentType: reportType,
          location: reportLocation,
          description: reportDesc,
          city: activeCity,
          verifiedReceipt: uploadedReceipt
        })
      });

      if (res.ok) {
        setReportSuccess(true);
        // Refresh alert list and report list for active city
        const [alertRes, repRes] = await Promise.all([
          fetch(`/api/alerts?city=${activeCity}`),
          fetch(`/api/reports?city=${activeCity}`)
        ]);
        if (alertRes.ok) setAlerts(await alertRes.json());
        if (repRes.ok) setReports(await repRes.json());

        // Reset fields after delay
        setTimeout(() => {
          setIsReportModalOpen(false);
          setReportSuccess(false);
          setReportName("");
          setReportDesc("");
          setUploadedReceipt(null);
          setExtractionProgress("");
        }, 1500);
      }
    } catch (err) {
      console.error("Failed to file report log:", err);
    }
  };

  // Simulates Gemini Vision OCR extraction on photo receipts
  const triggerReceiptVerification = (receiptData: any) => {
    setIsExtractingReceipt(true);
    setExtractionProgress("🧠 Initiating Gemini Multimodal vision-parse...");
    
    setTimeout(() => {
      setExtractionProgress("🔍 Extracting line items, price ledger, and merchant identifier...");
      
      setTimeout(() => {
        setExtractionProgress("✓ Price database cross-reference completed! Surcharge detected.");
        
        setTimeout(() => {
          setIsExtractingReceipt(false);
          setUploadedReceipt(receiptData);
          setReportDesc(receiptData.auditSummary);
          showToast(`🧾 Gemini OCR verified receipt from ${receiptData.merchantName}! Credibility boosted by +${receiptData.credibilityBoost}%.`);
        }, 600);
      }, 1000);
    }, 1000);
  };

  // Simulates Dialect-Aware Gemini translation twin cataloging
  const triggerVoiceGeneration = (productData: any) => {
    setVoiceGenerating(true);
    setVoiceStep("🎙️ Analyzing native dialect frequencies...");
    
    setTimeout(() => {
      setVoiceStep(`🗣️ Dialect detected. Transcribing core speech...`);
      
      setTimeout(() => {
        setVoiceStep("🧠 Running Gemini Multimodal translation and catalog extract...");
        
        setTimeout(() => {
          setVoiceStep("🌱 Preserving local heritage soul context...");
          
          setTimeout(() => {
            setVoiceGenerating(false);
            setCurrentStorefrontProduct(productData);
            showToast(`🎙️ Standard price-capped product translation ready for ${productData.englishName}!`);
          }, 600);
        }, 1000);
      }, 1000);
    }, 1000);
  };

  // Handle direct inquiry submissions to local cooperative board
  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryName || !inquiryMessage) return;

    setInquirySuccess(true);
    // Reset and close modal after simulated delivery delay
    setTimeout(() => {
      setIsInquiryModalOpen(false);
      setInquirySuccess(false);
      setInquiryName("");
      setInquiryEmail("");
      setInquiryMessage("");
    }, 2000);
  };

  const activeEnt = entrepreneurs.find(e => e.id === selectedEntrepreneurId);

  // Filters entrepreneurs list
  const filteredEntrepreneurs = entrepreneurs.filter((e) => {
    const matchesSearch = e.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          e.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          e.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = hubRoleFilter === "all" || e.role.toLowerCase() === hubRoleFilter.toLowerCase();
    return matchesSearch && matchesRole;
  });

  return (
    <>
      {/* 1. Cinematic Preloader with loaded percentage states */}
      <Preloader onComplete={() => setPreloaderComplete(true)} />

      {/* 2. Magnetic custom pointer cursor with lagging inertia ring */}
      <CustomCursor />

      {preloaderComplete && (
        <div className="h-screen overflow-hidden bg-brand-bg text-slate-100 flex flex-col font-sans selection:bg-brand-rose/25 animate-fade-in" id="app-container">
          
          {/* Elegant Floating Toast Notification */}
          <AnimatePresence>
            {toast && (
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="fixed top-20 right-6 z-50 max-w-sm p-4 rounded-2xl bg-brand-deep/95 border border-brand-teal/20 shadow-2xl backdrop-blur-md flex items-start gap-3"
              >
                <div className={`p-1.5 rounded-lg shrink-0 ${
                  toast.type === "success" 
                    ? "bg-emerald-500/10 text-emerald-400" 
                    : toast.type === "warning" 
                    ? "bg-brand-rose/10 text-brand-rose" 
                    : "bg-brand-teal/10 text-brand-teal"
                }`}>
                  {toast.type === "success" ? (
                    <ShieldCheck className="h-4.5 w-4.5" />
                  ) : toast.type === "warning" ? (
                    <AlertTriangle className="h-4.5 w-4.5" />
                  ) : (
                    <Info className="h-4.5 w-4.5" />
                  )}
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 font-mono block">
                    Ledger Alert
                  </span>
                  <p className="text-[11px] font-semibold text-slate-100 leading-normal">
                    {toast.message}
                  </p>
                </div>
                <button 
                  onClick={() => setToast(null)}
                  className="text-slate-500 hover:text-white transition-colors cursor-pointer shrink-0 ml-1 mt-0.5"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Global Unified Header */}
          <Header 
            activeTab={activeTab} 
            setActiveTab={setActiveTab}
            activeCity={activeCity}
            setActiveCity={(city) => setActiveCity(city)}
            onOpenReportModal={() => setIsReportModalOpen(true)}
            alertsCount={alerts.length}
          />

          {/* Full-Screen 3D Heritage Canvas (Fixed Backdrop on Landing Page) */}
          {activeTab === 'explore' && (
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" id="explore-canvas-backdrop">
              {/* Darkening & Color Grading Overlays for pristine visual contrast */}
              <div className="absolute inset-0 bg-gradient-to-b from-brand-bg/60 via-brand-bg/40 to-brand-bg/95 z-10" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(36,72,85,0.22),transparent_75%)] z-10" />
              {/* Dynamic 3D model frame scaling */}
              <div className={`w-full h-full transition-all duration-700 ${
                backdropVisible 
                  ? "opacity-35 sm:opacity-45 md:opacity-55" 
                  : "opacity-0 pointer-events-none"
              }`}>
                <Heritage3DCanvas scrollRatio={scrollRatio} />
              </div>
            </div>
          )}

          {/* Main Content Area with Custom Inertial Smooth Scroll */}
          <SmoothScroll onScrollRatioChange={setScrollRatio}>
            <div className="flex-1 w-full max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-8 relative z-10">
        
        {/* Hidden SVGs for Gooey & Grainy Noise Filters */}
        <svg width="0" height="0" className="absolute pointer-events-none" style={{ position: 'absolute', zIndex: -50 }}>
          <defs>
            <filter id="gooey-blend-global">
              <feGaussianBlur in="SourceGraphic" stdDeviation="16" result="blur" />
              <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -10" result="goo" />
              <feComposite in="SourceGraphic" in2="goo" operator="atop" />
            </filter>
            <filter id="noise-pattern-global">
              <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
              <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.18 0" />
            </filter>
          </defs>
        </svg>

        {/* Unified Premium Swadeshi Hero Banner with Animated Gooey Blobs & Palette Swatches */}
        <div 
          ref={bannerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative p-8 md:p-12 lg:p-16 rounded-[40px] overflow-hidden bg-[#2F4454] border border-brand-teal/20 text-white shadow-2xl min-h-[460px] flex items-center transition-all duration-500"
          id="active-city-hero"
        >
          {/* Interactive Gooey Blob Background Container */}
          <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_0%,rgba(0,0,0,0.45)_100%)] z-10" />

            <motion.div 
              animate={{ x: mousePos.x, y: mousePos.y }}
              transition={{ type: "spring", damping: 32, stiffness: 65 }}
              className="absolute inset-0 w-full h-full scale-105"
              style={{ filter: "url(#gooey-blend-global)" }}
            >
              <motion.div
                animate={{
                  x: [0, 90, -40, 30, 0],
                  y: [0, -60, 40, -20, 0],
                  scale: [1, 1.25, 0.85, 1.1, 1],
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                className="absolute w-72 h-72 rounded-full bg-[#DA7B93] opacity-80 blur-md"
                style={{ left: "15%", top: "15%" }}
              />

              <motion.div
                animate={{
                  x: [0, -70, 50, -30, 0],
                  y: [0, 50, -80, 40, 0],
                  scale: [1.1, 0.9, 1.15, 1.0, 1.1],
                }}
                transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
                className="absolute w-80 h-80 rounded-full bg-[#376E6F] opacity-75 blur-md"
                style={{ right: "20%", bottom: "10%" }}
              />

              <motion.div
                animate={{
                  x: [0, 50, -30, 40, 0],
                  y: [0, -40, 60, -50, 0],
                  scale: [0.9, 1.15, 0.95, 1.05, 0.9],
                }}
                transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
                className="absolute w-64 h-64 rounded-full bg-[#2E151B] opacity-85 blur-md"
                style={{ left: "40%", top: "30%" }}
              />

              <motion.div
                animate={{
                  x: [0, -50, 60, -20, 0],
                  y: [0, 40, -30, 50, 0],
                  scale: [1, 0.8, 1.1, 0.9, 1],
                }}
                transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
                className="absolute w-64 h-64 rounded-full bg-[#1C3334] opacity-90 blur-md"
                style={{ left: "8%", bottom: "20%" }}
              />

              <motion.div
                animate={{
                  x: [0, -30, 40, -50, 0],
                  y: [0, -50, 30, -20, 0],
                  scale: [0.85, 1.1, 0.9, 1.15, 0.85],
                }}
                transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
                className="absolute w-48 h-48 rounded-full bg-[#DA7B93] opacity-65 blur-md"
                style={{ right: "30%", top: "12%" }}
              />
            </motion.div>

            <div className="absolute inset-0 pointer-events-none opacity-[0.16] mix-blend-overlay z-20">
              <svg width="100%" height="100%">
                <rect width="100%" height="100%" filter="url(#noise-pattern-global)" />
              </svg>
            </div>
          </div>

          {/* Foreground Content Panel */}
          <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Area: Display Text Content */}
            <div className="lg:col-span-9 space-y-6 text-center lg:text-left flex flex-col justify-center h-full">
              <div className="inline-flex self-center lg:self-start items-center gap-1.5 px-3.5 py-1.5 bg-[#1C3334]/70 backdrop-blur rounded-full text-xs font-bold uppercase tracking-wider text-[#DA7B93] border border-[#DA7B93]/20 shadow-md">
                <Compass className="h-4 w-4 text-[#DA7B93] animate-spin" style={{ animationDuration: '8s' }} />
                <span>
                  {currentCityConfig 
                    ? `Destination Corridors: ${currentCityConfig.fullName}` 
                    : "AI-Driven Swadeshi Destination Architect"}
                </span>
              </div>

              <div className="min-h-[140px] sm:min-h-[160px] md:min-h-[190px] flex items-center justify-center lg:justify-start">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeCity ? `${activeCity}-${bannerTextIndex}` : bannerTextIndex}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="space-y-4"
                  >
                    <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-none text-white uppercase drop-shadow-xl select-none font-sans">
                      {activeCity && currentCityConfig
                        ? `${currentCityConfig.fullName}`
                        : CYCLE_TEXTS[bannerTextIndex].main}
                    </h2>
                    <p className="text-xs sm:text-sm font-mono tracking-widest text-[#DA7B93] uppercase font-extrabold drop-shadow flex items-center justify-center lg:justify-start gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#DA7B93] animate-ping shrink-0" />
                      <span>
                        {activeCity && currentCityConfig
                          ? currentCityConfig.tagline
                          : CYCLE_TEXTS[bannerTextIndex].sub}
                      </span>
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
              
              <p className="text-sm md:text-base text-slate-200 leading-relaxed max-w-2xl font-medium drop-shadow-md">
                {currentCityConfig 
                  ? currentCityConfig.description 
                  : "Plan authentic Indian journeys modeled around localized heritage. Specify your target budget and traveling style, and our AI Suggestions Engine will craft custom day-wise itineraries that support genuine municipal artisans and eco-operators."}
              </p>

              {/* Action buttons (3D Space and Reset) */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={() => setBackdropVisible(!backdropVisible)}
                  className={`px-4 py-2.5 rounded-2xl flex items-center gap-2 border shadow-md transition-all duration-300 uppercase font-mono text-xs font-extrabold cursor-pointer active:scale-95 ${
                    backdropVisible 
                      ? "bg-[#376E6F] text-white border-[#376E6F] hover:bg-[#376E6F]/90" 
                      : "bg-[#1C3334]/80 text-slate-300 border-[#376E6F]/25 hover:text-white"
                  }`}
                  id="toggle-3d-backdrop-btn"
                >
                  {backdropVisible ? (
                    <>
                      <EyeOff className="h-4 w-4 text-white" />
                      <span>Hide 3D Space</span>
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 text-[#DA7B93] animate-pulse" />
                      <span>Show 3D Space</span>
                    </>
                  )}
                </button>

                {activeCity && (
                  <button
                    onClick={() => {
                      setActiveCity(null);
                      setActiveTab("explore");
                    }}
                    className="px-4 py-2.5 rounded-2xl bg-[#2E151B] hover:bg-[#2E151B]/80 text-white border border-[#DA7B93]/20 shadow-md text-xs font-mono font-extrabold uppercase transition-all duration-300 active:scale-95 cursor-pointer"
                  >
                    Reset Destination
                  </button>
                )}
              </div>
            </div>

            {/* Right Area: Interactive Side Deck */}
            <div className="lg:col-span-3 flex flex-row lg:flex-col items-center justify-between lg:justify-center gap-6 lg:gap-10 border-t lg:border-t-0 lg:border-l border-white/10 pt-6 lg:pt-0 lg:pl-8">
              
              {/* 1. Custom Dots Slider Indicators */}
              <div className="flex lg:flex-col items-center gap-3">
                {CYCLE_TEXTS.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setBannerTextIndex(idx)}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                      bannerTextIndex === idx 
                        ? "bg-white scale-125 shadow-[0_0_8px_rgba(255,255,255,0.8)]" 
                        : "bg-white/40 hover:bg-white/75"
                    }`}
                    title={`Navigate to slide ${idx + 1}`}
                  />
                ))}
              </div>

              {/* 2. Style Color Palette Swatch Deck */}
              <div className="w-full max-w-[170px] rounded-2xl overflow-hidden border border-white/10 shadow-2xl flex flex-col divide-y divide-white/5">
                {PALETTE_SWATCHES.map((swatch) => (
                  <div 
                    key={swatch.hex}
                    className={`${swatch.color} p-2.5 flex justify-between items-center transition-all duration-300 hover:scale-[1.03] hover:z-10 group relative overflow-hidden`}
                  >
                    {/* Hover Gleam */}
                    <div className="absolute inset-0 bg-white/5 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    
                    <span className="text-[9px] font-mono font-bold tracking-widest text-white/50 group-hover:text-white transition-colors uppercase">
                      {swatch.name}
                    </span>
                    <span className="text-[10px] font-mono font-extrabold tracking-wider text-white/80 group-hover:text-white drop-shadow">
                      {swatch.hex}
                    </span>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>

        {/* MERGED: Real-Time Scenario & Policy Controller (Only when activeCity is selected) */}
        {activeTab === 'explore' && activeCity !== null && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in" id="merged-policy-metrics-console">
            
            {/* Policy sliders card */}
            <div className="lg:col-span-6 bg-brand-dark/45 backdrop-blur-xl p-6 md:p-8 rounded-[32px] border border-brand-teal/15 shadow-2xl space-y-6">
              <div className="border-b border-brand-teal/10 pb-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2 font-display">
                    <Sliders className="h-4.5 w-4.5 text-brand-rose" />
                    Quick Policy Tuner
                  </h3>
                  <span className="text-[9px] font-mono font-bold text-slate-400 bg-brand-deep/80 px-2 py-0.5 rounded border border-brand-teal/10 uppercase">
                    Live Impact
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Calibrate city parameters on-the-fly and observe the simulated values recalculating in real-time.</p>
              </div>

              {/* Quick Policy Presets */}
              <div className="space-y-2 p-3 bg-brand-bg/50 rounded-2xl border border-brand-teal/10">
                <span className="text-[9px] font-extrabold text-brand-rose uppercase tracking-widest block font-mono">
                  Quick Policy Presets
                </span>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      const p = {
                        rickshawSubsidy: 8500,
                        wasteManagementBudget: 400,
                        safetyPatrolIntensity: 8,
                        middlemenCommissionCap: 15,
                        standardizedRatesEnabled: true
                      };
                      setInputs(prev => ({ ...prev, ...p }));
                      runSimulation({ ...inputs, ...p }, true);
                      showToast("Applied 'Grassroots Welfare' Preset. Compiling AI Brief...");
                    }}
                    className="py-1 px-1.5 bg-brand-teal/10 hover:bg-brand-teal/20 text-brand-teal hover:text-white rounded-lg border border-brand-teal/20 text-[9px] font-extrabold uppercase tracking-wide transition-all text-center cursor-pointer active:scale-95 whitespace-nowrap"
                  >
                    Grassroots
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const p = {
                        rickshawSubsidy: 3000,
                        wasteManagementBudget: 150,
                        safetyPatrolIntensity: 4,
                        middlemenCommissionCap: 35,
                        standardizedRatesEnabled: false
                      };
                      setInputs(prev => ({ ...prev, ...p }));
                      runSimulation({ ...inputs, ...p }, true);
                      showToast("Applied 'Tourism Booster' Preset. Compiling AI Brief...");
                    }}
                    className="py-1 px-1.5 bg-brand-rose/10 hover:bg-brand-rose/20 text-brand-rose hover:text-white rounded-lg border border-brand-rose/20 text-[9px] font-extrabold uppercase tracking-wide transition-all text-center cursor-pointer active:scale-95 whitespace-nowrap"
                  >
                    Tourism Max
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const p = {
                        rickshawSubsidy: 5000,
                        wasteManagementBudget: 450,
                        safetyPatrolIntensity: 14,
                        middlemenCommissionCap: 20,
                        standardizedRatesEnabled: true
                      };
                      setInputs(prev => ({ ...prev, ...p }));
                      runSimulation({ ...inputs, ...p }, true);
                      showToast("Applied 'Strict Regulation' Preset. Compiling AI Brief...");
                    }}
                    className="py-1 px-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 hover:text-white rounded-lg border border-emerald-500/20 text-[9px] font-extrabold uppercase tracking-wide transition-all text-center cursor-pointer active:scale-95 whitespace-nowrap"
                  >
                    Strict Audit
                  </button>
                </div>
              </div>

              {/* Sliders layout */}
              <div className="space-y-4">
                {/* Slider 1: Rickshaw Subsidy */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-[10.5px] font-extrabold">
                    <span className="text-slate-300 uppercase tracking-wider">Rickshaw Subsidy</span>
                    <span className="text-brand-rose font-mono">₹{inputs.rickshawSubsidy}/mo</span>
                  </div>
                  <input 
                    type="range"
                    min="1000"
                    max="10000"
                    step="500"
                    value={inputs.rickshawSubsidy}
                    onChange={(e) => handleSliderChange('rickshawSubsidy', parseInt(e.target.value))}
                    className="w-full cursor-pointer h-1 rounded-lg bg-brand-bg accent-brand-rose"
                  />
                </div>

                {/* Slider 2: Middlemen Commission Cap */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-[10.5px] font-extrabold">
                    <span className="text-slate-300 uppercase tracking-wider">Middlemen Commission Cap</span>
                    <span className="text-brand-rose font-mono">{inputs.middlemenCommissionCap}%</span>
                  </div>
                  <input 
                    type="range"
                    min="10"
                    max="50"
                    step="5"
                    value={inputs.middlemenCommissionCap}
                    onChange={(e) => handleSliderChange('middlemenCommissionCap', parseInt(e.target.value))}
                    className="w-full cursor-pointer h-1 rounded-lg bg-brand-bg accent-brand-rose"
                  />
                </div>

                {/* Slider 3: Safety Patrols */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-[10.5px] font-extrabold">
                    <span className="text-slate-300 uppercase tracking-wider">Civic Safety Patrols</span>
                    <span className="text-brand-rose font-mono">Tier {inputs.safetyPatrolIntensity} Intensity</span>
                  </div>
                  <input 
                    type="range"
                    min="1"
                    max="10"
                    step="1"
                    value={inputs.safetyPatrolIntensity}
                    onChange={(e) => handleSliderChange('safetyPatrolIntensity', parseInt(e.target.value))}
                    className="w-full cursor-pointer h-1 rounded-lg bg-brand-bg accent-brand-rose"
                  />
                </div>

                {/* Checkbox Standardized rates */}
                <div className="flex items-center justify-between p-3 bg-brand-bg/30 rounded-xl border border-brand-teal/10">
                  <div className="flex flex-col">
                    <span className="text-[11px] font-extrabold text-slate-200">Standardized Tourist Rate Cards</span>
                    <span className="text-[9px] text-slate-400">Protects travelers from arbitrary commission markups</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSliderChange('standardizedRatesEnabled', !inputs.standardizedRatesEnabled)}
                    className={`px-3 py-1 text-[9px] font-bold rounded-lg transition-all ${
                      inputs.standardizedRatesEnabled 
                        ? "bg-brand-rose text-brand-deep font-extrabold" 
                        : "bg-brand-dark/80 text-slate-400 border border-brand-teal/10"
                    }`}
                  >
                    {inputs.standardizedRatesEnabled ? "ENABLED" : "DISABLED"}
                  </button>
                </div>
              </div>
            </div>

            {/* Impact Metrics Card */}
            <div className="lg:col-span-6 bg-brand-dark/45 backdrop-blur-xl p-6 md:p-8 rounded-[32px] border border-brand-teal/15 shadow-2xl space-y-6">
              <div className="border-b border-brand-teal/10 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2 font-display animate-fade-in">
                    <Activity className="h-4.5 w-4.5 text-brand-rose" />
                    Real-Time Impact Metrics
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-1">Simulated impact of active parameters on {currentCityConfig?.fullName || "heritage city"}'s grassroots economy.</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleExportJSON}
                    className="py-1.5 px-3 bg-brand-teal/10 hover:bg-brand-teal/20 text-brand-teal hover:text-white rounded-xl border border-brand-teal/25 text-[10px] font-extrabold uppercase tracking-widest transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
                    title="Export simulation data as JSON"
                  >
                    <Download className="h-3 w-3 text-brand-teal" />
                    <span>JSON</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleExportPDF}
                    className="py-1.5 px-3 bg-brand-rose/10 hover:bg-brand-rose/20 text-brand-rose hover:text-white rounded-xl border border-brand-rose/25 text-[10px] font-extrabold uppercase tracking-widest transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
                    title="Export simulation brief and metrics as printable PDF"
                  >
                    <FileText className="h-3 w-3 text-brand-rose" />
                    <span>PDF Report</span>
                  </button>
                </div>
              </div>

              {/* Progress bars of metrics */}
              <div className="grid grid-cols-2 gap-4">
                
                {/* Metric 1 */}
                <div className="p-3.5 bg-brand-bg/40 rounded-2xl border border-brand-teal/10 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-mono font-extrabold text-slate-400 uppercase tracking-wider font-semibold">Artisan Income Support</span>
                    <span className="text-xs font-mono font-black text-brand-teal">{metrics.economicDistribution}%</span>
                  </div>
                  <div className="w-full bg-brand-deep/80 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-brand-teal h-full transition-all duration-500" style={{ width: `${metrics.economicDistribution}%` }} />
                  </div>
                </div>

                {/* Metric 2 */}
                <div className="p-3.5 bg-brand-bg/40 rounded-2xl border border-brand-teal/10 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-mono font-extrabold text-slate-400 uppercase tracking-wider font-semibold">Safety & Trust Level</span>
                    <span className="text-xs font-mono font-black text-brand-rose">{metrics.safetyTrustRating}%</span>
                  </div>
                  <div className="w-full bg-brand-deep/80 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-brand-rose h-full transition-all duration-500" style={{ width: `${metrics.safetyTrustRating}%` }} />
                  </div>
                </div>

                {/* Metric 3 */}
                <div className="p-3.5 bg-brand-bg/40 rounded-2xl border border-brand-teal/10 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-mono font-extrabold text-slate-400 uppercase tracking-wider font-semibold">Cooperative Growth</span>
                    <span className="text-xs font-mono font-black text-amber-400">+{metrics.weaverCooperativeIncome}%</span>
                  </div>
                  <div className="w-full bg-brand-deep/80 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-amber-400 h-full transition-all duration-500" style={{ width: `${metrics.weaverCooperativeIncome * 5}%` }} />
                  </div>
                </div>

                {/* Metric 4 */}
                <div className="p-3.5 bg-brand-bg/40 rounded-2xl border border-brand-teal/10 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-mono font-extrabold text-slate-400 uppercase tracking-wider font-semibold">Ghat Cleanliness</span>
                    <span className="text-xs font-mono font-black text-emerald-400">{metrics.ghatCleanliness}%</span>
                  </div>
                  <div className="w-full bg-brand-deep/80 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-400 h-full transition-all duration-500" style={{ width: `${metrics.ghatCleanliness}%` }} />
                  </div>
                </div>

              </div>

              {/* 7-Day Trend Chart */}
              <TrendChart metrics={metrics} activeCity={activeCity || "Varanasi"} />

              {/* Quick simulation status indicator */}
              <div className="p-3 bg-brand-teal/10 border border-brand-teal/20 rounded-2xl flex items-center gap-3">
                <RefreshCw className={`h-4 w-4 text-brand-teal ${isSimulating ? 'animate-spin' : ''}`} />
                <span className="text-[10px] font-mono font-bold text-slate-300">
                  {isSimulating ? "Recalculating algorithmic impact models..." : "Policy simulation model fully synchronized."}
                </span>
              </div>
            </div>

          </div>
        )}

        {/* Tab Selection Row for Quick Mobile view switcher */}
        <div className="lg:hidden flex bg-brand-dark p-1.5 rounded-2xl border border-brand-teal/20 overflow-x-auto gap-1 scrollbar-none">
          <button 
            onClick={() => setActiveTab('explore')} 
            className={`flex-1 px-4 py-3 text-center text-xs font-extrabold rounded-xl transition-all cursor-pointer whitespace-nowrap ${activeTab === 'explore' ? "bg-brand-rose text-brand-deep shadow-sm" : "text-slate-400"}`}
          >
            Explore
          </button>
          <button 
            onClick={() => setActiveTab('dashboard')} 
            className={`flex-1 px-4 py-3 text-center text-xs font-extrabold rounded-xl transition-all cursor-pointer whitespace-nowrap ${activeTab === 'dashboard' ? "bg-brand-rose text-brand-deep shadow-sm" : "text-slate-400"}`}
          >
            Stakeholder
          </button>
          <button 
            onClick={() => setActiveTab('storyteller')} 
            className={`flex-1 px-4 py-3 text-center text-xs font-extrabold rounded-xl transition-all cursor-pointer whitespace-nowrap ${activeTab === 'storyteller' ? "bg-brand-rose text-brand-deep shadow-sm" : "text-slate-400"}`}
          >
            Storyteller
          </button>
          <button 
            onClick={() => setActiveTab('simulator')} 
            className={`flex-1 px-4 py-3 text-center text-xs font-extrabold rounded-xl transition-all cursor-pointer whitespace-nowrap ${activeTab === 'simulator' ? "bg-brand-rose text-brand-deep shadow-sm" : "text-slate-400"}`}
          >
            Simulator
          </button>
          <button 
            onClick={() => setActiveTab('compare')} 
            className={`flex-1 px-4 py-3 text-center text-xs font-extrabold rounded-xl transition-all cursor-pointer whitespace-nowrap ${activeTab === 'compare' ? "bg-brand-rose text-brand-deep shadow-sm" : "text-slate-400"}`}
          >
            Compare
          </button>
          <button 
            onClick={() => setActiveTab('hub')} 
            className={`flex-1 px-4 py-3 text-center text-xs font-extrabold rounded-xl transition-all cursor-pointer whitespace-nowrap ${activeTab === 'hub' ? "bg-brand-rose text-brand-deep shadow-sm" : "text-slate-400"}`}
          >
            Artisans
          </button>
          <button 
            onClick={() => setActiveTab('navigator')} 
            className={`flex-1 px-4 py-3 text-center text-xs font-extrabold rounded-xl transition-all cursor-pointer whitespace-nowrap ${activeTab === 'navigator' ? "bg-brand-rose text-brand-deep shadow-sm" : "text-slate-400"}`}
          >
            Radar Map
          </button>
          <button 
            onClick={() => setActiveTab('feeds')} 
            className={`flex-1 px-4 py-3 text-center text-xs font-extrabold rounded-xl transition-all cursor-pointer whitespace-nowrap ${activeTab === 'feeds' ? "bg-brand-rose text-brand-deep shadow-sm" : "text-slate-400"}`}
          >
            Feeds
          </button>
          <button 
            onClick={() => setActiveTab('alerts')} 
            className={`flex-1 px-4 py-3 text-center text-xs font-extrabold rounded-xl transition-all cursor-pointer whitespace-nowrap ${activeTab === 'alerts' ? "bg-brand-rose text-brand-deep shadow-sm" : "text-slate-400"}`}
          >
            Alerts
          </button>
        </div>

        {/* MAIN BODY GRID CONTAINER */}
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* TAB PANEL: EXPLORE & PLAN LANDING PAGE */}
          {activeTab === 'explore' && (
            <motion.div 
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="lg:col-span-12 w-full"
            >
              <TravelPlanner 
                activeCity={activeCity}
                onCitySelected={(city) => {
                  setActiveCity(city);
                }}
                setActiveTab={setActiveTab}
                activeHazard={inputs.weatherHazard}
                activeAlerts={alerts.map(a => a.message)}
              />
            </motion.div>
          )}

          {/* GUARD: NO DESTINATION SELECTED FOR WORKSPACES */}
          {activeTab !== 'explore' && activeCity === null && (
            <div className="lg:col-span-12 w-full">
              <div className="max-w-2xl mx-auto my-12 bg-brand-dark p-8 md:p-12 rounded-[32px] border border-brand-teal/20 text-center space-y-6 shadow-2xl text-white">
                <div className="w-16 h-16 bg-brand-rose/10 text-brand-rose rounded-full flex items-center justify-center mx-auto border border-brand-rose/20">
                  <MapPin className="h-8 w-8 animate-bounce text-brand-rose" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-white font-display">No Active Heritage Corridor Selected</h3>
                  <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                    You must architect a custom itinerary or activate a municipal heritage corridor before accessing the decision engine, simulator adjustments, or local co-op ledger systems.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                  <button
                    onClick={() => setActiveTab('explore')}
                    className="px-6 py-2.5 bg-brand-rose text-brand-deep rounded-xl text-xs font-extrabold uppercase tracking-wider hover:bg-brand-rose/90 transition-all cursor-pointer shadow-md"
                  >
                    Go to Trip Planner
                  </button>
                  <div className="flex flex-wrap gap-2 justify-center items-center">
                    {['varanasi', 'jaipur', 'kochi', 'hampi'].map((cityId) => {
                      const labels = { varanasi: 'Varanasi', jaipur: 'Jaipur', kochi: 'Kochi', hampi: 'Hampi' };
                      return (
                        <button
                          key={cityId}
                          onClick={() => {
                            setActiveCity(cityId as any);
                          }}
                          className="px-3 py-2 bg-brand-bg hover:bg-brand-bg/85 border border-brand-teal/15 hover:border-brand-rose/50 rounded-xl text-[11px] font-bold text-slate-300 transition-all cursor-pointer"
                        >
                          Activate {labels[cityId as keyof typeof labels]}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB PANEL: SCENARIO COMPARISON */}
          {activeTab === 'compare' && activeCity !== null && (
            <div className="space-y-8 lg:col-span-12 w-full">
              {/* Inner Tab Toggle */}
              <div className="flex justify-center max-w-sm mx-auto bg-brand-dark p-1 rounded-2xl border border-brand-teal/20 shadow-lg text-white">
                <button
                  onClick={() => setCompareMode('scenarios')}
                  className={`flex-1 px-4 py-2 text-center text-[11px] font-extrabold uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    compareMode === 'scenarios' 
                      ? "bg-brand-rose text-brand-deep shadow-md font-black" 
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Sliders className="h-3.5 w-3.5" />
                  Scenario Compare
                </button>
                <button
                  onClick={() => setCompareMode('cities')}
                  className={`flex-1 px-4 py-2 text-center text-[11px] font-extrabold uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    compareMode === 'cities' 
                      ? "bg-brand-rose text-brand-deep shadow-md font-black" 
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <GitCompare className="h-3.5 w-3.5" />
                  Multi-City Compare
                </button>
              </div>

              <motion.div 
                key={compareMode}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="w-full"
              >
                {compareMode === 'scenarios' ? (
                  <ScenarioComparer 
                    activeCity={activeCity}
                    currentInputs={inputs}
                    currentMetrics={metrics}
                    onLoadInputs={(newInputs) => {
                      setInputs(newInputs);
                      runSimulation(newInputs);
                    }}
                  />
                ) : (
                  <MultiCityCompare 
                    currentInputs={inputs}
                    currentMetrics={metrics}
                  />
                )}
              </motion.div>
            </div>
          )}
          
          {/* TAB PANEL: SIMULATOR & POLICY ADJUSTMENT */}
          {(activeTab === 'simulator' || activeTab === 'hub') && activeCity !== null && (
            <motion.div 
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className={`space-y-8 lg:col-span-8 ${activeTab !== 'simulator' ? 'hidden lg:block' : ''}`} 
              id="scenario-control-panel"
            >
              
              {/* Simulator Tab Bar Selector */}
              {activeTab === 'simulator' && (
                <div className="flex gap-2 p-1 bg-brand-deep/60 rounded-2xl border border-brand-teal/15 self-start inline-flex mb-2 select-none">
                  <button
                    onClick={() => setSimulatorSubTab('policy')}
                    className={`px-4 py-2 text-xs font-extrabold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
                      simulatorSubTab === 'policy'
                        ? 'bg-brand-rose text-brand-deep shadow-md font-black'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Sliders className="h-3.5 w-3.5" />
                    <span>Policy Controls</span>
                  </button>
                  <button
                    onClick={() => setSimulatorSubTab('models')}
                    className={`px-4 py-2 text-xs font-extrabold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
                      simulatorSubTab === 'models'
                        ? 'bg-brand-rose text-brand-deep shadow-md font-black'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Brain className="h-3.5 w-3.5" />
                    <span>AI Model Library</span>
                    <span className="text-[8px] font-mono bg-brand-deep text-brand-rose px-1.5 py-0.5 rounded-md border border-brand-rose/20">Modular</span>
                  </button>
                  <button
                    onClick={() => setSimulatorSubTab('split')}
                    className={`px-4 py-2 text-xs font-extrabold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
                      simulatorSubTab === 'split'
                        ? 'bg-brand-rose text-brand-deep shadow-md font-black'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <GitCompare className="h-3.5 w-3.5" />
                    <span>Split-Screen Mode</span>
                    <span className="text-[8px] font-mono bg-brand-deep text-brand-rose px-1.5 py-0.5 rounded-md border border-brand-rose/20">Visual Compare</span>
                  </button>
                </div>
              )}

              {activeTab === 'simulator' && simulatorSubTab === 'models' ? (
                <AIModelLibrary 
                  activeCity={activeCity} 
                  inputs={inputs} 
                  metrics={metrics} 
                />
              ) : activeTab === 'simulator' && simulatorSubTab === 'split' ? (
                /* Split-Screen Mode Side-by-Side Simulation */
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 w-full animate-fade-in" id="split-screen-simulator-mode">
                  
                  {/* LEFT SIMULATION COLUMN (A) */}
                  <div className="bg-brand-dark p-6 rounded-[32px] border border-brand-teal/20 shadow-md space-y-6">
                    {/* Header */}
                    <div className="border-b border-brand-teal/10 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div>
                        <h2 className="text-sm font-extrabold text-white font-display flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-brand-rose animate-ping shrink-0" />
                          Simulation A: Baseline Parameters
                        </h2>
                        <p className="text-[11px] text-slate-400 mt-0.5">Calibrate Left Policy Panel and inspect visual map effects</p>
                      </div>
                      
                      {/* Presets Row */}
                      <div className="flex gap-1 bg-brand-deep/80 p-1 rounded-xl border border-brand-teal/10 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            const p = DEFAULT_PRESETS[activeCity.toLowerCase()]?.inputsA;
                            if (p) {
                              setInputsA(p);
                              runSimulationA(p, false);
                            }
                          }}
                          className="px-2 py-1 text-[9px] font-bold uppercase rounded-md text-slate-300 hover:text-white hover:bg-white/5"
                        >
                          Baseline
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const p = DEFAULT_PRESETS[activeCity.toLowerCase()]?.inputsB;
                            if (p) {
                              setInputsA(p);
                              runSimulationA(p, false);
                            }
                          }}
                          className="px-2 py-1 text-[9px] font-bold uppercase rounded-md text-slate-300 hover:text-white hover:bg-white/5"
                        >
                          Swadeshi
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setInputsA(inputs);
                            runSimulationA(inputs, false);
                          }}
                          className="px-2 py-1 text-[9px] font-bold uppercase rounded-md text-brand-rose bg-brand-rose/10"
                        >
                          Sync Main
                        </button>
                      </div>
                    </div>

                    {/* Sliders Block */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-brand-deep/30 p-4 rounded-2xl border border-brand-teal/10">
                      {/* Rickshaw Subsidy */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-[10px] font-bold">
                          <span className="text-slate-300 uppercase tracking-wider">EV Subsidy</span>
                          <span className="text-brand-rose font-mono text-[11px]">₹{inputsA.rickshawSubsidy}</span>
                        </div>
                        <input 
                          type="range" min="1000" max="10000" step="500"
                          value={inputsA.rickshawSubsidy}
                          onChange={(e) => handleSliderChangeA('rickshawSubsidy', parseInt(e.target.value))}
                          className="w-full cursor-pointer h-1 rounded bg-brand-bg accent-brand-rose"
                        />
                      </div>

                      {/* Preservation Budget */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-[10px] font-bold">
                          <span className="text-slate-300 uppercase tracking-wider">Preservation Budget</span>
                          <span className="text-brand-rose font-mono text-[11px]">₹{inputsA.wasteManagementBudget} L</span>
                        </div>
                        <input 
                          type="range" min="50" max="500" step="10"
                          value={inputsA.wasteManagementBudget}
                          onChange={(e) => handleSliderChangeA('wasteManagementBudget', parseInt(e.target.value))}
                          className="w-full cursor-pointer h-1 rounded bg-brand-bg accent-brand-rose"
                        />
                      </div>

                      {/* Safety Patrols */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-[10px] font-bold">
                          <span className="text-slate-300 uppercase tracking-wider">Safety Patrols</span>
                          <span className="text-brand-rose font-mono text-[11px]">Tier {inputsA.safetyPatrolIntensity}</span>
                        </div>
                        <input 
                          type="range" min="1" max="20" step="1"
                          value={inputsA.safetyPatrolIntensity}
                          onChange={(e) => handleSliderChangeA('safetyPatrolIntensity', parseInt(e.target.value))}
                          className="w-full cursor-pointer h-1 rounded bg-brand-bg accent-brand-rose"
                        />
                      </div>

                      {/* Commission Cap */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-[10px] font-bold">
                          <span className="text-slate-300 uppercase tracking-wider">Commission Cap</span>
                          <span className="text-brand-rose font-mono text-[11px]">{inputsA.middlemenCommissionCap}%</span>
                        </div>
                        <input 
                          type="range" min="5" max="50" step="5"
                          value={inputsA.middlemenCommissionCap}
                          onChange={(e) => handleSliderChangeA('middlemenCommissionCap', parseInt(e.target.value))}
                          className="w-full cursor-pointer h-1 rounded bg-brand-bg accent-brand-rose"
                        />
                      </div>

                      {/* Standardized Rates Fare Toggle */}
                      <div className="flex items-center justify-between p-2 bg-brand-bg/40 rounded-xl border border-brand-teal/5 col-span-1 md:col-span-2">
                        <span className="text-[10px] font-extrabold text-slate-200 uppercase tracking-wider">Standardized Rate Registry</span>
                        <button
                          type="button"
                          onClick={() => handleSliderChangeA('standardizedRatesEnabled', !inputsA.standardizedRatesEnabled)}
                          className={`px-3 py-1 text-[9px] font-black rounded-lg transition-all ${
                            inputsA.standardizedRatesEnabled 
                              ? "bg-brand-rose text-brand-deep font-extrabold" 
                              : "bg-brand-dark/80 text-slate-400 border border-brand-teal/10"
                          }`}
                        >
                          {inputsA.standardizedRatesEnabled ? "ENABLED" : "DISABLED"}
                        </button>
                      </div>

                      {/* Weather Hazard Select */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 block uppercase">Weather Hazard</span>
                        <div className="grid grid-cols-3 gap-1">
                          {(['low', 'medium', 'high'] as const).map((lvl) => (
                            <button
                              key={lvl}
                              type="button"
                              onClick={() => handleSliderChangeA('weatherHazard', lvl)}
                              className={`py-1 text-[9px] font-extrabold rounded-lg border transition-all uppercase cursor-pointer ${
                                inputsA.weatherHazard === lvl
                                  ? "bg-brand-rose text-brand-deep border-transparent shadow-md"
                                  : "bg-brand-bg text-slate-300 border-brand-teal/20 hover:bg-brand-bg/80"
                              }`}
                            >
                              {lvl}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Tourist Multiplier */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-[10px] font-bold">
                          <span className="text-slate-300 uppercase">Tourist Volume</span>
                          <span className="text-brand-rose font-mono text-[11px]">{inputsA.touristMultiplier}x</span>
                        </div>
                        <input 
                          type="range" min="0.5" max="3.0" step="0.5"
                          value={inputsA.touristMultiplier}
                          onChange={(e) => handleSliderChangeA('touristMultiplier', parseFloat(e.target.value))}
                          className="w-full cursor-pointer h-1 rounded bg-brand-bg accent-brand-rose"
                        />
                      </div>
                    </div>

                    {/* Compact Metrics Grid */}
                    <div className="bg-brand-deep/40 p-4 rounded-2xl border border-brand-teal/10 space-y-3">
                      <div className="flex justify-between items-center border-b border-brand-teal/5 pb-2">
                        <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">Simulated Outcomes (A)</span>
                        {isSimulatingA && <span className="text-[9px] font-mono text-brand-rose animate-pulse">Recalculating...</span>}
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        {/* Metric 1 */}
                        <div className="p-2.5 bg-brand-bg/40 rounded-xl border border-brand-teal/5 space-y-1">
                          <div className="flex justify-between text-[9px] font-bold text-slate-400">
                            <span>Artisan Income</span>
                            <span className="text-brand-teal font-mono">{metricsA.economicDistribution}%</span>
                          </div>
                          <div className="w-full bg-brand-dark h-1 rounded-full overflow-hidden">
                            <div className="bg-brand-teal h-full transition-all duration-500" style={{ width: `${metricsA.economicDistribution}%` }} />
                          </div>
                        </div>

                        {/* Metric 2 */}
                        <div className="p-2.5 bg-brand-bg/40 rounded-xl border border-brand-teal/5 space-y-1">
                          <div className="flex justify-between text-[9px] font-bold text-slate-400">
                            <span>Safety & Trust</span>
                            <span className="text-brand-rose font-mono">{metricsA.safetyTrustRating}%</span>
                          </div>
                          <div className="w-full bg-brand-dark h-1 rounded-full overflow-hidden">
                            <div className="bg-brand-rose h-full transition-all duration-500" style={{ width: `${metricsA.safetyTrustRating}%` }} />
                          </div>
                        </div>

                        {/* Metric 3 */}
                        <div className="p-2.5 bg-brand-bg/40 rounded-xl border border-brand-teal/5 space-y-1">
                          <div className="flex justify-between text-[9px] font-bold text-slate-400">
                            <span>Co-op Growth</span>
                            <span className="text-amber-400 font-mono">+{metricsA.weaverCooperativeIncome}%</span>
                          </div>
                          <div className="w-full bg-brand-dark h-1 rounded-full overflow-hidden">
                            <div className="bg-amber-400 h-full transition-all duration-500" style={{ width: `${metricsA.weaverCooperativeIncome * 5}%` }} />
                          </div>
                        </div>

                        {/* Metric 4 */}
                        <div className="p-2.5 bg-brand-bg/40 rounded-xl border border-brand-teal/5 space-y-1">
                          <div className="flex justify-between text-[9px] font-bold text-slate-400">
                            <span>Cleanliness</span>
                            <span className="text-emerald-400 font-mono">{metricsA.ghatCleanliness}%</span>
                          </div>
                          <div className="w-full bg-brand-dark h-1 rounded-full overflow-hidden">
                            <div className="bg-emerald-400 h-full transition-all duration-500" style={{ width: `${metricsA.ghatCleanliness}%` }} />
                          </div>
                        </div>

                        {/* Metric 5 */}
                        <div className="p-2.5 bg-brand-bg/40 rounded-xl border border-brand-teal/5 space-y-1 col-span-2">
                          <div className="flex justify-between text-[9px] font-bold text-slate-400">
                            <span>Traffic Delay</span>
                            <span className="text-red-400 font-mono">{metricsA.trafficCongestion}%</span>
                          </div>
                          <div className="w-full bg-brand-dark h-1 rounded-full overflow-hidden">
                            <div className="bg-red-400 h-full transition-all duration-500" style={{ width: `${metricsA.trafficCongestion}%` }} />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* COMPACT MINI IMPACT MAP */}
                    <div className="bg-brand-deep/80 p-4 rounded-2xl border border-brand-teal/20 relative aspect-[16/10] overflow-hidden flex flex-col justify-between text-white select-none">
                      <div className="absolute inset-0 bg-[linear-gradient(to_right,#376e6f_1px,transparent_1px),linear-gradient(to_bottom,#376e6f_1px,transparent_1px)] bg-[size:16px_16px] opacity-10 pointer-events-none" />
                      <div className="absolute top-2 left-2 z-10 bg-brand-dark/95 border border-brand-teal/20 px-2 py-0.5 rounded text-[8px] font-mono uppercase text-slate-300">
                        Visual Impact (A)
                      </div>

                      {/* River waterway (Only Varanasi, Kochi, Hampi) */}
                      {activeCity !== 'jaipur' && (
                        <svg className="absolute bottom-0 inset-x-0 h-1/2 w-full pointer-events-none opacity-20">
                          <path 
                            d="M 0 50 Q 150 20 350 60 T 700 40 L 700 300 L 0 300 Z" 
                            className={`transition-all duration-1000 ${inputsA.weatherHazard === 'high' ? 'fill-brand-rose' : 'fill-brand-teal'}`}
                          />
                        </svg>
                      )}

                      {/* Connective paths */}
                      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
                        {currentCityConfig.scenicRoutes.map((route, i) => (
                          <line 
                            key={`route-split-a-${i}`}
                            x1={route.x1} y1={route.y1} x2={route.x2} y2={route.y2} 
                            stroke="#376e6f" strokeWidth="1.5" strokeDasharray="3 3" 
                          />
                        ))}
                      </svg>

                      {/* Miniature nodes */}
                      {currentCityConfig.scenicNodes.map((node, i) => {
                        const localHeatVal = getNodeMetricA(node.name, 'congestion');
                        const isHighCongestion = localHeatVal > 65;
                        const isHighClean = getNodeMetricA(node.name, 'cleanliness') > 70;
                        
                        let nodeColor = "bg-[#376E6F]/80 border-[#376E6F] text-slate-200";
                        if (isHighCongestion) {
                          nodeColor = "bg-[#DA7B93] border-[#DA7B93] text-white animate-pulse";
                        } else if (isHighClean) {
                          nodeColor = "bg-emerald-500 border-emerald-500 text-white";
                        }

                        return (
                          <motion.div 
                            key={`node-a-${activeCity || "varanasi"}-${i}`}
                            className="absolute flex flex-col items-center group"
                            style={{ top: node.y, left: node.x, transform: 'translate(-50%, -50%)' }}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ 
                              scale: [0, 1.3, 0.9, 1.1, 1], 
                              opacity: 1 
                            }}
                            transition={{ 
                              duration: 0.9,
                              ease: "easeInOut",
                              delay: i * 0.05,
                            }}
                          >
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center text-[7px] ${nodeColor} shadow-md`}>
                              {node.iconType === 'transit' ? "🚘" : node.iconType === 'coop' ? "📦" : "📍"}
                            </div>
                            <span className="text-[7px] font-black text-slate-200 bg-brand-dark/95 px-1 rounded border border-brand-teal/5 mt-0.5 whitespace-nowrap text-center max-w-[50px] overflow-hidden truncate">
                              {node.name.split(' ')[0]}
                            </span>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>

                  {/* RIGHT SIMULATION COLUMN (B) */}
                  <div className="bg-brand-dark p-6 rounded-[32px] border border-brand-teal/20 shadow-md space-y-6">
                    {/* Header */}
                    <div className="border-b border-brand-teal/10 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div>
                        <h2 className="text-sm font-extrabold text-white font-display flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-brand-teal animate-ping shrink-0" />
                          Simulation B: Alternative Parameters
                        </h2>
                        <p className="text-[11px] text-slate-400 mt-0.5">Calibrate Right Policy Panel and inspect visual map effects</p>
                      </div>
                      
                      {/* Presets Row */}
                      <div className="flex gap-1 bg-brand-deep/80 p-1 rounded-xl border border-brand-teal/10 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            const p = DEFAULT_PRESETS[activeCity.toLowerCase()]?.inputsA;
                            if (p) {
                              setInputsB(p);
                              runSimulationB(p, false);
                            }
                          }}
                          className="px-2 py-1 text-[9px] font-bold uppercase rounded-md text-slate-300 hover:text-white hover:bg-white/5"
                        >
                          Baseline
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const p = DEFAULT_PRESETS[activeCity.toLowerCase()]?.inputsB;
                            if (p) {
                              setInputsB(p);
                              runSimulationB(p, false);
                            }
                          }}
                          className="px-2 py-1 text-[9px] font-bold uppercase rounded-md text-slate-300 hover:text-white hover:bg-white/5"
                        >
                          Swadeshi
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setInputsB(inputs);
                            runSimulationB(inputs, false);
                          }}
                          className="px-2 py-1 text-[9px] font-bold uppercase rounded-md text-brand-rose bg-brand-rose/10"
                        >
                          Sync Main
                        </button>
                      </div>
                    </div>

                    {/* Sliders Block */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-brand-deep/30 p-4 rounded-2xl border border-brand-teal/10">
                      {/* Rickshaw Subsidy */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-[10px] font-bold">
                          <span className="text-slate-300 uppercase tracking-wider">EV Subsidy</span>
                          <span className="text-brand-rose font-mono text-[11px]">₹{inputsB.rickshawSubsidy}</span>
                        </div>
                        <input 
                          type="range" min="1000" max="10000" step="500"
                          value={inputsB.rickshawSubsidy}
                          onChange={(e) => handleSliderChangeB('rickshawSubsidy', parseInt(e.target.value))}
                          className="w-full cursor-pointer h-1 rounded bg-brand-bg accent-brand-rose"
                        />
                      </div>

                      {/* Preservation Budget */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-[10px] font-bold">
                          <span className="text-slate-300 uppercase tracking-wider">Preservation Budget</span>
                          <span className="text-brand-rose font-mono text-[11px]">₹{inputsB.wasteManagementBudget} L</span>
                        </div>
                        <input 
                          type="range" min="50" max="500" step="10"
                          value={inputsB.wasteManagementBudget}
                          onChange={(e) => handleSliderChangeB('wasteManagementBudget', parseInt(e.target.value))}
                          className="w-full cursor-pointer h-1 rounded bg-brand-bg accent-brand-rose"
                        />
                      </div>

                      {/* Safety Patrols */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-[10px] font-bold">
                          <span className="text-slate-300 uppercase tracking-wider">Safety Patrols</span>
                          <span className="text-brand-rose font-mono text-[11px]">Tier {inputsB.safetyPatrolIntensity}</span>
                        </div>
                        <input 
                          type="range" min="1" max="20" step="1"
                          value={inputsB.safetyPatrolIntensity}
                          onChange={(e) => handleSliderChangeB('safetyPatrolIntensity', parseInt(e.target.value))}
                          className="w-full cursor-pointer h-1 rounded bg-brand-bg accent-brand-rose"
                        />
                      </div>

                      {/* Commission Cap */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-[10px] font-bold">
                          <span className="text-slate-300 uppercase tracking-wider">Commission Cap</span>
                          <span className="text-brand-rose font-mono text-[11px]">{inputsB.middlemenCommissionCap}%</span>
                        </div>
                        <input 
                          type="range" min="5" max="50" step="5"
                          value={inputsB.middlemenCommissionCap}
                          onChange={(e) => handleSliderChangeB('middlemenCommissionCap', parseInt(e.target.value))}
                          className="w-full cursor-pointer h-1 rounded bg-brand-bg accent-brand-rose"
                        />
                      </div>

                      {/* Standardized Rates Fare Toggle */}
                      <div className="flex items-center justify-between p-2 bg-brand-bg/40 rounded-xl border border-brand-teal/5 col-span-1 md:col-span-2">
                        <span className="text-[10px] font-extrabold text-slate-200 uppercase tracking-wider">Standardized Rate Registry</span>
                        <button
                          type="button"
                          onClick={() => handleSliderChangeB('standardizedRatesEnabled', !inputsB.standardizedRatesEnabled)}
                          className={`px-3 py-1 text-[9px] font-black rounded-lg transition-all ${
                            inputsB.standardizedRatesEnabled 
                              ? "bg-brand-teal text-brand-deep font-extrabold" 
                              : "bg-brand-dark/80 text-slate-400 border border-brand-teal/10"
                          }`}
                        >
                          {inputsB.standardizedRatesEnabled ? "ENABLED" : "DISABLED"}
                        </button>
                      </div>

                      {/* Weather Hazard Select */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 block uppercase">Weather Hazard</span>
                        <div className="grid grid-cols-3 gap-1">
                          {(['low', 'medium', 'high'] as const).map((lvl) => (
                            <button
                              key={lvl}
                              type="button"
                              onClick={() => handleSliderChangeB('weatherHazard', lvl)}
                              className={`py-1 text-[9px] font-extrabold rounded-lg border transition-all uppercase cursor-pointer ${
                                inputsB.weatherHazard === lvl
                                  ? "bg-brand-rose text-brand-deep border-transparent shadow-md"
                                  : "bg-brand-bg text-slate-300 border-brand-teal/20 hover:bg-brand-bg/80"
                              }`}
                            >
                              {lvl}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Tourist Multiplier */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-[10px] font-bold">
                          <span className="text-slate-300 uppercase">Tourist Volume</span>
                          <span className="text-brand-rose font-mono text-[11px]">{inputsB.touristMultiplier}x</span>
                        </div>
                        <input 
                          type="range" min="0.5" max="3.0" step="0.5"
                          value={inputsB.touristMultiplier}
                          onChange={(e) => handleSliderChangeB('touristMultiplier', parseFloat(e.target.value))}
                          className="w-full cursor-pointer h-1 rounded bg-brand-bg accent-brand-rose"
                        />
                      </div>
                    </div>

                    {/* Compact Metrics Grid */}
                    <div className="bg-brand-deep/40 p-4 rounded-2xl border border-brand-teal/10 space-y-3">
                      <div className="flex justify-between items-center border-b border-brand-teal/5 pb-2">
                        <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">Simulated Outcomes (B)</span>
                        {isSimulatingB && <span className="text-[9px] font-mono text-brand-teal animate-pulse">Recalculating...</span>}
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        {/* Metric 1 */}
                        <div className="p-2.5 bg-brand-bg/40 rounded-xl border border-brand-teal/5 space-y-1">
                          <div className="flex justify-between text-[9px] font-bold text-slate-400">
                            <span>Artisan Income</span>
                            <span className="text-brand-teal font-mono">{metricsB.economicDistribution}%</span>
                          </div>
                          <div className="w-full bg-brand-dark h-1 rounded-full overflow-hidden">
                            <div className="bg-brand-teal h-full transition-all duration-500" style={{ width: `${metricsB.economicDistribution}%` }} />
                          </div>
                        </div>

                        {/* Metric 2 */}
                        <div className="p-2.5 bg-brand-bg/40 rounded-xl border border-brand-teal/5 space-y-1">
                          <div className="flex justify-between text-[9px] font-bold text-slate-400">
                            <span>Safety & Trust</span>
                            <span className="text-brand-rose font-mono">{metricsB.safetyTrustRating}%</span>
                          </div>
                          <div className="w-full bg-brand-dark h-1 rounded-full overflow-hidden">
                            <div className="bg-brand-rose h-full transition-all duration-500" style={{ width: `${metricsB.safetyTrustRating}%` }} />
                          </div>
                        </div>

                        {/* Metric 3 */}
                        <div className="p-2.5 bg-brand-bg/40 rounded-xl border border-brand-teal/5 space-y-1">
                          <div className="flex justify-between text-[9px] font-bold text-slate-400">
                            <span>Co-op Growth</span>
                            <span className="text-amber-400 font-mono">+{metricsB.weaverCooperativeIncome}%</span>
                          </div>
                          <div className="w-full bg-brand-dark h-1 rounded-full overflow-hidden">
                            <div className="bg-amber-400 h-full transition-all duration-500" style={{ width: `${metricsB.weaverCooperativeIncome * 5}%` }} />
                          </div>
                        </div>

                        {/* Metric 4 */}
                        <div className="p-2.5 bg-brand-bg/40 rounded-xl border border-brand-teal/5 space-y-1">
                          <div className="flex justify-between text-[9px] font-bold text-slate-400">
                            <span>Cleanliness</span>
                            <span className="text-emerald-400 font-mono">{metricsB.ghatCleanliness}%</span>
                          </div>
                          <div className="w-full bg-brand-dark h-1 rounded-full overflow-hidden">
                            <div className="bg-emerald-400 h-full transition-all duration-500" style={{ width: `${metricsB.ghatCleanliness}%` }} />
                          </div>
                        </div>

                        {/* Metric 5 */}
                        <div className="p-2.5 bg-brand-bg/40 rounded-xl border border-brand-teal/5 space-y-1 col-span-2">
                          <div className="flex justify-between text-[9px] font-bold text-slate-400">
                            <span>Traffic Delay</span>
                            <span className="text-red-400 font-mono">{metricsB.trafficCongestion}%</span>
                          </div>
                          <div className="w-full bg-brand-dark h-1 rounded-full overflow-hidden">
                            <div className="bg-red-400 h-full transition-all duration-500" style={{ width: `${metricsB.trafficCongestion}%` }} />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* COMPACT MINI IMPACT MAP */}
                    <div className="bg-brand-deep/80 p-4 rounded-2xl border border-brand-teal/20 relative aspect-[16/10] overflow-hidden flex flex-col justify-between text-white select-none">
                      <div className="absolute inset-0 bg-[linear-gradient(to_right,#376e6f_1px,transparent_1px),linear-gradient(to_bottom,#376e6f_1px,transparent_1px)] bg-[size:16px_16px] opacity-10 pointer-events-none" />
                      <div className="absolute top-2 left-2 z-10 bg-brand-dark/95 border border-brand-teal/20 px-2 py-0.5 rounded text-[8px] font-mono uppercase text-slate-300">
                        Visual Impact (B)
                      </div>

                      {/* River waterway (Only Varanasi, Kochi, Hampi) */}
                      {activeCity !== 'jaipur' && (
                        <svg className="absolute bottom-0 inset-x-0 h-1/2 w-full pointer-events-none opacity-20">
                          <path 
                            d="M 0 50 Q 150 20 350 60 T 700 40 L 700 300 L 0 300 Z" 
                            className={`transition-all duration-1000 ${inputsB.weatherHazard === 'high' ? 'fill-brand-rose' : 'fill-brand-teal'}`}
                          />
                        </svg>
                      )}

                      {/* Connective paths */}
                      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
                        {currentCityConfig.scenicRoutes.map((route, i) => (
                          <line 
                            key={`route-split-b-${i}`}
                            x1={route.x1} y1={route.y1} x2={route.x2} y2={route.y2} 
                            stroke="#376e6f" strokeWidth="1.5" strokeDasharray="3 3" 
                          />
                        ))}
                      </svg>

                      {/* Miniature nodes */}
                      {currentCityConfig.scenicNodes.map((node, i) => {
                        const localHeatVal = getNodeMetricB(node.name, 'congestion');
                        const isHighCongestion = localHeatVal > 65;
                        const isHighClean = getNodeMetricB(node.name, 'cleanliness') > 70;
                        
                        let nodeColor = "bg-[#376E6F]/80 border-[#376E6F] text-slate-200";
                        if (isHighCongestion) {
                          nodeColor = "bg-[#DA7B93] border-[#DA7B93] text-white animate-pulse";
                        } else if (isHighClean) {
                          nodeColor = "bg-emerald-500 border-emerald-500 text-white";
                        }

                        return (
                          <motion.div 
                            key={`node-b-${activeCity || "varanasi"}-${i}`}
                            className="absolute flex flex-col items-center group"
                            style={{ top: node.y, left: node.x, transform: 'translate(-50%, -50%)' }}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ 
                              scale: [0, 1.3, 0.9, 1.1, 1], 
                              opacity: 1 
                            }}
                            transition={{ 
                              duration: 0.9,
                              ease: "easeInOut",
                              delay: i * 0.05,
                            }}
                          >
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center text-[7px] ${nodeColor} shadow-md`}>
                              {node.iconType === 'transit' ? "🚘" : node.iconType === 'coop' ? "📦" : "📍"}
                            </div>
                            <span className="text-[7px] font-black text-slate-200 bg-brand-dark/95 px-1 rounded border border-brand-teal/5 mt-0.5 whitespace-nowrap text-center max-w-[50px] overflow-hidden truncate">
                              {node.name.split(' ')[0]}
                            </span>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                /* Simulator Dual Layout */
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                  
                  {/* Left Side Policy Controls */}
                  <div className="bg-brand-dark p-6 rounded-[32px] border border-brand-teal/20 shadow-md md:col-span-5 space-y-6">
                    <div className="border-b border-brand-teal/10 pb-4">
                      <h2 className="text-sm font-extrabold text-white font-display flex items-center gap-2">
                        <Layers className="h-4.5 w-4.5 text-brand-rose" />
                        Active Scenario Controls
                      </h2>
                      <p className="text-[11px] text-slate-400 mt-0.5">Drag to change simulated metrics immediately</p>
                    </div>

                    {/* Quick Policy Presets */}
                    <div className="space-y-2 p-3 bg-brand-bg/50 rounded-2xl border border-brand-teal/10">
                      <span className="text-[9px] font-extrabold text-brand-rose uppercase tracking-widest block font-mono">
                        Quick Policy Presets
                      </span>
                      <div className="grid grid-cols-3 gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            const p = {
                              rickshawSubsidy: 8500,
                              wasteManagementBudget: 400,
                              safetyPatrolIntensity: 8,
                              middlemenCommissionCap: 15,
                              standardizedRatesEnabled: true
                            };
                            setInputs(prev => ({ ...prev, ...p }));
                            runSimulation({ ...inputs, ...p }, true);
                            showToast("Applied 'Grassroots Welfare' Preset. Compiling AI Brief...");
                          }}
                          className="py-1 px-1.5 bg-brand-teal/10 hover:bg-brand-teal/20 text-brand-teal hover:text-white rounded-lg border border-brand-teal/20 text-[9px] font-extrabold uppercase tracking-wide transition-all text-center cursor-pointer active:scale-95 whitespace-nowrap"
                        >
                          Grassroots
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const p = {
                              rickshawSubsidy: 3000,
                              wasteManagementBudget: 150,
                              safetyPatrolIntensity: 4,
                              middlemenCommissionCap: 35,
                              standardizedRatesEnabled: false
                            };
                            setInputs(prev => ({ ...prev, ...p }));
                            runSimulation({ ...inputs, ...p }, true);
                            showToast("Applied 'Tourism Booster' Preset. Compiling AI Brief...");
                          }}
                          className="py-1 px-1.5 bg-brand-rose/10 hover:bg-brand-rose/20 text-brand-rose hover:text-white rounded-lg border border-brand-rose/20 text-[9px] font-extrabold uppercase tracking-wide transition-all text-center cursor-pointer active:scale-95 whitespace-nowrap"
                        >
                          Tourism Max
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const p = {
                              rickshawSubsidy: 5000,
                              wasteManagementBudget: 450,
                              safetyPatrolIntensity: 14,
                              middlemenCommissionCap: 20,
                              standardizedRatesEnabled: true
                            };
                            setInputs(prev => ({ ...prev, ...p }));
                            runSimulation({ ...inputs, ...p }, true);
                            showToast("Applied 'Strict Regulation' Preset. Compiling AI Brief...");
                          }}
                          className="py-1 px-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 hover:text-white rounded-lg border border-emerald-500/20 text-[9px] font-extrabold uppercase tracking-wide transition-all text-center cursor-pointer active:scale-95 whitespace-nowrap"
                        >
                          Strict Audit
                        </button>
                      </div>
                    </div>

                    <form onSubmit={handleSimulateSubmit} className="space-y-5">
                      
                      {/* Slider 1: Electric Vehicle Subsidy */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-[11px] font-bold">
                          <span className="text-slate-300 uppercase tracking-wider flex items-center gap-1">
                            <DollarSign className="h-3 w-3 text-brand-teal" />
                            Eco-Vehicle Subsidy
                          </span>
                          <span className="text-brand-rose font-mono">₹{inputs.rickshawSubsidy}/mo</span>
                        </div>
                        <input 
                          type="range"
                          min="1000"
                          max="10000"
                          step="500"
                          value={inputs.rickshawSubsidy}
                          onChange={(e) => handleSliderChange('rickshawSubsidy', parseInt(e.target.value))}
                          className="w-full cursor-pointer h-1.5 rounded-lg bg-brand-bg accent-brand-rose"
                        />
                        <span className="text-[9px] text-slate-400 block leading-tight">Monthly battery support per driver. Raising this triggers higher driver incomes but raises street traffic densities.</span>
                      </div>

                      {/* Slider 2: River Shore/Bazaar Preservation Budget */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-[11px] font-bold">
                          <span className="text-slate-300 uppercase tracking-wider flex items-center gap-1">
                            <Waves className="h-3 w-3 text-brand-teal" />
                            Preservation Budget
                          </span>
                          <span className="text-brand-rose font-mono">₹{inputs.wasteManagementBudget} L/mo</span>
                        </div>
                        <input 
                          type="range"
                          min="50"
                          max="500"
                          step="10"
                          value={inputs.wasteManagementBudget}
                          onChange={(e) => handleSliderChange('wasteManagementBudget', parseInt(e.target.value))}
                          className="w-full cursor-pointer h-1.5 rounded-lg bg-brand-bg accent-brand-rose"
                        />
                        <span className="text-[9px] text-slate-400 block leading-tight">Waste management budget in Lakhs. Fuels cleaning crew sweeps and sanitation ratings.</span>
                      </div>

                      {/* Slider 3: Safety Guard patrolling force */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-[11px] font-bold">
                          <span className="text-slate-300 uppercase tracking-wider flex items-center gap-1">
                            <Shield className="h-3 w-3 text-brand-teal" />
                            Safety Patrols
                          </span>
                          <span className="text-brand-rose font-mono">{inputs.safetyPatrolIntensity} Force/Ward</span>
                        </div>
                        <input 
                          type="range"
                          min="1"
                          max="20"
                          step="1"
                          value={inputs.safetyPatrolIntensity}
                          onChange={(e) => handleSliderChange('safetyPatrolIntensity', parseInt(e.target.value))}
                          className="w-full cursor-pointer h-1.5 rounded-lg bg-brand-bg accent-brand-rose"
                        />
                        <span className="text-[9px] text-slate-400 block leading-tight">Daily patrol presence. Highly suppresses tourist scam complaints but increases state oversight friction.</span>
                      </div>

                      {/* Slider 4: Saree Middleman Commission cap */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-[11px] font-bold">
                          <span className="text-slate-300 uppercase tracking-wider flex items-center gap-1">
                            <Briefcase className="h-3 w-3 text-brand-teal" />
                            Middlemen Commission Cap
                          </span>
                          <span className="text-brand-rose font-mono">{inputs.middlemenCommissionCap}% Max</span>
                        </div>
                        <input 
                          type="range"
                          min="5"
                          max="50"
                          step="5"
                          value={inputs.middlemenCommissionCap}
                          onChange={(e) => handleSliderChange('middlemenCommissionCap', parseInt(e.target.value))}
                          className="w-full cursor-pointer h-1.5 rounded-lg bg-brand-bg accent-brand-rose"
                        />
                        <span className="text-[9px] text-slate-400 block leading-tight">Maximum commission brokers are allowed to pocket from weavers or potters. Lower values directly enrich craftsmen.</span>
                      </div>

                      {/* Checkbox: Standardized rates card registry */}
                      <div className="flex items-start gap-3 p-3 bg-brand-bg/50 rounded-2xl border border-brand-teal/15 hover:border-brand-teal/30 transition-all">
                        <input 
                          type="checkbox"
                          checked={inputs.standardizedRatesEnabled}
                          onChange={(e) => handleSliderChange('standardizedRatesEnabled', e.target.checked)}
                          className="mt-1 h-4 w-4 text-brand-rose border-brand-teal/30 rounded focus:ring-brand-rose cursor-pointer"
                          id="standard-rates-input"
                        />
                        <div className="flex flex-col">
                          <label htmlFor="standard-rates-input" className="text-[11px] font-extrabold text-slate-200 cursor-pointer">
                            Standardized Fare Registry
                          </label>
                          <span className="text-[9px] text-slate-400 mt-0.5 leading-tight">
                            Locks boat rides, camel tours, and shuttle fees. Drives massive traveler trust, but limits high-season peak earnings.
                          </span>
                        </div>
                      </div>

                      {/* Environment variables (Monsoon/Heat / Tourist crowds) */}
                      <div className="border-t border-brand-teal/10 pt-4 space-y-4">
                        <span className="text-[10px] font-extrabold text-brand-rose uppercase tracking-widest block font-mono">
                          Active Environmental Stress
                        </span>

                        {/* Hazard Select */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 block uppercase">{currentCityConfig.environmentalHazardLabel}</label>
                          <div className="grid grid-cols-3 gap-2">
                            {(['low', 'medium', 'high'] as const).map((lvl) => (
                              <button
                                key={lvl}
                                type="button"
                                onClick={() => handleSliderChange('weatherHazard', lvl)}
                                className={`py-2 text-[10px] font-extrabold rounded-xl border transition-all uppercase cursor-pointer ${
                                  inputs.weatherHazard === lvl
                                    ? "bg-brand-rose text-brand-deep border-transparent shadow-md"
                                    : "bg-brand-bg text-slate-300 border-brand-teal/20 hover:bg-brand-bg/80"
                                }`}
                              >
                                {lvl}
                              </button>
                            ))}
                          </div>
                          <span className="text-[9px] text-slate-400 leading-tight block pt-1">{currentCityConfig.environmentalHazardDesc}</span>
                        </div>

                        {/* Tourist Crowd Multiplier */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-center text-[10px] font-bold">
                            <span className="text-slate-300 uppercase">Tourist Volume Multiplier</span>
                            <span className="text-brand-rose font-mono">{inputs.touristMultiplier}x Volume</span>
                          </div>
                          <input 
                            type="range"
                            min="0.5"
                            max="3.0"
                            step="0.5"
                            value={inputs.touristMultiplier}
                            onChange={(e) => handleSliderChange('touristMultiplier', parseFloat(e.target.value))}
                            className="w-full cursor-pointer h-1.5 rounded-lg bg-brand-bg accent-brand-rose"
                          />
                          <span className="text-[9px] text-slate-400 block leading-tight">Crowd density. Higher multipliers raise merchant revenues but severely increase lane congestion.</span>
                        </div>

                        {/* Active Emergency Directives Panel */}
                        <div className="space-y-2 border-t border-brand-teal/10 pt-4">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-extrabold text-brand-rose uppercase tracking-widest block font-mono">
                              Active Emergency Directives
                            </span>
                            <span className="text-[9px] font-mono text-slate-400 bg-brand-bg px-1.5 py-0.5 rounded border border-brand-teal/20">
                              Cost: ₹{
                                (((inputs.activeDirectives || []).includes('pumping_crews') ? 50 : 0) +
                                 ((inputs.activeDirectives || []).includes('hydration_booths') ? 30 : 0) +
                                 ((inputs.activeDirectives || []).includes('tidal_barriers') ? 40 : 0) +
                                 ((inputs.activeDirectives || []).includes('anti_scam_squads') ? 25 : 0))
                              }L / mo
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            {[
                              { id: 'pumping_crews', label: 'Pumping Crews', cost: '₹50L', tooltip: 'Mitigates flood suspension of boatmen/coracles', cities: ['varanasi', 'hampi'] },
                              { id: 'hydration_booths', label: 'Hydration Booths', cost: '₹30L', tooltip: 'Mitigates extreme heatwave suspension of puppeteers', cities: ['jaipur'] },
                              { id: 'tidal_barriers', label: 'Tidal Barriers', cost: '₹40L', tooltip: 'Mitigates high tide suspension of net fishermen', cities: ['kochi'] },
                              { id: 'anti_scam_squads', label: 'Anti-scam Squad', cost: '₹25L', tooltip: 'Drastically cuts complaints & safety stress across all wards', cities: ['varanasi', 'jaipur', 'kochi', 'hampi'] }
                            ].map((directive) => {
                              const isRelevant = directive.cities.includes(inputs.city);
                              const isActive = (inputs.activeDirectives || []).includes(directive.id);
                              return (
                                <button
                                  key={directive.id}
                                  type="button"
                                  onClick={() => {
                                    const current = inputs.activeDirectives || [];
                                    const updated = current.includes(directive.id)
                                      ? current.filter(d => d !== directive.id)
                                      : [...current, directive.id];
                                    handleSliderChange('activeDirectives', updated);
                                  }}
                                  className={`p-2.5 rounded-xl border text-left transition-all relative group cursor-pointer ${
                                    isActive
                                      ? "bg-brand-rose/20 text-brand-rose border-brand-rose shadow-sm"
                                      : isRelevant
                                        ? "bg-brand-bg/60 text-slate-200 border-brand-teal/30 hover:border-brand-teal/60"
                                        : "bg-brand-bg/30 text-slate-500 border-brand-teal/10 hover:border-brand-teal/30 opacity-60"
                                  }`}
                                >
                                  <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black tracking-tight block truncate">{directive.label}</span>
                                    <span className="text-[8px] font-mono opacity-80">{directive.cost}</span>
                                  </div>
                                  <span className="text-[7.5px] leading-snug text-slate-400 block pt-1 line-clamp-2">
                                    {directive.tooltip}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                      </div>

                    </form>
                  </div>

                  {/* Right Side Simulated Metrics Grid & Brief */}
                  <div className="md:col-span-7 space-y-8">
                    
                    {/* Performance Indicators */}
                    <div className="bg-brand-dark p-6 rounded-[32px] text-white shadow-xl space-y-6 border border-brand-teal/20">
                      <div className="flex justify-between items-center border-b border-brand-teal/10 pb-3">
                        <div>
                          <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-300 font-mono">Civic Health Indexes</h2>
                          <p className="text-[10px] text-slate-500 mt-0.5">Calculated state of {currentCityConfig.fullName} metrics</p>
                        </div>
                        {isSimulating && (
                          <div className="flex items-center gap-1 text-[9px] text-brand-rose font-mono">
                            <RefreshCw className="h-3 w-3 animate-spin" />
                            Calculating...
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        
                        {/* Metric 1: Capital Sharing Index */}
                        <div className="p-4 bg-brand-bg/50 rounded-2xl border border-brand-teal/10 flex flex-col justify-between space-y-2">
                          <span className="text-[9px] font-mono font-extrabold text-slate-400 uppercase tracking-wider block">Livelihood capital share</span>
                          <div className="flex items-baseline gap-1 pt-1">
                            <span className="text-2xl font-extrabold text-white font-mono">{metrics.economicDistribution}%</span>
                            <span className="text-[9px] font-bold text-brand-rose">Direct wallet share</span>
                          </div>
                          <div className="w-full bg-brand-bg h-1.5 rounded-full overflow-hidden">
                            <div 
                              className="bg-brand-rose h-full rounded-full transition-all duration-700 shadow-[0_0_8px_rgba(218,123,147,0.4)]" 
                              style={{ width: `${metrics.economicDistribution}%` }} 
                            />
                          </div>
                        </div>

                        {/* Metric 2: Safety Trust rating */}
                        <div className="p-4 bg-brand-bg/50 rounded-2xl border border-brand-teal/10 flex flex-col justify-between space-y-2">
                          <span className="text-[9px] font-mono font-extrabold text-slate-400 uppercase tracking-wider block">Visitor Safety Trust</span>
                          <div className="flex items-baseline gap-1 pt-1">
                            <span className="text-2xl font-extrabold text-white font-mono">{metrics.safetyTrustRating}/100</span>
                            <span className="text-[9px] font-bold text-brand-teal">Pristine Safety</span>
                          </div>
                          <div className="w-full bg-brand-bg h-1.5 rounded-full overflow-hidden">
                            <div 
                              className="bg-brand-teal h-full rounded-full transition-all duration-700 shadow-[0_0_8px_rgba(55,110,111,0.4)]" 
                              style={{ width: `${metrics.safetyTrustRating}%` }} 
                            />
                          </div>
                        </div>

                        {/* Metric 3: Merchant Growth */}
                        <div className="p-4 bg-brand-bg/50 rounded-2xl border border-brand-teal/10 flex flex-col justify-between space-y-2">
                          <span className="text-[9px] font-mono font-extrabold text-slate-400 uppercase tracking-wider block">Merchant Growth Rate</span>
                          <div className="flex items-baseline gap-1 pt-1">
                            <span className={`text-2xl font-extrabold font-mono ${metrics.merchantRevenueGrowth >= 0 ? 'text-brand-teal' : 'text-brand-rose'}`}>
                              {metrics.merchantRevenueGrowth >= 0 ? `+${metrics.merchantRevenueGrowth}%` : `${metrics.merchantRevenueGrowth}%`}
                            </span>
                            <span className="text-[9px] text-slate-500">Year-on-Year</span>
                          </div>
                          <div className="w-full bg-brand-bg h-1.5 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-700 ${metrics.merchantRevenueGrowth >= 0 ? 'bg-brand-teal shadow-[0_0_8px_rgba(55,110,111,0.4)]' : 'bg-brand-rose shadow-[0_0_8px_rgba(218,123,147,0.4)]'}`}
                              style={{ width: `${Math.min(100, Math.max(0, metrics.merchantRevenueGrowth + 20))}%` }} 
                            />
                          </div>
                        </div>

                        {/* Metric 4: Traffic Congestion */}
                        <div className="p-4 bg-brand-bg/50 rounded-2xl border border-brand-teal/10 flex flex-col justify-between space-y-2">
                          <span className="text-[9px] font-mono font-extrabold text-slate-400 uppercase tracking-wider block">{currentCityConfig.congestionLabel}</span>
                          <div className="flex items-baseline gap-1 pt-1">
                            <span className={`text-2xl font-extrabold font-mono ${metrics.trafficCongestion > 75 ? 'text-brand-rose' : 'text-slate-300'}`}>
                              {metrics.trafficCongestion}%
                            </span>
                            <span className="text-[9px] text-slate-500">Lanes flow delay</span>
                          </div>
                          <div className="w-full bg-brand-bg h-1.5 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-700 ${metrics.trafficCongestion > 75 ? 'bg-brand-rose shadow-[0_0_8px_rgba(218,123,147,0.4)]' : 'bg-brand-teal/50'}`}
                              style={{ width: `${metrics.trafficCongestion}%` }} 
                            />
                          </div>
                        </div>

                        {/* Metric 5: Cooperative Income */}
                        <div className="p-4 bg-brand-bg/50 rounded-2xl border border-brand-teal/10 flex flex-col justify-between space-y-2 col-span-2">
                          <div className="flex justify-between items-center">
                            <span className="text-[9px] font-mono font-extrabold text-slate-400 uppercase tracking-wider block">{currentCityConfig.coopLabel}</span>
                            <span className="text-[10px] text-brand-teal font-bold font-mono">+{metrics.weaverCooperativeIncome}% YoY Growth</span>
                          </div>
                          <div className="w-full bg-brand-bg h-2 rounded-full overflow-hidden mt-1.5">
                            <div 
                              className="bg-brand-rose h-full rounded-full transition-all duration-700 shadow-[0_0_8px_rgba(218,123,147,0.4)]" 
                              style={{ width: `${Math.min(100, metrics.weaverCooperativeIncome * 2)}%` }} 
                            />
                          </div>
                        </div>

                        {/* Metric 6: Ghat/Corridor Cleanliness */}
                        <div className="p-4 bg-brand-bg/50 rounded-2xl border border-brand-teal/10 flex flex-col justify-between space-y-2 col-span-2">
                          <div className="flex justify-between items-center">
                            <span className="text-[9px] font-mono font-extrabold text-slate-400 uppercase tracking-wider block">{currentCityConfig.sanitationLabel}</span>
                            <span className="text-[10px] text-brand-teal font-bold font-mono">{metrics.ghatCleanliness}% Cleanliness</span>
                          </div>
                          <div className="w-full bg-brand-bg h-2 rounded-full overflow-hidden mt-1.5">
                            <div 
                              className="bg-brand-teal h-full rounded-full transition-all duration-700 shadow-[0_0_8px_rgba(55,110,111,0.4)]" 
                              style={{ width: `${metrics.ghatCleanliness}%` }} 
                            />
                          </div>
                        </div>

                      </div>
                    </div>

                    {/* Strategic Outlook Text Field - Gemini AI integration */}
                    <div className="bg-brand-dark p-6 rounded-[32px] border border-brand-teal/20 shadow-sm space-y-4" id="simulation-brief-section">
                      <div className="flex items-center justify-between border-b border-brand-teal/10 pb-3">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-lg bg-brand-rose/10 text-brand-rose">
                            <Sparkles className="h-4 w-4" />
                          </div>
                          <h3 className="text-xs font-extrabold uppercase tracking-widest text-white block font-display">
                            Strategic Policy Briefing
                          </h3>
                        </div>
                        <span className="text-[9px] font-mono font-extrabold text-brand-rose uppercase tracking-widest bg-brand-deep px-2 py-0.5 rounded border border-brand-rose/20 flex items-center gap-1.5">
                          {isAILoading && <RefreshCw className="h-2.5 w-2.5 animate-spin text-brand-rose" />}
                          {isAILoading ? "Synthesizing..." : "Gemini 3.5 Active"}
                        </span>
                      </div>

                      <div className="text-xs text-slate-300 leading-relaxed space-y-3 font-medium">
                        {metrics.aiPolicyBrief ? (
                          <div className="prose prose-invert max-w-none text-[11px] space-y-3">
                            {/* Parse simple markdown linebreaks cleanly without react-markdown crashes */}
                            {metrics.aiPolicyBrief.split('\n\n').map((para, i) => {
                              if (para.startsWith('###') || para.startsWith('**')) {
                                return <h4 key={i} className="font-extrabold text-brand-rose text-xs mt-3">{para.replace(/###|\*\*/g, '').trim()}</h4>;
                              }
                              return <p key={i} className="leading-relaxed text-slate-300">{para.replace(/\*\*/g, '')}</p>;
                            })}
                          </div>
                        ) : (
                          <div className="py-6 text-center text-slate-400 space-y-2">
                            <RefreshCw className="h-5 w-5 animate-spin mx-auto text-brand-rose" />
                            <p>Synthesizing strategic directives for {currentCityConfig.fullName}...</p>
                          </div>
                        )}
                      </div>
                    </div>

                  </div>

                </div>
              )}

            </motion.div>
          )}

          {/* TAB PANEL: MICROPRENEUR HUB (COOPERATIVE LEDGER) */}
          {(activeTab === 'simulator' || activeTab === 'hub') && activeCity !== null && (
            <motion.div 
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className={`space-y-8 lg:col-span-4 ${activeTab !== 'hub' ? 'hidden lg:block' : ''}`} 
              id="entrepreneur-hub-panel"
            >
              
              <div className="bg-brand-dark p-6 rounded-[32px] border border-brand-teal/20 shadow-md space-y-6">
                
                {/* Header title */}
                <div className="border-b border-brand-teal/10 pb-4 flex justify-between items-center">
                  <div>
                    <h2 className="text-sm font-extrabold text-white font-display flex items-center gap-2">
                      <Users className="h-4.5 w-4.5 text-brand-rose" />
                      Heritage MicroPreneur Hub
                    </h2>
                    <p className="text-[11px] text-slate-400 mt-0.5">Audit verified ledger earnings and cooperatives</p>
                  </div>
                </div>

                {/* Search & Filters */}
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-brand-teal" />
                    <input 
                      type="text"
                      placeholder="Search artisan or union..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-brand-bg border border-brand-teal/10 rounded-xl text-xs font-semibold focus:outline-none focus:border-brand-teal/35 text-white"
                    />
                  </div>
                  
                  <select
                    value={hubRoleFilter}
                    onChange={(e) => setHubRoleFilter(e.target.value)}
                    className="px-3 py-2 bg-brand-bg border border-brand-teal/10 rounded-xl text-xs font-bold text-slate-300 focus:outline-none cursor-pointer"
                  >
                    <option value="all" className="bg-brand-dark">All Roles</option>
                    <option value="weaver" className="bg-brand-dark">Artisans</option>
                    <option value="boatman" className="bg-brand-dark">Operators / Boatmen</option>
                    <option value="e-rickshaw driver" className="bg-brand-dark">Eco Drivers</option>
                    <option value="toy maker" className="bg-brand-dark">Craft Creators</option>
                  </select>
                </div>

                {/* Entrepreneurs list */}
                <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                  {filteredEntrepreneurs.length > 0 ? (
                    filteredEntrepreneurs.map((ent) => {
                      const isSelected = selectedEntrepreneurId === ent.id;
                      return (
                        <div
                          key={ent.id}
                          onClick={() => setSelectedEntrepreneurId(ent.id)}
                          className={`p-3.5 rounded-2xl border flex items-center gap-3 cursor-pointer transition-all ${
                            isSelected 
                              ? "bg-brand-rose border-brand-rose text-brand-deep shadow-md" 
                              : "bg-brand-bg hover:bg-brand-bg/80 border-brand-teal/10 text-white"
                          }`}
                        >
                          <ArtisanAvatar 
                            src={ent.avatar} 
                            name={ent.name} 
                            className="w-10 h-10 rounded-xl"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-baseline">
                              <h4 className="text-xs font-extrabold truncate">{ent.name}</h4>
                              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${isSelected ? "bg-brand-deep text-brand-rose" : "bg-brand-deep/50 text-slate-300"}`}>
                                {ent.role}
                              </span>
                            </div>
                            <p className={`text-[10px] mt-0.5 truncate ${isSelected ? "text-brand-deep/80" : "text-slate-400"}`}>
                              {ent.cooperativeName}
                            </p>
                          </div>
                          
                          <div className="text-right">
                            <span className="text-xs font-extrabold font-mono block">₹{ent.dailyIncome}</span>
                            <span className={`text-[8px] font-bold block ${isSelected ? "text-brand-deep/80" : "text-brand-teal"}`}>
                              / day
                            </span>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8 text-slate-400 text-xs">
                      No heritage entrepreneurs match search criteria.
                    </div>
                  )}
                </div>

                {/* Audit Details Area */}
                <div className="border-t border-brand-teal/10 pt-5 space-y-4">
                  <span className="text-[10px] font-extrabold text-brand-rose uppercase tracking-widest block font-mono">
                    Artisan Audit Profile Verification
                  </span>

                  {activeEnt ? (
                    <div className="p-4 bg-brand-bg/50 rounded-2xl border border-brand-teal/20 space-y-3.5 animate-fade-in text-slate-300">
                      
                      <div className="flex items-center gap-3">
                        <ArtisanAvatar 
                          src={activeEnt.avatar} 
                          name={activeEnt.name} 
                          className="w-11 h-11 rounded-xl border border-brand-teal/10"
                        />
                        <div>
                          <h4 className="text-xs font-extrabold text-white">{activeEnt.name}</h4>
                          <span className="text-[9px] font-mono text-brand-teal block">{activeEnt.location}</span>
                        </div>
                      </div>

                      <p className="text-[11px] leading-relaxed italic text-slate-300 bg-brand-dark p-2.5 rounded-xl border border-brand-teal/10">
                        "{activeEnt.bio}"
                      </p>

                      {/* Sliding Sub-tab Switcher */}
                      <div className="flex bg-brand-dark p-1 rounded-xl border border-brand-teal/10 gap-1" id="artisan-sub-tabs">
                        <button
                          type="button"
                          onClick={() => setArtisanSubTab('audit')}
                          className={`flex-1 py-1.5 text-[9px] font-extrabold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                            artisanSubTab === 'audit'
                              ? 'bg-brand-rose text-brand-deep shadow-sm'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          📋 Ledger
                        </button>
                        <button
                          type="button"
                          onClick={() => setArtisanSubTab('portfolio')}
                          className={`flex-1 py-1.5 text-[9px] font-extrabold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                            artisanSubTab === 'portfolio'
                              ? 'bg-brand-rose text-brand-deep shadow-sm'
                              : 'text-slate-400 hover:text-white'
                          }`}
                          id="artisan-portfolio-tab-btn"
                        >
                          🎨 Portfolio
                        </button>
                        <button
                          type="button"
                          onClick={() => setArtisanSubTab('storefront')}
                          className={`flex-1 py-1.5 text-[9px] font-extrabold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                            artisanSubTab === 'storefront'
                              ? 'bg-brand-rose text-brand-deep shadow-sm'
                              : 'text-slate-400 hover:text-white'
                          }`}
                          id="artisan-storefront-tab-btn"
                        >
                          🎙️ Voice Twin
                        </button>
                      </div>

                      {artisanSubTab === 'audit' ? (
                        <div className="space-y-3.5 animate-fade-in">
                          <div className="grid grid-cols-2 gap-2 text-[10px] font-bold">
                            <div className="p-2 bg-brand-dark rounded-xl border border-brand-teal/10">
                              <span className="text-[9px] text-slate-400 uppercase tracking-wide block">Cooperative Ledger</span>
                              <span className="text-white block truncate mt-0.5">{activeEnt.cooperativeName}</span>
                            </div>
                            <div className="p-2 bg-brand-dark rounded-xl border border-brand-teal/10">
                              <span className="text-[9px] text-slate-400 uppercase tracking-wide block">Income Multiplier</span>
                              <span className="text-brand-rose block mt-0.5 font-mono">
                                {((activeEnt.dailyIncome / activeEnt.baseIncome)).toFixed(2)}x baseline
                              </span>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400 block">
                              Policy Status Impact Report
                            </span>
                            <div className="p-3 bg-brand-dark rounded-xl border border-brand-teal/15 border-l-2 border-l-brand-rose text-[11px] leading-relaxed font-semibold text-slate-200 flex items-start gap-2">
                              <Info className="h-4 w-4 text-brand-rose shrink-0 mt-0.5" />
                              <span>{activeEnt.impactStatus}</span>
                            </div>
                          </div>

                          <div className="border-t border-brand-teal/10 pt-4 space-y-3" id="artisan-sentiment-gauge">
                            <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400 block font-mono">
                              Union Registry Trust Sentiment
                            </span>
                            <div className="p-3 bg-brand-dark rounded-2xl border border-brand-teal/10 flex items-center gap-4">
                              {/* Radial Progress Bar SVG */}
                              <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
                                <svg className="w-full h-full -rotate-90">
                                  {/* Background track */}
                                  <circle
                                    cx="28"
                                    cy="28"
                                    r="22"
                                    fill="transparent"
                                    stroke="#111827"
                                    strokeWidth="4"
                                  />
                                  {/* Color coded progress track */}
                                  <circle
                                    cx="28"
                                    cy="28"
                                    r="22"
                                    fill="transparent"
                                    stroke={
                                      activeEnt.trustScore >= 90
                                        ? "#10b981"
                                        : activeEnt.trustScore >= 75
                                        ? "#376e6f"
                                        : activeEnt.trustScore >= 50
                                        ? "#f59e0b"
                                        : "#da7b93"
                                    }
                                    strokeWidth="4"
                                    strokeDasharray="138.2"
                                    strokeDashoffset={138.2 - (138.2 * activeEnt.trustScore) / 100}
                                    strokeLinecap="round"
                                    className="transition-all duration-1000 ease-out"
                                  />
                                </svg>
                                {/* Center percentage text */}
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                  <span className="text-[10px] font-black font-mono text-white leading-none">
                                    {activeEnt.trustScore}%
                                  </span>
                                  <span className="text-[6px] font-bold text-slate-400 mt-0.5 tracking-wider uppercase">
                                    TRUST
                                  </span>
                                </div>
                              </div>

                              {/* Sentiment Description Panel */}
                              <div className="space-y-1 flex-1">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[9px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                                    Status:
                                  </span>
                                  <span className={`text-[10px] font-black uppercase tracking-widest ${
                                    activeEnt.trustScore >= 90
                                      ? "text-emerald-400"
                                      : activeEnt.trustScore >= 75
                                      ? "text-brand-teal"
                                      : activeEnt.trustScore >= 50
                                      ? "text-amber-400"
                                      : "text-brand-rose"
                                  }`}>
                                    {activeEnt.trustScore >= 90
                                      ? "Exceptional"
                                      : activeEnt.trustScore >= 75
                                      ? "High Trust"
                                      : activeEnt.trustScore >= 50
                                      ? "Fair"
                                      : "Vulnerable"}
                                  </span>
                                </div>
                                <p className="text-[10px] text-slate-400 leading-normal font-semibold">
                                  Ledger verified, showing {
                                    activeEnt.trustScore >= 90
                                      ? "pristine compliance with municipal pricing registries and exceptional traveler feedback."
                                      : activeEnt.trustScore >= 75
                                      ? "high compliance with municipal pricing rules and positive verified ledger reviews."
                                      : activeEnt.trustScore >= 50
                                      ? "satisfactory compliance records with minor local pricing deviations logged."
                                      : "critical compliance warning alerts and active pricing infractions filed on the Swadeshi ledger."
                                  }
                                </p>
                              </div>
                            </div>

                            {/* Direct Audit Actions */}
                            <div className="flex gap-2 pt-1">
                              <button
                                type="button"
                                onClick={() => {
                                  setReportName("Registry Auditor");
                                  setReportLocation(activeEnt.location);
                                  setReportType("Overcharging");
                                  setReportDesc(`Audited price deviation logged for ${activeEnt.name} of ${activeEnt.cooperativeName}.`);
                                  setIsReportModalOpen(true);
                                }}
                                className="flex-1 py-2 px-3 bg-brand-rose/10 hover:bg-brand-rose/25 text-brand-rose hover:text-white border border-brand-rose/20 hover:border-brand-rose/40 rounded-xl text-[9px] font-extrabold uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
                              >
                                <ShieldAlert className="h-3 w-3 shrink-0 text-brand-rose" />
                                <span>Flag Infraction</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setEntrepreneurs(prev => prev.map(ent => {
                                    if (ent.id === activeEnt.id) {
                                      const oldScore = ent.trustScore;
                                      const newScore = Math.min(100, oldScore + 10);
                                      if (newScore > oldScore) {
                                        showToast(`🌟 Approved Trust Commendation for ${ent.name}! Score is now ${newScore}%.`);
                                      } else {
                                        showToast(`✅ ${ent.name} is already at peak 100% Verified Trust!`);
                                      }
                                      return {
                                        ...ent,
                                        trustScore: newScore
                                      };
                                    }
                                    return ent;
                                  }));
                                }}
                                className="flex-1 py-2 px-3 bg-emerald-500/10 hover:bg-emerald-500/25 text-emerald-400 hover:text-emerald-300 border border-emerald-500/20 hover:border-emerald-500/40 rounded-xl text-[9px] font-extrabold uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
                              >
                                <Check className="h-3 w-3 shrink-0 text-emerald-400" />
                                <span>Commend Ledger</span>
                              </button>
                            </div>

                          </div>
                        </div>
                      ) : artisanSubTab === 'portfolio' ? (
                        <div className="space-y-4 animate-fade-in" id="artisan-portfolio-view">
                          <div className="flex justify-between items-center">
                            <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400 block">
                              AI-Generated Masterworks
                            </span>
                            <span className="text-[8px] font-bold text-brand-teal bg-brand-teal/10 px-1.5 py-0.5 rounded border border-brand-teal/20 font-mono">
                              High-Resolution
                            </span>
                          </div>

                          {/* Portfolio Grid/Scroll */}
                          <div className="space-y-3.5 max-h-[290px] overflow-y-auto pr-1" id="artisan-portfolio-scroll">
                            {(ARTISAN_PORTFOLIOS[activeEnt.id] || []).map((item) => (
                              <div key={item.id} className="artisan-portfolio-item p-2.5 bg-brand-dark rounded-2xl border border-brand-teal/10 hover:border-brand-rose/25 transition-all duration-300 group/item flex flex-col gap-2">
                                <div className="relative aspect-video rounded-xl overflow-hidden border border-white/5 bg-brand-bg">
                                  <img 
                                    src={item.image} 
                                    alt={item.title} 
                                    referrerPolicy="no-referrer"
                                    className="w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-500"
                                  />
                                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-brand-dark/95 text-brand-rose text-[8px] font-bold border border-brand-rose/35 font-mono shadow-sm">
                                    {item.authenticityGrade}
                                  </div>
                                </div>
                                <div>
                                  <h5 className="text-[11px] font-extrabold text-white group-hover/item:text-brand-rose transition-colors">{item.title}</h5>
                                  <p className="text-[10px] text-slate-400 mt-1 leading-relaxed font-semibold">{item.description}</p>
                                </div>
                                
                                <div className="mt-1 pt-2 border-t border-white/5 text-[9px] font-mono text-slate-400 bg-brand-bg/55 p-2 rounded-xl border border-brand-teal/5">
                                  <span className="text-brand-teal font-extrabold text-[8px] block uppercase mb-1 tracking-wider">AI Prompt Configuration:</span>
                                  <span className="italic leading-normal block text-slate-300">"{item.aiPromptUsed}"</span>
                                </div>
                              </div>
                            ))}
                            {(ARTISAN_PORTFOLIOS[activeEnt.id] || []).length === 0 && (
                              <div className="text-center py-6 text-slate-400 text-xs">
                                No portfolio items registered for this micro-entrepreneur.
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4 animate-fade-in text-slate-300" id="artisan-storefront-view">
                          <div className="flex justify-between items-center">
                            <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400 block">
                              🎙️ Dialect Voice Storefront Twin
                            </span>
                            <span className="text-[8px] font-bold text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20 font-mono">
                              {activeCity === "varanasi" ? "Bhojpuri" : activeCity === "jaipur" ? "Marwari" : activeCity === "kochi" ? "Malayalam" : "Kannada"} Dialect
                            </span>
                          </div>

                          {!currentStorefrontProduct && !voiceGenerating && (
                            <div className="space-y-3.5">
                              <p className="text-[10px] text-slate-400 leading-relaxed font-semibold">
                                Micro-entrepreneurs can record speech in their native dialect. Gemini parses the pricing ledger and crafts localized digital catalogs.
                              </p>

                              {/* Sample audio clips to trigger */}
                              <div className="space-y-2">
                                <span className="text-[8px] font-extrabold tracking-widest uppercase text-brand-teal block font-mono">
                                  Select Native Speech Entry to Catalog:
                                </span>

                                <div className="grid grid-cols-1 gap-2">
                                  {activeCity === 'varanasi' ? (
                                    <>
                                      <button
                                        type="button"
                                        onClick={() => triggerVoiceGeneration({
                                          id: "saree_1",
                                          dialectSpeech: "हमार हथकरघा साड़ी असली रेशम से बनल बा, कीमत ₹6,500",
                                          englishName: "Exquisite Handspun Banarasi Silk Saree",
                                          extractedPrice: 6500,
                                          heritageContext: "Handcrafted using pure Katan silk filaments sourced from small-scale local hand-reeled yarn farms, woven with copper-alloy zari. This preserves the 400-year-old traditional family loom guild structure of Madanpura.",
                                          translations: {
                                            English: "A majestic heirloom-grade pure Banarasi silk saree, boasting intricate traditional motifs woven over twelve days on a local family handloom. Fully compliance audited at standard local tariff cap.",
                                            Japanese: "伝統的な家族の機織り機で12日間かけて織られた、高貴な家宝品質の純粋なバナラシシルクサリー。現地の適正価格基準に適合しています。",
                                            French: "Un sari majestueux en pure soie de Banarasi, tissé sur un métier à main familial pendant douze jours. Conforme aux tarifs réglementés locaux.",
                                            German: "Ein majestätischer Sari aus reiner Banarasi-Seide, der über zwölf Tage auf einem traditionellen Familienwebstuhl handgewebt wurde. Entspricht dem lokalen Standardtarif."
                                          }
                                        })}
                                        className="w-full text-left p-3 bg-brand-dark hover:bg-brand-teal/10 border border-brand-teal/10 hover:border-brand-teal/25 rounded-2xl text-[10px] font-bold transition-all cursor-pointer flex justify-between items-center gap-2"
                                      >
                                        <div className="space-y-1">
                                          <p className="text-white">🎙️ "हमार हथकरघा साड़ी असली रेशम..."</p>
                                          <p className="text-[9px] text-slate-400">Authentic Saree list (₹6,500)</p>
                                        </div>
                                        <ChevronRight className="h-4 w-4 text-brand-teal" />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => triggerVoiceGeneration({
                                          id: "boat_1",
                                          dialectSpeech: "गंगा आरती खाতির लकड़ी के सुंदर नाव के बुकिंग, ₹350 प्रति घंटा",
                                          englishName: "Ganga Dawn Rowing Boat Cruise Service",
                                          extractedPrice: 350,
                                          heritageContext: "Provided by standard-tariff registered multi-generational rowing boat families. Uses local neem-wood hulls built on the shores of Ramnagar, keeping navigation authentic without gasoline spillages on the holy river.",
                                          translations: {
                                            English: "A serene, silent rowing tour of the Varanasi Ghats during sunrise. Steered by certified local boatmen ensuring zero-emissions navigation and absolute price-registry compliance.",
                                            Japanese: "日の出時のバナラシ・ガートを巡る静かで穏やかな手漕ぎボートツアー。認定船頭によるエコフレンドリーな運行。",
                                            French: "Une promenade sereine en barque sur les Ghats de Varanasi au lever du soleil. Navigué par un batelier certifié, sans émissions.",
                                            German: "Eine ruhige Ruderbootfahrt auf den Varanasi Ghats bei Sonnenaufgang. Geführt von zertifizierten Bootsführern, völlig emissionsfrei."
                                          }
                                        })}
                                        className="w-full text-left p-3 bg-brand-dark hover:bg-brand-teal/10 border border-brand-teal/10 hover:border-brand-teal/25 rounded-2xl text-[10px] font-bold transition-all cursor-pointer flex justify-between items-center gap-2"
                                      >
                                        <div className="space-y-1">
                                          <p className="text-white">🎙️ "गंगा आरती खाতির लकड़ी के सुंदर..."</p>
                                          <p className="text-[9px] text-slate-400">Ganga boat tour (₹350/hr)</p>
                                        </div>
                                        <ChevronRight className="h-4 w-4 text-brand-teal" />
                                      </button>
                                    </>
                                  ) : activeCity === 'jaipur' ? (
                                    <>
                                      <button
                                        type="button"
                                        onClick={() => triggerVoiceGeneration({
                                          id: "pottery_1",
                                          dialectSpeech: "हाथ सूं बणायोड़ो नीळो बासण सेट, कीमती ₹1,200",
                                          englishName: "Hand-Thrown Jaipur Cobalt Blue Pottery Vase Set",
                                          extractedPrice: 1200,
                                          heritageContext: "Crafted without clay using quartz powder, raw glaze, and cobalt oxide. Extends the Sanganer artisan legacy which was introduced to Jaipur in the 17th century by Maharaja Sawai Ram Singh.",
                                          translations: {
                                            English: "An exquisite hand-thrown floral cobalt vase set glazed in natural plant resins. Authentically cataloged under the Jaipur Cooperative Board for fair-trade artisans.",
                                            Japanese: "天然植物樹脂で釉薬を施した、精巧な手作りのフローラルコバルトブルー花瓶セット。フェアトレード認定済み。",
                                            French: "Un ensemble de vases en poterie bleue de Jaipur, jeté à la main et glacé avec des résines de plantes naturelles.",
                                            German: "Ein exquisites handgedrehtes kobaltblaues Jaipur-Keramikvasen-Set, glasiert mit natürlichen Pflanzenharzen."
                                          }
                                        })}
                                        className="w-full text-left p-3 bg-brand-dark hover:bg-brand-teal/10 border border-brand-teal/10 hover:border-brand-teal/25 rounded-2xl text-[10px] font-bold transition-all cursor-pointer flex justify-between items-center gap-2"
                                      >
                                        <div className="space-y-1">
                                          <p className="text-white">🎙️ "हाथ सूं बणायोड़ो नीळो बासण..."</p>
                                          <p className="text-[9px] text-slate-400">Blue Pottery Vase Set (₹1,200)</p>
                                        </div>
                                        <ChevronRight className="h-4 w-4 text-brand-teal" />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => triggerVoiceGeneration({
                                          id: "puppet_1",
                                          dialectSpeech: "हवा महल रो पारम्परिक कठपुतली जोड़ा, ₹450",
                                          englishName: "Traditional Kathputli Puppet Heritage Pair",
                                          extractedPrice: 450,
                                          heritageContext: "Hand-carved mango wood heads and vibrant recycled Rajasthani cotton fabrics. Woven by the nomadic Bhat community who have kept the folk storytelling medium of Rajasthan alive for centuries.",
                                          translations: {
                                            English: "A charming pair of string-operated Rajasthani Kathputlis. Beautifully dressed in local hand-block printed garments, cataloged at fair prices.",
                                            Japanese: "伝統的なハンドブロックプリントを施した衣装をまとった、愛らしいラジャスタン製操り人形ペア。",
                                            French: "Une charmante paire de marionnettes Kathputli du Rajasthan. Vêtues de vêtements imprimés traditionnels.",
                                            German: "Ein charmantes Paar handgefertigter Kathputli-Marionetten aus Rajasthan in traditioneller Kleidung."
                                          }
                                        })}
                                        className="w-full text-left p-3 bg-brand-dark hover:bg-brand-teal/10 border border-brand-teal/10 hover:border-brand-teal/25 rounded-2xl text-[10px] font-bold transition-all cursor-pointer flex justify-between items-center gap-2"
                                      >
                                        <div className="space-y-1">
                                          <p className="text-white">🎙️ "हवा महल रो पारम्परिक कठपुतली..."</p>
                                          <p className="text-[9px] text-slate-400">Kathputli Puppet Pair (₹450)</p>
                                        </div>
                                        <ChevronRight className="h-4 w-4 text-brand-teal" />
                                      </button>
                                    </>
                                  ) : activeCity === 'kochi' ? (
                                    <>
                                      <button
                                        type="button"
                                        onClick={() => triggerVoiceGeneration({
                                          id: "coir_1",
                                          dialectSpeech: "കൈകൊണ്ട് നെയ്ത കയർ മാറ്റുകൾ, വെറും ₹500 രൂപ",
                                          englishName: "Natural Coir Fiber Hand-Spun Welcome Mat",
                                          extractedPrice: 500,
                                          heritageContext: "Crafted entirely from sustainably harvested coconut husks by women's co-ops in the Vembanad delta, keeping ancient fiber extraction practices clean and completely carbon-neutral.",
                                          translations: {
                                            English: "A highly durable, non-slip welcome mat made from organic Kerala coconut coir. Standard pricing verified to ensure maximum payout to the female weavers.",
                                            Japanese: "ケララ産のオーガニックココナッツ繊維を使用した、耐久性に優れた滑り止め付きウェルカムマット。",
                                            French: "Un paillasson robuste en fibre de coco bio du Kerala. Tarification équitable vérifiée.",
                                            German: "Eine sehr langlebige Fußmatte aus biologischer Kokosfaser aus Kerala. Fairer Preis garantiert."
                                          }
                                        })}
                                        className="w-full text-left p-3 bg-brand-dark hover:bg-brand-teal/10 border border-brand-teal/10 hover:border-brand-teal/25 rounded-2xl text-[10px] font-bold transition-all cursor-pointer flex justify-between items-center gap-2"
                                      >
                                        <div className="space-y-1">
                                          <p className="text-white">🎙️ "കൈകൊണ്ട് നെയ്ത കയർ മാറ്റുകൾ..."</p>
                                          <p className="text-[9px] text-slate-400">Coconut Coir Mat (₹500)</p>
                                        </div>
                                        <ChevronRight className="h-4 w-4 text-brand-teal" />
                                      </button>
                                    </>
                                  ) : (
                                    <>
                                      <button
                                        type="button"
                                        onClick={() => triggerVoiceGeneration({
                                          id: "bag_1",
                                          dialectSpeech: "ಬಾಳೆ ನಾರಿನ ಕೈಚೀಲ, ಬೆಲೆ ₹600",
                                          englishName: "Hand-Braided Banana Fiber Eco Handbag",
                                          extractedPrice: 600,
                                          heritageContext: "Crafted utilizing discard pseudo-stems from sustainable banana cultivation in Kishkindha plantations. Pioneered by Anegundi community collectives to convert agricultural residues into fair-trade income.",
                                          translations: {
                                            English: "A lightweight, organic, and resilient handbag braided from dried banana stem fibers. Fairly cataloged to support local rural craft initiatives.",
                                            Japanese: "乾燥させたバナナの茎の繊維を手編みした、軽量で耐久性のあるオーガニックハンドバッグ。",
                                            French: "Un sac à main biologique, léger et résistant, tressé à partir de fibres de bananier séchées.",
                                            German: "Eine leichte, organische Handtasche, geflochten aus getrockneten Bananenfasern aus Hampi."
                                          }
                                        })}
                                        className="w-full text-left p-3 bg-brand-dark hover:bg-brand-teal/10 border border-brand-teal/10 hover:border-brand-teal/25 rounded-2xl text-[10px] font-bold transition-all cursor-pointer flex justify-between items-center gap-2"
                                      >
                                        <div className="space-y-1">
                                          <p className="text-white">🎙️ "ಬಾಳೆ ನಾರಿನ ಕೈಚೀಲ, ಬೆಲೆ..."</p>
                                          <p className="text-[9px] text-slate-400">Banana Fiber Bag (₹600)</p>
                                        </div>
                                        <ChevronRight className="h-4 w-4 text-brand-teal" />
                                      </button>
                                    </>
                                  )}

                                  {/* Custom Dictation Speak Trigger */}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setVoiceRecordingActive(true);
                                      setVoiceGenerating(true);
                                      setVoiceStep("🎙️ Listening to active speech feed. Speak now...");
                                      setTimeout(() => {
                                        setVoiceStep("🧠 Analyzing dialect and regional accent...");
                                        setTimeout(() => {
                                          triggerVoiceGeneration({
                                            id: "custom_1",
                                            dialectSpeech: "Custom recorded natural speech prompt",
                                            englishName: "Decentralized Swadeshi Heritage Artifact",
                                            extractedPrice: 850,
                                            heritageContext: "Crafted by multi-generational local micro-entrepreneurs using local materials, protecting traditional techniques against factory replicates.",
                                            translations: {
                                              English: "An authentic local souvenir registered in the municipal Swadeshi ledger, ensuring complete transparency and compliance with our standard rate limits.",
                                              Japanese: "地方自治体の適正価格簿に登録された本物の地元のお土産で、完全な透明性が確保されています。",
                                              French: "Un souvenir local authentique enregistré dans le registre municipal, garantissant une transparence totale.",
                                              German: "Ein authentisches lokales Souvenir, das im Gemeinderegister eingetragen ist und volle Transparenz garantiert."
                                            }
                                          });
                                          setVoiceRecordingActive(false);
                                        }, 1200);
                                      }, 1500);
                                    }}
                                    className="w-full py-3 bg-brand-rose/10 hover:bg-brand-rose/25 border-2 border-dashed border-brand-rose/30 hover:border-brand-rose/50 rounded-2xl text-[10px] font-extrabold text-brand-rose uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
                                  >
                                    <Mic className="h-4 w-4 text-brand-rose animate-pulse" />
                                    <span>Speak & Record Custom Dialect</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}

                          {voiceGenerating && (
                            <div className="py-8 text-center space-y-3.5">
                              <div className="relative inline-block">
                                <div className="animate-ping absolute inset-0 rounded-full bg-brand-rose/20 w-8 h-8" />
                                <div className="relative bg-brand-rose text-brand-deep rounded-full p-2">
                                  <Mic className="h-4 w-4 animate-pulse" />
                                </div>
                              </div>
                              <p className="text-[10px] font-mono font-bold text-brand-rose uppercase tracking-wider">{voiceStep}</p>
                            </div>
                          )}

                          {currentStorefrontProduct && !voiceGenerating && (
                            <div className="space-y-3.5 p-3.5 bg-brand-bg/85 border border-brand-teal/15 rounded-2xl animate-fade-in text-slate-300">
                              <div className="flex justify-between items-center border-b border-brand-teal/10 pb-2">
                                <div>
                                  <h5 className="text-[11px] font-black text-white uppercase tracking-wide">{currentStorefrontProduct.englishName}</h5>
                                  <span className="text-[9px] font-mono text-brand-teal block font-semibold">Extracted Price Limit: ₹{currentStorefrontProduct.extractedPrice}</span>
                                </div>
                                <button 
                                  type="button" 
                                  onClick={() => {
                                    setCurrentStorefrontProduct(null);
                                    setCurrentTwinLang("English");
                                  }}
                                  className="text-[9.5px] text-brand-rose hover:underline cursor-pointer"
                                >
                                  Re-record
                                </button>
                              </div>

                              <div className="space-y-1.5">
                                <span className="text-[8px] font-extrabold tracking-widest text-slate-400 uppercase block font-mono">Transcribed Speech Source:</span>
                                <p className="text-[10.5px] italic text-brand-rose font-medium bg-brand-dark/40 p-2 rounded border border-brand-teal/5">
                                  "{currentStorefrontProduct.dialectSpeech}"
                                </p>
                              </div>

                              {/* Multi-language selector */}
                              <div className="space-y-1.5">
                                <span className="text-[8px] font-extrabold tracking-widest text-slate-400 uppercase block font-mono">Select Twin Language Translation:</span>
                                <div className="flex bg-brand-dark p-0.5 rounded-lg border border-brand-teal/10 gap-0.5">
                                  {["English", "Japanese", "French", "German"].map((lang) => (
                                    <button
                                      key={lang}
                                      type="button"
                                      onClick={() => setCurrentTwinLang(lang)}
                                      className={`flex-1 py-1 text-[8px] font-mono font-bold rounded transition-all uppercase cursor-pointer ${
                                        currentTwinLang === lang
                                          ? "bg-brand-teal text-brand-dark font-black"
                                          : "text-slate-400 hover:text-white"
                                      }`}
                                    >
                                      {lang === "Japanese" ? "日本語" : lang === "French" ? "FR" : lang === "German" ? "DE" : "EN"}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* Translated Description */}
                              <div className="space-y-1.5">
                                <span className="text-[8px] font-extrabold tracking-widest text-brand-teal uppercase block font-mono">Gemini Translated Catalog Description ({currentTwinLang}):</span>
                                <p className="text-[10.5px] leading-relaxed font-semibold bg-brand-dark/60 p-2 rounded text-slate-200">
                                  {currentStorefrontProduct.translations[currentTwinLang]}
                                </p>
                              </div>

                              {/* Heritage context */}
                              <div className="space-y-1.5 bg-amber-500/5 p-2 rounded-xl border border-amber-500/10">
                                <span className="text-[8px] font-mono text-amber-400 font-extrabold uppercase tracking-wider block flex items-center gap-1">
                                  🌱 Local Heritage & Craft Soul Preservation:
                                </span>
                                <p className="text-[9.5px] text-slate-300 leading-normal font-medium italic">
                                  {currentStorefrontProduct.heritageContext}
                                </p>
                              </div>

                              <button
                                type="button"
                                onClick={() => {
                                  showToast(`🚀 Digital Twin catalog entry for ${currentStorefrontProduct.englishName} successfully synchronized!`);
                                  setCurrentStorefrontProduct(null);
                                }}
                                className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-brand-deep font-black text-[9.5px] rounded-xl transition-all uppercase tracking-wider cursor-pointer"
                              >
                                Synchronize Digital Twin
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          setInquiryName("");
                          setInquiryEmail("");
                          setInquiryType("Question");
                          setInquiryMessage("");
                          setIsInquiryModalOpen(true);
                        }}
                        className="w-full py-2.5 px-4 bg-brand-rose hover:bg-brand-rose/95 text-brand-deep font-extrabold text-[11px] rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm uppercase tracking-wider"
                        id="direct-inquiry-trigger-btn"
                      >
                        <Mail className="h-3.5 w-3.5" />
                        <span>Direct Inquiry</span>
                      </button>

                    </div>
                  ) : (
                    <div className="p-8 text-center text-slate-400 text-xs">
                      Select any local artisan or driver card to audit their simulated economic ledger.
                    </div>
                  )}
                </div>

              </div>

            </motion.div>
          )}

          {/* TAB PANEL: TRIP NAVIGATOR MAP */}
          {activeTab === 'navigator' && activeCity !== null && (
            <motion.div 
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="space-y-8 lg:col-span-12" 
              id="interactive-map-navigator"
            >
              
              {/* Introduction header */}
              <div className="bg-brand-dark p-6 rounded-[32px] border border-brand-teal/20 shadow-sm max-w-4xl text-white">
                <h3 className="text-sm font-extrabold text-white font-display flex items-center gap-1.5">
                  <Compass className="h-5 w-5 text-brand-rose" />
                  Interactive {currentCityConfig.fullName} Scenic Route & Silt Radar
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mt-1">
                  Adjusting sliders directly shifts simulated spatial vectors below. Higher preservation budgets clean up waterways and plazas, tighter rate cards lower scam markers, and active hazards flood paths or restrict key transport lanes.
                </p>
              </div>

              {/* Dynamic SVG Scenic Map Container */}
              <div className="bg-brand-dark p-6 rounded-[32px] border border-brand-teal/20 shadow-inner relative aspect-[16/9] overflow-hidden min-h-[420px] flex flex-col justify-between text-white select-none max-w-4xl">
                
                {/* Visual grid overlay for tech aesthetic */}
                <div className="absolute inset-x-0 bottom-0 top-0 bg-brand-deep/5 pointer-events-none" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#376e6f_1px,transparent_1px),linear-gradient(to_bottom,#376e6f_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-10 pointer-events-none" />

                {/* Animated waterway / river flow curve (Only shown for Varanasi, Kochi, Hampi - cities with boats) */}
                {activeCity !== 'jaipur' && (
                  <svg className="absolute bottom-0 inset-x-0 h-1/2 w-full pointer-events-none opacity-35">
                    <path 
                      d="M 0 80 Q 250 40 550 90 T 1100 60 L 1100 400 L 0 400 Z" 
                      fill="url(#river-gradient)" 
                      className={`transition-all duration-1000 ${inputs.weatherHazard === 'high' ? 'fill-brand-rose/30' : 'fill-brand-teal/30'}`}
                    />
                    <defs>
                      <linearGradient id="river-gradient" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#1c3334" stopOpacity="0"/>
                        <stop offset="50%" stopColor="#376e6f" stopOpacity="0.3"/>
                        <stop offset="100%" stopColor="#da7b93" stopOpacity="0.4"/>
                      </linearGradient>
                    </defs>
                  </svg>
                )}

                {/* Dynamic coordinate-based Scenic Nodes */}
                {currentCityConfig.scenicNodes
                  .filter(node => nodeTypeFilter === 'all' || node.iconType === nodeTypeFilter)
                  .map((node, index) => {
                    const metricValue = metrics[node.metricKey as keyof SimulationResult] as number;
                    const isCritical = node.metricKey === 'trafficCongestion' && metricValue > 70;
                    const isClean = node.metricKey === 'ghatCleanliness' && metricValue > 80;
                    
                    // Heatmap integrated Node Styling
                    let nodeBgClass = "bg-brand-bg border border-brand-teal/20";
                    let nodeStyles: React.CSSProperties = {};

                    if (heatmapMode !== 'none') {
                      const localHeatVal = getNodeMetric(node.name, heatmapMode);
                      const heatColor = getHeatColor(localHeatVal, heatmapMode);
                      nodeStyles = {
                        backgroundColor: `${heatColor}30`,
                        borderColor: heatColor,
                        boxShadow: `0 0 14px ${heatColor}50`,
                        borderWidth: '2px'
                      };
                    } else {
                      if (isCritical) {
                        nodeBgClass = "bg-brand-rose/30 border border-brand-rose ring-4 ring-brand-rose/20 animate-pulse";
                      } else if (isClean) {
                        nodeBgClass = "bg-brand-teal/30 border border-brand-teal ring-4 ring-brand-teal/20";
                      }
                    }

                    const isSelected = selectedNode?.name === node.name;
                    if (isSelected) {
                      nodeBgClass = "bg-brand-teal/40 border-2 border-brand-teal ring-8 ring-brand-teal/20 scale-110";
                    }

                    return (
                      <motion.div 
                        key={`${activeCity || "varanasi"}-${node.name}`} 
                        className={`absolute z-20 flex flex-col items-center group cursor-pointer transition-all duration-300 ${isSelected ? "z-30" : ""}`}
                        style={{ top: node.y, left: node.x }}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ 
                          scale: isSelected ? 1.15 : [0, 1.25, 0.95, 1.05, 1], 
                          opacity: 1 
                        }}
                        transition={{ 
                          duration: isSelected ? 0.2 : 1.0,
                          ease: "easeInOut",
                          delay: isSelected ? 0 : index * 0.08,
                        }}
                        whileHover={{ scale: isSelected ? 1.15 : 1.08 }}
                        onClick={() => setSelectedNode(isSelected ? null : node)}
                        onMouseEnter={() => setHoveredNode(node)}
                        onMouseLeave={() => setHoveredNode(null)}
                      >
                        <div className="relative">
                          <div 
                            style={nodeStyles}
                            className={`p-3 rounded-full flex items-center justify-center transition-all duration-500 ${nodeBgClass}`}
                          >
                            {node.iconType === 'transit' ? (
                              <Navigation className="h-4 w-4 text-brand-rose rotate-90" />
                            ) : node.iconType === 'coop' ? (
                              <Briefcase className="h-4 w-4 text-brand-teal" />
                            ) : node.iconType === 'sanitation' ? (
                              <Waves className="h-4 w-4 text-brand-teal" />
                            ) : (
                              <Compass className="h-4 w-4 text-brand-rose" />
                            )}
                          </div>
                          
                          {node.iconType === 'coop' && (
                            <div className="absolute -top-1 -right-1 bg-amber-500 text-brand-deep rounded-full p-0.5 border border-brand-dark animate-pulse shadow-md" title="Verified Safe-Haven Merchant">
                              <Shield className="h-2.5 w-2.5 text-brand-deep" />
                            </div>
                          )}
                        </div>
                        <span className="text-[10px] font-bold text-slate-100 mt-1.5 font-display uppercase tracking-wider text-center max-w-[120px] bg-brand-deep/95 px-2 py-0.5 rounded-md border border-brand-rose/25 backdrop-blur">
                          {node.name}
                        </span>
                        <span className="text-[8px] font-mono font-bold text-slate-300 mt-0.5">
                          {node.metricKey === 'trafficCongestion' ? `Congestion: ${metricValue}%` :
                           node.metricKey === 'weaverCooperativeIncome' ? `Co-op: +${metricValue}%` :
                           node.metricKey === 'ghatCleanliness' ? `Sanitation: ${metricValue}%` :
                           `Safety Trust: ${metricValue}/100`}
                        </span>

                        {/* Floating Tooltip showing node metric details on hover */}
                        <AnimatePresence>
                          {hoveredNode?.name === node.name && (
                            <motion.div
                              initial={{ opacity: 0, y: 8, scale: 0.92 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 8, scale: 0.92 }}
                              transition={{ duration: 0.15, ease: "easeOut" }}
                              className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 bg-brand-dark/95 border border-brand-teal/40 backdrop-blur-md p-3 rounded-2xl shadow-2xl z-50 pointer-events-none min-w-[200px] text-left"
                            >
                              <div className="flex items-center gap-1.5 border-b border-brand-teal/15 pb-1.5 mb-1.5">
                                <span className="text-xs">
                                  {node.iconType === 'transit' ? "🚘" : node.iconType === 'coop' ? "📦" : node.iconType === 'sanitation' ? "🌊" : "🧭"}
                                </span>
                                <div>
                                  <h5 className="text-[10px] font-black text-white uppercase tracking-wide font-display leading-tight">{node.name}</h5>
                                  <span className="text-[7.5px] font-mono font-extrabold text-brand-teal uppercase tracking-widest">{node.iconType} Node</span>
                                </div>
                              </div>
                              
                              <p className="text-[8.5px] text-slate-300 leading-normal mb-2 italic">
                                {node.description}
                              </p>

                              <div className="flex justify-between items-center bg-brand-teal/10 px-2 py-1 rounded-lg border border-brand-teal/20 text-[9px]">
                                <span className="font-mono font-bold text-slate-400">Live Metric:</span>
                                <span className="font-mono font-black text-brand-teal">
                                  {node.metricKey === 'trafficCongestion' ? `Congestion: ${metricValue}%` :
                                   node.metricKey === 'weaverCooperativeIncome' ? `Co-op growth: +${metricValue}%` :
                                   node.metricKey === 'ghatCleanliness' ? `Sanitation: ${metricValue}%` :
                                   `Safety Trust: ${metricValue}/100`}
                                </span>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}

                {/* Symmetrical connective paths with Heatmap visualization */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                  {currentCityConfig.scenicRoutes
                    .filter(route => {
                      if (nodeTypeFilter === 'all') return true;
                      const nodeA = currentCityConfig?.scenicNodes.find(n => n.x === route.x1 && n.y === route.y1);
                      const nodeB = currentCityConfig?.scenicNodes.find(n => n.x === route.x2 && n.y === route.y2);
                      return (nodeA && nodeA.iconType === nodeTypeFilter) || (nodeB && nodeB.iconType === nodeTypeFilter);
                    })
                    .map((route, i) => {
                      if (heatmapMode === 'none') {
                        return (
                          <line 
                            key={`route-none-${route.x1}-${route.y1}-${route.x2}-${route.y2}`}
                            x1={route.x1} 
                            y1={route.y1} 
                            x2={route.x2} 
                            y2={route.y2} 
                            stroke="#376e6f" 
                            strokeWidth="1.5" 
                            strokeDasharray="4 4" 
                            className="opacity-40 transition-all duration-700 ease-in-out"
                          />
                        );
                      }

                      const valA = getNodeMetric(findNodeNameByCoords(route.x1, route.y1), heatmapMode);
                      const valB = getNodeMetric(findNodeNameByCoords(route.x2, route.y2), heatmapMode);
                      const routeVal = (valA + valB) / 2;
                      const heatColor = getHeatColor(routeVal, heatmapMode);

                      return (
                        <React.Fragment key={`route-group-${route.x1}-${route.y1}-${route.x2}-${route.y2}`}>
                          {/* Underlayer thick blurring heat signature */}
                          <line 
                            x1={route.x1} 
                            y1={route.y1} 
                            x2={route.x2} 
                            y2={route.y2} 
                            stroke={heatColor} 
                            strokeWidth="14" 
                            strokeLinecap="round"
                            className="opacity-30 blur-[4px] transition-all duration-700 ease-in-out" 
                          />
                          {/* Middle solid vibrant heat street corridor */}
                          <line 
                            x1={route.x1} 
                            y1={route.y1} 
                            x2={route.x2} 
                            y2={route.y2} 
                            stroke={heatColor} 
                            strokeWidth="6" 
                            strokeLinecap="round"
                            className="opacity-75 transition-all duration-700 ease-in-out" 
                          />
                          {/* Moving flow particles */}
                          <line 
                            x1={route.x1} 
                            y1={route.y1} 
                            x2={route.x2} 
                            y2={route.y2} 
                            stroke="#ffffff" 
                            strokeWidth="1.5" 
                            strokeDasharray="5 15" 
                            className="opacity-50 animate-dash-flow transition-all duration-700 ease-in-out" 
                          />
                        </React.Fragment>
                      );
                    })}
                </svg>

                {/* Float Status Overlays & Heatmap Toggle Controller */}
                <div className="absolute top-4 left-4 bg-brand-dark/95 backdrop-blur-md p-4 rounded-2xl border border-brand-teal/20 z-30 flex flex-col gap-2.5 shadow-xl max-w-[280px]">
                  <div className="flex items-center gap-2 border-b border-brand-teal/10 pb-2">
                    <span className="w-2 h-2 rounded-full bg-brand-teal animate-pulse" />
                    <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-slate-200">Municipal Silt & Scribe Radar</span>
                  </div>
                  
                  <div className="space-y-1.5">
                    <span className="text-[8px] font-mono font-extrabold uppercase tracking-widest text-brand-teal block">HEATMAP OVERLAY:</span>
                    <div className="flex bg-brand-bg/80 p-0.5 rounded-lg border border-brand-teal/10 gap-0.5">
                      <button
                        onClick={() => setHeatmapMode('congestion')}
                        className={`flex-1 py-1 text-[8.5px] font-mono font-bold rounded transition-all uppercase ${
                          heatmapMode === 'congestion'
                            ? "bg-brand-rose text-white shadow-sm"
                            : "text-slate-400 hover:text-white hover:bg-brand-dark/40"
                        }`}
                      >
                        CONGESTION
                      </button>
                      <button
                        onClick={() => setHeatmapMode('cleanliness')}
                        className={`flex-1 py-1 text-[8.5px] font-mono font-bold rounded transition-all uppercase ${
                          heatmapMode === 'cleanliness'
                            ? "bg-brand-teal text-brand-dark shadow-sm font-black"
                            : "text-slate-400 hover:text-white hover:bg-brand-dark/40"
                        }`}
                      >
                        CLEANLINESS
                      </button>
                      <button
                        onClick={() => setHeatmapMode('none')}
                        className={`px-1.5 py-1 text-[8.5px] font-mono font-bold rounded transition-all uppercase ${
                          heatmapMode === 'none'
                            ? "bg-brand-dark text-slate-200 border border-brand-teal/15 shadow-sm"
                            : "text-slate-400 hover:text-white hover:bg-brand-dark/40"
                        }`}
                      >
                        OFF
                      </button>
                    </div>
                  </div>

                  {/* Navigator Filter Controls */}
                  <div className="space-y-1.5 border-t border-brand-teal/10 pt-2.5">
                    <span className="text-[8px] font-mono font-extrabold uppercase tracking-widest text-brand-teal block">NAVIGATOR FILTER:</span>
                    {(() => {
                      const countAll = currentCityConfig?.scenicNodes?.length || 0;
                      const countCoop = currentCityConfig?.scenicNodes?.filter(n => n.iconType === 'coop')?.length || 0;
                      const countTransit = currentCityConfig?.scenicNodes?.filter(n => n.iconType === 'transit')?.length || 0;
                      const countSanitation = currentCityConfig?.scenicNodes?.filter(n => n.iconType === 'sanitation')?.length || 0;
                      const countAnchor = currentCityConfig?.scenicNodes?.filter(n => n.iconType === 'anchor')?.length || 0;

                      return (
                        <div className="flex flex-col gap-1">
                          <button
                            onClick={() => setNodeTypeFilter('all')}
                            className={`w-full py-1 text-[8px] font-mono font-bold rounded transition-all uppercase text-left px-2 flex items-center justify-between cursor-pointer ${
                              nodeTypeFilter === 'all'
                                ? "bg-brand-teal text-brand-dark font-black"
                                : "text-slate-400 hover:text-white hover:bg-brand-dark/40 bg-brand-bg/60 border border-brand-teal/5"
                            }`}
                          >
                            <span className="flex items-center gap-1.5">🌐 <span>All Elements</span></span>
                            <span className="text-[8px] px-1.5 py-0.5 rounded bg-brand-dark/30 text-slate-300 font-extrabold">[{countAll}]</span>
                          </button>
                          <button
                            onClick={() => setNodeTypeFilter('coop')}
                            className={`w-full py-1 text-[8px] font-mono font-bold rounded transition-all uppercase text-left px-2 flex items-center justify-between cursor-pointer ${
                              nodeTypeFilter === 'coop'
                                ? "bg-brand-teal text-brand-dark font-black"
                                : "text-slate-400 hover:text-white hover:bg-brand-dark/40 bg-brand-bg/60 border border-brand-teal/5"
                            }`}
                          >
                            <span className="flex items-center gap-1.5">📦 <span>Artisan Guilds</span></span>
                            <span className="text-[8px] px-1.5 py-0.5 rounded bg-brand-dark/30 text-slate-300 font-extrabold">[{countCoop}]</span>
                          </button>
                          <button
                            onClick={() => setNodeTypeFilter('transit')}
                            className={`w-full py-1 text-[8px] font-mono font-bold rounded transition-all uppercase text-left px-2 flex items-center justify-between cursor-pointer ${
                              nodeTypeFilter === 'transit'
                                ? "bg-brand-teal text-brand-dark font-black"
                                : "text-slate-400 hover:text-white hover:bg-brand-dark/40 bg-brand-bg/60 border border-brand-teal/5"
                            }`}
                          >
                            <span className="flex items-center gap-1.5">🚘 <span>Transit Hubs</span></span>
                            <span className="text-[8px] px-1.5 py-0.5 rounded bg-brand-dark/30 text-slate-300 font-extrabold">[{countTransit}]</span>
                          </button>
                          <button
                            onClick={() => setNodeTypeFilter('sanitation')}
                            className={`w-full py-1 text-[8px] font-mono font-bold rounded transition-all uppercase text-left px-2 flex items-center justify-between cursor-pointer ${
                              nodeTypeFilter === 'sanitation'
                                ? "bg-brand-teal text-brand-dark font-black"
                                : "text-slate-400 hover:text-white hover:bg-brand-dark/40 bg-brand-bg/60 border border-brand-teal/5"
                            }`}
                          >
                            <span className="flex items-center gap-1.5">🌊 <span>Sanitation Zones</span></span>
                            <span className="text-[8px] px-1.5 py-0.5 rounded bg-brand-dark/30 text-slate-300 font-extrabold">[{countSanitation}]</span>
                          </button>
                          <button
                            onClick={() => setNodeTypeFilter('anchor')}
                            className={`w-full py-1 text-[8px] font-mono font-bold rounded transition-all uppercase text-left px-2 flex items-center justify-between cursor-pointer ${
                              nodeTypeFilter === 'anchor'
                                ? "bg-brand-teal text-brand-dark font-black"
                                : "text-slate-400 hover:text-white hover:bg-brand-dark/40 bg-brand-bg/60 border border-brand-teal/5"
                            }`}
                          >
                            <span className="flex items-center gap-1.5">🧭 <span>Heritage Guides</span></span>
                            <span className="text-[8px] px-1.5 py-0.5 rounded bg-brand-dark/30 text-slate-300 font-extrabold">[{countAnchor}]</span>
                          </button>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* Active Alerts HUD right hand side */}
                <div className="absolute top-4 right-4 bg-brand-dark/95 backdrop-blur-md p-4 rounded-2xl border border-brand-teal/20 max-w-xs space-y-3.5 z-30 shadow-lg text-left">
                  <span className="text-[9px] font-mono font-extrabold uppercase tracking-widest text-brand-rose block border-b border-brand-teal/10 pb-1.5">
                    Simulation HUD: {activeCity.toUpperCase()}
                  </span>
                  
                  <div className="space-y-2 text-[10px] font-semibold text-slate-300">
                    <div className="flex justify-between items-center">
                      <span>{currentCityConfig.environmentalHazardLabel}:</span>
                      <span className={`font-bold font-mono ${inputs.weatherHazard === 'high' ? 'text-brand-rose animate-pulse' : 'text-brand-teal'}`}>
                        {inputs.weatherHazard.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Traveler Trust:</span>
                      <span className="font-bold text-brand-rose font-mono">{metrics.safetyTrustRating}/100</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Cooperative Dividends:</span>
                      <span className="font-bold text-brand-teal font-mono">+{metrics.weaverCooperativeIncome}% YoY</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Standardized Tariffs:</span>
                      <span className="font-bold text-slate-300 font-mono">{inputs.standardizedRatesEnabled ? "On" : "Off"}</span>
                    </div>
                  </div>
                </div>

                {/* Active Filter Indicator (Improvement 2) */}
                {nodeTypeFilter !== 'all' && (
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-brand-teal text-brand-dark border border-brand-teal/50 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-mono font-black flex items-center gap-2 z-30 shadow-lg">
                    <span>⚡ MAP FILTER ACTIVE: {nodeTypeFilter.toUpperCase()}</span>
                    <button 
                      onClick={() => setNodeTypeFilter('all')}
                      className="hover:bg-brand-dark/20 text-brand-dark rounded-full w-4 h-4 flex items-center justify-center font-bold cursor-pointer transition-all"
                    >
                      ✕
                    </button>
                  </div>
                )}

                {/* Selected Node Details HUD (Improvement 1) */}
                {selectedNode && (
                  <motion.div 
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 15, scale: 0.95 }}
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-brand-dark/95 backdrop-blur-md p-3.5 rounded-2xl border-2 border-brand-teal w-[300px] z-40 shadow-2xl text-left flex flex-col gap-2"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm">
                          {selectedNode.iconType === 'transit' ? "🚘" : selectedNode.iconType === 'coop' ? "📦" : selectedNode.iconType === 'sanitation' ? "🌊" : "🧭"}
                        </span>
                        <div>
                          <h4 className="text-xs font-black text-white uppercase tracking-wide font-display">{selectedNode.name}</h4>
                          <span className="text-[8px] font-mono font-bold text-brand-teal uppercase tracking-widest">{selectedNode.iconType} element</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => setSelectedNode(null)}
                        className="text-slate-400 hover:text-white hover:bg-brand-dark/80 rounded p-1 cursor-pointer w-5 h-5 flex items-center justify-center text-[10px]"
                      >
                        ✕
                      </button>
                    </div>

                    <p className="text-[10px] text-slate-300 leading-relaxed font-medium bg-brand-bg/60 p-2 rounded border border-brand-teal/5">
                      {selectedNode.description}
                    </p>

                    {selectedNode.iconType === 'coop' && (
                      <div className="p-2.5 bg-amber-500/15 border border-amber-500/25 rounded-xl flex items-start gap-2 animate-fade-in">
                        <Shield className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5 animate-pulse" />
                        <div>
                          <span className="text-[9px] font-mono text-amber-400 font-extrabold tracking-wider uppercase block">🛡️ Verified Municipal Safe-Haven</span>
                          <span className="text-[9px] text-slate-300 leading-normal block font-semibold">Standard price-capped, certified safe spot. Restrooms, tourist support, and emergency help desk.</span>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between items-center bg-brand-teal/10 p-2 rounded-xl border border-brand-teal/20">
                      <span className="text-[9px] font-mono font-bold text-slate-300">Live Telemetry:</span>
                      <span className="text-[10px] font-mono font-black text-white">
                        {selectedNode.metricKey === 'trafficCongestion' ? `Congestion: ${metrics.trafficCongestion}%` :
                         selectedNode.metricKey === 'weaverCooperativeIncome' ? `Co-op Dividends: +${metrics.weaverCooperativeIncome}%` :
                         selectedNode.metricKey === 'ghatCleanliness' ? `Sanitation Index: ${metrics.ghatCleanliness}%` :
                         `Safety Trust: ${metrics.safetyTrustRating}/100`}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        showToast(`Initiating micro-audit route probe for ${selectedNode.name}...`, "info");
                      }}
                      className="w-full py-1.5 bg-brand-teal hover:bg-brand-teal/80 text-brand-dark font-black text-[9px] font-mono rounded-lg transition-all uppercase tracking-wider text-center cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Activity className="h-3 w-3" />
                      <span>Initiate Local Audit Probe</span>
                    </button>
                  </motion.div>
                )}

              </div>

            </motion.div>
          )}

          {/* TAB PANEL: CIVIC SECURITY ALERTS & INCIDENTS */}
          {activeTab === 'alerts' && activeCity !== null && (
            <motion.div 
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="space-y-8 lg:col-span-12" 
              id="alerts-logging-center"
            >
              
              {/* Civic Incident & Alert Status Control Board */}
              <div className="p-6 md:p-8 rounded-[32px] bg-brand-dark/45 backdrop-blur-xl border border-brand-teal/15 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6" id="alerts-control-board">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-rose/10 backdrop-blur rounded-full text-[10px] font-mono font-extrabold uppercase tracking-wider text-brand-rose border border-brand-rose/15">
                    <ShieldAlert className="h-3.5 w-3.5 animate-pulse" />
                    <span>Real-Time Municipal Dispatch</span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-black text-white font-display">
                    Civic Security Logs & Auditing
                  </h2>
                  <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
                    Monitor municipal alerts, log pricing compliance infractions, and view active warning records directly on the local Swadeshi decentralized audit registry.
                  </p>
                </div>
                
                <div className="flex flex-wrap items-center gap-4">
                  {/* Active Alerts Pulse Pill (transferred from Header) */}
                  <div className="flex items-center gap-2 bg-brand-deep border border-brand-rose/25 px-4 py-2 rounded-2xl shadow-sm whitespace-nowrap">
                    <AlertTriangle className="h-4 w-4 text-brand-rose animate-pulse flex-shrink-0" />
                    <span className="text-[11px] font-extrabold text-brand-rose uppercase tracking-wider font-mono">
                      {alerts.length} Active Security Logs
                    </span>
                  </div>

                  {/* File Report button (transferred from Header) */}
                  <button
                    onClick={() => setIsReportModalOpen(true)}
                    className="px-5 py-2.5 bg-brand-rose hover:bg-brand-rose/90 text-brand-deep rounded-2xl text-xs font-extrabold transition-all hover:shadow-[0_0_15px_rgba(230,72,51,0.4)] cursor-pointer shadow-md uppercase tracking-wider whitespace-nowrap animate-pulse"
                    id="file-report-alert-panel-btn"
                  >
                    Report Incident
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Civic Alerts Column */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4.5 w-4.5 text-brand-rose animate-pulse" />
                    <h3 className="text-xs font-extrabold text-brand-rose uppercase tracking-widest block font-display">
                      Active Municipal Warning Logs ({alerts.length})
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {alerts.length > 0 ? (
                      alerts.map((a) => (
                        <div
                          key={a.id}
                          className={`p-4 rounded-2xl border flex gap-3.5 relative overflow-hidden ${
                            a.severity === 'danger'
                              ? "bg-brand-deep/40 border-brand-rose/25"
                              : a.severity === 'warning'
                              ? "bg-brand-dark/50 border-brand-teal/20"
                              : "bg-brand-dark/30 border-brand-teal/15"
                          }`}
                        >
                          <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                            a.severity === 'danger' ? "bg-brand-rose" : a.severity === 'warning' ? "bg-brand-teal" : "bg-brand-teal/40"
                          }`} />

                          <div className="flex-1 space-y-1.5 pl-1 text-slate-300">
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-extrabold text-white">{a.title}</span>
                              <span className="text-[9px] font-mono text-brand-rose flex items-center gap-1 font-bold">
                                <Clock className="h-3 w-3" />
                                {a.timestamp}
                              </span>
                            </div>
                            <p className="text-[11px] leading-relaxed text-slate-400 font-semibold">
                              {a.message}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-12 text-center bg-brand-dark border border-brand-teal/10 rounded-[32px] text-xs text-slate-400">
                        No active municipal alerts for {currentCityConfig.fullName}.
                      </div>
                    )}
                  </div>
                </div>

                {/* Submitted Security Reports Log Column */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-extrabold text-brand-rose uppercase tracking-widest block font-display">
                      Artisan & Pricing Auditing Ledger
                    </span>
                    <button
                      onClick={() => setIsReportModalOpen(true)}
                      className="px-4 py-2 bg-brand-rose text-brand-deep hover:bg-brand-rose/90 rounded-xl text-[10px] font-bold uppercase transition-all shadow-sm font-sans"
                      id="report-audit-panel-btn"
                    >
                      Log Incident Audit
                    </button>
                  </div>

                  <div className="space-y-3">
                    {reports.length > 0 ? (
                      reports.map((r) => (
                        <div
                          key={r.id}
                          className="p-5 bg-brand-dark border border-brand-teal/15 rounded-2xl shadow-sm space-y-3 text-slate-300"
                        >
                          <div className="flex justify-between items-start gap-1 border-b border-brand-teal/10 pb-2.5">
                            <div>
                              <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-brand-deep text-brand-rose border border-brand-rose/20">
                                {r.incidentType}
                              </span>
                              <h4 className="font-extrabold text-white text-xs mt-1.5 flex items-center gap-1">
                                <MapPin className="h-3.5 w-3.5 text-brand-rose animate-bounce" />
                                {r.location}
                              </h4>
                            </div>
                            <span className="text-[9px] font-mono text-brand-teal font-bold uppercase">
                              {r.timestamp}
                            </span>
                          </div>

                          <p className="text-[11px] leading-relaxed text-slate-300 font-medium italic">
                            "{r.description}"
                          </p>

                          {r.verifiedReceipt && (
                            <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl space-y-1 text-slate-300 font-sans text-[10px]">
                              <div className="flex justify-between items-center">
                                <span className="text-[8px] font-mono text-emerald-400 font-extrabold uppercase tracking-wider bg-emerald-500/15 border border-emerald-500/25 px-1.5 py-0.5 rounded">
                                  ✓ Verified Proof Ledger
                                </span>
                                <span className="text-[8px] text-brand-rose font-mono font-bold">
                                  Credibility: +{r.verifiedReceipt.credibilityBoost}%
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-300 font-semibold">
                                <strong className="text-white">Merchant:</strong> {r.verifiedReceipt.merchantName} • <strong className="text-white">Receipt Total:</strong> ₹{r.verifiedReceipt.total.toLocaleString('en-IN')}
                              </p>
                            </div>
                          )}

                          <div className="flex items-center gap-2 pt-1 border-t border-brand-teal/10 pt-2.5">
                            <div className="w-5 h-5 rounded-full bg-brand-bg flex items-center justify-center text-[10px] font-bold text-brand-rose font-mono shadow-sm">
                              {r.reporterName[0]}
                            </div>
                            <span className="text-[10px] text-slate-400 font-semibold">
                              Reported by {r.reporterName}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-12 text-center bg-brand-dark border border-brand-teal/10 rounded-[32px] text-xs text-slate-400">
                        No pricing infractions filed for {currentCityConfig.fullName}. Use 'Log Incident Audit' to file.
                      </div>
                    )}
                  </div>
                </div>

              </div>

            </motion.div>
          )}

          {/* TAB PANEL: REAL-TIME DATA FEEDS */}
          {activeTab === 'feeds' && activeCity !== null && (
            <motion.div 
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="lg:col-span-12 w-full"
            >
              <RealTimeFeeds 
                activeCity={activeCity} 
                inputs={inputs} 
                onUpdatePolicy={handleSliderChange} 
              />
            </motion.div>
          )}

          {/* TAB PANEL: STAKEHOLDER PREDICTIVE DASHBOARD */}
          {activeTab === 'dashboard' && activeCity !== null && (
            <motion.div 
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="lg:col-span-12 w-full h-full overflow-auto"
            >
              <StakeholderDashboard 
                activeCity={activeCity}
                onShowToast={showToast}
              />
            </motion.div>
          )}

          {/* TAB PANEL: CULTURAL STORYTELLER AUDIO RAG */}
          {activeTab === 'storyteller' && activeCity !== null && (
            <motion.div 
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="lg:col-span-12 w-full"
            >
              <CulturalStoryteller 
                activeCity={activeCity}
                onShowToast={showToast}
              />
            </motion.div>
          )}

        </main>

      </div>

      {/* MODAL: REPORT INCIDENT OR OVERCHARGING */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-brand-dark rounded-[32px] max-w-md w-full overflow-hidden shadow-2xl border border-brand-teal/20 flex flex-col max-h-[90vh] text-white">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-brand-deep to-brand-dark px-6 py-5 text-white border-b border-brand-teal/15 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShieldAlert className="h-5 w-5 text-brand-rose animate-pulse" />
                <div>
                  <h2 className="text-sm font-extrabold font-display">Log Overcharging & Silt Warnings</h2>
                  <p className="text-[9px] text-slate-300 font-medium mt-0.5">Incident audits dynamically update simulated trust vectors</p>
                </div>
              </div>
              <button 
                onClick={() => setIsReportModalOpen(false)}
                className="p-1 rounded-full hover:bg-white/10 text-white/85 hover:text-white transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content Form */}
            <form onSubmit={handleReportSubmit} className="p-6 space-y-4 overflow-y-auto">
              {reportSuccess ? (
                <div className="py-8 space-y-3 text-center animate-fade-in">
                  <div className="w-10 h-10 rounded-full bg-brand-rose/20 text-brand-rose flex items-center justify-center mx-auto border border-brand-rose/25">
                    <Check className="h-5 w-5" />
                  </div>
                  <h4 className="font-bold text-white text-sm">Incident Logged Successfully</h4>
                  <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
                    Updating simulation metrics and sending warnings to the {currentCityConfig?.fullName || "heritage city"} regulatory ledger...
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Reporter Name */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Reporter Name / Agency ID</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Audit Inspector Miller or Traveler Elena"
                      value={reportName}
                      onChange={(e) => setReportName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-brand-bg border border-brand-teal/10 rounded-xl text-xs font-semibold focus:outline-none focus:border-brand-rose text-white"
                    />
                  </div>

                  {/* Incident Type */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Audit Infraction Class</label>
                    <select
                      value={reportType}
                      onChange={(e) => setReportType(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 bg-brand-bg border border-brand-teal/10 rounded-xl text-xs font-bold text-slate-300 focus:outline-none cursor-pointer"
                    >
                      <option value="Overcharging" className="bg-brand-dark">Overcharging / Fare Gouging</option>
                      <option value="Unlicensed Guide" className="bg-brand-dark">Unlicensed Heritage Brokerage</option>
                      <option value="Harassment" className="bg-brand-dark">Artisan Coercion / Harassment</option>
                      <option value="Ghat Littering" className="bg-brand-dark">Commercial Sanctuary Littering</option>
                      <option value="Other" className="bg-brand-dark">Other Regulatory Outlier</option>
                    </select>
                  </div>

                  {/* Incident Location */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Infraction Corridor Location</label>
                    <select
                      value={reportLocation}
                      onChange={(e) => setReportLocation(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-brand-bg border border-brand-teal/10 rounded-xl text-xs font-bold text-slate-300 focus:outline-none cursor-pointer"
                    >
                      {(currentCityConfig?.incidentLocations || []).map((loc) => (
                        <option key={loc} value={loc} className="bg-brand-dark">{loc}</option>
                      ))}
                    </select>
                  </div>

                  {/* Proof-of-purchase Verifiable Receipt Ledger */}
                  <div className="space-y-2.5 p-3.5 bg-brand-bg/80 border border-brand-teal/15 rounded-2xl">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">🧾 Verifiable Proof-of-Purchase</label>
                      <span className="text-[8px] font-bold bg-brand-teal/10 text-brand-teal border border-brand-teal/20 px-1.5 py-0.5 rounded font-mono">Gemini Vision OCR</span>
                    </div>
                    
                    {!uploadedReceipt && !isExtractingReceipt && (
                      <div className="space-y-2">
                        <p className="text-[9.5px] text-slate-400 leading-relaxed font-semibold">
                          Upload/select a tourist receipt to parse line-items and cross-verify pricing against our standard Swadeshi municipal tariff database.
                        </p>
                        <div className="grid grid-cols-1 gap-1.5">
                          <button
                            type="button"
                            onClick={() => triggerReceiptVerification({
                              merchantName: "Varanasi Silk Emporium",
                              lineItems: [{ item: "Handwoven Banarasi Katan Silk Saree", price: 12500 }],
                              total: 12500,
                              isVerified: true,
                              credibilityBoost: 45,
                              rawImageName: "varanasi_saree_receipt.jpg",
                              auditSummary: "AUTO-VERIFIED INCIDENT VIA GEMINI MULTIMODAL OCR: Surcharged receipt uploaded from 'Varanasi Silk Emporium'. Saree Sourcing at ₹12,500. Municipal registry standard rate cap specifies maximum of ₹6,500 for Katan silk grade. Absolute overcharge detected: ₹6,000 (+92%)."
                            })}
                            className="w-full text-left p-2.5 bg-brand-dark hover:bg-brand-rose/10 border border-brand-teal/10 hover:border-brand-rose/25 rounded-xl text-[10px] font-bold text-slate-300 hover:text-white transition-all cursor-pointer flex justify-between items-center"
                          >
                            <span>🛍️ Banarasi Saree Receipt (₹12,500)</span>
                            <span className="text-[8px] text-brand-rose font-mono">Gouged +92%</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => triggerReceiptVerification({
                              merchantName: "Ganga Rowing Cooperative",
                              lineItems: [{ item: "Double Oar Private Ganga Boat Cruise", price: 1500 }],
                              total: 1500,
                              isVerified: true,
                              credibilityBoost: 35,
                              rawImageName: "ganga_boat_receipt.jpg",
                              auditSummary: "AUTO-VERIFIED INCIDENT VIA GEMINI MULTIMODAL OCR: Surcharged receipt uploaded from 'Ganga Rowing Cooperative' at Dashashwamedh. Transacted boat cruise at ₹1,500. Standard rate register specifies maximum of ₹400 for 1-hour cruise. Absolute overcharge detected: ₹1,100 (+275%)."
                            })}
                            className="w-full text-left p-2.5 bg-brand-dark hover:bg-brand-rose/10 border border-brand-teal/10 hover:border-brand-rose/25 rounded-xl text-[10px] font-bold text-slate-300 hover:text-white transition-all cursor-pointer flex justify-between items-center"
                          >
                            <span>⛵ Ganga Boat Cruise (₹1,500)</span>
                            <span className="text-[8px] text-brand-rose font-mono">Gouged +275%</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => triggerReceiptVerification({
                              merchantName: "Amber Fort Gateway Shuttle",
                              lineItems: [{ item: "Electric Shuttle Ticket", price: 250 }],
                              total: 250,
                              isVerified: true,
                              credibilityBoost: 30,
                              rawImageName: "amber_shuttle_receipt.jpg",
                              auditSummary: "AUTO-VERIFIED INCIDENT VIA GEMINI MULTIMODAL OCR: Surcharged ticket uploaded from 'Amber Fort Gateway Shuttle'. Transacted shuttle ticket at ₹250. Standard rate register specifies maximum rate cap of ₹50. Absolute overcharge detected: ₹200 (+400%)."
                            })}
                            className="w-full text-left p-2.5 bg-brand-dark hover:bg-brand-rose/10 border border-brand-teal/10 hover:border-brand-rose/25 rounded-xl text-[10px] font-bold text-slate-300 hover:text-white transition-all cursor-pointer flex justify-between items-center"
                          >
                            <span>🛺 Amber Fort Shuttle (₹250)</span>
                            <span className="text-[8px] text-brand-rose font-mono">Gouged +400%</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {isExtractingReceipt && (
                      <div className="py-4 text-center space-y-2.5">
                        <div className="inline-block animate-spin w-4 h-4 border-2 border-t-transparent border-brand-rose rounded-full" />
                        <p className="text-[9px] font-mono text-brand-rose font-black uppercase tracking-wider">{extractionProgress}</p>
                      </div>
                    )}

                    {uploadedReceipt && (
                      <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl space-y-1.5 animate-fade-in text-slate-300">
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] text-emerald-400 font-extrabold tracking-wider uppercase font-mono flex items-center gap-1">
                            ✓ Receipts Verified & Validated
                          </span>
                          <button 
                            type="button"
                            onClick={() => {
                              setUploadedReceipt(null);
                              setReportDesc("");
                            }}
                            className="text-[9px] text-slate-400 hover:text-white underline cursor-pointer"
                          >
                            Clear
                          </button>
                        </div>
                        <div className="text-[10px] font-bold leading-normal">
                          <p><strong className="text-white">Merchant:</strong> {uploadedReceipt.merchantName}</p>
                          <p><strong className="text-white">Total:</strong> ₹{uploadedReceipt.total} • <strong className="text-brand-rose">+{uploadedReceipt.credibilityBoost}% Credibility Boost</strong></p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Incident Description */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Description of Audit Incident</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Provide specific fare amounts, broker details, or exact coordinates..."
                      value={reportDesc}
                      onChange={(e) => setReportDesc(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-brand-bg border border-brand-teal/10 rounded-xl text-xs font-semibold focus:outline-none focus:border-brand-rose text-white"
                    />
                  </div>

                  {/* Submit buttons */}
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsReportModalOpen(false)}
                      className="flex-1 py-2.5 border border-brand-teal/20 hover:bg-brand-bg/60 text-slate-300 font-bold rounded-xl text-xs cursor-pointer transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 bg-brand-rose hover:bg-brand-rose/90 text-brand-deep font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                      id="modal-report-submit-btn"
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>File Audit</span>
                    </button>
                  </div>
                </div>
              )}
            </form>

          </div>
        </div>
      )}

      {/* MODAL: DIRECT INQUIRY TO COOPERATIVE BOARD */}
      {isInquiryModalOpen && activeEnt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-fade-in" id="direct-inquiry-modal">
          <div className="bg-brand-dark rounded-[32px] max-w-md w-full overflow-hidden shadow-2xl border border-brand-teal/20 flex flex-col max-h-[90vh] text-white">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-brand-deep to-brand-dark px-6 py-5 text-white border-b border-brand-teal/15 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <MessageSquare className="h-5 w-5 text-brand-rose" />
                <div>
                  <h2 className="text-sm font-extrabold font-display">Direct Cooperative Inquiry</h2>
                  <p className="text-[9px] text-slate-300 font-medium mt-0.5">Route policy and coordination feedback to local boards</p>
                </div>
              </div>
              <button 
                onClick={() => setIsInquiryModalOpen(false)}
                className="p-1 rounded-full hover:bg-white/10 text-white/85 hover:text-white transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content Form */}
            <form onSubmit={handleInquirySubmit} className="p-6 space-y-4 overflow-y-auto">
              {inquirySuccess ? (
                <div className="py-8 space-y-3 text-center animate-fade-in">
                  <div className="w-10 h-10 rounded-full bg-brand-teal/20 text-brand-teal flex items-center justify-center mx-auto border border-brand-teal/25">
                    <Check className="h-5 w-5" />
                  </div>
                  <h4 className="font-bold text-white text-sm">Inquiry Dispatched Successfully</h4>
                  <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
                    Your transmission has been logged and routed to the cooperative board of <strong className="text-slate-200">{activeEnt.cooperativeName}</strong>. A ledger dispatch token has been generated.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  
                  {/* Context Banner: Target Representative */}
                  <div className="p-3 bg-brand-bg border border-brand-teal/10 rounded-2xl flex items-center gap-3">
                    <ArtisanAvatar 
                      src={activeEnt.avatar} 
                      name={activeEnt.name}
                      className="w-10 h-10 rounded-xl border border-brand-teal/15"
                    />
                    <div className="min-w-0">
                      <span className="text-[8px] font-extrabold uppercase tracking-widest text-brand-rose font-mono">Artisan / Operator Representative</span>
                      <h4 className="text-xs font-bold text-white truncate">{activeEnt.name}</h4>
                      <p className="text-[9px] text-slate-400 truncate">{activeEnt.cooperativeName}</p>
                    </div>
                  </div>

                  {/* Sender Name */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Your Name / Agent Identifier</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Inspector John Doe"
                      value={inquiryName}
                      onChange={(e) => setInquiryName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-brand-bg border border-brand-teal/10 rounded-xl text-xs font-semibold focus:outline-none focus:border-brand-rose text-white"
                    />
                  </div>

                  {/* Sender Email */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Your Contact Email</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. john@swadeshi-heritage.org"
                      value={inquiryEmail}
                      onChange={(e) => setInquiryEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-brand-bg border border-brand-teal/10 rounded-xl text-xs font-semibold focus:outline-none focus:border-brand-rose text-white"
                    />
                  </div>

                  {/* Inquiry Type */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Inquiry Category</label>
                    <select
                      value={inquiryType}
                      onChange={(e) => setInquiryType(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 bg-brand-bg border border-brand-teal/10 rounded-xl text-xs font-bold text-slate-300 focus:outline-none cursor-pointer"
                    >
                      <option value="Question" className="bg-brand-dark">Question on Workspace / Operations</option>
                      <option value="Suggestion" className="bg-brand-dark">Policy / Community Suggestion</option>
                      <option value="Support Request" className="bg-brand-dark">Direct Welfare or Supply Chain Support</option>
                    </select>
                  </div>

                  {/* Inquiry Message */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Inquiry Message</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Provide detailed questions on raw material prices, workshop logistics, cooperative margins, or proposal briefs..."
                      value={inquiryMessage}
                      onChange={(e) => setInquiryMessage(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-brand-bg border border-brand-teal/10 rounded-xl text-xs font-semibold focus:outline-none focus:border-brand-rose text-white"
                    />
                  </div>

                  {/* Submit buttons */}
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsInquiryModalOpen(false)}
                      className="flex-1 py-2.5 border border-brand-teal/20 hover:bg-brand-bg/60 text-slate-300 font-bold rounded-xl text-xs cursor-pointer transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 bg-brand-rose hover:bg-brand-rose/90 text-brand-deep font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                      id="modal-inquiry-submit-btn"
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>Send Inquiry</span>
                    </button>
                  </div>
                </div>
              )}
            </form>

          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-brand-dark text-slate-400 border-t border-brand-teal/10 mt-12 py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-brand-rose text-brand-deep flex items-center justify-center font-extrabold text-sm shadow">L</span>
            <span className="text-xs font-extrabold text-white tracking-widest font-display">LocalLens</span>
          </div>
          <p className="text-[10px] text-slate-500 font-mono font-medium text-center md:text-right leading-relaxed max-w-md">
            © 2026 Heritage Municipal Scenario Modeling Trust. Crafted with elegant typography and deep, high-contrast dark-slate styling. All policy briefs generated in real-time by Google Gemini.
          </p>
        </div>
      </footer>

      {/* Floating Interactive Swadeshi AI Heritage Concierge Chatbot */}
      <HeritageChatBot 
        activeCity={activeCity} 
        inputs={inputs} 
        metrics={metrics} 
      />

      </SmoothScroll>

    </div>
    )}
    </>
  );
}
