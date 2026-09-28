import { VesselSpecs } from './physics';

export const PORTS = [
  { id: 'SGSIN', name: 'Singapore', lat: 1.290270, lon: 103.851959 },
  { id: 'NLRTM', name: 'Rotterdam', lat: 51.922501, lon: 4.479170 },
  { id: 'CNSHG', name: 'Shanghai', lat: 31.230416, lon: 121.473701 },
  { id: 'AEMXB', name: 'Jebel Ali', lat: 24.985714, lon: 55.027222 },
  { id: 'USLAX', name: 'Los Angeles', lat: 34.052235, lon: -118.243683 },
  { id: 'BRSSZ', name: 'Santos', lat: -23.9618, lon: -46.3322 },
];

export const MOCK_FLEET: (VesselSpecs & { id: string; name: string })[] = [
  { id: 'VSL-8921', name: 'MV Ocean Pioneer', class: 'Capesize', designSpeedKnots: 14.5, baselineFuelPerDayMt: 45, capacityDwt: 170000, fuelType: 'VLSFO' },
  { id: 'VSL-7432', name: 'Global Sentinel', class: 'Panamax', designSpeedKnots: 15.0, baselineFuelPerDayMt: 32, capacityDwt: 75000, fuelType: 'VLSFO' },
  { id: 'VSL-1092', name: 'Pacific Voyager', class: 'Suezmax', designSpeedKnots: 14.0, baselineFuelPerDayMt: 40, capacityDwt: 150000, fuelType: 'VLSFO' },
  { id: 'VSL-5541', name: 'Arctic Trader', class: 'Aframax', designSpeedKnots: 14.5, baselineFuelPerDayMt: 35, capacityDwt: 110000, fuelType: 'MGO' },
  { id: 'VSL-3329', name: 'Nordic Star', class: 'VLCC', designSpeedKnots: 13.5, baselineFuelPerDayMt: 65, capacityDwt: 300000, fuelType: 'LNG' },
];
