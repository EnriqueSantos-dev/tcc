import { getUser } from "@/lib/users";
import { canAccessDashboard } from "@/lib/utils";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { LogInIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

export default async function Header() {
  const { userId } = await auth();

  let allowAccessDashboard = false;

  if (userId) {
    const user = await getUser({ clerkUserId: userId });
    allowAccessDashboard = canAccessDashboard(user);
  }

  return (
    <header className="flex h-16 justify-end px-6 py-4">
      {!userId ? (
        <div className="flex items-center gap-2">
          <Button asChild size="sm">
            <Link href="/sign-in">Entrar</Link>
          </Button>
          <Button variant="secondary" asChild size="sm">
            <Link href="/sign-up">Cadastrar</Link>
          </Button>
        </div>
      ) : (
        <>
          {allowAccessDashboard && (
            <Button asChild size="sm" className="mr-3">
              <Link href="/admin/modules">
                Dashboard
                <LogInIcon className="mr-2 size-4" />
              </Link>
            </Button>
          )}
          <UserButton
            showName
            appearance={{
              elements: {
                userButtonTrigger: {
                  color: "hsl(var(----muted-foreground))"
                }
              }
            }}
          />
        </>
      )}
    </header>
  );
}
