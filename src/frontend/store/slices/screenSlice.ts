import { createSlice } from '@reduxjs/toolkit';

const SCREEN_SIZE = 32;

const OPCODE_WRITE_PIXEL = 0;
const OPCODE_CLEAR_PIXEL = 1;
const OPCODE_DRAW_BUFFER = 2;
const OPCODE_CLEAR_BUFFER = 3;

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

      console.log(`state.pendingHighByte: ${state.pendingHighByte}, byteValue: ${byteValue}`);
      const command = (state.pendingHighByte << 8) | byteValue;
      const opcode = command >>> 10;
      const y = (command >>> 5) & 0b11111;
      const x = command & 0b11111;

      console.log(`command: ${command} (0b${command.toString(2).padStart(16, '0')}), opcode: ${opcode}, y: ${y}, x: ${x}`);

      state.pendingHighByte = null;

      switch (opcode) {
        case OPCODE_WRITE_PIXEL: {
          // TODO: Implement warnings if conditions are not met
          if (x >= 0 && x < SCREEN_SIZE && y >= 0 && y < SCREEN_SIZE) {
            const newBuffer = state.buffer.map(row => [...row]);
            newBuffer[y][x] = true;
            state.buffer = newBuffer;
          }
          break;
        }
        case OPCODE_CLEAR_PIXEL: {
          if (x >= 0 && x < SCREEN_SIZE && y >= 0 && y < SCREEN_SIZE) {
            const newBuffer = state.buffer.map(row => [...row]);
            newBuffer[y][x] = false;
            state.buffer = newBuffer;
          }
          break;
        }
        case OPCODE_DRAW_BUFFER:
          state.display = state.buffer.map(row => [...row]);
          break;
        case OPCODE_CLEAR_BUFFER:
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
