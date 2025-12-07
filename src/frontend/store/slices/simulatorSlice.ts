import { createSlice } from '@reduxjs/toolkit';
import { NoriSimulator } from '../../../backend/simulator/NoriSimulator';
import { defaultNoriSimulatorState, norisimStepReducer, NoriSimulatorState } from '../../../backend/simulator/norisim-reducers';
import { IR } from '../../../backend/types/asm.types';
import { compileToIR } from '../../../backend/asm/irgen';

interface SimulatorState {
  ir: IR | null;
  noriSimulatorState: NoriSimulatorState | null;
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

      state.noriSimulatorState = norisimStepReducer(state.ir, state.noriSimulatorState);
    },
  },
});

export const {
  step,
} = simulatorSlice.actions;

export default simulatorSlice.reducer;

