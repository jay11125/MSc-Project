import React from "react";
import { FaTrash, FaPlus, FaSignOutAlt } from "react-icons/fa";

const Sidebar = ({ chats, selectedChatId, onSelectChat, onCreateChat, onDeleteChat, onLogout }) => {
  const handleDeleteChat = (chatId) => {
    if (window.confirm("Are you sure you want to delete this chat?")) {
      onDeleteChat(chatId);
    }
  };

  return (
    <div className="sidebar">
      <h2>Chats</h2>
      <div className="chat-list">
        {chats.map((chat) => (
          <div
            key={chat.chat_id}
            className={`chat-item ${chat.chat_id === selectedChatId ? "active" : ""}`}
            onClick={() => onSelectChat(chat.chat_id)}
          >
            <span className="file-name">{chat.file_name}</span>
            <button
              data-testid={`delete-${chat.chat_id}`}
              className="delete-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteChat(chat.chat_id);
              }}
            >
              <FaTrash />
            </button>
          </div>
        ))}
      </div>
      <button className="new-chat-btn" onClick={onCreateChat}>
        <FaPlus style={{ marginRight: "5px" }} />
        Create New Chat
      </button>
      <button className="logout-btn" onClick={onLogout}>
        <FaSignOutAlt style={{ marginRight: "5px" }} />
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
