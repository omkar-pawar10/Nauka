import { OptimizationProblem, SolverConfig, SolverResult } from './types';
import { uniform } from '../rng';

interface Particle {
  position: number[];
  velocity: number[];
  pBestPosition: number[];
  pBestFitness: number;
}

export function runPSO(problem: OptimizationProblem, config: SolverConfig): SolverResult {
  const start = performance.now();
  const w = 0.729;
  const c1 = 1.49445;
  const c2 = 1.49445;

  let gBestPosition: number[] = [];
  let gBestFitness = Infinity;

  // Initialize particles
  const particles: Particle[] = Array.from({ length: config.populationSize }, () => {
    const position = problem.bounds.map(b => b.min + uniform() * (b.max - b.min));
    const velocity = problem.bounds.map(b => (uniform() * 2 - 1) * (b.max - b.min) * 0.1);
    const fitness = problem.fitnessFunction(position);

    if (fitness < gBestFitness) {
      gBestFitness = fitness;
      gBestPosition = [...position];
    }

    return {
      position: [...position],
      velocity,
      pBestPosition: [...position],
      pBestFitness: fitness
    };
  });

  const convergenceHistory: number[] = [gBestFitness];

  // Evolution loop
  for (let iter = 1; iter <= config.maxIterations; iter++) {
    for (const p of particles) {
      // Update velocity and position
      for (let d = 0; d < problem.dimensions; d++) {
        const r1 = uniform();
        const r2 = uniform();
        
        p.velocity[d] = w * p.velocity[d] 
                      + c1 * r1 * (p.pBestPosition[d] - p.position[d])
                      + c2 * r2 * (gBestPosition[d] - p.position[d]);
        
        p.position[d] += p.velocity[d];

        // Clamp to bounds
        const bound = problem.bounds[d];
        if (p.position[d] < bound.min) {
          p.position[d] = bound.min;
          p.velocity[d] *= -0.5; // bounce
        } else if (p.position[d] > bound.max) {
          p.position[d] = bound.max;
          p.velocity[d] *= -0.5;
        }
      }

      const fitness = problem.fitnessFunction(p.position);

      // Update personal best
      if (fitness < p.pBestFitness) {
        p.pBestFitness = fitness;
        p.pBestPosition = [...p.position];

        // Update global best
        if (fitness < gBestFitness) {
          gBestFitness = fitness;
          gBestPosition = [...p.position];
        }
      }
    }
    convergenceHistory.push(gBestFitness);
  }

  return {
    bestPosition: gBestPosition,
    bestFitness: gBestFitness,
    convergenceHistory,
    iterationsCompleted: config.maxIterations,
    timeElapsedMs: performance.now() - start
  };
}
