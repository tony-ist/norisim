import { describe, expect, it } from 'vitest';
import { defaultNoriSimulatorState, defaultNoriSimulatorStateNoProgram, norisimSteps, NoriSimulatorState, updateZNF } from './norisim-step';

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
        name: 'zero result, ZF and CF true',
        registers: [0, 0, 3, 253, 0, 0, 0, 0],
        expected: {
          ZF: true,
          NF: false,
          CF: true,
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
        name: 'negative result, NF and CF true',
        registers: [0, 0, 254, 253, 0, 0, 0, 0],
        expected: {
          ZF: false,
          NF: true,
          CF: true,
          VF: false,
          result: 251,
        },
      },
      {
        name: 'carry and overflow to negative (CF+VF)',
        registers: [0, 0, 100, 100, 0, 0, 0, 0],
        expected: {
          ZF: false,
          NF: true,
          CF: false,
          VF: true,
          result: 200,
        },
      },
      {
        name: 'overflow to negative (VF), no carry (127 + 2 = 129)',
        registers: [0, 0, 127, 2, 0, 0, 0, 0],
        expected: {
          ZF: false,
          NF: true,
          CF: false,
          VF: true,
          result: 129,
        },
      },
      {
        name: 'overflow to positive (VF), with carry (-128 + -1 = -129)',
        registers: [0, 0, 128, 255, 0, 0, 0, 0],
        expected: {
          ZF: false,
          NF: false,
          CF: true,
          VF: true,
          result: 127,
        },
      },
      {
        name: 'zero with carry and overflow (CF+VF+ZF)',
        registers: [0, 0, 128, 128, 0, 0, 0, 0],
        expected: {
          ZF: true,
          NF: false,
          CF: true,
          VF: true,
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

  describe('subtraction', () => {
    it('should subtract', () => {
      const code = `sub r1, r2, r3`;
      const initialStateMixin: Partial<NoriSimulatorState> = {
        registers: [0, 0, 1, 2, 0, 0, 0, 0],
      };
      const expectedStateMixin: Partial<NoriSimulatorState> = {
        currentAddress: 1,
        cycle: 1,
        registers: [0, 255, 1, 2, 0, 0, 0, 0],
      };
      assertCodeStep(code, initialStateMixin, expectedStateMixin);
    });

    it('should update flags', () => {
      const code = `sub.f r1, r2, r3`;
      const initialStateMixin: Partial<NoriSimulatorState> = {
        registers: [0, 0, 0x2A, 0x30, 0, 0, 0, 0],
      };
      const expectedStateMixin: Partial<NoriSimulatorState> = {
        CF: false,
        NF: true,
        currentAddress: 1,
        cycle: 1,
        registers: [0, 250, 0x2A, 0x30, 0, 0, 0, 0],
      };
      assertCodeStep(code, initialStateMixin, expectedStateMixin);
    });
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

  it('should bitwise nand', () => {
    const code = `nand r1, r2, r3`;
    const initialStateMixin: Partial<NoriSimulatorState> = {
      registers: [0, 0, 3, 5, 0, 0, 0, 0],
    };
    const expectedStateMixin: Partial<NoriSimulatorState> = {
      currentAddress: 1,
      cycle: 1,
      registers: [0, 254, 3, 5, 0, 0, 0, 0],
    };
    assertCodeStep(code, initialStateMixin, expectedStateMixin);
  });

  it('should bitwise or', () => {
    const code = `or r1, r2, r3`;
    const initialStateMixin: Partial<NoriSimulatorState> = {
      registers: [0, 0, 3, 5, 0, 0, 0, 0],
    };
    const expectedStateMixin: Partial<NoriSimulatorState> = {
      currentAddress: 1,
      cycle: 1,
      registers: [0, 7, 3, 5, 0, 0, 0, 0],
    };
    assertCodeStep(code, initialStateMixin, expectedStateMixin);
  });

  it('should bitwise nor', () => {
    const code = `nor r1, r2, r3`;
    const initialStateMixin: Partial<NoriSimulatorState> = {
      registers: [0, 0, 3, 5, 0, 0, 0, 0],
    };
    const expectedStateMixin: Partial<NoriSimulatorState> = {
      currentAddress: 1,
      cycle: 1,
      registers: [0, 248, 3, 5, 0, 0, 0, 0],
    };
    assertCodeStep(code, initialStateMixin, expectedStateMixin);
  });

  it('should bitwise xor', () => {
    const code = `xor r1, r2, r3`;
    const initialStateMixin: Partial<NoriSimulatorState> = {
      registers: [0, 0, 3, 5, 0, 0, 0, 0],
    };
    const expectedStateMixin: Partial<NoriSimulatorState> = {
      currentAddress: 1,
      cycle: 1,
      registers: [0, 6, 3, 5, 0, 0, 0, 0],
    };
    assertCodeStep(code, initialStateMixin, expectedStateMixin);
  });

  it('should bitwise xnor', () => {
    const code = `xnor r1, r2, r3`;
    const initialStateMixin: Partial<NoriSimulatorState> = {
      registers: [0, 0, 3, 5, 0, 0, 0, 0],
    };
    const expectedStateMixin: Partial<NoriSimulatorState> = {
      currentAddress: 1,
      cycle: 1,
      registers: [0, 249, 3, 5, 0, 0, 0, 0],
    };
    assertCodeStep(code, initialStateMixin, expectedStateMixin);
  });

  it('should bitwise not', () => {
    const code = `not r1, r2`;
    const initialStateMixin: Partial<NoriSimulatorState> = {
      registers: [0, 0, 3, 0, 0, 0, 0, 0],
    };
    const expectedStateMixin: Partial<NoriSimulatorState> = {
      currentAddress: 1,
      cycle: 1,
      registers: [0, 252, 3, 0, 0, 0, 0, 0],
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

  describe('JG', () => {
    it('should not jg when result is negative (254 - 0 = 254)', () => {
      const code = `
        lim r1, 127
        add r1, r1, r1
        sub.f r0, r1, r0
        jg .label1
        nop
        .label1 nop
      `;

      const initialStateMixin: Partial<NoriSimulatorState> = {
        registers: [0, 0, 0, 0, 0, 0, 0, 0],
      };
      const expectedStateMixin: Partial<NoriSimulatorState> = {
        currentAddress: 4,
        cycle: 4,
        registers: [0, 254, 0, 0, 0, 0, 0, 0],
        NF: true,
        ZF: false,
        CF: true,
        VF: false,
      };
      assertCodeNSteps(code, initialStateMixin, expectedStateMixin, 4);
    });

    it('should jg when result is positive (4 - 3 = 1)', () => {
      const code = `
        sub.f r0, r1, r2
        jg .label1
        nop
        .label1 nop
      `;

      const initialStateMixin: Partial<NoriSimulatorState> = {
        registers: [0, 4, 3, 0, 0, 0, 0, 0],
      };
      const expectedStateMixin: Partial<NoriSimulatorState> = {
        CF: true,
        currentAddress: 3,
        cycle: 2,
      };
      assertCodeDoubleStep(code, initialStateMixin, expectedStateMixin);
    });
  });

  describe('JGE', () => {
    it('should not jge when result is negative (2 - 3 = 253)', () => {
      const code = `
        sub.f r0, r1, r2
        jge .label1
        nop
        .label1 nop
      `;

      const initialStateMixin: Partial<NoriSimulatorState> = {
        registers: [0, 2, 3, 0, 0, 0, 0, 0],
      };
      const expectedStateMixin: Partial<NoriSimulatorState> = {
        NF: true,
        currentAddress: 2,
        cycle: 2,
      };
      assertCodeDoubleStep(code, initialStateMixin, expectedStateMixin);
    });

    it('should jge when result is zero (3 - 3 = 0)', () => {
      const code = `
        sub.f r0, r1, r2
        jge .label1
        nop
        .label1 nop
      `;

      const initialStateMixin: Partial<NoriSimulatorState> = {
        registers: [0, 3, 3, 0, 0, 0, 0, 0],
      };
      const expectedStateMixin: Partial<NoriSimulatorState> = {
        CF: true,
        ZF: true,
        currentAddress: 3,
        cycle: 2,
      };
      assertCodeDoubleStep(code, initialStateMixin, expectedStateMixin);
    });

    it('should jge when result is positive (4 - 3 = 1)', () => {
      const code = `
        sub.f r0, r1, r2
        jge .label1
        nop
        .label1 nop
      `;

      const initialStateMixin: Partial<NoriSimulatorState> = {
        registers: [0, 4, 3, 0, 0, 0, 0, 0],
      };
      const expectedStateMixin: Partial<NoriSimulatorState> = {
        CF: true,
        currentAddress: 3,
        cycle: 2,
      };
      assertCodeDoubleStep(code, initialStateMixin, expectedStateMixin);
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

function assertCodeNSteps(code: string, initialStateMixin: Partial<NoriSimulatorState>, expectedStateMixin: Partial<NoriSimulatorState>, n: number) {
  const state = { ...defaultNoriSimulatorState(code), ...initialStateMixin };
  const newState = norisimSteps(state, n);
  expect(newState).toEqual({ ...state, ...expectedStateMixin });
}

function assertCodeStep(code: string, initialStateMixin: Partial<NoriSimulatorState>, expectedStateMixin: Partial<NoriSimulatorState>) {
  assertCodeNSteps(code, initialStateMixin, expectedStateMixin, 1);
}

function assertCodeDoubleStep(code: string, initialStateMixin: Partial<NoriSimulatorState>, expectedStateMixin: Partial<NoriSimulatorState>) {
  assertCodeNSteps(code, initialStateMixin, expectedStateMixin, 2);
}
