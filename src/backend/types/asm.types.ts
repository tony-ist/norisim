export type Format = 'A' | 'B' | 'C' | 'I' | 'J' | 'Z';

export interface RealInstructionInfo {
  format: Format
  opcode: number
}

export const REAL_INSTRUCTIONS = {
  NOP: { opcode: 0x00, format: 'Z' },
  LIM: { opcode: 0x01, format: 'I' },
  ADDI: { opcode: 0x02, format: 'I' },
  ADD: { opcode: 0x03, format: 'A' },
  SUB: { opcode: 0x04, format: 'A' },
  AND: { opcode: 0x05, format: 'A' },
  NAND: { opcode: 0x05, format: 'A' },
  OR: { opcode: 0x06, format: 'A' },
  NOR: { opcode: 0x06, format: 'A' },
  XOR: { opcode: 0x07, format: 'A' },
  XNOR: { opcode: 0x07, format: 'A' },
  NOT: { opcode: 0x08, format: 'B' },
  SHR: { opcode: 0x09, format: 'B' },
  MOV: { opcode: 0xA, format: 'B' },
  JMP: { opcode: 0x0B, format: 'J' },
  JZ: { opcode: 0x0C, format: 'J' },
  JNZ: { opcode: 0x0D, format: 'J' },
  JC: { opcode: 0x0E, format: 'J' },
  JNC: { opcode: 0x0F, format: 'J' },
  JL: { opcode: 0x10, format: 'J' },
  JG: { opcode: 0x11, format: 'J' },
  JLE: { opcode: 0x12, format: 'J' },
  JGE: { opcode: 0x13, format: 'J' },
  CAL: { opcode: 0x14, format: 'J' },
  RET: { opcode: 0x15, format: 'Z' },
  PSH: { opcode: 0x16, format: 'C' },
  POP: { opcode: 0x17, format: 'C' },
  MLD: { opcode: 0x19, format: 'B' },
  MST: { opcode: 0x1A, format: 'B' },
  PST: { opcode: 0x1B, format: 'I' },
  PLD: { opcode: 0x1C, format: 'I' },
  HLT: { opcode: 0x1D, format: 'Z' },
} satisfies Record<RealInstructionMnemonic, RealInstructionInfo>;

export const REAL_INSTRUCTION_MNEMONICS = [
  'NOP',
  'LIM',
  'ADD',
  'ADDI',
  'SUB',
  'AND',
  'NAND',
  'OR',
  'NOR',
  'XOR',
  'XNOR',
  'NOT',
  'SHR',
  'JMP',
  'JZ',
  'JNZ',
  'JC',
  'JNC',
  'JL',
  'JG',
  'JLE',
  'JGE',
  'CAL',
  'RET',
  'PSH',
  'POP',
  'MLD',
  'MST',
  'MOV',
  'PST',
  'PLD',
  'HLT',
] as const;

export const PSEUDO_INSTRUCTION_MNEMONICS = [
  'INC',
  'DEC',
  'PXL',
] as const;

export type PseudoInstructionMnemonic = typeof PSEUDO_INSTRUCTION_MNEMONICS[number];
export type ASTInstructionMnemonic = typeof REAL_INSTRUCTION_MNEMONICS[number] | PseudoInstructionMnemonic;
export type RealInstructionMnemonic = typeof REAL_INSTRUCTION_MNEMONICS[number];
export type IRInstructionMnemonic = RealInstructionMnemonic;

export interface IRNode {
  mnemonic: IRInstructionMnemonic
  operands: Operand[]
  format: Format
  address: number
  label?: string
  inlineComment?: string
  forceUpdateFlags?: boolean
}

export type IR = IRNode[];

export type Operand = Register | Immediate | Label;

export interface Register {
  type: 'register'
  value: number
}

export interface Immediate {
  type: 'immediate'
  value: number
}

export interface Label {
  type: 'label'
  value: string
  targetAddress?: number
}

export const REAL_INSTRUCTIONS_OPERAND_TYPES = {
  A: ['register', 'register', 'register'],
  B: ['register', 'register'],
  C: ['register'],
  I: ['register', 'immediate'],
  J: ['label'],
  Z: [],
} satisfies Record<Format, Operand['type'][]>;

export const PSEUDO_INSTRUCTION_OPERAND_TYPES = {
  INC: ['register'],
  DEC: ['register'],
  PXL: ['immediate', 'immediate'],
} satisfies Record<PseudoInstructionMnemonic, Operand['type'][]>;

export interface ASTNode {
  mnemonic: ASTInstructionMnemonic
  forceUpdateFlags: boolean
  label?: string
  inlineComment?: string
  operands: Operand[]
}

export type AST = ASTNode[];
