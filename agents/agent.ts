import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatGroq } from "@langchain/groq";
import { MemorySaver } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { get_date_time, brave_search } from "@/tools/basic";

const checkpointSaver = new MemorySaver();

export const google_model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  maxOutputTokens: 2048,
});

const groq_model = new ChatGroq({
  model: "llama-3.1-8b-instant", //"llama-3.3-70b-versatile",
  temperature: 0,
  maxTokens: 2048,
  maxRetries: 2,
});

export const agent = createReactAgent({
  llm: groq_model,
  tools: [get_date_time],
  checkpointSaver,
});
