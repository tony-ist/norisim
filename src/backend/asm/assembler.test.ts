import { describe, expect, it } from 'vitest';
import { AST } from '../types/asm.types';
import { assemble } from './assembler';

describe('assemble', () => {
  it('should assemble a simple program', () => {
    const ast: AST = [
      {
        mnemonic: 'NOP',
        forceUpdateFlags: false,
        operands: [],
      },
    ];
    const machineCode = assemble(ast);
    expect(machineCode).toEqual([0x00]);
  });
});
