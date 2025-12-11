import { describe, expect, it } from 'vitest';
import { defaultNoriSimulatorState, norisimStep, NoriSimulatorState, updateZNF } from './norisim-step';
import { compileToIR } from '../asm/irgen';

describe('norisimStep', () => {
  it('should load immediate', () => {
    const code = `
            lim r1, 5
        `;
    const initialStateMixin: Partial<NoriSimulatorState> = {
      registers: [0, 1, 0, 0, 0, 0, 0, 0],
    };
    const expectedStateMixin: Partial<NoriSimulatorState> = {
      currentAddress: 1,
      cycle: 1,
      registers: [0, 5, 0, 0, 0, 0, 0, 0],
    };
    assertCodeStep(code, initialStateMixin, expectedStateMixin);
  });

  it('should add immediate', () => {
    const code = `
            addi r1, 5
        `;
    const initialStateMixin: Partial<NoriSimulatorState> = {
      registers: [0, 1, 0, 0, 0, 0, 0, 0],
    };
    const expectedStateMixin: Partial<NoriSimulatorState> = {
      currentAddress: 1,
      cycle: 1,
      registers: [0, 6, 0, 0, 0, 0, 0, 0],
    };
    assertCodeStep(code, initialStateMixin, expectedStateMixin);
  });

  it('should add', () => {
    const code = `
            add r1, r2, r3
        `;
    const initialStateMixin: Partial<NoriSimulatorState> = {
      registers: [0, 0, 1, 2, 0, 0, 0, 0],
    };
    const expectedStateMixin: Partial<NoriSimulatorState> = {
      currentAddress: 1,
      cycle: 1,
      registers: [0, 3, 1, 2, 0, 0, 0, 0],
    };
    assertCodeStep(code, initialStateMixin, expectedStateMixin);
  });

  it('should subtract', () => {
    const code = `
            sub r1, r2, r3
        `;
    const initialStateMixin: Partial<NoriSimulatorState> = {
      registers: [0, 0, 1, 2, 0, 0, 0, 0],
    };
    const expectedStateMixin: Partial<NoriSimulatorState> = {
      currentAddress: 1,
      cycle: 1,
      registers: [0, -1, 1, 2, 0, 0, 0, 0],
    };
    assertCodeStep(code, initialStateMixin, expectedStateMixin);
  });

  it('should bitwise and', () => {
    const code = `
      and r1, r2, r3
    `;
    const initialStateMixin: Partial<NoriSimulatorState> = {
      registers: [0, 0, 3, 5, 0, 0, 0, 0],
    };
    const expectedStateMixin: Partial<NoriSimulatorState> = {
      currentAddress: 1,
      cycle: 1,
      registers: [0, 1, 3, 5, 0, 0, 0, 0],
    };
    assertCodeStep(code, initialStateMixin, expectedStateMixin);
  });

  it('should jump', () => {
    const code = `
            jmp .label1
            nop
            .label1
            nop
        `;
    const initialStateMixin: Partial<NoriSimulatorState> = {
    };
    const expectedStateMixin: Partial<NoriSimulatorState> = {
      currentAddress: 2,
      cycle: 1,
    };
    assertCodeStep(code, initialStateMixin, expectedStateMixin);
  });

  describe('JZ', () => {
    it('should jump if ZF is true', () => {
      const code = `
        jz .label1
        nop
        .label1 nop
      `;

      const initialStateMixin: Partial<NoriSimulatorState> = {
        ZF: true,
      };
      const expectedStateMixin: Partial<NoriSimulatorState> = {
        currentAddress: 2,
        cycle: 1,
      };
      assertCodeStep(code, initialStateMixin, expectedStateMixin);
    });

    it('should not jump if ZF is false', () => {
      const code = `
        jz .label1
        nop
        .label1 nop
      `;
      const initialStateMixin: Partial<NoriSimulatorState> = {
        ZF: false,
      };
      const expectedStateMixin: Partial<NoriSimulatorState> = {
        currentAddress: 1,
        cycle: 1,
      };
      assertCodeStep(code, initialStateMixin, expectedStateMixin);
    });
  });
});

describe('updateFlags', () => {
  it.each([
    [0, true],
    [1, false],
    [-1, false],
  ])('%s should update zero flag to %s', (result, expectedZF) => {
    const state = defaultNoriSimulatorState();
    updateZNF(state, result);
    expect(state.ZF).toBe(expectedZF);
  });

  it.each([
    [0, false],
    [1, false],
    [-1, true],
  ])('%s should update negative flag to %s', (result, expectedNF) => {
    const state = defaultNoriSimulatorState();
    updateZNF(state, result);
    expect(state.NF).toBe(expectedNF);
  });

  it.each([
    [0, false],
    [1, true],
    [-1, true],
  ])('%s should update carry flag to %s', (result, expectedCF) => {
    const state = defaultNoriSimulatorState();
    updateZNF(state, result);
    expect(state.CF).toBe(expectedCF);
  });

  it('should update carry flag', () => {
    const state = defaultNoriSimulatorState();
    updateZNF(state, 256);
    expect(state.CF).toBe(true);
  });

  it.each([
    [256, true],
    [-42, true],
    [128, true],
  ])('%s should update overflow flag to %s', (result, expectedVF) => {
    const state = defaultNoriSimulatorState();
    updateZNF(state, result);
    expect(state.VF).toBe(expectedVF);
  });
});

function assertCodeStep(code: string, initialStateMixin: Partial<NoriSimulatorState>, expectedStateMixin: Partial<NoriSimulatorState>) {
  const ir = compileToIR(code);
  const state = { ...defaultNoriSimulatorState(), ...initialStateMixin };
  const newState = norisimStep(ir, state);
  expect(newState).toEqual({ ...state, ...expectedStateMixin });
}
