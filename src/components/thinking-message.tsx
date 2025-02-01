import { BotIcon } from "lucide-react";

export function ThinkingMessage() {
  return (
    <div className="flex items-center gap-3">
      <span className="flex size-8 items-center justify-center rounded-lg bg-muted text-muted-foreground">
        <BotIcon className="size-4 shrink-0 animate-pulse" />
      </span>
      <span className="prose prose-sm dark:prose-invert">
        A Ia está pensando...
      </span>
    </div>
  );
}
