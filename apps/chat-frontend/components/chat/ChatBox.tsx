"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ChatBubble from "./ChatBubble";
import ChatInput from "./ChatInput";
import io, { Socket } from "socket.io-client";
import { useChat } from "@/context/ChatContext";

type ChatMessage = {
  owner: boolean;
  content: string;
};

const ChatBox = () => {
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const { selectedChat } = useChat();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (!token || !user) {
      router.push("/");
      return;
    }

    const socketConnection = io(process.env.NEXT_PUBLIC_WEBSOCKET_URL, {
      transports: ["websocket"],
    });
    setSocket(socketConnection);

    socketConnection.on("message", (message: ChatMessage) => {
      appendChat(message);
    });

    return () => {
      socketConnection.disconnect();
    };
  }, [router, selectedChat]);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) return;

    const { id } = JSON.parse(user);
    const storedChat = localStorage.getItem(
      `chatMessages_${selectedChat}-${id}`
    );
    if (storedChat) {
      setChat(JSON.parse(storedChat));
    } else {
      setChat([]);
    }
  }, [selectedChat]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
  };

  const appendChat = (message: ChatMessage) => {
    setChat((prevChat) => {
      const updatedChat = [...prevChat, message];
      if (typeof window !== "undefined") {
        const user = localStorage.getItem("user");
        if (user) {
          const { id } = JSON.parse(user);
          localStorage.setItem(
            `chatMessages_${selectedChat}-${id}`,
            JSON.stringify(updatedChat)
          );
        }
      }
      return updatedChat;
    });
  };

  const sendMessage = (message: ChatMessage) => {
    appendChat(message);
    if (!socket) return;
    socket.emit("message", message);
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat]);

  return (
    <div className="relative flex flex-col h-[90vh]">
      <div className="flex-grow overflow-y-scroll px-4 pb-4 sm:px-6 lg:px-10 bg-white dark:bg-transparent text-black dark:text-white">
        {chat.map((message, index) => (
          <ChatBubble key={index} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="w-full px-4 py-2 border-t border-slate-200 dark:border-slate-700 bg-gray-100 dark:bg-background text-slate-black dark:text-slate-200">
        <ChatInput appendChat={sendMessage} />
      </div>
    </div>
  );
};

export default ChatBox;
