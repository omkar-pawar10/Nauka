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

export function Sidebar({ currentView, onViewChange }: SidebarProps) {
  const { engineState } = useSystemStore();

  return (
    <aside className="w-64 border-r border-white/10 bg-[#000000] flex flex-col h-full">
      <div className="p-6 border-b border-white/10">
        <h1 className="text-sm font-bold tracking-widest text-accent-orange uppercase flex items-center gap-2">
          <div className="w-4 h-4 bg-accent-orange/20 border border-accent-orange flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-accent-orange" />
          </div>
          Nauka
        </h1>
      </div>
      
      <div className="flex-1 py-4 overflow-y-auto">
        <div className="px-4 mb-2">
          <h2 className="text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase mb-4">Workspaces</h2>
        </div>
        
        <nav className="space-y-1 px-2">
          {views.map((view) => {
            const Icon = view.icon;
            const isActive = currentView === view.id;
            
            return (
              <button
                key={view.id}
                onClick={() => onViewChange(view.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 text-sm text-left transition-colors",
                  "border border-transparent",
                  isActive 
                    ? "bg-white/5 border-white/10 text-white" 
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                )}
              >
                <Icon className={cn("w-4 h-4", isActive ? "text-accent-orange" : "text-white/40")} />
                <span className="font-medium tracking-wide">{view.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-3 py-2 text-xs text-white/40 uppercase tracking-widest">
          <div className={`w-2 h-2 rounded-full border ${engineState === 'RUNNING' ? 'border-accent-green bg-accent-green animate-pulse' : 'border-white/40'}`} />
          {engineState === 'RUNNING' ? 'SYSTEM RUNNING' : 'SYSTEM IDLE'}
        </div>
      </div>
    </aside>
  );
}
