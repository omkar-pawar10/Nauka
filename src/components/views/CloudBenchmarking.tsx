"use client";

import { useState, useEffect, useRef } from "react";
import { BarChart3, Loader2, Play } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

import { SolverResult } from "@/lib/solvers/types";

interface BenchmarkDataPoint {
  iteration: number;
  qpso?: number;
  pso?: number;
  ga?: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    color: string;
    name: string;
    value: number;
  }>;
  label?: string | number;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black border border-white/20 p-3 flex flex-col gap-2 shadow-xl shadow-black/50">
        <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Iteration {label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center justify-between gap-4">
            <span className="text-xs uppercase tracking-widest" style={{ color: entry.color }}>
              {entry.name}
            </span>
            <span className="text-xs font-mono font-bold text-white">
              {entry.value.toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function CloudBenchmarking() {
  const [data, setData] = useState<BenchmarkDataPoint[]>([]);
  const [running, setRunning] = useState(false);
  
  const workerQPSO = useRef<Worker | null>(null);
  const workerPSO = useRef<Worker | null>(null);
  const workerGA = useRef<Worker | null>(null);

  useEffect(() => {
    return () => {
      workerQPSO.current?.terminate();
      workerPSO.current?.terminate();
      workerGA.current?.terminate();
    };
  }, []);

  const handleRunBenchmark = () => {
    setRunning(true);
    setData([]);

    workerQPSO.current = new Worker(new URL('@/lib/worker.ts', import.meta.url));
    workerPSO.current = new Worker(new URL('@/lib/worker.ts', import.meta.url));
    workerGA.current = new Worker(new URL('@/lib/worker.ts', import.meta.url));

    const results: { qpso: SolverResult | null; pso: SolverResult | null; ga: SolverResult | null } = { qpso: null, pso: null, ga: null };
    
    const checkComplete = () => {
      if (results.qpso && results.pso && results.ga) {
        // Merge convergence histories
        // Standardize lengths assuming maxIterations is 500
        const merged: BenchmarkDataPoint[] = [];
        for (let i = 0; i < 500; i++) {
          if (i % 5 === 0) { // Sample every 5 iterations to avoid crowding graph
            merged.push({
              iteration: i,
              qpso: results.qpso.convergenceHistory[i],
              pso: results.pso.convergenceHistory[i],
              ga: results.ga.convergenceHistory[i]
            });
          }
        }
        setData(merged);
        setRunning(false);
      }
    };

    workerQPSO.current.onmessage = (e) => { results.qpso = e.data.result; checkComplete(); };
    workerPSO.current.onmessage = (e) => { results.pso = e.data.result; checkComplete(); };
    workerGA.current.onmessage = (e) => { results.ga = e.data.result; checkComplete(); };

    const config = { maxIterations: 500, populationSize: 20 };
    workerQPSO.current.postMessage({ solver: 'QPSO', config, seedVal: 42 });
    workerPSO.current.postMessage({ solver: 'PSO', config, seedVal: 42 });
    workerGA.current.postMessage({ solver: 'GA', config, seedVal: 42 });
  };

  return (
    <div className="p-8 h-full flex flex-col gap-6">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-widest uppercase flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-accent-orange" />
            Cloud Benchmarking
          </h2>
          <p className="text-sm text-white/40 mt-1">Batch Benchmark Orchestrator - Convergence Comparison</p>
        </div>
        <button 
          onClick={handleRunBenchmark}
          disabled={running}
          className="flex items-center gap-2 bg-white/5 border border-white/20 px-4 py-2 text-xs uppercase tracking-widest hover:bg-white/10 transition-colors disabled:opacity-50"
        >
          {running ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
          {running ? "Benchmarking..." : "Run Benchmark"}
        </button>
      </header>

      <div className="grid grid-cols-4 gap-6 flex-1 min-h-0">
        <div className="col-span-3 border border-white/10 bg-[#0a0a0a] flex flex-col relative">
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <h3 className="text-xs uppercase tracking-widest font-bold">Solver Convergence Profile</h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-accent-green block"></span> QPSO
              </div>
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/60">
                <span className="w-2 h-2 rounded-full bg-white/40 block"></span> Standard PSO
              </div>
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/40">
                <span className="w-2 h-2 rounded-full bg-white/20 block"></span> Genetic Algorithm
              </div>
            </div>
          </div>
          <div className="flex-1 p-6 min-h-0 relative">
            {data.length === 0 && !running && (
              <div className="absolute inset-0 flex items-center justify-center text-white/40 uppercase tracking-widest text-xs">
                Awaiting Benchmark Run
              </div>
            )}
            {running && data.length === 0 && (
              <div className="absolute inset-0 flex flex-col gap-4 items-center justify-center text-accent-green uppercase tracking-widest text-xs">
                <Loader2 className="w-8 h-8 animate-spin" />
                Executing Solvers in Background Threads...
              </div>
            )}
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <XAxis 
                  dataKey="iteration" 
                  stroke="rgba(255,255,255,0.1)" 
                  tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontFamily: 'monospace' }}
                  tickLine={false}
                  axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
                  dy={10}
                />
                <YAxis 
                  stroke="rgba(255,255,255,0.1)" 
                  tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontFamily: 'monospace' }}
                  tickLine={false}
                  axisLine={false}
                  dx={-10}
                  domain={['auto', 'auto']}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1, strokeDasharray: '4 4' }} />
                <Line type="monotone" name="QPSO" dataKey="qpso" stroke="var(--accent-green)" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: 'var(--accent-green)' }} />
                <Line type="monotone" name="Standard PSO" dataKey="pso" stroke="rgba(255,255,255,0.4)" strokeWidth={2} strokeDasharray="4 4" dot={false} />
                <Line type="monotone" name="Genetic Alg." dataKey="ga" stroke="rgba(255,255,255,0.2)" strokeWidth={1} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="col-span-1 flex flex-col gap-6">
          <div className="border border-white/10 bg-[#0a0a0a] p-5">
            <h3 className="text-[10px] uppercase tracking-widest text-white/40 mb-4">Orchestrator Status</h3>
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
              <span className="text-xs uppercase text-white/80">Schedule</span>
              <span className="text-xs font-mono text-accent-green">NIGHTLY BATCH</span>
            </div>
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
              <span className="text-xs uppercase text-white/80">Instances</span>
              <span className="text-xs font-mono">1,420 (SIM)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase text-white/80">Avg. QPSO Speedup</span>
              <span className="text-xs font-mono text-accent-orange">2.4x</span>
            </div>
          </div>
          
          <div className="border border-white/10 bg-[#0a0a0a] p-5 flex-1">
            <h3 className="text-[10px] uppercase tracking-widest text-white/40 mb-4">Target Database</h3>
            <div className="flex items-center justify-center h-24 border border-dashed border-white/10">
               <div className="text-center">
                 <div className="text-xs uppercase tracking-widest text-white/60">PostgreSQL Central</div>
                 <div className="text-[10px] text-white/30 mt-1">Replacing Polyglot Options</div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
