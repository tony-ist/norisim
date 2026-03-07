import { GPR_COUNT, INPUT_PORTS_COUNT, OUTPUT_PORTS_COUNT, PC_BITS, PC_MASK, PMEM_SIZE_BYTES, RAM_SIZE_BYTES, SIGN_MASK, SR_BITS, STACK_SIZE_BYTES } from '../../const/simulator-constants';
import { asSignedByte, countBits, isNegative, isSignedByteInBounds, truncateTo8BitUnsigned } from '../../util/asm-util';
import { compileToIR } from '../asm/irgen';
import { IR, Label, Operand, RealInstructionMnemonic } from '../types/asm.types';

export interface NoriSimulatorState {
  ir: IR
  currentAddress: number
  registers: number[]
  ZF: boolean
  CF: boolean
  VF: boolean
  NF: boolean
  PMEM: number[]
  RAM: number[]
  stack: number[]
  inputPorts: number[]
  outputPorts: number[]
  cycle: number
}

export function defaultNoriSimulatorState(code: string): NoriSimulatorState {
  return {
    ir: compileToIR(code),
    currentAddress: 0,
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
    cycle: 0,
  };
}

export function defaultNoriSimulatorStateNoProgram(): NoriSimulatorState {
  return {
    ir: [],
    currentAddress: 0,
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
    cycle: 0,
  };
}

type InstructionHandler = (state: NoriSimulatorState, operands: Operand[]) => void;

const instructionHandlers: Record<RealInstructionMnemonic, InstructionHandler> = {
  NOP: noOperation,
  LIM: loadImmediate,
  ADDI: addImmediate,
  ANDI: andImmediate,
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
  BRC: branch,
  JMP: jump,
  JZ: jumpZero,
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

export function norisimStep(state: NoriSimulatorState) {
  const clonedState = cloneDeep(state) as NoriSimulatorState;
  const instruction = clonedState.ir[clonedState.currentAddress];
  const handler = instructionHandlers[instruction.mnemonic];
  handler(clonedState, instruction.operands);
  clonedState.registers[0] = 0;
  clonedState.cycle++;

  return clonedState;
}

export function norisimSteps(state: NoriSimulatorState, steps: number) {
  let currentState = state;
  for (let i = 0; i < steps; i++) {
    currentState = norisimStep(currentState);
  }
  return currentState;
}

function cloneDeep(state: NoriSimulatorState) {
  return JSON.parse(JSON.stringify(state));
}

function noOperation(state: NoriSimulatorState, operands: Operand[]) {
  state.currentAddress++;
}

function loadImmediate(state: NoriSimulatorState, operands: Operand[]) {
  const register = operands[0].value as number;
  const immediate = operands[1].value as number;
  state.registers[register] = immediate;
  state.currentAddress++;
}

function addImmediate(state: NoriSimulatorState, operands: Operand[]) {
  const register = operands[0].value as number;
  const immediate = operands[1].value as number;
  const operand = state.registers[register];
  const fullResult = operand + immediate;
  const result8bit = asSignedByte(fullResult & 0xFF);
  state.registers[register] = result8bit;

  updateZNFlags(state, result8bit);
  state.CF = (fullResult & 0x100) !== 0;
  state.VF = (((operand ^ result8bit) & (immediate ^ result8bit)) & SIGN_MASK) !== 0;

  state.currentAddress++;
}

function andImmediate(state: NoriSimulatorState, operands: Operand[]) {
  const register = operands[0].value as number;
  const immediate = operands[1].value as number;
  const operand = state.registers[register];
  const result = operand & immediate;
  state.registers[register] = result;

  updateZNFlags(state, result);
  state.CF = false;
  state.VF = false;

  state.currentAddress++;
}

export function updateZNFlags(state: NoriSimulatorState, result: number) {
  state.ZF = result === 0;
  state.NF = isNegative(result);
}

function add(state: NoriSimulatorState, operands: Operand[]) {
  const destinationRegister = operands[0].value as number;
  const srcARegister = operands[1].value as number;
  const srcBRegister = operands[2].value as number;
  const operandA = state.registers[srcARegister];
  const operandB = state.registers[srcBRegister];
  const fullResult = operandA + operandB;
  const result8bit = truncateTo8BitUnsigned(fullResult);
  state.registers[destinationRegister] = result8bit;

  const forceUpdateFlags = state.ir[state.currentAddress].forceUpdateFlags;

  if (forceUpdateFlags) {
    updateZNFlags(state, result8bit);
    state.CF = (fullResult & 0x100) !== 0;
    state.VF = (((operandA ^ result8bit) & (operandB ^ result8bit)) & SIGN_MASK) !== 0;
  }

  state.currentAddress++;
}

function subtract(state: NoriSimulatorState, operands: Operand[]) {
  const destinationRegister = operands[0].value as number;
  const srcARegister = operands[1].value as number;
  const srcBRegister = operands[2].value as number;
  const operandA = state.registers[srcARegister];
  const operandB = state.registers[srcBRegister];
  const fullResult = operandA + truncateTo8BitUnsigned(~operandB) + 1;
  const result8bit = truncateTo8BitUnsigned(fullResult);
  state.registers[destinationRegister] = result8bit;

  const forceUpdateFlags = state.ir[state.currentAddress].forceUpdateFlags;

  if (forceUpdateFlags) {
    updateZNFlags(state, result8bit);
    state.CF = (fullResult & 0x100) !== 0;
    state.VF = (((operandA ^ operandB) & (operandA ^ result8bit)) & SIGN_MASK) !== 0;
  }

  state.currentAddress++;
}

function and(state: NoriSimulatorState, operands: Operand[]) {
  const destinationRegister = operands[0].value as number;
  const srcARegister = operands[1].value as number;
  const srcBRegister = operands[2].value as number;
  const operandA = state.registers[srcARegister];
  const operandB = state.registers[srcBRegister];
  const result = operandA & operandB;
  state.registers[destinationRegister] = result;

  const forceUpdateFlags = state.ir[state.currentAddress].forceUpdateFlags;

  if (forceUpdateFlags) {
    updateZNFlags(state, result);
    state.CF = false;
    state.VF = false;
  }

  state.currentAddress++;
}

function nand(state: NoriSimulatorState, operands: Operand[]) {
  const destinationRegister = operands[0].value as number;
  const srcARegister = operands[1].value as number;
  const srcBRegister = operands[2].value as number;
  const operandA = state.registers[srcARegister];
  const operandB = state.registers[srcBRegister];
  const result = truncateTo8BitUnsigned(~(operandA & operandB));
  state.registers[destinationRegister] = result;

  const forceUpdateFlags = state.ir[state.currentAddress].forceUpdateFlags;

  if (forceUpdateFlags) {
    updateZNFlags(state, result);
    state.CF = false;
    state.VF = false;
  }

  state.currentAddress++;
}

function or(state: NoriSimulatorState, operands: Operand[]) {
  const destinationRegister = operands[0].value as number;
  const srcARegister = operands[1].value as number;
  const srcBRegister = operands[2].value as number;
  const operandA = state.registers[srcARegister];
  const operandB = state.registers[srcBRegister];
  const result = operandA | operandB;
  state.registers[destinationRegister] = result;

  const forceUpdateFlags = state.ir[state.currentAddress].forceUpdateFlags;

  if (forceUpdateFlags) {
    updateZNFlags(state, result);
    state.CF = false;
    state.VF = false;
  }

  state.currentAddress++;
}

function nor(state: NoriSimulatorState, operands: Operand[]) {
  const destinationRegister = operands[0].value as number;
  const srcARegister = operands[1].value as number;
  const srcBRegister = operands[2].value as number;
  const operandA = state.registers[srcARegister];
  const operandB = state.registers[srcBRegister];
  const result = truncateTo8BitUnsigned(~(operandA | operandB));
  state.registers[destinationRegister] = result;

  const forceUpdateFlags = state.ir[state.currentAddress].forceUpdateFlags;

  if (forceUpdateFlags) {
    updateZNFlags(state, result);
    state.CF = false;
    state.VF = false;
  }

  state.currentAddress++;
}

function xor(state: NoriSimulatorState, operands: Operand[]) {
  const destinationRegister = operands[0].value as number;
  const srcARegister = operands[1].value as number;
  const srcBRegister = operands[2].value as number;
  const operandA = state.registers[srcARegister];
  const operandB = state.registers[srcBRegister];
  const result = operandA ^ operandB;
  state.registers[destinationRegister] = result;

  const forceUpdateFlags = state.ir[state.currentAddress].forceUpdateFlags;

  if (forceUpdateFlags) {
    updateZNFlags(state, result);
    state.CF = false;
    state.VF = false;
  }

  state.currentAddress++;
}

function xnor(state: NoriSimulatorState, operands: Operand[]) {
  const destinationRegister = operands[0].value as number;
  const srcARegister = operands[1].value as number;
  const srcBRegister = operands[2].value as number;
  const operandA = state.registers[srcARegister];
  const operandB = state.registers[srcBRegister];
  const result = truncateTo8BitUnsigned(~(operandA ^ operandB));
  state.registers[destinationRegister] = result;

  const forceUpdateFlags = state.ir[state.currentAddress].forceUpdateFlags;

  if (forceUpdateFlags) {
    updateZNFlags(state, result);
    state.CF = false;
    state.VF = false;
  }

  state.currentAddress++;
}

function not(state: NoriSimulatorState, operands: Operand[]) {
  const destinationRegister = operands[0].value as number;
  const srcARegister = operands[1].value as number;
  const operandA = state.registers[srcARegister];
  const result = truncateTo8BitUnsigned(~operandA);
  state.registers[destinationRegister] = result;

  const forceUpdateFlags = state.ir[state.currentAddress].forceUpdateFlags;

  if (forceUpdateFlags) {
    updateZNFlags(state, result);
    state.CF = false;
    state.VF = false;
  }

  state.currentAddress++;
}

function shiftRight(state: NoriSimulatorState, operands: Operand[]) {
  const destinationRegister = operands[0].value as number;
  const srcRegister = operands[1].value as number;
  const operand = state.registers[srcRegister];
  const result = operand >> 1;
  state.registers[destinationRegister] = result;

  const forceUpdateFlags = state.ir[state.currentAddress].forceUpdateFlags;

  if (forceUpdateFlags) {
    updateZNFlags(state, result);
    state.CF = false;
    state.VF = false;
  }

  state.currentAddress++;
}

function move(state: NoriSimulatorState, operands: Operand[]) {
  const destinationRegister = operands[0].value as number;
  const srcRegister = operands[1].value as number;
  state.registers[destinationRegister] = state.registers[srcRegister];
  state.currentAddress++;
}

function jump(state: NoriSimulatorState, operands: Operand[]) {
  validateJumpTarget(operands[0]);

  const label = operands[0] as Label;
  const targetAddress = label.targetAddress as number;
  state.currentAddress = targetAddress;
}

function branch(state: NoriSimulatorState, operands: Operand[]) {
  if (operands[0]?.type !== 'immediate') {
    throw new Error('BRC condition must be an immediate');
  }

  const condition = operands[0].value as number;
  const targetOperand = operands[1];
  if (!targetOperand || targetOperand.type !== 'label') {
    throw new Error('BRC target must be a label');
  }

  switch (condition) {
    case 0:
      jumpZero(state, [targetOperand]);
      return;
    case 1:
      jumpNotZero(state, [targetOperand]);
      return;
    case 2:
      jumpCarry(state, [targetOperand]);
      return;
    case 3:
      jumpNotCarry(state, [targetOperand]);
      return;
    case 4:
      jumpLess(state, [targetOperand]);
      return;
    case 5:
      jumpGreater(state, [targetOperand]);
      return;
    case 6:
      jumpLessEqual(state, [targetOperand]);
      return;
    case 7:
      jumpGreaterEqual(state, [targetOperand]);
      return;
    default:
      throw new Error(`Unknown BRC condition: ${condition}`);
  }
}

function jumpZero(state: NoriSimulatorState, operands: Operand[]) {
  if (!state.ZF) {
    state.currentAddress++;
    return;
  }

  jump(state, operands);
}

function jumpNotZero(state: NoriSimulatorState, operands: Operand[]) {
  if (state.ZF) {
    state.currentAddress++;
    return;
  }

  jump(state, operands);
}

function validateJumpTarget(operand: Operand) {
  if (operand.type !== 'label') {
    throw new Error('Jump target must be a label');
  }

  if (operand.targetAddress === undefined) {
    throw new Error('Jump target address is not set');
  }
}

function jumpCarry(state: NoriSimulatorState, operands: Operand[]) {
  if (!state.CF) {
    state.currentAddress++;
    return;
  }

  jump(state, operands);
}

function jumpNotCarry(state: NoriSimulatorState, operands: Operand[]) {
  if (state.CF) {
    state.currentAddress++;
    return;
  }

  jump(state, operands);
}

function jumpLess(state: NoriSimulatorState, operands: Operand[]) {
  if (state.NF === state.VF) {
    state.currentAddress++;
    return;
  }

  jump(state, operands);
}

function jumpGreater(state: NoriSimulatorState, operands: Operand[]) {
  if (state.ZF || (state.NF !== state.VF)) {
    state.currentAddress++;
    return;
  }

  jump(state, operands);
}

function jumpLessEqual(state: NoriSimulatorState, operands: Operand[]) {
  if (!(state.ZF || (state.NF !== state.VF))) {
    state.currentAddress++;
    return;
  }

  jump(state, operands);
}

function jumpGreaterEqual(state: NoriSimulatorState, operands: Operand[]) {
  if (state.NF !== state.VF) {
    state.currentAddress++;
    return;
  }

  jump(state, operands);
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
  const addressRegister = operands[0].value as number;
  const destinationRegister = operands[1].value as number;
  const address = state.registers[addressRegister];
  const value = state.RAM[address];
  state.registers[destinationRegister] = value;
  state.currentAddress++;
}

function storeToRAM(state: NoriSimulatorState, operands: Operand[]) {
  const destinationAddressRegister = operands[0].value as number;
  const destinationAddress = state.registers[destinationAddressRegister];
  const sourceRegister = operands[1].value as number;
  const sourceValue = state.registers[sourceRegister];
  state.RAM[destinationAddress] = sourceValue;
  state.currentAddress++;
}

function portStore(state: NoriSimulatorState, operands: Operand[]) {
  const register = operands[0].value as number;
  const port = operands[1].value as number;
  state.outputPorts[port] = state.registers[register];
  state.currentAddress++;
}

function portLoad(state: NoriSimulatorState, operands: Operand[]) {
  const register = operands[0].value as number;
  const port = operands[1].value as number;
  state.registers[register] = state.inputPorts[port];
  state.currentAddress++;
}

function halt(state: NoriSimulatorState, operands: Operand[]) {}

function pcFromAddress(address: number) {
  if (countBits(address) > PC_BITS + SR_BITS) {
    throw new Error(`Address '${address}' does not fit in ${PC_BITS + SR_BITS} bits.`);
  }
  return address & PC_MASK;
}

function srFromAddress(address: number) {
  return address >> PC_BITS;
}

function getPC(state: NoriSimulatorState) {
  return state.currentAddress & PC_MASK;
}

function getSR(state: NoriSimulatorState) {
  return state.currentAddress >> PC_BITS;
}
