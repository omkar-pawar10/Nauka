import { FileText, Download, FileJson, FileSpreadsheet } from "lucide-react";

export function Reports() {
  return (
    <div className="p-8 h-full flex flex-col gap-6 overflow-y-auto">
      <header>
        <h2 className="text-xl font-bold tracking-widest uppercase flex items-center gap-2">
          <FileText className="w-5 h-5 text-accent-orange" />
          Reports & Export
        </h2>
        <p className="text-sm text-white/40 mt-1">Generate fleet allocation and emission profiles.</p>
      </header>

      <div className="grid grid-cols-2 gap-6">
        {[
          {
            title: "Fleet Allocation Master",
            desc: "Complete QPSO-optimized route assignments, speed instructions, and bunker planning.",
            formats: ["CSV", "JSON", "PDF"],
            date: "Generated: Just now"
          },
          {
            title: "Emission Profiles (CII/EEXI)",
            desc: "Predicted vs Baseline carbon intensity trajectories and compliance reporting.",
            formats: ["PDF", "XLSX"],
            date: "Generated: 2h ago"
          },
          {
            title: "Executive Summary",
            desc: "High-level KPIs, total estimated savings, and scenario constraints applied.",
            formats: ["PDF"],
            date: "Generated: 5m ago"
          }
        ].map((report, i) => (
          <div key={i} className="border border-white/10 bg-[#0a0a0a] p-6 flex flex-col group hover:border-white/20 transition-colors">
            <h3 className="text-sm uppercase tracking-widest font-bold mb-2 text-white/90 group-hover:text-white transition-colors">{report.title}</h3>
            <p className="text-xs text-white/50 mb-6 flex-1">{report.desc}</p>
            
            <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-auto">
              <span className="text-[10px] uppercase tracking-widest text-white/30">{report.date}</span>
              <div className="flex gap-2">
                {report.formats.map(format => (
                  <button key={format} className="flex items-center gap-1 border border-white/10 bg-black px-2 py-1 text-[10px] uppercase tracking-widest text-white/60 hover:text-white hover:border-white/30 hover:bg-white/5 transition-all">
                    {format === 'JSON' ? <FileJson className="w-3 h-3" /> : format === 'CSV' || format === 'XLSX' ? <FileSpreadsheet className="w-3 h-3" /> : <Download className="w-3 h-3" />}
                    {format}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
