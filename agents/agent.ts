import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatGroq } from "@langchain/groq";
import { PostgresSaver } from "@langchain/langgraph-checkpoint-postgres";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { get_date_time } from "@/tools/basic";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

export const google_model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  maxOutputTokens: 2048,
});

const groq_model = new ChatGroq({
  model: "llama-3.3-70b-versatile",
  temperature: 0,
  maxTokens: 2048,
  maxRetries: 2,
});

type ReactAgentExecutor = ReturnType<typeof createReactAgent>;

export class AgentService {
  private static instance: ReactAgentExecutor | null = null;

  static async get(): Promise<ReactAgentExecutor> {
    if (AgentService.instance) return AgentService.instance;

    const connString = process.env.SUPABASE_DB_URL;
    if (!connString) {
      throw new Error(
        "Missing SUPABASE_DB_URL. Set it to your Supabase Postgres connection string."
      );
    }

    // e.g., SUPABASE_DB_URL="postgres://user:pass@host:5432/postgres?sslmode=require"
    const checkpointSaver = await PostgresSaver.fromConnString(connString);

    AgentService.instance = createReactAgent({
      llm: groq_model,
      tools: [get_date_time],
      checkpointSaver,
    });

    return AgentService.instance;
  }
}

export async function generateThreadTitle(
  userMessage: string,
  response: string
): Promise<string> {
  const titlePrompt = PromptTemplate.fromTemplate(`
  You are a helpful assistant. 
  Given the user's message and the agent's response, generate a concise and descriptive thread title.
  Keep it under 10 words and in plain English.
  
  User message: {user_message}
  Response: {response}
  Title:
  `);

  const filledPrompt = await titlePrompt.format({
    user_message: userMessage,
    response,
  });

  const output = await groq_model.invoke(filledPrompt);
  const title = new StringOutputParser().parse(output.content as string);
  return title;
}
