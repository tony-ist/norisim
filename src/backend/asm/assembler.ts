import { PC_BITS, SR_BITS } from '../../const/simulator-constants';
import { split16BitInto8Bit } from '../../util/asm-util';
import { IRNode, Label, REAL_INSTRUCTIONS } from '../types/asm.types';
import { compileToIR } from './irgen';

export function encodeIRNode(irNode: IRNode): number {
  switch (irNode.mnemonic) {
    case 'NOP':
    case 'RET':
    case 'HLT':
      return encodeZFormat(REAL_INSTRUCTIONS[irNode.mnemonic].opcode);

    case 'LIM':
    case 'ADDI':
    case 'ANDI': {
      const register = toField(irNode.operands[0].value as number, 3, 'register');
      const immediate = toImmediateByte(irNode.operands[1].value as number);
      return encodeImmediateFormat(REAL_INSTRUCTIONS[irNode.mnemonic].opcode, register, immediate);
    }

    case 'ADD':
    case 'SUB':
    case 'AND':
    case 'OR':
    case 'XOR': {
      const opcode = REAL_INSTRUCTIONS[irNode.mnemonic].opcode;
      const dest = toField(irNode.operands[0].value as number, 3, 'dest');
      const srcA = toField(irNode.operands[1].value as number, 3, 'srcA');
      const srcB = toField(irNode.operands[2].value as number, 3, 'srcB');
      const updateFlagsBit = irNode.forceUpdateFlags ? 1 : 0;
      return encodeAlu3RegisterFormat(opcode, dest, srcA, srcB, updateFlagsBit, 0);
    }

    case 'NAND':
    case 'NOR':
    case 'XNOR': {
      const opcode = REAL_INSTRUCTIONS[irNode.mnemonic].opcode;
      const dest = toField(irNode.operands[0].value as number, 3, 'dest');
      const srcA = toField(irNode.operands[1].value as number, 3, 'srcA');
      const srcB = toField(irNode.operands[2].value as number, 3, 'srcB');
      const updateFlagsBit = irNode.forceUpdateFlags ? 1 : 0;
      return encodeAlu3RegisterFormat(opcode, dest, srcA, srcB, updateFlagsBit, 1);
    }

    case 'SHR': {
      const dest = toField(irNode.operands[0].value as number, 3, 'dest');
      const src = toField(irNode.operands[1].value as number, 3, 'src');
      const updateFlagsBit = irNode.forceUpdateFlags ? 1 : 0;
      return encodeShiftFormat(dest, src, updateFlagsBit);
    }

    case 'BRC': {
      const condition = toField(irNode.operands[0].value as number, 3, 'branch condition');
      return encodeBranchFormat(irNode, condition, 1);
    }

    case 'JMP':
    case 'CAL': {
      const label = irNode.operands[0] as Label;
      const targetAddress = getLabelTargetAddress(label, irNode.mnemonic);
      return encodeJumpFormat(REAL_INSTRUCTIONS[irNode.mnemonic].opcode, targetAddress);
    }

    case 'PSH': {
      const sourceRegister = toField(irNode.operands[0].value as number, 3, 'source register');
      return encodePushFormat(sourceRegister);
    }

    case 'POP': {
      const destinationRegister = toField(irNode.operands[0].value as number, 3, 'destination register');
      return encodePopFormat(destinationRegister);
    }

    case 'MLD': {
      const destinationRegister = toField(irNode.operands[0].value as number, 3, 'destination register');
      const pointerRegister = toField(irNode.operands[1].value as number, 3, 'pointer register');
      return encodeMemoryLoadFormat(destinationRegister, pointerRegister);
    }

    case 'MST': {
      const sourceRegister = toField(irNode.operands[0].value as number, 3, 'source register');
      const pointerRegister = toField(irNode.operands[1].value as number, 3, 'pointer register');
      return encodeMemoryStoreFormat(sourceRegister, pointerRegister);
    }

    case 'PST': {
      const sourceRegister = toField(irNode.operands[0].value as number, 3, 'source register');
      const port = toField(irNode.operands[1].value as number, 3, 'port');
      return encodePortStoreFormat(sourceRegister, port);
    }

    case 'PLD': {
      const destinationRegister = toField(irNode.operands[0].value as number, 3, 'destination register');
      const port = toField(irNode.operands[1].value as number, 3, 'port');
      return encodePortLoadFormat(destinationRegister, port);
    }

    default: {
      throw new Error(`Unknown instruction: ${irNode.mnemonic}`);
    }
  }
}

export function assemble(code: string): number[] {
  const ir = compileToIR(code);
  return ir.map(encodeIRNode).flatMap(split16BitInto8Bit);
}

function encodeZFormat(opcode: number): number {
  return opcode & 0x1F;
}

function encodeImmediateFormat(opcode: number, register: number, immediate: number): number {
  return ((immediate << 8) | (register << 5) | opcode) & 0xFFFF;
}

function encodeAlu3RegisterFormat(
  opcode: number,
  dest: number,
  srcA: number,
  srcB: number,
  updateFlagsBit: number,
  invertBit: number,
): number {
  return (
    (updateFlagsBit << 15)
    | (invertBit << 14)
    | (srcA << 11)
    | (srcB << 8)
    | (dest << 5)
    | opcode
  ) & 0xFFFF;
}

function encodeShiftFormat(dest: number, src: number, updateFlagsBit: number): number {
  return ((updateFlagsBit << 15) | (src << 11) | (dest << 5) | REAL_INSTRUCTIONS.SHR.opcode) & 0xFFFF;
}

function encodeBranchFormat(irNode: IRNode, condition: number, targetOperandIndex: number): number {
  const label = irNode.operands[targetOperandIndex] as Label;
  const targetAddress = getLabelTargetAddress(label, irNode.mnemonic);
  const currentAddress = toField(irNode.address, PC_BITS + SR_BITS, 'instruction address');
  const currentSr = (currentAddress >> PC_BITS) & ((1 << SR_BITS) - 1);
  const targetSr = (targetAddress >> PC_BITS) & ((1 << SR_BITS) - 1);

  if (currentSr !== targetSr) {
    throw new Error(
      `${irNode.mnemonic} target ${targetAddress} is outside current SR page (${currentSr}); BRC can only branch within the current page.`,
    );
  }

  const targetPc = targetAddress & ((1 << PC_BITS) - 1);
  const page = (targetPc >> 3) & 0x7;
  const address = targetPc & 0x7;

  return ((condition << 11) | (page << 8) | (address << 5) | REAL_INSTRUCTIONS.BRC.opcode) & 0xFFFF;
}

function encodeJumpFormat(opcode: number, targetAddress: number): number {
  return ((targetAddress << 5) | opcode) & 0xFFFF;
}

function encodePushFormat(sourceRegister: number): number {
  return ((sourceRegister << 11) | REAL_INSTRUCTIONS.PSH.opcode) & 0xFFFF;
}

function encodePopFormat(destinationRegister: number): number {
  return ((destinationRegister << 5) | REAL_INSTRUCTIONS.POP.opcode) & 0xFFFF;
}

function encodeMemoryLoadFormat(destinationRegister: number, pointerRegister: number): number {
  return ((pointerRegister << 8) | (destinationRegister << 5) | REAL_INSTRUCTIONS.MLD.opcode) & 0xFFFF;
}

function encodeMemoryStoreFormat(sourceRegister: number, pointerRegister: number): number {
  return ((sourceRegister << 11) | (pointerRegister << 8) | REAL_INSTRUCTIONS.MST.opcode) & 0xFFFF;
}

function encodePortStoreFormat(sourceRegister: number, port: number): number {
  return ((sourceRegister << 11) | (port << 8) | REAL_INSTRUCTIONS.PST.opcode) & 0xFFFF;
}

function encodePortLoadFormat(destinationRegister: number, port: number): number {
  return ((port << 8) | (destinationRegister << 5) | REAL_INSTRUCTIONS.PLD.opcode) & 0xFFFF;
}

function getLabelTargetAddress(label: Label, mnemonic: string): number {
  if (label.type !== 'label') {
    throw new Error(`${mnemonic} requires a label operand`);
  }

  if (label.targetAddress === undefined) {
    throw new Error(`Target label address for ${mnemonic} is not resolved: ${label.value}`);
  }

  return toField(label.targetAddress, 11, `${mnemonic} target address`);
}

function toField(value: number, bits: number, fieldName: string): number {
  if (!Number.isInteger(value)) {
    throw new Error(`Invalid ${fieldName}: ${value}. Expected an integer.`);
  }

  const max = (1 << bits) - 1;

  if (value < 0 || value > max) {
    throw new Error(`Invalid ${fieldName}: ${value}. Expected value in [0, ${max}].`);
  }

  return value;
}

function toImmediateByte(value: number): number {
  if (!Number.isInteger(value)) {
    throw new Error(`Invalid immediate value: ${value}. Expected an integer.`);
  }

  if (value < -128 || value > 255) {
    throw new Error(`Invalid immediate value: ${value}. Expected value in [-128, 255].`);
  }

  return value & 0xFF;
}
