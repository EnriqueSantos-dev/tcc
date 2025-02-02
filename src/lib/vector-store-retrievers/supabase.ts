import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { createClient } from "@supabase/supabase-js";
import { VectorStoreRetriever } from "./types";

// @ts-ignore - The error is related from similarity search fn, but i don't this functionality in retriever
export const supabaseVectorStoreRetrieve: VectorStoreRetriever = async ({
  embeddingsProvider,
  config
}) => {
  const client = createClient(
    process.env.SUPABASE_API_URL!,
    process.env.SUPABASE_SECRET_KEY!
  );
  const store = new SupabaseVectorStore(embeddingsProvider, {
    client,
    tableName: "embeddings",
    queryName: "match_documents"
  });
  return store.asRetriever({ ...config, verbose: true });
};
