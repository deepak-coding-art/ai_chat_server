import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatGroq } from "@langchain/groq";
import { PostgresSaver } from "@langchain/langgraph-checkpoint-postgres";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { get_date_time } from "@/tools/basic";

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
