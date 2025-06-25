import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiRequest } from "../../../utils/apiWrapper/apiRequest";

interface ChangePasswordState {
  loading: boolean;
  message?: string;
  error?: string;
}

const initialState: ChangePasswordState = {
  loading: false,
  message: undefined,
  error: undefined,
};

export const requestPasswordReset = createAsyncThunk(
  "user/requestPasswordReset",
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await apiRequest("post", "/user/forgot-password/", { email }, false);
      return response.data.message;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "An error occurred"
      );
    }
  }
);

const changePasswordSlice = createSlice({
  name: "changePassword",
  initialState,
  reducers: {
    clearStatus(state) {
      state.loading = false;
      state.message = undefined;
      state.error = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(requestPasswordReset.pending, (state) => {
        state.loading = true;
        state.error = undefined;
        state.message = undefined;
      })
      .addCase(requestPasswordReset.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload;
      })
      .addCase(requestPasswordReset.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearStatus } = changePasswordSlice.actions;
export default changePasswordSlice.reducer;
