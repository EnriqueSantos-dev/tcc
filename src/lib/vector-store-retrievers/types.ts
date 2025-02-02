import { EmbeddingsInterface } from "@langchain/core/embeddings";
import { VectorStoreRetriever as LangChainVectorStoreRetriever } from "@langchain/core/vectorstores";

export type VectorStoreRetrieverConfig = {
  k?: number | undefined;
  searchType?: "mmr" | "similarity" | undefined;
};

export type VectorStoreRetrieverInput = {
  embeddingsProvider: EmbeddingsInterface;
  config: VectorStoreRetrieverConfig;
};

export type VectorStoreRetriever = (
  input: VectorStoreRetrieverInput
) => Promise<LangChainVectorStoreRetriever>;
