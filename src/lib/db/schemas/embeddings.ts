import { relations } from "drizzle-orm";
import {
  index,
  jsonb,
  pgTable,
  serial,
  text,
  vector
} from "drizzle-orm/pg-core";
import { documents } from "./documents";

export const embeddings = pgTable(
  "embeddings",
  {
    id: serial("id").primaryKey(),
    content: text("content"),
    metadata: jsonb("metadata"),
    embedding: vector("embedding", { dimensions: 1536 }).notNull(),
    documentId: text("document_id")
      .notNull()
      .references(() => documents.id, {
        onDelete: "cascade"
      })
  },
  (table) => ({
    embeddingIndex: index("embeddingIndex").using(
      "hnsw",
      table.embedding.op("vector_cosine_ops")
    )
  })
);

export const embeddingsRelations = relations(embeddings, ({ one }) => ({
  document: one(documents, {
    fields: [embeddings.documentId],
    references: [documents.id]
  })
}));
