"use client";
import { NavItem } from "@/types";
import { Component, Home } from "lucide-react";

export const navLinks: NavItem[] = [
  { href: "/dashboard", label: "Início", icon: Home },
  { label: "Módulos", href: "/modules", icon: Component }
];
