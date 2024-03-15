import { create } from "zustand";

type ChatMessage = {
  owner: string;
  content: string;
};

type ChatState = {
  chat: ChatMessage[];
  appendChat: (message: ChatMessage) => void;
};

const useChat = create<ChatState>((set) => ({
  chat: [],
  appendChat: (message) => set((state) => ({ chat: [...state.chat, message] })),
}));

export default useChat;
