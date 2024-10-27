import { pgEnum } from "drizzle-orm/pg-core";

export const rolesEnum = pgEnum("role", ["ADMIN", "MANAGE", "BASIC"]);

export type Role = (typeof rolesEnum.enumValues)[number];

export const ROLES = {
  ADMIN: "ADMIN",
  MANAGE: "MANAGE",
  BASIC: "BASIC"
} satisfies Record<Role, Role>;

export const ROLES_INFO: Record<
  Exclude<keyof typeof ROLES, "ADMIN">,
  { abilities: string[] }
> = {
  BASIC: {
    abilities: ["Não possui permissões especiais."]
  },
  MANAGE: {
    abilities: ["Gerencia documentos e módulos criados por ELE (a)."]
  }
};
