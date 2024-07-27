import { text, timestamp } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core/table";
import { nanoid } from "nanoid";
import { rolesEnum } from "./roles-enum";
import { relations } from "drizzle-orm";
import { modules } from "./modules";

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  role: rolesEnum("role").default("BASIC")
});

export const usersRelations = relations(users, ({ many }) => ({
  modules: many(modules)
}));
