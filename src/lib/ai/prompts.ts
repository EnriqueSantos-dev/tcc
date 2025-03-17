import { PromptTemplate } from "@langchain/core/prompts";
import { Message as VercelChatMessage } from "ai";
import { Document } from "langchain/document";

export const CONDENSE_QUESTION_TEMPLATE = `Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question, in its original language.

<chat_history>
  {chat_history}
</chat_history>

Follow Up Input: {question}
Standalone question:`;

export const condenseQuestionPrompt = PromptTemplate.fromTemplate(
  CONDENSE_QUESTION_TEMPLATE
);

export const ANSWER_TEMPLATE = `Você é um especialista no sistema SIGAA (Sistema Integrado de Gestão de Atividades Acadêmicas
) da UFAL (Universidade Federal de Alagoas) e está ajudando um estudante com dúvidas sobre o sistema. Como especialista, você deve responder a pergunta do estudante, fornecendo informações claras e precisas com base no contexto fornecido.

# Instruções
- Caso você não saiba a resposta para uma pergunta, você pode dizer que não sabe.
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

export const answerPrompt = PromptTemplate.fromTemplate(ANSWER_TEMPLATE);

export const combineDocumentsFn = (docs: Document[]) => {
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

export const formatVercelMessages = (chatHistory: VercelChatMessage[]) => {
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
