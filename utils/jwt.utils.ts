import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-default-secret-change-this-in-env!!";

export async function getSession(request?: NextRequest | Request) {
  let token: string | undefined;

  if (request instanceof NextRequest) {
    token = request.cookies.get("token")?.value;
  }

  if (!token) {
    try {
      const cookieStore = await cookies();
      token = cookieStore.get("token")?.value;
    } catch {
      // Ignore cookies() error if used outside App Router context
    }
  }

  if (!token) return null;

  const decoded = verifyToken(token);
  if (!decoded || typeof decoded === "string") return null;

  return decoded as { email: string; name: string; userId: string };
}

export function signToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "7d",
  });
}

export function unauthorizedResponse() {
  return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}
