import { create } from 'zustand';
import { persist, StateStorage, createJSONStorage } from 'zustand/middleware';
import { get, set, del } from 'idb-keyval';

// Custom IndexedDB storage for Zustand to act as our local database
const idbStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return (await get(name)) || null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await set(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await del(name);
  },
};

export interface ScenarioConfig {
  cargoVolumeTarget: number; // 0 - 100
  scheduleSlackHours: number;
  ciiThresholdRating: number; // 1-5 (A-E)
  minimizeFuel: boolean;
  minimizeEmissions: boolean;
  minimizeCost: boolean;
}

export type EngineState = "READY" | "QUEUED" | "RUNNING" | "COMPLETED";

export interface SystemStore {
  scenario: ScenarioConfig;
  setScenario: (scenario: Partial<ScenarioConfig>) => void;
  
  engineState: EngineState;
  setEngineState: (state: EngineState) => void;
  
  logs: string[];
  addLog: (log: string) => void;
  clearLogs: () => void;
  
  progress: number;
  setProgress: (progress: number) => void;
  
  lastSolverRunTimeMs: number | null;
  setLastSolverRunTimeMs: (ms: number | null) => void;
}

export const useSystemStore = create<SystemStore>()(
  persist(
    (set) => ({
      scenario: {
        cargoVolumeTarget: 80,
        scheduleSlackHours: 48,
        ciiThresholdRating: 3, // 1 = A, 2 = B, 3 = C, 4 = D, 5 = E
        minimizeFuel: true,
        minimizeEmissions: true,
        minimizeCost: false,
      },
      setScenario: (scenarioUpdate) => 
        set((state) => ({ scenario: { ...state.scenario, ...scenarioUpdate } })),
      
      engineState: "READY",
      setEngineState: (engineState) => set({ engineState }),
      
      logs: ["> SYSTEM READY. AWAITING BATCH JOB TRIGGER."],
      addLog: (log) => set((state) => ({ logs: [...state.logs, log] })),
      clearLogs: () => set({ logs: ["> SYSTEM READY. AWAITING BATCH JOB TRIGGER."] }),
      
      progress: 0,
      setProgress: (progress) => set({ progress }),
      
      lastSolverRunTimeMs: null,
      setLastSolverRunTimeMs: (ms) => set({ lastSolverRunTimeMs: ms }),
    }),
    {
      name: 'nauka-storage', // name of item in the storage (must be unique)
      storage: createJSONStorage(() => idbStorage),
      partialize: (state) => ({ scenario: state.scenario }), // Only persist the scenario config
    }
  )
);
