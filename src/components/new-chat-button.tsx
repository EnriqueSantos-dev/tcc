"use client";

import { PlusCircleIcon } from "lucide-react";
import { Button } from "./ui/button";

export default function NewChatButton() {
  return (
    <Button
      type="button"
      size="sm"
      aria-label="Novo chat"
      onClick={() => window.location.reload()}
    >
      <PlusCircleIcon className="size-4" />
      Novo chat
    </Button>
  );
}
