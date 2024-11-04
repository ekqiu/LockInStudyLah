import React, { useState, useEffect, useContext } from "react";
import "./index.css";
import { AuthContext } from "../context/authcontext";

const Chat = () => {
  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const { user } = useContext(AuthContext);
  const username = user.user.username;

  useEffect(() => {
    const ws = new WebSocket(`ws://${window.location.hostname}:8000/ws/chat/`);
    setSocket(ws);

    ws.onopen = () => {
      console.log("WebSocket connection opened");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          message: data.message,
          username: data.username,
          timestamp: data.timestamp,
        },
      ]);
    };

    ws.onclose = (event) => {
      console.log("WebSocket connection closed", event);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error", error);
    };

    return () => {
      ws.close();
    };
  }, []);

  const sendMessage = () => {
    if (!message) {
      return;
    }
    if (socket) {
      console.log("Sending message", message, username);
      socket.send(JSON.stringify({ message, username }));
      setMessage("");
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="container">
      <h1>Live Chat</h1>
      <p>
        Chat with other users in real-time! Your messages are neither saved nor
        encrypted, be wary of the information you share here.
      </p>
      <div className="chat-container">
        <div className="messages">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${
                msg.username === username ? "own-message" : ""
              }`}
            >
              <div className="message-info">
                <strong>{msg.username}</strong>{" "}
                <span className="timestamp">[{msg.timestamp}]</span>
              </div>
              <div className="message-text">{msg.message}</div>
            </div>
          ))}
        </div>
        <div className="input-container">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="message-input"
          />
          <button onClick={sendMessage} className="send-button">
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
