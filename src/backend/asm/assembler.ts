import { AST, IR, IRNode, Label, REAL_INSTRUCTIONS, RealInstructionMnemonic } from '../types/asm.types';
import { compileToIR, generateIR } from './irgen';
import { parseToAST } from './parser';

export function encodeIRNode(irNode: IRNode): number {
  const opcode = REAL_INSTRUCTIONS[irNode.mnemonic].opcode;

  switch (irNode.mnemonic) {
    case 'NOP':
    case 'RET':
    case 'HLT':
      return opcode << 11;

    case 'LIM':
    case 'ADDI':
    case 'ANDI': {
      const register = irNode.operands[0].value as number;
      const immediate = irNode.operands[1].value as number;
      return immediate << 8 | register << 5 | opcode;
    }

    case 'ADD':
    case 'SUB':
    case 'AND':
    case 'OR':
    case 'XOR': {
      const dest = irNode.operands[0].value as number;
      const srcA = irNode.operands[1].value as number;
      const srcB = irNode.operands[2].value as number;
      const updateFlagsBit = irNode.forceUpdateFlags ? 1 : 0;
      return updateFlagsBit << 15 | dest << 11 | srcA << 8 | srcB << 5 | opcode;
    }

    case 'NAND':
    case 'NOR':
    case 'XNOR': {
      const dest = irNode.operands[0].value as number;
      const srcA = irNode.operands[1].value as number;
      const srcB = irNode.operands[2].value as number;
      const updateFlagsBit = irNode.forceUpdateFlags ? 1 : 0;
      const invertedBit = 1;
      return updateFlagsBit << 15 | invertedBit << 14 | dest << 11 | srcA << 8 | srcB << 5 | opcode;
    }

    case 'NOT':
    case 'SHR': {
      const dest = irNode.operands[0].value as number;
      const src = irNode.operands[1].value as number;
      const updateFlagsBit = irNode.forceUpdateFlags ? 1 : 0;
      return updateFlagsBit << 15 | dest << 11 | src << 5 | opcode;
    }

    case 'JMP':
    case 'JZ':
    case 'JNZ':
    case 'JC':
    case 'JNC':
    case 'JL':
    case 'JG':
    case 'JLE':
    case 'JGE':
    case 'CAL': {
      const label = irNode.operands[0] as Label;
      const targetAddress = label.targetAddress as number;
      return targetAddress << 5 | opcode;
    }

    case 'PSH':
    case 'POP': {
      const register = irNode.operands[0].value as number;
      return register << 5 | opcode;
    }

    case 'MLD':
    case 'MST': {
      const register = irNode.operands[0].value as number;
      const ptr = irNode.operands[1].value as number;
      const updateFlagsBit = irNode.forceUpdateFlags ? 1 : 0;
      return updateFlagsBit << 15 | ptr << 8 | register << 5 | opcode;
    }

    case 'PST':
    case 'PLD': {
      const register = irNode.operands[0].value as number;
      const port = irNode.operands[1].value as number;
      return port << 8 | register << 5 | opcode;
    }

    default: {
      throw new Error(`Unknown instruction: ${irNode.mnemonic}`);
    }
  }
}

export function assemble(code: string): number[] {
  const ir = compileToIR(code);
  return ir.map(encodeIRNode);
}
