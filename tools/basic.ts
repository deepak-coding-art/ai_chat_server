import { tool } from "@langchain/core/tools";
import { ChatTask } from "@/lib/types";
import { z } from "zod";
import { WikipediaQueryRun } from "@langchain/community/tools/wikipedia_query_run";
import { SERPGoogleScholarAPITool } from "@langchain/community/tools/google_scholar";
// import { BraveSearch } from "@langchain/community/tools/brave_search";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const ChatTasks: ChatTask[] = [
  {
    name: "get_date_time",
    title: "Get time",
    icon: `${BASE_URL}/images/time-tool-icon-64.png`,
    emoji: "🕒",
    prompt: "What is the time now?",
  },

  {
    name: "wikipedia_with_citations",
    title: "Wikipedia",
    emoji: "🌐",
    icon: `${BASE_URL}/images/wikipedia-tool-icon-64.png`,
    prompt: "Search Wikipedia about LangChain",
  },

  {
    name: "SERPGoogleScholarAPITool",
    title: "Google Scholar",
    emoji: "📚",
    icon: `${BASE_URL}/images/google-scholar-tool-icon-64.png`,
    prompt: "Search Google Scholar for research papers about machine learning",
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

// Enhanced Wikipedia tool with citations
export const wikipediaWithCitations = tool(
  async (input: { query: string }) => {
    try {
      // Create a temporary WikipediaQueryRun instance to access the internal methods
      const tempWiki = new WikipediaQueryRun({
        topKResults: 3,
        maxDocContentLength: 1000,
      });

      // Get search results
      const searchResults = await (tempWiki as any)._fetchSearchResults(
        input.query
      );

      if (
        !searchResults.query?.search ||
        searchResults.query.search.length === 0
      ) {
        return "No relevant Wikipedia articles found for this query.";
      }

      // Format the response with citations
      let response = "Here's what I found from Wikipedia:\n\n";

      for (let i = 0; i < Math.min(3, searchResults.query.search.length); i++) {
        const page = searchResults.query.search[i].title;
        const pageDetails = await (tempWiki as any)._fetchPage(page, true);

        if (pageDetails && pageDetails.extract) {
          // Create the Wikipedia URL for the page
          const pageUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(
            page.replace(/ /g, "_")
          )}`;

          response += `**${page}**\n`;
          response += `${pageDetails.extract}\n`;
          response += `Source: ${pageUrl}\n\n`;
        }
      }

      return response;
    } catch (error) {
      return `Error searching Wikipedia: ${
        error instanceof Error ? error.message : "Unknown error"
      }`;
    }
  },
  {
    name: "wikipedia_with_citations",
    description:
      "Search Wikipedia and return results with proper citations and source URLs",
    schema: z.object({
      query: z.string().describe("The search query for Wikipedia"),
    }),
  }
);

// Google Scholar tool for research papers
export const googleScholarTool = new SERPGoogleScholarAPITool({
  apiKey: process.env.SERPAPI_API_KEY,
});
