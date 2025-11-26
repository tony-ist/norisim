export type Format = 'A' | 'B' | 'C' | 'D' | 'I' | 'J' | 'Z';

export interface InstructionInfo {
  format: Format;
  opcode: number;
}

export const INSTRUCTIONS = {
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
    LPM: { opcode: 0x18, format: 'B' },
    MLD: { opcode: 0x19, format: 'B' },
    MST: { opcode: 0x1A, format: 'B' },
    PST: { opcode: 0x1B, format: 'I' },
    PLD: { opcode: 0x1C, format: 'I' },
    HLT: { opcode: 0x1D, format: 'Z' },
} satisfies Record<string, InstructionInfo>;

export type InstructionMnemonic = 'NOP' | 'LIM' | 'ADD' | 'ADDI' | 'SUB' | 'AND' | 'NAND' | 'OR' | 'NOR' | 'XOR' | 'XNOR' | 'NOT' | 'SHR' | 'JMP' | 'JZ' | 'JNZ' | 'JC' | 'JNC' | 'JL' | 'JG' | 'JLE' | 'JGE' | 'CAL' | 'RET' | 'PSH' | 'POP' | 'LPM' | 'MLD' | 'MST' | 'MOV' | 'PST' | 'PLD' | 'HLT';
export type DataMnemonic = 'DB';

export interface BaseInstruction {
  mnemonic: InstructionMnemonic;
  format: Format;
  address: number;
  label?: string;
  inlineComment?: string;
}

export interface AFormat extends BaseInstruction {
  format: 'A';
  updateFlags: boolean;
  destRegister: number;
  srcRegisterA: number;
  srcRegisterB: number;
}

export interface BFormat extends BaseInstruction {
  format: 'B';
  updateFlags: boolean;
  register1: number;
  register2: number;
}

export interface CFormat extends BaseInstruction {
  format: 'C';
  portAddress: number;
  register: number;
}

export interface DFormat extends BaseInstruction {
  format: 'D';
  register: number;
}

export interface IFormat extends BaseInstruction {
  format: 'I';
  register: number;
  immediate: number;
}

export interface JFormat extends BaseInstruction {
  format: 'J';
  targetLabel: string;
  targetAddress?: number;
}

export interface ZFormat extends BaseInstruction {
  format: 'Z';
}

export interface Data {
  mnemonic: DataMnemonic;
  address: number;
  label?: string;
  inlineComment?: string;
  value: number;
}

export type Instruction =
  | AFormat
  | BFormat
  | CFormat
  | DFormat
  | IFormat
  | JFormat
  | ZFormat
  ;
  
export type IRNode = Instruction | Data;

export type IR = IRNode[];

export type Operand = Register | Immediate | Label;

export interface Register {
  type: 'register';
  value: number;
}

export interface Immediate {
  type: 'immediate';
  value: number;
}

export interface Label {
  type: 'label';
  value: string;
}

export const OPERAND_TYPES = {
  'A': ['register', 'register', 'register'],
  'B': ['register', 'register'],
  'C': ['register'],
  'I': ['register', 'immediate'],
  'J': ['label'],
  'Z': [],
} satisfies Record<Format, Operand['type'][]>;

export interface ASTNode {
  mnemonic: InstructionMnemonic | DataMnemonic;
  forceUpdateFlags: boolean;
  label?: string;
  inlineComment?: string;
  operands: Operand[];
}

export type AST = ASTNode[];
