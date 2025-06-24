import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { User } from "../../../interfaces";
import { apiRequest } from "../../../utils/apiWrapper/apiRequest";

interface LoginState {
  loading: boolean;
  user?: User;
  error?: string;
  message?: string;
}

const initialState: LoginState = {
  loading: false,
  user: undefined,
  error: undefined,
  message: undefined,
};

interface LoginResponse {
  user: User;
  tokens: {
    access_token: string;
    refresh_token: string;
  };
  message?: string;
}

export const loginUser = createAsyncThunk<
  LoginResponse,
  { email: string; password: string },
  { rejectValue: string }
>("login/loginUser", async (data, { rejectWithValue }) => {
  try {
    const response = await apiRequest("post", "/users/login/", data, false);

    const { data: responseData, message } = response.data;

    return {
      user: responseData.user,
      tokens: responseData.tokens,
      message,
    };
  } catch (error: any) {
    const errData = error.response?.data;
    const errMsg =
      typeof errData?.message === "string"
        ? errData.message
        : "Login failed. Please try again.";
    return rejectWithValue(errMsg);
  }
});

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    clearLoginState(state) {
      state.loading = false;
      state.user = undefined;
      state.error = undefined;
      state.message = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = undefined;
        state.message = undefined;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.message = action.payload.message || "Login successful.";

        localStorage.setItem(
          "jwtAccessToken",
          action.payload.tokens.access_token
        );
        localStorage.setItem(
          "jwtRefreshToken",
          action.payload.tokens.refresh_token
        );
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed.";
      });
  },
});

export const { clearLoginState } = loginSlice.actions;
export default loginSlice.reducer;
