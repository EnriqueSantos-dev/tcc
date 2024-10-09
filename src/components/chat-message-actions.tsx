"use client";

import { type Message } from "ai";

import { Button } from "@/components/ui/button";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { cn } from "@/lib/utils";
import { CheckIcon, CopyIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

interface ChatMessageActionsProps extends React.ComponentProps<"div"> {
  message: Message;
}

export function ChatMessageActions({
  message,
  className,
  ...props
}: ChatMessageActionsProps) {
  const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 2000 });

  const onCopy = () => {
    if (isCopied) return;
    copyToClipboard(message.content);
  };

  return (
    <div className={cn("flex items-center", className)} {...props}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            className="flex items-center p-1 text-muted-foreground opacity-30 transition-colors hover:opacity-100"
            onClick={onCopy}
          >
            {isCopied ? (
              <CheckIcon className="size-4" />
            ) : (
              <CopyIcon className="size-4" />
            )}
            <span className="sr-only">Copy message</span>
          </button>
        </TooltipTrigger>
        <TooltipContent>Copiar mensagem</TooltipContent>
      </Tooltip>
    </div>
  );
}
