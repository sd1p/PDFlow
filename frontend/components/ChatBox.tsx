"use client";
import React, { useEffect, useRef } from "react";
import ChatBubble from "./ChatBubble";
import useChat from "@/hooks/UseChat";

const ChatBox = () => {
  const { chat } = useChat();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat]);

  return (
    <div className="h-[80vh] overflow-y-scroll px-6 pb-4 lg:pl-64">
      {chat.map((message, index) => (
        <ChatBubble key={index} message={message} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatBox;
