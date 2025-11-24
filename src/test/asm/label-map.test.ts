import { describe, expect, it } from "vitest";
import { createLabelMap } from "../../backend/asm/label-map";
import { parseToAST } from "../../backend/asm/parser";

describe('createLabelMap', () => {
  it('should create a label map', () => {
    const code = `
        .label
            nop
        .label2
            add r0, r1, r2
    `;
    const ast = parseToAST(code);
    const labelMap = createLabelMap(ast);

    expect(labelMap['.label']).toBe(0);
    expect(labelMap['.label2']).toBe(1);
  });
});