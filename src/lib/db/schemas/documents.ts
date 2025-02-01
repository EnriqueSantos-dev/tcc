import { InferSelectModel, relations, sql } from "drizzle-orm";
import { pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { embeddings } from "./embeddings";
import { files } from "./files";
import { modules } from "./modules";
import { users } from "./users";

export const documents = pgTable("documents", {
  id: varchar("id", { length: 191 })
    .primaryKey()
    .$defaultFn(() => nanoid()),
  name: varchar("name", { length: 255 }).notNull(),
  description: varchar("description", { length: 255 }),
  ownerId: text("owner_id")
    .references(() => users.id)
    .notNull(),
  moduleId: text("module_id")
    .references(() => modules.id, {
      onDelete: "cascade"
    })
    .notNull(),
  fileId: text("file_id").references(() => files.id),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" })
    .notNull()
    .defaultNow()
    .$onUpdateFn(() => sql`current_timestamp`)
});

export const documentsRelations = relations(documents, ({ one, many }) => ({
  module: one(modules, {
    fields: [documents.moduleId],
    references: [modules.id]
  }),
  owner: one(users, {
    fields: [documents.ownerId],
    references: [users.id]
  }),
  file: one(files, {
    fields: [documents.fileId],
    references: [files.id]
  }),
  embeddings: many(embeddings)
}));

export type Document = InferSelectModel<typeof documents>;
