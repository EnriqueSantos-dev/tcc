import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";

export default async function UserProfile() {
  const user = await currentUser();

  return (
    <div className="pb-3 pl-4">
      <div className="flex items-center gap-3 rounded-md bg-zinc-900 p-4">
        <UserButton />
        <div className="flex flex-col overflow-hidden">
          <h4 className="truncate text-xs font-medium text-foreground">
            {user?.firstName}
          </h4>
          <span className="truncate text-xs text-muted-foreground">
            {user?.primaryEmailAddress?.emailAddress}
          </span>
        </div>
      </div>
    </div>
  );
}
