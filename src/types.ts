export interface PolicyInputs {
  city: string;                     // Selected heritage city
  rickshawSubsidy: number;          // INR per driver monthly (e.g. 1000 - 10000)
  wasteManagementBudget: number;    // Lakhs INR per month (e.g. 50 - 500)
  safetyPatrolIntensity: number;    // Patrols per ward daily (e.g. 1 - 20)
  middlemenCommissionCap: number;   // Max commission % middlemen can charge (e.g. 5 - 50)
  standardizedRatesEnabled: boolean;// Standard rate cap for tours, boats, rides
  touristMultiplier: number;        // Tourist volume multiplier (e.g. 0.5x - 3.0x)
  weatherHazard: 'low' | 'medium' | 'high'; // Monsoon flood / desert heat hazard levels
  activeDirectives?: string[];              // Emergency civic response directives (e.g., ["silt_shoveling", "hydration_booths"])
  generateBrief?: boolean;          // Optional flag to trigger Gemini model brief generation
}

export interface SimulationResult {
  economicDistribution: number;     // % of tourist capital directly pocketed by micro-entrepreneurs
  safetyTrustRating: number;        // Out of 100
  merchantRevenueGrowth: number;    // % year-over-year
  complaintsRate: number;           // Scam / overcharging complaints per 1k tourists
  trafficCongestion: number;         // Traffic delay / congestion %
  weaverCooperativeIncome: number;   // % average growth
  ghatCleanliness: number;          // Cleanliness score %
  aiPolicyBrief?: string;           // Rich Gemini output analyzing the policies
}

export interface Entrepreneur {
  id: string;
  name: string;
  role: string;                     // Flexible heritage craftsman roles
  location: string;
  avatar: string;
  baseIncome: number;               // Base INR daily income
  dailyIncome: number;              // Current calculated daily income based on active policies
  trustScore: number;               // Out of 100
  cooperativeName: string;
  impactStatus: string;             // Short feedback text of how policies affect them
  bio: string;
}

export interface CivicAlert {
  id: string;
  type: 'flood' | 'traffic' | 'cooperative' | 'security';
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'danger';
  timestamp: string;
}

export interface TrustReport {
  id: string;
  reporterName: string;
  incidentType: 'Overcharging' | 'Unlicensed Guide' | 'Harassment' | 'Ghat Littering' | 'Other';
  location: string;
  description: string;
  timestamp: string;
  verifiedReceipt?: {
    merchantName: string;
    lineItems: { item: string; price: number }[];
    total: number;
    credibilityBoost: number;
    isVerified: boolean;
    rawImageName?: string;
  };
}

export interface RealTimeMetric {
  label: string;
  value: string | number;
  unit?: string;
  status: 'optimal' | 'warning' | 'danger';
}

export interface RealTimeFeedData {
  city: string;
  transit: {
    status: 'optimal' | 'congested' | 'delayed' | 'suspended';
    routeScore: number; // out of 100
    metrics: RealTimeMetric[];
  };
  environmental: {
    status: 'normal' | 'moderate' | 'hazard';
    metrics: RealTimeMetric[];
  };
  social: {
    sentimentScore: number; // 0 - 100
    trendingTags: string[];
    activeScamVolume: number; // scam keyword count last hour
    metrics: RealTimeMetric[];
  };
  lastUpdated: string;
}

export interface SavedScenario {
  id: string;
  name: string;
  timestamp: string;
  city: string;
  inputs: PolicyInputs;
  metrics: SimulationResult;
  isCustom?: boolean;
}

