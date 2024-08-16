import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import App from "../App";
import { login } from "../services/api";
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

const userData = {
  email: "test@example.com",
  accessToken: "access_token",
  refreshToken: "refresh_token",
};

describe("App Component", () => {
  test("shows login page when user is not authenticated", async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Login/i })).toBeInTheDocument();
    });
  });

  test("login failure with invalid credentials", async () => {
    login.mockRejectedValue(new Error("Invalid credentials"));

    renderWithToastify(<App />);

    fireEvent.change(screen.getByPlaceholderText(/Email/i), {
      target: { value: "wrong@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), {
      target: { value: "wrongpassword" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Login/i }));

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith("wrong@example.com", "wrongpassword");
      expect(screen.getByText(/Login Failed/i)).toBeInTheDocument();
    });
  });

  test("login functionality", async () => {
    login.mockResolvedValue({
      data: { access_token: "test_token", refresh_token: "refresh_token" },
    });
    renderWithToastify(<App />);

    fireEvent.change(screen.getByPlaceholderText(/Email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Login/i }));

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith("test@example.com", "password123");
      expect(screen.getByText(/Logged in successfully/i)).toBeInTheDocument();
      expect(screen.getByText(/Create New Chat/i)).toBeInTheDocument();
    });
  });

  test("shows main page when user is authenticated", async () => {
    localStorage.setItem("user", JSON.stringify(userData));

    render(<App />);
    await waitFor(() => {
      expect(screen.getByText(/Create New Chat/i)).toBeInTheDocument();
    });
    localStorage.clear();
  });

  test("shows login page when user clicks log out", async () => {
    localStorage.setItem("user", JSON.stringify(userData));

    render(<App />);
    await waitFor(() => {
      expect(screen.getByText(/Logout/i)).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole("button", { name: /Logout/i }));
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Login/i })).toBeInTheDocument();
    });
    localStorage.clear();
  });
});
