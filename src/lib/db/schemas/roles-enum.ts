import { pgEnum } from "drizzle-orm/pg-core";

export const rolesEnum = pgEnum("role", ["ADMIN", "MANAGE", "BASIC"]);

export type Role = (typeof rolesEnum.enumValues)[number];

export const ROLES = {
  ADMIN: "ADMIN",
  MANAGE: "MANAGE",
  BASIC: "BASIC"
} satisfies Record<Role, Role>;
