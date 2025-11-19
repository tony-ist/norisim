import { toHex } from './asm-util.ts';

export const VALUES_IN_A_ROW = 16;

export function generateLabels(dataSize: number) {
  const result = [];

  for (let i = 0; i < dataSize / VALUES_IN_A_ROW; i++) {
    result.push(VALUES_IN_A_ROW * i);
  }

  return toHex(result);
}
