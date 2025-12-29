import { describe, expect, it } from 'vitest';
import { defaultNoriSimulatorState, defaultNoriSimulatorStateNoProgram, norisimStep, NoriSimulatorState, updateZNF } from './norisim-step';

describe('norisimStep', () => {
  it('should load immediate', () => {
    const code = `lim r1, 5`;
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
    const code = `addi r1, 5`;
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

  describe('add.f', () => {
    it.each([
      {
        name: 'zero result, all flags false except ZF',
        registers: [0, 0, 3, -3, 0, 0, 0, 0],
        expected: {
          ZF: true,
          NF: false,
          CF: false,
          VF: false,
          result: 0,
        },
      },
      {
        name: 'positive result, all flags false',
        registers: [0, 0, 1, 2, 0, 0, 0, 0],
        expected: {
          ZF: false,
          NF: false,
          CF: false,
          VF: false,
          result: 3,
        },
      },
      {
        name: 'negative result, NF true',
        registers: [0, 0, -2, -3, 0, 0, 0, 0],
        expected: {
          ZF: false,
          NF: true,
          CF: true,
          VF: false,
          result: -5,
        },
      },
      {
        name: 'carry out (CF), no overflow',
        registers: [0, 0, 200, 100, 0, 0, 0, 0],
        expected: {
          ZF: false,
          NF: false,
          CF: true,
          VF: false,
          result: 300,
        },
      },
      {
        name: 'overflow to negative (VF), not CF (127 + 2 = 129, signed overflow)',
        registers: [0, 0, 127, 2, 0, 0, 0, 0],
        expected: {
          ZF: false,
          NF: false,
          CF: false,
          VF: true,
          result: 129,
        },
      },
      {
        name: 'overflow to positive (VF), not CF (-128 + -1 = -129)',
        registers: [0, 0, -128, -1, 0, 0, 0, 0],
        expected: {
          ZF: false,
          NF: true,
          CF: true,
          VF: true,
          result: -129,
        },
      },
      {
        name: 'zero with carry (CF+ZF)',
        registers: [0, 0, 256, -256, 0, 0, 0, 0],
        expected: {
          ZF: true,
          NF: false,
          CF: false,
          VF: false,
          result: 0,
        },
      },
    ])('should update ZF/CF/NF/VF correctly: $name', ({ registers, expected }) => {
      const code = `add.f r1, r2, r3`;
      const initialStateMixin: Partial<NoriSimulatorState> = {
        registers,
      };
      const expectedStateMixin: Partial<NoriSimulatorState> = {
        currentAddress: 1,
        cycle: 1,
        registers: [0, expected.result, ...registers.slice(2)],
        ZF: expected.ZF,
        CF: expected.CF,
        NF: expected.NF,
        VF: expected.VF,
      };
      assertCodeStep(code, initialStateMixin, expectedStateMixin);
    });
  });

  it('should add', () => {
    const code = `add r1, r2, r3`;
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
    const code = `sub r1, r2, r3`;
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
    const code = `and r1, r2, r3`;
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

describe('updateZNF', () => {
  it.each([
    [0, true],
    [1, false],
    [-1, false],
  ])('%s should update zero flag to %s', (result, expectedZF) => {
    const state = defaultNoriSimulatorStateNoProgram();
    updateZNF(state, result);
    expect(state.ZF).toBe(expectedZF);
  });

  it.each([
    [0, false],
    [1, false],
    [-1, true],
  ])('%s should update negative flag to %s', (result, expectedNF) => {
    const state = defaultNoriSimulatorStateNoProgram();
    updateZNF(state, result);
    expect(state.NF).toBe(expectedNF);
  });
});

function assertCodeStep(code: string, initialStateMixin: Partial<NoriSimulatorState>, expectedStateMixin: Partial<NoriSimulatorState>) {
  const state = { ...defaultNoriSimulatorState(code), ...initialStateMixin };
  const newState = norisimStep(state);
  expect(newState).toEqual({ ...state, ...expectedStateMixin });
}
