import { navLinks } from "@/constants/nav-links";
import { ROLES } from "@/lib/db/schemas";
import { getCurrentUser } from "@/lib/session";
import { PanelLeft } from "lucide-react";
import Link from "next/link";
import MainNav from "./main-nav";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import UserProfile from "./user-profile";

export default async function MobileMenu() {
  const user = await getCurrentUser();

  const links = navLinks.filter((link) => {
    if (link.href.startsWith("/users") && user.role !== ROLES.ADMIN) {
      return false;
    }
    return true;
  });

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
