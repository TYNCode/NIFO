import { render, screen, fireEvent } from "@testing-library/react";
import TrendsMobileHeader from "../TrendsMobileHeader"; // Adjust the import path as needed
//import "@testing-library/jest-dom/extend-expect";
import "@testing-library/jest-dom";

jest.mock("next/image", () => (props) => <img {...props} />); // Mock Next.js Image component

describe("TrendsMobileHeader Component", () => {
  test("renders the component correctly", () => {
    render(<TrendsMobileHeader handleBack={jest.fn()} />);

    // Check if the back button is rendered
    expect(screen.getByRole("button", { name: /go back/i })).toBeInTheDocument();

    // Check if the logo is displayed
    expect(screen.getByAltText("Tyn Logo")).toBeInTheDocument();
  });

  test("calls handleBack function when back button is clicked", () => {
    const mockHandleBack = jest.fn();
    render(<TrendsMobileHeader handleBack={mockHandleBack} />);

    // Click the back button
    fireEvent.click(screen.getByRole("button", { name: /go back/i }));

    // Ensure handleBack was called
    expect(mockHandleBack).toHaveBeenCalledTimes(1);
  });
});
