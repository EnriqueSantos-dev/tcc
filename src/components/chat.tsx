"use client";

import { useToast } from "@/hooks/use-toast";
import { useChat } from "ai/react";
import { useEffect, useRef } from "react";
import ChatForm from "./chat-form";
import { PreviewMessages } from "./preview-messages";

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
      <PreviewMessages
        messages={messages}
        setInput={setInput}
        isLoading={isLoading}
      />
      <div className="fixed inset-x-0 bottom-0 bg-gradient-to-b from-neutral-900 to-neutral-950">
        <ChatForm
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
          stop={stop}
        />
      </div>
    </div>
  );
}
