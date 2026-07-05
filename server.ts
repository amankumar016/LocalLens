import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { PolicyInputs, SimulationResult, Entrepreneur, CivicAlert, TrustReport } from "./src/types";

const app = express();
const PORT = 3000;

// Lazy initialize Gemini API client to prevent startup crashes if GEMINI_API_KEY is missing
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.info("GEMINI_API_KEY environment variable is missing. Running in high-fidelity mock fallback mode.");
      return null;
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Circuit breaker state to protect Gemini API key and maintain fast, elegant fallback responses
let last429Time = 0;
const BREAKER_COOLDOWN_MS = 60000; // 60 seconds cooldown

function isGeminiAvailable(): boolean {
  const ai = getAI();
  if (!ai) return false;
  
  if (Date.now() - last429Time < BREAKER_COOLDOWN_MS) {
    const remainingSecs = Math.ceil((BREAKER_COOLDOWN_MS - (Date.now() - last429Time)) / 1000);
    console.info(`[Gemini Circuit Breaker] Active. Bypassing Gemini request to prevent rate-limit spam (cooldown remaining: ${remainingSecs}s)`);
    return false;
  }
  return true;
}

function handleGeminiError(error: any, contextName: string) {
  const errMsg = error instanceof Error ? error.message : String(error);
  
  // Detect rate limit or quota exceeded errors
  if (
    errMsg.includes("429") || 
    errMsg.includes("quota") || 
    errMsg.includes("RESOURCE_EXHAUSTED") || 
    errMsg.includes("rate-limits") ||
    errMsg.includes("limit")
  ) {
    last429Time = Date.now();
    console.info(`[Gemini Circuit Breaker] Rate limit (429 / Quota) detected in ${contextName}. Activating 60s cooldown.`);
  } else {
    console.info(`[Gemini Fallback] Non-rate-limit issue in ${contextName}: ${errMsg}`);
  }
}

// Server-side in-memory cache to prevent duplicate Gemini API requests and avoid rate limiting
const policyBriefCache = new Map<string, string>();
const travelSuggestCache = new Map<string, any>();
const comparativeBriefCache = new Map<string, string>();
const modelSynthesisCache = new Map<string, string>();

const dynamicCityConfigsCache = new Map<string, any>();
const dynamicCityDataPacks = new Map<string, any>();

// Fallback high-fidelity generator for any Indian city
function generateFallbackCityConfig(city: string, state: string) {
  const cleanCity = city.trim();
  const cleanId = cleanCity.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  const themes = ["emerald", "rose", "orange", "amber", "indigo", "teal", "purple"];
  const charCodeSum = Array.from(cleanId).reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  const themeColor = themes[charCodeSum % themes.length];
  
  const colorClasses: Record<string, string> = {
    emerald: "text-emerald-600 border-emerald-200 bg-emerald-50",
    rose: "text-rose-600 border-rose-200 bg-rose-50",
    orange: "text-orange-600 border-orange-200 bg-orange-50",
    amber: "text-amber-600 border-amber-200 bg-amber-50",
    indigo: "text-indigo-600 border-indigo-200 bg-indigo-50",
    teal: "text-teal-600 border-teal-200 bg-teal-50",
    purple: "text-purple-600 border-purple-200 bg-purple-50",
  };
  
  const sliderColors: Record<string, string> = {
    emerald: "accent-emerald-600",
    rose: "accent-rose-600",
    orange: "accent-orange-600",
    amber: "accent-amber-600",
    indigo: "accent-indigo-600",
    teal: "accent-teal-600",
    purple: "accent-purple-600",
  };

  const headerBgs: Record<string, string> = {
    emerald: "bg-gradient-to-r from-emerald-600 to-teal-700",
    rose: "bg-gradient-to-r from-rose-600 to-pink-700",
    orange: "bg-gradient-to-r from-orange-600 to-amber-700",
    amber: "bg-gradient-to-r from-amber-600 to-indigo-800",
    indigo: "bg-gradient-to-r from-indigo-600 to-purple-700",
    teal: "bg-gradient-to-r from-teal-600 to-emerald-700",
    purple: "bg-gradient-to-r from-purple-600 to-pink-700",
  };

  const btnPrimarys: Record<string, string> = {
    emerald: "bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500",
    rose: "bg-rose-600 hover:bg-rose-700 focus:ring-rose-500",
    orange: "bg-orange-600 hover:bg-orange-700 focus:ring-orange-500",
    amber: "bg-amber-600 hover:bg-amber-700 focus:ring-amber-500",
    indigo: "bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500",
    teal: "bg-teal-600 hover:bg-teal-700 focus:ring-teal-500",
    purple: "bg-purple-600 hover:bg-purple-700 focus:ring-purple-500",
  };

  const badgeClasses: Record<string, string> = {
    emerald: "bg-emerald-100 text-emerald-800",
    rose: "bg-rose-100 text-rose-800",
    orange: "bg-orange-100 text-orange-800",
    amber: "bg-amber-100 text-amber-800",
    indigo: "bg-indigo-100 text-indigo-800",
    teal: "bg-teal-100 text-teal-800",
    purple: "bg-purple-100 text-purple-800",
  };

  const selectedTheme = themeColor;
  
  return {
    id: cleanId,
    fullName: `${cleanCity} (${state || "Heritage Site"})`,
    tagline: `Vibrant ${cleanCity} Cultural & Heritage Corridor`,
    description: `Modeling eco-vehicles, local artisan cooperatives, craft marketplaces, and safety patrols across the historic sectors of ${cleanCity}.`,
    themeColor: selectedTheme,
    colorClass: colorClasses[selectedTheme] || colorClasses.indigo,
    sliderColor: sliderColors[selectedTheme] || sliderColors.indigo,
    headerBg: headerBgs[selectedTheme] || headerBgs.indigo,
    btnPrimary: btnPrimarys[selectedTheme] || btnPrimarys.indigo,
    badgeClass: badgeClasses[selectedTheme] || badgeClasses.indigo,
    environmentalHazardLabel: "Local Climate & Dust Concentration",
    environmentalHazardDesc: `Simulates localized weather stress in ${cleanCity}. High hazard restricts noon activities but shifts focus to craft emporiums.`,
    sanitationLabel: "Corridor Cleanliness Rating",
    congestionLabel: "Heritage Transit Bottlenecks",
    coopLabel: "Artisan Co-operative Net Dividends",
    incidentLocations: [`${cleanCity} Bazaar`, `Main Temple Area`, `${cleanCity} Central Crossing`, `Artisan Quarters`, `Riverfront Walk`],
    scenicNodes: [
      { name: `${cleanCity} Central Crossing`, description: "Transit Gridlock Node", x: "25%", y: "25%", iconType: "transit", metricKey: "trafficCongestion" },
      { name: `Artisan Quarters`, description: "Cooperative Craft Handlooms", x: "75%", y: "35%", iconType: "coop", metricKey: "weaverCooperativeIncome" },
      { name: `${cleanCity} Bazaar Sweep`, description: "Sanitation & waste collection zone", x: "35%", y: "70%", iconType: "sanitation", metricKey: "ghatCleanliness" },
      { name: `Main Temple Area`, description: "Tourism Safety Hub", x: "80%", y: "80%", iconType: "anchor", metricKey: "safetyTrustRating" }
    ],
    scenicRoutes: [
      { x1: "25%", y1: "25%", x2: "75%", y2: "35%" },
      { x1: "25%", y1: "25%", x2: "35%", y2: "70%" },
      { x1: "35%", y1: "70%", x2: "80%", y2: "80%" },
      { x1: "75%", y1: "35%", x2: "80%", y2: "80%" }
    ]
  };
}

async function generateDynamicCityData(city: string, state: string) {
  const cleanCity = city.trim();
  const cleanId = cleanCity.toLowerCase().replace(/[^a-z0-9]/g, '');
  const fallbackConfig = generateFallbackCityConfig(cleanCity, state);

  if (isGeminiAvailable()) {
    try {
      const ai = getAI();
      if (ai) {
        const prompt = `You are a professional Urban Planner and Tourism Specialist for Indian Heritage corridors.
We need a highly customized, authentic dataset for a heritage city in India: "${cleanCity}" in state: "${state || "India"}".

Generate a single JSON object containing:
1. A custom "config" structure mapping historical sites and landmarks of ${cleanCity} (including scenic nodes with names, descriptions, coordinates x: 15-85%, y: 15-85%, custom localized hazard label and coop names).
2. A list of 4 "entrepreneurs" with customized names, roles (e.g., "Boatman", "Weaver", "E-Rickshaw Driver", "Toy Maker" or customized equivalent names, but make sure to include "Boatman" or "Weaver" or "E-Rickshaw Driver" or "Toy Maker" as roles so we can map them to our simulator), localized cooperative names, avatars (Unsplash search terms or high-quality image URLs), bios, baseIncomes (approx 300 to 600 INR).
3. A list of 3 custom "alerts" specific to ${cleanCity} environment, traffic, or security.
4. A list of 2 custom "reports" (historical user-reported incidents of overcharging, unlicensed guide, littering, etc. at scenic locations).
5. A "safetyScore" number from 1 to 100 based on previous tourist incidents, climate warnings, and scams.
6. A "safetyDetails" string summarizing previous safety incidents, crowd thresholds, or scam warnings for this city, along with official precautions.

The schema of your response MUST match this JSON exactly:
{
  "config": {
    "fullName": "string (e.g. Rishikesh (Yoga Capital))",
    "tagline": "string",
    "description": "string (1-2 sentences on local micro-artisans & heritage)",
    "themeColor": "emerald" | "rose" | "orange" | "amber" | "indigo" | "teal" | "purple",
    "environmentalHazardLabel": "string (e.g. Ganges Current Surges)",
    "environmentalHazardDesc": "string",
    "sanitationLabel": "string (e.g. Triveni Ghat Cleanliness)",
    "congestionLabel": "string (e.g. Lakshman Jhula Crowd Bottleneck)",
    "coopLabel": "string (e.g. Rafting & Yoga Guild Profit Index)",
    "incidentLocations": ["string", "string", "string", "string", "string"],
    "scenicNodes": [
      {
        "name": "string (exact name of physical landmark)",
        "description": "string",
        "x": "string (percentage e.g. 24%)",
        "y": "string (percentage e.g. 56%)",
        "iconType": "transit" | "coop" | "sanitation" | "anchor",
        "metricKey": "trafficCongestion" | "weaverCooperativeIncome" | "ghatCleanliness" | "safetyTrustRating"
      }
    ],
    "scenicRoutes": [
      { "x1": "string (matches x of node 1)", "y1": "string (matches y of node 1)", "x2": "string", "y2": "string" }
    ]
  },
  "entrepreneurs": [
    {
      "id": "string (e.g. ent-rishikesh-1)",
      "name": "string",
      "role": "string (MUST be one of: 'Boatman', 'Weaver', 'E-Rickshaw Driver', 'Toy Maker')",
      "location": "string",
      "avatar": "string (high-quality portrait photo URL from unsplash)",
      "baseIncome": number,
      "dailyIncome": number,
      "trustScore": number (out of 100),
      "cooperativeName": "string",
      "impactStatus": "string",
      "bio": "string"
    }
  ],
  "alerts": [
    {
      "id": "string",
      "type": "flood" | "traffic" | "security" | "cooperative",
      "title": "string",
      "message": "string",
      "severity": "warning" | "danger" | "info",
      "timestamp": "string"
    }
  ],
  "reports": [
    {
      "id": "string",
      "reporterName": "string",
      "incidentType": "Overcharging" | "Unlicensed Guide" | "Harassment" | "Ghat Littering" | "Other",
      "location": "string",
      "description": "string",
      "timestamp": "string"
    }
  ],
  "safetyScore": number,
  "safetyDetails": "string"
}

Do not include any wrapping backticks or comments. Just return the raw JSON object.`;

        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json"
          }
        });

        if (response.text) {
          const cleanedText = response.text.trim().replace(/^```json\s*/, '').replace(/```$/, '').trim();
          const dataPack = JSON.parse(cleanedText);
          if (dataPack && dataPack.config && dataPack.entrepreneurs) {
            const themeColor = dataPack.config.themeColor || "teal";
            
            const colorClasses: Record<string, string> = {
              emerald: "text-emerald-600 border-emerald-200 bg-emerald-50",
              rose: "text-rose-600 border-rose-200 bg-rose-50",
              orange: "text-orange-600 border-orange-200 bg-orange-50",
              amber: "text-amber-600 border-amber-200 bg-amber-50",
              indigo: "text-indigo-600 border-indigo-200 bg-indigo-50",
              teal: "text-teal-600 border-teal-200 bg-teal-50",
              purple: "text-purple-600 border-purple-200 bg-purple-50",
            };
            
            const sliderColors: Record<string, string> = {
              emerald: "accent-emerald-600",
              rose: "accent-rose-600",
              orange: "accent-orange-600",
              amber: "accent-amber-600",
              indigo: "accent-indigo-600",
              teal: "accent-teal-600",
              purple: "accent-purple-600",
            };

            const headerBgs: Record<string, string> = {
              emerald: "bg-gradient-to-r from-emerald-600 to-teal-700",
              rose: "bg-gradient-to-r from-rose-600 to-pink-700",
              orange: "bg-gradient-to-r from-orange-600 to-amber-700",
              amber: "bg-gradient-to-r from-amber-600 to-indigo-800",
              indigo: "bg-gradient-to-r from-indigo-600 to-purple-700",
              teal: "bg-gradient-to-r from-teal-600 to-emerald-700",
              purple: "bg-gradient-to-r from-purple-600 to-pink-700",
            };

            const btnPrimarys: Record<string, string> = {
              emerald: "bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500",
              rose: "bg-rose-600 hover:bg-rose-700 focus:ring-rose-500",
              orange: "bg-orange-600 hover:bg-orange-700 focus:ring-orange-500",
              amber: "bg-amber-600 hover:bg-amber-700 focus:ring-amber-500",
              indigo: "bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500",
              teal: "bg-teal-600 hover:bg-teal-700 focus:ring-teal-500",
              purple: "bg-purple-600 hover:bg-purple-700 focus:ring-purple-500",
            };

            const badgeClasses: Record<string, string> = {
              emerald: "bg-emerald-100 text-emerald-800",
              rose: "bg-rose-100 text-rose-800",
              orange: "bg-orange-100 text-orange-800",
              amber: "bg-amber-100 text-amber-800",
              indigo: "bg-indigo-100 text-indigo-800",
              teal: "bg-teal-100 text-teal-800",
              purple: "bg-purple-100 text-purple-800",
            };

            dataPack.config.id = cleanId;
            dataPack.config.colorClass = colorClasses[themeColor] || colorClasses.teal;
            dataPack.config.sliderColor = sliderColors[themeColor] || sliderColors.teal;
            dataPack.config.headerBg = headerBgs[themeColor] || headerBgs.teal;
            dataPack.config.btnPrimary = btnPrimarys[themeColor] || btnPrimarys.teal;
            dataPack.config.badgeClass = badgeClasses[themeColor] || badgeClasses.teal;
            dataPack.isHeuristicFallback = false;

            return dataPack;
          }
        }
      }
    } catch (err) {
      handleGeminiError(err, "Dynamic City Data Generation");
    }
  }

  // Heuristic fallbacks for common inputs
  const fallbackEntrepreneurs = [
    {
      id: `ent-${cleanId}-1`,
      name: "Rajesh Kumar",
      role: "Boatman",
      location: fallbackConfig.incidentLocations[4] || `${cleanCity} Riverfront`,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200",
      baseIncome: 450,
      dailyIncome: 450,
      trustScore: 88,
      cooperativeName: `${cleanCity} Boatmen Cooperative Union`,
      impactStatus: "Optimistic about standard fair pricing.",
      bio: `Rajesh coordinates tourist tours across the waterways of ${cleanCity}. He supports a family of five through manual tour rides.`
    },
    {
      id: `ent-${cleanId}-2`,
      name: "Anita Sharma",
      role: "Weaver",
      location: fallbackConfig.incidentLocations[3] || `${cleanCity} Weaver Ward`,
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200&h=200",
      baseIncome: 380,
      dailyIncome: 380,
      trustScore: 92,
      cooperativeName: `${cleanCity} Artisan & Weaving Swasahayata`,
      impactStatus: "Losing major margin to intermediary market brokers.",
      bio: `Anita hand-crafts famous regional traditional items on manual loom setups, preserving centuries-old creative designs.`
    },
    {
      id: `ent-${cleanId}-3`,
      name: "Sanjay Pal",
      role: "E-Rickshaw Driver",
      location: fallbackConfig.incidentLocations[2] || `${cleanCity} Crossing`,
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200&h=200",
      baseIncome: 500,
      dailyIncome: 500,
      trustScore: 82,
      cooperativeName: `${cleanCity} Green Eco-Vehicle Association`,
      impactStatus: "Hoping for battery replacement subsidies.",
      bio: `Sanjay navigates narrow congested streets of ${cleanCity} carrying heritage tourists, striving to reduce air pollution.`
    },
    {
      id: `ent-${cleanId}-4`,
      name: "Sunita Devi",
      role: "Toy Maker",
      location: fallbackConfig.incidentLocations[0] || `${cleanCity} Bazaar`,
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200",
      baseIncome: 320,
      dailyIncome: 320,
      trustScore: 90,
      cooperativeName: `${cleanCity} Women Craft Guild`,
      impactStatus: "Hoping for direct tourist craft-bazaar links.",
      bio: `Sunita creates beautiful miniature souvenirs and lacquer crafts, relying on seasonal tourists.`
    }
  ];

  const fallbackAlerts = [
    {
      id: `alert-${cleanId}-1`,
      type: "flood",
      title: `${cleanCity} Monsoon / Weather Warning`,
      message: "High moisture and winds have slowed outdoor activities. Exercise safety around waterways.",
      severity: "warning",
      timestamp: "10 mins ago"
    },
    {
      id: `alert-${cleanId}-2`,
      type: "traffic",
      title: `${cleanCity} Corridor Crowding`,
      message: "Heavy tourist footfall near the historic gateways. Delay times estimated up to 20 mins.",
      severity: "info",
      timestamp: "30 mins ago"
    },
    {
      id: `alert-${cleanId}-3`,
      type: "security",
      title: "Unverified Service Operators active",
      message: "Reports of unofficial pricing guides near major sites. Verify with QR-code listings.",
      severity: "warning",
      timestamp: "2 hours ago"
    }
  ];

  const fallbackReports = [
    {
      id: `rep-${cleanId}-1`,
      reporterName: "Michael Evans",
      incidentType: "Overcharging",
      location: fallbackConfig.incidentLocations[0],
      description: "Local auto driver insisted on ₹800 for a short trip. The standard rate is ₹150.",
      timestamp: "1 day ago"
    }
  ];

  return {
    config: fallbackConfig,
    entrepreneurs: fallbackEntrepreneurs,
    alerts: fallbackAlerts,
    reports: fallbackReports,
    safetyScore: 85,
    safetyDetails: "Generally very safe and welcoming. Minor risks are restricted to peak festival crowd delays at primary centers and seasonal water hazard warnings. Always check authenticated rate boards before hiring guides."
  };
}

// Support parsing JSON and URL-encoded bodies
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Pre-seeded multi-city micro-entrepreneurs database
const entrepreneursByCity: Record<string, Entrepreneur[]> = {
  varanasi: [
    {
      id: "ent-varanasi-1",
      name: "Ramesh Giri",
      role: "Boatman",
      location: "Dashashwamedh Ghat",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200",
      baseIncome: 450,
      dailyIncome: 450,
      trustScore: 82,
      cooperativeName: "Ganga Shikara Boatmen Union",
      impactStatus: "Optimistic about standardized temple tours.",
      bio: "Ramesh has rowed wooden boats on the Ganga for 25 years. He depends entirely on foreign tourists and high-season rates, but struggles with monsoon silt and fuel costs."
    },
    {
      id: "ent-varanasi-2",
      name: "Amit Soni",
      role: "Weaver",
      location: "Madanpura Saree Lane",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200&h=200",
      baseIncome: 350,
      dailyIncome: 350,
      trustScore: 94,
      cooperativeName: "Banarasi Handloom Co-operative",
      impactStatus: "Hoping to escape middlemen commission traps.",
      bio: "A master artisan weaver of pure silk Banarasi sarees. Despite spending weeks on a single loom piece, middlemen often pocket up to 40% of his margin, leaving him with meager earnings."
    },
    {
      id: "ent-varanasi-3",
      name: "Rahul Pal",
      role: "E-Rickshaw Driver",
      location: "Godowlia Chauraha",
      avatar: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&q=80&w=200&h=200",
      baseIncome: 550,
      dailyIncome: 550,
      trustScore: 78,
      cooperativeName: "Varanasi Eco-Rickshaw Association",
      impactStatus: "Needs subsidies to cover battery replacement costs.",
      bio: "Rahul switched from manual pedal rickshaws to an electric e-rickshaw last year. His battery is degrading, and high traffic bottlenecks near Godowlia limit his daily trips."
    },
    {
      id: "ent-varanasi-4",
      name: "Sita Devi",
      role: "Toy Maker",
      location: "Khojwan Wooden Craft Guild",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200",
      baseIncome: 300,
      dailyIncome: 300,
      trustScore: 91,
      cooperativeName: "Khojwan Craft Swasahayata",
      impactStatus: "Benefitting from local weaver/craft bazaar promotions.",
      bio: "Sita chisels traditional lacquerware wooden toys, a GI-tagged artform of Varanasi. She wants to connect directly with heritage craft buyers to bypass market brokers."
    }
  ],
  jaipur: [
    {
      id: "ent-jaipur-1",
      name: "Govind Prasad",
      role: "Weaver", // Generic role representing pottery creator
      location: "Sanganer Craft Guild",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200&h=200",
      baseIncome: 420,
      dailyIncome: 420,
      trustScore: 89,
      cooperativeName: "Sanganer Blue Pottery Guild",
      impactStatus: "Eager for direct artisan marketplaces.",
      bio: "Govind creates world-famous cobalt blue pottery, using high-heat ovens. Sanganer fuel costs eat his margin, and brokers often take the biggest cut."
    },
    {
      id: "ent-jaipur-2",
      name: "Meera Bai",
      role: "Toy Maker", // Generic role representing puppet artisan
      location: "Johari Bazaar Lane",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200&h=200",
      baseIncome: 320,
      dailyIncome: 320,
      trustScore: 92,
      cooperativeName: "Rajasthani Puppeteers Collective",
      impactStatus: "Optimistic about standardized heritage street rates.",
      bio: "Meera and her children hand-carve and stitch traditional wooden Kathputli puppets. She conducts street performances and hopes for direct traveler bookings."
    },
    {
      id: "ent-jaipur-3",
      name: "Kamal Kishore",
      role: "E-Rickshaw Driver",
      location: "Hawa Mahal Crossing",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200&h=200",
      baseIncome: 580,
      dailyIncome: 580,
      trustScore: 81,
      cooperativeName: "Jaipur Eco-Auto Sangathan",
      impactStatus: "Hawa Mahal traffic restrictions limit peak trips.",
      bio: "Kamal drives tourists through the ancient Pink City gates. Extreme hot summer heatwaves reduce his battery efficiency, causing high charging stress."
    },
    {
      id: "ent-jaipur-4",
      name: "Suresh Saini",
      role: "Boatman", // Generic role representing camel / carriage tour guides
      location: "Amber Palace Plaza",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200&h=200",
      baseIncome: 490,
      dailyIncome: 490,
      trustScore: 85,
      cooperativeName: "Amber Fort Heritage Guides Union",
      impactStatus: "Standardized guiding fees will protect guide dignity.",
      bio: "Suresh coordinates traditional camel rides and tour guides at Amber Fort. He struggles with middlemen commissions at local high-end craft emporiums."
    }
  ],
  kochi: [
    {
      id: "ent-kochi-1",
      name: "Xavier D'Souza",
      role: "Boatman", // Chinese net operator / backwater boatman
      location: "Fort Kochi Beach",
      avatar: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&q=80&w=200&h=200",
      baseIncome: 500,
      dailyIncome: 500,
      trustScore: 86,
      cooperativeName: "Fort Kochi Fishing Net Cooperative",
      impactStatus: "Needs help clearing water hyacinths and plastic clutter.",
      bio: "Xavier operates the iconic massive cantilever Chinese fishing nets. Increasing cost of teakwood structures and coastal plastic clutter reduces his daily catch."
    },
    {
      id: "ent-kochi-2",
      name: "Lakshmi Menon",
      role: "Weaver", // Coir rug weaver
      location: "Kalady Handcraft Guild",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200&h=200",
      baseIncome: 340,
      dailyIncome: 340,
      trustScore: 95,
      cooperativeName: "Kerala Coir Workers Swasahayata",
      impactStatus: "Benefitting from direct coir bazaar promotions.",
      bio: "Lakshmi spins and weaves environment-friendly golden coconut fiber rugs. She is deeply proud of her craft but depends on exports which are prone to broker cuts."
    },
    {
      id: "ent-kochi-3",
      name: "Thomas Mathew",
      role: "E-Rickshaw Driver",
      location: "Mattancherry Spice Street",
      avatar: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&q=80&w=200&h=200",
      baseIncome: 520,
      dailyIncome: 520,
      trustScore: 84,
      cooperativeName: "Mattancherry Eco Tuk-Tuk Association",
      impactStatus: "Hoping for battery swapping grid hubs.",
      bio: "Thomas navigates the narrow historic Jewish Town spice lanes. Narrow lane congestion from loading trucks often chokes his passenger routes."
    },
    {
      id: "ent-kochi-4",
      name: "Unni Krishnan",
      role: "Toy Maker", // Kathakali wood carver
      location: "Vypin Craft Circle",
      avatar: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=200&h=200",
      baseIncome: 380,
      dailyIncome: 380,
      trustScore: 90,
      cooperativeName: "Kathakali Fine Arts Guild",
      impactStatus: "Requires commission protection from luxury emporiums.",
      bio: "Unni hand-carves the elaborate green Kumili masks and wooden dolls representing Kathakali dancers. Tourists buy them as souvenirs but middlemen pocket massive margins."
    }
  ],
  hampi: [
    {
      id: "ent-hampi-1",
      name: "Basavaraj Gowda",
      role: "Boatman", // Coracle boat rowers
      location: "Tungabhadra River Crossing",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200&h=200",
      baseIncome: 460,
      dailyIncome: 460,
      trustScore: 80,
      cooperativeName: "Tungabhadra Coracle Rowers Guild",
      impactStatus: "Monsoon river swell halts row safety operations.",
      bio: "Basavaraj rows travelers in circular coracles across the boulder-strewn Tungabhadra river. He struggles with seasonal aridity and unpredictable river swells."
    },
    {
      id: "ent-hampi-2",
      name: "Pampa Naika",
      role: "Weaver", // Banana fiber basket weaver
      location: "Anegundi Crafts Guild",
      avatar: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=200&h=200",
      baseIncome: 310,
      dailyIncome: 310,
      trustScore: 93,
      cooperativeName: "Kishkinda Banana Fiber Swasahayata",
      impactStatus: "Excited about organic craft exhibitions.",
      bio: "Pampa splits, dries, and weaves local banana plant stems into bio-degradable bags and baskets. Her work supports women artisans in Anegundi village."
    },
    {
      id: "ent-hampi-3",
      name: "Sharanappa",
      role: "E-Rickshaw Driver", // Solar electric carts
      location: "Hampi Bazaar Heritage lane",
      avatar: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=200&h=200",
      baseIncome: 540,
      dailyIncome: 540,
      trustScore: 87,
      cooperativeName: "Vijayanagara Solar Cart Association",
      impactStatus: "Needs expansion of charging stations.",
      bio: "Sharanappa operates clean solar-powered eco-carts to ferry tourists within the eco-sensitive heritage monument zone where fuel cars are strictly banned."
    },
    {
      id: "ent-hampi-4",
      name: "Thimmappa",
      role: "Toy Maker", // Stone sculptor
      location: "Kamalapura Sculpting Yard",
      avatar: "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?auto=format&fit=crop&q=80&w=200&h=200",
      baseIncome: 400,
      dailyIncome: 400,
      trustScore: 91,
      cooperativeName: "Shilpakala Stone Carving Guild",
      impactStatus: "Wants digital QR codes to authenticate handmade work.",
      bio: "Thimmappa hand-carves intricate replicas of the Vittala temple stone chariot and deities. It takes weeks of hammer chiseling, but factory-cast plaster mimics undercut him."
    }
  ]
};

// Mutable copies for runtime simulation and feedback
let activeEntrepreneurs = JSON.parse(JSON.stringify(entrepreneursByCity));

// Pre-seeded active civic alerts
const alertsByCity: Record<string, CivicAlert[]> = {
  varanasi: [
    {
      id: "alert-varanasi-1",
      type: "flood",
      title: "Ganga Water Level Rise",
      message: "Monsoon rains have caused a 1.2m rise. Wooden boat operations are restricted after sunset. Submerged steps at Dashashwamedh Ghat.",
      severity: "warning",
      timestamp: "10 mins ago"
    },
    {
      id: "alert-varanasi-2",
      type: "traffic",
      title: "Godowlia Crossing Congestion",
      message: "High density of e-rickshaws causing gridlock between Godowlia and Dashashwamedh lane. Transit delays up to 25 mins.",
      severity: "danger",
      timestamp: "45 mins ago"
    },
    {
      id: "alert-varanasi-3",
      type: "security",
      title: "Unlicensed Tour Guides Active",
      message: "Reports of fake guides overcharging near Manikarnika Ghat area. Travelers are advised to check QR-code standardized badges.",
      severity: "warning",
      timestamp: "2 hours ago"
    }
  ],
  jaipur: [
    {
      id: "alert-jaipur-1",
      type: "flood", // mapped to weather stress
      title: "Extreme Desert Heat Warning",
      message: "Temperatures expected to exceed 44°C. Local guides and rickshaw drivers urged to carry dehydration salts and halt during mid-day solar peak.",
      severity: "danger",
      timestamp: "15 mins ago"
    },
    {
      id: "alert-jaipur-2",
      type: "traffic",
      title: "Hawa Mahal Chauraha Choked",
      message: "Heavy visitor auto and tour bus traffic near the palace entrance causing extreme pedestrian delays. Alternate routes suggested.",
      severity: "warning",
      timestamp: "30 mins ago"
    },
    {
      id: "alert-jaipur-3",
      type: "security",
      title: "Commission Scheme Alert",
      message: "Uncertified transport operators reported redirecting tourist routes to private craft emporiums for high kickback commissions.",
      severity: "danger",
      timestamp: "1 hour ago"
    }
  ],
  kochi: [
    {
      id: "alert-kochi-1",
      type: "flood",
      title: "Coastal Tide Ingress",
      message: "High sea tide warning near Fort Kochi Chinese nets. Net operation advised with safety lifelines.",
      severity: "warning",
      timestamp: "5 mins ago"
    },
    {
      id: "alert-kochi-2",
      type: "traffic",
      title: "Mattancherry Spice Lane Gridlock",
      message: "Freight loading spice trucks causing complete blockage for tourists. E-rickshaw passage halted.",
      severity: "danger",
      timestamp: "25 mins ago"
    },
    {
      id: "alert-kochi-3",
      type: "cooperative",
      title: "Water Hyacinth Accumulation",
      message: "Backwater silt and floating weeds wrapping around Chinese net gears. Requesting immediate waste clearance team support.",
      severity: "warning",
      timestamp: "3 hours ago"
    }
  ],
  hampi: [
    {
      id: "alert-hampi-1",
      type: "flood",
      title: "Tungabhadra River Release Alert",
      message: "Reservoir gate releases expected to raise downstream water volume by 2m. Coracle boat crossings restricted near Virupaksha bank.",
      severity: "danger",
      timestamp: "12 mins ago"
    },
    {
      id: "alert-hampi-2",
      type: "traffic",
      title: "Monuments Solar Cart Bottleneck",
      message: "High tourist queues at Vittala Temple electric shuttle station. High wait times reported. Visitors are advised to explore nearby walks.",
      severity: "info",
      timestamp: "50 mins ago"
    },
    {
      id: "alert-hampi-3",
      type: "security",
      title: "Boulder Path Safety Alert",
      message: "Heat stress on boulder walks. Recommended to hire licensed heritage guides and carry sufficient hydration fluids.",
      severity: "warning",
      timestamp: "2 hours ago"
    }
  ]
};

// User submitted reports log database
const reportsLogByCity: Record<string, TrustReport[]> = {
  varanasi: [
    {
      id: "rep-varanasi-1",
      reporterName: "David Miller",
      incidentType: "Overcharging",
      location: "Assi Ghat",
      description: "Boatman charged 1500 INR for a simple 30 min row ride, standard rate was stated to be 400 INR. No price card shown.",
      timestamp: "1 day ago"
    },
    {
      id: "rep-varanasi-2",
      reporterName: "Priya Sharma",
      incidentType: "Ghat Littering",
      location: "Dashashwamedh Ghat",
      description: "Commercial plastic tea cups left piled behind the secondary ritual platforms. Cleaning crew was absent.",
      timestamp: "2 days ago"
    }
  ],
  jaipur: [
    {
      id: "rep-jaipur-1",
      reporterName: "Elena Rostova",
      incidentType: "Overcharging",
      location: "Amber Fort Gateway",
      description: "An unauthorized tour guide insisted on charging 1200 INR. When I showed the digital tariff poster, he became hostile.",
      timestamp: "1 day ago"
    }
  ],
  kochi: [
    {
      id: "rep-kochi-1",
      reporterName: "Anand Krishnan",
      incidentType: "Ghat Littering",
      location: "Fort Kochi Nets Walk",
      description: "Piles of plastic packaging from street food stalls floating around the net piers. It diminishes the heritage view.",
      timestamp: "3 hours ago"
    }
  ],
  hampi: [
    {
      id: "rep-hampi-1",
      reporterName: "Sanjay Mehta",
      incidentType: "Unlicensed Guide",
      location: "Royal Enclosure Ruins",
      description: "Self-proclaimed guide claiming the stone chariot area was closed unless we paid him an entry facilitation bribe.",
      timestamp: "12 hours ago"
    }
  ]
};

// Dynamic Multi-City Policy Scenario Calculator
function calculateCivicMetrics(inputs: PolicyInputs): SimulationResult {
  const {
    city,
    rickshawSubsidy,
    wasteManagementBudget,
    safetyPatrolIntensity,
    middlemenCommissionCap,
    standardizedRatesEnabled,
    touristMultiplier,
    weatherHazard
  } = inputs;

  // Let's modify base coefficients and calculation formulas based on city traits to feel completely real and responsive!
  let baseEcon = 38;
  let baseSafety = 52;
  let baseGrowth = 5;
  let baseComplaints = 42;
  let baseCongestion = 40;
  let baseCoop = 4;
  let baseClean = 48;

  if (city === 'jaipur') {
    baseEcon = 32; // commissions are traditionally higher in Jaipur emporiums
    baseSafety = 56;
    baseCongestion = 45; // Pink City gates create severe physical bottlenecks
    baseClean = 50;
  } else if (city === 'kochi') {
    baseEcon = 40; // cooperatives are relatively well established in Kerala
    baseSafety = 60; // high safety trust index generally
    baseCongestion = 35;
    baseClean = 44; // coastal plastic silt requires constant attention
  } else if (city === 'hampi') {
    baseEcon = 35;
    baseSafety = 50; // isolated ruins require more remote patrols
    baseCongestion = 30; // spread-out monument park layout has lower congestion
    baseClean = 55; // ASI protected zone keeps ruins relatively pristine
  }

  // 1. Economic Distribution Index (%)
  // Capping commission directly increases creator/artisan take-home share
  const commCapEffect = (50 - middlemenCommissionCap) * 0.82;
  const subsidyEffect = (rickshawSubsidy / 1000) * 1.5;
  const ratesEffect = standardizedRatesEnabled ? 10 : 0;
  let economicDistribution = baseEcon + commCapEffect + subsidyEffect + ratesEffect;
  economicDistribution = Math.min(96, Math.max(20, economicDistribution));

  // 2. Traveler Safety Trust Rating (1-100)
  const patrolEffect = safetyPatrolIntensity * 2.0;
  const ratesTrust = standardizedRatesEnabled ? 15 : -6;
  const weatherEffect = weatherHazard === 'high' ? -18 : weatherHazard === 'medium' ? -6 : 0;
  const touristStrain = (touristMultiplier - 1) * 8;
  let safetyTrustRating = baseSafety + patrolEffect + ratesTrust + weatherEffect - touristStrain;
  safetyTrustRating = Math.min(98, Math.max(22, safetyTrustRating));

  // 3. Local Merchant Revenue Growth (%)
  const tourEffect = touristMultiplier * 11.5;
  const trustGrowth = (safetyTrustRating - 50) * 0.18;
  const weatherSqueeze = weatherHazard === 'high' ? -14 : weatherHazard === 'medium' ? -4 : 0;
  const cleanGrowth = (wasteManagementBudget / 100) * 2.2;
  let merchantRevenueGrowth = baseGrowth + tourEffect + trustGrowth + weatherSqueeze + cleanGrowth;
  merchantRevenueGrowth = Math.min(50, Math.max(-18, merchantRevenueGrowth));

  // 4. Scam & Overcharging Complaints (per 1k tourists)
  const patrolDeterrent = safetyPatrolIntensity * 1.7;
  const standardRatesCut = standardizedRatesEnabled ? 22 : 0;
  const middlemanGreed = (middlemenCommissionCap - 10) * 0.28;
  const crowdFriction = (touristMultiplier - 1) * 9.5;
  let complaintsRate = baseComplaints - patrolDeterrent - standardRatesCut + middlemanGreed + crowdFriction;
  complaintsRate = Math.min(88, Math.max(1, complaintsRate));

  // 5. Traffic Congestion Index (%)
  const rickshawDensity = (rickshawSubsidy / 1000) * 1.6;
  const touristGridlock = touristMultiplier * 15.5;
  const trafficPatrolGuard = safetyPatrolIntensity * 0.7;
  const weatherDetour = weatherHazard === 'high' ? 24 : weatherHazard === 'medium' ? 8 : 0;
  let trafficCongestion = baseCongestion + rickshawDensity + touristGridlock - trafficPatrolGuard + weatherDetour;
  trafficCongestion = Math.min(98, Math.max(15, trafficCongestion));

  // 6. Cooperative Net Income Growth (%)
  const commissionSave = (50 - middlemenCommissionCap) * 0.98;
  const touristVolumeBoost = touristMultiplier * 5.5;
  let weaverCooperativeIncome = baseCoop + commissionSave + touristVolumeBoost;
  weaverCooperativeIncome = Math.min(55, Math.max(-8, weaverCooperativeIncome));

  // 7. Sanitation / Cleanliness Score (%)
  const budgetCleaning = (wasteManagementBudget / 10) * 0.92;
  const crowdDebris = (touristMultiplier - 1) * 11.5;
  const weatherSilt = weatherHazard === 'high' ? -19 : weatherHazard === 'medium' ? -5 : 0;
  const patrolFines = safetyPatrolIntensity * 0.85;
  let ghatCleanliness = baseClean + budgetCleaning - crowdDebris + weatherSilt + patrolFines;
  ghatCleanliness = Math.min(99, Math.max(18, ghatCleanliness));

  return {
    economicDistribution: parseFloat(economicDistribution.toFixed(1)),
    safetyTrustRating: parseFloat(safetyTrustRating.toFixed(1)),
    merchantRevenueGrowth: parseFloat(merchantRevenueGrowth.toFixed(1)),
    complaintsRate: parseFloat(complaintsRate.toFixed(1)),
    trafficCongestion: parseFloat(trafficCongestion.toFixed(1)),
    weaverCooperativeIncome: parseFloat(weaverCooperativeIncome.toFixed(1)),
    ghatCleanliness: parseFloat(ghatCleanliness.toFixed(1))
  };
}

// Generate the localized impacts on individual artisans / entrepreneurs
function updateEntrepreneursIncome(inputs: PolicyInputs, metrics: SimulationResult): Entrepreneur[] {
  const city = inputs.city || 'varanasi';
  const baselineList = entrepreneursByCity[city] || entrepreneursByCity.varanasi;

  return baselineList.map(e => {
    let multiplier = 1.0;
    let trustOffset = 0;
    let statusText = "";

    // City Specific Artisan Impacts
    if (city === 'varanasi') {
      if (e.role === "Boatman") {
        multiplier += (inputs.touristMultiplier - 1) * 0.4;
        if (inputs.standardizedRatesEnabled) {
          multiplier -= 0.1;
          trustOffset += 12;
          statusText = "Stable rates have built great traveler goodwill.";
        } else {
          trustOffset -= 8;
          statusText = "Compelled to bargain heavily to cover fuel costs.";
        }
        if (inputs.weatherHazard === 'high') {
          multiplier -= 0.6;
          statusText = "🚨 Ganga level high. Row boat tours suspended.";
        }
        if (metrics.ghatCleanliness > 75) {
          multiplier += 0.15;
        }
      } else if (e.role === "Weaver") {
        const commissionSaved = 50 - inputs.middlemenCommissionCap;
        multiplier += (commissionSaved / 100) * 0.85;
        multiplier += (inputs.touristMultiplier - 1) * 0.25;
        if (inputs.middlemenCommissionCap <= 15) {
          statusText = "🎉 Record loom profits under direct trade protections!";
        } else {
          statusText = "Losing heavy handloom artisan margin to saree brokers.";
        }
      } else if (e.role === "E-Rickshaw Driver") {
        multiplier += (inputs.rickshawSubsidy / 4000) * 0.35;
        multiplier += (inputs.touristMultiplier - 1) * 0.3;
        if (metrics.trafficCongestion > 75) {
          multiplier -= 0.25;
          statusText = "Gridlock near Godowlia crossing chokes daily passenger trips.";
        } else if (inputs.rickshawSubsidy > 5000) {
          statusText = "Battery subsidy and dedicated green lanes support driver earnings.";
        } else {
          statusText = "Breaking even on high commercial battery recharging costs.";
        }
      } else if (e.role === "Toy Maker") {
        multiplier += (inputs.touristMultiplier - 1) * 0.2;
        const commissionSaved = 50 - inputs.middlemenCommissionCap;
        multiplier += (commissionSaved / 100) * 0.45;
        if (metrics.ghatCleanliness > 70) {
          multiplier += 0.1;
          statusText = "Healthy craft bazaar footfall due to pristine lanes.";
        } else {
          statusText = "Struggling to bypass market brokers to sell wood lacquer crafts.";
        }
      }
    } else if (city === 'jaipur') {
      if (e.role === "Weaver") { // Blue Pottery
        const commissionSaved = 50 - inputs.middlemenCommissionCap;
        multiplier += (commissionSaved / 100) * 0.9;
        multiplier += (inputs.touristMultiplier - 1) * 0.3;
        if (inputs.middlemenCommissionCap <= 20) {
          statusText = "Pottery kiln running full-time. High direct consumer margin.";
        } else {
          statusText = "Bazaar showroom commissions absorb 45% of pottery value.";
        }
      } else if (e.role === "Toy Maker") { // Puppeteer
        multiplier += (inputs.touristMultiplier - 1) * 0.45;
        if (inputs.standardizedRatesEnabled) {
          trustOffset += 14;
          statusText = "Standard performance rates have stopped tip extortion.";
        } else {
          statusText = "Bazaar tipping is unstable. Income relies on unpredictable tourists.";
        }
        if (inputs.weatherHazard === 'high') {
          multiplier -= 0.4;
          statusText = "🚨 Intense 45°C heatwaves empty street performance squares.";
        }
      } else if (e.role === "E-Rickshaw Driver") { // Pink City Auto
        multiplier += (inputs.rickshawSubsidy / 3500) * 0.35;
        if (metrics.trafficCongestion > 70) {
          multiplier -= 0.2;
          statusText = "Severe auto congestion inside Old Gates slows peak tours.";
        } else {
          statusText = "Electric battery swaps are well supported under the municipal plan.";
        }
      } else if (e.role === "Boatman") { // Camel tour guides
        multiplier += (inputs.touristMultiplier - 1) * 0.3;
        const commissionSaved = 50 - inputs.middlemenCommissionCap;
        multiplier += (commissionSaved / 100) * 0.35;
        if (inputs.standardizedRatesEnabled) {
          statusText = "Direct guild-badged tours bring high international referrals.";
        } else {
          statusText = "Relying on unauthorized bazaar brokers for Fort traveler leads.";
        }
      }
    } else if (city === 'kochi') {
      if (e.role === "Boatman") { // Chinese Net / Backwater ferry
        multiplier += (inputs.touristMultiplier - 1) * 0.35;
        if (inputs.weatherHazard === 'high') {
          multiplier -= 0.5;
          statusText = "🚨 Rough coastal tides restrict backwater boat tours.";
        }
        if (metrics.ghatCleanliness > 75) {
          multiplier += 0.2;
          statusText = "Clean shores attract high marine diners to catch stalls.";
        } else {
          statusText = "Floating plastic and hyacinths tangle in Chinese net weights.";
        }
      } else if (e.role === "Weaver") { // Coir Rug
        const commissionSaved = 50 - inputs.middlemenCommissionCap;
        multiplier += (commissionSaved / 100) * 0.8;
        if (inputs.middlemenCommissionCap <= 20) {
          statusText = "Coir weaver union payouts hit record high, bypassing export brokers.";
        } else {
          statusText = "Export brokers pocketing major coir fiber rug margins.";
        }
      } else if (e.role === "E-Rickshaw Driver") { // Mattancherry Tuk Tuk
        multiplier += (inputs.rickshawSubsidy / 4000) * 0.4;
        if (metrics.trafficCongestion > 75) {
          multiplier -= 0.22;
          statusText = "Freight container loading chokes narrow Spice Street tracks.";
        } else {
          statusText = "Smooth eco e-tuk operation along Fort Kochi heritage lanes.";
        }
      } else if (e.role === "Toy Maker") { // Kathakali Carver
        multiplier += (inputs.touristMultiplier - 1) * 0.25;
        const commissionSaved = 50 - inputs.middlemenCommissionCap;
        multiplier += (commissionSaved / 100) * 0.5;
        if (inputs.middlemenCommissionCap <= 15) {
          statusText = "Direct sale of Kumili dancer masks yields stable craft wages.";
        } else {
          statusText = "Heavy luxury resort gift shop markups bypass local artisan.";
        }
      }
    } else if (city === 'hampi') {
      if (e.role === "Boatman") { // Coracle rowers
        multiplier += (inputs.touristMultiplier - 1) * 0.4;
        if (inputs.weatherHazard === 'high') {
          multiplier -= 0.65;
          statusText = "🚨 Tungabhadra river discharge levels dangerous. Coracles halted.";
        } else if (inputs.standardizedRatesEnabled) {
          statusText = "Standardized tourist ferry rate brings highly stable row wages.";
        } else {
          statusText = "Vicious bargaining at river banks drains daily boat revenues.";
        }
      } else if (e.role === "Weaver") { // Banana Fiber Baskets
        const commissionSaved = 50 - inputs.middlemenCommissionCap;
        multiplier += (commissionSaved / 100) * 0.75;
        multiplier += (inputs.touristMultiplier - 1) * 0.3;
        if (inputs.middlemenCommissionCap <= 15) {
          statusText = "Sustaining a female-run basket weaving cooperative in Anegundi.";
        } else {
          statusText = "Craft broker margins dilute banana fiber organic wages.";
        }
      } else if (e.role === "E-Rickshaw Driver") { // Solar electric carts
        multiplier += (inputs.rickshawSubsidy / 3000) * 0.45;
        if (metrics.trafficCongestion > 65) {
          multiplier -= 0.15;
          statusText = "Heavy visitor lines at temple solar shuttle docks limit daily loops.";
        } else {
          statusText = "Excellent zero-emission transport within the protected ASI heritage zone.";
        }
      } else if (e.role === "Toy Maker") { // Stone Sculptor
        multiplier += (inputs.touristMultiplier - 1) * 0.2;
        const commissionSaved = 50 - inputs.middlemenCommissionCap;
        multiplier += (commissionSaved / 100) * 0.6;
        if (metrics.ghatCleanliness > 75) {
          multiplier += 0.15;
          statusText = "Clean monument plazas attract tourists directly to sculptor yard.";
        } else {
          statusText = "Plaster casts saturate market; local stone carving craft under threat.";
        }
      }
    } else {
      // Generic Indian City Dynamic Policy updates based on role
      if (e.role.toLowerCase().includes("boatman") || e.role.toLowerCase().includes("guide") || e.role.toLowerCase().includes("pilot")) {
        multiplier += (inputs.touristMultiplier - 1) * 0.35;
        if (inputs.standardizedRatesEnabled) {
          multiplier -= 0.08;
          trustOffset += 10;
          statusText = "Standardized ride and service rates have built solid client confidence.";
        } else {
          trustOffset -= 6;
          statusText = "Fierce bargaining at central stands stresses daily income margins.";
        }
        if (inputs.weatherHazard === 'high') {
          multiplier -= 0.55;
          statusText = "🚨 Extreme hazard warnings restrict outdoor excursions.";
        }
      } else if (e.role.toLowerCase().includes("weaver") || e.role.toLowerCase().includes("artisan") || e.role.toLowerCase().includes("craft") || e.role.toLowerCase().includes("maker")) {
        const commissionSaved = 50 - inputs.middlemenCommissionCap;
        multiplier += (commissionSaved / 100) * 0.8;
        multiplier += (inputs.touristMultiplier - 1) * 0.25;
        if (inputs.middlemenCommissionCap <= 20) {
          statusText = "Direct trade cooperative links are securing high artisan take-home pay.";
        } else {
          statusText = "Broker commissions digest a heavy portion of handmade retail profits.";
        }
      } else if (e.role.toLowerCase().includes("driver") || e.role.toLowerCase().includes("auto") || e.role.toLowerCase().includes("rickshaw") || e.role.toLowerCase().includes("cart")) {
        multiplier += (inputs.rickshawSubsidy / 4000) * 0.4;
        multiplier += (inputs.touristMultiplier - 1) * 0.3;
        if (metrics.trafficCongestion > 75) {
          multiplier -= 0.2;
          statusText = "Heavy peak-hour street delays reduce the number of possible daily runs.";
        } else if (inputs.rickshawSubsidy > 5000) {
          statusText = "Municipal green vehicle subsidies help offset high battery recharging rates.";
        } else {
          statusText = "Breaking even on commercial vehicle batteries and route permits.";
        }
      } else {
        multiplier += (inputs.touristMultiplier - 1) * 0.2;
        const commissionSaved = 50 - inputs.middlemenCommissionCap;
        multiplier += (commissionSaved / 100) * 0.4;
        statusText = "Enjoying stable local demand from heritage corridor travelers.";
      }
    }

    const dailyIncome = Math.round(e.baseIncome * multiplier);
    const trustScore = Math.min(100, Math.max(10, Math.round(e.trustScore + trustOffset)));

    return {
      ...e,
      dailyIncome,
      trustScore,
      impactStatus: statusText
    };
  });
}

// API Routes
app.get("/api/cities/config", async (req, res) => {
  const cityQuery = (req.query.city as string || "").trim();
  const stateQuery = (req.query.state as string || "").trim();
  if (!cityQuery) {
    return res.status(400).json({ error: "Missing 'city' query parameter." });
  }

  const cleanId = cityQuery.toLowerCase().replace(/[^a-z0-9]/g, '');

  // 1. If it's one of the 4 hardcoded pre-seeded cities, return its baseline config
  const preseededConfigs: Record<string, any> = {
    varanasi: {
      id: "varanasi",
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
      ],
      safetyScore: 92,
      safetyDetails: "Highly visited sacred core. Standard safety patrols active 24/7. Minor crowding at evening Ganga Aarti and wet-slick stone steps during high monsoonal silts require care."
    },
    jaipur: {
      id: "jaipur",
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
      ],
      safetyScore: 89,
      safetyDetails: "Secure heritage hub. Previous incidents limited to aggressive commission brokers and overcharging at bazaars. Official QR scanning and price boards help protect visitors."
    },
    kochi: {
      id: "kochi",
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
      ],
      safetyScore: 94,
      safetyDetails: "Extremely high safety scores. Very friendly locals and low crime. Watch for coastal high waves during active summer monsoons."
    },
    hampi: {
      id: "hampi",
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
      ],
      safetyScore: 91,
      safetyDetails: "Protected ASI Heritage reserve. Very low violent crime rates. Minor incidents of monkey snatching near temple steps and excessive heat dehydration. Stay well hydrated."
    }
  };

  if (preseededConfigs[cleanId]) {
    return res.json(preseededConfigs[cleanId]);
  }

  // 2. If it is already in dynamic cache, return it
  if (dynamicCityConfigsCache.has(cleanId)) {
    return res.json(dynamicCityConfigsCache.get(cleanId));
  }

  // 3. Otherwise, dynamically generate the entire city datapack
  console.log(`Generating dynamic city data for: ${cityQuery}`);
  const dataPack = await generateDynamicCityData(cityQuery, stateQuery);
  
  // Save to caches
  dynamicCityConfigsCache.set(cleanId, dataPack.config);
  dynamicCityDataPacks.set(cleanId, dataPack);

  res.json(dataPack.config);
});

app.get("/api/entrepreneurs", (req, res) => {
  const city = (req.query.city as string || 'varanasi').toLowerCase();
  const list = activeEntrepreneurs[city] || (dynamicCityDataPacks.has(city) ? dynamicCityDataPacks.get(city).entrepreneurs : null) || entrepreneursByCity[city] || entrepreneursByCity.varanasi;
  res.json(list);
});

app.get("/api/alerts", (req, res) => {
  const city = (req.query.city as string || 'varanasi').toLowerCase();
  const list = (dynamicCityDataPacks.has(city) ? dynamicCityDataPacks.get(city).alerts : null) || alertsByCity[city] || alertsByCity.varanasi;
  res.json(list);
});

app.get("/api/reports", (req, res) => {
  const city = (req.query.city as string || 'varanasi').toLowerCase();
  const list = (dynamicCityDataPacks.has(city) ? dynamicCityDataPacks.get(city).reports : null) || reportsLogByCity[city] || reportsLogByCity.varanasi;
  res.json(list);
});

// Custom feeds overrides store
const feedOverrides: Record<string, Record<string, number>> = {
  varanasi: {},
  jaipur: {},
  kochi: {},
  hampi: {}
};

// GET Real-Time feeds data dynamically compiled based on active city and policy parameters
app.get("/api/feeds/realtime", (req, res) => {
  const city = (req.query.city as string || 'varanasi').toLowerCase();
  const rickshawSubsidy = parseInt(req.query.rickshawSubsidy as string) || 4000;
  const wasteManagementBudget = parseInt(req.query.wasteManagementBudget as string) || 150;
  const safetyPatrolIntensity = parseInt(req.query.safetyPatrolIntensity as string) || 6;
  const middlemenCommissionCap = parseInt(req.query.middlemenCommissionCap as string) || 30;
  const standardizedRatesEnabled = req.query.standardizedRatesEnabled === "true";
  const touristMultiplier = parseFloat(req.query.touristMultiplier as string) || 1.5;
  const weatherHazard = (req.query.weatherHazard as string || 'low').toLowerCase();

  const cityOverrides = feedOverrides[city] || {};

  // Slight random jitter for live aesthetic (+/- 2 on values)
  const jitter = (base: number) => base + (Math.random() * 4 - 2);

  let data: any = {};

  if (city === 'varanasi') {
    const transitStatus = touristMultiplier > 2.2 ? 'congested' : (weatherHazard === 'high' ? 'suspended' : 'optimal');
    const pm25Val = cityOverrides.pm25 !== undefined 
      ? Number(cityOverrides.pm25)
      : Math.round(jitter(95 + (touristMultiplier * 15) - (rickshawSubsidy / 1000) * 4));
    
    const turbidityVal = cityOverrides.turbidity !== undefined
      ? Number(cityOverrides.turbidity)
      : Math.round(jitter(45 + (weatherHazard === 'high' ? 65 : weatherHazard === 'medium' ? 25 : 0) - (wasteManagementBudget / 10)));

    const activeBoats = Math.max(0, Math.round(jitter(28 - (weatherHazard === 'high' ? 24 : weatherHazard === 'medium' ? 10 : 0) + (touristMultiplier * 5))));
    const scamVolume = Math.max(0, Math.round(8 + (touristMultiplier * 5) - (safetyPatrolIntensity * 0.8) - (standardizedRatesEnabled ? 4 : 0)));

    data = {
      city,
      transit: {
        status: transitStatus,
        routeScore: Math.round(Math.max(15, Math.min(99, 85 - (touristMultiplier * 10) - (weatherHazard === 'high' ? 50 : 0)))),
        metrics: [
          { label: "Dashashwamedh Corridor Delay", value: transitStatus === 'congested' ? "26 mins" : (weatherHazard === 'high' ? "Ferry Suspended" : "8 mins"), status: transitStatus === 'congested' ? 'danger' : 'optimal' },
          { label: "Ganga Boat GPS Tracker Active", value: `${activeBoats} row boats`, status: activeBoats < 10 ? 'warning' : 'optimal' },
          { label: "E-Rickshaw Charging Load", value: "34 kW average", status: "optimal" }
        ]
      },
      environmental: {
        status: weatherHazard === 'high' ? 'hazard' : (pm25Val > 120 ? 'moderate' : 'normal'),
        metrics: [
          { label: "River Silt Turbidity", value: `${turbidityVal} NTU`, status: turbidityVal > 80 ? 'danger' : (turbidityVal > 50 ? 'warning' : 'optimal') },
          { label: "PM2.5 Intersection Air", value: `${pm25Val} µg/m³`, status: pm25Val > 150 ? 'danger' : (pm25Val > 100 ? 'warning' : 'optimal') },
          { label: "Water Level Above Normal", value: weatherHazard === 'high' ? "1.4m (Severe)" : (weatherHazard === 'medium' ? "0.5m (Moderate)" : "0.1m"), status: weatherHazard === 'high' ? 'danger' : 'optimal' }
        ]
      },
      social: {
        sentimentScore: Math.round(Math.max(10, Math.min(99, 65 + (standardizedRatesEnabled ? 15 : -10) + (safetyPatrolIntensity * 1.5) - (middlemenCommissionCap * 0.4)))),
        trendingTags: ["#KashiGhats", "#BanarasiHandloom", "#SaveGangaSilt", "#StandardTariffs"],
        activeScamVolume: scamVolume,
        metrics: [
          { label: "Citizen Positive Sentiment", value: `${Math.round(Math.max(10, Math.min(99, 65 + (standardizedRatesEnabled ? 15 : -10) + (safetyPatrolIntensity * 1.5) - (middlemenCommissionCap * 0.4))))}%`, status: 'optimal' },
          { label: "Viral Broker Complaint Rate", value: `${scamVolume} tweets/hr`, status: scamVolume > 10 ? 'danger' : (scamVolume > 5 ? 'warning' : 'optimal') }
        ]
      }
    };
  } else if (city === 'jaipur') {
    const transitStatus = touristMultiplier > 2.5 ? 'congested' : (weatherHazard === 'high' ? 'delayed' : 'optimal');
    const tempVal = cityOverrides.temperature !== undefined
      ? Number(cityOverrides.temperature)
      : Math.round(jitter(32 + (weatherHazard === 'high' ? 12 : weatherHazard === 'medium' ? 5 : 0)));

    const dustVal = cityOverrides.turbidity !== undefined
      ? Number(cityOverrides.turbidity)
      : Math.round(jitter(85 + (weatherHazard === 'high' ? 50 : 15) - (wasteManagementBudget / 12)));

    const activeGuides = Math.max(0, Math.round(jitter(45 + (touristMultiplier * 10) - (weatherHazard === 'high' ? 20 : 0))));
    const scamVolume = Math.max(0, Math.round(12 + (touristMultiplier * 6) - (safetyPatrolIntensity * 1.2) - (standardizedRatesEnabled ? 6 : 0)));

    data = {
      city,
      transit: {
        status: transitStatus,
        routeScore: Math.round(Math.max(15, Math.min(99, 82 - (touristMultiplier * 12) - (weatherHazard === 'high' ? 25 : 0)))),
        metrics: [
          { label: "Hawa Mahal Chauraha Delay", value: transitStatus === 'congested' ? "32 mins" : "12 mins", status: transitStatus === 'congested' ? 'danger' : 'optimal' },
          { label: "Amber Fort Guideline Logs", value: `${activeGuides} guides active`, status: activeGuides < 25 ? 'warning' : 'optimal' },
          { label: "Auto-Rickshaw Battery Temp", value: weatherHazard === 'high' ? "46°C (Critical)" : "35°C (Stable)", status: weatherHazard === 'high' ? 'danger' : 'optimal' }
        ]
      },
      environmental: {
        status: weatherHazard === 'high' ? 'hazard' : (tempVal > 40 ? 'moderate' : 'normal'),
        metrics: [
          { label: "Bazaar Particulate Dust", value: `${dustVal} AQI`, status: dustVal > 150 ? 'danger' : (dustVal > 100 ? 'warning' : 'optimal') },
          { label: "Ambient Air Temperature", value: `${tempVal}°C`, status: tempVal > 42 ? 'danger' : (tempVal > 38 ? 'warning' : 'optimal') },
          { label: "Solar UV Radiance Index", value: weatherHazard === 'high' ? "11.5 Extreme" : "7.2 Moderate", status: weatherHazard === 'high' ? 'danger' : 'optimal' }
        ]
      },
      social: {
        sentimentScore: Math.round(Math.max(10, Math.min(99, 62 + (standardizedRatesEnabled ? 18 : -12) + (safetyPatrolIntensity * 1.8) - (middlemenCommissionCap * 0.5)))),
        trendingTags: ["#PinkCityPottery", "#HawaMahalTours", "#DesertHeatwave", "#EndMiddlemanToll"],
        activeScamVolume: scamVolume,
        metrics: [
          { label: "Citizen Positive Sentiment", value: `${Math.round(Math.max(10, Math.min(99, 62 + (standardizedRatesEnabled ? 18 : -12) + (safetyPatrolIntensity * 1.8) - (middlemenCommissionCap * 0.5))))}%`, status: 'optimal' },
          { label: "Viral Broker Complaint Rate", value: `${scamVolume} tweets/hr`, status: scamVolume > 12 ? 'danger' : (scamVolume > 6 ? 'warning' : 'optimal') }
        ]
      }
    };
  } else if (city === 'kochi') {
    const transitStatus = touristMultiplier > 2.4 ? 'congested' : 'optimal';
    const hyacinthVal = cityOverrides.turbidity !== undefined
      ? Number(cityOverrides.turbidity)
      : Math.round(jitter(35 + (weatherHazard === 'high' ? 45 : weatherHazard === 'medium' ? 15 : 0) - (wasteManagementBudget / 8)));

    const pm25Val = cityOverrides.pm25 !== undefined
      ? Number(cityOverrides.pm25)
      : Math.round(jitter(65 + (touristMultiplier * 8) - (rickshawSubsidy / 1000) * 3));

    const activeNets = Math.max(0, Math.round(jitter(16 - (weatherHazard === 'high' ? 8 : 0))));
    const scamVolume = Math.max(0, Math.round(6 + (touristMultiplier * 4) - (safetyPatrolIntensity * 0.7) - (standardizedRatesEnabled ? 3 : 0)));

    data = {
      city,
      transit: {
        status: transitStatus,
        routeScore: Math.round(Math.max(15, Math.min(99, 88 - (touristMultiplier * 8)))),
        metrics: [
          { label: "Spice Street Passage Delay", value: transitStatus === 'congested' ? "18 mins" : "5 mins", status: transitStatus === 'congested' ? 'danger' : 'optimal' },
          { label: "Fort Kochi Marine Ferry Log", value: "Optimal, 8 mins interval", status: "optimal" },
          { label: "Chinese Fishing Net GPS Link", value: `${activeNets} nets active`, status: activeNets < 8 ? 'warning' : 'optimal' }
        ]
      },
      environmental: {
        status: weatherHazard === 'high' ? 'hazard' : 'normal',
        metrics: [
          { label: "Waterway Hyacinth Density", value: `${hyacinthVal}% surface`, status: hyacinthVal > 70 ? 'danger' : (hyacinthVal > 40 ? 'warning' : 'optimal') },
          { label: "PM2.5 Coastal Air", value: `${pm25Val} µg/m³`, status: pm25Val > 120 ? 'danger' : 'optimal' },
          { label: "Fort Kochi Sea Tide Height", value: weatherHazard === 'high' ? "+1.1m (High Tide)" : "+0.4m (Normal)", status: weatherHazard === 'high' ? 'danger' : 'optimal' }
        ]
      },
      social: {
        sentimentScore: Math.round(Math.max(10, Math.min(99, 68 + (standardizedRatesEnabled ? 12 : -8) + (safetyPatrolIntensity * 1.4) - (middlemenCommissionCap * 0.35)))),
        trendingTags: ["#FortKochiNets", "#KeralaCoirRug", "#MalabarSpices", "#PristineWaterways"],
        activeScamVolume: scamVolume,
        metrics: [
          { label: "Citizen Positive Sentiment", value: `${Math.round(Math.max(10, Math.min(99, 68 + (standardizedRatesEnabled ? 12 : -8) + (safetyPatrolIntensity * 1.4) - (middlemenCommissionCap * 0.35))))}%`, status: 'optimal' },
          { label: "Viral Broker Complaint Rate", value: `${scamVolume} tweets/hr`, status: scamVolume > 8 ? 'danger' : (scamVolume > 4 ? 'warning' : 'optimal') }
        ]
      }
    };
  } else if (city === 'hampi') {
    const transitStatus = touristMultiplier > 2.0 ? 'congested' : 'optimal';
    const waitingTime = Math.max(0, Math.round(jitter(12 + (touristMultiplier * 8) - (rickshawSubsidy / 1500) * 2)));
    const velocityVal = cityOverrides.turbidity !== undefined
      ? Number(cityOverrides.turbidity)
      : Math.round(jitter(3200 + (weatherHazard === 'high' ? 8800 : weatherHazard === 'medium' ? 2500 : 0)));

    const surfaceHeat = cityOverrides.temperature !== undefined
      ? Number(cityOverrides.temperature)
      : Math.round(jitter(38 + (weatherHazard === 'high' ? 8 : 0)));

    const activeSolarCarts = Math.max(0, Math.round(jitter(24 + (rickshawSubsidy / 1000) * 1.5)));
    const scamVolume = Math.max(0, Math.round(7 + (touristMultiplier * 4) - (safetyPatrolIntensity * 0.8) - (standardizedRatesEnabled ? 4 : 0)));

    data = {
      city,
      transit: {
        status: transitStatus,
        routeScore: Math.round(Math.max(15, Math.min(99, 92 - (touristMultiplier * 7)))),
        metrics: [
          { label: "Vittala Temple Shuttle Delay", value: `${waitingTime} mins wait`, status: waitingTime > 20 ? 'danger' : (waitingTime > 10 ? 'warning' : 'optimal') },
          { label: "Solar Cart GPS Tracking Link", value: `${activeSolarCarts} eco-carts active`, status: 'optimal' },
          { label: "River Coracle Boat Pilots", value: weatherHazard === 'high' ? "0 (Halted / Danger)" : "16 active", status: weatherHazard === 'high' ? 'danger' : 'optimal' }
        ]
      },
      environmental: {
        status: weatherHazard === 'high' ? 'hazard' : 'normal',
        metrics: [
          { label: "Tungabhadra Silt Discharge", value: `${velocityVal} cusecs`, status: velocityVal > 8000 ? 'danger' : (velocityVal > 5000 ? 'warning' : 'optimal') },
          { label: "ASI Monument Stone Heat", value: `${surfaceHeat}°C`, status: surfaceHeat > 44 ? 'danger' : 'optimal' },
          { label: "Sacred Ruins Humidity", value: "32% (Arid)", status: "optimal" }
        ]
      },
      social: {
        sentimentScore: Math.round(Math.max(10, Math.min(99, 70 + (standardizedRatesEnabled ? 14 : -9) + (safetyPatrolIntensity * 1.6) - (middlemenCommissionCap * 0.45)))),
        trendingTags: ["#HampiRuins", "#CoracleRiver", "#BananaFiberCraft", "#SolarEcoCart"],
        activeScamVolume: scamVolume,
        metrics: [
          { label: "Citizen Positive Sentiment", value: `${Math.round(Math.max(10, Math.min(99, 70 + (standardizedRatesEnabled ? 14 : -9) + (safetyPatrolIntensity * 1.6) - (middlemenCommissionCap * 0.45))))}%`, status: 'optimal' },
          { label: "Viral Broker Complaint Rate", value: `${scamVolume} tweets/hr`, status: scamVolume > 8 ? 'danger' : (scamVolume > 4 ? 'warning' : 'optimal') }
        ]
      }
    };
  } else {
    // Dynamic city real-time feed compilation
    const config = dynamicCityConfigsCache.get(city) || generateFallbackCityConfig(city, "India");
    const transitStatus = touristMultiplier > 2.3 ? 'congested' : 'optimal';
    const waitingTime = Math.max(0, Math.round(jitter(10 + (touristMultiplier * 7) - (rickshawSubsidy / 1800) * 2)));
    const pm25Val = Math.round(jitter(75 + (touristMultiplier * 10) - (rickshawSubsidy / 1200) * 3));
    const scamVolume = Math.max(0, Math.round(6 + (touristMultiplier * 4) - (safetyPatrolIntensity * 0.8) - (standardizedRatesEnabled ? 3 : 0)));
    
    data = {
      city,
      transit: {
        status: transitStatus,
        routeScore: Math.round(Math.max(15, Math.min(99, 90 - (touristMultiplier * 9)))),
        metrics: [
          { label: `${config.fullName.split(' ')[0]} Transit Delay`, value: transitStatus === 'congested' ? `${waitingTime} mins wait` : "6 mins wait", status: transitStatus === 'congested' ? 'danger' : 'optimal' },
          { label: "Active Eco-Vehicle Fleet Tracker", value: `${Math.round(20 + (rickshawSubsidy / 150) * 0.5)} active units`, status: "optimal" },
          { label: "GPS Infrastructure Link Status", value: "98.2% Connected", status: "optimal" }
        ]
      },
      environmental: {
        status: weatherHazard === 'high' ? 'hazard' : 'normal',
        metrics: [
          { label: "Particulate Air Concentration", value: `${pm25Val} AQI`, status: pm25Val > 150 ? 'danger' : (pm25Val > 100 ? 'warning' : 'optimal') },
          { label: "Ambient Microclimate Silt/Dust", value: weatherHazard === 'high' ? "Elevated (Hazard)" : "Normal limits", status: weatherHazard === 'high' ? 'danger' : 'optimal' },
          { label: "Relative Noise Pollution Level", value: "54 dBA Average", status: "optimal" }
        ]
      },
      social: {
        sentimentScore: Math.round(Math.max(10, Math.min(99, 65 + (standardizedRatesEnabled ? 15 : -10) + (safetyPatrolIntensity * 1.5) - (middlemenCommissionCap * 0.4)))),
        trendingTags: [`#${city.toUpperCase()}`, `#${config.fullName.split(' ')[0]}Heritage`, `#SwadeshiTrust`],
        activeScamVolume: scamVolume,
        metrics: [
          { label: "Citizen Positive Sentiment", value: `${Math.round(Math.max(10, Math.min(99, 65 + (standardizedRatesEnabled ? 15 : -10) + (safetyPatrolIntensity * 1.5) - (middlemenCommissionCap * 0.4))))}%`, status: 'optimal' },
          { label: "Viral Broker Complaint Rate", value: `${scamVolume} tweets/hr`, status: scamVolume > 8 ? 'danger' : (scamVolume > 4 ? 'warning' : 'optimal') }
        ]
      }
    };
  }

  // Set response timestamp
  const now = new Date();
  data.lastUpdated = now.toLocaleTimeString();

  res.json(data);
});

// POST to inject customized feed values
app.post("/api/feeds/override", (req, res) => {
  const { city, pm25, turbidity, temperature } = req.body;
  if (!city) {
    return res.status(400).json({ error: "City field is required" });
  }
  const cleanCity = city.toLowerCase();
  if (!feedOverrides[cleanCity]) {
    feedOverrides[cleanCity] = {};
  }
  if (pm25 !== undefined) feedOverrides[cleanCity].pm25 = Number(pm25);
  if (turbidity !== undefined) feedOverrides[cleanCity].turbidity = Number(turbidity);
  if (temperature !== undefined) feedOverrides[cleanCity].temperature = Number(temperature);

  res.json({ success: true, overrides: feedOverrides[cleanCity] });
});

app.post("/api/reports", (req, res) => {
  const { reporterName, incidentType, location, description, city } = req.body;
  if (!reporterName || !incidentType || !location || !description) {
    return res.status(400).json({ error: "Missing required report fields" });
  }

  const activeCity = (city as string || 'varanasi').toLowerCase();
  const newReport: TrustReport = {
    id: `rep-${activeCity}-${Date.now()}`,
    reporterName,
    incidentType,
    location,
    description,
    timestamp: "Just now"
  };

  if (!reportsLogByCity[activeCity]) {
    reportsLogByCity[activeCity] = [];
  }
  reportsLogByCity[activeCity].unshift(newReport);

  // Add alert if severe
  if (incidentType === "Overcharging" || incidentType === "Harassment") {
    const newAlert: CivicAlert = {
      id: `alert-gen-${activeCity}-${Date.now()}`,
      type: "security",
      title: `Incident: ${incidentType} at ${location}`,
      message: description.slice(0, 100) + "...",
      severity: "warning",
      timestamp: "Just now"
    };
    if (!alertsByCity[activeCity]) {
      alertsByCity[activeCity] = [];
    }
    alertsByCity[activeCity].unshift(newAlert);
  }

  res.status(201).json({ success: true, report: newReport });
});

// AI Travel Destination Suggestions and Itinerary Generator API
app.post("/api/travel/suggest", async (req, res) => {
  try {
    const { destination, budget, duration, style, companions } = req.body;

    if (!budget || !duration || !style) {
      return res.status(400).json({ error: "Missing required parameters: budget, duration, or style." });
    }

    const numBudget = Number(budget);
    const numDuration = Number(duration);
    const selectedStyle = style || "Heritage & Culture";
    const selectedDestination = destination || "Anywhere";
    const selectedCompanions = companions || "Solo";

    const cacheKey = `${selectedDestination}_${numBudget}_${numDuration}_${selectedStyle}_${selectedCompanions}`;
    let suggestResponseJSON: any = null;

    if (travelSuggestCache.has(cacheKey)) {
      suggestResponseJSON = travelSuggestCache.get(cacheKey);
    } else if (isGeminiAvailable()) {
      const ai = getAI();
      if (ai) {
        try {
          const prompt = `You are an expert Indian Heritage Travel Architect and Tourism Specialist.
Analyze the following travel preferences across India:
- Preferred Destination Area/Region/City: "${selectedDestination}" (If "Anywhere", select the best destinations in India that fit the requirements)
- Total Travel Budget: ₹${numBudget} INR (MUST fit the entire trip including stays, food, transport, and activities for ${selectedCompanions})
- Trip Duration: ${numDuration} Days
- Travel Vibe/Style: "${selectedStyle}" (e.g., Spiritual, Heritage, Adventure, Beach, Luxury)
- Companion type: "${selectedCompanions}"

Suggest 1 to 2 perfect travel spots/cities in India that perfectly match these budget constraints and preferences.
For each suggested spot, you MUST generate:
1. Detailed estimated cost breakdown (stay, transport, food, activities) that fits the ₹${numBudget} INR budget.
2. Highlighting of local heritage crafts, micro-entrepreneurs, weavers, boatmen, or local artisans to support (align with our app's Civic Heritage theme).
3. A highly detailed day-wise itinerary for the entire ${numDuration} days. Each day MUST have morning, afternoon, evening activities, and local food recommendations.
4. Professional travel specialist planner advice on staying within the budget.

You MUST respond strictly with a valid JSON object matching this schema. Do not include any markdown comments or wrapping backticks around the JSON. Just return the raw JSON object:

{
  "suggestions": [
    {
      "destinationName": "string (e.g., Jaipur, Rajasthan)",
      "state": "string",
      "tagline": "string (a beautiful catchphrase)",
      "estimatedCost": number (e.g., 23500),
      "suitabilityScore": number (out of 100),
      "safetyScore": number (out of 100, based on previous tourist incidents, climate warnings, scams, and crowd thresholds),
      "safetyDetails": "string (summarizing previous safety incidents, crowd bottlenecks, heat/monsoon hazards, or active scams, and precautions to take)",
      "keyHighlights": ["string", "string", "string"],
      "localArtisansAndCrafts": [
        {
          "craftName": "string",
          "description": "string",
          "location": "string"
        }
      ],
      "expenseBreakdown": {
        "stay": number,
        "transport": number,
        "food": number,
        "activities": number
      },
      "itinerary": [
        {
          "day": number,
          "title": "string (Day focus theme)",
          "morning": "string (specific detail)",
          "afternoon": "string (specific detail)",
          "evening": "string (specific detail)",
          "recommendedFood": "string (famous local dishes/stalls to try)"
        }
      ],
      "plannerAdvice": "string"
    }
  ]
}`;

          const response = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: prompt,
            config: {
              responseMimeType: "application/json"
            }
          });

          if (response.text) {
            // Parse JSON safely
            const cleanedText = response.text.trim().replace(/^```json\s*/, '').replace(/```$/, '').trim();
            suggestResponseJSON = JSON.parse(cleanedText);
            if (suggestResponseJSON) {
              travelSuggestCache.set(cacheKey, suggestResponseJSON);
            }
          }
        } catch (geminiErr) {
          handleGeminiError(geminiErr, "Travel Suggestion");
        }
      }
    }

    // Heuristic High-Fidelity Fallback if Gemini is not available or failed
    if (!suggestResponseJSON) {
      // Determine budget bracket
      const stayFrac = 0.35;
      const transFrac = 0.25;
      const foodFrac = 0.20;
      const actFrac = 0.20;

      const stayCost = Math.round(numBudget * stayFrac);
      const transportCost = Math.round(numBudget * transFrac);
      const foodCost = Math.round(numBudget * foodFrac);
      const activitiesCost = Math.round(numBudget * actFrac);
      const actualEstimated = stayCost + transportCost + foodCost + activitiesCost;

      // Select dynamic destination based on selection or style
      let destName = "Varanasi, Uttar Pradesh";
      let destTag = "Spiritual Heart of the Ganges";
      let destState = "Uttar Pradesh";
      let highlights = ["Subah-e-Banaras Morning Aarti", "Banarasi Saree Loom Walk", "Ghat Wooden Boat Cruise"];
      let artisans = [
        { craftName: "Banarasi Handloom Weavers", description: "Master craftsmen weaving pure mulberry silk and silver zari sarees on traditional wooden looms.", location: "Madanpura & Peeli Kothi Lanes" },
        { craftName: "Wooden Lacquerware Toy Makers", description: "GI-tagged colorful wooden toys chiselled and lacquered naturally.", location: "Khojwan Craft Guild" }
      ];

      const isCustomDestination = selectedDestination && selectedDestination !== "Anywhere" && selectedDestination.trim() !== "";

      if (isCustomDestination) {
        destName = selectedDestination;
        destState = "India";
        destTag = "Bespoke Heritage Corridor Walk";
        highlights = ["Heritage Explorations", "Local Creative Workshops", "Regional Culinary Walk"];
        artisans = [
          { craftName: "Traditional Handloom Weavers", description: "Master craftsmen producing authentic regional heritage weaves and textiles.", location: "Local Old City Ward" },
          { craftName: "Heritage Craft Guilds", description: "Generations-old artisan workshops making traditional ornaments and handmade utilities.", location: "Central Artisans Bazaar" }
        ];
      }

      const lowBudgetAdvice = "Stick to standard electric sharing e-rickshaws, stay in verified boutique heritage homestays, and enjoy legendary local street food stalls which costs under ₹150 per meal.";
      const medBudgetAdvice = "Opt for localized guides, dine at clean heritage rooftops looking over iconic vistas, and budget for a direct craft workshop purchase from authenticated cooperatives.";
      const highBudgetAdvice = "Experience premium stays at luxury heritage villas, book private curated sunset safaris, and hire certified local micro-entrepreneurs to navigate deep cultural spots.";

      let adviceText = numBudget < 15000 ? lowBudgetAdvice : (numBudget < 40000 ? medBudgetAdvice : highBudgetAdvice);

      if (selectedDestination.toLowerCase().includes("jaipur")) {
        destName = "Jaipur, Rajasthan";
        destState = "Rajasthan";
        destTag = "The Regal Pink City Gateway";
        highlights = ["Amber Fort Palace Trek", "Johari Bazaar Block Printing", "Hawa Mahal Sunset Photography"];
        artisans = [
          { craftName: "Blue Pottery Kiln Guilds", description: "Exquisite cobalt-blue hand-painted glazed ceramics made without clay.", location: "Sanganer Craft Hub" },
          { craftName: "Kathputli Puppeteers", description: "Traditional string puppetry artists crafting colorful wooden and fabric dolls.", location: "Johari Bazaar Crossing" }
        ];
      } else if (selectedDestination.toLowerCase().includes("kochi") || selectedDestination.toLowerCase().includes("kerala")) {
        destName = "Fort Kochi & Alleppey, Kerala";
        destState = "Kerala";
        destTag = "Serene Malabar Spice Waterways";
        highlights = ["Chinese Fishing Net Operation", "Backwater Houseboat Cruise", "Mattancherry Spice Walk"];
        artisans = [
          { craftName: "Coir Rug Cottage Weavers", description: "Hand-spinning coconut husks into durable high-grade eco-friendly fiber mats.", location: "Kochi Coir Swasahayata" },
          { craftName: "Kathakali Mask Carvers", description: "Artisans carving symbolic, colorful green-room drama headgear and masks.", location: "Kochi Heritage Guild" }
        ];
      } else if (selectedDestination.toLowerCase().includes("hampi")) {
        destName = "Hampi, Karnataka";
        destState = "Karnataka";
        destTag = "Frozen Stone Empire of Vijayanagara";
        highlights = ["Virupaksha Temple Coracle Ride", "Boulder Hill Sunset Scramble", "Royal Lotus Mahal Explorations"];
        artisans = [
          { craftName: "Banana Fiber Handicrafts", description: "Weaving organic waste pseudo-stems into spectacular hats, bags, and yoga mats.", location: "Anegundi Kishkinda Village" },
          { craftName: "Stone Sculpture Carvers", description: "Generations of hammer and chisel artisans creating miniature replica granite monoliths.", location: "Hampi Bazaar Plaza" }
        ];
      } else if (selectedDestination.toLowerCase().includes("varanasi")) {
        destName = "Varanasi, Uttar Pradesh";
        destState = "Uttar Pradesh";
        destTag = "Spiritual Heart of the Ganges";
        highlights = ["Subah-e-Banaras Morning Aarti", "Banarasi Saree Loom Walk", "Ghat Wooden Boat Cruise"];
        artisans = [
          { craftName: "Banarasi Handloom Weavers", description: "Master craftsmen weaving pure mulberry silk and silver zari sarees on traditional wooden looms.", location: "Madanpura & Peeli Kothi Lanes" },
          { craftName: "Wooden Lacquerware Toy Makers", description: "GI-tagged colorful wooden toys chiselled and lacquered naturally.", location: "Khojwan Craft Guild" }
        ];
      } else if (!isCustomDestination) {
        if (style.toLowerCase().includes("heritage")) {
          destName = "Jaipur, Rajasthan";
          destState = "Rajasthan";
          destTag = "The Regal Pink City Gateway";
          highlights = ["Amber Fort Palace Trek", "Johari Bazaar Block Printing", "Hawa Mahal Sunset Photography"];
          artisans = [
            { craftName: "Blue Pottery Kiln Guilds", description: "Exquisite cobalt-blue hand-painted glazed ceramics made without clay.", location: "Sanganer Craft Hub" },
            { craftName: "Kathputli Puppeteers", description: "Traditional string puppetry artists crafting colorful wooden and fabric dolls.", location: "Johari Bazaar Crossing" }
          ];
        } else if (style.toLowerCase().includes("adventure") || style.toLowerCase().includes("beach")) {
          destName = "Fort Kochi & Alleppey, Kerala";
          destState = "Kerala";
          destTag = "Serene Malabar Spice Waterways";
          highlights = ["Chinese Fishing Net Operation", "Backwater Houseboat Cruise", "Mattancherry Spice Walk"];
          artisans = [
            { craftName: "Coir Rug Cottage Weavers", description: "Hand-spinning coconut husks into durable high-grade eco-friendly fiber mats.", location: "Kochi Coir Swasahayata" },
            { craftName: "Kathakali Mask Carvers", description: "Artisans carving symbolic, colorful green-room drama headgear and masks.", location: "Kochi Heritage Guild" }
          ];
        }
      }

      // Generate dynamic day itinerary based on duration
      const itinerariesList = [];
      const dayThemes = [
        { theme: "Ancestral Gateways & Essential Aarti", morning: "Arrive and check in at local heritage lodging. Enjoy cardamom tea and initial walk.", afternoon: "Explore the main marketplace lanes, visiting local weaving associations.", evening: "Witness the magnificent evening prayers, river Aarti, and a gentle wood boat trip.", food: "Try famous local street platter and hot sweet Lassi." },
        { theme: "Artisan Workshops & Monolithic Wonders", morning: "Early sunrise trail walk to spot key visual monuments.", afternoon: "Engage in direct craft workshops with registered traditional guilds.", evening: "Enjoy a scenic sunset view from the highest local vantage hills.", food: "Try wood-fired local bread and regional curry recipes." },
        { theme: "Spiritual Escapes & Quiet Reflections", morning: "Visit secondary remote ruins, holy caves, or secret water canals.", afternoon: "Sip local coconut or organic herbal drinks and study historical museums.", evening: "Participate in local folk music puppet theater or vocal devotional chants.", food: "Savor a grand regional culinary Thali." },
        { theme: "Scenic Bazaars & Local Fabric Crafting", morning: "Participate in a hands-on block printing or clay throwing class.", afternoon: "Browse regional spice markets or wholesale cloth emporiums directly.", evening: "Relax with a quiet boat row or forest walk during golden hour.", food: "Savor fresh fruit juices and baked local snacks." },
        { theme: "Deep Conservation Trails & Final Farewells", morning: "Visit high-preservation eco parks or water-conservation channels.", afternoon: "Buy authenticated GI-tagged souvenirs directly from master artisans.", evening: "Pack bags and depart, carrying deep memories of rich Indian hospitality.", food: "Savor a warm traditional sweet pudding." }
      ];

      for (let i = 1; i <= numDuration; i++) {
        const themeIndex = (i - 1) % dayThemes.length;
        const currentTheme = dayThemes[themeIndex];
        itinerariesList.push({
          day: i,
          title: `Day ${i}: ${currentTheme.theme}`,
          morning: currentTheme.morning,
          afternoon: currentTheme.afternoon,
          evening: currentTheme.evening,
          recommendedFood: currentTheme.food
        });
      }

      let fallbackSafetyScore = 88;
      let fallbackSafetyDetails = "Generally safe and welcoming. Standardized rate structures protect from commission scams. Maintain awareness during crowded evening gatherings.";
      const destLower = destName.toLowerCase();
      if (destLower.includes("varanasi")) {
        fallbackSafetyScore = 92;
        fallbackSafetyDetails = "Highly visited sacred core. Standard safety patrols active 24/7. Minor crowding at evening Ganga Aarti and wet-slick stone steps during high monsoonal silts require care.";
      } else if (destLower.includes("jaipur")) {
        fallbackSafetyScore = 89;
        fallbackSafetyDetails = "Secure heritage hub. Previous incidents limited to aggressive commission brokers and overcharging at bazaars. Official QR scanning and price boards help protect visitors.";
      } else if (destLower.includes("kochi")) {
        fallbackSafetyScore = 94;
        fallbackSafetyDetails = "Extremely high safety scores. Very friendly locals and low crime. Watch for coastal high waves during active summer monsoons.";
      } else if (destLower.includes("hampi")) {
        fallbackSafetyScore = 91;
        fallbackSafetyDetails = "Protected ASI Heritage reserve. Very low violent crime rates. Minor incidents of monkey snatching near temple steps and excessive heat dehydration. Stay well hydrated.";
      }

      suggestResponseJSON = {
        suggestions: [
          {
            destinationName: destName,
            state: destState,
            tagline: destTag,
            estimatedCost: actualEstimated,
            suitabilityScore: 92,
            safetyScore: fallbackSafetyScore,
            safetyDetails: fallbackSafetyDetails,
            keyHighlights: highlights,
            localArtisansAndCrafts: artisans,
            expenseBreakdown: {
              stay: stayCost,
              transport: transportCost,
              food: foodCost,
              activities: activitiesCost
            },
            itinerary: itinerariesList,
            plannerAdvice: adviceText
          }
        ]
      };
    }

    res.json(suggestResponseJSON);

  } catch (error: any) {
    console.error("Travel suggest API error:", error);
    res.status(500).json({ error: "Failed to generate travel suggestion engine responses" });
  }
});

// dynamic multi-destination policy scenario simulation API endpoint
app.post("/api/scenarios/simulate", async (req, res) => {
  try {
    const inputs: PolicyInputs = req.body;
    const city = (inputs.city || 'varanasi').toLowerCase();

    // Validate inputs
    if (
      inputs.rickshawSubsidy === undefined ||
      inputs.wasteManagementBudget === undefined ||
      inputs.safetyPatrolIntensity === undefined ||
      inputs.middlemenCommissionCap === undefined ||
      inputs.standardizedRatesEnabled === undefined ||
      inputs.touristMultiplier === undefined ||
      inputs.weatherHazard === undefined
    ) {
      return res.status(400).json({ error: "Missing required policy parameters" });
    }

    const metrics = calculateCivicMetrics(inputs);
    const updatedEntrepreneurs = updateEntrepreneursIncome(inputs, metrics);

    // Save state so subsequent GET requests see simulated values
    activeEntrepreneurs[city] = updatedEntrepreneurs;

    // Call Gemini API if key is present to construct a highly sophisticated policy brief
    let aiPolicyBrief = "";
    const ai = getAI();

    // Map localized labels for professional Gemini response
    const cityMap: Record<string, { fullName: string; context: string; cleanLabel: string; congestionLabel: string; coopLabel: string }> = {
      varanasi: {
        fullName: "Varanasi (Kashi)",
        context: "holy Ganga riverfront, ancient silk weavers, wooden toy carvers, and eco e-rickshaws",
        cleanLabel: "Ghat Sanitation score",
        congestionLabel: "Narrow Ancient Lanes Traffic",
        coopLabel: "Banarasi Handloom Weavers cooperative"
      },
      jaipur: {
        fullName: "Jaipur (Pink City)",
        context: "grand desert forts, traditional blue pottery kilns, Kathputli puppeteers, and high-temperature auto-rickshaws",
        cleanLabel: "Historic Palace Bazaar Cleanliness Index",
        congestionLabel: "Pink City Old Gates Transit gridlock",
        coopLabel: "Blue Pottery & Artisan cooperative"
      },
      kochi: {
        fullName: "Kochi (Malabar Queen)",
        context: "Arabian backwater Chinese fishing nets, coir rug cottage weavers, Kathakali mask carvers, and tourist spice street e-tuks",
        cleanLabel: "Waterway Hyacinth & Shore Cleanliness Score",
        congestionLabel: "Mattancherry Spice Market Lane traffic",
        coopLabel: "Kerala Coir Workers & Fishers association"
      },
      hampi: {
        fullName: "Hampi (Vijayanagara)",
        context: "UNESCO sacred ruins boulder parks, organic banana fiber weavers, river coracle boat pilots, and green solar electric carts",
        cleanLabel: "Heritage Ruins Protection & Sanitation Index",
        congestionLabel: "Temple Plaza Walkway congestion",
        coopLabel: "Kishkinda Fiber Guild & Sculptors association"
      }
    };

    const targetCity = cityMap[city] || cityMap.varanasi;

    const cacheKey = `${city}_${inputs.rickshawSubsidy}_${inputs.wasteManagementBudget}_${inputs.safetyPatrolIntensity}_${inputs.middlemenCommissionCap}_${inputs.standardizedRatesEnabled}_${inputs.touristMultiplier}_${inputs.weatherHazard}`;

    if (policyBriefCache.has(cacheKey)) {
      aiPolicyBrief = policyBriefCache.get(cacheKey) || "";
    } else if (inputs.generateBrief && isGeminiAvailable()) {
      try {
        const prompt = `You are the Lead Heritage Municipal Planner and Commissioner of Heritage Trade & Urban Policy for ${targetCity.fullName}.
Assess the following active policy scenario inputs:
- Selected Heritage City: ${targetCity.fullName} (${targetCity.context})
- Monthly E-Rickshaw/Eco-Vehicle Subsidies: ₹${inputs.rickshawSubsidy} per driver
- Waste Management / River Silt Sanitation Budget: ₹${inputs.wasteManagementBudget} Lakhs/month
- Daily Safety and Heritage Patrol Intensity: ${inputs.safetyPatrolIntensity} patrols per ward
- Middlemen / Broker Commission Cap: ${inputs.middlemenCommissionCap}% maximum
- Standardized rates for tour rides, boats, and guides: ${inputs.standardizedRatesEnabled ? "On" : "Off"}
- Seasonal Tourist Volume Multiplier: ${inputs.touristMultiplier}x
- Active Environmental Hazard level (Monsoon Floods or Desert Heatwaves depending on city): "${inputs.weatherHazard}"

Simulated Civic Metrics:
- Artisan & Driver Direct Economic Sharing Index: ${metrics.economicDistribution}%
- Overall Traveler Safety & trust rating: ${metrics.safetyTrustRating}/100
- Local Registered Merchant Annual Growth: ${metrics.merchantRevenueGrowth}%
- Scam/Overcharging reports: ${metrics.complaintsRate} per 1K tourists
- Heritage Corridor Congestion level: ${metrics.trafficCongestion}%
- ${targetCity.coopLabel} Net Income Growth: ${metrics.weaverCooperativeIncome}%
- ${targetCity.cleanLabel}: ${metrics.ghatCleanliness}%

Write an expert, beautifully articulated, human-sounding "Strategic Policy Outlook & Socio-Economic Assessment" analyzing the scenario for ${targetCity.fullName}.
Address:
1. How these specific policies affect the livelihoods of local craftsmen, eco-drivers, and boatmen/operators under the active hazard level (${inputs.weatherHazard}).
2. The trade-off between higher tourist crowds causing corridors/lanes congestion vs local merchant prosperity.
3. Recommendations on sanitation waste budget adjustments to handle the hazard, and safety patrols to suppress tourist commission trap complaints.

The assessment MUST be formatted as 3 to 4 distinct paragraphs in clean Markdown. Use headings, bold text, and brief bullets if appropriate.
Use professional, objective, yet deeply caring civic prose with a high-end municipal authority style. Do not output JSON. Just output clean, beautiful Markdown text.`;

        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: prompt,
          config: {
            systemInstruction: "You are the Lead Heritage Municipal Planner. Keep tone objective, caring, and professional. Output Markdown."
          }
        });

        if (response.text) {
          aiPolicyBrief = response.text.trim();
          policyBriefCache.set(cacheKey, aiPolicyBrief);
        }
      } catch (geminiErr) {
        handleGeminiError(geminiErr, "Policy Brief Simulation");
      }
    }

    // Heuristic fallback policy brief if Gemini is unavailable or failed
    if (!aiPolicyBrief) {
      const weathers = {
        varanasi: {
          high: "Critical monsoon flooding has restricted river boat operations at Kashi. Navigational activities remain dangerous, shifting tourist focus to land-based handloom shops.",
          medium: "Minor water level swells are observed on the Ganga. Debris accumulation is moderate, calling for steady cleaning efforts.",
          low: "Favorable clear water season offers perfect conditions for ghat navigation and saree lane tours."
        },
        jaipur: {
          high: "Severe desert heat wave exceeding 44°C has slowed noon tourist movement. Standardized rates help shield driver earnings from peak-heat hour demand collapse.",
          medium: "Warm climate conditions require tourists to hold mid-day rests. Evening shopping at Johari Bazaar is highly active.",
          low: "Pleasant temperate weather drives massive outdoor fort excursions and guides revenue growth."
        },
        kochi: {
          high: "Heavy monsoon coastal storm surges and floating hyacinth weeds have choked the Chinese net frames, raising coastal debris hazards.",
          medium: "Mild sea breezes and occasional rain showers. Silt and marine trash require steady municipal sweeping.",
          low: "Pristine dry season weather fuels thriving backwater tour boating and beachfront dining."
        },
        hampi: {
          high: "Reservoir dam releases have raised Tungabhadra waters, halting coracle boat operations. Solar carts form a vital transport lifeline.",
          medium: "Moderate heat. ASI heritage pathways require steady patrol regulation for tourist dehydration protection.",
          low: "Optimal cooling weather. Perfect stone temple walk visibility drives massive weaver and sculptor yard trade."
        }
      };

      const cityWeatherBrief = weathers[city] ? weathers[city][inputs.weatherHazard] : weathers.varanasi[inputs.weatherHazard];

      const commissionBrief = inputs.middlemenCommissionCap <= 15 
        ? `The capped middlemen commission at ${inputs.middlemenCommissionCap}% represents a major victory for the ${targetCity.coopLabel}. By retaining over ${metrics.economicDistribution}% of direct traveler spend, local artisans are securing an average income surge of ${metrics.weaverCooperativeIncome}%, driving wealth back into the artisan village communities.`
        : `Middlemen continue to extract upwards of ${inputs.middlemenCommissionCap}% commission, causing heavy leaks for independent craftspeople. We recommend a tighter regulatory limit on broker agents to avoid local capital drain.`;

      const standardRateBrief = inputs.standardizedRatesEnabled
        ? `Enabling a standardized heritage rate registry has successfully brought scam complaints down to ${metrics.complaintsRate} per 1K travelers, building solid traveler trust (${metrics.safetyTrustRating}/100). This transparency serves as a model for public tourism.`
        : `Lax pricing enforcement has caused unregulated fare speculation. Traveler logs report high overcharging alerts, which suppresses traveler confidence and risks long-term international tourism returns.`;

      aiPolicyBrief = `### **Strategic Policy Brief: ${targetCity.fullName} Municipal Trade Outlook**

**1. Heritage Environment and Artisan Integration**
${cityWeatherBrief} The current simulated economic distribution index of **${metrics.economicDistribution}%** indicates the direct pocket share of tourist spending, highly driven by local craft regulatory caps.

**2. Cooperative Protections and Commission Regimes**
${commissionBrief} This regulatory framework forms a critical shield against predatory brokers and connects the craft directly to digital markets.

**3. Infrastructure Strain and Congestion Trade-offs**
With tourist volumes modeling at **${inputs.touristMultiplier}x**, congestion inside the ancient, narrow streets sits at **${metrics.trafficCongestion}%**. While high visitor density generates substantial registered merchant sales growth (**+${metrics.merchantRevenueGrowth}%**), it severely chokes traffic flows. ${standardRateBrief}

**4. Sanitation Capacity & Heritage Preservation**
A waste budget of **₹${inputs.wasteManagementBudget} Lakhs/month** combined with safety guards has secured a preservation rating of **${metrics.ghatCleanliness}%**. To maintain pristine public pathways amidst high visitor congestion, we recommend allocating a minimum of 25% of rickshaw transit taxes directly toward permanent monument sweepers.`;
    }

    res.json({
      success: true,
      metrics,
      entrepreneurs: updatedEntrepreneurs,
      aiPolicyBrief
    });

  } catch (error: any) {
    console.error("Scenario simulation error:", error);
    res.status(500).json({ error: "Failed to run multi-city policy scenario simulation" });
  }
});

// dynamic side-by-side multi-city compare API endpoint
app.post("/api/scenarios/compare-cities", async (req, res) => {
  try {
    const { inputsA, inputsB } = req.body;
    if (!inputsA || !inputsB) {
      return res.status(400).json({ error: "Missing policy parameters for cities to compare" });
    }

    const metricsA = calculateCivicMetrics(inputsA);
    const metricsB = calculateCivicMetrics(inputsB);

    const cityA = inputsA.city || 'varanasi';
    const cityB = inputsB.city || 'jaipur';

    const cityMap: Record<string, { fullName: string; context: string; cleanLabel: string; congestionLabel: string; coopLabel: string }> = {
      varanasi: {
        fullName: "Varanasi (Kashi)",
        context: "holy Ganga riverfront, ancient silk weavers, wooden toy carvers, and e-rickshaws",
        cleanLabel: "Ghat Sanitation",
        congestionLabel: "Narrow Lanes Congestion",
        coopLabel: "Banarasi Handloom Weavers cooperative"
      },
      jaipur: {
        fullName: "Jaipur (Pink City)",
        context: "grand desert forts, traditional blue pottery kilns, Kathputli puppeteers, and auto-rickshaws",
        cleanLabel: "Historic Palace Cleanliness",
        congestionLabel: "Old Gates Transit gridlock",
        coopLabel: "Blue Pottery & Artisan cooperative"
      },
      kochi: {
        fullName: "Kochi (Malabar Queen)",
        context: "Chinese fishing nets, coir rug weavers, Kathakali mask carvers, and tourist street e-tuks",
        cleanLabel: "Waterway Cleanliness",
        congestionLabel: "Mattancherry Spice Market Traffic",
        coopLabel: "Kerala Coir Workers & Fishers association"
      },
      hampi: {
        fullName: "Hampi (Vijayanagara)",
        context: "isolated ruins, coracle boat crossings, banana fiber craft weavers, and stone sculptors",
        cleanLabel: "Monument Ruins Cleanliness Score",
        congestionLabel: "Heritage Cart Transit congestion",
        coopLabel: "Banana Fiber Handicrafts & Coracle Association"
      }
    };

    const detailsA = cityMap[cityA] || cityMap.varanasi;
    const detailsB = cityMap[cityB] || cityMap.varanasi;

    let aiBrief = "";
    const cacheKey = `${cityA}_${inputsA.rickshawSubsidy}_${inputsA.wasteManagementBudget}_${inputsA.safetyPatrolIntensity}_${inputsA.middlemenCommissionCap}_${inputsA.standardizedRatesEnabled}_${inputsA.touristMultiplier}_${inputsA.weatherHazard}__vs__${cityB}_${inputsB.rickshawSubsidy}_${inputsB.wasteManagementBudget}_${inputsB.safetyPatrolIntensity}_${inputsB.middlemenCommissionCap}_${inputsB.standardizedRatesEnabled}_${inputsB.touristMultiplier}_${inputsB.weatherHazard}`;

    if (comparativeBriefCache.has(cacheKey)) {
      aiBrief = comparativeBriefCache.get(cacheKey) || "";
    } else if (isGeminiAvailable()) {
      const ai = getAI();
      if (ai) {
        try {
          const prompt = `You are an elite, world-class municipal development consultant and urban planning analyst.
Compare the policy configurations and simulated outcomes of two distinct heritage cities:

City A: ${detailsA.fullName}
Context: ${detailsA.context}
Current Policies:
- Eco-Vehicle Subsidy: ₹${inputsA.rickshawSubsidy}/mo
- Preservation Budget: ₹${inputsA.wasteManagementBudget} Lakhs/mo
- Safety Patrols: ${inputsA.safetyPatrolIntensity} daily
- Middlemen Commission Cap: ${inputsA.middlemenCommissionCap}%
- Standardized Fares: ${inputsA.standardizedRatesEnabled ? "Enabled" : "Disabled"}
- Tourist Volume Multiplier: ${inputsA.touristMultiplier}x
- Environmental Hazard: ${inputsA.weatherHazard}
Simulated Performance Metrics:
- Economic Distribution: ${metricsA.economicDistribution}%
- Safety Trust Rating: ${metricsA.safetyTrustRating}/100
- Merchant Revenue Growth: ${metricsA.merchantRevenueGrowth}%
- Scam Complaints Rate: ${metricsA.complaintsRate} per 1k
- Traffic Congestion: ${metricsA.trafficCongestion}%
- Cooperative Income Growth: ${metricsA.weaverCooperativeIncome}%
- Cleanliness Index: ${metricsA.ghatCleanliness}%

City B: ${detailsB.fullName}
Context: ${detailsB.context}
Current Policies:
- Eco-Vehicle Subsidy: ₹${inputsB.rickshawSubsidy}/mo
- Preservation Budget: ₹${inputsB.wasteManagementBudget} Lakhs/mo
- Safety Patrols: ${inputsB.safetyPatrolIntensity} daily
- Middlemen Commission Cap: ${inputsB.middlemenCommissionCap}%
- Standardized Fares: ${inputsB.standardizedRatesEnabled ? "Enabled" : "Disabled"}
- Tourist Volume Multiplier: ${inputsB.touristMultiplier}x
- Environmental Hazard: ${inputsB.weatherHazard}
Simulated Performance Metrics:
- Economic Distribution: ${metricsB.economicDistribution}%
- Safety Trust Rating: ${metricsB.safetyTrustRating}/100
- Merchant Revenue Growth: ${metricsB.merchantRevenueGrowth}%
- Scam Complaints Rate: ${metricsB.complaintsRate} per 1k
- Traffic Congestion: ${metricsB.trafficCongestion}%
- Cooperative Income Growth: ${metricsB.weaverCooperativeIncome}%
- Cleanliness Index: ${metricsB.ghatCleanliness}%

Write an expert, high-level, human-sounding "Comparative Heritage Development Brief" that contrasts the performance of these two cities under their active scenarios.
Focus on:
1. Economic Model Contrast: Compare how direct economic benefits reach artisans/drivers/boatmen in ${detailsA.fullName} vs ${detailsB.fullName} based on commission caps and subsidies.
2. Tourist Load & Congestion: Contrast how tourism multipliers and physical realities impact transit congestion and local merchant growth in both locations.
3. Environmental & Civic Trade-offs: Contrast how different preservation budgets and hazard settings interact with municipal sanitation index.
4. Core Strategic Takeaways: Summarize which city's current configuration is more sustainable, and outline one specific cross-learning recommendation.

The brief must be written in elegant, objective, and deeply caring municipal prose. Format as 3-4 distinct paragraphs in clean Markdown (no JSON). Use headings, bold text, and bullet points where appropriate. Do not use generic placeholders.`;

          const response = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: prompt,
            config: {
              systemInstruction: "You are an elite municipal development consultant. Write professional comparative assessments in Markdown."
            }
          });
          if (response.text) {
            aiBrief = response.text.trim();
            comparativeBriefCache.set(cacheKey, aiBrief);
          }
        } catch (geminiErr) {
          handleGeminiError(geminiErr, "Comparative Brief");
        }
      }
    }

    if (!aiBrief) {
      aiBrief = `### Comparative Civic Assessment

We have analyzed the civic health parameters for **${detailsA.fullName}** and **${detailsB.fullName}** under their respective configurations.

* **Economic and Cooperative Balance**: ${cityA.toUpperCase()} retains an Economic Distribution of **${metricsA.economicDistribution}%**, whereas ${cityB.toUpperCase()} achieves **${metricsB.economicDistribution}%**. A lower commission cap and standard rate structure in both cities can shield grassroots craftsmen.
* **Safety Trust & Scams**: ${detailsA.fullName} holds a safety trust index of **${metricsA.safetyTrustRating}/100** with **${metricsA.complaintsRate}** complaints per 1K, while ${detailsB.fullName} stands at **${metricsB.safetyTrustRating}/100** with **${metricsB.complaintsRate}** complaints. Increasing daily patrol presence is critical to mitigating local street traps.
* **Civic Cleanliness & Hazards**: Under ${inputsA.weatherHazard} weather hazard, ${detailsA.fullName} reports a Cleanliness score of **${metricsA.ghatCleanliness}%**, while ${detailsB.fullName} under ${inputsB.weatherHazard} weather hazard scores **${metricsB.ghatCleanliness}%**. Targeted waste budgets directly buffer key tourist sectors from rain or desert silt.

**Recommendation**: We suggest sharing the cooperative pricing models between both heritage departments to establish solid, standard-rate frameworks.`;
    }

    res.json({
      success: true,
      metricsA,
      metricsB,
      aiBrief
    });

  } catch (error: any) {
    console.error("Comparative API error:", error);
    res.status(500).json({ error: "Failed to compile comparison data" });
  }
});

// Modular AI decision model synthesis API endpoint
app.post("/api/models/synthesize", async (req, res) => {
  try {
    const { city, activeModels, params, inputs, metrics } = req.body;
    
    if (!city || !activeModels) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    const cacheKey = `${city}_${(activeModels || []).join(",")}_${JSON.stringify(params)}_${JSON.stringify(inputs)}_${JSON.stringify(metrics)}`;
    let synthesisMarkdown = "";

    if (modelSynthesisCache.has(cacheKey)) {
      synthesisMarkdown = modelSynthesisCache.get(cacheKey) || "";
    } else if (isGeminiAvailable()) {
      const ai = getAI();
      if (ai) {
        try {
          const prompt = `You are the Swadeshi Decision Intelligence Model Orchestrator. 
The user has configured and combined modular AI decision models for municipal/heritage corridor support.
Active Models selected: ${activeModels.join(", ")}
Model Parameters: ${JSON.stringify(params)}
Current City: ${city}
Current Policy Inputs: ${JSON.stringify(inputs)}
Current Simulated Outcomes/Metrics: ${JSON.stringify(metrics)}

Synthesize a professional Decision Intelligence Synthesis Report.
Structure your report with these Markdown headings:
### **1. Modular Pipeline Integration Overview**
Discuss what combining these specific models (${activeModels.join(", ")}) achieves for ${city}.

### **2. Predictive Trend Projections (Forecasting Model)**
(Only if 'forecasting' is in activeModels) Analyze the future trend of ${params.forecasting?.targetMetric || "traffic & sanitation"} over a ${params.forecasting?.horizon || "24h"} window. Make numeric predictions based on the tourist multiplier of ${inputs.touristMultiplier}x and the current congestion of ${metrics.trafficCongestion}%.

### **3. Public Pulse & Artisan Sentiment (Sentiment Model)**
(Only if 'sentiment' is in activeModels) Evaluate the local merchant/traveler feedback from ${params.sentiment?.source || "Feeds"}. Explain how the middlemen commission cap of ${inputs.middlemenCommissionCap}% impacts cooperative sentiment (currently at ${metrics.weaverCooperativeIncome}% YoY).

### **4. Tactical Telemetry Alerts (Anomaly Detection Model)**
(Only if 'anomaly' is in activeModels) Assess the probability of critical system anomalies (like flash crowds or sanitation dumps) under ${inputs.weatherHazard} weather hazard stress, with anomaly sensitivity threshold set to '${params.anomaly?.threshold || "medium"}'.

### **5. Combined Policy Recommendation**
Provide a highly custom recommendation combining the metrics of economic distribution (${metrics.economicDistribution}%) and safety trust (${metrics.safetyTrustRating}/100) to optimize civic health.

Be highly detailed, analytical, and professional. Avoid generic filler.`;

          const response = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: prompt,
          });
          synthesisMarkdown = response.text || "";
          if (synthesisMarkdown) {
            modelSynthesisCache.set(cacheKey, synthesisMarkdown);
          }
        } catch (geminiError) {
          handleGeminiError(geminiError, "Model Synthesis");
        }
      }
    }

    if (!synthesisMarkdown) {
      // High-fidelity fallback builder
      const cityNames: Record<string, string> = {
        varanasi: "Varanasi (Kashi)",
        jaipur: "Jaipur (Pink City)",
        kochi: "Kochi (Malabar Coast)",
        hampi: "Hampi (Vijayanagara)"
      };
      const cityName = cityNames[city] || city;

      let sections = [];
      sections.push(`### **1. Modular Pipeline Integration Overview**
The combined execution of **[${activeModels.map((m: string) => m.toUpperCase()).join(" + ")}]** has established a unified predictive model for **${cityName}**. By coupling distinct telemetry vectors, the system can cross-examine environmental stressors against crowd-sourced sentiment, enabling proactive municipal resource allocation rather than reactive damage control.`);

      if (activeModels.includes("forecasting")) {
        const target = params.forecasting?.targetMetric || "Resource Needs";
        const horizon = params.forecasting?.horizon || "24 Hours";
        
        let predictionValue = "";
        let forecastInsight = "";
        if (target === "Resource Needs") {
          const neededSweepers = Math.round((inputs.touristMultiplier * 14) + (inputs.wasteManagementBudget < 150 ? 12 : 3));
          predictionValue = `demand of ${neededSweepers} sanitation units`;
          forecastInsight = `Driven by a **${inputs.touristMultiplier}x tourist volume multiplier**, the forecasting model projects a severe load on ghats and main pathways. Current waste management budget of ₹${inputs.wasteManagementBudget}L/mo will face a 15% deficit unless temporary workforce allocations are shifted.`;
        } else if (target === "Traffic Volume") {
          const projectedDelay = Math.round(metrics.trafficCongestion * 1.15);
          predictionValue = `congestion index peaking at ${projectedDelay}%`;
          forecastInsight = `With e-rickshaws responding to battery subsidies and pedestrian lane blocks, transit routes near central crossings are forecasted to experience bottlenecks. We predict high gridlock risks during peak evening hours over the next ${horizon}.`;
        } else {
          const densityMultiplier = Math.round(inputs.touristMultiplier * 100);
          predictionValue = `visitor density indexing at ${densityMultiplier}/hectare`;
          forecastInsight = `Our models forecast substantial localized crowding near active monument plazas. Recommended safety patrol intensity is estimated at ${Math.max(8, inputs.safetyPatrolIntensity + 3)} officers/ward to prevent congestion-driven scam rate rises.`;
        }

        sections.push(`### **2. Predictive Trend Projections (Forecasting)**
- **Target Analysis:** ${target} Metric Trend
- **Forecast Horizon:** ${horizon} Outwards
- **Model Output:** Projected ${predictionValue}
- **Algorithmic Evaluation:** ${forecastInsight}`);
      }

      if (activeModels.includes("sentiment")) {
        const source = params.sentiment?.source || "Real-Time Feeds";
        const weight = params.sentiment?.weight || 50;
        
        let sentimentSqueeze = "";
        if (inputs.middlemenCommissionCap > 30) {
          sentimentSqueeze = `Local artisan and weaver sentiment sits in the **negative spectrum (highly critical)**. Commission rates of ${inputs.middlemenCommissionCap}% are causing significant capital flight, causing craftsmen to complain on ${source} channels.`;
        } else {
          sentimentSqueeze = `Cooperative sentiment reports a **+${metrics.weaverCooperativeIncome}% income growth optimism**. Capping middlemen broker fees at ${inputs.middlemenCommissionCap}% has built massive trust, yielding high positive mentions across active tags.`;
        }

        sections.push(`### **3. Public Pulse & Artisan Sentiment (Sentiment Analysis)**
- **Telemetry Stream Source:** ${source}
- **Sensitivity Weighting:** ${weight}% Intensity
- **Public Pulse Result:** Calculated positive sentiment index of **${Math.round(60 + (50 - inputs.middlemenCommissionCap) * 0.6)}%**
- **Socio-Economic Narrative:** ${sentimentSqueeze} Standardized fares further reinforce visitor trust levels, currently measured at ${metrics.safetyTrustRating}/100.`);
      }

      if (activeModels.includes("anomaly")) {
        const freq = params.anomaly?.frequency || "15 mins";
        const thresh = params.anomaly?.threshold || "Medium";
        
        let riskScore = "LOW";
        let threatScenario = "";
        if (inputs.weatherHazard === "high") {
          riskScore = "CRITICAL / HIGH";
          threatScenario = `Severe climate conditions (${inputs.weatherHazard.toUpperCase()} Hazard) coupled with ${inputs.touristMultiplier}x tourist volume have triggered a red anomaly flag. Our neural detectors identify an 87% chance of river bank flooding or heat exhaustion bottlenecks near transit lanes.`;
        } else if (inputs.weatherHazard === "medium" || metrics.trafficCongestion > 70) {
          riskScore = "MODERATE / WARNING";
          threatScenario = `Narrow road intersections are exhibiting high congestion spikes (${metrics.trafficCongestion}%). Model predicts potential transit lockups near heritage portals within the hour. No immediate environmental emergencies are flagged.`;
        } else {
          riskScore = "NORMAL / SECURE";
          threatScenario = `Corridors are running inside standard limits. No anomalies detected. Continuous background scanning at ${freq} intervals remains active under a '${thresh}' alarm threshold.`;
        }

        sections.push(`### **4. Tactical Telemetry Alerts (Anomaly Detection)**
- **Scanning Frequency:** ${freq} Telemetry Cycles
- **Model Alarm Threshold:** ${thresh} Sensitivity
- **Calculated Risk Status:** [${riskScore}]
- **Anomalous Threat Signature:** ${threatScenario}`);
      }

      sections.push(`### **5. Combined Policy Recommendation**
Based on the combined neural synthesis, **${cityName}** should immediately coordinate policy levers:
1. **Financial Buffer:** Increase the sanitation/preservation budget by ₹${Math.round(inputs.wasteManagementBudget * 0.15)} Lakhs to offset the forecasted crowd debris.
2. **Transit Restructure:** Implement alternate-day e-rickshaw gating if the traffic forecasting model exceeds 75% flow delay.
3. **Cooperative Shield:** Secure the weaver commission cap to sustain the positive sentiment gains, which directly correlate with higher safety ratings and lower scam complaint filings.`);

      synthesisMarkdown = sections.join("\n\n");
    }

    res.json({
      success: true,
      synthesis: synthesisMarkdown,
      timestamp: new Date().toLocaleTimeString()
    });

  } catch (error: any) {
    console.error("Model synthesis endpoint error:", error);
    res.status(500).json({ error: "Failed to process modular AI model synthesis" });
  }
});

// Interactive AI Heritage Concierge Chatbot query endpoint
app.post("/api/chatbot/query", async (req, res) => {
  try {
    const { city, inputs, metrics, query, chatHistory } = req.body;

    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }

    const cityId = (city || "varanasi").toLowerCase();
    const cityNames: Record<string, string> = {
      varanasi: "Varanasi (Kashi)",
      jaipur: "Jaipur (Pink City)",
      kochi: "Kochi (Malabar Coast)",
      hampi: "Hampi (Vijayanagara)"
    };
    const cityName = cityNames[cityId] || (cityId.charAt(0).toUpperCase() + cityId.slice(1));

    let reply = "";

    if (isGeminiAvailable()) {
      const ai = getAI();
      if (ai) {
        try {
          const formattedHistory = (chatHistory || []).map((msg: any) => ({
            role: msg.role === "user" ? "user" : "model",
            parts: [{ text: msg.text || "" }]
          }));

          const activeSystemInstruction = `You are the Swadeshi AI Heritage Concierge, an elite, interactive municipal and tourism advisor for the Indian Heritage Corridor Civic & Tourism Intelligence Platform.
You are currently answering questions specifically about ${cityName}. 

Ground your suggestions and metrics deeply in these active simulation parameters:
- Rickshaw Subsidy: ₹${inputs?.rickshawSubsidy || 4000}/mo
- Waste Management Budget: ₹${inputs?.wasteManagementBudget || 150} Lakhs/mo
- Civic Safety Patrol Intensity: Tier ${inputs?.safetyPatrolIntensity || 5}
- Middlemen Commission Cap: ${inputs?.middlemenCommissionCap || 25}%
- Standardized Rate Cards: ${inputs?.standardizedRatesEnabled ? "ENABLED" : "DISABLED"}
- Tourist Multiplier: ${inputs?.touristMultiplier || 1.0}x
- Climate Hazard Level: ${inputs?.weatherHazard || "low"}

Active simulated outcomes:
- Artisan Capital Support: ${metrics?.economicDistribution || 65}%
- Safety & Trust Index: ${metrics?.safetyTrustRating || 72}/100
- Year-Over-Year Merchant Revenue Growth: ${metrics?.merchantRevenueGrowth || 12}%
- Scam Complaints Rate: ${metrics?.complaintsRate || 5} per 1k visitors
- Local Lane Transit Congestion: ${metrics?.trafficCongestion || 45}%
- Cooperative Growth YoY: +${metrics?.weaverCooperativeIncome || 14}%
- Cleanliness: ${metrics?.ghatCleanliness || 70}%

Keep your tone welcoming, culturally appreciative (appreciating Swadeshi crafts and heritage), professional, objective, and clear. Avoid flowery self-praise or marketing hype. Output beautiful Markdown (e.g. bullet points, bold headers, small clean tables) to answer the user's query clearly and concisely.`;

          const prompt = `User's Question: "${query}"`;

          // Let's use the standard generateContent call, passing the history and systemInstruction
          const response = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: [
              ...formattedHistory,
              { role: "user", parts: [{ text: prompt }] }
            ],
            config: {
              systemInstruction: activeSystemInstruction
            }
          });

          reply = response.text || "";
        } catch (geminiErr) {
          handleGeminiError(geminiErr, "Chatbot Query");
        }
      }
    }

    if (!reply) {
      // High-fidelity fallback rule engine if Gemini is rate-limited or missing keys
      const lowerQuery = query.toLowerCase();
      const cInputs = inputs || { rickshawSubsidy: 4000, wasteManagementBudget: 150, safetyPatrolIntensity: 5, middlemenCommissionCap: 25, standardizedRatesEnabled: true, weatherHazard: "low" };
      const cMetrics = metrics || { economicDistribution: 65, safetyTrustRating: 72, merchantRevenueGrowth: 12, complaintsRate: 5, trafficCongestion: 45, weaverCooperativeIncome: 14, ghatCleanliness: 70 };

      if (lowerQuery.includes("weaver") || lowerQuery.includes("co-op") || lowerQuery.includes("artisan") || lowerQuery.includes("saree") || lowerQuery.includes("handicraft") || lowerQuery.includes("pottery") || lowerQuery.includes("loom")) {
        reply = `### Weavers & Artisan Cooperative Support in ${cityName}
Artisan guilds are heavily dependent on fair trading rules. Under the current policy settings:
- **Middlemen Commission Cap**: Capped at **${cInputs.middlemenCommissionCap}%**.
- **Cooperative Growth YoY**: Currently at **+${cMetrics.weaverCooperativeIncome}%**.
- **Artisan Capital Support**: **${cMetrics.economicDistribution}%** of the tourist expenditure reaches micro-entrepreneurs directly.

*Recommendation*: Restricting middlemen commission caps below 20% will yield an extra simulated 8% YoY income hike for local Banarasi saree or Blue Pottery cooperatives. Ensure rate cards are active to protect artisan brand identity.`;
      } else if (lowerQuery.includes("scam") || lowerQuery.includes("safe") || lowerQuery.includes("safety") || lowerQuery.includes("police") || lowerQuery.includes("patrol") || lowerQuery.includes("trust") || lowerQuery.includes("complaint")) {
        reply = `### Civic Safety & Scam Prevention in ${cityName}
Our civic telemetry tracks visitor trust and complaint volumes. Based on active policy:
- **Safety Patrol Intensity**: **Tier ${cInputs.safetyPatrolIntensity}** patrols are deployed.
- **Safety & Trust Rating**: Evaluated at **${cMetrics.safetyTrustRating}/100**.
- **Scam Complaints**: Standardized at **${cMetrics.complaintsRate}** filed per 1,000 visitors.
- **Standardized Rate Cards**: Currently **${cInputs.standardizedRatesEnabled ? "ENABLED" : "DISABLED"}**.

*Advisor Notes*: Implementing standardized rate cards dramatically shields tourists from overcharging. If you raise your safety patrol level, you will notice complaints drop, stabilizing the regional travel trust index.`;
      } else if (lowerQuery.includes("clean") || lowerQuery.includes("dirty") || lowerQuery.includes("ghat") || lowerQuery.includes("trash") || lowerQuery.includes("waste") || lowerQuery.includes("budget") || lowerQuery.includes("silt")) {
        reply = `### Cleanliness & Sanitation Report for ${cityName}
Maintaining pristine public corridors is critical for heritage preservation. The active indicators show:
- **Sanitation Score**: Currently **${cMetrics.ghatCleanliness}%** clean.
- **Monthly Waste Budget**: **₹${cInputs.wasteManagementBudget} Lakhs**.
- **Active Weather Hazard**: **${cInputs.weatherHazard.toUpperCase()}** climate threat level.

*Recommendation*: In the event of a high climate hazard (like monsoon silt or desert sandstorms), standard budgets encounter severe bottlenecks. Boosting the local waste allocation above ₹250 Lakhs buffers the corridors from seasonal silt loads.`;
      } else if (lowerQuery.includes("route") || lowerQuery.includes("traffic") || lowerQuery.includes("congest") || lowerQuery.includes("delay") || lowerQuery.includes("rickshaw") || lowerQuery.includes("transit") || lowerQuery.includes("taxi")) {
        reply = `### Transit & Route Congestion in ${cityName}
Traffic flow directly shapes traveler satisfaction. Under your active configurations:
- **Local Congestion Rating**: **${cMetrics.trafficCongestion}%** delay.
- **Rickshaw Subsidy**: Set at **₹${cInputs.rickshawSubsidy}/mo** per driver.

*Advisor Notes*: Heavy subsidies boost clean, eco-friendly e-rickshaw fleets. However, narrow heritage alleys require careful pedestrian zoning to keep gridlock from clogging main monument junctions.`;
      } else {
        reply = `### Welcome to ${cityName} Swadeshi AI Concierge
I am your dedicated digital liaison, assisting with regional tourism, cooperative logistics, and civic policy tuning. 

Here is the current municipal health snapshot for **${cityName}**:
| Metric | Current Level | Status |
| :--- | :---: | :---: |
| **Artisan Income Support** | ${cMetrics.economicDistribution}% | ${cMetrics.economicDistribution > 60 ? "Optimal" : "Squeezed"} |
| **Safety & Trust Index** | ${cMetrics.safetyTrustRating}/100 | ${cMetrics.safetyTrustRating > 70 ? "Secure" : "At Risk"} |
| **Ghat/Aisle Cleanliness** | ${cMetrics.ghatCleanliness}% | ${cMetrics.ghatCleanliness > 75 ? "Pristine" : "Requires Funding"} |
| **Transit Congestion** | ${cMetrics.trafficCongestion}% | ${cMetrics.trafficCongestion > 50 ? "Congested" : "Flowing"} |

Ask me anything about local artisans, safety suggestions, custom walking tours, or how your policy sliders will shape ${cityName}'s grassroots economy!`;
      }
    }

    res.json({
      success: true,
      reply,
      timestamp: new Date().toLocaleTimeString()
    });

  } catch (error: any) {
    console.error("Chatbot API error:", error);
    res.status(500).json({ error: "Failed to process concierge inquiry" });
  }
});

// ==========================================
// MOUNT VITE AND SERVE FRONTEND
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Heritage Civic Dev Server booted on http://localhost:${PORT}`);
  });
}

startServer();
