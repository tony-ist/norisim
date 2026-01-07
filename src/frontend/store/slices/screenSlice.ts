import { createSlice } from '@reduxjs/toolkit';
import { SCREEN_OPCODES, SCREEN_SIZE } from '../../../const/screen-constants';

function createEmptyPixelGrid(): boolean[][] {
  return Array.from({ length: SCREEN_SIZE }, () => Array(SCREEN_SIZE).fill(false));
}

interface ScreenState {
  buffer: boolean[][]
  display: boolean[][]
  pendingHighByte: number | null
}

const initialState: ScreenState = {
  buffer: createEmptyPixelGrid(),
  display: createEmptyPixelGrid(),
  pendingHighByte: null,
};

export const screenSlice = createSlice({
  name: 'screen',
  initialState,
  reducers: {
    execute: (state, action) => {
      const byteValue = action.payload as number & 0xFF;

      if (state.pendingHighByte === null) {
        state.pendingHighByte = byteValue;
        return state;
      }

      const command = (state.pendingHighByte << 8) | byteValue;
      const opcode = command >>> 10;
      const y = (command >>> 5) & 0b11111;
      const x = command & 0b11111;

      state.pendingHighByte = null;

      switch (opcode) {
        case SCREEN_OPCODES.WRITE_PIXEL: {
          // TODO: Implement warnings if conditions are not met
          if (x >= 0 && x < SCREEN_SIZE && y >= 0 && y < SCREEN_SIZE) {
            const newBuffer = state.buffer.map(row => [...row]);
            newBuffer[y][x] = true;
            state.buffer = newBuffer;
          }
          break;
        }
        case SCREEN_OPCODES.CLEAR_PIXEL: {
          if (x >= 0 && x < SCREEN_SIZE && y >= 0 && y < SCREEN_SIZE) {
            const newBuffer = state.buffer.map(row => [...row]);
            newBuffer[y][x] = false;
            state.buffer = newBuffer;
          }
          break;
        }
        case SCREEN_OPCODES.DRAW_BUFFER:
          state.display = state.buffer.map(row => [...row]);
          break;
        case SCREEN_OPCODES.CLEAR_BUFFER:
          state.buffer = createEmptyPixelGrid();
          state.display = createEmptyPixelGrid();
          break;
        default:
          break;
      }
    },
    reset: () => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder.addCase('simulator/init', (state) => {
      state.buffer = createEmptyPixelGrid();
      state.display = createEmptyPixelGrid();
      state.pendingHighByte = null;
    });
  },
});

export const {
  execute,
  reset,
} = screenSlice.actions;

export default screenSlice.reducer;
