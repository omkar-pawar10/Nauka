"use client";

import { BarChart3 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const mockConvergenceData = Array.from({ length: 50 }, (_, i) => {
  return {
    iteration: i * 10,
    qpso: 1000 - 800 * (1 - Math.exp(-i / 10)) + (Math.random() * 20 - 10),
    pso: 1000 - 650 * (1 - Math.exp(-i / 15)) + (Math.random() * 30 - 15),
    ga: 1000 - 500 * (1 - Math.exp(-i / 20)) + (Math.random() * 40 - 20),
  };
});

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black border border-white/20 p-3 flex flex-col gap-2 shadow-xl shadow-black/50">
        <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Iteration {label}</p>
        {payload.map((entry: any, index: number) => (
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
  return (
    <div className="p-8 h-full flex flex-col gap-6">
      <header>
        <h2 className="text-xl font-bold tracking-widest uppercase flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-accent-orange" />
          Cloud Benchmarking
        </h2>
        <p className="text-sm text-white/40 mt-1">Batch Benchmark Orchestrator - Convergence Comparison</p>
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
          <div className="flex-1 p-6 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockConvergenceData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
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
