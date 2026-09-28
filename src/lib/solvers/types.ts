export interface OptimizationProblem {
  dimensions: number;
  bounds: { min: number; max: number }[];
  fitnessFunction: (position: number[]) => number;
}

export interface SolverResult {
  bestPosition: number[];
  bestFitness: number;
  convergenceHistory: number[];
  iterationsCompleted: number;
  timeElapsedMs: number;
}

export interface SolverConfig {
  maxIterations: number;
  populationSize: number;
}
