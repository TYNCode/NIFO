import userReducer, { setUserInfo, clearUserInfo } from "../features/auth/userInfoSlice"; // Adjust path if necessary
import { UserInfo } from "../../interfaces"; // Your UserInfo interface

describe("userSlice", () => {
  const initialState = {
    userInfo: null,
  };

  const userData: UserInfo = {
    email: "user@example.com",
    first_name: "John",
    is_superuser: false,
    organization: 123,
    is_primary_user: true,
  };

  // Test initial state
  test("should return the initial state", () => {
    expect(userReducer(undefined, { type: "unknown" })).toEqual(initialState);
  });

  // Test setUserInfo action
  test("should handle setUserInfo", () => {
    const action = setUserInfo(userData);
    const state = userReducer(initialState, action);

    expect(state.userInfo).toEqual(userData);
  });

  // Test clearUserInfo action
  test("should handle clearUserInfo", () => {
    const action = clearUserInfo();
    const state = userReducer(
      { userInfo: userData }, // Passing a state with user info
      action
    );

    expect(state.userInfo).toBeNull();
  });
});
