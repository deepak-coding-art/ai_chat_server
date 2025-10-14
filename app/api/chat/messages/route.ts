import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { AgentService } from "@/agents/agent";
import { AuthError, validateAuthAndGetUserId } from "@/lib/auth";
import { getChatById } from "@/db/quries";

const querySchema = z.object({
  chat_id: z.string().uuid(),
});

export async function GET(req: NextRequest) {
  try {
    const userId = await validateAuthAndGetUserId(req);
    const { searchParams } = new URL(req.url);
    const chat_id = searchParams.get("chat_id");
    const { chat_id: parsedThreadId } = querySchema.parse({ chat_id });
    const chat = await getChatById(parsedThreadId, userId);
    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    const agent = await AgentService.get();
    // Read current state for the thread from the graph's checkpointer
    const state = await agent.getState({
      configurable: { chat_id: parsedThreadId },
    });

    // LangGraph state places messages on state.values.messages in v2
    const rawMessages: any[] =
      (state as any)?.values?.messages ?? (state as any)?.messages ?? [];

    const getRole = (msg: any): string => {
      const runtimeType =
        (msg as any)?._getType?.() ?? (msg as any)?.getType?.();
      if (runtimeType === "human") return "user";
      if (runtimeType === "ai") return "assistant";
      if (runtimeType === "system") return "system";
      if (runtimeType === "tool") return "tool";

      const idArr: any[] | undefined = Array.isArray(msg?.id)
        ? msg.id
        : undefined;
      const typeStr = idArr?.[idArr.length - 1] as string | undefined;
      if (typeStr?.includes("HumanMessage")) return "user";
      if (typeStr?.includes("AIMessage")) return "assistant";
      if (typeStr?.includes("SystemMessage")) return "system";
      if (typeStr?.includes("ToolMessage")) return "tool";
      return "assistant";
    };

    const isChunk = (msg: any): boolean => {
      const idArr: any[] | undefined = Array.isArray(msg?.id)
        ? msg.id
        : undefined;
      const typeStr = idArr?.[idArr.length - 1] as string | undefined;
      return !!typeStr && typeStr.endsWith("Chunk");
    };

    const getId = (msg: any): string => {
      return (
        (msg as any)?.id?.toString?.() ||
        (msg as any)?.kwargs?.id ||
        (globalThis as any).crypto?.randomUUID?.() ||
        Math.random().toString(36).slice(2)
      );
    };

    const extractText = (msg: any): string => {
      const content = (msg as any)?.content ?? (msg as any)?.kwargs?.content;
      if (typeof content === "string") return content;
      if (Array.isArray(content)) {
        const parts = content
          .map((part: any) =>
            typeof part === "string"
              ? part
              : typeof part?.text === "string"
              ? part.text
              : typeof part?.content === "string"
              ? part.content
              : ""
          )
          .filter(Boolean);
        return parts.join("");
      }
      return "";
    };

    const messages = rawMessages
      .filter((m) => !isChunk(m))
      .map((m) => ({ id: getId(m), role: getRole(m), content: extractText(m) }))
      .filter(
        (m) =>
          (m.role === "user" || m.role === "assistant") &&
          typeof m.content === "string" &&
          m.content.trim().length > 0
      );

    return NextResponse.json({ chat_id: parsedThreadId, messages });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
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
