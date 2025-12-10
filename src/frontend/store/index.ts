import { configureStore } from '@reduxjs/toolkit';
import simulatorReducer from './slices/simulatorSlice';
import codeReducer from './slices/codeSlice';

export const store = configureStore({
  reducer: {
    simulator: simulatorReducer,
    code: codeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
