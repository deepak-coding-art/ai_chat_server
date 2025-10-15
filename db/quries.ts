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

export async function getUserChats(
  userId: string,
  page: number = 1,
  limit: number = 10
): Promise<{ chats: Chat[]; total: number; hasMore: boolean } | null> {
  const supabase = await createSupabaseAdmin();

  // Calculate offset
  const offset = (page - 1) * limit;

  // Get total count
  const { count, error: countError } = await supabase
    .from("chats")
    .select("*", { count: "exact", head: true })
    .eq("created_by", userId);

  if (countError) {
    console.error(countError);
    return null;
  }

  // Get paginated chats
  const { data, error } = await supabase
    .from("chats")
    .select("*")
    .order("created_at", { ascending: false })
    .eq("created_by", userId)
    .range(offset, offset + limit - 1);

  if (error) {
    console.error(error);
    return null;
  }

  const total = count || 0;
  const hasMore = offset + limit < total;

  return {
    chats: data || [],
    total,
    hasMore,
  };
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

export async function deleteChat(chatId: string, userId: string) {
  const supabase = await createSupabaseAdmin();
  const { data, error } = await supabase
    .from("chats")
    .delete()
    .eq("id", chatId)
    .eq("created_by", userId);
  if (error) {
    console.error(error);
    return null;
  }
}

export async function updateChatTitle(chatId: string, title: string) {
  const supabase = await createSupabaseAdmin();
  const { data, error } = await supabase
    .from("chats")
    .update({ title })
    .eq("id", chatId);
  if (error) {
    console.error(error);
    return null;
  }
  if (!data) {
    return null;
  }
  return data;
}
