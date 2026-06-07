import { NextRequest, NextResponse } from 'next/server';

import ActionDefinition from '@/models/action-definition.model';
import dbConnect from '@/utils/db.utils';
import { getSession, unauthorizedResponse } from '@/utils/jwt.utils';

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

    const deletedAction = await ActionDefinition.findByIdAndDelete(id);

    if (!deletedAction) {
      return NextResponse.json({ error: 'Action not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete action error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

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
    const { fallbackModel, model, name, prompt } = body;

    if (!name || !model || !prompt) {
      return NextResponse.json(
        { error: 'Name, model, and prompt are required' },
        { status: 400 }
      );
    }

    await dbConnect();

    const existingAction = await ActionDefinition.findOne({
      _id: { $ne: id },
      name,
    });
    if (existingAction) {
      return NextResponse.json(
        { error: 'Action definition with this name already exists' },
        { status: 400 }
      );
    }

    const updatedAction = await ActionDefinition.findByIdAndUpdate(
      id,
      { fallbackModel, model, name, prompt },
      { new: true }
    );

    if (!updatedAction) {
      return NextResponse.json({ error: 'Action not found' }, { status: 404 });
    }

    return NextResponse.json(updatedAction);
  } catch (error) {
    console.error('Update action error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
