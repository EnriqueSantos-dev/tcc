import { pgEnum } from "drizzle-orm/pg-core";

export const rolesEnum = pgEnum("role", ["ADMIN", "MANAGE", "BASIC"]);
