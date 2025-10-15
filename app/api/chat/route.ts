import { AgentService } from "@/agents/agent";
import { createNewChat, getChatById, getUserChats } from "@/db/quries";
import { NextRequest, NextResponse } from "next/server";
import { AuthError, validateAuthAndGetUserId } from "@/lib/auth";
import { z } from "zod";
import { get_tool_icon } from "@/tools/basic";

export async function POST(req: NextRequest) {
  try {
    const userId = await validateAuthAndGetUserId(req);
    const { message, chat_id: chatId } = requestSchema.parse(await req.json());
    let chat_id = chatId;

    if (!chat_id) {
      const chat = await createNewChat(userId);
      if (!chat) {
        return NextResponse.json(
          { error: "Failed to create chat" },
          { status: 500 }
        );
      }
      chat_id = chat.id;
    }
    if (chat_id) {
      const chat = await getChatById(chat_id, userId);
      if (!chat) {
        return NextResponse.json({ error: "Chat not found" }, { status: 404 });
      }
    }

    // Create a ReadableStream for SSE
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Stream events from the agent
          const agent = await AgentService.get();
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
              const toolIcon = get_tool_icon(toolName);
              const data = {
                type: "tool_start",
                tool: toolName,
                tool_icon: toolIcon,
                chat_id: chat_id,
                message: `🔧 Calling ${toolName}...`,
              };
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
              );
            } else if (event.event === "on_tool_end") {
              const toolName = event.name;
              const toolIcon = get_tool_icon(toolName);
              const data = {
                type: "tool_end",
                tool: toolName,
                tool_icon: toolIcon,
                chat_id: chat_id,
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
                  chat_id: chat_id,
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

    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const userId = await validateAuthAndGetUserId(req);
    const chats = await getUserChats(userId);
    return NextResponse.json({
      chats,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

const requestSchema = z.object({
  message: z.string().min(1).max(1000),
  chat_id: z.string().uuid().nullable(),
});
