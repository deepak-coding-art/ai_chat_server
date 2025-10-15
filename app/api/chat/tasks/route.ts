import { AuthError, validateAuthAndGetUserId } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { ChatTasks } from "@/tools/basic";

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
