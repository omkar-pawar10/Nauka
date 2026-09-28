"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { fetchActiveFleet } from "@/lib/api";
import { VesselSpecs } from "@/lib/physics";
import { Loader2, Map as MapIcon } from "lucide-react";

const MapComponent = dynamic(() => import("./MapComponent"), { ssr: false });

export function FleetVisualization() {
  const [selectedVessel, setSelectedVessel] = useState<string | null>(null);
  const [fleet, setFleet] = useState<(VesselSpecs & { id: string; name: string })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActiveFleet().then(data => {
      setFleet(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="h-full flex flex-col">
      <header className="p-6 border-b border-white/10 shrink-0 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-widest uppercase flex items-center gap-2">
            <MapIcon className="w-5 h-5 text-accent-orange" />
            Fleet Visualization
          </h2>
          <p className="text-sm text-white/40 mt-1">Live allocation and abstract routing network</p>
        </div>
      </header>

      <div className="flex-1 flex min-h-0">
        {/* Left Pane: Active Vessels */}
        <div className="w-80 border-r border-white/10 bg-[#0a0a0a] flex flex-col">
          <div className="p-4 border-b border-white/10">
            <h3 className="text-xs uppercase tracking-widest font-bold">Active Fleet</h3>
          </div>
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-8 flex justify-center text-white/40">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            ) : (
              fleet.map(vessel => {
                const status = vessel.class === 'Suezmax' ? 'DELAYED' : vessel.class === 'VLCC' ? 'PRIORITY' : 'ACTIVE';
                const eta = vessel.class === 'Suezmax' ? '1d 12h' : '14h';
                
                return (
                  <button 
                    key={vessel.id}
                    onClick={() => setSelectedVessel(vessel.id)}
                    className={`w-full text-left p-4 border-b border-white/5 transition-colors hover:bg-white/5
                      ${selectedVessel === vessel.id ? 'bg-white/5 border-l-2 border-l-accent-orange' : 'border-l-2 border-l-transparent'}`
                    }
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-bold tracking-wide text-white/90">{vessel.name}</span>
                      <span className={`text-[10px] uppercase tracking-widest px-2 py-0.5
                        ${status === 'ACTIVE' ? 'text-accent-green bg-accent-green/10' : 
                          status === 'DELAYED' ? 'text-accent-orange bg-accent-orange/10' : 
                          'text-accent-red bg-accent-red/10'}`}
                      >
                        {status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-white/40">
                      <span>{vessel.id} &middot; {vessel.class}</span>
                      <span className="font-mono">ETA: {eta}</span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Pane: Leaflet Map */}
        <div className="flex-1 bg-[#0a0a0a] relative overflow-hidden flex items-center justify-center p-8">
          <div className="w-full max-w-4xl aspect-video relative border border-white/10 z-0">
            <MapComponent selectedVessel={selectedVessel} />
            
            <div className="absolute bottom-4 left-4 bg-black/80 border border-white/10 p-3 backdrop-blur-sm">
              <h4 className="text-[10px] uppercase tracking-widest text-white/40 mb-2">Legend</h4>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-white/80"><span className="w-4 h-0.5 bg-accent-orange block"></span> Optimized Route</div>
                <div className="flex items-center gap-2 text-xs text-white/80"><span className="w-4 h-0.5 bg-accent-green block border-t border-dashed border-black"></span> Alternative (QPSO)</div>
                <div className="flex items-center gap-2 text-xs text-white/80"><span className="w-2 h-2 rounded-full border border-white block"></span> Major Hub</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
