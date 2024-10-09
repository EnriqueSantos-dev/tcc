"use client";

import ChatMessage from "@/components/chat-message";
import { useChat } from "ai/react";
import { useEffect, useRef } from "react";
import ChatForm from "./chat-form";
import EmptyChatScreen from "./empty-chat-screen";
import { useToast } from "@/hooks/use-toast";

export default function Chat() {
  const { toast } = useToast();
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    stop,
    setInput
  } = useChat({
    keepLastMessageOnError: true,
    onError: () => {
      toast({
        variant: "destructive",
        title: "Ocorreu um erro ao gerar a resposta."
      });
    }
  });

  useEffect(() => {
    containerRef.current?.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: "smooth"
    });
  }, [messages]);

  return (
    <div
      ref={containerRef}
      className="grid h-full w-full overflow-y-auto scrollbar-thin scrollbar-track-neutral-900 scrollbar-thumb-neutral-700 scrollbar-track-rounded-full scrollbar-thumb-rounded-full"
    >
      <div className="mx-auto w-full max-w-3xl px-4 py-8 pb-60">
        {messages.length === 0 ? (
          <EmptyChatScreen onSelectSamplePrompt={setInput} />
        ) : (
          <div className="flex flex-col gap-4">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
          </div>
        )}
        <div className="fixed inset-x-0 bottom-0 bg-gradient-to-b from-neutral-900 to-neutral-950">
          <ChatForm
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            input={input}
            isLoading={isLoading}
            stop={stop}
          />
        </div>
      </div>
    </div>
  );
}
