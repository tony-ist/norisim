import { describe, expect, it } from 'vitest';
import { generateIR } from './irgen';
import { AST } from '../types/asm.types';

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
    expect(ir[0].address).toBe(0);
    expect(ir[0].inlineComment).toBe('nop');
    expect(ir[0].forceUpdateFlags).toBe(false);

    expect(ir[1].mnemonic).toBe('ADD');
    expect(ir[1].operands).toStrictEqual([{ type: 'register', value: 0 }, { type: 'register', value: 1 }, { type: 'register', value: 2 }]);
    expect(ir[1].address).toBe(1);
    expect(ir[1].inlineComment).toBe(undefined);
    expect(ir[1].forceUpdateFlags).toBe(false);
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
    expect(ir[0].address).toBe(0);
    expect(ir[0].forceUpdateFlags).toBe(false);

    expect(ir[1].mnemonic).toBe('NOP');
    expect(ir[1].label).toBe('label1');
    expect(ir[1].forceUpdateFlags).toBe(false);
  });

  it('should fill flags', () => {
    const ast: AST = [
      {
        mnemonic: 'ADD',
        forceUpdateFlags: true,
        operands: [{ type: 'register', value: 0 }, { type: 'register', value: 1 }, { type: 'register', value: 2 }],
      },
    ];

    const ir = generateIR(ast);

    expect(ir.length).toBe(1);

    expect(ir[0].mnemonic).toBe('ADD');
    expect(ir[0].forceUpdateFlags).toBe(true);
  });

  it('should replace INC pseudo instructions with real instructions', () => {
    const ast: AST = [
      {
        mnemonic: 'INC',
        forceUpdateFlags: false,
        operands: [{ type: 'register', value: 2 }],
      },
    ];

    const ir = generateIR(ast);

    expect(ir.length).toBe(1);

    expect(ir[0].mnemonic).toBe('ADDI');
    expect(ir[0].operands).toStrictEqual([{ type: 'register', value: 2 }, { type: 'immediate', value: 1 }]);
    expect(ir[0].address).toBe(0);
    expect(ir[0].forceUpdateFlags).toBe(false);
    expect(ir[0].label).toBe(undefined);
    expect(ir[0].inlineComment).toBe(undefined);
  });

  it('should replace MOV pseudo instructions with real instructions', () => {
    const ast: AST = [
      {
        mnemonic: 'MOV',
        forceUpdateFlags: true,
        operands: [{ type: 'register', value: 3 }, { type: 'register', value: 5 }],
        label: 'copy',
        inlineComment: 'copy register',
      },
    ];

    const ir = generateIR(ast);

    expect(ir.length).toBe(1);

    expect(ir[0].mnemonic).toBe('XOR');
    expect(ir[0].operands).toStrictEqual([
      { type: 'register', value: 3 },
      { type: 'register', value: 5 },
      { type: 'register', value: 0 },
    ]);
    expect(ir[0].address).toBe(0);
    expect(ir[0].forceUpdateFlags).toBe(true);
    expect(ir[0].label).toBe('copy');
    expect(ir[0].inlineComment).toBe('copy register');
  });

  it('should replace DEC pseudo instructions with real instructions', () => {
    const ast: AST = [
      {
        mnemonic: 'DEC',
        forceUpdateFlags: false,
        operands: [{ type: 'register', value: 2 }],
      },
    ];

    const ir = generateIR(ast);

    expect(ir.length).toBe(1);

    expect(ir[0].mnemonic).toBe('ADDI');
    expect(ir[0].operands).toStrictEqual([{ type: 'register', value: 2 }, { type: 'immediate', value: -1 }]);
    expect(ir[0].address).toBe(0);
    expect(ir[0].forceUpdateFlags).toBe(false);
    expect(ir[0].label).toBe(undefined);
    expect(ir[0].inlineComment).toBe(undefined);
  });
});
