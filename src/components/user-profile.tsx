import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";

export default async function UserProfile() {
  const user = await currentUser();

  return (
    <div className="flex items-center gap-3 rounded-md bg-zinc-900 p-2 transition-colors hover:bg-zinc-800">
      <UserButton />
      <div className="flex flex-col overflow-hidden">
        <h4 className="truncate text-xs font-medium text-foreground">
          {user?.firstName} {user?.lastName}
        </h4>
        <span className="truncate text-xs text-muted-foreground">
          {user?.primaryEmailAddress?.emailAddress}
        </span>
      </div>
    </div>
  );
}
