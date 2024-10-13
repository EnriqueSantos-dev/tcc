"use client";
import React from "react";

import Link from "next/link";

import { NavItem } from "@/types";

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { buttonVariants } from "./ui/button";

type MainNavProps = React.ComponentProps<"nav"> & {
  items: NavItem[];
};

export default function MainNav({ items, ...props }: MainNavProps) {
  const pathname = usePathname();

  return (
    <nav className="bg-background" {...props}>
      <ul className="flex flex-col">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              data-active={pathname === item.href}
              className={cn(
                buttonVariants({
                  variant: "link",
                  className:
                    "flex items-center justify-start gap-2 px-0 text-sm text-muted-foreground data-[active=true]:text-foreground"
                })
              )}
            >
              {item.icon}
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
