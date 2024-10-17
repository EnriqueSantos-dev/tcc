import { validateRequest } from "@/lib/auth";
import Link from "next/link";
import { Button } from "./ui/button";
import UserDropdown from "./user-dropdown";

export default async function Header() {
  const { session, user } = await validateRequest();

  return (
    <header className="flex h-16 justify-end px-6 py-4">
      {!session ? (
        <Button asChild size="sm">
          <Link href="/login">Entrar</Link>
        </Button>
      ) : (
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium">
            Olá,&nbsp;
            {user.email.split("@")[0]}
          </span>
          <UserDropdown user={user} />
        </div>
      )}
    </header>
  );
}
