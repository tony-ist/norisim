import { GPR_COUNT, INPUT_PORTS_COUNT, OUTPUT_PORTS_COUNT, PMEM_SIZE_BYTES, RAM_SIZE_BYTES, STACK_SIZE_BYTES } from "../../const/simulator-constants";
import { createLabelMap } from "../asm/label-map";
import { parseToAST } from "../asm/parser";
import { AST, Format, Instruction, Mnemonic } from "../types/ast.types";

export interface NoriV1SimulatorState {
    ast: AST;
    labelMap: Record<string, number>;
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

export function defaultNoriV1SimulatorState(code: string): NoriV1SimulatorState {
    const ast = parseToAST(code);
    const labelMap = createLabelMap(ast);

    return {
        ast,
        labelMap,
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

export class NoriV1Simulator {
    private readonly state: NoriV1SimulatorState;
    // Temporary/partial handlers object, filled with stubs for all mnemonics to satisfy type checker
    private readonly handlers: Record<Mnemonic, (...args: any) => void> = {
        NOP: this.noOperation.bind(this),
        LIM: this.loadImmediate.bind(this),
        ADD: this.add.bind(this),
        ADDI: this.addImmediate.bind(this),
    };

    constructor(private readonly code: string) {
        this.state = defaultNoriV1SimulatorState(code);
    }

    public run() {
        console.log(this.state.ast);
    }

    public step() {
        const instruction = this.state.ast[this.currentInstructionAddress()];
        const mnemonic = instruction.mnemonic;
        

        if (isFormat(instruction, 'I')) {
            const register = instruction.register;
            const immediate = instruction.immediate;
            this.handlers[instruction.mnemonic](register, immediate);
        } else if (isFormat(instruction, 'A')) {
            const dest = instruction.dest;
            const srcA = instruction.srcA;
            const srcB = instruction.srcB;
            const updateFlags = instruction.updateFlags;
            this.handlers[instruction.mnemonic](dest, srcA, srcB, updateFlags);
        } else if (isFormat(instruction, 'B')) {
            const register1 = instruction.register1;
            const register2 = instruction.register2;
            const updateFlags = instruction.updateFlags;
            this.handlers[instruction.mnemonic](register1, register2, updateFlags);
        } else if (isFormat(instruction, 'C')) {
            const address = instruction.address;
            const register = instruction.register;
            this.handlers[instruction.mnemonic](address, register);
        } else if (isFormat(instruction, 'D')) {
            const register = instruction.register;
            this.handlers[instruction.mnemonic](register);
        } else if (isFormat(instruction, 'J')) {
            const targetLabel = instruction.targetLabel;
            this.handlers[instruction.mnemonic](targetLabel);
        } else if (isFormat(instruction, 'Z')) {
            this.handlers[instruction.mnemonic]();
        }

        switch (mnemonic) {
            case 'NOP':
                this.nop();
                break;
            case 'LIM':
                
                this.lim(register, immediate);
                break;
            case 'ADD':
                break;
        }
    }

    private noOperation() {
        this.state.PC++;
    }

    private loadImmediate(register: number, immediate: number) {
        this.state.registers[register] = immediate;
    }

    private addImmediate(register: number, immediate: number) {
        this.state.registers[register] += immediate;
    }

    public currentInstructionAddress() {
        return this.state.SR << 7 + this.state.PC;
    }
}

export function isFormat<F extends Format>(
    instr: Instruction,
    format: F
  ): instr is Extract<Instruction, { format: F }> {
    return instr.format === format;
  }
  