import { navLinks } from "@/constants/nav-links";
import { ROLES } from "@/lib/db/schemas";
import { auth } from "@clerk/nextjs/server";
import { PanelLeft } from "lucide-react";
import Link from "next/link";
import MainNav from "./main-nav";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import UserProfile from "./user-profile";

export default async function MobileMenu() {
  const { sessionClaims } = await auth();

  const links = navLinks.filter(
    (link) =>
      link.href.startsWith("/users") &&
      sessionClaims?.metadata.role !== ROLES.ADMIN
  );

  return (
    <div className="container flex items-center justify-between">
      <Sheet>
        <SheetTrigger>
          <PanelLeft className="size-4" />
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-sidebar-mobile rounded-r-lg px-0 pb-0"
        >
          <aside className="flex h-full flex-col gap-4">
            <Link
              href="/"
              className="px-4 font-medium text-muted-foreground hover:underline"
            >
              Chatboot SIGAA
            </Link>
            <MainNav items={links} className="flex-1 px-4" />
            <UserProfile />
          </aside>
        </SheetContent>
      </Sheet>
      <Link
        href="/"
        className="text-sm font-medium text-muted-foreground hover:underline"
      >
        Chatboot SIGAA
      </Link>
    </div>
  );
}
