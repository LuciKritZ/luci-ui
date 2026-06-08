import { NextResponse } from "next/server";

import User from "@/models/user.model";
import dbConnect from "@/utils/db.utils";
import { getSession, unauthorizedResponse } from "@/utils/jwt.utils";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return unauthorizedResponse();
    }

    await dbConnect();
    const user = await User.findById(session.userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Auth me error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
