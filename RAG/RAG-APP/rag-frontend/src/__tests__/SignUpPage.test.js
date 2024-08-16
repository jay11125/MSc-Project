import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import SignupPage from "../pages/SignUpPage";
import { signup } from "../services/api";
import { ToastContainer } from "react-toastify";

const renderWithToastify = (component) => {
  return render(
    <div>
      <ToastContainer />
      {component}
    </div>
  );
};
jest.mock("../services/api");

describe("SignupPage Component", () => {
  test("renders signup form", () => {
    render(
      <Router>
        <SignupPage onSignup={() => {}} />
      </Router>
    );
    expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Signup/i })).toBeInTheDocument();
  });

  test("submits form with input data", async () => {
    signup.mockResolvedValue({
      data: { msg: "User created successfully" },
    });

    renderWithToastify(
      <Router>
        <SignupPage />
      </Router>
    );
    fireEvent.change(screen.getByPlaceholderText(/Email/i), {
      target: { value: "newuser@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), {
      target: { value: "newpassword123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Signup/i }));

    await waitFor(() => {
      expect(signup).toHaveBeenCalledWith("newuser@example.com", "newpassword123");
      expect(screen.getByText(/Signed up successfully/i)).toBeInTheDocument();
    });
  });
});
