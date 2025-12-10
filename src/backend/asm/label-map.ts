import { IR } from '../types/asm.types';

export function createLabelMap(ir: IR): Map<string, number> {
  const labelMap: Map<string, number> = new Map();

  for (let i = 0; i < ir.length; i++) {
    const line = ir[i];
    if (line.label) {
      labelMap.set(line.label, i);
    }
  }

  return labelMap;
}
