import { renderHook } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { useAppDispatch, useAppSelector } from "../hooks";
import { setUserInfo } from "../features/auth/userInfoSlice";
import useUserInfo from "../features/customHooks/userHook";

jest.mock("../../hooks", () => ({
  useAppDispatch: jest.fn(),
  useAppSelector: jest.fn((selector) =>
    selector({ userInfo: { userInfo: null } })
  ),
}));

describe("useUserInfo", () => {
  const mockStore = configureStore();
  const dispatchMock = jest.fn();

  beforeEach(() => {
    (useAppDispatch as jest.Mock).mockReturnValue(dispatchMock);
    jest.clearAllMocks();
  });

  it("should return userInfo from state", () => {
    (useAppSelector as jest.Mock).mockImplementation((selector) =>
      selector({ userInfo: { userInfo: { name: "John Doe", email: "john@example.com" } } })
    );

    const { result } = renderHook(() => useUserInfo());

    expect(result.current).toEqual({ name: "John Doe", email: "john@example.com" });
  });

  it("should retrieve userInfo from localStorage and dispatch setUserInfo", () => {
    const mockUser = { name: "Jane Doe", email: "jane@example.com" };
    jest.spyOn(Storage.prototype, "getItem").mockReturnValue(JSON.stringify(mockUser));

    renderHook(() => useUserInfo());

    expect(dispatchMock).toHaveBeenCalledWith(setUserInfo(mockUser));
  });

  it("should not dispatch if localStorage has no user info", () => {
    jest.spyOn(Storage.prototype, "getItem").mockReturnValue(null);

    renderHook(() => useUserInfo());

    expect(dispatchMock).not.toHaveBeenCalled();
  });
});
