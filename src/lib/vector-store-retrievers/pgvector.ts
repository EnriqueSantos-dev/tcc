import {
  DistanceStrategy,
  PGVectorStore
} from "@langchain/community/vectorstores/pgvector";
import { PoolConfig } from "pg";
import { VectorStoreRetriever } from "./types";

const dbConfig = {
  postgresConnectionOptions: {
    connectionString: process.env.DATABASE_URL
  } as PoolConfig,
  tableName: "embeddings",
  columns: {
    idColumnName: "id",
    vectorColumnName: "embedding",
    contentColumnName: "content",
    metadataColumnName: "metadata"
  },
  distanceStrategy: "cosine" as DistanceStrategy
};

export const pgVectorStoreRetriever: VectorStoreRetriever = async ({
  embeddingsProvider,
  config
}) => {
  const store = await PGVectorStore.initialize(embeddingsProvider, dbConfig);
  return store.asRetriever({ ...config, verbose: true });
};
