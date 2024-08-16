import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import ChatView from "../components/ChatView";
import { queryChat } from "../services/api";

jest.mock("../services/api");

const mockUser = { email: "testuser@example.com", accessToken: "test_token", refreshToken: "test_token" };
const mockChat = {
  chat_id: "1",
  file_name: "Test Chat",
  history: [
    { answer: "Answer 1", query: "Query 1" },
    { answer: "Answer 2", query: "Query 2" },
  ],
};

describe("ChatView Component", () => {
  test("renders chat view", () => {
    const { container } = render(<ChatView user={mockUser} chat={mockChat} />);
    expect(screen.getByText(/Query 1/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter your query/i)).toBeInTheDocument();
    expect(container.querySelector(".send-btn")).toBeInTheDocument();
  });

  test("displays loading state while waiting for response", async () => {
    const { container } = render(<ChatView user={mockUser} chat={mockChat} />);

    const input = screen.getByPlaceholderText(/Enter your query/i);
    const sendButton = container.querySelector(".send-btn");

    fireEvent.change(input, { target: { value: "Test query" } });
    fireEvent.click(sendButton);

    expect(sendButton).toHaveAttribute("disabled");
  });

  test("sends query and displays response", async () => {
    queryChat.mockResolvedValue({ data: { answer: "Test response" } });

    const { container } = render(<ChatView user={mockUser} chat={mockChat} />);

    const input = screen.getByPlaceholderText(/Enter your query/i);
    const sendButton = container.querySelector(".send-btn");

    fireEvent.change(input, { target: { value: "Test query" } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(queryChat).toHaveBeenCalledWith("1", "Test query", "test_token");
      expect(screen.getByText(/Test query/i)).toBeInTheDocument();
      expect(screen.getByText(/Test response/i)).toBeInTheDocument();
    });
  });
});
