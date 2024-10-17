"use client";

import { logout } from "@/app/_actions";
import { Loader2 } from "lucide-react";
import { useTransition } from "react";
import { Button } from "./ui/button";

export default function LogoutButton() {
  const [isPending, startTransaction] = useTransition();

  const handleSignOut = async () => {
    startTransaction(async () => {
      await logout();
    });
  };

  return (
    <Button
      variant="destructive"
      className="h-6 w-fit rounded-sm text-xs"
      onClick={handleSignOut}
      disabled={isPending}
    >
      {isPending ? (
        <>
          <Loader2 className="mr-2 size-4 animate-spin" />
          Saindo
        </>
      ) : (
        "Sair"
      )}
    </Button>
  );
}
