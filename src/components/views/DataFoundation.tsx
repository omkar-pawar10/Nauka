import { Database, CheckCircle2, AlertCircle } from "lucide-react";

export function DataFoundation() {
  return (
    <div className="p-8 h-full flex flex-col gap-6 overflow-y-auto">
      <header>
        <h2 className="text-xl font-bold tracking-widest uppercase flex items-center gap-2">
          <Database className="w-5 h-5 text-accent-orange" />
          Data Foundation & Fuel Model
        </h2>
        <p className="text-sm text-white/40 mt-1">Batch Importer / Scrubber and ML Fuel Consumption Prediction</p>
      </header>

      <div className="grid grid-cols-2 gap-6">
        <div className="border border-white/10 bg-[#0a0a0a] flex flex-col">
          <div className="p-4 border-b border-white/10 bg-white/5">
            <h3 className="text-xs uppercase tracking-widest font-bold">Static AIS Extracts Scrubber</h3>
          </div>
          <div className="p-4 flex-1">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-[10px] uppercase tracking-widest text-white/40 border-b border-white/10">
                  <th className="pb-2 font-normal">Vessel Name</th>
                  <th className="pb-2 font-normal">IMO</th>
                  <th className="pb-2 font-normal">Data Quality</th>
                  <th className="pb-2 font-normal text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[
                  { name: "MV Ocean Pioneer", imo: "9345678", quality: "98.5%", status: "CLEARED" },
                  { name: "Global Sentinel", imo: "9876543", quality: "99.1%", status: "CLEARED" },
                  { name: "Pacific Voyager", imo: "9123456", quality: "76.2%", status: "AUGMENTED" },
                  { name: "Arctic Trader", imo: "9456789", quality: "95.4%", status: "CLEARED" },
                ].map((row, i) => (
                  <tr key={i}>
                    <td className="py-3 font-medium text-white/80">{row.name}</td>
                    <td className="py-3 text-white/50">{row.imo}</td>
                    <td className="py-3 font-mono text-xs">{row.quality}</td>
                    <td className="py-3 text-right">
                      {row.status === "CLEARED" ? (
                        <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest text-accent-green">
                          <CheckCircle2 className="w-3 h-3" /> {row.status}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest text-accent-orange">
                          <AlertCircle className="w-3 h-3" /> {row.status}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="border border-white/10 bg-[#0a0a0a] flex flex-col">
          <div className="p-4 border-b border-white/10 bg-white/5">
            <h3 className="text-xs uppercase tracking-widest font-bold">ML Fuel Prediction Model</h3>
          </div>
          <div className="p-4 flex-1 space-y-6">
            <div>
              <h4 className="text-[10px] uppercase tracking-widest text-white/40 mb-3">Model Inputs</h4>
              <div className="flex flex-wrap gap-2">
                {["Speed Profile", "Draft/Load", "Weather Routing", "Vessel Type (TEU)"].map(input => (
                  <div key={input} className="px-3 py-1 border border-white/20 text-xs bg-white/5 text-white/80">
                    {input}
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-[10px] uppercase tracking-widest text-white/40 mb-3">Generated Fuel Curves</h4>
              <div className="h-32 border border-white/10 bg-black flex items-end p-4 gap-2 relative overflow-hidden">
                {/* Mock abstract chart */}
                <svg className="w-full h-full absolute inset-0" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path d="M0,80 Q25,75 50,40 T100,10" fill="none" stroke="var(--accent-orange)" strokeWidth="2" strokeOpacity="0.8"/>
                  <path d="M0,90 Q30,80 60,50 T100,20" fill="none" stroke="white" strokeWidth="1" strokeOpacity="0.2"/>
                  <path d="M0,70 Q20,65 40,30 T100,5" fill="none" stroke="white" strokeWidth="1" strokeOpacity="0.2"/>
                </svg>
                <div className="absolute bottom-2 right-4 text-[10px] tracking-widest text-accent-orange bg-black/80 px-2 py-1">NON-LINEAR FUEL RESPONSE</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
