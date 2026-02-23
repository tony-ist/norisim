import { AST, IR, IRNode, Label, REAL_INSTRUCTIONS, RealInstructionMnemonic } from '../types/asm.types';
import { compileToIR, generateIR } from './irgen';
import { parseToAST } from './parser';

const INVERTED_MNEMONICS = new Set<RealInstructionMnemonic>(['NAND', 'NOR', 'XNOR']);

export function encodeIRNode(irNode: IRNode): number {
  const opcode = REAL_INSTRUCTIONS[irNode.mnemonic].opcode;

  switch (irNode.format) {
    case 'Z':
      return opcode << 11;

    case 'I': {
      const register = irNode.operands[0].value as number;
      const immediate = irNode.operands[1].value as number;
      return immediate << 8 | register << 5 | opcode;
    }

    case 'A': {
      const dest = irNode.operands[0].value as number;
      const srcA = irNode.operands[1].value as number;
      const srcB = irNode.operands[2].value as number;
      const updateFlagsBit = irNode.forceUpdateFlags ? 1 : 0;
      return updateFlagsBit << 15 | dest << 11 | srcA << 8 | srcB << 5 | opcode;
    }

    case 'B': {

    }

    case 'C': {

    }

    case 'J': {

    }
  }
}

export function assemble(code: string): number[] {
  const ir = compileToIR(code);
  return ir.map(encodeIRNode);
}
