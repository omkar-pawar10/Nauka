import { MOCK_FLEET, PORTS } from './data';

// ARCH-09: Fake API Adapter Layer
// Simulates a REST/GraphQL backend with network latency

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function fetchActiveFleet() {
  await delay(600); // Simulate network latency
  return MOCK_FLEET;
}

export async function fetchPortNetwork() {
  await delay(400);
  return PORTS;
}

export async function triggerOptimizationJob(_scenarioConfig: unknown) {
  await delay(1200);
  // Returns a fake Job ID
  return {
    jobId: `job-${Date.now()}`,
    status: 'QUEUED'
  };
}

export async function checkJobStatus(jobId: string) {
  await delay(300);
  return {
    jobId,
    status: 'COMPLETED' // simplified for demo
  };
}
