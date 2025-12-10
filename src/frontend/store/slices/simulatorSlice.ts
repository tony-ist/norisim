import { createSlice } from '@reduxjs/toolkit';
import { defaultNoriSimulatorState, norisimStep, NoriSimulatorState } from '../../../backend/simulator/norisim-reducers';
import { IR } from '../../../backend/types/asm.types';
import { compileToIR } from '../../../backend/asm/irgen';

interface SimulatorState {
  ir: IR | null
  noriSimulatorState: NoriSimulatorState | null
}

const initialState: SimulatorState = {
  ir: null,
  noriSimulatorState: null,
};

export const simulatorSlice = createSlice({
  name: 'simulator',
  initialState,
  reducers: {
    init: (state, action) => {
      state.ir = compileToIR(action.payload);
      state.noriSimulatorState = defaultNoriSimulatorState();
    },
    step: (state) => {
      if (!state.ir || !state.noriSimulatorState) {
        return state;
      }

      state.noriSimulatorState = norisimStep(state.ir, state.noriSimulatorState);
    },
    reset: (state) => {
      state.ir = null;
      state.noriSimulatorState = null;
    },
  },
});

export const {
  step,
} = simulatorSlice.actions;

export default simulatorSlice.reducer;
