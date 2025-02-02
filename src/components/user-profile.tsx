import { UserButton } from "@clerk/nextjs";
import { Skeleton } from "./ui/skeleton";

export default async function UserProfile() {
  return (
    <div className="flex items-center gap-3 rounded-md bg-zinc-900 p-2 transition-colors hover:bg-zinc-800">
      <UserButton
        fallback={
          <div className="flex flex-1 items-center gap-4">
            <Skeleton className="size-7 rounded-full" />
            <Skeleton className="h-3 w-3/5" />
          </div>
        }
        showName
        appearance={{
          elements: {
            rootBox: {
              width: "100%"
            },
            userButtonTrigger: {
              width: "100%"
            },
            userButtonBox: {
              width: "100%",
              color: "hsl(var(--foreground))",
              flexDirection: "row-reverse",
              justifyContent: "flex-end"
            }
          }
        }}
      />
    </div>
  );
}
