import { NextResponse } from 'next/server';

import Project from '@/models/project.model';
import dbConnect from '@/utils/db.utils';
import { getSession, unauthorizedResponse } from '@/utils/jwt.utils';

export async function GET(request: Request) {
  try {
    const session = await getSession(request);
    if (!session) {
      return unauthorizedResponse();
    }

    await dbConnect();
    const projects = await Project.find({ userId: session.userId }).sort({
      lastEdited: -1,
    });
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Projects GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession(request);
    if (!session) {
      return unauthorizedResponse();
    }

    const body = await request.json();
    body.userId = session.userId;

    await dbConnect();
    const project = await Project.create(body);
    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error('Projects POST error:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}
