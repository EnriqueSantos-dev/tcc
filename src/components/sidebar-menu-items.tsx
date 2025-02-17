"use client";
import { Role, ROLES } from "@/lib/db/schemas";
import { Component, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { JSX } from "react";
import { SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";

const routes = [
  {
    icon: Component,
    href: "/admin/modules",
    label: "Módulos",
    testRegex: /^\/admin\/modules?(\/.*)?/,
    predicate: (role) => role === ROLES.ADMIN || role === ROLES.MANAGE
  },
  {
    icon: Users,
    href: "/admin/users",
    label: "Usuários",
    predicate: (role) => role === ROLES.ADMIN
  }
] satisfies {
  icon: JSX.ElementType;
  href: string;
  label: string;
  testRegex?: RegExp;
  predicate: (role?: Role) => boolean;
}[];

export default function SidebarMenuItems({ userRole }: { userRole?: Role }) {
  const pathname = usePathname();
  const filteredRoutes = routes.filter((route) => route.predicate(userRole));

  return (
    <>
      {filteredRoutes.map(({ icon: Icon, ...route }) => (
        <SidebarMenuItem key={route.href}>
          <SidebarMenuButton
            asChild
            isActive={
              route.href === pathname || route.testRegex?.test(pathname)
            }
          >
            <Link href={route.href}>
              <Icon className="size-4" />
              {route.label}
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </>
  );
}
