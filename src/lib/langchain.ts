import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { Document } from "langchain/document";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

type LangchainDocument = Document<Record<string, any>>;

const generateDocsFromTxt = async (
  file: File,
  metadata?: Record<string, string | number>
): Promise<LangchainDocument[]> => {
  const docs = await new TextLoader(file).load();
  const splittedDocuments = await new RecursiveCharacterTextSplitter({
    chunkOverlap: 100,
    chunkSize: 1000
  }).splitDocuments(
    docs.map((doc) => ({
      ...doc,
      ...metadata
    }))
  );
  return splittedDocuments;
};

const generateDocsFromPdf = async (
  file: File,
  metadata?: Record<string, string | number>
): Promise<LangchainDocument[]> => {
  const loader = new PDFLoader(file, {
    splitPages: true,
    parsedItemSeparator: ""
  });
  const docs = await loader.load();
  const splittedDocuments = docs.map((doc) => ({
    ...doc,
    ...metadata
  }));

  return splittedDocuments;
};

const GENERATORS_BY_MIME_TYPE = {
  "text/plain": generateDocsFromTxt,
  "application/pdf": generateDocsFromPdf
};

export async function generateDocuments(
  file: File
): Promise<LangchainDocument[] | null> {
  const fileMimeType = file.type;
  if (!(fileMimeType in GENERATORS_BY_MIME_TYPE)) {
    return null;
  }

  try {
    const generator =
      GENERATORS_BY_MIME_TYPE[
        fileMimeType as keyof typeof GENERATORS_BY_MIME_TYPE
      ];

    return await generator(file);
  } catch (error) {
    console.log("Error generating documents", error);
    return null;
  }
}
