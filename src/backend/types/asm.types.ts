export interface RealInstructionInfo {
  opcode: number
}

export const REAL_INSTRUCTIONS = {
  NOP: { opcode: 0x00 },
  LIM: { opcode: 0x01 },
  ADDI: { opcode: 0x02 },
  ANDI: { opcode: 0x03 },
  ADD: { opcode: 0x04 },
  SUB: { opcode: 0x05 },
  AND: { opcode: 0x06 },
  NAND: { opcode: 0x06 },
  OR: { opcode: 0x07 },
  NOR: { opcode: 0x07 },
  XOR: { opcode: 0x08 },
  XNOR: { opcode: 0x08 },
  NOT: { opcode: 0x07 },
  SHR: { opcode: 0x09 },
  MOV: { opcode: 0x06 },
  BRC: { opcode: 0x0A },
  JMP: { opcode: 0x0B },
  JZ: { opcode: 0x0A },
  JC: { opcode: 0x0A },
  JNC: { opcode: 0x0A },
  JL: { opcode: 0x0A },
  JG: { opcode: 0x0A },
  JLE: { opcode: 0x0A },
  JGE: { opcode: 0x0A },
  CAL: { opcode: 0x0C },
  RET: { opcode: 0x0D },
  PSH: { opcode: 0x0E },
  POP: { opcode: 0x0F },
  MLD: { opcode: 0x10 },
  MST: { opcode: 0x11 },
  PST: { opcode: 0x12 },
  PLD: { opcode: 0x13 },
  HLT: { opcode: 0x14 },
} satisfies Record<RealInstructionMnemonic, RealInstructionInfo>;

export const BRANCH_CONDITIONS = {
  JZ: 0,
  JNZ: 1,
  JC: 2,
  JNC: 3,
  JL: 4,
  JG: 5,
  JLE: 6,
  JGE: 7,
} as const;

export const REAL_INSTRUCTION_MNEMONICS = [
  'NOP',
  'LIM',
  'ADD',
  'ADDI',
  'ANDI',
  'SUB',
  'AND',
  'NAND',
  'OR',
  'NOR',
  'XOR',
  'XNOR',
  'NOT',
  'SHR',
  'BRC',
  'JMP',
  'JZ',
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
  'MOV',
  'JNZ',
  'INC',
  'DEC',
  'PXL',
  'PXLR',
  'CLEARPXL',
  'CLEARBUF',
  'DRAWBUF',
] as const;

export type PseudoInstructionMnemonic = typeof PSEUDO_INSTRUCTION_MNEMONICS[number];
export type ASTInstructionMnemonic = typeof REAL_INSTRUCTION_MNEMONICS[number] | PseudoInstructionMnemonic;
export type RealInstructionMnemonic = typeof REAL_INSTRUCTION_MNEMONICS[number];
export type IRInstructionMnemonic = RealInstructionMnemonic;

export interface IRNode {
  mnemonic: IRInstructionMnemonic
  operands: Operand[]
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
  NOP: [],
  LIM: ['register', 'immediate'],
  ADD: ['register', 'register', 'register'],
  ADDI: ['register', 'immediate'],
  ANDI: ['register', 'immediate'],
  SUB: ['register', 'register', 'register'],
  AND: ['register', 'register', 'register'],
  NAND: ['register', 'register', 'register'],
  OR: ['register', 'register', 'register'],
  NOR: ['register', 'register', 'register'],
  XOR: ['register', 'register', 'register'],
  XNOR: ['register', 'register', 'register'],
  NOT: ['register', 'register'],
  SHR: ['register', 'register'],
  BRC: ['immediate', 'label'],
  JMP: ['label'],
  JZ: ['label'],
  JC: ['label'],
  JNC: ['label'],
  JL: ['label'],
  JG: ['label'],
  JLE: ['label'],
  JGE: ['label'],
  CAL: ['label'],
  RET: [],
  PSH: ['register'],
  POP: ['register'],
  MLD: ['register'],
  MST: ['register'],
  MOV: ['register', 'register'],
  PST: ['register', 'immediate'],
  PLD: ['register', 'immediate'],
  HLT: [],
} satisfies Record<RealInstructionMnemonic, Operand['type'][]>;

export const PSEUDO_INSTRUCTION_OPERAND_TYPES = {
  MOV: ['register', 'register'],
  JNZ: ['label'],
  INC: ['register'],
  DEC: ['register'],
  PXL: ['immediate', 'immediate'],
  PXLR: ['register', 'register'],
  CLEARPXL: ['immediate', 'immediate'],
  CLEARBUF: [],
  DRAWBUF: [],
} satisfies Record<PseudoInstructionMnemonic, Operand['type'][]>;

export interface ASTNode {
  mnemonic: ASTInstructionMnemonic
  forceUpdateFlags: boolean
  label?: string
  inlineComment?: string
  operands: Operand[]
}

export type AST = ASTNode[];
