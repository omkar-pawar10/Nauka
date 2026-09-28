"use client";

import { Settings2 } from "lucide-react";
import { useSystemStore } from "@/lib/store";

export function ScenarioWorkspace() {
  const { scenario, setScenario } = useSystemStore();

  const getCiiRating = (val: number) => {
    return ['A', 'B', 'C', 'D', 'E'][val - 1] || 'C';
  };

  const handleSave = () => {
    alert("Scenario saved (Persisted to IndexedDB via Zustand middleware)");
  };

  return (
    <div className="p-8 h-full flex flex-col gap-6 overflow-y-auto">
      <header>
        <h2 className="text-xl font-bold tracking-widest uppercase flex items-center gap-2">
          <Settings2 className="w-5 h-5 text-accent-orange" />
          Scenario Workspace
        </h2>
        <p className="text-sm text-white/40 mt-1">Optimization Formulation Constraints & Objectives</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <div className="border border-white/10 bg-[#0a0a0a] p-6">
            <h3 className="text-xs uppercase tracking-widest font-bold mb-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-accent-orange block"></span>
              Decision Variables
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "Vessel Mix", val: "Global Fleet (All Classes)" },
                { label: "Capacity (TEU)", val: "10,000 - 24,000" },
                { label: "Speed Bounds (Knots)", val: "12.0 - 22.5" },
                { label: "Fuel Type", val: "VLSFO / MGO / LNG" }
              ].map((item, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-widest text-white/40">{item.label}</label>
                  <div className="border border-white/20 bg-black px-3 py-2 text-sm font-mono text-white/80">
                    {item.val}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-white/10 bg-[#0a0a0a] p-6">
            <h3 className="text-xs uppercase tracking-widest font-bold mb-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-white/50 block"></span>
              Constraints
            </h3>
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-widest text-white/40">Cargo Volume Target</label>
                <div className="flex items-center gap-4">
                  <input type="range" className="flex-1 accent-white" value={scenario.cargoVolumeTarget} onChange={e => setScenario({ cargoVolumeTarget: Number(e.target.value) })} min="0" max="100" />
                  <span className="text-xs font-mono w-16 text-right">{scenario.cargoVolumeTarget}%</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-widest text-white/40">Schedule Windows (Slack)</label>
                <div className="flex items-center gap-4">
                  <input type="range" className="flex-1 accent-white" value={scenario.scheduleSlackHours} onChange={e => setScenario({ scheduleSlackHours: Number(e.target.value) })} min="0" max="168" />
                  <span className="text-xs font-mono w-16 text-right">&plusmn;{scenario.scheduleSlackHours} HRS</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-widest text-white/40">Emission Limits (CII Threshold)</label>
                <div className="flex items-center gap-4">
                  <input type="range" className="flex-1 accent-white" value={scenario.ciiThresholdRating} onChange={e => setScenario({ ciiThresholdRating: Number(e.target.value) })} min="1" max="5" />
                  <span className="text-xs font-mono w-16 text-right">RATING {getCiiRating(scenario.ciiThresholdRating)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="border border-white/10 bg-[#0a0a0a] p-6">
             <h3 className="text-xs uppercase tracking-widest font-bold mb-6">Objectives</h3>
             <div className="space-y-3">
               <div onClick={() => setScenario({ minimizeFuel: !scenario.minimizeFuel })} className={`border ${scenario.minimizeFuel ? 'border-accent-green/50 bg-accent-green/10 text-accent-green' : 'border-white/10 bg-black text-white/40'} p-3 text-xs uppercase tracking-widest cursor-pointer hover:border-white/30 transition-colors`}>
                 Minimize Fuel Consumption
               </div>
               <div onClick={() => setScenario({ minimizeEmissions: !scenario.minimizeEmissions })} className={`border ${scenario.minimizeEmissions ? 'border-accent-green/50 bg-accent-green/10 text-accent-green' : 'border-white/10 bg-black text-white/40'} p-3 text-xs uppercase tracking-widest cursor-pointer hover:border-white/30 transition-colors`}>
                 Minimize Emissions (CO2e)
               </div>
               <div onClick={() => setScenario({ minimizeCost: !scenario.minimizeCost })} className={`border ${scenario.minimizeCost ? 'border-accent-green/50 bg-accent-green/10 text-accent-green' : 'border-white/10 bg-black text-white/40'} p-3 text-xs uppercase tracking-widest cursor-pointer hover:border-white/30 transition-colors`}>
                 Minimize Total Cost
               </div>
             </div>
          </div>
          
          <button onClick={handleSave} className="w-full bg-accent-orange text-black font-bold uppercase tracking-widest text-sm py-4 hover:bg-accent-orange/90 transition-colors">
            Save Scenario
          </button>
        </div>
      </div>
    </div>
  );
}
