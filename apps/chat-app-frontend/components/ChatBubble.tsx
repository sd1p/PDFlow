import Image from "next/image";
import { AssistantAvatar } from "./Logo";

type Message = {
  owner: string;
  content: string;
};

interface ChatBubbleProps {
  message: Message;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  return (
    <div className="pt-4">
      <div>
        <div className="flex flex-row items-center justify-start gap-4">
          <div className="w-8 h-8 rounded-full bg-slate-100">
            {message.owner === "ASSISTANT" ? (
              <AssistantAvatar />
            ) : (
              <Image width={32} height={32} alt="" src="/Default_pfp.svg.png" />
            )}
          </div>
          <div className="flex flex-col">
            <div className="p-4 bg-slate-100 rounded-2xl">
              <p className="text-slate-black break-words max-w-[60vh]">
                {message.content}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;
