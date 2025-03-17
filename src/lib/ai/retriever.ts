import { CallbackManagerForRetrieverRun } from "@langchain/core/callbacks/manager";
import { DocumentInterface } from "@langchain/core/documents";
import { BaseRetriever } from "@langchain/core/retrievers";
import { findRelevantContent } from "./embeddings";

export class Retriever extends BaseRetriever {
  lc_namespace = ["my_custom_retriever"];
  verbose = true;

  async _getRelevantDocuments(
    _query: string,
    _callbacks?: CallbackManagerForRetrieverRun
  ): Promise<DocumentInterface<Record<string, any>>[]> {
    const similarDocs = await findRelevantContent({
      query: _query,
      k: 5,
      score: 0.5
    });

    return similarDocs.map(
      (doc) =>
        ({
          id: `${doc.id}`,
          metadata: doc.metadata as Record<string, any>,
          pageContent: doc.content as string
        }) satisfies DocumentInterface
    );
  }
}
