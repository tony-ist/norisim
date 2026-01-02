import { createSlice } from '@reduxjs/toolkit';
import { defaultNoriSimulatorState, norisimStep, NoriSimulatorState } from '../../../backend/simulator/norisim-step';

interface SimulatorState {
  noriSimulatorState: NoriSimulatorState | null
  error: string | null
  errorStack: string | null
  isWaitingPortInput: boolean
  isRunning: boolean
}

const initialState: SimulatorState = {
  noriSimulatorState: null,
  error: null,
  errorStack: null,
  isWaitingPortInput: false,
  isRunning: false,
};

export const simulatorSlice = createSlice({
  name: 'simulator',
  initialState,
  reducers: {
    init: (state, action) => {
      try {
        const code = action.payload as string;
        state.noriSimulatorState = defaultNoriSimulatorState(code);
        state.error = null;
        state.errorStack = null;
      }
      catch (error) {
        if (error instanceof Error) {
          state.error = error.message ?? null;
          state.errorStack = error.stack ?? null;
        }
        else {
          state.error = 'Unknown error';
        }
      }
    },
    run: (state) => {
      state.isRunning = true;
    },
    stop: (state) => {
      state.isRunning = false;
    },
    step: (state) => {
      if (!state.noriSimulatorState) {
        return state;
      }

      try {
        state.noriSimulatorState = norisimStep(state.noriSimulatorState);
        const instruction = state.noriSimulatorState.ir[state.noriSimulatorState.currentAddress];

        if (instruction.mnemonic === 'PLD') {
          state.isWaitingPortInput = true;
        }
      }
      catch (error) {
        if (error instanceof Error) {
          state.error = error.message ?? null;
          state.errorStack = error.stack ?? null;
        }
        else {
          state.error = 'Unknown error';
        }
      }
    },
    portInput: (state, action) => {
      if (!state.noriSimulatorState) {
        return;
      }

      try {
        const instruction = state.noriSimulatorState.ir[state.noriSimulatorState.currentAddress];

        if (instruction.mnemonic !== 'PLD') {
          return;
        }

        const port = instruction.operands[0].value as number;
        const inputValue = action.payload as number;

        state.noriSimulatorState.inputPorts[port] = inputValue;
        state.isWaitingPortInput = false;
      }
      catch (error) {
        if (error instanceof Error) {
          state.error = error.message ?? null;
          state.errorStack = error.stack ?? null;
        }
        else {
          state.error = 'Unknown error';
        }
      }
    },
    reset: (state) => {
      state.noriSimulatorState = null;
      state.error = null;
      state.errorStack = null;
    },
  },
});

export const {
  step,
} = simulatorSlice.actions;

export default simulatorSlice.reducer;
