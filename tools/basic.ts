import { tool } from "@langchain/core/tools";
import { z } from "zod";
// import { BraveSearch } from "@langchain/community/tools/brave_search";

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

// export const brave_search = new BraveSearch();
