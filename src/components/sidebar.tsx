import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import SidebarMenuItems from "./sidebar-menu-items";
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu
} from "./ui/sidebar";
import UserProfile from "./user-profile";
import UserProfileSkeleton from "./user-profile-skeleton";

export default async function Sidebar() {
  const { sessionClaims } = await auth();
  const userRole = sessionClaims?.metadata.role;

  return (
    <ShadcnSidebar>
      <SidebarHeader>
        <Link
          href="/"
          className="flex items-center gap-2 rounded-md bg-zinc-800 p-2 text-lg font-bold transition-colors hover:bg-zinc-800/70 hover:underline"
        >
          <Image
            src="/dog-logo.svg"
            width={32}
            height={32}
            alt="Cachorro em formato animado"
          />
          Pluto Chatbot
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
        <div className="flex items-center gap-3 rounded-md bg-zinc-900 p-2 transition-colors hover:bg-zinc-800">
          <UserProfile
            showNameInReverseOrder
            fallback={<UserProfileSkeleton />}
          />
        </div>
      </SidebarFooter>
    </ShadcnSidebar>
  );
}
