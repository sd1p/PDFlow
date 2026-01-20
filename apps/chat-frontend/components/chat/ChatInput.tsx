"use client";
import React, { useEffect, useRef, useState } from "react";
import { Loader2, SendHorizontal } from "lucide-react";

type ChatMessage = {
  owner: boolean;
  content: string;
};

interface ChatInputProps {
  appendChat: (message: ChatMessage) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ appendChat }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) return;

    setLoading(true);
    const newMessage = { owner: true, content: message };
    appendChat(newMessage);
    setMessage("");
    setLoading(false);
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div className="w-full">
      <form
        onSubmit={handleSubmit}
        className="flex flex-row items-center justify-between px-3 py-2 mx-4 border-2 rounded-2xl border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-gray-900 text-slate-black dark:text-slate-200"
      >
        <input
          ref={inputRef}
          disabled={loading}
          value={message}
          type="text"
          placeholder="Send a message"
          className="w-full h-[4vh] bg-slate-100 dark:bg-gray-900 placeholder-slate-300 dark:placeholder-slate-500 focus:outline-none"
          onChange={(e) => setMessage(e.target.value)}
        />
        {!loading ? (
          <button
            type="submit"
            disabled={loading}
            className="p-2 bg-slate-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-xl"
          >
            <SendHorizontal size={20} color="#6b7280" strokeWidth={2} />
          </button>
        ) : (
          <div className="p-2">
            <Loader2 size={20} className="animate-spin text-slate-400" />
          </div>
        )}
      </form>
    </div>
  );
};

export default ChatInput;
