import { createSlice } from '@reduxjs/toolkit';
import { NoriSimulator, NoriSimulatorState } from '../../../backend/simulator/NoriSimulator';

interface SimulatorState {
  noriSimulatorState: NoriSimulatorState | null;
}

const initialState: SimulatorState = {
  noriSimulatorState: null,
};

export const simulatorSlice = createSlice({
  name: 'simulator',
  initialState,
  reducers: {
    init: (state, action) => {
      state.noriSimulatorState = new NoriSimulator(action.payload).getState();
    },
    step: (state) => {
      state.noriSimulatorState?.step();
    },
  },
});

export const {
  step,
} = simulatorSlice.actions;

export default simulatorSlice.reducer;

