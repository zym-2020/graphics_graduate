export function encodeFloatToDouble(value: number): Float32Array {
  const result = new Float32Array(2);
  result[0] = value;

  const delta = value - result[0];
  result[1] = delta;
  return result;
}

export const rand = (min: number, max?: number) => {
  if (!max) {
    max = min;
    min = 0;
  }
  return Math.random() * (max - min) + min;
};
