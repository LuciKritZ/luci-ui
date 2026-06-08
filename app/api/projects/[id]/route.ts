import { NextRequest, NextResponse } from "next/server";

import Project from "@/models/project.model";
import dbConnect from "@/utils/db.utils";
import { getSession, unauthorizedResponse } from "@/utils/jwt.utils";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession(request);
    if (!session) {
      return unauthorizedResponse();
    }

    const { id } = await params;
    await dbConnect();
    const project = await Project.findOneAndDelete({
      _id: id,
      userId: session.userId,
    });
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("API delete project error:", error);
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }
}

export async function PATCH(
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
    await dbConnect();
    const project = await Project.findOneAndUpdate(
      { _id: id, userId: session.userId },
      body,
      {
        returnDocument: "after",
        runValidators: true,
      }
    );
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    return NextResponse.json(project);
  } catch (error) {
    console.error("API update project error:", error);
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 }
    );
  }
}
