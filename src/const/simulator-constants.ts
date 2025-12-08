export const PMEM_WORD_SIZE_BITS = 16;
export const RAM_WORD_SIZE_BITS = 8;

export const PMEM_ADDRESS_BITS = 11;
export const PMEM_SIZE_BYTES = Math.pow(2, PMEM_ADDRESS_BITS);

export const RAM_ADDRESS_BITS = 8;
export const RAM_SIZE_BYTES = Math.pow(2, RAM_ADDRESS_BITS);

export const STACK_SIZE_BYTES = 64;

export const INPUT_PORTS_COUNT = 8;
export const OUTPUT_PORTS_COUNT = 8;

// Amount of General Purpose Registers
export const GPR_COUNT = 8;

export const PC_BITS = 6;
export const PC_MASK = Math.pow(2, PC_BITS) - 1;
export const SR_BITS = 5;
