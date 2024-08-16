import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import LoginPage from "../pages/LoginPage";

describe("LoginPage Component", () => {
  test("renders login form", () => {
    render(
      <Router>
        <LoginPage onLogin={() => {}} />
      </Router>
    );
    expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Login/i })).toBeInTheDocument();
  });

  test("submits form with the input data", async () => {
    const mockOnLogin = jest.fn();

    render(
      <Router>
        <LoginPage onLogin={mockOnLogin} />
      </Router>
    );

    fireEvent.change(screen.getByPlaceholderText(/Email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Login/i }));

    await waitFor(() => {
      expect(mockOnLogin).toHaveBeenCalledWith("test@example.com", "password123");
    });
  });
});
