import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import BottomBar from "../BottomBar";
import { useRouter } from "next/navigation";

/*
    Components
        1. BottomBar
    Location
        app\mobileComponents\BottomBar.tsx
    Number of Tests : 2
*/




jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("BottomBar Component", () => {
  let mockRouter;
  let setActiveTabMock;

  beforeEach(() => {
    setActiveTabMock = jest.fn();
    mockRouter = { push: jest.fn() };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  test("renders all tabs correctly", () => {
    render(<BottomBar setActiveTab={setActiveTabMock} activeTab="Spotlight" />);

    expect(screen.getByText("Spotlight")).toBeInTheDocument();
    expect(screen.getByText("Search")).toBeInTheDocument();
    expect(screen.getByText("Trends")).toBeInTheDocument();
    expect(screen.getByText("More")).toBeInTheDocument();
  });

  test("clicking a tab updates the activeTab state and calls router.push", () => {
    render(<BottomBar setActiveTab={setActiveTabMock} activeTab="Spotlight" />);
    
    const clickTab = (tabText, expectedTab) => {
        const tab = screen.getByText(tabText);
        fireEvent.click(tab);
        expect(setActiveTabMock).toHaveBeenCalledWith(expectedTab);
        expect(mockRouter.push).toHaveBeenCalledWith("/");
      };
      
      clickTab("Search", "Search");
      clickTab("Trends", "Trends");
      clickTab("More", "More");
      
    });
});
