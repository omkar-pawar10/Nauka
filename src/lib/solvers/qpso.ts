import { OptimizationProblem, SolverConfig, SolverResult } from './types';
import { uniform } from '../rng';

interface Particle {
  position: number[];
  pBestPosition: number[];
  pBestFitness: number;
}

export function runQPSO(problem: OptimizationProblem, config: SolverConfig): SolverResult {
  const start = performance.now();
  
  let gBestPosition: number[] = [];
  let gBestFitness = Infinity;

  // Initialize particles
  const particles: Particle[] = Array.from({ length: config.populationSize }, () => {
    const position = problem.bounds.map(b => b.min + uniform() * (b.max - b.min));
    const fitness = problem.fitnessFunction(position);

    if (fitness < gBestFitness) {
      gBestFitness = fitness;
      gBestPosition = [...position];
    }

    return {
      position: [...position],
      pBestPosition: [...position],
      pBestFitness: fitness
    };
  });

  const convergenceHistory: number[] = [gBestFitness];

  // Evolution loop
  for (let iter = 1; iter <= config.maxIterations; iter++) {
    // Contraction-expansion coefficient alpha
    // Typically decreases linearly from 1.0 to 0.5
    const alpha = 1.0 - 0.5 * (iter / config.maxIterations);

    // Calculate Mean Best Position (mBest)
    const mBest = new Array(problem.dimensions).fill(0);
    for (const p of particles) {
      for (let d = 0; d < problem.dimensions; d++) {
        mBest[d] += p.pBestPosition[d];
      }
    }
    for (let d = 0; d < problem.dimensions; d++) {
      mBest[d] /= config.populationSize;
    }

    for (const p of particles) {
      for (let d = 0; d < problem.dimensions; d++) {
        const phi = uniform();
        // Local attractor (stochastic average of personal best and global best)
        const attractor = phi * p.pBestPosition[d] + (1 - phi) * gBestPosition[d];
        
        const u = uniform();
        const L = alpha * Math.abs(mBest[d] - p.position[d]);
        
        if (uniform() > 0.5) {
          p.position[d] = attractor + L * Math.log(1 / u);
        } else {
          p.position[d] = attractor - L * Math.log(1 / u);
        }

        // Clamp to bounds
        const bound = problem.bounds[d];
        if (p.position[d] < bound.min) {
          p.position[d] = bound.min;
        } else if (p.position[d] > bound.max) {
          p.position[d] = bound.max;
        }
      }

      const fitness = problem.fitnessFunction(p.position);

      if (fitness < p.pBestFitness) {
        p.pBestFitness = fitness;
        p.pBestPosition = [...p.position];

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
