import { useEffect, useState } from "react";
import openSocket from "socket.io-client";

const socket = openSocket("http://127.0.0.1:5000");

const ChatComponent = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    socket.on("chat_message", (data) => {
      //console.log("Received message:", data.content);
      setMessages((prevMessages) => {
        const newMessages = [...prevMessages];
        if (newMessages.length > 0) {
          // Dodaj treść do istniejącej wiadomości
          newMessages[newMessages.length - 1] += data.content;
        } else {
          // Jeśli nie istnieje poprzednia wiadomość, utwórz nową
          newMessages.push(data.content);
        }

        return newMessages;
      });
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("chat_message");
    };
  }, []);

  const handleSendMessage = () => {
    // Wysyłanie wiadomości "hejka" po kliknięciu przycisku
    socket.emit("chat_message", { content: inputValue });
    // Czyszczenie wartości inputu po wysłaniu wiadomości
    setInputValue("");
  };

  return (
    <div>
      {messages.map((message, index) => (
        <div key={index}>{message}</div>
      ))}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button onClick={handleSendMessage}>Wyślij</button>
    </div>
  );
};

export default ChatComponent;
