import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PromptState {
  inputPrompt: string;
  isInputEmpty: boolean;
}

const initialState: PromptState = {
  inputPrompt: "",
  isInputEmpty: true,
};

const promptSlice = createSlice({
  name: "prompt",
  initialState,
  reducers: {
    setInputPrompt(state, action: PayloadAction<string>) {
      state.inputPrompt = action.payload;
      state.isInputEmpty = action.payload.trim() === "";
    },
    clearInputPrompt(state) {
      state.inputPrompt = "";
      state.isInputEmpty = true;
    },
    setIsInputEmpty(state, action: PayloadAction<boolean>) {
      state.isInputEmpty = action.payload;
    },
  },
});

export const { setInputPrompt, clearInputPrompt, setIsInputEmpty } = promptSlice.actions;
export default promptSlice.reducer;
