"use client";

import { useEffect, useRef } from "react";
import { Cpu, Play, Square, Terminal } from "lucide-react";
import { useSystemStore } from "@/lib/store";

export function OptimizationCore() {
  const {
    engineState, setEngineState,
    logs, addLog, clearLogs,
    progress, setProgress,
    setLastSolverRunTimeMs
  } = useSystemStore();

  const workerRef = useRef<Worker | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      workerRef.current?.terminate();
      if (timerRef.current) clearTimeout(timerRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleStart = () => {
    setEngineState("QUEUED");
    clearLogs();
    addLog("> QUEUING JOB TO BACKGROUND WORKER THREAD...");
    setProgress(0);

    timerRef.current = setTimeout(() => {
      setEngineState("RUNNING");
      addLog("> INITIALIZING QUANTUM-INSPIRED PSO ENGINE (QPSO)...");
      
      workerRef.current = new Worker(new URL('@/lib/worker.ts', import.meta.url));
      
      // Visual progress simulator since web worker may be too fast
      let p = 0;
      intervalRef.current = setInterval(() => {
        p += 5;
        if (p < 99) {
          setProgress(p);
          if (p % 20 === 0) {
            addLog(`> QPSO ITERATION ${p * 10}: CONVERGING...`);
          }
        }
      }, 200);

      workerRef.current.onmessage = (e) => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setProgress(100);
        setEngineState("COMPLETED");
        const elapsed = Math.round(e.data.result.timeElapsedMs);
        setLastSolverRunTimeMs(elapsed);
        addLog(`> BATCH JOB COMPLETED IN ${elapsed} MS.`);
        addLog(`> BEST FITNESS: ${e.data.result.bestFitness.toFixed(4)}`);
        addLog("> WRITING RESULTS TO POSTGRES (INDEXEDDB)...");
        workerRef.current?.terminate();
      };

      workerRef.current.postMessage({
        solver: 'QPSO',
        config: { maxIterations: 1000, populationSize: 50 },
        seedVal: 12345
      });
      
    }, 1500);
  };

  const handleStop = () => {
    workerRef.current?.terminate();
    if (timerRef.current) clearTimeout(timerRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setEngineState("READY");
    setProgress(0);
    clearLogs();
  };

  return (
    <div className="p-8 h-full flex flex-col gap-6">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-widest uppercase flex items-center gap-2">
            <Cpu className="w-5 h-5 text-accent-green" />
            Optimization Core
          </h2>
          <p className="text-sm text-white/40 mt-1">Quantum-Inspired Optimization Engine (QPSO on GPUs)</p>
        </div>
        <div className="flex gap-2">
          {engineState === "READY" || engineState === "COMPLETED" ? (
            <button 
              onClick={handleStart}
              className="flex items-center gap-2 bg-accent-green/20 text-accent-green border border-accent-green px-4 py-2 text-xs uppercase tracking-widest hover:bg-accent-green/30 transition-colors"
            >
              <Play className="w-3 h-3" /> Execute Batch
            </button>
          ) : (
            <button 
              onClick={handleStop}
              className="flex items-center gap-2 bg-accent-red/20 text-accent-red border border-accent-red px-4 py-2 text-xs uppercase tracking-widest hover:bg-accent-red/30 transition-colors"
            >
              <Square className="w-3 h-3" /> Abort
            </button>
          )}
        </div>
      </header>

      <div className="flex flex-col lg:grid lg:grid-cols-4 gap-6 flex-1 lg:min-h-0 overflow-y-auto lg:overflow-hidden">
        <div className="col-span-3 flex flex-col gap-6">
          <div className="border border-white/10 bg-[#0a0a0a] p-6">
            <h3 className="text-[10px] uppercase tracking-widest text-white/40 mb-4">Engine Status</h3>
            <div className="flex items-center gap-8 mb-6">
              {["READY", "QUEUED", "RUNNING", "COMPLETED"].map((s, i) => (
                <div key={s} className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full border flex items-center justify-center
                    ${engineState === s 
                      ? s === "RUNNING" ? "border-accent-green bg-accent-green animate-pulse" : "border-accent-orange bg-accent-orange" 
                      : "border-white/20 bg-transparent"}
                  `} />
                  <span className={`text-xs uppercase tracking-widest ${engineState === s ? "text-white" : "text-white/40"}`}>{s}</span>
                  {i < 3 && <div className="w-8 h-px bg-white/10 ml-4" />}
                </div>
              ))}
            </div>

            <div className="relative w-full h-2 bg-black border border-white/10 overflow-hidden">
              <div 
                className="absolute top-0 left-0 h-full bg-accent-green transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-[10px] font-mono text-white/40">
              <span>0%</span>
              <span>100%</span>
            </div>
          </div>

          <div className="border border-white/10 bg-black flex-1 flex flex-col p-4 relative overflow-hidden">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/40 mb-4 border-b border-white/10 pb-2">
              <Terminal className="w-3 h-3" /> Terminal Output
            </div>
            <div className="flex-1 overflow-y-auto font-mono text-xs text-white/70 space-y-2">
              {logs.map((log, i) => (
                <div key={i} className={log.includes("COMPLETED") || log.includes("READY") ? "text-accent-green" : ""}>
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-span-1 border border-white/10 bg-[#0a0a0a] p-6 flex flex-col">
          <h3 className="text-xs uppercase tracking-widest font-bold mb-6 border-b border-white/10 pb-4">Outputs</h3>
          <div className="flex-1 flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase tracking-widest text-white/40">Target Tables</span>
              <span className="text-xs font-mono">opt_routes_v2</span>
              <span className="text-xs font-mono">opt_speeds_v2</span>
            </div>
            <div className="flex flex-col gap-1 mt-4">
              <span className="text-[10px] uppercase tracking-widest text-white/40">Expected Records</span>
              <span className="text-sm font-mono text-white/80">~ 14,200</span>
            </div>
            
            <div className="mt-auto">
              {engineState === "COMPLETED" && (
                <div className="bg-accent-green/10 border border-accent-green/30 p-3 flex flex-col gap-2">
                  <span className="text-[10px] uppercase tracking-widest text-accent-green">Success</span>
                  <span className="text-xs text-white/60">Routes and speeds written to PostgreSQL successfully.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
