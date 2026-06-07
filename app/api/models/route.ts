import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

import User, { IApiKey } from '@/models/user.model';
import dbConnect from '@/utils/db.utils';
import { decrypt } from '@/utils/encryption.utils';
import { getSession, unauthorizedResponse } from '@/utils/jwt.utils';

let cachedModels: null | { description?: string; id: string; name: string }[] =
  null;
let lastCacheUpdate: number = 0;
const WEEK_IN_MS = 7 * 24 * 60 * 60 * 1000;

export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request);
    if (!session) {
      return unauthorizedResponse();
    }

    const now = Date.now();
    if (cachedModels && now - lastCacheUpdate < WEEK_IN_MS) {
      return NextResponse.json(cachedModels);
    }

    await dbConnect();

    const user = await User.findById(session.userId);
    if (!user || !user.apiKeys)
      return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const geminiKeys = user.apiKeys.get('gemini') || [];
    const activeKeys = geminiKeys
      .filter((k: IApiKey) => k.status === 'active')
      .sort((a: IApiKey, b: IApiKey) => a.priority - b.priority);

    if (activeKeys.length === 0) {
      return NextResponse.json(
        { error: 'No active Gemini API keys found' },
        { status: 400 }
      );
    }

    const keyObj = activeKeys[0];
    const apiKey = decrypt(keyObj.encryptedKey, keyObj.iv);

    const genAI = new GoogleGenAI({ apiKey });
    const response = await genAI.models.list();

    const models = [];
    for await (const model of response) {
      // Only include gemini models, ignore legacy text-bison etc.
      if (
        model.name &&
        (model.name.includes('gemini') || model.name.includes('learnlm'))
      ) {
        models.push({
          description: model.description,
          id: model.name.replace(/^models\//, ''),
          name: model.displayName || model.name.replace(/^models\//, ''),
        });
      }
    }

    // Sort models by name
    models.sort((a, b) => a.name.localeCompare(b.name));

    cachedModels = models;
    lastCacheUpdate = Date.now();

    return NextResponse.json(models);
  } catch (error) {
    console.error('Models GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch models' },
      { status: 500 }
    );
  }
}
