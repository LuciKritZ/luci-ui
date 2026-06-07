import { NextRequest, NextResponse } from 'next/server';

import User from '@/models/user.model';
import dbConnect from '@/utils/db.utils';
import {
  compilePrompt,
  executeWithFallback,
  getActionDefinition,
} from '@/utils/genai.utils';
import { getSession, unauthorizedResponse } from '@/utils/jwt.utils';
import { enforceRateLimit } from '@/utils/ratelimit.utils';
import { getThemeString } from '@/utils/theme.utils';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession(request);
    if (!session) {
      return unauthorizedResponse();
    }

    const rateLimitResponse = await enforceRateLimit(
      session.userId,
      'generate-variations',
      10,
      60
    );
    if (rateLimitResponse) return rateLimitResponse;

    const { prompt, theme } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    await dbConnect();
    const user = await User.findById(session.userId);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const actionDef = await getActionDefinition('createThemeVariations');

    const responseStream = await executeWithFallback(
      user,
      async (genAI, modelId) => {
        const themeString = await getThemeString(theme);
        const stylePrompt = compilePrompt(actionDef.prompt, {
          prompt,
          theme: themeString,
        });
        return await genAI.models.generateContentStream({
          config: { temperature: 1.2 },
          contents: [{ parts: [{ text: stylePrompt }], role: 'user' }],
          model: modelId,
        });
      },
      actionDef.model,
      actionDef.fallbackModel
    );

    const stream = new ReadableStream({
      async start(controller) {
        try {
          const encoder = new TextEncoder();
          for await (const chunk of responseStream) {
            if (chunk.text) {
              controller.enqueue(encoder.encode(chunk.text));
            }
          }
        } catch (error) {
          console.error('Variations streaming error:', error);
          controller.error(error);
        } finally {
          controller.close();
        }
      },
    });

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    });
  } catch (error) {
    console.error('Variations generation error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
