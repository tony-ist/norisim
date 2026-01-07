import type { Middleware } from '@reduxjs/toolkit';
import { execute } from '../slices/screenSlice';
import { SCREEN_OUTPUT_PORT } from '../../../const/screen-constants';

export const screenMiddleware: Middleware = store => next => (action) => {
  if (!action || typeof action !== 'object' || !('type' in action) || action.type !== 'simulator/step') {
    return next(action);
  }

  const stateBefore = store.getState();
  const noriStateBefore = stateBefore.simulator.noriSimulatorState;

  if (!noriStateBefore || noriStateBefore.currentAddress >= noriStateBefore.ir.length) {
    return next(action);
  }

  const instruction = noriStateBefore.ir[noriStateBefore.currentAddress];

  if (instruction.mnemonic !== 'PST' || instruction.operands[1]?.type !== 'immediate') {
    return next(action);
  }

  const port = instruction.operands[1].value as number;

  if (port !== SCREEN_OUTPUT_PORT) {
    return next(action);
  }

  const result = next(action);

  const stateAfter = store.getState();
  const noriStateAfter = stateAfter.simulator.noriSimulatorState;

  if (noriStateAfter) {
    const byteValue = noriStateAfter.outputPorts[SCREEN_OUTPUT_PORT];
    store.dispatch(execute(byteValue));
  }

  return result;
};
