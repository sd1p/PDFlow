import React, { createContext, useContext, useState } from "react";

interface ChatContextType {
  selectedChat: number;
  setSelectedChat: (chat: number) => void;
}

const ChatContext = createContext<ChatContextType>({
  selectedChat: 0,
  setSelectedChat: () => {},
});

interface ChatProviderProps {
  children: React.ReactNode;
}

export function ChatProvider({ children }: ChatProviderProps) {
  const [selectedChat, setSelectedChat] = useState(0);

  return (
    <ChatContext.Provider value={{ selectedChat, setSelectedChat }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  return useContext(ChatContext);
}
