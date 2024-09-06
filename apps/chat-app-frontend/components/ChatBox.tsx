"use client";
import React, { useEffect, useRef } from "react";
import ChatBubble from "./ChatBubble";
import useChat from "@/hooks/UseChat";

const ChatBox = () => {
  // ---Custom Hooks---
  const { chat } = useChat();

  // ---Refs---
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // ---Functions---
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // ---Effects---
  useEffect(() => {
    scrollToBottom();
  }, [chat]);

  // ---Render---
  return (
    <div className="h-[80vh] overflow-y-scroll px-6 pb-4 sm:pl-10 lg:pl-64">
      {chat.map((message, index) => (
        <ChatBubble key={index} message={message} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatBox;
