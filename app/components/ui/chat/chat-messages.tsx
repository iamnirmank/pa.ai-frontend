import { Loader2 } from "lucide-react";
import { useEffect, useRef } from "react";

import ChatActions from "./chat-actions";
import ChatMessage from "./chat-message";
import { ChatHandler } from "./chat.interface";

export default function ChatMessages({
  messages,
  isLoading,
  reload,
  stop,
  setIsChatEdit,
  isChatEdit,
}: Pick<ChatHandler, "messages" | "isLoading" | "reload" | "stop" | "setIsChatEdit" | "isChatEdit">) {
  const scrollableChatContainerRef = useRef<HTMLDivElement>(null);
  const messageLength = messages.length;
  const lastMessage = messages[messageLength - 1];

  const scrollToBottom = () => {
    if (scrollableChatContainerRef.current) {
      scrollableChatContainerRef.current.scrollTop =
        scrollableChatContainerRef.current.scrollHeight;
    }
  };

  const isLastMessageFromAssistant = messageLength > 0 && lastMessage?.role !== "user";
  const showReload = reload && !isLoading && isLastMessageFromAssistant;
  const showStop = stop && isLoading;
  const isPending = isLoading && !isLastMessageFromAssistant;

  useEffect(() => {
    scrollToBottom();
  }, [messageLength, lastMessage]);

  return (
    <div className="w-full rounded-xl bg-white p-4 shadow-xl pb-0">
      <div
        className="flex h-[50vh] flex-col gap-5 divide-y overflow-y-auto pb-4"
        ref={scrollableChatContainerRef}
      >
        {messages.map((m) => (
          <ChatMessage 
            key={m.id} 
            chatMessage={m} 
            setIsChatEdit={setIsChatEdit as any} 
            isChatEdit={isChatEdit as boolean} 
          />
        ))}
        {isPending && (
          <div className="flex justify-center items-center pt-10">
            <Loader2 className="h-4 w-4 animate-spin" />
          </div>
        )}
      </div>
      <div className="flex justify-end py-4">
        <ChatActions
          reload={reload}
          stop={stop}
          showReload={showReload}
          showStop={showStop}
        />
      </div>
    </div>
  );
}
