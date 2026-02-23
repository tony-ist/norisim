import { describe, expect, it } from 'vitest';
import { AST, IRNode } from '../types/asm.types';
import { assemble, encodeIRNode } from './assembler';

describe('encodeIRNode', () => {
  it('should encode NOP', () => {
    const irNode: IRNode = {
      mnemonic: 'NOP',
      operands: [],
      address: 0,
    };
    expect(encodeIRNode(irNode)).toEqual(0);
  });

  it('should encode ADDI', () => {
    const irNode: IRNode = {
      mnemonic: 'ADDI',
      operands: [{ type: 'register', value: 1 }, { type: 'immediate', value: 255 }],
      address: 0,
    };
    expect(encodeIRNode(irNode)).toEqual(0b11111111_001_00010);
  });

  it('should encode ADD', () => {
    const irNode: IRNode = {
      mnemonic: 'ADD',
      operands: [{ type: 'register', value: 1 }, { type: 'register', value: 2 }, { type: 'register', value: 3 }],
      address: 0,
      forceUpdateFlags: true,
    };
    expect(encodeIRNode(irNode)).toEqual(0b10_001_010_011_00100);
  });

  it('should encode AND', () => {
    const irNode: IRNode = {
      mnemonic: 'AND',
      operands: [{ type: 'register', value: 1 }, { type: 'register', value: 2 }, { type: 'register', value: 3 }],
      address: 0,
      forceUpdateFlags: true,
    };
    expect(encodeIRNode(irNode)).toEqual(0b10_001_010_011_00110);
  });

  it('should encode NAND', () => {
    const irNode: IRNode = {
      mnemonic: 'NAND',
      operands: [{ type: 'register', value: 1 }, { type: 'register', value: 2 }, { type: 'register', value: 3 }],
      address: 0,
      forceUpdateFlags: true,
    };
    expect(encodeIRNode(irNode)).toEqual(0b11_001_010_011_00110);
  });

  it('should encode NOT', () => {
    const irNode: IRNode = {
      mnemonic: 'NOT',
      operands: [{ type: 'register', value: 1 }, { type: 'register', value: 2 }],
      address: 0,
      forceUpdateFlags: true,
    };
    expect(encodeIRNode(irNode)).toEqual(0b10_001_000_010_01001);
  });

  it('should encode JMP', () => {
    const irNode: IRNode = {
      mnemonic: 'JMP',
      operands: [{ type: 'label', value: '.loop', targetAddress: 3 }],
      address: 0,
    };
    expect(encodeIRNode(irNode)).toEqual(0b00000_00011_01100);
  });

  it('should encode PSH', () => {
    const irNode: IRNode = {
      mnemonic: 'PSH',
      operands: [{ type: 'register', value: 3 }],
      address: 0,
    };
    expect(encodeIRNode(irNode)).toEqual(0b00000000_011_10111);
  });

  it('should encode MLD', () => {
    const irNode: IRNode = {
      mnemonic: 'MLD',
      operands: [{ type: 'register', value: 1 }, { type: 'register', value: 2 }],
      address: 0,
    };
    expect(encodeIRNode(irNode)).toEqual(0b00_000_010_001_11001);
  });

  it('should encode PST', () => {
    const irNode: IRNode = {
      mnemonic: 'PST',
      operands: [{ type: 'register', value: 1 }, { type: 'immediate', value: 3 }],
      address: 0,
    };
    expect(encodeIRNode(irNode)).toEqual(0b00_000_011_001_11011);
  });
});
