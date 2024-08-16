import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import Sidebar from "../components/Sidebar";
import { BrowserRouter as Router } from "react-router-dom";

describe("Sidebar Component", () => {
  const mockChats = [
    {
      chat_id: "1",
      file_name: "Test Chat 1",
      history: [
        { answer: "Answer 1", query: "Query 1" },
        { answer: "Answer 2", query: "Query 2" },
      ],
    },
    {
      chat_id: "2",
      file_name: "Test Chat 2",
      history: [
        { answer: "Answer 1", query: "Query 1" },
        { answer: "Answer 2", query: "Query 2" },
      ],
    },
  ];

  test("renders chat list", () => {
    render(
      <Router>
        <Sidebar
          chats={mockChats}
          selectedChatId="1"
          onSelectChat={() => {}}
          onCreateChat={() => {}}
          onDeleteChat={() => {}}
          onLogout={() => {}}
        />
      </Router>
    );

    expect(screen.getByText(/Test Chat 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Test Chat 2/i)).toBeInTheDocument();
    expect(screen.getByText(/Create New Chat/i)).toBeInTheDocument();
    expect(screen.getByText(/Logout/i)).toBeInTheDocument();
  });

  test("calls onSelectChat when a chat is clicked", () => {
    const mockOnSelectChat = jest.fn();
    render(
      <Router>
        <Sidebar
          chats={mockChats}
          selectedChatId="1"
          onSelectChat={mockOnSelectChat}
          onCreateChat={() => {}}
          onDeleteChat={() => {}}
          onLogout={() => {}}
        />
      </Router>
    );

    fireEvent.click(screen.getByText(/Test Chat 2/i));
    expect(mockOnSelectChat).toHaveBeenCalledWith("2");
  });

  test("calls onCreateChat when Create New Chat button is clicked", () => {
    const mockOnCreateChat = jest.fn();
    render(
      <Router>
        <Sidebar
          chats={mockChats}
          selectedChatId="1"
          onSelectChat={() => {}}
          onCreateChat={mockOnCreateChat}
          onDeleteChat={() => {}}
          onLogout={() => {}}
        />
      </Router>
    );

    fireEvent.click(screen.getByText(/Create New Chat/i));
    expect(mockOnCreateChat).toHaveBeenCalled();
  });

  test("calls onDeleteChat when Delete button is clicked", () => {
    const mockOnDeleteChat = jest.fn();
    window.confirm = jest.fn(() => true);

    const { container } = render(
      <Router>
        <Sidebar
          chats={mockChats}
          selectedChatId="1"
          onSelectChat={() => {}}
          onCreateChat={() => {}}
          onDeleteChat={mockOnDeleteChat}
          onLogout={() => {}}
        />
      </Router>
    );

    fireEvent.click(container.querySelector(".delete-btn"));
     expect(window.confirm).toHaveBeenCalled();
     expect(mockOnDeleteChat).toHaveBeenCalled();
  });

  test("calls onLogout when Logout button is clicked", () => {
    const mockOnLogout = jest.fn();
    render(
      <Router>
        <Sidebar
          chats={mockChats}
          selectedChatId="1"
          onSelectChat={() => {}}
          onCreateChat={() => {}}
          onDeleteChat={() => {}}
          onLogout={mockOnLogout}
        />
      </Router>
    );

    fireEvent.click(screen.getByText(/Logout/i));
    expect(mockOnLogout).toHaveBeenCalled();
  });
});
