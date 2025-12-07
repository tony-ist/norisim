import { GPR_COUNT, INPUT_PORTS_COUNT, OUTPUT_PORTS_COUNT, PMEM_SIZE_BYTES, RAM_SIZE_BYTES, STACK_SIZE_BYTES } from "../../const/simulator-constants";
import { InstructionMnemonic, IR, Operand } from "../types/asm.types";

export interface NoriSimulatorState {
    PC: number;
    SR: number;
    registers: number[];
    ZF: boolean;
    CF: boolean;
    VF: boolean;
    NF: boolean;
    PMEM: number[];
    RAM: number[];
    stack: number[];
    inputPorts: number[];
    outputPorts: number[];
    isWaitingPortInput: boolean;
    cycle: number;
}

export function defaultNoriSimulatorState(): NoriSimulatorState {
    return {
        PC: 0,
        SR: 0,
        ZF: false,
        CF: false,
        VF: false,
        NF: false,
        registers: Array(GPR_COUNT).fill(0),
        PMEM: Array(PMEM_SIZE_BYTES).fill(0),
        RAM: Array(RAM_SIZE_BYTES).fill(0),
        stack: Array(STACK_SIZE_BYTES).fill(0),
        inputPorts: Array(INPUT_PORTS_COUNT).fill(0),
        outputPorts: Array(OUTPUT_PORTS_COUNT).fill(0),
        isWaitingPortInput: false,
        cycle: 0,
    };
}

type InstructionHandler = (state: NoriSimulatorState, operands: Operand[]) => void;

const instructionHandlers: Record<InstructionMnemonic, InstructionHandler> = {
    NOP: noOperation,
    LIM: loadImmediate,
    ADDI: addImmediate,
    ADD: add,
    SUB: subtract,
    AND: and,
    NAND: nand,
    OR: or,
    NOR: nor,
    XOR: xor,
    XNOR: xnor,
    NOT: not,
    SHR: shiftRight,
    MOV: move,
    JMP: jump,
    JZ: jumpZero,
    JNZ: jumpNotZero,
    JC: jumpCarry,
    JNC: jumpNotCarry,
    JL: jumpLess,
    JG: jumpGreater,
    JLE: jumpLessEqual,
    JGE: jumpGreaterEqual,
    CAL: call,  
    RET: returnInstruction,
    PSH: push,
    POP: pop,
    MLD: loadFromRAM,
    MST: storeToRAM,
    PST: portStore,
    PLD: portLoad,
    HLT: halt,
} as const;

export function norisimStep(ir: IR, state: NoriSimulatorState) {
    const clonedState = cloneDeep(state);
    const instruction = ir[state.PC];

    const handler = instructionHandlers[instruction.mnemonic];
    handler(clonedState, instruction.operands);
    
    return clonedState;
}

function cloneDeep(state: NoriSimulatorState) {
    return JSON.parse(JSON.stringify(state));
}

function noOperation(state: NoriSimulatorState, operands: Operand[]) {
    state.PC++;
}

function loadImmediate(state: NoriSimulatorState, operands: Operand[]) {
    const register = operands[0].value as number;
    const immediate = operands[1].value as number;
    state.registers[register] = immediate;
    state.PC++;
}

function addImmediate(state: NoriSimulatorState, operands: Operand[]) {
    const register = operands[0].value as number;
    const immediate = operands[1].value as number;
    state.registers[register] += immediate;
    state.PC++;
}

function add(state: NoriSimulatorState, operands: Operand[]) {
    throw new Error('Not implemented');
}

function subtract(state: NoriSimulatorState, operands: Operand[]) {
    throw new Error('Not implemented');
}

function and(state: NoriSimulatorState, operands: Operand[]) {
    throw new Error('Not implemented');
}

function nand(state: NoriSimulatorState, operands: Operand[]) {
    throw new Error('Not implemented');
}

function or(state: NoriSimulatorState, operands: Operand[]) {
    throw new Error('Not implemented');
}

function nor(state: NoriSimulatorState, operands: Operand[]) {
    throw new Error('Not implemented');
}

function xor(state: NoriSimulatorState, operands: Operand[]) {
    throw new Error('Not implemented');
}

function xnor(state: NoriSimulatorState, operands: Operand[]) {
    throw new Error('Not implemented');
}

function not(state: NoriSimulatorState, operands: Operand[]) {
    throw new Error('Not implemented');
}

function shiftRight(state: NoriSimulatorState, operands: Operand[]) {
    throw new Error('Not implemented');
}

function move(state: NoriSimulatorState, operands: Operand[]) {
    throw new Error('Not implemented');
}

function jump(state: NoriSimulatorState, operands: Operand[]) {
    throw new Error('Not implemented');
}

function jumpZero(state: NoriSimulatorState, operands: Operand[]) {
    throw new Error('Not implemented');
}

function jumpNotZero(state: NoriSimulatorState, operands: Operand[]) {
    throw new Error('Not implemented');
}

function jumpCarry(state: NoriSimulatorState, operands: Operand[]) {
    throw new Error('Not implemented');
}

function jumpNotCarry(state: NoriSimulatorState, operands: Operand[]) {
    throw new Error('Not implemented');
}

function jumpLess(state: NoriSimulatorState, operands: Operand[]) {
    throw new Error('Not implemented');
}

function jumpGreater(state: NoriSimulatorState, operands: Operand[]) {
    throw new Error('Not implemented');
}

function jumpLessEqual(state: NoriSimulatorState, operands: Operand[]) {
    throw new Error('Not implemented');
}

function jumpGreaterEqual(state: NoriSimulatorState, operands: Operand[]) {
    throw new Error('Not implemented');
}

function call(state: NoriSimulatorState, operands: Operand[]) {
    throw new Error('Not implemented');
}

function returnInstruction(state: NoriSimulatorState, operands: Operand[]) {
    throw new Error('Not implemented');
}

function push(state: NoriSimulatorState, operands: Operand[]) {
    throw new Error('Not implemented');
}

function pop(state: NoriSimulatorState, operands: Operand[]) {
    throw new Error('Not implemented');
}

function loadFromRAM(state: NoriSimulatorState, operands: Operand[]) {
    throw new Error('Not implemented');
}

function storeToRAM(state: NoriSimulatorState, operands: Operand[]) {
    throw new Error('Not implemented');
}

function portStore(state: NoriSimulatorState, operands: Operand[]) {
    throw new Error('Not implemented');
}

function portLoad(state: NoriSimulatorState, operands: Operand[]) {
    throw new Error('Not implemented');
}

function halt(state: NoriSimulatorState, operands: Operand[]) {
    throw new Error('Not implemented');
}
