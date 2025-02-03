import { render, screen, fireEvent } from "@testing-library/react";
import { useRouter } from "next/navigation";
import MobileHeader from "../MobileHeader";
import "@testing-library/jest-dom";


// Mock the next/router module
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// describe("MobileHeader", () => {
//   let mockPush;
//   let mockRouter;

//   beforeEach(() => {
//     mockPush = jest.fn();
//     mockRouter = { push: jest.fn() };
//     (useRouter as jest.Mock).mockReturnValue(mockRouter);
//     const location = new URL("http://localhost/");
//     delete global.location;
//     global.location = location;
//   });

//   afterEach(() => {
//     // Reset the mocked location after each test
//     window.location.pathname = "";
//   });


// });

describe("Testing Mobile Header rendering",() => {
    let mockRouter;
    let setActiveTabMock;

    beforeEach(() => {
        setActiveTabMock = jest.fn();
        mockRouter = { push: jest.fn() };
        (useRouter as jest.Mock).mockReturnValue(mockRouter);
    });
    test("renders the logo", () => {
        render(<MobileHeader />);
        const logo = screen.getByAltText("Tyn Logo");
        expect(logo).toBeInTheDocument();
    });

    test("shows the back arrow when the path includes '/spotlights/'", () => {
        render(<MobileHeader />);

        // Check if the back arrow is displayed
        const backArrow = screen.getByRole("button", { name: /Go back/i });
        expect(backArrow).toBeInTheDocument();
    });

    // test("does not show the back arrow when the path does not include '/spotlights/'", () => {
    //     // Mocking the window.location.pathname for a different path
    //     // Object.defineProperty(window, "location", {
    //     // value: { pathname: "/" },
    //     // writable: true,
    //     // });

    //     render(<MobileHeader />);

    //     // Back arrow should not be visible
    //     const backArrow = screen.queryByRole("button", { name: /Go back/i });
    //     expect(backArrow).toBeNull();
    // });

    // test("clicking the back arrow navigates to the home page", () => {
    //     // Mocking the window.location.pathname to simulate the spotlight page
    //     // Object.defineProperty(window, "location", {
    //     // value: { pathname: "/spotlights/some-spotlight" },
    //     // writable: true,
    //     // });

    //     render(<MobileHeader />);

    //     const backArrow = screen.getByRole("button", { name: /Go back/i });
    //     fireEvent.click(backArrow);

    //     expect(mockRouter.push).toHaveBeenCalledWith("/");
    // });
})