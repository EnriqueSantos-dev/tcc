import { navLinks } from "@/constants/nav-links";
import MainNav from "./main-nav";
import UserProfile from "./user-profile";

export default function Sidebar() {
  return (
    <aside className="hidden space-y-4 pt-6 md:flex md:flex-col">
      <h3 className="px-4 font-bold text-muted-foreground">Chatboot SIGAA</h3>
      <MainNav items={navLinks} className="flex-1 px-4" />
      <UserProfile />
    </aside>
  );
}
