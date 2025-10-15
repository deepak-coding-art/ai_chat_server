import { tool } from "@langchain/core/tools";
import { z } from "zod";
// import { BraveSearch } from "@langchain/community/tools/brave_search";

const tool_icons = {
  get_date_time: "🕒",
};

export const get_tool_icon = (toolName: string) => {
  const icon = tool_icons.hasOwnProperty(toolName)
    ? tool_icons[toolName as keyof typeof tool_icons]
    : "🔧";
  return icon;
};

export const get_date_time = tool(
  async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const time = new Date().toISOString();
    return time;
  },
  {
    name: "get_date_time",
    description: "Get the current date and time in ISO format",
  }
);

// export const brave_search = new BraveSearch();
