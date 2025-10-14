"use server";

import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { Chat } from "@/lib/types";

export async function createSupabaseAdmin() {
  return createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll: () => [],
        setAll: () => {},
      },
      global: {
        // Add this fetch option
        fetch: (url: RequestInfo | URL, options = {}) => {
          return fetch(url, { ...options, cache: "no-store" });
        },
      },
    }
  );
}

export async function getUserChats(userId: string): Promise<Chat[] | null> {
  const supabase = await createSupabaseAdmin();
  const { data, error } = await supabase
    .from("chats")
    .select("*")
    .eq("created_by", userId);

  if (error) {
    console.error(error);
    return null;
  }
  if (!data) {
    return null;
  }
  return data;
}

export async function createNewChat(userId: string): Promise<Chat | null> {
  const supabase = await createSupabaseAdmin();
  const { data, error } = await supabase
    .from("chats")
    .insert({ created_by: userId })
    .select()
    .single();

  if (error) {
    console.error(error);
    return null;
  }
  if (!data) {
    return null;
  }
  return data;
}

export async function getChatById(
  chatId: string,
  userId: string
): Promise<Chat | null> {
  const supabase = await createSupabaseAdmin();
  const { data, error } = await supabase
    .from("chats")
    .select("*")
    .eq("id", chatId)
    .eq("created_by", userId);
  if (error) {
    console.error(error);
    return null;
  }
  if (!data) {
    return null;
  }
  return data[0];
}
