import { describe, expect, it } from 'vitest';
import { defaultNoriSimulatorState, norisimStep, NoriSimulatorState } from './norisim-reducers';
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
});

function assertCodeStep(code: string, initialStateMixin: Partial<NoriSimulatorState>, expectedStateMixin: Partial<NoriSimulatorState>) {
  const ir = compileToIR(code);
  const state = { ...defaultNoriSimulatorState(), ...initialStateMixin };
  const newState = norisimStep(ir, state);
  expect(newState).toEqual({ ...state, ...expectedStateMixin });
}
