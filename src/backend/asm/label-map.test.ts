import { describe, expect, it } from 'vitest';
import { createLabelMap } from './label-map';
import { compileToIR } from './irgen';

describe('createLabelMap', () => {
  it('should create a label map', () => {
    const code = `
        .label
            nop
        .label2
            add r0, r1, r2
    `;
    const ir = compileToIR(code);
    const labelMap = createLabelMap(ir);

    expect(labelMap.get('.label')).toBe(0);
    expect(labelMap.get('.label2')).toBe(1);
  });
});
