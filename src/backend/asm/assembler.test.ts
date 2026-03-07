import { describe, expect, it } from 'vitest';
import { IRNode } from '../types/asm.types';
import { encodeIRNode } from './assembler';

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
    expect(encodeIRNode(irNode)).toEqual(0b1_0_010_011_001_00100);
  });

  it('should encode AND', () => {
    const irNode: IRNode = {
      mnemonic: 'AND',
      operands: [{ type: 'register', value: 1 }, { type: 'register', value: 2 }, { type: 'register', value: 3 }],
      address: 0,
      forceUpdateFlags: true,
    };
    expect(encodeIRNode(irNode)).toEqual(0b1_0_010_011_001_00110);
  });

  it('should encode NAND', () => {
    const irNode: IRNode = {
      mnemonic: 'NAND',
      operands: [{ type: 'register', value: 1 }, { type: 'register', value: 2 }, { type: 'register', value: 3 }],
      address: 0,
      forceUpdateFlags: true,
    };
    expect(encodeIRNode(irNode)).toEqual(0b1_1_010_011_001_00110);
  });

  it('should encode XNOR', () => {
    const irNode: IRNode = {
      mnemonic: 'XNOR',
      operands: [{ type: 'register', value: 1 }, { type: 'register', value: 2 }, { type: 'register', value: 3 }],
      address: 0,
      forceUpdateFlags: true,
    };
    expect(encodeIRNode(irNode)).toEqual(0b1_1_010_011_001_01000);
  });

  it('should encode JMP', () => {
    const irNode: IRNode = {
      mnemonic: 'JMP',
      operands: [{ type: 'label', value: '.loop', targetAddress: 3 }],
      address: 0,
    };
    expect(encodeIRNode(irNode)).toEqual(0b00000000011_01011);
  });

  it('should encode PSH', () => {
    const irNode: IRNode = {
      mnemonic: 'PSH',
      operands: [{ type: 'register', value: 3 }],
      address: 0,
    };
    expect(encodeIRNode(irNode)).toEqual(0b00_011_000000_01110);
  });

  it('should encode MLD', () => {
    const irNode: IRNode = {
      mnemonic: 'MLD',
      operands: [{ type: 'register', value: 1 }, { type: 'register', value: 2 }],
      address: 0,
    };
    expect(encodeIRNode(irNode)).toEqual(0b00000_010_001_10000);
  });

  it('should encode PST', () => {
    const irNode: IRNode = {
      mnemonic: 'PST',
      operands: [{ type: 'register', value: 1 }, { type: 'immediate', value: 3 }],
      address: 0,
    };
    expect(encodeIRNode(irNode)).toEqual(0b00_001_011_000_10010);
  });

  it('should encode BRC with condition/page/address fields', () => {
    const irNode: IRNode = {
      mnemonic: 'BRC',
      operands: [{ type: 'immediate', value: 3 }, { type: 'label', value: '.loop', targetAddress: 0b0_101_111 }],
      address: 0b0_100_001,
    };

    expect(encodeIRNode(irNode)).toEqual(0b00_011_101_111_01010);
  });
});
