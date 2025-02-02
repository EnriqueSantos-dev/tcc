export function AnimatedDots() {
  return (
    <div className="flex h-full items-center justify-center space-x-2">
      <div className="h-1 w-1 animate-bounce rounded-full bg-foreground [animation-delay:-0.3s]"></div>
      <div className="h-1 w-1 animate-bounce rounded-full bg-foreground [animation-delay:-0.15s]"></div>
      <div className="h-1 w-1 animate-bounce rounded-full bg-foreground"></div>
    </div>
  );
}
