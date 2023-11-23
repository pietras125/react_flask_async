import { useEffect, useState } from "react";
import openSocket from "socket.io-client";

const socket = openSocket("http://127.0.0.1:5000"); // Change the URL to match your server

const ChatComponent = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    socket.on("chat_message", (data) => {
      console.log("Received message:", data.content);
      setMessages((prevMessages) => [...prevMessages, data.content]);
    });

    return () => {
      socket.disconnect();
      console.log("Disconnected from server");
    };
  }, []);

  return (
    <div>
      {messages.map((message, index) => (
        <div key={index}>{message}</div>
      ))}
    </div>
  );
};

export default ChatComponent;
