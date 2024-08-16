import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import ChatView from "../components/ChatView";
import { getChats, uploadDocument, deleteChat, getChat } from "../services/api";
import { toast } from "react-toastify";

const MainPage = ({ user, onLogout }) => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const { chat_id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await getChats(user.accessToken);
        setChats(response.data);

        if (chat_id) {
          const chatResponse = await getChat(chat_id, user.accessToken);
          setSelectedChat(chatResponse.data);
          navigate(`/chat/${chat_id}`);
        }
      } catch (error) {
        console.error("Failed to fetch chats:", error);
        if (chat_id) {
          toast.error("Failed to load the chat");
          navigate("/");
        }
      }
    };

    fetchChats();
  }, [user.accessToken, chat_id, navigate]);

  const handleSelectChat = (chatId) => {
    const selected = chats.find((chat) => chat.chat_id === chatId);
    setSelectedChat(selected);
    navigate(`/chat/${chatId}`);
  };

  const handleCreateChat = async () => {
    const file = await promptForFile();
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await uploadDocument(formData, user.accessToken);
        const newChat = response.data;
        setChats([...chats, newChat]);
        setSelectedChat(newChat);
        toast.success("Chat created successfully");
        navigate(`/chat/${newChat.chat_id}`);
      } catch (error) {
        console.error("Failed to upload document:", error);
        toast.error("Failed to create chat");
      }
    }
  };

  const handleDeleteChat = async (chatId) => {
    try {
      await deleteChat(chatId, user.accessToken);
      setChats(chats.filter((chat) => chat.chat_id !== chatId));
      if (selectedChat && selectedChat.chat_id === chatId) {
        setSelectedChat(null);
        navigate("/");
      }
      toast.success("Chat deleted successfully");
    } catch (error) {
      console.error("Failed to delete chat:", error);
      toast.error("Failed to delete chat");
    }
  };

  const promptForFile = () => {
    return new Promise((resolve) => {
      const input = document.createElement("input");
      input.setAttribute("data-testid", "upload-file");
      input.type = "file";
      input.accept = "text/plain, application/pdf";
      input.onchange = (e) => resolve(e.target.files[0]);
      input.click();
    });
  };

  return (
    <div className="app-container">
      <Sidebar
        chats={chats}
        selectedChatId={chat_id}
        onSelectChat={handleSelectChat}
        onCreateChat={handleCreateChat}
        onDeleteChat={handleDeleteChat}
        onLogout={onLogout}
      />
      <ChatView user={user} chat={selectedChat} />
    </div>
  );
};

export default MainPage;
