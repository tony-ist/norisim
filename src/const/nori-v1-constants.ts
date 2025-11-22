export const INSTRUCTIONS = {
    NOP: {
        opcode: 0x00,
        mnemonic: 'NOP',
    },
    LIM: {
        opcode: 0x01,
        mnemonic: 'LIM',
    },
    ADD: {
        opcode: 0x02,
        mnemonic: 'ADD',
    },
    NAND: {
        opcode: 0x02,
        mnemonic: 'NAND',
        negated: true,
    },
    ADDI: {
        opcode: 0x03,
        mnemonic: 'ADDI',
    },
    SUB: {
        opcode: 0x04,
        mnemonic: 'SUB',
    },
    AND: {
        opcode: 0x05,
        mnemonic: 'AND',
    },
    OR: {
        opcode: 0x06,
        mnemonic: 'OR',
    },
    XOR: {
        opcode: 0x07,
        mnemonic: 'XOR',
    },
    NOT: {
        opcode: 0x08,
        mnemonic: 'NOT',
    },
    SHR: {
        opcode: 0x09,
        mnemonic: 'SHR',
    },
    JMP: {
        opcode: 0x0A,
        mnemonic: 'JMP',
    },
        JZ: {
        opcode: 0x0B,
        mnemonic: 'JZ',
    },
    JNZ: {
        opcode: 0x0C,
        mnemonic: 'JNZ',
    },
    JC: {
        opcode: 0x0D,
        mnemonic: 'JC',
    },
    JNC: {
        opcode: 0x0E,
        mnemonic: 'JNC',
    },
    JL: {
        opcode: 0x0F,
        mnemonic: 'JL',
    },
    JG: {
        opcode: 0x10,
        mnemonic: 'JG',
    },
    JLE: {
        opcode: 0x11,
        mnemonic: 'JLE',
    },
    JGE: {
        opcode: 0x12,
        mnemonic: 'JGE',
    },
    CAL: {
        opcode: 0x13,
        mnemonic: 'CAL',
    },
    RET: {
        opcode: 0x14,
        mnemonic: 'RET',
    },
    PSH: {
        opcode: 0x15,
        mnemonic: 'PSH',
    },
    POP: {
        opcode: 0x16,
        mnemonic: 'POP',
    },
    MLD: {
        opcode: 0x17,
        mnemonic: 'MLD',
    },
    MST: {
        opcode: 0x18,
        mnemonic: 'MST',
    },
    MOV: {
        opcode: 0x19,
        mnemonic: 'MOV',
    },
    PST: {
        opcode: 0x1A,
        mnemonic: 'PST',
    },
    PLD: {
        opcode: 0x1B,
        mnemonic: 'PLD',
    },
    HLT: {
        opcode: 0x1C,
        mnemonic: 'HLT',
    },
};

export const MNEMONICS = Object.values(INSTRUCTIONS).map((instruction: { mnemonic: string }) => instruction.mnemonic);
