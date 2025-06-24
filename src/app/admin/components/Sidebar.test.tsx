import { render, screen, fireEvent } from "@testing-library/react";
import Sidebar from "./Sidebar";
import { usePathname, useRouter } from "next/navigation";
import '@testing-library/jest-dom';

// Mocking next/navigation hooks
jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
}));

describe("Sidebar Component", () => {
  it("renders the Sidebar component correctly", () => {
    (usePathname as jest.Mock).mockReturnValue("/admin");
    render(<Sidebar />);
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Spotlights")).toBeInTheDocument();
    expect(screen.getByText("Agreements")).toBeInTheDocument();
    expect(screen.getByText("Startups")).toBeInTheDocument();
    expect(screen.getByText("Email Compose")).toBeInTheDocument();
    expect(screen.getByText("Email Logs")).toBeInTheDocument();
  });

  it("highlights the active navigation item", () => {
    (usePathname as jest.Mock).mockReturnValue("/admin/spotlights");
    render(<Sidebar />);
    const activeItem = screen.getByText("Spotlights");
    expect(activeItem).toHaveClass("text-white scale-105");
  });

  it("navigates to the correct route when a nav item is clicked", () => {
    const mockRouterPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: mockRouterPush });
    render(<Sidebar />);
    const navItem = screen.getByText("Agreements");
    fireEvent.click(navItem);
    expect(mockRouterPush).toHaveBeenCalledWith("/admin/agreements");
  });

  it("navigates to the home route when the logo is clicked", () => {
    const mockRouterPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: mockRouterPush });
    render(<Sidebar />);
    const logo = screen.getByAltText("Nifo Logo");
    fireEvent.click(logo);
    expect(mockRouterPush).toHaveBeenCalledWith("/");
  });
});
