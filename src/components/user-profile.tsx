import { getCurrentUser } from "@/lib/session";
import { User } from "lucide-react";
import LogoutButton from "./logout-button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export default async function UserProfile() {
  const user = await getCurrentUser();

  return (
    <div className="">
      <div className="flex items-center gap-3 p-4">
        <Avatar>
          <AvatarFallback>
            <User className="size-4" />
          </AvatarFallback>
          <AvatarImage src={user.image ?? undefined} alt="Foto de perfil" />
        </Avatar>
        <div className="flex flex-col overflow-hidden">
          <h4 className="truncate text-xs text-muted-foreground">
            {user.email}
          </h4>
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}
