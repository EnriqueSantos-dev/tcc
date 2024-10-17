import { cn } from "@/lib/utils";
import { Message } from "ai";
import { BotIcon, UserIcon } from "lucide-react";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { CodeBlock } from "./code-block";
import { MemoizedReactMarkdown } from "./markdown";
import { ChatMessageActions } from "./chat-message-actions";

export default function ChatMessage({ message }: { message: Message }) {
  return (
    <div key={message.id} className="flex gap-3">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border bg-muted text-muted-foreground">
        {message.role === "user" ? (
          <UserIcon className="size-4 shrink-0" />
        ) : (
          <BotIcon className="size-4 shrink-0" />
        )}
      </div>
      <div className="grid min-w-0 flex-1 gap-2">
        <MemoizedReactMarkdown
          className="prose prose-sm min-w-0 break-words dark:prose-invert first:pt-[3px] prose-p:leading-relaxed prose-pre:p-0"
          remarkPlugins={[remarkGfm, remarkMath]}
          components={{
            a({ href, children }: any) {
              return (
                <a href={href} target="_blank" rel="noopener noreferrer">
                  {children}
                </a>
              );
            },
            code({ inline, className, children, ...props }: any) {
              const match = /language-(\w+)/.exec(className || "");

              if (inline || !match) {
                return (
                  <code className={cn(className, "font-bold")} {...props}>
                    {children}
                  </code>
                );
              }

              return (
                <CodeBlock
                  key={Math.random()}
                  language={(match && match[1]) || ""}
                  value={String(children).replace(/\n$/, "")}
                  {...props}
                />
              );
            }
          }}
        >
          {message.content}
        </MemoizedReactMarkdown>
        {message.role !== "user" && <ChatMessageActions message={message} />}
      </div>
    </div>
  );
}
