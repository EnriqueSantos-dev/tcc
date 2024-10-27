import React from "react";

import Sidebar from "@/components/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import SidebarTrigger from "@/components/sidebar-trigger";

export default function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <Sidebar />
      <main className="grid flex-1 grid-rows-[auto_1fr] overflow-auto">
        <div className="flex h-14 items-center border border-border px-4">
          <SidebarTrigger />
        </div>
        {children}
      </main>
    </SidebarProvider>
  );
}
