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
      {/* Top right pill badge */}
      <div className="absolute top-6 right-8 z-50">
        <div className="px-3 py-1 border border-white/20 bg-black text-[10px] uppercase tracking-widest text-white/60">
          Frontend-only demonstration prototype
        </div>
      </div>

      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      
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
  );
}
