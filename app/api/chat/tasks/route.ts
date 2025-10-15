import { AuthError, validateAuthAndGetUserId } from "@/lib/auth";
import { ChatTask } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

const ChatTasks: ChatTask[] = [
  {
    title: "Get time",
    icon: "http://192.168.1.200:3064/images/time-tool-icon-64.png",
    prompt: "What is the time now?",
  },
  {
    title: "Get Information",
    icon: "http://192.168.1.200:3064/images/time-tool-icon-64.png",
    prompt: "What is the weather in Tokyo?",
  },
  {
    title: "Get Weather",
    icon: "http://192.168.1.200:3064/images/time-tool-icon-64.png",
    prompt: "What is the weather in Tokyo?",
  },
];

export async function GET(req: NextRequest) {
  try {
    const howManyTasks = 3;
    const userId = await validateAuthAndGetUserId(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const randomTasks = ChatTasks.sort(() => Math.random() - 0.5).slice(
      0,
      howManyTasks
    );
    return NextResponse.json({ tasks: randomTasks });
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
