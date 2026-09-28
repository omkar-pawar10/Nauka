export function mulberry32(a: number) {
  return function() {
    let t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}

let defaultRng = mulberry32(12345);

export function seed(val: number) {
  defaultRng = mulberry32(val);
}

export function uniform() {
  return defaultRng();
}

export function normal() {
  let u = 0, v = 0;
  while(u === 0) u = uniform();
  while(v === 0) v = uniform();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

export function pick<T>(arr: T[]): T {
  return arr[Math.floor(uniform() * arr.length)];
}
