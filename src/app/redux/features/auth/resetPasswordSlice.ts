import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiRequest } from "../../../utils/apiWrapper/apiRequest";

interface ResetPasswordState {
  loading: boolean;
  message?: string;
  error?: string;
}

const initialState: ResetPasswordState = {
  loading: false,
  message: undefined,
  error: undefined,
};

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (
    {
      uidb64,
      token,
      new_password,
      confirm_new_password,
    }: {
      uidb64: string;
      token: string;
      new_password: string;
      confirm_new_password: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiRequest(
        "post",
        "/users/reset-password/",
        { uidb64, token, new_password, confirm_new_password },
        false
      );
      return response.data.message;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Reset failed. Try again."
      );
    }
  }
);

const resetPasswordSlice = createSlice({
  name: "resetPassword",
  initialState,
  reducers: {
    clearResetState(state) {
      state.loading = false;
      state.message = undefined;
      state.error = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearResetState } = resetPasswordSlice.actions;
export default resetPasswordSlice.reducer;
