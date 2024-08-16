import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import MainPage from "../pages/MainPage";
import { getChats, uploadDocument, getChat, deleteChat } from "../services/api";
import userEvent from "@testing-library/user-event";

const mockUser = {
  email: "testuser@example.com",
  accessToken: "test_token",
  refreshToken: "test_token",
};
jest.mock("../services/api");

describe("MainPage Component", () => {
  beforeEach(() => {
    getChats.mockResolvedValue({
      data: [
        {
          chat_id: "1",
          file_name: "Test Chat 1",
          history: [{ answer: "Answer 1", query: "Query 1" }],
        },
        { chat_id: "2", file_name: "Test Chat 2", history: [] },
      ],
    });
    getChat.mockResolvedValue({ data: { chat_id: "1", file_name: "Test Chat 1", history: [] } });
  });

  test("renders sidebar and chat view", async () => {
    render(
      <Router>
        <MainPage user={mockUser} onLogout={() => {}} />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText(/Test Chat 1/i)).toBeInTheDocument();
      expect(screen.getByText(/Test Chat 2/i)).toBeInTheDocument();
      expect(screen.getByText(/Create New Chat/i)).toBeInTheDocument();
      expect(screen.getByText(/Logout/i)).toBeInTheDocument();
      expect(getChats).toHaveBeenCalled();
    });
  });

  // test("creates new chat", async () => {
  //   uploadDocument.mockResolvedValue({ data: { chat_id: "3", file_name: "New Chat" } });

  //   const { rerender, getByTestId } = render(
  //     <Router>
  //       <MainPage user={mockUser} onLogout={() => {}} />
  //     </Router>
  //   );

  //   const createButton = await screen.findByText(/Create New Chat/i);
  //   fireEvent.click(createButton);
  //   rerender(
  //     <Router>
  //       <MainPage user={mockUser} onLogout={() => {}} />
  //     </Router>
  //   );
  //   const fileInput = await waitFor(() => getByTestId("upload-file"));

  //   const file = new File(["dummy content"], "test_file.txt", {
  //     type: "text/plain",
  //   });

  //   fireEvent.change(fileInput, { target: { files: [file] } });

  //   await waitFor(() => {
  //     expect(uploadDocument).toHaveBeenCalled(expect.any(FormData), "test_token");
  //     expect(screen.getByText(/New Chat/i)).toBeInTheDocument();
  //   });
  // });

  test("selects a chat", async () => {
    render(
      <Router>
        <MainPage user={mockUser} onLogout={() => {}} />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText(/Test Chat 1/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/Test Chat 1/i));

    await waitFor(() => {
      expect(screen.getByText(/Query 1/i)).toBeInTheDocument();
      expect(screen.getByText(/Answer 1/i)).toBeInTheDocument();
    });
  });

  test("deletes chat", async () => {
    deleteChat.mockResolvedValue({ data: { message: "Chat deleted successfully" } });
    window.confirm = jest.fn().mockImplementation(() => true);

    render(
      <Router>
        <MainPage user={mockUser} onLogout={() => {}} />
      </Router>
    );

    const deleteButton = await screen.findByTestId("delete-1");
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(window.confirm).toHaveBeenCalledWith("Are you sure you want to delete this chat?");
      expect(deleteChat).toHaveBeenCalledWith("1", mockUser.accessToken);
      expect(screen.queryByText(/Test Chat 1/i)).not.toBeInTheDocument();
    });
  });
});
