import React, { useState, useEffect, useRef } from "react";
import { queryChat } from "../services/api";
import { FaArrowUp } from "react-icons/fa";

const ChatView = ({ user, chat }) => {
  const [messages, setMessages] = useState([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const container = useRef(null);

  useEffect(() => {
    if (chat) {
      setMessages(chat.history || []);
    }
  }, [chat]);

  useEffect(() => {
    if (container.current) {
      container.current.scrollTop = container.current.scrollHeight;
    }
  }, [messages]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSendQuery();
    }
  };

  const handleSendQuery = async () => {
    if (query.trim()) {
      setIsLoading(true);
      setMessages([...messages, { query, answer: "", isLoading: true }]);
      setQuery("");
      try {
        const result = await queryChat(chat.chat_id, query, user.accessToken);
        setMessages([...messages, { query, answer: result.data.answer }]);
      } catch (error) {
        console.error("Error querying chat:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="main-content">
      {chat ? (
        <>
          {messages.length === 0 ? (
            <div className="chat-history">
              <p>Start asking questions...</p>
            </div>
          ) : (
            <div ref={container} className="chat-history">
              {messages.map((message, index) => (
                <div key={index}>
                  <div className="message user-message">{message.query}</div>
                  <div className="message ai-message">
                    {message.isLoading ? <div className="dot-pulse" /> : message.answer}
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="query-input">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter your query"
              disabled={isLoading}
              onKeyDown={handleKeyDown}
            />
            <button
              className={`send-btn ${isLoading ? "send-btn-disabled" : ""}`}
              onClick={handleSendQuery}
              disabled={isLoading}
            >
              <FaArrowUp />
            </button>
          </div>
        </>
      ) : (
        <div className="chat-history">
          <p>Select a chat or create a new chat to start.</p>
        </div>
      )}
    </div>
  );
};

export default ChatView;
