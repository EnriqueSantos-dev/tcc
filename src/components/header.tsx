import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { Button } from "./ui/button";

export default async function Header() {
  const { userId: session } = auth();

  return (
    <header className="flex h-16 justify-end px-6 py-4">
      {!session ? (
        <Button asChild size="sm">
          <Link href="/sign-in">Entrar</Link>
        </Button>
      ) : (
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
      )}
    </header>
  );
}
