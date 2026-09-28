"use client";

import { Activity } from "lucide-react";
import { useSystemStore } from "@/lib/store";

export function OperationsOverview() {
  const { lastSolverRunTimeMs } = useSystemStore();

  return (
    <div className="p-8 h-full flex flex-col gap-6">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-widest uppercase">Operations Overview</h2>
          <p className="text-sm text-white/40 mt-1">KPIs and aggregate fleet performance metrics.</p>
        </div>
      </header>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Active Vessels", value: "142", unit: "UNITS", color: "text-white" },
          { label: "Est. Fuel Saved Today", value: "34.2", unit: "MT", color: "text-accent-green" },
          { label: "Est. Emissions Avoided", value: "108.5", unit: "MT CO2", color: "text-accent-green" },
          { label: "Last Solver Runtime", value: lastSolverRunTimeMs !== null ? lastSolverRunTimeMs.toString() : "--", unit: "MS", color: "text-white" },
        ].map((kpi, i) => (
          <div key={i} className="border border-white/10 bg-[#0a0a0a] p-5">
            <h3 className="text-[10px] uppercase tracking-widest text-white/40 mb-2">{kpi.label}</h3>
            <div className="flex items-baseline gap-2">
              <span className={`text-3xl font-light ${kpi.color}`}>{kpi.value}</span>
              <span className="text-xs text-white/30 tracking-widest">{kpi.unit}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex-1 border border-white/10 bg-[#0a0a0a] p-5 flex flex-col">
        <h3 className="text-xs uppercase tracking-widest text-white/40 mb-4 border-b border-white/10 pb-2">Recent Batch Runs</h3>
        <div className="flex-1 flex items-center justify-center text-white/20">
          <div className="flex flex-col items-center gap-2">
            <Activity className="w-8 h-8 opacity-20" />
            <span className="text-sm uppercase tracking-widest">No recent batch runs. Load demo or run a batch.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
