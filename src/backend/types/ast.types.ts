export type Format = 'A' | 'B' | 'C' | 'D' | 'E' | 'I' | 'J' | 'Z';

export interface InstructionInfo {
  format: Format;
  opcode: number;
  negated?: boolean;
}

export const INSTRUCTIONS = {
    NOP: { opcode: 0x00, format: 'Z' },
    LIM: { opcode: 0x01, format: 'I' },
    ADD: { opcode: 0x02, format: 'A' },
    ADDI: { opcode: 0x03, format: 'I' },
    SUB: { opcode: 0x04, format: 'A' },
    AND: { opcode: 0x05, format: 'A' },
    OR: { opcode: 0x06, format: 'A' },
    XOR: { opcode: 0x07, format: 'A' },
    NOT: { opcode: 0x08, format: 'B' },
    SHR: { opcode: 0x09, format: 'B' },
    JMP: { opcode: 0x0A, format: 'J' },
    JZ: { opcode: 0x0B, format: 'J' },
    JNZ: { opcode: 0x0C, format: 'J' },
    JC: { opcode: 0x0D, format: 'J' },
    JNC: { opcode: 0x0E, format: 'J' },
    JL: { opcode: 0x0F, format: 'J' },
    JG: { opcode: 0x10, format: 'J' },
    JLE: { opcode: 0x11, format: 'J' },
    JGE: { opcode: 0x12, format: 'J' },
    CAL: { opcode: 0x13, format: 'J' },
    RET: { opcode: 0x14, format: 'Z' },
    PSH: { opcode: 0x15, format: 'D' },
    POP: { opcode: 0x16, format: 'D' },
    MLD: { opcode: 0x17, format: 'E' },
    MST: { opcode: 0x18, format: 'E' },
    MOV: { opcode: 0x19, format: 'B' },
    PST: { opcode: 0x1A, format: 'C' },
    PLD: { opcode: 0x1B, format: 'C' },
    HLT: { opcode: 0x1C, format: 'Z' },
} satisfies Record<string, InstructionInfo>;

export type Mnemonic = keyof typeof INSTRUCTIONS;

export interface BaseInstruction {
  mnemonic: Mnemonic;
  label?: string;
  inlineComment?: string;
}

export interface AFormat extends BaseInstruction {
  format: 'A';
  updateFlags: 0 | 1;
  dest: number;
  srcA: number;
  srcB: number;
}

export interface BFormat extends BaseInstruction {
  format: 'B';
  updateFlags: 0 | 1;
  dest: number;
  src: number;
}

export interface CFormat extends BaseInstruction {
  format: 'C';
  address: number;
  register: number;
}

export interface DFormat extends BaseInstruction {
  format: 'D';
  register: number;
}

export interface EFormat extends BaseInstruction {
  format: 'E';
  address: number;
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
}

export interface ZFormat extends BaseInstruction {
  format: 'Z';
}

export type Instruction =
  | AFormat
  | BFormat
  | CFormat
  | DFormat
  | EFormat
  | IFormat
  | JFormat
  | ZFormat;

export type AST = Instruction[];