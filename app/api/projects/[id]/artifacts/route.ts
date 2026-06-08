import { NextRequest, NextResponse } from "next/server";

import Project from "@/models/project.model";
import dbConnect from "@/utils/db.utils";
import { getSession, unauthorizedResponse } from "@/utils/jwt.utils";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession(request);
    if (!session) {
      return unauthorizedResponse();
    }

    const { id } = await params;
    const body = await request.json();
    if (!body || !Array.isArray(body.artifacts)) {
      return NextResponse.json(
        { error: "Invalid request: artifacts must be an array" },
        { status: 400 }
      );
    }

    await dbConnect();

    const updatedProject = await Project.findOneAndUpdate(
      { _id: id, userId: session.userId },
      { $set: { artifacts: body.artifacts, updatedAt: Date.now() } },
      { new: true }
    );

    if (!updatedProject) {
      return NextResponse.json(
        { error: "Project not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      artifacts: updatedProject.artifacts,
      success: true,
    });
  } catch (error) {
    console.error("Update project artifacts error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
