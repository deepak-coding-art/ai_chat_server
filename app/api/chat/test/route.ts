import { agent } from "@/agents/agent";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function POST(req: NextRequest) {
  try {
    const { message, chat_id } = requestSchema.parse(await req.json());

    // Create a ReadableStream for SSE
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Stream events from the agent
          const eventStream = agent.streamEvents(
            {
              messages: [
                {
                  role: "user",
                  content: message,
                },
              ],
            },
            {
              configurable: { thread_id: chat_id },
              version: "v2",
            }
          );

          for await (const event of eventStream) {
            // Send different types of events based on the event type
            if (event.event === "on_tool_start") {
              const toolName = event.name;
              const data = {
                type: "tool_start",
                tool: toolName,
                message: `🔧 Calling ${toolName}...`,
              };
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
              );
            } else if (event.event === "on_tool_end") {
              const toolName = event.name;
              const data = {
                type: "tool_end",
                tool: toolName,
                message: `✅ Finished ${toolName}`,
                // output: event.data?.output,
              };
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
              );
            } else if (event.event === "on_chat_model_stream") {
              // Stream LLM tokens as they come
              const chunk = event.data?.chunk;
              if (chunk?.content) {
                const data = {
                  type: "token",
                  content: chunk.content,
                };
                controller.enqueue(
                  encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
                );
              }
            } else if (
              event.event === "on_chain_end" &&
              event.name === "LangGraph"
            ) {
              // Final response
              const finalMessage =
                event.data?.output?.messages?.at(-1)?.content;
              const data = {
                type: "final",
                message: finalMessage,
                chat_id: chat_id,
              };
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
              );
            }
          }

          controller.close();
        } catch (error) {
          console.error("Stream error:", error);
          const errorData = {
            type: "error",
            message: "An error occurred during processing",
          };
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(errorData)}\n\n`)
          );
          controller.close();
        }
      },
    });

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error(error);

    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Validation error",
          details: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

const requestSchema = z.object({
  message: z.string().min(1).max(1000),
  chat_id: z.string().uuid(),
});
