import React, { useState, useEffect } from "react";
import { 
  Brain, 
  TrendingUp, 
  Smile, 
  AlertTriangle, 
  Play, 
  Check, 
  Activity, 
  Sparkles, 
  Settings, 
  RefreshCw, 
  Cpu, 
  Database,
  ArrowRight,
  HelpCircle,
  MessageSquare,
  Zap,
  Info
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { PolicyInputs, SimulationResult } from "../types";

interface AIModelLibraryProps {
  activeCity: 'varanasi' | 'jaipur' | 'kochi' | 'hampi';
  inputs: PolicyInputs;
  metrics: SimulationResult;
}

type ModelID = 'forecasting' | 'sentiment' | 'anomaly';

interface ForecastingParams {
  targetMetric: 'Resource Needs' | 'Traffic Volume' | 'Visitor Density';
  horizon: '12 Hours' | '24 Hours' | '7 Days';
}

interface SentimentParams {
  source: 'Real-Time Feeds' | 'Incident Logs' | 'Social Tags';
  weight: number; // 10 to 100
}

interface AnomalyParams {
  frequency: '5 mins' | '15 mins' | 'Hourly';
  threshold: 'Low' | 'Medium' | 'High';
}

export default function AIModelLibrary({ activeCity, inputs, metrics }: AIModelLibraryProps) {
  // Model selection state - all selected by default to show combination power
  const [selectedModels, setSelectedModels] = useState<ModelID[]>(['forecasting', 'sentiment', 'anomaly']);
  
  // Model parameters state
  const [forecastParams, setForecastParams] = useState<ForecastingParams>({
    targetMetric: 'Resource Needs',
    horizon: '24 Hours'
  });
  const [sentimentParams, setSentimentParams] = useState<SentimentParams>({
    source: 'Real-Time Feeds',
    weight: 70
  });
  const [anomalyParams, setAnomalyParams] = useState<AnomalyParams>({
    frequency: '15 mins',
    threshold: 'Medium'
  });

  // Simulation execution state
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStepText, setCurrentStepText] = useState("");
  const [processingLogs, setProcessingLogs] = useState<string[]>([]);
  const [hasExecuted, setHasExecuted] = useState(false);
  const [synthesisText, setSynthesisText] = useState("");
  const [isFetchingSynthesis, setIsFetchingSynthesis] = useState(false);

  // Toggle model selection
  const toggleModel = (id: ModelID) => {
    setSelectedModels(prev => 
      prev.includes(id) 
        ? prev.filter(m => m !== id)
        : [...prev, id]
    );
  };

  // Run the pipeline
  const executePipeline = async () => {
    if (selectedModels.length === 0) return;
    
    setIsProcessing(true);
    setProcessingLogs([]);
    setHasExecuted(false);

    const steps = [
      "Initializing AI pipeline and mapping spatial coordinates...",
      `Querying active sensor networks for ${activeCity.toUpperCase()}...`,
      selectedModels.includes('forecasting') ? `Extrapolating historical matrices for [${forecastParams.targetMetric}]...` : "",
      selectedModels.includes('sentiment') ? `Weighting local opinion feeds (${sentimentParams.weight}% sensitivity on ${sentimentParams.source})...` : "",
      selectedModels.includes('anomaly') ? `Synthesizing neural anomaly thresholds at ${anomalyParams.frequency} intervals...` : "",
      "Chaining modular layers into combined Swadeshi Decision Model...",
      "Generating strategic predictive synthesis report..."
    ].filter(Boolean);

    // Staggered log printing for premium simulation aesthetic
    for (let i = 0; i < steps.length; i++) {
      setCurrentStepText(steps[i]);
      setProcessingLogs(prev => [...prev, steps[i]]);
      await new Promise(resolve => setTimeout(resolve, 600));
    }

    setIsProcessing(false);
    setHasExecuted(true);
    fetchSynthesis();
  };

  // Fetch synthesis report from our full-stack server
  const fetchSynthesis = async () => {
    setIsFetchingSynthesis(true);
    try {
      const response = await fetch('/api/models/synthesize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          city: activeCity,
          activeModels: selectedModels,
          params: {
            forecasting: forecastParams,
            sentiment: sentimentParams,
            anomaly: anomalyParams
          },
          inputs,
          metrics
        })
      });

      const data = await response.json();
      if (data.success) {
        setSynthesisText(data.synthesis);
      } else {
        setSynthesisText("### Error\nFailed to compile dynamic model insights.");
      }
    } catch (err) {
      console.error("Failed to fetch model synthesis:", err);
      setSynthesisText("### Network Offline\nCould not fetch real-time synthesis report.");
    } finally {
      setIsFetchingSynthesis(false);
    }
  };

  // Auto-run model library pipeline when inputs or activeCity changes to stay dynamic
  useEffect(() => {
    if (hasExecuted) {
      fetchSynthesis();
    }
  }, [activeCity, inputs, metrics]);

  // City Name mapper
  const cityLabel = activeCity.charAt(0).toUpperCase() + activeCity.slice(1);

  // Custom parser to turn markdown headings & bullets into beautiful custom bento cards
  const renderParsedSynthesis = () => {
    if (!synthesisText) return null;

    // Split markdown by H3 headings
    const parts = synthesisText.split(/###\s+/);
    const intro = parts[0];
    const sections = parts.slice(1);

    return (
      <div className="space-y-6">
        {intro && intro.trim() && (
          <div className="text-xs text-slate-300 bg-brand-bg/40 p-4 rounded-2xl border border-brand-teal/10 leading-relaxed font-medium">
            {intro.replace(/\*\*/g, '')}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sections.map((sec, idx) => {
            const lines = sec.trim().split('\n');
            const heading = lines[0].replace(/\*\*/g, '').replace(/:/g, '');
            const contentLines = lines.slice(1).filter(l => l.trim() !== "");

            // Pick a matching icon and color based on content keywords
            let cardIcon = <Sparkles className="h-4 w-4" />;
            let borderTheme = "border-brand-teal/20";
            let textTheme = "text-brand-teal";
            let bgTheme = "bg-brand-bg/50";

            if (heading.toLowerCase().includes("overview") || heading.toLowerCase().includes("pipeline")) {
              cardIcon = <Cpu className="h-4 w-4 text-brand-rose" />;
              borderTheme = "border-brand-rose/25";
              textTheme = "text-brand-rose";
            } else if (heading.toLowerCase().includes("forecasting") || heading.toLowerCase().includes("trend")) {
              cardIcon = <TrendingUp className="h-4 w-4 text-cyan-400" />;
              borderTheme = "border-cyan-500/20";
              textTheme = "text-cyan-400";
            } else if (heading.toLowerCase().includes("sentiment") || heading.toLowerCase().includes("pulse")) {
              cardIcon = <Smile className="h-4 w-4 text-emerald-400" />;
              borderTheme = "border-emerald-500/20";
              textTheme = "text-emerald-400";
            } else if (heading.toLowerCase().includes("anomaly") || heading.toLowerCase().includes("alert")) {
              cardIcon = <AlertTriangle className="h-4 w-4 text-amber-400 animate-pulse" />;
              borderTheme = "border-amber-500/20";
              textTheme = "text-amber-400";
              bgTheme = "bg-amber-950/10";
            }

            return (
              <div 
                key={idx} 
                className={`p-5 rounded-3xl border ${borderTheme} ${bgTheme} space-y-3.5 shadow-md flex flex-col justify-between transition-all hover:scale-[1.01]`}
              >
                <div>
                  <div className="flex items-center gap-2 border-b border-brand-teal/10 pb-2.5">
                    <div className="p-1.5 rounded-lg bg-brand-bg border border-brand-teal/15">
                      {cardIcon}
                    </div>
                    <h4 className={`text-xs font-extrabold uppercase tracking-wider ${textTheme}`}>
                      {heading}
                    </h4>
                  </div>

                  <div className="text-[11px] text-slate-300 leading-relaxed font-medium space-y-2 mt-3">
                    {contentLines.map((line, lIdx) => {
                      const cleanLine = line.replace(/^-\s+\*\*/, '• ').replace(/^\d+\.\s+\*\*/, '').replace(/\*\*/g, '').replace(/^-/, '•');
                      return (
                        <p key={lIdx} className={cleanLine.startsWith('•') ? "pl-2" : ""}>
                          {cleanLine}
                        </p>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8" id="ai-model-library-root">
      
      {/* Title block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-brand-deep/50 p-6 rounded-[32px] border border-brand-teal/15 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-brand-rose/10 flex items-center justify-center text-brand-rose">
              <Brain className="h-5 w-5" />
            </div>
            <h2 className="text-sm font-extrabold text-white font-display uppercase tracking-wider">
              Swadeshi Model Library
            </h2>
          </div>
          <p className="text-[11px] text-slate-400 max-w-xl font-medium">
            Combine time-series forecasting, crowd sentiment, and anomalous telemetry feeds into a single decision vector for {cityLabel}.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[9px] font-mono font-extrabold text-slate-400 uppercase tracking-widest bg-brand-bg px-3 py-1.5 rounded-full border border-brand-teal/10">
            Node: {activeCity.toUpperCase()}
          </span>
          <span className="w-2.5 h-2.5 rounded-full bg-brand-teal animate-pulse" />
        </div>
      </div>

      {/* Model Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Model 1: Forecasting */}
        <div 
          className={`bg-brand-dark rounded-[28px] border transition-all flex flex-col justify-between overflow-hidden relative ${
            selectedModels.includes('forecasting') 
              ? 'border-brand-rose shadow-md bg-brand-bg/10' 
              : 'border-brand-teal/15 hover:border-brand-teal/30 bg-brand-dark/40'
          }`}
        >
          {selectedModels.includes('forecasting') && (
            <div className="absolute top-4 right-4 bg-brand-rose text-brand-deep w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold">
              <Check className="h-3.5 w-3.5 stroke-[3]" />
            </div>
          )}
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/15">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">Time-Series Forecast</h3>
                <span className="text-[9px] text-slate-500 font-mono">MODEL v2.4-PREDICT</span>
              </div>
            </div>
            
            <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
              Extrapolates corridor load and tourist density. Uses multi-horizon recurrent trends to estimate future municipal resource needs.
            </p>

            {/* Parameters Panel */}
            <div className="pt-3 border-t border-brand-teal/10 space-y-3">
              <div className="space-y-1">
                <label className="text-[9px] font-mono font-extrabold text-slate-400 uppercase block">Target Metric</label>
                <select 
                  value={forecastParams.targetMetric}
                  onChange={(e) => setForecastParams(p => ({ ...p, targetMetric: e.target.value as any }))}
                  disabled={!selectedModels.includes('forecasting')}
                  className="w-full bg-brand-bg text-[10px] font-extrabold text-slate-200 border border-brand-teal/15 rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-brand-rose disabled:opacity-40"
                >
                  <option value="Resource Needs">Resource Needs (Sweepers/Patrols)</option>
                  <option value="Traffic Volume">Traffic Volume (Lanes Delay)</option>
                  <option value="Visitor Density">Visitor Density (Crowd/Ha)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-mono font-extrabold text-slate-400 uppercase block">Forecast Horizon</label>
                <select 
                  value={forecastParams.horizon}
                  onChange={(e) => setForecastParams(p => ({ ...p, horizon: e.target.value as any }))}
                  disabled={!selectedModels.includes('forecasting')}
                  className="w-full bg-brand-bg text-[10px] font-extrabold text-slate-200 border border-brand-teal/15 rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-brand-rose disabled:opacity-40"
                >
                  <option value="12 Hours">12 Hours Outward</option>
                  <option value="24 Hours">24 Hours Outward</option>
                  <option value="7 Days">7 Days Historical Cycle</option>
                </select>
              </div>
            </div>
          </div>

          <button 
            onClick={() => toggleModel('forecasting')}
            className={`w-full py-3.5 text-[10px] font-extrabold uppercase border-t tracking-wider cursor-pointer transition-all ${
              selectedModels.includes('forecasting')
                ? 'bg-brand-rose/10 hover:bg-brand-rose/20 text-brand-rose border-brand-rose/20'
                : 'bg-brand-bg/40 hover:bg-brand-bg text-slate-400 border-brand-teal/10'
            }`}
          >
            {selectedModels.includes('forecasting') ? 'Selected' : 'Include Model'}
          </button>
        </div>

        {/* Model 2: Sentiment Analysis */}
        <div 
          className={`bg-brand-dark rounded-[28px] border transition-all flex flex-col justify-between overflow-hidden relative ${
            selectedModels.includes('sentiment') 
              ? 'border-brand-rose shadow-md bg-brand-bg/10' 
              : 'border-brand-teal/15 hover:border-brand-teal/30 bg-brand-dark/40'
          }`}
        >
          {selectedModels.includes('sentiment') && (
            <div className="absolute top-4 right-4 bg-brand-rose text-brand-deep w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold">
              <Check className="h-3.5 w-3.5 stroke-[3]" />
            </div>
          )}
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/15">
                <Smile className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">Artisan Sentiment</h3>
                <span className="text-[9px] text-slate-500 font-mono">MODEL v1.2-NLP</span>
              </div>
            </div>
            
            <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
              Analyzes weaver and merchant sentiment feeds. Isolates intermediary broker friction versus direct trade happiness values.
            </p>

            {/* Parameters Panel */}
            <div className="pt-3 border-t border-brand-teal/10 space-y-3">
              <div className="space-y-1">
                <label className="text-[9px] font-mono font-extrabold text-slate-400 uppercase block">Telemetry Source</label>
                <select 
                  value={sentimentParams.source}
                  onChange={(e) => setSentimentParams(p => ({ ...p, source: e.target.value as any }))}
                  disabled={!selectedModels.includes('sentiment')}
                  className="w-full bg-brand-bg text-[10px] font-extrabold text-slate-200 border border-brand-teal/15 rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-brand-rose disabled:opacity-40"
                >
                  <option value="Real-Time Feeds">Social Media & News Feeds</option>
                  <option value="Incident Logs">Visitor Complaint Reports</option>
                  <option value="Social Tags">Artisan Guild Transcripts</option>
                </select>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center text-[9px] font-mono font-extrabold text-slate-400 uppercase">
                  <span>Sensitivity Weight</span>
                  <span className="text-emerald-400 font-mono">{sentimentParams.weight}%</span>
                </div>
                <input 
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={sentimentParams.weight}
                  onChange={(e) => setSentimentParams(p => ({ ...p, weight: parseInt(e.target.value) }))}
                  disabled={!selectedModels.includes('sentiment')}
                  className="w-full cursor-pointer h-1.5 rounded-lg bg-brand-bg accent-emerald-500 disabled:opacity-40"
                />
              </div>
            </div>
          </div>

          <button 
            onClick={() => toggleModel('sentiment')}
            className={`w-full py-3.5 text-[10px] font-extrabold uppercase border-t tracking-wider cursor-pointer transition-all ${
              selectedModels.includes('sentiment')
                ? 'bg-brand-rose/10 hover:bg-brand-rose/20 text-brand-rose border-brand-rose/20'
                : 'bg-brand-bg/40 hover:bg-brand-bg text-slate-400 border-brand-teal/10'
            }`}
          >
            {selectedModels.includes('sentiment') ? 'Selected' : 'Include Model'}
          </button>
        </div>

        {/* Model 3: Anomaly Detection */}
        <div 
          className={`bg-brand-dark rounded-[28px] border transition-all flex flex-col justify-between overflow-hidden relative ${
            selectedModels.includes('anomaly') 
              ? 'border-brand-rose shadow-md bg-brand-bg/10' 
              : 'border-brand-teal/15 hover:border-brand-teal/30 bg-brand-dark/40'
          }`}
        >
          {selectedModels.includes('anomaly') && (
            <div className="absolute top-4 right-4 bg-brand-rose text-brand-deep w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold">
              <Check className="h-3.5 w-3.5 stroke-[3]" />
            </div>
          )}
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/15">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">Anomaly Detector</h3>
                <span className="text-[9px] text-slate-500 font-mono">MODEL v3.0-ANOMALY</span>
              </div>
            </div>
            
            <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
              Scans sensor feeds for sudden traffic blockages, localized hazard spikes, and security report density anomalies.
            </p>

            {/* Parameters Panel */}
            <div className="pt-3 border-t border-brand-teal/10 space-y-3">
              <div className="space-y-1">
                <label className="text-[9px] font-mono font-extrabold text-slate-400 uppercase block">Scan Frequency</label>
                <select 
                  value={anomalyParams.frequency}
                  onChange={(e) => setAnomalyParams(p => ({ ...p, frequency: e.target.value as any }))}
                  disabled={!selectedModels.includes('anomaly')}
                  className="w-full bg-brand-bg text-[10px] font-extrabold text-slate-200 border border-brand-teal/15 rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-brand-rose disabled:opacity-40"
                >
                  <option value="5 mins">5 mins Real-Time Sweeps</option>
                  <option value="15 mins">15 mins Segment Analysis</option>
                  <option value="Hourly">Hourly Broad Indexing</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-mono font-extrabold text-slate-400 uppercase block">Alert Sensitivity</label>
                <div className="grid grid-cols-3 gap-1.5 pt-1">
                  {(['Low', 'Medium', 'High'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      disabled={!selectedModels.includes('anomaly')}
                      onClick={() => setAnomalyParams(p => ({ ...p, threshold: lvl }))}
                      className={`py-1.5 text-[9px] font-extrabold rounded-lg border transition-all uppercase cursor-pointer ${
                        anomalyParams.threshold === lvl && selectedModels.includes('anomaly')
                          ? "bg-amber-500 text-brand-deep border-transparent shadow-md"
                          : "bg-brand-bg text-slate-400 border-brand-teal/15 hover:bg-brand-bg/80 disabled:opacity-30"
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <button 
            onClick={() => toggleModel('anomaly')}
            className={`w-full py-3.5 text-[10px] font-extrabold uppercase border-t tracking-wider cursor-pointer transition-all ${
              selectedModels.includes('anomaly')
                ? 'bg-brand-rose/10 hover:bg-brand-rose/20 text-brand-rose border-brand-rose/20'
                : 'bg-brand-bg/40 hover:bg-brand-bg text-slate-400 border-brand-teal/10'
            }`}
          >
            {selectedModels.includes('anomaly') ? 'Selected' : 'Include Model'}
          </button>
        </div>

      </div>

      {/* Joint Model Execution Sandbox / Pipelines */}
      <div className="bg-brand-dark p-6 rounded-[32px] border border-brand-teal/20 shadow-md">
        
        {/* Dynamic Graph Visualizer */}
        <div className="border-b border-brand-teal/10 pb-5 mb-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Cpu className="h-4.5 w-4.5 text-brand-rose animate-spin-slow" />
            <div>
              <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">Joint Model Pipeline Orchestrator</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Visually connect active neural telemetry blocks</p>
            </div>
          </div>

          <button
            onClick={executePipeline}
            disabled={selectedModels.length === 0 || isProcessing}
            className="px-6 py-3.5 bg-brand-rose hover:bg-brand-rose/95 text-brand-deep font-extrabold text-xs rounded-2xl transition-all shadow-md flex items-center gap-2 uppercase tracking-wider cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed select-none"
            id="execute-ai-pipeline-btn"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Compiling Neurals...</span>
              </>
            ) : (
              <>
                <Play className="h-4 w-4 fill-brand-deep" />
                <span>Execute Pipeline ({selectedModels.length} Models)</span>
              </>
            )}
          </button>
        </div>

        {/* Modular Pipeline Connector Animation Area */}
        <div className="bg-brand-bg/40 rounded-2xl p-6 border border-brand-teal/10 min-h-[160px] flex flex-col justify-center items-center relative overflow-hidden">
          
          <AnimatePresence mode="wait">
            {isProcessing ? (
              /* Processing step logs scrolling */
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full max-w-lg space-y-2.5 text-center"
              >
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 rounded-full border-4 border-t-brand-rose border-brand-teal/10 animate-spin" />
                </div>
                <h4 className="text-xs font-extrabold text-brand-rose animate-pulse uppercase tracking-widest font-mono">
                  {currentStepText}
                </h4>
                <div className="text-[9px] font-mono text-brand-teal space-y-1.5 opacity-80 h-24 overflow-y-auto pt-2 text-left bg-brand-bg/80 p-3 rounded-xl border border-brand-teal/15 max-h-[100px]">
                  {processingLogs.map((log, index) => (
                    <div key={index} className="flex items-center gap-1.5">
                      <span className="text-brand-rose">❯</span>
                      <span>{log}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : !hasExecuted ? (
              /* Ready state pipeline visuals */
              <div className="w-full max-w-2xl flex flex-col sm:flex-row justify-between items-center gap-6 py-4">
                
                {/* Inputs node */}
                <div className="flex flex-col items-center gap-1.5 z-10 bg-brand-dark p-3.5 rounded-2xl border border-brand-teal/15 w-28">
                  <Database className="h-4.5 w-4.5 text-brand-teal" />
                  <span className="text-[9px] font-mono font-extrabold uppercase text-slate-300">Space Telemetry</span>
                  <span className="text-[8px] font-bold text-slate-500 font-mono">Input Vectors</span>
                </div>

                <div className="hidden sm:block flex-1 h-0.5 bg-dashed-line border-t border-dashed border-brand-teal/20 relative">
                  <div className="absolute top-1/2 left-1/3 w-1.5 h-1.5 bg-brand-teal rounded-full animate-flow-1" />
                </div>

                {/* Models chain */}
                <div className="flex flex-col items-center gap-2.5">
                  <div className="flex gap-2">
                    {['forecasting', 'sentiment', 'anomaly'].map(m => {
                      const active = selectedModels.includes(m as ModelID);
                      return (
                        <div 
                          key={m}
                          className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all ${
                            active 
                              ? 'bg-brand-rose/10 text-brand-rose border-brand-rose/45 shadow-[0_0_10px_rgba(230,72,51,0.15)]' 
                              : 'bg-brand-bg text-slate-600 border-brand-teal/10'
                          }`}
                        >
                          {m === 'forecasting' && <TrendingUp className="h-4.5 w-4.5" />}
                          {m === 'sentiment' && <Smile className="h-4.5 w-4.5" />}
                          {m === 'anomaly' && <AlertTriangle className="h-4.5 w-4.5" />}
                        </div>
                      );
                    })}
                  </div>
                  <span className="text-[9px] font-mono font-extrabold uppercase text-slate-300">Neural Chainer</span>
                </div>

                <div className="hidden sm:block flex-1 h-0.5 bg-dashed-line border-t border-dashed border-brand-teal/20 relative">
                  <div className="absolute top-1/2 left-1/3 w-1.5 h-1.5 bg-brand-rose rounded-full animate-flow-2" />
                </div>

                {/* Combined Out */}
                <div className="flex flex-col items-center gap-1.5 z-10 bg-brand-dark p-3.5 rounded-2xl border border-brand-rose/25 w-28 shadow-lg">
                  <Brain className="h-4.5 w-4.5 text-brand-rose animate-pulse" />
                  <span className="text-[9px] font-mono font-extrabold uppercase text-brand-rose">Decision Matrix</span>
                  <span className="text-[8px] font-bold text-slate-500 font-mono">Joint Synthesis</span>
                </div>

              </div>
            ) : (
              /* Success pipeline completed visualization */
              <div className="w-full flex flex-col items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-teal/10 border border-brand-teal text-brand-teal flex items-center justify-center mb-1">
                  <Check className="h-5 w-5 stroke-[3]" />
                </div>
                <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">Joint Pipeline Run Successful</h4>
                <p className="text-[10px] text-slate-400 font-medium text-center max-w-sm">
                  Corridor model compiled successfully for {cityLabel}. Results plotted in index dashboard below.
                </p>
                <button
                  onClick={() => setHasExecuted(false)}
                  className="mt-1 text-[9px] font-mono font-extrabold text-brand-rose hover:underline uppercase tracking-wider"
                >
                  Configure and Rerun Pipeline
                </button>
              </div>
            )}
          </AnimatePresence>

        </div>

      </div>

      {/* Dynamic Results Deck */}
      {hasExecuted && (
        <motion.div 
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="space-y-8"
          id="ai-model-results-deck"
        >
          
          {/* Dynamic SVG Plot Section */}
          <div className="bg-brand-dark p-6 rounded-[32px] border border-brand-teal/20 shadow-md space-y-5">
            <div className="border-b border-brand-teal/10 pb-4 flex justify-between items-center">
              <div>
                <h3 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                  <Activity className="h-4 w-4 text-cyan-400" />
                  24-Hour Corridor Prediction Sandbox
                </h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Simulated forecast curve responding to model weights</p>
              </div>
              <div className="flex flex-wrap gap-3.5 text-[9px] font-mono font-bold">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-0.5 bg-brand-teal inline-block" />
                  <span className="text-slate-300">Base Trend</span>
                </div>
                {selectedModels.includes('forecasting') && (
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-0.5 bg-dashed border-t-2 border-dashed border-cyan-400 inline-block" />
                    <span className="text-slate-300">Projected Forecast</span>
                  </div>
                )}
                {selectedModels.includes('anomaly') && (
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-brand-rose inline-block animate-ping" />
                    <span className="text-slate-300">Anomaly Point</span>
                  </div>
                )}
              </div>
            </div>

            {/* SVG Plot Wrapper */}
            <div className="bg-brand-bg/40 p-4 rounded-2xl border border-brand-teal/10 relative">
              <svg viewBox="0 0 800 240" className="w-full h-auto overflow-visible select-none">
                {/* Horizontal Grid lines */}
                <line x1="50" y1="40" x2="750" y2="40" stroke="#1d2e33" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="50" y1="90" x2="750" y2="90" stroke="#1d2e33" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="50" y1="140" x2="750" y2="140" stroke="#1d2e33" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="50" y1="190" x2="750" y2="190" stroke="#1d2e33" strokeWidth="1" strokeDasharray="3 3" />

                {/* Bottom Baseline X axis */}
                <line x1="50" y1="190" x2="750" y2="190" stroke="#2a454d" strokeWidth="1.5" />

                {/* X Axis Labels */}
                <text x="50" y="212" fill="#64748b" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">08:00</text>
                <text x="166" y="212" fill="#64748b" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">10:00</text>
                <text x="282" y="212" fill="#64748b" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">12:00</text>
                <text x="398" y="212" fill="#64748b" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">14:00</text>
                <text x="514" y="212" fill="#64748b" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">16:00</text>
                <text x="630" y="212" fill="#64748b" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">18:00</text>
                <text x="746" y="212" fill="#64748b" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">20:00</text>

                {/* Baseline Trend Plot Curve (SVG Path) */}
                <path 
                  d="M 50 160 Q 166 120, 282 145 T 514 110 T 746 165" 
                  fill="none" 
                  stroke="#376e6f" 
                  strokeWidth="3.5" 
                  strokeLinecap="round"
                />

                {/* Time-Series Forecasting Model Curve Overlay */}
                {selectedModels.includes('forecasting') && (
                  <>
                    {/* Confidence shaded area */}
                    <path 
                      d="M 50 150 Q 166 110, 282 135 T 514 90 T 746 145 L 746 185 Q 514 130, 282 155 T 50 170 Z" 
                      fill="rgba(34, 211, 238, 0.05)" 
                      stroke="none"
                    />
                    {/* Forecasted trend curve */}
                    <path 
                      d="M 50 155 Q 166 115, 282 140 T 514 100 T 746 155" 
                      fill="none" 
                      stroke="#22d3ee" 
                      strokeWidth="2.5" 
                      strokeLinecap="round" 
                      strokeDasharray="4 4"
                    />
                  </>
                )}

                {/* Anomaly Detection Model Markers */}
                {selectedModels.includes('anomaly') && (
                  <>
                    {/* Anomaly Node 1 at 14:00 (Hawa Mahal peak / Godowlia bottleneck) */}
                    <circle cx="398" cy="115" r="9" fill="rgba(230, 72, 51, 0.15)" stroke="#e64833" strokeWidth="2" className="animate-pulse" />
                    <circle cx="398" cy="115" r="3" fill="#e64833" />
                    <text x="398" y="94" fill="#e64833" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">ANOMALY SPIKE</text>

                    {/* Anomaly Node 2 at 18:00 if high congestion */}
                    {metrics.trafficCongestion > 65 && (
                      <>
                        <circle cx="630" cy="120" r="9" fill="rgba(230, 72, 51, 0.15)" stroke="#e64833" strokeWidth="2" className="animate-pulse" />
                        <circle cx="630" cy="120" r="3" fill="#e64833" />
                        <text x="630" y="99" fill="#e64833" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">GRIDLOCK RISK</text>
                      </>
                    )}
                  </>
                )}

                {/* Sentiment emoji indicators */}
                {selectedModels.includes('sentiment') && (
                  <>
                    {/* High commission = frown, capped commission = smile */}
                    {inputs.middlemenCommissionCap > 30 ? (
                      <g transform="translate(166, 110)" className="opacity-90">
                        <circle cx="0" cy="0" r="10" fill="#1e293b" stroke="#f43f5e" strokeWidth="1.5" />
                        <circle cx="-3.5" cy="-2.5" r="1" fill="#f43f5e" />
                        <circle cx="3.5" cy="-2.5" r="1" fill="#f43f5e" />
                        <path d="M -4 4 Q 0 1, 4 4" fill="none" stroke="#f43f5e" strokeWidth="1.5" strokeLinecap="round" />
                        <text x="16" y="3" fill="#f43f5e" fontSize="8" fontWeight="extrabold">Friction</text>
                      </g>
                    ) : (
                      <g transform="translate(166, 110)" className="opacity-90">
                        <circle cx="0" cy="0" r="10" fill="#1e293b" stroke="#10b981" strokeWidth="1.5" />
                        <circle cx="-3.5" cy="-2.5" r="1" fill="#10b981" />
                        <circle cx="3.5" cy="-2.5" r="1" fill="#10b981" />
                        <path d="M -4 1 Q 0 5, 4 1" fill="none" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" />
                        <text x="16" y="3" fill="#10b981" fontSize="8" fontWeight="extrabold">Co-op Joy</text>
                      </g>
                    )}
                  </>
                )}
              </svg>
            </div>
          </div>

          {/* AI Narrative Synthesis Board */}
          <div className="bg-brand-dark p-6 rounded-[32px] border border-brand-teal/20 shadow-md space-y-5">
            <div className="border-b border-brand-teal/10 pb-4 flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-brand-rose/10 text-brand-rose">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-xs font-extrabold text-white uppercase tracking-wider block font-display">
                    Neural Pipeline Executive Synthesis
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">Coordinated recommendation report of combined analytics</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isFetchingSynthesis && (
                  <RefreshCw className="h-3 w-3 animate-spin text-brand-rose" />
                )}
                <span className="text-[8px] font-mono font-extrabold text-brand-rose uppercase tracking-widest bg-brand-deep px-2.5 py-1 rounded border border-brand-rose/20">
                  Swadeshi Orchestrator Active
                </span>
              </div>
            </div>

            {/* Markdown rendered layout */}
            {isFetchingSynthesis && !synthesisText ? (
              <div className="py-12 flex flex-col justify-center items-center gap-3">
                <RefreshCw className="h-6 w-6 animate-spin text-brand-rose" />
                <span className="text-[10px] font-mono text-slate-400">Querying decision layer matrix...</span>
              </div>
            ) : (
              renderParsedSynthesis()
            )}
          </div>

        </motion.div>
      )}

    </div>
  );
}
