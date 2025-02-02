import { cn } from "@/lib/utils";
import { UseChatHelpers } from "ai/react";
import { ArrowUp, StopCircle } from "lucide-react";
import TextareaAutosize from "react-textarea-autosize";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

type ChatFormProps = Pick<
  UseChatHelpers,
  "input" | "isLoading" | "handleInputChange" | "handleSubmit" | "stop"
>;

export default function ChatForm({
  handleInputChange,
  handleSubmit,
  input,
  stop,
  isLoading
}: ChatFormProps) {
  const isEmpty = input.trim().length === 0;

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col justify-center px-4">
      <div className="rounded-2xl border border-border p-4 transition-shadow duration-300 focus-within:shadow-[0px_0px_4px_4px_#0a0a0a]">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <TextareaAutosize
            className="flex max-h-24 min-h-[40px] w-full resize-none bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            name="prompt"
            value={input}
            placeholder="Digite sua mensagem. Pressione Ctrl+Enter para enviar."
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="submit"
                aria-label={isLoading ? "Para geração" : "Enviar mensagem"}
                className={cn(
                  "ml-auto h-9 w-fit shrink-0",
                  !isLoading && "w-9 px-0"
                )}
                disabled={isEmpty && !isLoading}
              >
                {isLoading ? (
                  <>
                    <StopCircle
                      className="mr-1 size-4 shrink-0"
                      onClick={stop}
                    />
                    Parar
                  </>
                ) : (
                  <ArrowUp className="size-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {isLoading ? "Parar geração" : "Enviar mensagem"}
            </TooltipContent>
          </Tooltip>
        </form>
      </div>
      <span className="py-2 text-center text-xs text-muted-foreground">
        Conteúdo gerado por <strong>IA</strong>. Use apenas como referência.
      </span>
    </div>
  );
}
