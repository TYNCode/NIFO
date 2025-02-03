import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import ResetPasswordMobile from "../ResetPasswordMobile";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";

// Mock Next.js hooks
jest.mock("next/navigation", () => ({
  useSearchParams: jest.fn(),
  useRouter: jest.fn(),
}));

// Mock Axios
jest.mock("axios");

describe("ResetPasswordMobile", () => {
  beforeEach(() => {
    // Mock URL parameters
    (useSearchParams as jest.Mock).mockReturnValue({
      get: (key: string) => {
        if (key === "uidb64") return "test-uid";
        if (key === "token") return "test-token";
        return null;
      },
    });

    // Mock useRouter
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
    });
  });

  test("renders the reset password form", () => {
    render(<ResetPasswordMobile />);
    expect(screen.getByText(/Reset Password/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/New Password/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Confirm Password/i)).toBeInTheDocument();
  });

  test("displays error when passwords do not match", async () => {
    render(<ResetPasswordMobile />);

    fireEvent.change(screen.getByPlaceholderText(/New Password/i), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Confirm Password/i), {
      target: { value: "differentPassword" },
    });

    fireEvent.click(screen.getByText(/Submit/i));

    expect(await screen.findByText(/Passwords do not match/i)).toBeInTheDocument();
  });

  test("calls API and redirects on successful password reset", async () => {
    const mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });

    (axios.post as jest.Mock).mockResolvedValue({
      data: { message: "Password reset successful" },
    });

    render(<ResetPasswordMobile />);

    fireEvent.change(screen.getByPlaceholderText(/New Password/i), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Confirm Password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByText(/Submit/i));

    await waitFor(() => {
      expect(screen.getByText(/Password reset successful/i)).toBeInTheDocument();
      expect(mockPush).toHaveBeenCalledWith("/login");
    });
  });

  test("displays an error message on API failure", async () => {
    (axios.post as jest.Mock).mockRejectedValue({
      response: { data: { message: "Reset link expired" } },
    });

    render(<ResetPasswordMobile />);

    fireEvent.change(screen.getByPlaceholderText(/New Password/i), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Confirm Password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByText(/Submit/i));

    await waitFor(() => {
      expect(screen.getByText(/Reset link expired/i)).toBeInTheDocument();
    });
  });
});
