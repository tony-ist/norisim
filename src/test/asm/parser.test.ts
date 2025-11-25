import { describe, expect, it } from "vitest";
import { parseToAST } from "../../backend/asm/parser";
import { JFormat } from "../../backend/types/asm.types";

describe('toAST', () => {
  it('should parse a simple program', () => {
    const code = `
        nop
        add r0, r1, r2
        sub r3, r4, r5
    `;
    const ast = parseToAST(code);
    expect(ast.length).toBe(3);
  });

  it('should parse labels', () => {
    const code = `
        .label
            nop
    `;
    const ast = parseToAST(code);
    expect(ast.length).toBe(1);
    expect(ast[0].label).toBe('.label');
    expect(ast[0].mnemonic).toBe('NOP');
  });

  it('should parse branches', () => {
    const code = `
        .label
            nop
        jmp .label
    `;
    const ast = parseToAST(code);
    expect(ast.length).toBe(2);
    expect((ast[1] as JFormat).targetLabel).toBe('.label');
    expect(ast[1].mnemonic).toBe('JMP');
  });
});
