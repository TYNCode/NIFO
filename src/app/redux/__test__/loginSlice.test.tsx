import { configureStore } from "@reduxjs/toolkit";
import loginReducer, { clearLoginState, loginUser } from "../features/auth/loginSlice"; // Adjust the path if necessary
import { User } from "../../interfaces"; // Your User type
import axios from "axios";

// Mocking axios for API requests
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock localStorage
beforeEach(() => {
  // Mock the setItem method of localStorage
  Storage.prototype.setItem = jest.fn();
});


describe("loginSlice", () => {
  // Test initial state
  test("should return the initial state", () => {
    const initialState = {
      loading: false,
      user: undefined,
      error: undefined,
      message: undefined,
    };

    expect(loginReducer(undefined, { type: "unknown" })).toEqual(initialState);
  });

  // Test clearLoginState reducer
  test("should clear login state", () => {
    const previousState = {
      loading: false,
      user: { email: "user@example.com", first_name: "user" },
      error: "Error",
      message: "Success",
    };
    expect(loginReducer(previousState, clearLoginState())).toEqual({
      loading: false,
      user: undefined,
      error: undefined,
      message: undefined,
    });
  });

  // Test loginUser async thunk (fulfilled)
  test("should handle loginUser.fulfilled", async () => {
    const user: User = { email: "user@example.com", first_name: "user" };
    const responseData = {
      user,
      tokens: { access_token: "access_token", refresh_token: "refresh_token" },
    };

    // Mocking axios POST request response
    mockedAxios.post.mockResolvedValueOnce({ data: responseData });

    const store = configureStore({ reducer: { login: loginReducer } });

    await store.dispatch(loginUser({ email: "user@example.com", password: "password" }));

    const state = store.getState().login;
    expect(state.loading).toBe(false);
    expect(state.user).toEqual(user);
    expect(state.message).toBe("Login successful");
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "jwtAccessToken",
      "access_token"
    );
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "jwtRefreshToken",
      "refresh_token"
    );
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "user",
      JSON.stringify(user)
    );
    expect(localStorage.setItem).toHaveBeenCalledTimes(3);
  });

  // Test loginUser async thunk (rejected)
  test("should handle loginUser.rejected", async () => {
    const errorMessage = "Login failed. Please check your credentials.";

    // Mocking axios POST request rejection
    mockedAxios.post.mockRejectedValueOnce({
      response: { data: { message: errorMessage } },
    });

    const store = configureStore({ reducer: { login: loginReducer } });

    await store.dispatch(loginUser({ email: "user@example.com", password: "password" }));

    const state = store.getState().login;
    expect(state.loading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });
});
