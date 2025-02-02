import { pgVectorStoreRetriever } from "./pgvector";
import { supabaseVectorStoreRetrieve } from "./supabase";
import { VectorStoreRetrieverInput } from "./types";

export const getVectorStoreRetriever = async (
  input: VectorStoreRetrieverInput
) => {
  if (process.env.NODE_ENV === "development") {
    return await pgVectorStoreRetriever(input);
  }
  return await supabaseVectorStoreRetrieve(input);
};
