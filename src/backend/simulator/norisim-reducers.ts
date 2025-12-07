import { GPR_COUNT, INPUT_PORTS_COUNT, OUTPUT_PORTS_COUNT, PMEM_SIZE_BYTES, RAM_SIZE_BYTES, STACK_SIZE_BYTES } from "../../const/simulator-constants";
import { IR } from "../types/asm.types";

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

export function norisimStepReducer(ir: IR, state: NoriSimulatorState) {
    const clonedState = cloneDeep(state);
    const instruction = ir[state.PC];

    if (instruction.mnemonic === 'LIM') {
        const register = instruction.operands[0].value as number;
        const immediate = instruction.operands[1].value as number;
        clonedState.registers[register] = immediate;
    }
    
    return clonedState;
}

function cloneDeep(state: NoriSimulatorState) {
    return JSON.parse(JSON.stringify(state));
}
