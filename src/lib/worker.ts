import { runPSO } from './solvers/pso';
import { runQPSO } from './solvers/qpso';
import { runGA } from './solvers/ga';
import { OptimizationProblem, SolverConfig, SolverResult } from './solvers/types';
import { seed } from './rng';

export type SolverType = 'PSO' | 'QPSO' | 'GA';

export interface WorkerMessage {
  solver: SolverType;
  config: SolverConfig;
  seedVal?: number;
}

export interface WorkerResponse {
  solver: SolverType;
  result: SolverResult;
}

import { calculateFuelConsumption } from './physics';
import { MOCK_FLEET } from './data';

// Simulating a complex maritime optimization problem
// Dimensions represent speed adjustments for vessels across different routes
function fleetFitnessFunction(position: number[]): number {
  let totalFuel = 0;
  
  // For each dimension, treat it as a speed multiplier (e.g. 0.8 to 1.2) for our mock fleet
  for (let i = 0; i < position.length; i++) {
    const vessel = MOCK_FLEET[i % MOCK_FLEET.length];
    
    // Position represents a speed deviation from design speed
    // e.g. position -5.12 to 5.12 mapped to 10 knots to 20 knots
    const speedKnots = 15 + (position[i] / 5.12) * 5; 
    
    // Simulate a 5000 NM voyage with random weather factor
    const weatherFactor = 1.0 + Math.abs(Math.sin(position[i])) * 0.2; 
    
    const fuel = calculateFuelConsumption(vessel, speedKnots, 5000, weatherFactor);
    totalFuel += fuel;
  }
  return totalFuel;
}

self.onmessage = (e: MessageEvent<WorkerMessage>) => {
  const { solver, config, seedVal } = e.data;
  
  if (seedVal !== undefined) {
    seed(seedVal);
  }

  // 100-dimensional problem (e.g. 100 vessels/routes to optimize)
  const problem: OptimizationProblem = {
    dimensions: 100,
    bounds: Array(100).fill({ min: -5.12, max: 5.12 }),
    fitnessFunction: fleetFitnessFunction
  };

  let result: SolverResult;
  switch (solver) {
    case 'PSO':
      result = runPSO(problem, config);
      break;
    case 'QPSO':
      result = runQPSO(problem, config);
      break;
    case 'GA':
      result = runGA(problem, config);
      break;
  }

  self.postMessage({ solver, result });
};
