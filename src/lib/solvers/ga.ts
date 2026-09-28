import { OptimizationProblem, SolverConfig, SolverResult } from './types';
import { uniform, pick } from '../rng';

interface Chromosome {
  position: number[];
  fitness: number;
}

export function runGA(problem: OptimizationProblem, config: SolverConfig): SolverResult {
  const start = performance.now();
  const crossoverRate = 0.8;
  const mutationRate = 0.1;
  const tournamentSize = 3;

  let gBestPosition: number[] = [];
  let gBestFitness = Infinity;

  // Initialize population
  let population: Chromosome[] = Array.from({ length: config.populationSize }, () => {
    const position = problem.bounds.map(b => b.min + uniform() * (b.max - b.min));
    const fitness = problem.fitnessFunction(position);
    
    if (fitness < gBestFitness) {
      gBestFitness = fitness;
      gBestPosition = [...position];
    }
    
    return { position, fitness };
  });

  const convergenceHistory: number[] = [gBestFitness];

  function tournamentSelection(): Chromosome {
    let best = pick(population);
    for (let i = 1; i < tournamentSize; i++) {
      const competitor = pick(population);
      if (competitor.fitness < best.fitness) {
        best = competitor;
      }
    }
    return best;
  }

  // Evolution loop
  for (let iter = 1; iter <= config.maxIterations; iter++) {
    const nextGeneration: Chromosome[] = [];

    while (nextGeneration.length < config.populationSize) {
      const parent1 = tournamentSelection();
      const parent2 = tournamentSelection();
      
      const childPos1 = [...parent1.position];
      const childPos2 = [...parent2.position];

      // Crossover (SBX or simple uniform)
      if (uniform() < crossoverRate) {
        for (let d = 0; d < problem.dimensions; d++) {
          if (uniform() < 0.5) {
            const temp = childPos1[d];
            childPos1[d] = childPos2[d];
            childPos2[d] = temp;
          }
        }
      }

      // Mutation
      const mutate = (pos: number[]) => {
        for (let d = 0; d < problem.dimensions; d++) {
          if (uniform() < mutationRate) {
            const b = problem.bounds[d];
            // Gaussian mutation simplified
            const mutation = (uniform() * 2 - 1) * (b.max - b.min) * 0.1;
            pos[d] += mutation;
            if (pos[d] < b.min) pos[d] = b.min;
            if (pos[d] > b.max) pos[d] = b.max;
          }
        }
      };
      
      mutate(childPos1);
      mutate(childPos2);

      const fitness1 = problem.fitnessFunction(childPos1);
      const fitness2 = problem.fitnessFunction(childPos2);

      if (fitness1 < gBestFitness) {
        gBestFitness = fitness1;
        gBestPosition = [...childPos1];
      }
      if (fitness2 < gBestFitness) {
        gBestFitness = fitness2;
        gBestPosition = [...childPos2];
      }

      nextGeneration.push({ position: childPos1, fitness: fitness1 });
      if (nextGeneration.length < config.populationSize) {
        nextGeneration.push({ position: childPos2, fitness: fitness2 });
      }
    }

    // Elitism: keep best from previous generation
    nextGeneration[0] = { position: [...gBestPosition], fitness: gBestFitness };
    
    population = nextGeneration;
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
