type Message = {
  owner: boolean;
  content: string;
};

interface ChatBubbleProps {
  message: Message;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  return (
    <div
      className={`pt-3 pb-1 flex ${
        message.owner ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`relative p-3 px-4 rounded-2xl shadow-md ${
          message.owner
            ? "bg-primary text-white"
            : "bg-slate-100 dark:bg-gray-700 text-black dark:text-slate-200"
        } break-words max-w-[50vw]`}
      >
        <p>{message.content}</p>
      </div>
    </div>
  );
};

export default ChatBubble;
