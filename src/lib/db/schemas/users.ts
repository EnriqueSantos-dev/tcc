import { relations, sql } from "drizzle-orm";
import { text, timestamp, uniqueIndex, varchar } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core/table";
import { nanoid } from "nanoid";
import { modules } from "./modules";
import { rolesEnum } from "./roles-enum";

export const users = pgTable(
  "users",
  {
    id: varchar("id", { length: 191 })
      .primaryKey()
      .$defaultFn(() => nanoid()),
    clerkUserId: text("clerk_user_id").unique().notNull(),
    firstName: text("first_name"),
    lastName: text("last_name"),
    email: text("email").unique().notNull(),
    image: text("image"),
    role: rolesEnum("role").notNull().default("BASIC"),
    createdAt: timestamp("created_at", { mode: "string" })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => sql`current_timestamp`),
    deletedAt: timestamp("deleted_at", { mode: "string" })
  },
  (t) => ({
    emailIdx: uniqueIndex("email").on(t.email),
    clerkUserIdIdx: uniqueIndex("clerk_user_id").on(t.clerkUserId)
  })
);

export const usersRelations = relations(users, ({ many }) => ({
  modules: many(modules)
}));

export type User = typeof users.$inferSelect;
