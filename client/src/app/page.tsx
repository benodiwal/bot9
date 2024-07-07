"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import ChatWindow from "~/components/ChatWindow";
import { env } from "~/env";
import { Role, type ConversationMessage } from "~/types/Conversation";
import { v4 } from 'uuid';

export default function HomePage() {
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);
  const [sessionId, setSessionId] = useState<string>("");

  const handleSend = async (message: string) => {
    setIsChatLoading(false);    

    setConversation((c) => {
      const newConv = [...c];
      newConv.push({ content: message, role: Role.USER });
      return newConv;
    });

    try {
      const res = await axios.post(`${env.NEXT_PUBLIC_SERVER_BASE_URL}/chat`, { message, userId: sessionId });
      setConversation((c) => {
        const newConv = [...c];
        newConv.push({ content: res.data.response, role: Role.LLM });
        return newConv;
      });
    } catch (error) {
      console.error('Error sending message: ', error);
    } finally {
      setIsChatLoading(false);
    }
  };

  useEffect(() => {
    const uuid = v4();
    setSessionId(uuid);
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="flex w-full max-w-[80vw] flex-col gap-4 rounded-sm border-2 p-4">
          <ChatWindow
            conversation={conversation}
            isLoading={isChatLoading}
            sendMessage={handleSend}
          />
      </div>
    </main>
  );
}
