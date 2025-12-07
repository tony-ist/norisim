import { createSlice } from '@reduxjs/toolkit';

interface CodeState {
  sourceCode: string;
  error: string | null;
}

const initialState: CodeState = {
  sourceCode: '',
  error: null,
};

export const codeSlice = createSlice({
  name: 'code',
  initialState,
  reducers: {
    setSourceCode: (state, action) => {
      state.sourceCode = action.payload;
    },
  },
});

export const {
  setSourceCode,
} = codeSlice.actions;

export default codeSlice.reducer;

