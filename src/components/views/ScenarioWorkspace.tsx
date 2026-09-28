import { Settings2 } from "lucide-react";

export function ScenarioWorkspace() {
  return (
    <div className="p-8 h-full flex flex-col gap-6 overflow-y-auto">
      <header>
        <h2 className="text-xl font-bold tracking-widest uppercase flex items-center gap-2">
          <Settings2 className="w-5 h-5 text-accent-orange" />
          Scenario Workspace
        </h2>
        <p className="text-sm text-white/40 mt-1">Optimization Formulation Constraints & Objectives</p>
      </header>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <div className="border border-white/10 bg-[#0a0a0a] p-6">
            <h3 className="text-xs uppercase tracking-widest font-bold mb-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-accent-orange block"></span>
              Decision Variables
            </h3>
            <div className="grid grid-cols-2 gap-4">
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
                  <input type="range" className="flex-1 accent-white" defaultValue="80" />
                  <span className="text-xs font-mono w-16 text-right">80%</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-widest text-white/40">Schedule Windows (Slack)</label>
                <div className="flex items-center gap-4">
                  <input type="range" className="flex-1 accent-white" defaultValue="48" />
                  <span className="text-xs font-mono w-16 text-right">±48 HRS</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-widest text-white/40">Emission Limits (CII Threshold)</label>
                <div className="flex items-center gap-4">
                  <input type="range" className="flex-1 accent-white" defaultValue="3" max="5" />
                  <span className="text-xs font-mono w-16 text-right">RATING C</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="border border-white/10 bg-[#0a0a0a] p-6">
             <h3 className="text-xs uppercase tracking-widest font-bold mb-6">Objectives</h3>
             <div className="space-y-3">
               {[
                 { label: "Minimize Fuel Consumption", active: true },
                 { label: "Minimize Emissions (CO2e)", active: true },
                 { label: "Minimize Total Cost", active: false }
               ].map((obj, i) => (
                 <div key={i} className={`border ${obj.active ? 'border-accent-green/50 bg-accent-green/10 text-accent-green' : 'border-white/10 bg-black text-white/40'} p-3 text-xs uppercase tracking-widest cursor-pointer hover:border-white/30 transition-colors`}>
                   {obj.label}
                 </div>
               ))}
             </div>
          </div>
          
          <button className="w-full bg-accent-orange text-black font-bold uppercase tracking-widest text-sm py-4 hover:bg-accent-orange/90 transition-colors">
            Save Scenario
          </button>
        </div>
      </div>
    </div>
  );
}
