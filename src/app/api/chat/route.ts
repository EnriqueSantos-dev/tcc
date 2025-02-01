import { LangChainAdapter, Message as VercelChatMessage } from "ai";
import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@supabase/supabase-js";

import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { Document } from "@langchain/core/documents";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";

export const runtime = "edge";

const combineDocumentsFn = (docs: Document[]) => {
  const serializedDocs = docs.map(
    (doc) => `
    <Início do Documento>
      Título: ${doc.metadata.fileName}
      URL: ${doc.metadata.fileUrl}
      Conteúdo: ${doc.pageContent}
    <Fim do Documento>
    `
  );
  return serializedDocs.join("\n\n");
};

const formatVercelMessages = (chatHistory: VercelChatMessage[]) => {
  const formattedDialogueTurns = chatHistory.map((message) => {
    if (message.role === "user") {
      return `Usuário: ${message.content}`;
    } else if (message.role === "assistant") {
      return `IA: ${message.content}`;
    } else {
      return `${message.role}: ${message.content}`;
    }
  });
  return formattedDialogueTurns.join("\n");
};

const CONDENSE_QUESTION_TEMPLATE = `Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question, in its original language.

<chat_history>
  {chat_history}
</chat_history>

Follow Up Input: {question}
Standalone question:`;
const condenseQuestionPrompt = PromptTemplate.fromTemplate(
  CONDENSE_QUESTION_TEMPLATE
);

const ANSWER_TEMPLATE = `Você é um especialista no sistema SIGAA (Sistema Integrado de Gestão de Atividades Acadêmicas
) da UFAL (Universidade Federal de Alagoas) e está ajudando um estudante com dúvidas sobre o sistema. Como especialista, você deve responder a pergunta do estudante, fornecendo informações claras e precisas com base no contexto fornecido.

# Instruções
- Caso você não saiba a resposta para uma pergunta, você pode dizer que não sabe. E no final sugira que o estudante procure a coordenação do curso para obter mais informações.
- Responda a pergunta somente com base no contexto fornecido.
- Se a pergunta do usuário foi respondida com alguma informação proveniente do contexto então forneça as fontes utilizadas para responder a pergunta. Com o seguinte formato:
  Referências:
  - [Titulo do documento (sem alterações)](url do documento) 
  - [Titulo do documento (sem alterações)](url do documento)

<contexto>
  {context}
</contexto>

<histórico>
  {chat_history}
</histórico>

Pergunta: {question}
`;
const answerPrompt = PromptTemplate.fromTemplate(ANSWER_TEMPLATE);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messages = body.messages ?? [];
    const previousMessages = messages.slice(0, -1);
    const currentMessageContent = messages[messages.length - 1].content;

    const model = new ChatOpenAI({
      model: "gpt-4o-mini",
      temperature: 0.7
    });

    const client = createClient(
      process.env.SUPABASE_API_URL!,
      process.env.SUPABASE_SECRET_KEY!
    );
    const vectorStore = new SupabaseVectorStore(new OpenAIEmbeddings(), {
      client,
      tableName: "embeddings",
      queryName: "match_documents"
    });

    const standaloneQuestionChain = RunnableSequence.from([
      condenseQuestionPrompt,
      model,
      new StringOutputParser()
    ]);

    const retriever = vectorStore.asRetriever({
      k: 5
    });

    const retrievalChain = retriever.pipe(combineDocumentsFn);

    const answerChain = RunnableSequence.from([
      {
        context: RunnableSequence.from([
          (input) => input.question,
          retrievalChain
        ]),
        chat_history: (input) => input.chat_history,
        question: (input) => input.question
      },
      answerPrompt,
      model
    ]);

    const conversationalRetrievalQAChain = RunnableSequence.from([
      {
        question: standaloneQuestionChain,
        chat_history: (input) => input.chat_history
      },
      answerChain,
      new StringOutputParser()
    ]);

    const stream = await conversationalRetrievalQAChain.stream({
      question: currentMessageContent,
      chat_history: formatVercelMessages(previousMessages)
    });

    return LangChainAdapter.toDataStreamResponse(stream);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: e.status ?? 500 });
  }
}
