'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Bot, Send, Sparkles, User, RefreshCw, Cpu, Activity, AlertTriangle, FileText, GitMerge, Target } from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'agi';
  text: string;
  timestamp: string;
  isStructured?: boolean;
}

const CAPABILITIES = [
  { icon: AlertTriangle, label: 'Anomaly Detection', desc: 'Flag neutron data anomalies >3σ' },
  { icon: Target, label: 'Landing Site Reports', desc: 'Artemis site recommendations' },
  { icon: GitMerge, label: 'Data Fusion', desc: 'LRO + LCROSS + our data → ice probability' },
  { icon: FileText, label: 'Paper Drafting', desc: 'Methods sections for peer review' },
];

function generateResponse(query: string): string {
  const q = query.toLowerCase();

  if (q.includes('anomal') || q.includes('sigma') || q.includes('neutron')) {
    return `🔍 ANOMALY DETECTION REPORT\n\nScanning 12,847 epithermal neutron count records...\n\n3 anomalies detected exceeding 3σ threshold:\n\n1. Shackleton Crater (-89.9°S, 0.0°E)\n   Count: 138 ± 4.2 cps (baseline: 210 cps)\n   Significance: 17.1σ\n   Interpretation: Strong hydrogen suppression → H₂O at ~5.4 wt%\n\n2. Cabeus Crater (-85.0°S, -35.5°E)\n   Count: 152 ± 5.1 cps\n   Significance: 11.4σ\n   Interpretation: Confirmed LCROSS impact site — water detected\n\n3. Haworth Crater (-87.4°S, -5.0°E)\n   Count: 168 ± 3.8 cps\n   Significance: 11.1σ\n   Interpretation: Moderate hydrogen, possible buried ice\n\nAll anomalies located within permanently shadowed regions with sustained temperatures <50K. Recommend priority observation passes for Haworth in next orbit cycle.`;
  }

  if (q.includes('landing') || q.includes('artemis') || q.includes('connecting') || q.includes('site')) {
    return `🎯 ARTEMIS LANDING SITE RECOMMENDATION REPORT\n\nTop 3 candidate sites based on multi-criteria decision analysis:\n\n1. Connecting Ridge (-89.4°S, 222.0°E) — PRIORITY: CRITICAL\n   Elevation: 1.4 km (max in region)\n   Solar Illumination: 86% annual\n   PSR Proximity: 2.1 km to Shackleton ice\n   Ice Concentration: ~5.4 wt%\n   ISRU Score: 92/100\n   Recommendation: Primary Artemis III candidate\n\n2. Malapert Mountain (-84.9°S, 12.9°E) — PRIORITY: HIGH\n   Elevation: 8.0 km\n   Solar Illumination: 78% annual\n   PSR Proximity: 4.5 km to Malapert PSR\n   Ice Concentration: ~3.2 wt%\n   ISRU Score: 81/100\n\n3. Nobile Rim 1 (-85.2°S, 53.5°E) — PRIORITY: MODERATE\n   Elevation: 1.7 km\n   PSR Proximity: 1.2 km to Nobile crater\n   Ice Concentration: ~4.1 wt%\n   ISRU Score: 78/100\n\nDecision matrix weights: illumination (30%), ice access (25%), terrain (20%), comms (15%), thermal (10%).`;
  }

  if (q.includes('fuse') || q.includes('fusion') || q.includes('merge') || q.includes('combine')) {
    return `🔄 MULTI-SOURCE DATA FUSION — ICE PROBABILITY MAP\n\nFusing 3 independent datasets:\n\n• LRO/LEND epithermal neutron data (2012-2024)\n  Resolution: 10 km/pixel, Sensitivity: 0.5 wt% H₂O\n\n• LCROSS ejecta plume spectral analysis (2009)\n  Centaur impact: ~155 kg H₂O confirmed\n  NIR absorption bands: 1.5μm, 2.0μm, 3.0μm\n\n• Luna Ice Mapper simulated payload (2028+)\n  NS resolution: ~50 km @ 100km orbit\n  NIR-CAM: 20m/pixel hyperspectral cube\n\nFusion Algorithm: Bayesian weighted evidence combination\n\nResults — Top 5 PSRs by fused ice probability:\n1. Cabeus: 94.2% (LCROSS confirmed + LEND + NIR)\n2. Shackleton: 89.1% (LEND + NIR, no direct sampling)\n3. Haworth: 76.8% (LEND only, NIR pending)\n4. Shoemaker: 71.3%\n5. Faustini: 68.7%\n\nPDS4 export ready. Recommend DOI assignment for fused dataset.`;
  }

  if (q.includes('paper') || q.includes('method') || q.includes('draft') || q.includes('jgr') || q.includes('write')) {
    return `📝 DRAFT METHODS SECTION — JGR: Planets\n\n2. METHODS\n\n2.1 Instrument Configuration\nThe Luna Ice Mapper carries a twin ³He proportional counter neutron spectrometer (NS) covering thermal (<0.025 eV) and epithermal (0.025 eV–100 keV) energy ranges, with a sensitivity of 0.5 wt% H₂O at 100 km orbital altitude. The NIR camera (NIR-CAM) utilizes a 256×256 InGaAs focal plane array operating across 1.0–2.5 μm with discrete bands at 1.25, 1.5, and 2.0 μm for water-ice absorption detection.\n\n2.2 Data Calibration\nRaw neutron counts were corrected for dead time (τ = 4.5 μs), cosmic ray background (subtracted using proton monitor), and converted to hydrogen abundance using the Feldman et al. (1991) calibration curve. NIR data were flat-fielded and calibrated to radiance using onboard calibration lamps.\n\n2.3 PSR Illumination\nPermanent shadow boundaries were defined as regions receiving <1% maximum annual solar illumination, computed using LOLA DEM at 240 m/pixel with solar ephemeris from SPICE kernels (spiceypy).\n\n2.4 Ice Probability Fusion\nWe employed Bayesian evidence combination to fuse LRO/LEND, LCROSS, and Luna Ice Mapper datasets into a unified ice probability map with 95% confidence intervals.\n\n— End draft —\nRecommend review by PRISM before submission.`;
  }

  if (q.includes('temperature') || q.includes('thermal') || q.includes('cold') || q.includes('kelvin')) {
    return `🌡️ THERMAL ANALYSIS — LUNAR SOUTH POLAR PSRs\n\nDiviner-derived temperatures for 12 mapped PSRs:\n\nColdest: Shackleton floor at 31 K (-242°C)\nWarmest: Nobile rim at 67 K (-206°C)\nMedian: 48 K across all PSRs\n\nThermal model confirms that temperatures below 110K permit stable H₂O ice for >1 Gyr timescales. All 12 mapped PSRs maintain persistent temperatures well below this threshold.\n\nKey finding: Thermal gradient modeling suggests ice deposits extend to depths of 2-4m in Shackleton, with sublimation rates <10⁻⁶ kg/m²/yr at current temperatures.`;
  }

  if (q.includes('budget') || q.includes('cost') || q.includes('mass') || q.includes('power')) {
    return `📊 SPACECRAFT RESOURCE BUDGET\n\nMass Budget (12 kg total):\n• Bus structure: 4.2 kg (35%)\n• NS payload: 1.5 kg (12.5%)\n• NIR-CAM: 1.2 kg (10%)\n• Propellant: 2.1 kg (17.5%)\n• Avionics: 1.8 kg (15%)\n• Margin: 1.2 kg (10%)\n\nPower Budget (30 W avg):\n• NS: 3 W | NIR-CAM: 2.5 W\n• ADCS: 4 W | Comms: 5 W\n• C&DH: 2 W | Thermal: 3 W\n• Solar charging margin: 10.5 W\n\nData Budget (8 GB storage):\n• NS science: 4.2 GB allocated\n• NIR hyperspectral: 2.8 GB\n• Housekeeping: 0.5 GB\n• Margin: 0.5 GB`;
  }

  return `Based on analysis of Luna Ice Mapper PDS4 datasets and LRO reference data:\n\nThe queried region shows hydrogen suppression consistent with ~2-6 wt% water-ice equivalent hydrogen concentration. This falls within the detectable range of our ³He neutron spectrometer (sensitivity threshold: 0.5 wt% H₂O).\n\nFor more specific analysis, try:\n• "Analyze anomalies in Shackleton crater"\n• "Generate Artemis landing site report"\n• "Fuse LRO + LCROSS + our data"\n• "Draft methods section for paper"`;
}

export default function LunaAgiPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'agi',
      text: 'Greetings, KOSASIH. I am Luna-AGI, the AI mission intelligence system for the Luna Ice Mapper. I can analyze neutron spectrometer data, generate Artemis landing site reports, fuse multi-source ice probability maps, and draft scientific manuscript sections.\n\nHow may I assist with your lunar science research today?',
      timestamp: '09:38:00 UTC',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const suggestedPrompts = [
    'Analyze neutron anomalies >3σ in Shackleton crater',
    'Generate Artemis landing site recommendation report',
    'Fuse LRO + LCROSS + our data into ice probability map',
    'Draft methods section for JGR paper',
    'Thermal analysis of south polar PSRs',
    'Spacecraft mass and power budget summary',
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' UTC',
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const agiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'agi',
        text: generateResponse(textToSend),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' UTC',
        isStructured: true,
      };
      setMessages((prev) => [...prev, agiMsg]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="glow" className="font-mono text-xs">
            LUNA-AGI AUTONOMOUS SCIENTIFIC ASSISTANT
          </Badge>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Luna-AGI Mission Intelligence
        </h1>
        <p className="text-sm text-slate-400 mt-1 max-w-2xl">
          Domain-trained AI model specialized in planetary science, lunar volatile thermodynamics,
          orbital link budgets, and NASA Artemis site trade studies.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Capabilities Sidebar */}
        <div className="lg:col-span-1 space-y-3">
          <Card className="border-slate-800">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Cpu className="h-4 w-4 text-sky-400" />
                <CardTitle className="text-sm font-bold">Capabilities</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {CAPABILITIES.map((cap) => (
                <div key={cap.label} className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1">
                  <div className="flex items-center gap-2">
                    <cap.icon className="h-3.5 w-3.5 text-sky-400 shrink-0" />
                    <span className="text-[11px] font-bold text-slate-200">{cap.label}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-mono">{cap.desc}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold">Model Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1.5 font-mono text-[10px]">
              <div className="flex justify-between"><span className="text-slate-400">Backend:</span><span className="text-emerald-400">PyTorch 2.4</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Model:</span><span className="text-sky-400">Luna-Sci-7B</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Context:</span><span className="text-slate-200">32K tokens</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Data:</span><span className="text-slate-200">LRO+LCROSS+LIM</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Status:</span><span className="text-emerald-400">● ONLINE</span></div>
            </CardContent>
          </Card>
        </div>

        {/* Chat Interface */}
        <Card glow className="lg:col-span-3 border-sky-500/40">
          <CardHeader className="py-3 bg-slate-950 border-b border-slate-800 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-sky-400 animate-pulse" />
              <CardTitle className="text-base font-bold">Luna-AGI Chat Console v2.4</CardTitle>
            </div>
            <Badge variant="cyan" className="font-mono text-xs">ONLINE</Badge>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="min-h-[380px] max-h-[500px] overflow-y-auto space-y-3 p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.sender === 'agi' && (
                    <div className="h-7 w-7 rounded bg-sky-950 border border-sky-500/40 text-sky-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="h-4 w-4" />
                    </div>
                  )}
                  <div className={`p-3 rounded-lg max-w-[85%] space-y-1 ${msg.sender === 'user' ? 'bg-sky-600 text-slate-950 font-semibold' : 'bg-slate-900 border border-slate-800 text-slate-200'}`}>
                    <p className="leading-relaxed whitespace-pre-line">{msg.text}</p>
                    <div className={`text-[9px] ${msg.sender === 'user' ? 'text-slate-900/80' : 'text-slate-500'}`}>{msg.timestamp}</div>
                  </div>
                  {msg.sender === 'user' && (
                    <div className="h-7 w-7 rounded bg-slate-800 text-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                      <User className="h-4 w-4" />
                    </div>
                  )}
                </div>
              ))}
              {isTyping && (
                <div className="flex items-center gap-2 text-sky-400 text-xs font-mono p-2">
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  <span>Luna-AGI is synthesizing response...</span>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Prompt Chips */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Suggested Prompts:</span>
              <div className="flex flex-wrap gap-2">
                {suggestedPrompts.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(prompt)}
                    className="text-[11px] font-mono px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:border-sky-500/40 hover:text-sky-400 transition-colors cursor-pointer"
                  >
                    + {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask Luna-AGI about PSR ice concentration, instrument specs, Artemis sites..."
                className="bg-slate-950 border-slate-800"
              />
              <Button onClick={() => handleSend()} className="gap-2 font-mono text-xs px-5">
                <Send className="h-4 w-4" /> Send
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
