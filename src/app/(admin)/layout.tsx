import React from "react";

import MobileMenu from "@/components/mobile-menu";
import Sidebar from "@/components/sidebar";

export default function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid h-full max-h-dvh grid-rows-[auto_1fr] overflow-hidden md:grid-cols-desktop-layout md:grid-rows-none md:bg-muted md:dark:bg-background">
      <header className="h-14 border-b border-border py-4 md:hidden">
        <MobileMenu />
      </header>
      <Sidebar />
      <main className="overflow-auto md:p-3">
        <div className="h-full overflow-auto bg-background scrollbar-thin scrollbar-track-muted scrollbar-thumb-muted-foreground scrollbar-track-rounded-full scrollbar-thumb-rounded-full dark:scrollbar-track-zinc-900 dark:scrollbar-thumb-zinc-700 md:rounded-sm md:border md:border-border md:dark:bg-zinc-900">
          {children}
        </div>
      </main>
    </div>
  );
}
