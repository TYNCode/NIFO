import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import LoginLap from "../../components/LaptopView/LoginLap"; 
import RegisterLap from "../LaptopView/RegisterLap";
import { Provider } from "react-redux";
import { store } from '../../redux/store'
//import { store } from "../../redux/store";

/*
  Jest Unit Testing
  Components
    1. LoginLap    
    2. RegisterLap
  Location
    app/components/LaptopView/LoginLap
  Number of Tests 
    LoginLap    - 7
    RegisterLap - 4
*/

describe("LoginLap Component", () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    render(<LoginLap onSubmit={mockOnSubmit} loading={false} />);
  });

  test("renders component correctly", () => {
    expect(screen.getByTestId("signInBtn")).toBeInTheDocument();
    expect(screen.getByLabelText("Your Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByTestId("signInBtn")).toBeInTheDocument();
  });

  test("email and password fields should accept input", () => {
    const emailInput = screen.getByPlaceholderText("Enter your email");
    const passwordInput = screen.getByPlaceholderText("Enter your password");

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(emailInput).toHaveValue("test@example.com");
    expect(passwordInput).toHaveValue("password123");
  });

  test("should disable Sign in button when form is invalid", () => {
    const signInButton = screen.getByTestId("signInBtn");
    fireEvent.click(signInButton)
    expect(signInButton).toBeDisabled();
  });

  test("should enable Sign in button when form is valid", async () => {
    const emailInput = screen.getByPlaceholderText("Enter your email");
    const passwordInput = screen.getByPlaceholderText("Enter your password");
    const signInButton = screen.getByTestId("signInBtn");

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    await waitFor(() => expect(signInButton).not.toBeDisabled());
  });

//   test("clicking Sign in button should change its text to 'Signing in...'", async () => {
//     render(<LoginLap onSubmit={mockOnSubmit} loading={true} />);

//     const signInButton = screen.getByTestId("signInBtn");
//     fireEvent.click(signInButton)
//     expect(signInButton).toHaveTextContent("Signing in...");
//   });

//   test("should display validation errors when required fields are empty", async () => {
//     const signInButton = screen.getByTestId("signInBtn");
//     fireEvent.click(signInButton);

//     await waitFor(() => {
//       expect(screen.getByText("Email is required")).toBeInTheDocument();
//       expect(screen.getByText("Password is required")).toBeInTheDocument();
//     });
//   });

  test("clicking Forgot Password navigates to /changePassword", () => {
    const forgotPasswordLink = screen.getByTestId("forgotPasswordButton");
    expect(forgotPasswordLink).toHaveAttribute("href", "/changePassword");
  });

  test("clicking Sign-up navigates to /register", () => {
    const signUpButton = screen.getByTestId("signUpButton");
    expect(signUpButton).toBeInTheDocument();
    expect(screen.getByText("Sign-up")).toHaveAttribute("href", "/register");
  });

  test("submitting valid form triggers onSubmit function", async () => {
    const emailInput = screen.getByPlaceholderText("Enter your email");
    const passwordInput = screen.getByPlaceholderText("Enter your password");
    const signInButton = screen.getByTestId("signInBtn");

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    await waitFor(() => expect(signInButton).not.toBeDisabled());
    fireEvent.click(signInButton);

    await waitFor(() => expect(mockOnSubmit).toHaveBeenCalledTimes(1));
  });
});



//////////////////////////////////////////////////////////////////////////////////////////////////////////

const mockOnSubmit = jest.fn();



describe("RegisterLap Component", () => {
    test("renders all input fields correctly", () => {
      render( <Provider store={store}>
        <RegisterLap onSubmit={mockOnSubmit} loading={false} />
      </Provider>);
  
      expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/organization email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/organization name/i)).toBeInTheDocument();
    });
  
    test("renders register button", () => {
      render(<Provider store={store}>
        <RegisterLap onSubmit={mockOnSubmit} loading={false} />
      </Provider>);
      expect(screen.getByRole("button", { name: /register/i })).toBeInTheDocument();
    });
  
    test("disables submit button when fields are empty", () => {
      render(<Provider store={store}>
        <RegisterLap onSubmit={mockOnSubmit} loading={false} />
      </Provider>);
      expect(screen.getByRole("button", { name: /register/i })).toBeDisabled();
    });
  
    test("enables submit button when fields are filled correctly", async () => {
      render(<Provider store={store}>
        <RegisterLap onSubmit={mockOnSubmit} loading={false} />
      </Provider>);

      const nameField = screen.getByPlaceholderText("Enter your Name");
      const organizationEmailField = screen.getByPlaceholderText("Enter your email");
      const password = screen.getByPlaceholderText("Enter your password");
      const organizationNameField = screen.getByPlaceholderText("Enter your organization");

      fireEvent.change(nameField, { target: { value: "Rakesh" } });
      fireEvent.change(organizationEmailField, { target: { value: "test@example.com" } })
      fireEvent.change(password, { target: { value: "password" } })
      fireEvent.change(organizationNameField, { target: { value: "testOrganization" } })

      expect(screen.getByTestId("registerBtn")).toBeInTheDocument();
    });
  });
  