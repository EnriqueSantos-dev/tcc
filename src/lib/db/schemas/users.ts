import { boolean, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core/table";
import { nanoid } from "nanoid";
import { rolesEnum } from "./roles-enum";
import { relations, sql } from "drizzle-orm";
import { modules } from "./modules";
import { sessions } from "./sessions";

export const users = pgTable("user", {
  id: varchar("id", { length: 191 })
    .primaryKey()
    .$defaultFn(() => nanoid()),
  email: text("email").notNull(),
  hash: text("hash"),
  isEmailVerified: boolean("is_email_verified").notNull().default(false),
  image: text("image"),
  role: rolesEnum("role").notNull().default("BASIC"),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" })
    .notNull()
    .defaultNow()
    .$onUpdateFn(() => sql`current_timestamp`)
});

export const usersRelations = relations(users, ({ many }) => ({
  modules: many(modules),
  sessions: many(sessions)
}));

export type User = typeof users.$inferSelect;
