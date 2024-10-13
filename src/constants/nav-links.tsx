import { NavItem } from "@/types";
import { Component, UsersIcon } from "lucide-react";

const iconStyle = "mb-0.5 size-4";

export const navLinks: NavItem[] = [
  {
    label: "Módulos",
    href: "/modules",
    icon: <Component className={iconStyle} />
  },
  {
    label: "Usuários",
    href: "/users",
    icon: <UsersIcon className={iconStyle} />
  }
];
