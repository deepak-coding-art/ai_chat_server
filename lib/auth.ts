import { NextRequest } from "next/server";

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}

export async function validateAuthAndGetUserId(
  request: NextRequest
): Promise<string> {
  const authHeader = request.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AuthError("No valid authorization header");
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    // Validate token with Supabase
    const supabaseUrl = process.env.SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_ANON_KEY!;

    const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
        apikey: supabaseKey,
      },
    });

    if (!response.ok) {
      throw new AuthError("Invalid token");
    }

    const user = await response.json();

    if (!user.id) {
      throw new AuthError("No user ID in token");
    }

    return user.id;
  } catch (error) {
    if (error instanceof AuthError) throw error;
    throw new AuthError(`Token validation failed: ${error}`);
  }
}
