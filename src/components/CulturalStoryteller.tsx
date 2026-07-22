import React, { useState, useEffect, useMemo, useRef } from "react";
import { useLanguage } from "../lib/LanguageContext";
import { 
  Compass, 
  MapPin, 
  Sparkles, 
  Play, 
  Pause, 
  Volume2, 
  Mic, 
  Cpu, 
  PlusCircle, 
  BookOpen, 
  Search, 
  CheckCircle,
  Clock,
  Radio,
  FileText,
  User,
  Activity,
  Heart
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface CulturalStorytellerProps {
  activeCity: string;
  onShowToast: (message: string, type?: "success" | "warning" | "info") => void;
}

interface NarrativeSegment {
  id: string;
  title: string;
  contributor: string;
  contributorRole: string;
  streetName: string;
  category: "culinary" | "architecture" | "crafts" | "folklore";
  audioDuration: string;
  transcript: string;
  synthesizedContext: string;
  relevanceScore: number;
}

const CITY_NARRATIVES: Record<string, NarrativeSegment[]> = {
  varanasi: [
    {
      id: "v_narr_1",
      title: "Madanpura Weaver Guild Traditions",
      contributor: "Haji Anees Ansari",
      contributorRole: "7th Generation Weaver Guild Leader",
      streetName: "Kunj Gali, Madanpura",
      category: "crafts",
      audioDuration: "1:45",
      transcript: "My family has been on this loom since before the partition. When you touch this silk, you aren't feeling cloth; you are feeling the exact tension of my great-grandfather's heartbeat. We preserve the pure zari weave, resisting cheaper synthetic threads. The water here and the humidity of the Ganges is what sets the Banarasi threads perfectly.",
      synthesizedContext: "Synthesized using Vertex AI RAG. AlloyDB spatial query found high proximity vector cluster in Madanpura weaving guild.",
      relevanceScore: 98
    },
    {
      id: "v_narr_2",
      title: "The Alchemical Spices of Kachori Gali",
      contributor: "Pandey Ji",
      contributorRole: "Heritage Street Food Artisan",
      streetName: "Kachori Gali, Vishwanath Outer Ring",
      category: "culinary",
      audioDuration: "1:15",
      transcript: "The secrets of our kachoris lie in the custom spice blends. We don't buy spices; we pound them daily using sandstone mortars. The cumin is toasted over open flame, and the hing is sourced directly from Kabul vendors. Every morning at 4:30 AM, pilgrims eat here before crossing to the temples. This food is prasad.",
      synthesizedContext: "Synthesized using Vertex AI RAG. Resolved vectors in cul_history category.",
      relevanceScore: 95
    },
    {
      id: "v_narr_3",
      title: "Echoes of the River Aarti Waves",
      contributor: "Shastri Shivam Dwivedi",
      contributorRole: "Lead Aarti Officiant, Dashashwamedh",
      streetName: "Dashashwamedh Ghatfront Alleys",
      category: "folklore",
      audioDuration: "2:05",
      transcript: "When the bronze lamps are held high, the rhythm is synchronized. The copper plates we use vibrate at specific frequencies. This Aarti was not just a ceremony; it was a rhythmic resonance designed to calm the nervous system of pilgrims arriving after long journeys. The river breeze acts as a medium for the incense vapor.",
      synthesizedContext: "Synthesized using Vertex AI RAG. Spatial coordinates: 25.3079° N, 83.0105° E.",
      relevanceScore: 92
    }
  ],
  jaipur: [
    {
      id: "j_narr_1",
      title: "Sanganer Hand-Block Pigment Secrets",
      contributor: "Maestro Ramesh Chhipa",
      contributorRole: "Master Block Printer",
      streetName: "Sanganer Printers Road",
      category: "crafts",
      audioDuration: "1:52",
      transcript: "The wood is teak, carved by hand. But the real magic is the natural black dye. We ferment scrap iron filings with molasses for thirty days. When the iron bonds with the hard water of Sanganer, it creates an intense, rich black that never fades, even under sixty Rajasthani summers. Factories cannot replicate this bond.",
      synthesizedContext: "Synthesized using Vertex AI RAG. Indexed under regional_dye_chemistry.",
      relevanceScore: 99
    },
    {
      id: "j_narr_2",
      title: "The Mathematical Symmetries of Johri Bazaar",
      contributor: "Vipin Mehta",
      contributorRole: "Traditional Gem Archeologist",
      streetName: "Johri Bazaar Inner Arcade",
      category: "architecture",
      audioDuration: "1:35",
      transcript: "Sawai Jai Singh was an astronomer first. He aligned Johri Bazaar exactly along the east-west axis. The width of the road is mathematically proportioned so that at solar noon, the shadows vanish entirely. This allows buyers and sellers to appraise the flawless clarity of gems in direct solar light without polarization.",
      synthesizedContext: "Synthesized using Vertex AI RAG. AlloyDB pgvector matching astronomy_architecture cluster.",
      relevanceScore: 91
    },
    {
      id: "j_narr_3",
      title: "Saffron Chai Brew of Lassiwala Outer Ring",
      contributor: "Mishra Ji",
      contributorRole: "Traditional Clay-Pot Tea Brewer",
      streetName: "MI Road Arcade Wards",
      category: "culinary",
      audioDuration: "1:10",
      transcript: "We serve only in raw clay kulhads. Why? Because the unglazed clay absorbs the excess moisture from the thick reduced buffalo milk, lending a smoky earthen flavor you cannot get in glass or paper. Our saffron is soaked in cardamom distillate for five hours before blending. That is the traditional Jaipur scent.",
      synthesizedContext: "Synthesized using Vertex AI RAG. Resolved in regional_culinary category.",
      relevanceScore: 94
    }
  ],
  kochi: [
    {
      id: "k_narr_1",
      title: "Spices of the Portuguese Warehouse Alleys",
      contributor: "Sara Cohen",
      contributorRole: "Jew Town Heritage Shopkeeper",
      streetName: "Jew Town Spice Arcade",
      category: "culinary",
      audioDuration: "1:30",
      transcript: "The pepper from the Malabar coast is not just spicy; it has notes of lime and cedar. When the Portuguese first built these dark stone warehouses, they designed high ventilation shafts to let the sea breeze circulate. This keeps the dry ginger and cinnamon cool, retaining their volatile oils without modern refrigeration.",
      synthesizedContext: "Synthesized using Vertex AI RAG. Resolved vectors in spice_trade_history.",
      relevanceScore: 97
    },
    {
      id: "k_narr_2",
      title: "Chinese Fishing Nets Woodwork Wisdom",
      contributor: "Appu Kunjachan",
      contributorRole: "Traditional Net Guild Carpenter",
      streetName: "Fort Kochi Net Beach Walkway",
      category: "crafts",
      audioDuration: "1:58",
      transcript: "These giant nets rely on exact balances. We use local teak logs coupled with heavy granite stones tied to organic coir ropes. If the teak is not seasoned in brackish backwaters first, the salt air will rot the wood in six months. The nets behave like wings—the wind has to flow through them, not drag them.",
      synthesizedContext: "Synthesized using Vertex AI RAG. Spatial coordinates: 9.9692° N, 76.2421° E.",
      relevanceScore: 94
    }
  ],
  hampi: [
    {
      id: "h_narr_1",
      title: "The Sacred Banana Fiber Basket Guild",
      contributor: "Shantamma Gowda",
      contributorRole: "Anegundi Fiber Women Collective Leader",
      streetName: "Kishkindha Crafts Plaza, Anegundi",
      category: "crafts",
      audioDuration: "1:42",
      transcript: "We harvest the discard pseudostems from local farmers after the fruit is picked. Instead of burning them, we split the fibers, dry them on boulders, and braid them. It takes three days to make a water-resilient handbag. When you hold it, you feel Hampi's soil, Hampi's sun, and the self-reliance of our women.",
      synthesizedContext: "Synthesized using Vertex AI RAG. AlloyDB pgvector matching sustainable_weaving cluster.",
      relevanceScore: 98
    },
    {
      id: "h_narr_2",
      title: "Acoustic Wonders of the Musical Pillars",
      contributor: "Dr. Prabhakar Rao",
      contributorRole: "Vittala Temple Restoration Historian",
      streetName: "Vittala Temple Inner Sanctum",
      category: "architecture",
      audioDuration: "2:10",
      transcript: "These 56 pillars are solid granite, yet when struck gently, they emit notes representing traditional wind and string instruments. The artisans did not use hollow stones; they blended specific silica concentrations into the solid basalt before carving, aligning structural loads so resonance could escape through the bases.",
      synthesizedContext: "Synthesized using Vertex AI RAG. Resolved in acoustics_history category.",
      relevanceScore: 96
    }
  ]
};

export default function CulturalStoryteller({ activeCity, onShowToast }: CulturalStorytellerProps) {
  const { language, translateDynamic, t } = useLanguage();
  const cityKey = activeCity?.toLowerCase() || "varanasi";
  const baseNarratives = useMemo(() => {
    return CITY_NARRATIVES[cityKey] || CITY_NARRATIVES.varanasi;
  }, [cityKey]);

  // States
  const [selectedCategory, setSelectedCategory] = useState<"all" | "culinary" | "architecture" | "crafts" | "folklore">("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeStory, setActiveStory] = useState<NarrativeSegment | null>(null);
  const [translatedStory, setTranslatedStory] = useState<NarrativeSegment | null>(null);

  useEffect(() => {
    if (!activeStory) {
      setTranslatedStory(null);
      return;
    }

    if (language === "en") {
      setTranslatedStory(activeStory);
      return;
    }

    let isMounted = true;
    const performTranslation = async () => {
      try {
        const [translatedTitle, translatedTranscript, translatedContext] = await Promise.all([
          translateDynamic(activeStory.title),
          translateDynamic(activeStory.transcript),
          translateDynamic(activeStory.synthesizedContext)
        ]);

        if (isMounted) {
          setTranslatedStory({
            ...activeStory,
            title: translatedTitle,
            transcript: translatedTranscript,
            synthesizedContext: translatedContext
          });
        }
      } catch (err) {
        console.error("Story translation error:", err);
        if (isMounted) {
          setTranslatedStory(activeStory);
        }
      }
    };

    performTranslation();

    return () => {
      isMounted = false;
    };
  }, [activeStory, language, translateDynamic]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackProgress, setPlaybackProgress] = useState<number>(0);
  const [ragFocus, setRagFocus] = useState<string>("Artisan Guild Traditions");
  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);

  // Elder Contribution Form States
  const [contributorName, setContributorName] = useState<string>("");
  const [contributorRole, setContributorRole] = useState<string>("");
  const [storyLocation, setStoryLocation] = useState<string>("");
  const [storyCategory, setStoryCategory] = useState<"culinary" | "architecture" | "crafts" | "folklore">("crafts");
  const [storyTranscript, setStoryTranscript] = useState<string>("");
  const [customNarratives, setCustomNarratives] = useState<NarrativeSegment[]>([]);

  const audioTimerRef = useRef<any>(null);

  // Combine static and custom user-uploaded narratives
  const narratives = useMemo(() => {
    const cityCustom = customNarratives.filter(n => n.id.startsWith(`${cityKey}_`));
    return [...cityCustom, ...baseNarratives];
  }, [baseNarratives, customNarratives, cityKey]);

  // Filter based on category and search query
  const filteredNarratives = useMemo(() => {
    return narratives.filter(n => {
      const matchCategory = selectedCategory === "all" || n.category === selectedCategory;
      const matchQuery = searchQuery === "" || 
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        n.transcript.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.contributor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.streetName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchQuery;
    });
  }, [narratives, selectedCategory, searchQuery]);

  // Audio Playback simulation
  useEffect(() => {
    if (isPlaying) {
      audioTimerRef.current = setInterval(() => {
        setPlaybackProgress(prev => {
          const next = prev + 1.5;
          if (next >= 100) {
            return 100;
          }
          return next;
        });
      }, 150);
    } else {
      if (audioTimerRef.current) clearInterval(audioTimerRef.current);
    }

    return () => {
      if (audioTimerRef.current) clearInterval(audioTimerRef.current);
    };
  }, [isPlaying]);

  // Handle completion of playback
  useEffect(() => {
    if (playbackProgress >= 100 && isPlaying) {
      setIsPlaying(false);
      setPlaybackProgress(0);
      onShowToast(`📻 Finished playback of "${activeStory?.title}" narrative.`, "success");
    }
  }, [playbackProgress, isPlaying, activeStory, onShowToast]);

  const handleSelectStory = (story: NarrativeSegment) => {
    if (activeStory?.id === story.id) {
      setIsPlaying(!isPlaying);
    } else {
      setActiveStory(story);
      setIsPlaying(true);
      setPlaybackProgress(0);
      onShowToast(`🗣️ Synthesizing local elder voice for "${story.title}" using Text-to-Speech API...`, "info");
    }
  };

  // Simulate Vertex AI / AlloyDB Spatial RAG re-ranking
  const handleTriggerRAG = (focus: string) => {
    setRagFocus(focus);
    setIsSynthesizing(true);
    onShowToast(`🧠 Querying AlloyDB pgvector with spatial focus: "${focus}"...`, "info");
    
    setTimeout(() => {
      setIsSynthesizing(false);
      onShowToast(`✓ Vertex AI Agent Builder retrieved ${filteredNarratives.length} contextual neighborhood records.`, "success");
    }, 1500);
  };

  // Handle local elder upload contribution form
  const handleSubmitContribution = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contributorName || !storyTranscript || !storyLocation) {
      onShowToast("⚠️ Please complete all narrative fields.", "warning");
      return;
    }

    onShowToast("🧠 Processing elder voice note through Gemini Multimodal Speech and extracting text embeddings...", "info");
    
    setTimeout(() => {
      const newNarrative: NarrativeSegment = {
        id: `${cityKey}_custom_${Date.now()}`,
        title: `Oral Heritage: ${storyLocation}`,
        contributor: contributorName,
        contributorRole: contributorRole || "Traditional Local Resident",
        streetName: storyLocation,
        category: storyCategory,
        audioDuration: "1:20",
        transcript: storyTranscript,
        synthesizedContext: "Indexed successfully in AlloyDB pgvector. Verified authentic high-dimensional embedding vector generated.",
        relevanceScore: 99
      };

      setCustomNarratives(prev => [newNarrative, ...prev]);
      onShowToast(`🎉 Swadeshi Storyteller narrative by ${contributorName} successfully synchronized!`, "success");
      
      // Reset form
      setContributorName("");
      setContributorRole("");
      setStoryLocation("");
      setStoryTranscript("");
    }, 1500);
  };

  return (
    <div className="space-y-8 lg:col-span-12 w-full text-white" id="cultural-storyteller-module">
      
      {/* Hyper-Local Cultural Storyteller Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-brand-dark p-6 rounded-[32px] border border-brand-teal/20 shadow-2xl">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Radio className="h-5 w-5 text-brand-rose animate-pulse" />
            <span className="text-[9px] font-mono font-black text-brand-rose uppercase tracking-widest bg-brand-rose/10 px-2 py-0.5 rounded border border-brand-rose/20">
              Vertex AI Location-Based RAG Audio Guide
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black font-display text-white">
            Hyper-Local Swadeshi "Cultural Storyteller"
          </h2>
          <p className="text-xs text-slate-400">
            Synthesizing neighborhood narratives of local elders and craft guild master weavers using <strong>AlloyDB pgvector</strong>.
          </p>
        </div>

        <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 px-3 py-1.5 rounded-xl border border-amber-400/20 font-mono capitalize">
          📍 Active Ward: {activeCity} Corridor
        </span>
      </div>

      {/* THREE INTERACTIVE BLOCKS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT TWO-THIRDS: NARRATIVE SEARCH & AUDIO PLAYBACK PLAYER (COL-SPAN-7) */}
        <div className="lg:col-span-7 bg-brand-dark p-6 rounded-[32px] border border-brand-teal/20 shadow-xl space-y-6">
          
          {/* Header & Personalization RAG focus */}
          <div className="border-b border-brand-teal/10 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="text-[8px] font-mono font-black text-brand-teal uppercase tracking-widest block">
                CONTEXT-AWARE PERSONALIZATION
              </span>
              <h3 className="text-sm font-black text-white font-display uppercase tracking-wider mt-1">
                Explore Neighborhood Wards
              </h3>
            </div>

            {/* Personalized RAG Interests */}
            <div className="flex bg-brand-bg/85 p-0.5 rounded-xl border border-brand-teal/10 gap-0.5">
              {["Artisan Guild Traditions", "Culinary", "Architecture"].map((focus) => (
                <button
                  key={focus}
                  type="button"
                  onClick={() => handleTriggerRAG(focus)}
                  className={`px-2.5 py-1 text-[9px] font-mono font-bold rounded-lg transition-all cursor-pointer ${
                    ragFocus === focus
                      ? "bg-brand-rose text-brand-deep font-black"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {focus}
                </button>
              ))}
            </div>
          </div>

          <p className="text-[10px] text-slate-400 leading-relaxed font-semibold">
            Using <strong>Vertex AI Agent Builder</strong> and <strong>AlloyDB pgvector</strong> spatial indices, the system pulls oral lore uploaded by real residents as you move. Select a street node below to tune into the synthesized audio guide.
          </p>

          {/* Search bar and Category Pills */}
          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <div className="w-full relative">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search streets, names, or historical events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-brand-bg/60 border border-brand-teal/20 rounded-2xl text-[11.5px] font-bold text-white placeholder-slate-400 focus:outline-none focus:border-brand-rose/50 transition-all font-sans"
              />
            </div>

            <div className="flex bg-brand-deep/60 p-1 rounded-xl border border-brand-teal/10 gap-1 overflow-x-auto w-full sm:w-auto shrink-0">
              {(["all", "crafts", "culinary", "architecture", "folklore"] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-[9px] font-extrabold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                    selectedCategory === cat 
                      ? "bg-brand-rose text-brand-deep font-black" 
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* RAG Retrieving Simulation Loader */}
          {isSynthesizing ? (
            <div className="py-12 text-center space-y-3.5">
              <div className="relative inline-block">
                <div className="animate-ping absolute inset-0 rounded-full bg-brand-rose/20 w-10 h-10 mx-auto" />
                <div className="relative bg-brand-rose text-brand-deep rounded-full p-3 w-12 h-12 flex items-center justify-center mx-auto">
                  <Cpu className="h-5 w-5 animate-pulse" />
                </div>
              </div>
              <p className="text-[10.5px] font-mono font-bold text-brand-rose uppercase tracking-widest">
                Re-ranking high-dimensional spatial narratives in AlloyDB pgvector cluster...
              </p>
            </div>
          ) : (
            /* Narrative Cards Grid */
            <div className="grid grid-cols-1 gap-4 max-h-96 overflow-y-auto custom-scrollbar pr-1">
              {filteredNarratives.length === 0 ? (
                <div className="py-12 text-center text-slate-400 space-y-2 border border-dashed border-brand-teal/15 rounded-2xl bg-brand-bg/10">
                  <Volume2 className="h-8 w-8 text-slate-500 mx-auto" />
                  <p className="text-xs font-bold font-sans">No matching neighborhood oral notes found.</p>
                  <p className="text-[10px] text-slate-500">Try adjusting your interest category filter or write-up query.</p>
                </div>
              ) : (
                filteredNarratives.map((narrative) => {
                  const isActive = activeStory?.id === narrative.id;
                  return (
                    <div
                      key={narrative.id}
                      onClick={() => handleSelectStory(narrative)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer text-left relative overflow-hidden group ${
                        isActive
                          ? "bg-brand-rose/5 border-brand-rose/30"
                          : "bg-brand-bg/30 border-brand-teal/10 hover:border-brand-teal/25 hover:bg-brand-bg/50"
                      }`}
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="space-y-1">
                          <span className="text-[9px] font-mono text-brand-teal uppercase tracking-wider font-extrabold flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-brand-rose" />
                            {narrative.streetName}
                          </span>
                          <h4 className="text-[12px] font-black text-white uppercase tracking-wide group-hover:text-brand-rose transition-colors mt-1">
                            {isActive && translatedStory ? translatedStory.title : narrative.title}
                          </h4>
                          <p className="text-[10px] text-slate-300 leading-normal line-clamp-2 mt-1">
                            "{isActive && translatedStory ? translatedStory.transcript : narrative.transcript}"
                          </p>
                        </div>

                        {/* Play trigger button */}
                        <div className={`p-2.5 rounded-xl border flex-shrink-0 transition-all ${
                          isActive && isPlaying 
                            ? "bg-brand-rose border-brand-rose/30 text-brand-deep scale-110" 
                            : "bg-brand-dark border-brand-teal/10 text-brand-rose group-hover:bg-brand-teal/10"
                        }`}>
                          {isActive && isPlaying ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4 fill-current" />
                          )}
                        </div>
                      </div>

                      {/* Card Footer info */}
                      <div className="mt-3 pt-3 border-t border-brand-teal/5 flex justify-between items-center text-[9px] font-mono font-extrabold text-slate-400">
                        <span className="flex items-center gap-1 text-slate-400">
                          <User className="h-3.5 w-3.5 text-slate-500" />
                          {narrative.contributor} ({narrative.contributorRole})
                        </span>
                        <span className="text-brand-teal font-mono">
                          Duration: {narrative.audioDuration} • Similarity: {narrative.relevanceScore}%
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: ACTIVE AUDIO PLAYER (TOP) & CONTRIBUTIONS (BOTTOM) (COL-SPAN-5) */}
        <div className="lg:col-span-5 space-y-8 flex flex-col justify-start">
          
          {/* ACTIVE SYNTHESIS AUDIO PLAYER CARD */}
          <div className="bg-brand-dark p-6 rounded-[32px] border border-brand-teal/20 shadow-xl space-y-4">
            <div className="border-b border-brand-teal/10 pb-3">
              <span className="text-[8px] font-mono font-black text-brand-rose uppercase tracking-widest block">
                NARRATIVE SOUNDS ENGINE
              </span>
              <h3 className="text-sm font-black text-white font-display uppercase tracking-wider mt-1">
                Audio Synthesizer Player
              </h3>
            </div>

            {activeStory ? (
              <div className="space-y-4 animate-fade-in text-slate-300">
                <div className="space-y-1 text-center py-2 bg-brand-bg/20 rounded-2xl border border-brand-teal/5">
                  <h4 className="text-[11px] font-black text-white uppercase tracking-wide px-2 truncate">
                    {(translatedStory || activeStory).title}
                  </h4>
                  <span className="text-[8.5px] font-mono text-slate-400">
                    Voice of {activeStory.contributor}
                  </span>
                </div>

                {/* Simulated Audio Wave Animation */}
                <div className="h-10 flex items-center justify-center gap-1 bg-brand-deep/40 rounded-xl px-4 border border-brand-teal/5">
                  {isPlaying ? (
                    Array.from({ length: 18 }).map((_, i) => {
                      const heights = ["h-3", "h-6", "h-4", "h-8", "h-2", "h-5", "h-7", "h-3", "h-4"];
                      const delay = `${i * 0.1}s`;
                      return (
                        <div 
                          key={i} 
                          className={`w-1 bg-brand-rose rounded-full ${heights[i % heights.length]} animate-pulse`} 
                          style={{ animationDelay: delay, animationDuration: "0.8s" }} 
                        />
                      );
                    })
                  ) : (
                    <div className="text-[9px] font-mono text-slate-500 font-bold uppercase tracking-wider">
                      Audio Paused. Press play above to trigger synthesis.
                    </div>
                  )}
                </div>

                {/* Progress bar and controls */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[8px] font-mono text-slate-400">
                    <span>{isPlaying ? `0:${Math.round(playbackProgress * 0.6).toString().padStart(2, '0')}` : "0:00"}</span>
                    <span>{activeStory.audioDuration}</span>
                  </div>
                  <div className="w-full bg-brand-deep/80 h-1.5 rounded-full overflow-hidden cursor-pointer" onClick={() => isPlaying && setPlaybackProgress(prev => Math.min(100, prev + 10))}>
                    <div 
                      className="bg-brand-rose h-full transition-all duration-300" 
                      style={{ width: `${playbackProgress}%` }} 
                    />
                  </div>
                </div>

                {/* RAG Context metadata */}
                <div className="p-3 bg-amber-500/5 border border-amber-500/10 rounded-2xl space-y-1.5">
                  <span className="text-[8px] font-mono font-extrabold text-amber-400 uppercase tracking-wider block flex items-center gap-1">
                    <Sparkles className="h-3 w-3 text-amber-400" />
                    Vertex AI RAG Context Strategy:
                  </span>
                  <p className="text-[9.5px] text-slate-300 leading-normal font-medium italic">
                    "{(translatedStory || activeStory).synthesizedContext}"
                  </p>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-slate-400 space-y-3.5 bg-brand-bg/10 border border-dashed border-brand-teal/15 rounded-2xl">
                <div className="bg-brand-deep/80 text-brand-rose rounded-full p-2.5 w-10 h-10 flex items-center justify-center mx-auto border border-brand-teal/5">
                  <Volume2 className="h-4.5 w-4.5" />
                </div>
                <div className="space-y-1 px-4">
                  <p className="text-[10.5px] font-bold font-sans">No Active Oral Narrative Selected</p>
                  <p className="text-[9px] text-slate-500 leading-normal max-w-xs mx-auto">
                    Click a neighborhood card on the left to synthesize high-fidelity Speech with localized AlloyDB context.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ELDER VOICE NOTE UPLOADER CONTRIBUTIONS CARD */}
          <div className="bg-brand-dark p-6 rounded-[32px] border border-brand-teal/20 shadow-xl space-y-4">
            <div className="border-b border-brand-teal/10 pb-3">
              <span className="text-[8px] font-mono font-black text-brand-rose uppercase tracking-widest block">
                PRESERVE LOCAL KNOWLEDGE
              </span>
              <h3 className="text-sm font-black text-white font-display uppercase tracking-wider mt-1">
                Artisan Oral Lore Upload Desk
              </h3>
            </div>

            <p className="text-[9.5px] text-slate-400 leading-normal font-semibold">
              Elders, weavers, and shopkeepers can upload oral history voice clips. Process through Gemini to extract translation nodes.
            </p>

            <form onSubmit={handleSubmitContribution} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[8px] font-mono font-bold text-slate-400 uppercase tracking-widest block">Contributor Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g., Ramesh Weave-Master"
                    value={contributorName}
                    onChange={(e) => setContributorName(e.target.value)}
                    className="w-full px-3 py-2 bg-brand-bg/50 border border-brand-teal/15 rounded-xl text-[10px] text-white focus:outline-none focus:border-brand-rose/40 font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] font-mono font-bold text-slate-400 uppercase tracking-widest block">Role / Guild Title</label>
                  <input 
                    type="text" 
                    placeholder="e.g., Traditional Dyer"
                    value={contributorRole}
                    onChange={(e) => setContributorRole(e.target.value)}
                    className="w-full px-3 py-2 bg-brand-bg/50 border border-brand-teal/15 rounded-xl text-[10px] text-white focus:outline-none focus:border-brand-rose/40 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[8px] font-mono font-bold text-slate-400 uppercase tracking-widest block">Street Location Ward</label>
                  <input 
                    type="text" 
                    placeholder="e.g., Sanganer Market Alley"
                    value={storyLocation}
                    onChange={(e) => setStoryLocation(e.target.value)}
                    className="w-full px-3 py-2 bg-brand-bg/50 border border-brand-teal/15 rounded-xl text-[10px] text-white focus:outline-none focus:border-brand-rose/40 font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] font-mono font-bold text-slate-400 uppercase tracking-widest block">Lore Category</label>
                  <select
                    value={storyCategory}
                    onChange={(e) => setStoryCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-brand-bg/50 border border-brand-teal/15 rounded-xl text-[10px] text-white focus:outline-none focus:border-brand-rose/40 font-bold cursor-pointer"
                  >
                    <option value="crafts">🎨 Traditional Crafts</option>
                    <option value="culinary">🍛 Culinary Heritage</option>
                    <option value="architecture">🏛️ Architecture</option>
                    <option value="folklore">🌸 Folklore & Rituals</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[8px] font-mono font-bold text-slate-400 uppercase tracking-widest block">Voice Note Transcription / Lore Details</label>
                <textarea 
                  rows={2}
                  placeholder="Record or transcribe what makes this ward unique..."
                  value={storyTranscript}
                  onChange={(e) => setStoryTranscript(e.target.value)}
                  className="w-full px-3 py-2 bg-brand-bg/50 border border-brand-teal/15 rounded-xl text-[10px] text-white focus:outline-none focus:border-brand-rose/40 font-bold placeholder-slate-500 font-sans leading-normal resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-brand-rose hover:bg-brand-rose/95 text-brand-deep font-extrabold text-[10px] rounded-xl transition-all cursor-pointer uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md active:scale-95"
              >
                <Mic className="h-3.5 w-3.5" />
                <span>Upload Artisan Voice Lore</span>
              </button>
            </form>
          </div>

        </div>

      </div>

    </div>
  );
}
