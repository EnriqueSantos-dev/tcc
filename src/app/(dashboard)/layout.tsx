import React from "react";

import Sidebar from "@/components/sidebar";
import SidebarTrigger from "@/components/sidebar-trigger";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <Sidebar />
      <main className="grid flex-1 grid-rows-[auto_1fr] overflow-auto">
        <div className="flex h-12 items-center border-b border-border px-4">
          <SidebarTrigger />
        </div>
        {children}
      </main>
    </SidebarProvider>
  );
}
