import { cn } from "@/lib/utils";
import { Skeleton } from "./ui/skeleton";

export default function UserProfileSkeleton({
  className
}: {
  className?: string;
}) {
  return (
    <div className={cn("flex flex-1 items-center gap-4", className)}>
      <Skeleton className="size-7 rounded-full" />
      <Skeleton className="h-3 w-3/5" />
    </div>
  );
}
