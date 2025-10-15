import { tool } from "@langchain/core/tools";
import { ChatTask } from "@/lib/types";
import { z } from "zod";
import { WikipediaQueryRun } from "@langchain/community/tools/wikipedia_query_run";
// import { BraveSearch } from "@langchain/community/tools/brave_search";

export const ChatTasks: ChatTask[] = [
  {
    name: "get_date_time",
    title: "Get time",
    icon: "http://192.168.1.200:3064/images/time-tool-icon-64.png",
    emoji: "🕒",
    prompt: "What is the time now?",
  },
  {
    name: "get_weather",
    title: "Get Weather",
    icon: "http://192.168.1.200:3064/images/time-tool-icon-64.png",
    prompt: "What is the weather in Tokyo?",
  },
  {
    name: "WikipediaQueryRun",
    title: "Wikipedia",
    emoji: "🌐",
    icon: "http://192.168.1.200:3064/images/wikipedia-tool-icon-64.png",
    prompt: "Search Wikipedia about LangChain",
  },
];

export const get_tool_icon = (toolName: string) => {
  let icon = "🔧";
  ChatTasks.forEach((t) => {
    if (t.name === toolName) {
      icon = t.emoji ?? icon;
      icon = t.icon ?? icon;
    }
  });
  return icon;
};

export const get_date_time = tool(
  async () => {
    const time = new Date().toISOString();
    return time;
  },
  {
    name: "get_date_time",
    description: "Get the current date and time in ISO format",
  }
);

// Internal runner
export const wikipediaRunner = new WikipediaQueryRun({
  topKResults: 3,
  maxDocContentLength: 1000,
});
