import { describe, expect, it } from 'vitest';
import { parseToAST } from './parser';

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
    expect(ast[1].operands[0].type).toBe('label');
    expect(ast[1].operands[0].value).toBe('.label');
    expect(ast[1].mnemonic).toBe('JMP');
  });

  it.each([
    ['0', 0],
    ['1', 1],
    ['-1', -1],
    ['127', 127],
    ['-128', -128],
  ])('should parse immediate %s as %s', (immediate, expected) => {
    const code = `addi r1, ${immediate}`;
    const ast = parseToAST(code);
    expect(ast[0].operands[1].value).toBe(expected);
  });

  it.each([
    '128',
    '-129',
    '256',
  ])('should throw an error for immediate %s', (immediate) => {
    const code = `addi r1, ${immediate}`;
    expect(() => parseToAST(code)).toThrow(`Immediate signed value ${immediate} is out of bounds from -128 to 127 inclusive`);
  });

  it.each([
    ['8', 'R8'],
    ['9', 'R9'],
  ])('should throw an error for invalid register %s', (registerNum, registerName) => {
    const code = `add r1, r2, ${registerName.toLowerCase()}`;
    expect(() => parseToAST(code)).toThrow(`Invalid register number: ${registerName}. Valid registers are R0-R7`);
  });

  it('should accept valid registers R0-R7', () => {
    const code = `
      add r0, r1, r2
      add r3, r4, r5
      add r6, r7, r0
    `;
    expect(() => parseToAST(code)).not.toThrow();
  });
});
