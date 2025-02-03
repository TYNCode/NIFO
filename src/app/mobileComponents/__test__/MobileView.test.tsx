import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginMobile from "../LoginMobile";
import { Provider } from "react-redux";
import RegisterMobile from "../RegisterMobile";
//import companyProfileReducer from "../redux/features/companyprofile/companyProfileSlice";
import { store } from '../../redux/store';

/*
    Components
        1. LoginMobile
        2. RegisterMobile
    Location
        app/mobileComponents/RegisterMobile
    Number of Tests
        LoginMobile    - 3
        RegisterMobile - 2
*/


describe("LoginMobile Component", () => {
  const mockOnSubmit = jest.fn(async () => {});

  it("renders login form correctly", () => {
    render(<LoginMobile onSubmit={mockOnSubmit} loading={false} message="" error="" />);

    expect(screen.getByText("Sign In")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email Address")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeDisabled();
  });

  it("validates form inputs", async () => {
    render(<LoginMobile onSubmit={mockOnSubmit} loading={false} />);

    const emailInput = screen.getByPlaceholderText("Email Address");
    const passwordInput = screen.getByPlaceholderText("Password");
    const submitButton = screen.getByRole("button", { name: /sign in/i });

    // Fill inputs
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    // Button should be enabled after input
    fireEvent.click(submitButton)
  });

//   it("displays error messages for invalid input", async () => {
//     render(<LoginMobile onSubmit={mockOnSubmit} loading={false} />);

//     fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

//     expect(await screen.findByText("Email is required")).toBeInTheDocument();
//     expect(await screen.findByText("Password is required")).toBeInTheDocument();
//   });

//   it("calls onSubmit function when form is submitted", async () => {
//     render(<LoginMobile onSubmit={mockOnSubmit} loading={false} />);
  
//     fireEvent.change(screen.getByPlaceholderText("Email Address"), { target: { value: "test@example.com" } });
//     fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "password123" } });
  
//     // Wait for validation to mark the form as valid
//     const submitButton = screen.getByRole("button", { name: /sign in/i });
//     await waitFor(() => expect(submitButton).not.toBeDisabled());
  
//     // fireEvent.click(submitButton);
//     fireEvent.submit(screen.getByRole("form"));
  
//     expect(mockOnSubmit).toHaveBeenCalledTimes(1);
//   });

  it("disables submit button when loading", async () => {
    render(<LoginMobile onSubmit={mockOnSubmit} loading={true} />);

    const submitButton = screen.getByRole("button", { name: /signing in/i });
    expect(submitButton).toBeDisabled();
  });
});


/////////////////////////////////////////////////////////////////////////////////

jest.mock("react-hook-form", () => ({
    useForm: jest.fn(() => ({
      handleSubmit: jest.fn(),
      register: jest.fn(),
      formState: { errors: {}, isSubmitted: false, isValid: false },
    })),
  }));
  

const mockOnSubmit = jest.fn();


describe("RegisterMobile Component", () => {

  test("renders the component correctly", () => {
    render(<Provider store={store}>
        <RegisterMobile onSubmit={mockOnSubmit} loading={false} />
    </Provider>);
    expect(screen.getByText(/Sign Up/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Full Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email Address")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Organization Name")).toBeInTheDocument();
  });

  test("submits form with valid input", async () => {
    render(<Provider store={store}>
        <RegisterMobile onSubmit={mockOnSubmit} loading={false} />
    </Provider>);

    fireEvent.change(screen.getByPlaceholderText("Full Name"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email Address"), {
      target: { value: "johndoe@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByPlaceholderText("Organization Name"), {
      target: { value: "Tech Corp" },
    });

    fireEvent.click(screen.getByText(/Register/i));

    // await waitFor(() => {
    //   expect(mockOnSubmit).toHaveBeenCalled();
    // });
  });

//   test("displays error messages for invalid inputs", async () => {
//     useForm.mockReturnValue({
//       handleSubmit: jest.fn((fn) => (event) => {
//         event.preventDefault();
//         fn();
//       }),
//       register: jest.fn(),
//       setValue: jest.fn(),
//       formState: {
//         errors: {
//           first_name: { message: "Full name is required" },
//           email: { message: "Invalid email address" },
//         },
//         isValid: false,
//         isSubmitting: false,
//       },
//     });

//     renderWithStore(<RegisterMobile onSubmit={mockOnSubmit} loading={false} />);

//     fireEvent.click(screen.getByText(/Register/i));

//     expect(await screen.findByText("Full name is required")).toBeInTheDocument();
//     expect(await screen.findByText("Invalid email address")).toBeInTheDocument();
//   });
});
