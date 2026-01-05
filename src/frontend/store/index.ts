import { configureStore } from '@reduxjs/toolkit';
import simulatorReducer from './slices/simulatorSlice';
import codeReducer from './slices/codeSlice';
import screenReducer from './slices/screenSlice';
import { screenMiddleware } from './middleware/screenMiddleware';

export const store = configureStore({
  reducer: {
    simulator: simulatorReducer,
    code: codeReducer,
    screen: screenReducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(screenMiddleware);
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
