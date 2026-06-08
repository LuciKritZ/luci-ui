import { NextRequest, NextResponse } from "next/server";

import Theme from "@/models/theme.model";
import dbConnect from "@/utils/db.utils";
import { getSession, unauthorizedResponse } from "@/utils/jwt.utils";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request);
    if (!session) {
      return unauthorizedResponse();
    }

    await dbConnect();

    const themes = await Theme.find({ userId: session.userId }).sort({
      createdAt: -1,
    });
    return NextResponse.json(themes);
  } catch (error) {
    console.error("Fetch themes error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession(request);
    if (!session) {
      return unauthorizedResponse();
    }

    const themeData = await request.json();

    await dbConnect();

    const newTheme = await Theme.create({
      ...themeData,
      userId: session.userId,
    });

    return NextResponse.json(newTheme);
  } catch (error) {
    console.error("Save theme error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
