import { describe, expect, it } from "vitest";
import { generateIR } from "./irgen";
import { AST } from "../types/asm.types";

describe('generateIR', () => {
  it('should generate IR', () => {
    const ast: AST = [
      {
        mnemonic: 'NOP',
        forceUpdateFlags: false,
        operands: [],
        inlineComment: 'nop',
      },
      {
        mnemonic: 'ADD',
        forceUpdateFlags: false,
        operands: [{ type: 'register', value: 0 }, { type: 'register', value: 1 }, { type: 'register', value: 2 }],
      },
    ];

    const ir = generateIR(ast);

    expect(ir.length).toBe(2);
    
    expect(ir[0].mnemonic).toBe('NOP');
    expect(ir[0].operands).toStrictEqual([]);
    expect(ir[0].format).toBe('Z');
    expect(ir[0].address).toBe(0);
    expect(ir[0].inlineComment).toBe('nop');

    expect(ir[1].mnemonic).toBe('ADD');
    expect(ir[1].operands).toStrictEqual([{ type: 'register', value: 0 }, { type: 'register', value: 1 }, { type: 'register', value: 2 }]);
    expect(ir[1].format).toBe('A');
    expect(ir[1].address).toBe(1);
    expect(ir[1].inlineComment).toBe(undefined);
  });

  it('should fill jump target addresses', () => {
    const ast: AST = [
      {
        mnemonic: 'JMP',
        forceUpdateFlags: false,
        operands: [{ type: 'label', value: 'label1' }],
      },
      {
        mnemonic: 'NOP',
        forceUpdateFlags: false,
        operands: [],
        label: 'label1',
      },
    ];

    const ir = generateIR(ast);

    expect(ir.length).toBe(2);
    
    expect(ir[0].mnemonic).toBe('JMP');
    expect(ir[0].operands).toStrictEqual([{ type: 'label', value: 'label1', targetAddress: 1 }]);
    expect(ir[0].format).toBe('J');
    expect(ir[0].address).toBe(0);

    expect(ir[1].mnemonic).toBe('NOP');
    expect(ir[1].label).toBe('label1');
  });
});
