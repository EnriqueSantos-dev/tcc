import { LangChainAdapter } from "ai";
import { NextRequest, NextResponse } from "next/server";

import {
  answerPrompt,
  combineDocumentsFn,
  condenseQuestionPrompt,
  formatVercelMessages
} from "@/lib/ai/prompts";
import { Retriever } from "@/lib/ai/retriever";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import { ChatOpenAI } from "@langchain/openai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messages = body.messages ?? [];
    const previousMessages = messages.slice(0, -1);
    const currentMessageContent = messages[messages.length - 1].content;

    const model = new ChatOpenAI({
      model: "gpt-4o-mini",
      temperature: 0.5
    });

    const standaloneQuestionChain = RunnableSequence.from([
      condenseQuestionPrompt,
      model,
      new StringOutputParser()
    ]);

    const retriever = new Retriever();
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
  } catch (error: any) {
    console.log("error /api/chat", error);

    return new NextResponse("internal server error", { status: 500 });
  }
}
