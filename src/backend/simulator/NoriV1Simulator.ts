import { GPR_COUNT, INPUT_PORTS_COUNT, OUTPUT_PORTS_COUNT, PMEM_SIZE_BYTES, RAM_SIZE_BYTES, STACK_SIZE_BYTES } from "../../const/simulator-constants";
import { compileToIR } from "../asm/irgen";
import { Format, Instruction, InstructionMnemonic, IR } from "../types/asm.types";

export interface NoriV1SimulatorState {
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

export function defaultNoriV1SimulatorState(): NoriV1SimulatorState {
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

export class NoriV1Simulator {
    private readonly state: NoriV1SimulatorState;
    private readonly ir: IR;
    private readonly handlers: Record<InstructionMnemonic, (...args: any) => void> = {
        NOP: this.noOperation.bind(this),
        LIM: this.loadImmediate.bind(this),
        ADD: this.add.bind(this),
        ADDI: this.addImmediate.bind(this),
        SUB: this.subtract.bind(this),
        AND: this.and.bind(this),
        NAND: this.nand.bind(this),
        OR: this.or.bind(this),
        NOR: this.nor.bind(this),
        XOR: this.xor.bind(this),
        XNOR: this.xnor.bind(this),
        NOT: this.not.bind(this),
        SHR: this.shiftRight.bind(this),
        MOV: this.move.bind(this),
        JMP: this.jump.bind(this),
        JZ: this.jumpZero.bind(this),
        JNZ: this.jumpNotZero.bind(this),
        JC: this.jumpCarry.bind(this),
        JNC: this.jumpNotCarry.bind(this),
        JL: this.jumpLess.bind(this),
        JG: this.jumpGreater.bind(this),
        JLE: this.jumpLessEqual.bind(this),
        JGE: this.jumpGreaterEqual.bind(this),
        CAL: this.call.bind(this),
        RET: this.return.bind(this),
        PSH: this.push.bind(this),
        POP: this.pop.bind(this),
        MLD: this.loadFromRAM.bind(this),
        MST: this.storeToRAM.bind(this),
        PST: this.portStore.bind(this),
        PLD: this.portLoad.bind(this),
        HLT: this.halt.bind(this),
    };

    constructor(private readonly code: string) {
        this.ir = compileToIR(code);
        this.state = defaultNoriV1SimulatorState();
    }

    public run() {
        // TODO: Implement
    }

    public step() {
        const instruction = this.ir[this.currentInstructionAddress()];
        const mnemonic = instruction.mnemonic;
        
        
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

    private add(dest: number, srcA: number, srcB: number, updateFlags: boolean) {
        throw new Error('Not implemented');
    }

    private subtract(dest: number, srcA: number, srcB: number, updateFlags: boolean) {
        throw new Error('Not implemented');
    }

    private and(dest: number, srcA: number, srcB: number, updateFlags: boolean) {
        throw new Error('Not implemented');
    }

    private nand(dest: number, srcA: number, srcB: number, updateFlags: boolean) {
        throw new Error('Not implemented');
    }

    private or(dest: number, srcA: number, srcB: number, updateFlags: boolean) {
        throw new Error('Not implemented');
    }

    private nor(dest: number, srcA: number, srcB: number, updateFlags: boolean) {
        throw new Error('Not implemented');
    }

    private xor(dest: number, srcA: number, srcB: number, updateFlags: boolean) {
        throw new Error('Not implemented');
    }

    private xnor(dest: number, srcA: number, srcB: number, updateFlags: boolean) {
        throw new Error('Not implemented');
    }

    private not(dest: number, srcA: number, updateFlags: boolean) {
        throw new Error('Not implemented');
    }

    private shiftRight(dest: number, srcA: number, updateFlags: boolean) {
        throw new Error('Not implemented');
    }

    private move(dest: number, srcA: number, updateFlags: boolean) {
        throw new Error('Not implemented');
    }

    private jump(target: number) {
        throw new Error('Not implemented');
    }

    private jumpZero(target: number) {
        throw new Error('Not implemented');
    }


    private jumpNotZero(target: number) {
        throw new Error('Not implemented');
    }

    private jumpCarry(target: number) {
        throw new Error('Not implemented');
    }

    private jumpNotCarry(target: number) {
        throw new Error('Not implemented');
    }

    private jumpLess(target: number) {
        throw new Error('Not implemented');
    }

    private jumpGreater(target: number) {
        throw new Error('Not implemented');
    }

    private jumpLessEqual(target: number) {
        throw new Error('Not implemented');
    }

    private jumpGreaterEqual(target: number) {
        throw new Error('Not implemented');
    }

    private call(target: number) {
        throw new Error('Not implemented');
    }

    private return() {
        throw new Error('Not implemented');
    }

    private push(value: number) {
        throw new Error('Not implemented');
    }

    private pop(dest: number) {
        throw new Error('Not implemented');
    }

    private loadFromRAM(dest: number, address: number) {
        throw new Error('Not implemented');
    }

    private storeToRAM(src: number, address: number) {
        throw new Error('Not implemented');
    }

    private portStore(port: number, value: number) {
        throw new Error('Not implemented');
    }

    private portLoad(port: number) {
        throw new Error('Not implemented');
    }

    private halt() {
        throw new Error('Not implemented');
    }

    public currentInstructionAddress() {
        return this.state.SR << 7 + this.state.PC;
    }

    public getState() {
        return this.state;
    }
}

export function isFormat<F extends Format>(
    instr: Instruction,
    format: F
  ): instr is Extract<Instruction, { format: F }> {
    return instr.format === format;
  }
  