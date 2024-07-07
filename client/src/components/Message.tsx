import type { FC } from "react";
import { Role, type ConversationMessage } from "~/types/Conversation";
import { useState, useEffect } from "react";

const Message: FC<{ message: ConversationMessage }> = ({ message }) => {

  const [typedText, setTypedText ] = useState<string>("");
  const [currentIndex, setCurrentIndex ] = useState(0);
  const isUser = message.role === Role.USER;

  useEffect(() => {
        if (currentIndex < message.content.length) {
            const timer = setTimeout(() => {
                setTypedText((prev) => prev + message.content[currentIndex])
                setCurrentIndex((prev) => prev + 1)
            }, 20);

            return () => {
                clearTimeout(timer);
            }
        }
        
    }, [message.content, typedText, setCurrentIndex]);

  return (
    <div
      className={`flex items-start max-w-[70%] p-4 ${
        isUser ? "self-end flex-row-reverse" : "self-start"
      }`}
    >
      <img
        src={isUser ? './user-avatar.png' :  './mascot.png'}
        alt={`${message.role} avatar`}
        className="w-10 h-10 rounded-full m-4"
      />
      <div
        className={`rounded-sm p-4 ${
            isUser ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-500"
        }`}
      >
        {
        isUser ? message.content : typedText
        }
      </div>
    </div>
  );
};

export default Message;
