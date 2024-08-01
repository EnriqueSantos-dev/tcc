import { relations } from "drizzle-orm";
import {
  index,
  jsonb,
  pgTable,
  text,
  varchar,
  vector
} from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { files } from "./files";
import { modules } from "./modules";

export const documents = pgTable(
  "document",
  {
    id: varchar("id", { length: 191 })
      .primaryKey()
      .$defaultFn(() => nanoid()),
    moduleId: text("module_id")
      .references(() => modules.id)
      .notNull(),
    fileId: text("file_id")
      .references(() => files.id)
      .notNull(),
    content: text("content").notNull(),
    metadata: jsonb("metadata"),
    embedding: vector("embedding", { dimensions: 1536 }).notNull()
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
