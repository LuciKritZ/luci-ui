import { NextRequest, NextResponse } from 'next/server';

import Theme from '@/models/theme.model';
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

    const theme = await Theme.findOne({ _id: id, userId: session.userId });

    if (!theme) {
      return NextResponse.json({ error: 'Theme not found' }, { status: 404 });
    }

    await Theme.deleteOne({ _id: id });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete theme error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
