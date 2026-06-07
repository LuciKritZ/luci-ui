import { NextRequest, NextResponse } from 'next/server';

import ActionDefinition from '@/models/action-definition.model';
import dbConnect from '@/utils/db.utils';
import { getSession, unauthorizedResponse } from '@/utils/jwt.utils';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request);
    if (!session) {
      return unauthorizedResponse();
    }

    await dbConnect();

    const actions = await ActionDefinition.find().sort({ createdAt: -1 });
    return NextResponse.json(actions);
  } catch (error) {
    console.error('Fetch actions error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
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

    const body = await request.json();
    const { fallbackModel, model, name, prompt } = body;

    if (!name || !model || !prompt) {
      return NextResponse.json(
        { error: 'Name, model, and prompt are required' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Check if name already exists
    const existingAction = await ActionDefinition.findOne({ name });
    if (existingAction) {
      return NextResponse.json(
        { error: 'Action definition with this name already exists' },
        { status: 400 }
      );
    }

    const newAction = new ActionDefinition({
      fallbackModel,
      model,
      name,
      prompt,
    });

    await newAction.save();
    return NextResponse.json(newAction, { status: 201 });
  } catch (error) {
    console.error('Create action error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
