import { embeddings } from "@/lib/db/schemas";
import { openai } from "@ai-sdk/openai";
import { embed, embedMany } from "ai";
import { cosineDistance, desc, gt, sql } from "drizzle-orm";
import { db } from "../db";

const embeddingModel = openai.embedding("text-embedding-3-small");

const generateChunks = (input: string): string[] => {
  return input
    .trim()
    .split(".")
    .filter((i) => i !== "");
};

export const generateEmbeddings = async (
  value: string
): Promise<Array<{ embedding: number[]; content: string }>> => {
  const chunks = generateChunks(value);
  const { embeddings } = await embedMany({
    model: embeddingModel,
    values: chunks
  });
  return embeddings.map((e, i) => ({ content: chunks[i], embedding: e }));
};

export const generateEmbedding = async (value: string): Promise<number[]> => {
  const input = value.replaceAll("\\n", " ");
  const { embedding } = await embed({
    model: embeddingModel,
    value: input
  });
  return embedding;
};

/**
 *
 * @param userQuery the user query
 * @param score the minimum score to consider a document relevant. Default is 0.5
 * @param k the number of documents to return. Default is 5
 */
export const findRelevantContent = async ({
  query,
  k = 5,
  score = 0.5
}: {
  query: string;
  score?: number;
  k?: number;
}) => {
  const userQueryEmbedded = await generateEmbedding(query);

  const similarity = sql<number>`1 - (${cosineDistance(
    embeddings.embedding,
    userQueryEmbedded
  )})`;
  const similarGuides = await db
    .select({
      id: embeddings.id,
      metadata: embeddings.metadata,
      content: embeddings.content,
      similarity
    })
    .from(embeddings)
    .where(gt(similarity, score))
    .orderBy((t) => desc(t.similarity))
    .limit(k);

  return similarGuides;
};
