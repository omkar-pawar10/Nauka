"use client";

import { Map as MapIcon, Navigation2 } from "lucide-react";
import { useState } from "react";

const mockVessels = [
  { id: "VSL-8921", name: "MV Ocean Pioneer", status: "ACTIVE", eta: "14h", class: "Capesize" },
  { id: "VSL-7432", name: "Global Sentinel", status: "ACTIVE", eta: "2d 4h", class: "Panamax" },
  { id: "VSL-1092", name: "Pacific Voyager", status: "DELAYED", eta: "1d 12h", class: "Suezmax" },
  { id: "VSL-5541", name: "Arctic Trader", status: "ACTIVE", eta: "8h", class: "Aframax" },
  { id: "VSL-3329", name: "Nordic Star", status: "PRIORITY", eta: "5h", class: "VLCC" },
];

export function FleetVisualization() {
  const [selectedVessel, setSelectedVessel] = useState<string | null>(null);

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
            {mockVessels.map(vessel => (
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
                    ${vessel.status === 'ACTIVE' ? 'text-accent-green bg-accent-green/10' : 
                      vessel.status === 'DELAYED' ? 'text-accent-orange bg-accent-orange/10' : 
                      'text-accent-red bg-accent-red/10'}`}
                  >
                    {vessel.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-white/40">
                  <span>{vessel.id} &middot; {vessel.class}</span>
                  <span className="font-mono">ETA: {vessel.eta}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Pane: Custom SVG Map */}
        <div className="flex-1 bg-black relative overflow-hidden flex items-center justify-center p-8">
          <div className="absolute inset-0 opacity-20 pointer-events-none" 
               style={{ backgroundImage: 'radial-gradient(circle at center, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          
          <div className="w-full max-w-3xl aspect-video relative">
            <svg className="w-full h-full drop-shadow-2xl" viewBox="0 0 800 500">
              {/* Grid/Background */}
              <rect width="800" height="500" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
              
              {/* Edges (Routes) */}
              <g strokeWidth="2" fill="none">
                {/* Background inactive routes */}
                <path d="M 100,200 L 250,150 L 400,250 L 600,200 L 700,350" stroke="rgba(255,255,255,0.1)" strokeDasharray="4 4" />
                <path d="M 100,200 L 200,350 L 400,250 L 550,400 L 700,350" stroke="rgba(255,255,255,0.1)" strokeDasharray="4 4" />
                
                {/* Active routes */}
                <path d="M 250,150 L 400,250" stroke="var(--accent-orange)" strokeOpacity="0.8" />
                <path d="M 400,250 L 600,200" stroke="var(--accent-green)" strokeOpacity="0.6" strokeDasharray="6 4" />
                <path d="M 200,350 L 400,250" stroke="var(--accent-red)" strokeOpacity="0.5" />
              </g>

              {/* Nodes (Ports) */}
              <g>
                <circle cx="100" cy="200" r="6" fill="#0a0a0a" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
                <text x="100" y="185" fill="rgba(255,255,255,0.4)" fontSize="10" textAnchor="middle" letterSpacing="1" className="font-mono">PORT A</text>

                <circle cx="250" cy="150" r="8" fill="#0a0a0a" stroke="var(--accent-orange)" strokeWidth="2" />
                <text x="250" y="135" fill="var(--accent-orange)" fontSize="10" textAnchor="middle" letterSpacing="1" className="font-mono">HUB ALPHA</text>

                <circle cx="400" cy="250" r="10" fill="#0a0a0a" stroke="white" strokeWidth="2" />
                <circle cx="400" cy="250" r="4" fill="white" />
                <text x="400" y="230" fill="white" fontSize="12" textAnchor="middle" letterSpacing="2" className="font-mono font-bold">CENTRAL NODE</text>

                <circle cx="600" cy="200" r="8" fill="#0a0a0a" stroke="var(--accent-green)" strokeWidth="2" />
                <text x="600" y="185" fill="var(--accent-green)" fontSize="10" textAnchor="middle" letterSpacing="1" className="font-mono">DEST OMEGA</text>

                <circle cx="700" cy="350" r="6" fill="#0a0a0a" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
                <circle cx="200" cy="350" r="6" fill="#0a0a0a" stroke="var(--accent-red)" strokeWidth="2" />
                <circle cx="550" cy="400" r="6" fill="#0a0a0a" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
              </g>

              {/* Active Vessel Indicator */}
              <g transform="translate(325, 200)">
                <circle cx="0" cy="0" r="12" fill="var(--accent-orange)" fillOpacity="0.2" className="animate-ping" />
                <circle cx="0" cy="0" r="4" fill="var(--accent-orange)" />
                <path d="M -8,-10 L 8,-10 L 0,-18 Z" fill="var(--accent-orange)" transform="rotate(33)" />
                <rect x="12" y="-12" width="60" height="20" fill="black" stroke="rgba(255,255,255,0.2)" />
                <text x="16" y="1" fill="white" fontSize="10" className="font-mono">VSL-8921</text>
              </g>
            </svg>
            
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
