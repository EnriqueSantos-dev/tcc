import { InferSelectModel, relations, sql } from "drizzle-orm";
import { pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { documents } from "./documents";
import { users } from "./users";

export const modules = pgTable("module", {
  id: varchar("id", { length: 191 })
    .primaryKey()
    .$defaultFn(() => nanoid()),
  name: varchar("name", { length: 200 }).notNull(),
  description: text("description"),
  userId: text("user_id")
    .references(() => users.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const modulesRelations = relations(modules, ({ one, many }) => ({
  user: one(users, {
    fields: [modules.userId],
    references: [users.id]
  }),
  documents: many(documents)
}));

export type Module = InferSelectModel<typeof modules>;
