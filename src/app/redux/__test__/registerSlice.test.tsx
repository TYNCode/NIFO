import { configureStore } from "@reduxjs/toolkit";
import registerReducer, { clearRegisterState, registerUser } from "../features/auth/registerSlice"; // Adjust path if necessary
import { User } from "../../interfaces"; // Your User type
import axios from "axios";

// Mock axios for API requests
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock localStorage before each test
beforeEach(() => {
  Storage.prototype.setItem = jest.fn();
});

describe("registerSlice", () => {
  // Test initial state
  test("should return the initial state", () => {
    const initialState = {
      loading: false,
      user: undefined,
      error: undefined,
      message: undefined,
    };

    expect(registerReducer(undefined, { type: "unknown" })).toEqual(initialState);
  });

  // Test clearRegisterState reducer
  test("should clear register state", () => {
    const previousState = {
      loading: false,
      user: { email: "user@example.com", first_name: "user" },
      error: "Error",
      message: "Success",
    };

    expect(registerReducer(previousState, clearRegisterState())).toEqual({
      loading: false,
      user: undefined,
      error: undefined,
      message: undefined,
    });
  });

  // Test registerUser async thunk (fulfilled)
  test("should handle registerUser.fulfilled", async () => {
    const user: User = { email: "user@example.com", first_name: "user" };
    const responseData = {
      user,
      message: "Registration successful",
      tokens: { access_token: "access_token", refresh_token: "refresh_token" },
    };

    // Mock successful API response
    mockedAxios.post.mockResolvedValueOnce({ data: responseData });

    const store = configureStore({ reducer: { register: registerReducer } });

    await store.dispatch(registerUser({
      first_name: "Alice",
      email: "alice@example.com",
      organization_name: "Tech Corp",
      password: "securepassword"
    }));

    const state = store.getState().register;
    expect(state.loading).toBe(false);
    expect(state.user).toEqual(user);
    expect(state.message).toBe("Registration successful");

    // Check if localStorage.setItem was called correctly
    expect(localStorage.setItem).toHaveBeenCalledTimes(3);
    expect(localStorage.setItem).toHaveBeenCalledWith("jwtAccessToken", "access_token");
    expect(localStorage.setItem).toHaveBeenCalledWith("jwtRefreshToken", "refresh_token");
    expect(localStorage.setItem).toHaveBeenCalledWith("user", JSON.stringify(user));
  });

  // Test registerUser async thunk (rejected)
  test("should handle registerUser.rejected", async () => {
    const errorMessage = "Email is already taken.";

    // Mock API rejection response
    mockedAxios.post.mockRejectedValueOnce({
      response: { data: { email: [errorMessage] } },
    });

    const store = configureStore({ reducer: { register: registerReducer } });

    await store.dispatch(registerUser({
      first_name: "Alice",
      email: "alice@example.com",
      organization_name: "Tech Corp",
      password: "securepassword"
    }));

    const state = store.getState().register;
    expect(state.loading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });
});
