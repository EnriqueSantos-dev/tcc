import { auth } from "@clerk/nextjs/server";
import { BotIcon, Component } from "lucide-react";
import Link from "next/link";
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "./ui/sidebar";
import UserProfile from "./user-profile";
import SidebarMenuItems from "./sidebar-menu-items";

export default async function Sidebar() {
  const { sessionClaims } = auth();
  const userRole = sessionClaims?.metadata.role;

  return (
    <ShadcnSidebar>
      <SidebarHeader>
        <Link
          href="/"
          className="flex items-center gap-2 rounded-md bg-zinc-800 p-2 transition-colors hover:bg-zinc-800/70 hover:underline"
        >
          <BotIcon className="size-6" />
          Chatbot Sigaa
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Sistema</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItems userRole={userRole} />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <UserProfile />
      </SidebarFooter>
    </ShadcnSidebar>
  );
}
