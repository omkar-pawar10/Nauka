import { 
  LayoutDashboard, 
  Database, 
  Settings2, 
  Cpu, 
  BarChart3, 
  Map as MapIcon, 
  FileText 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSystemStore } from "@/lib/store";

export const views = [
  { id: "operations", label: "Operations Overview", icon: LayoutDashboard },
  { id: "data", label: "Data Foundation", icon: Database },
  { id: "scenario", label: "Scenario Workspace", icon: Settings2 },
  { id: "optimization", label: "Optimization Core", icon: Cpu },
  { id: "benchmarking", label: "Cloud Benchmarking", icon: BarChart3 },
  { id: "fleet", label: "Fleet Visualization", icon: MapIcon },
  { id: "reports", label: "Reports", icon: FileText },
] as const;

export type ViewId = typeof views[number]["id"];

interface SidebarProps {
  currentView: ViewId;
  onViewChange: (view: ViewId) => void;
}

import Image from "next/image";

export function Sidebar({ currentView, onViewChange }: SidebarProps) {
  const { engineState } = useSystemStore();

  return (
    <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-white/10 bg-[#000000] flex flex-col md:h-full shrink-0 z-10">
      <div className="p-4 md:p-6 border-b border-white/10 flex items-center justify-between">
        <button 
          onClick={() => onViewChange("operations")}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity focus:outline-none"
        >
          <div className="relative w-7 h-7">
            <Image 
              src="/logo.jpeg" 
              alt="Nauka Logo" 
              fill 
              className="object-contain" 
            />
          </div>
          <h1 className="text-sm font-bold tracking-widest text-accent-orange uppercase">
            Nauka
          </h1>
        </button>
        <div className="flex md:hidden items-center gap-3 px-3 py-1 text-xs text-white/40 uppercase tracking-widest">
          <div className={`w-2 h-2 rounded-full border ${engineState === 'RUNNING' ? 'border-accent-green bg-accent-green animate-pulse' : 'border-white/40'}`} />
        </div>
      </div>
      
      <div className="flex-1 py-2 md:py-4 overflow-x-auto md:overflow-y-auto">
        <div className="px-4 mb-2 hidden md:block">
          <h2 className="text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase mb-4">Workspaces</h2>
        </div>
        
        <nav className="flex flex-row md:flex-col space-x-2 md:space-x-0 md:space-y-1 px-2 w-max md:w-auto">
          {views.map((view) => {
            const Icon = view.icon;
            const isActive = currentView === view.id;
            
            return (
              <button
                key={view.id}
                onClick={() => onViewChange(view.id)}
                className={cn(
                  "flex items-center gap-2 md:gap-3 px-3 py-2 text-sm text-left transition-colors whitespace-nowrap",
                  "border border-transparent",
                  isActive 
                    ? "bg-white/5 border-white/10 text-white" 
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                )}
              >
                <Icon className={cn("w-4 h-4 shrink-0", isActive ? "text-accent-orange" : "text-white/40")} />
                <span className="font-medium tracking-wide text-xs md:text-sm">{view.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-white/10 hidden md:block shrink-0">
        <div className="flex items-center gap-3 px-3 py-2 text-xs text-white/40 uppercase tracking-widest">
          <div className={`w-2 h-2 rounded-full border ${engineState === 'RUNNING' ? 'border-accent-green bg-accent-green animate-pulse' : 'border-white/40'}`} />
          {engineState === 'RUNNING' ? 'SYSTEM RUNNING' : 'SYSTEM IDLE'}
        </div>
      </div>
    </aside>
  );
}
