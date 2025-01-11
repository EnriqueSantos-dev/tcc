"use client";

import { SidebarTrigger as Trigger, useSidebar } from "./ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export default function SidebarTrigger() {
  const { open } = useSidebar();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Trigger />
      </TooltipTrigger>
      <TooltipContent side="right" sideOffset={5}>
        {open ? "Fechar menu" : "Abrir menu"}
      </TooltipContent>
    </Tooltip>
  );
}
