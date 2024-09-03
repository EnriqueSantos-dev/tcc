import { InferSelectModel, relations, sql } from "drizzle-orm";
import {
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  varchar,
  vector
} from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { files } from "./files";
import { modules } from "./modules";
import { users } from "./users";

export const documents = pgTable(
  "document",
  {
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
    content: text("content").notNull(),
    metadata: jsonb("metadata"),
    embedding: vector("embedding", { dimensions: 1536 }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => sql`current_timestamp`)
  },
  (table) => ({
    embeddingIndex: index("embeddingIndex").using(
      "hnsw",
      table.embedding.op("vector_cosine_ops")
    )
  })
);

export const documentsRelations = relations(documents, ({ one }) => ({
  module: one(modules, {
    fields: [documents.moduleId],
    references: [modules.id]
  }),
  file: one(files, {
    fields: [documents.fileId],
    references: [files.id]
  })
}));

export type Document = InferSelectModel<typeof documents>;
