import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { User } from "../../../interfaces";
import { apiRequest } from "../../../utils/apiWrapper/apiRequest";

interface RegisterState {
  loading: boolean;
  user?: User;
  error?: string;
  message?: string;
}

const initialState: RegisterState = {
  loading: false,
  user: undefined,
  error: undefined,
  message: undefined,
};

interface RegisterResponse {
  user: User;
  tokens: {
    access_token: string;
    refresh_token: string;
  };
  message?: string;
}

export const registerUser = createAsyncThunk<
  RegisterResponse,
  any,
  { rejectValue: string }
>("register/registerUser", async (data, { rejectWithValue }) => {
  try {
    const response = await apiRequest("post", "/users/register/", data, false);

    const { data: responseData, message } = response.data;

    return {
      user: responseData.user,
      tokens: responseData.tokens,
      message,
    };
  } catch (error: any) {
    let errMsg = "An unexpected error occurred.";
    const data = error.response?.data;

    if (data) {
      if (typeof data === "string") {
        errMsg = data;
      } else if (Array.isArray(data)) {
        errMsg = data.join(" ");
      } else if (typeof data === "object") {
        if (data.message) {
          errMsg = data.message;
        } else {
          errMsg = Object.values(data).flat().join(" ");
        }
      }
    }

    return rejectWithValue(errMsg);
  }
});

const registerSlice = createSlice({
  name: "register",
  initialState,
  reducers: {
    clearRegisterState(state) {
      state.loading = false;
      state.user = undefined;
      state.error = undefined;
      state.message = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = undefined;
        state.message = undefined;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.message = action.payload.message || "Registration successful";

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
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Registration failed.";
      });
  },
});

export const { clearRegisterState } = registerSlice.actions;
export default registerSlice.reducer;
