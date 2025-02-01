import { UseChatHelpers } from "ai/react";
import ChatMessage from "./chat-message";
import EmptyChatScreen from "./empty-chat-screen";
import { ThinkingMessage } from "./thinking-message";

type PreviewMessagesProps = {
  isLoading: boolean;
  messages: UseChatHelpers["messages"];
  setInput: UseChatHelpers["setInput"];
};

export function PreviewMessages({
  messages,
  setInput,
  isLoading
}: PreviewMessagesProps) {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 pb-60">
      {messages.length === 0 ? (
        <EmptyChatScreen onSelectSamplePrompt={setInput} />
      ) : (
        <div className="flex flex-col gap-4">
          {messages.map((message) => (
            <ChatMessage key={message.id} {...message} />
          ))}
          {isLoading &&
            messages.length > 0 &&
            messages[messages.length - 1].role === "user" && (
              <ThinkingMessage />
            )}
        </div>
      )}
    </div>
  );
}
