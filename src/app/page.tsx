"use client";

import { useState } from "react";
import { Sidebar, ViewId } from "@/components/Sidebar";
import { OperationsOverview } from "@/components/views/OperationsOverview";
import { DataFoundation } from "@/components/views/DataFoundation";
import { ScenarioWorkspace } from "@/components/views/ScenarioWorkspace";
import { OptimizationCore } from "@/components/views/OptimizationCore";
import { CloudBenchmarking } from "@/components/views/CloudBenchmarking";
import { FleetVisualization } from "@/components/views/FleetVisualization";
import { Reports } from "@/components/views/Reports";

export default function Home() {
  const [currentView, setCurrentView] = useState<ViewId>("operations");

  return (
    <div className="flex h-screen w-full overflow-hidden bg-black text-white">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      
      <div className="flex-1 flex flex-col min-w-0">
        {/* Persistent Status Bar */}
        <header className="h-10 border-b border-white/10 bg-[#050505] flex items-center px-6 shrink-0 justify-between">
          <div className="flex items-center gap-2 group relative">
            <span className="w-2 h-2 rounded-full bg-accent-orange animate-pulse"></span>
            <span className="text-[11px] uppercase tracking-widest text-white/60">
              Mode: Frontend-only &middot; computations run in your browser
            </span>
            <div className="absolute top-full left-0 mt-2 w-64 bg-black border border-white/20 p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 text-[10px] text-white/50">
              Database: IndexedDB<br/>
              GPU/Solvers: Web Workers<br/>
              API: In-browser adapter
            </div>
          </div>
        </header>

        <main className="flex-1 relative overflow-hidden bg-black">
          {currentView === "operations" && <OperationsOverview />}
          {currentView === "data" && <DataFoundation />}
          {currentView === "scenario" && <ScenarioWorkspace />}
          {currentView === "optimization" && <OptimizationCore />}
          {currentView === "benchmarking" && <CloudBenchmarking />}
          {currentView === "fleet" && <FleetVisualization />}
          {currentView === "reports" && <Reports />}
        </main>
      </div>
    </div>
  );
}
