import { describe, expect, it } from 'vitest';
import { AST, IRNode } from '../types/asm.types';
import { assemble, encodeIRNode } from './assembler';

describe('encodeIRNode', () => {
  it('should encode Z format instruction', () => {
    const irNode: IRNode = {
      mnemonic: 'NOP',
      format: 'Z',
      operands: [],
      address: 0,
    };
    expect(encodeIRNode(irNode)).toEqual(0);
  });

  it('should encode I format instruction', () => {
    const irNode: IRNode = {
      mnemonic: 'ADDI',
      format: 'I',
      operands: [{ type: 'register', value: 1 }, { type: 'immediate', value: 255 }],
      address: 0,
    };
    expect(encodeIRNode(irNode)).toEqual(0b11111111_001_00010);
  });

  it('should encode A format instruction', () => {
    const irNode: IRNode = {
      mnemonic: 'ADD',
      format: 'A',
      operands: [{ type: 'register', value: 1 }, { type: 'register', value: 2 }, { type: 'register', value: 3 }],
      address: 0,
      forceUpdateFlags: true,
    };
    expect(encodeIRNode(irNode)).toEqual(0b10_001_010_011_00100);
  });

  it('should encode NAND', () => {
    const irNode: IRNode = {
      mnemonic: 'NAND',
      format: 'A',
      operands: [{ type: 'register', value: 1 }, { type: 'register', value: 2 }, { type: 'register', value: 3 }],
      address: 0,
      forceUpdateFlags: true,
    };
    expect(encodeIRNode(irNode)).toEqual(0b11_001_010_011_00100);
  });
});
