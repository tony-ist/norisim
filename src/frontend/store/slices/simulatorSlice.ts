import { createSlice } from '@reduxjs/toolkit';
import { defaultNoriSimulatorState, defaultNoriSimulatorStateNoProgram, norisimStep, NoriSimulatorState } from '../../../backend/simulator/norisim-step';

interface SimulatorState {
  noriSimulatorState: NoriSimulatorState | null
  error: string | null
  errorStack: string | null
}

const initialState: SimulatorState = {
  noriSimulatorState: null,
  error: null,
  errorStack: null,
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
    step: (state) => {
      if (!state.noriSimulatorState) {
        return state;
      }

      try {
        state.noriSimulatorState = norisimStep(state.noriSimulatorState);
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
