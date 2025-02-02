import { cn } from "@/lib/utils";
import { BotIcon } from "lucide-react";
import { AnimatedDots } from "./animation-dots";

export function ThinkingMessage() {
  return (
    <div className="flex items-center gap-3">
      <span className="flex size-8 items-center justify-center rounded-lg bg-muted text-muted-foreground">
        <BotIcon className={cn("size-4 shrink-0", "animate-draw")} />
      </span>
      <span className="prose prose-sm dark:prose-invert">
        A IA está pensando
      </span>
      <AnimatedDots />
    </div>
  );
}
