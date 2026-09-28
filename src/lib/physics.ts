// Pure frontend math simulating maritime physics and emissions

export type FuelType = 'VLSFO' | 'MGO' | 'LNG';

export interface VesselSpecs {
  class: string;
  designSpeedKnots: number;
  baselineFuelPerDayMt: number;
  capacityDwt: number;
  fuelType: FuelType;
}

// ARCH-06: Emissions Factors (Tank-to-Wake CO2 conversion factors roughly based on IMO)
const EMISSION_FACTORS: Record<FuelType, number> = {
  'VLSFO': 3.114,
  'MGO': 3.206,
  'LNG': 2.750
};

// ARCH-05: Fuel Model (Physics baseline + learned residual)
export function calculateFuelConsumption(
  vessel: VesselSpecs, 
  actualSpeedKnots: number, 
  distanceNm: number,
  weatherFactor: number = 1.0 // 1.0 = calm, >1.0 = rough seas
): number {
  const daysAtSea = distanceNm / (actualSpeedKnots * 24);
  
  // Admiralty formula approximation: Power ~ Speed^3
  // Fuel is proportional to Power
  const speedRatio = actualSpeedKnots / vessel.designSpeedKnots;
  
  // Physics baseline
  let dailyFuel = vessel.baselineFuelPerDayMt * Math.pow(speedRatio, 3);
  
  // Fake "Learned Residual" (simulating a Neural Net adjustment based on draft/fouling)
  // We'll add a small polynomial variance that punishes extreme speeds slightly more
  const learnedResidual = (Math.pow(speedRatio, 4) - Math.pow(speedRatio, 3)) * 5;
  
  dailyFuel = (dailyFuel + learnedResidual) * weatherFactor;
  
  return dailyFuel * daysAtSea;
}

export function calculateEmissions(fuelConsumedMt: number, fuelType: FuelType): number {
  return fuelConsumedMt * EMISSION_FACTORS[fuelType];
}

// ARCH-07: Carbon Intensity Indicator (CII)
// CII = Annual CO2 emissions / (Capacity * Distance)
export function calculateCiiRating(
  vessel: VesselSpecs, 
  totalEmissionsMt: number, 
  totalDistanceNm: number
): 'A' | 'B' | 'C' | 'D' | 'E' {
  // Convert MT to grams for standard IMO formula (approximate calculation for demo)
  const attainedCii = (totalEmissionsMt * 1_000_000) / (vessel.capacityDwt * totalDistanceNm);
  
  // Mock reference lines based on typical container/bulk vessels
  let referenceCii = 0;
  if (vessel.capacityDwt > 100000) referenceCii = 4.5; // Large bulk/tanker
  else if (vessel.capacityDwt > 50000) referenceCii = 7.0; // Panamax
  else referenceCii = 10.0; // Smaller vessels
  
  // Deviation bounds
  const ratio = attainedCii / referenceCii;
  
  if (ratio < 0.85) return 'A';
  if (ratio < 0.95) return 'B';
  if (ratio < 1.05) return 'C';
  if (ratio < 1.15) return 'D';
  return 'E';
}
