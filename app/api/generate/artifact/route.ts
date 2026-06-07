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
      'generate-artifact',
      10,
      60
    );
    if (rateLimitResponse) return rateLimitResponse;

    const { prompt, styleInstruction, theme } = await request.json();

    if (!prompt || !styleInstruction) {
      return NextResponse.json(
        { error: 'Prompt and styleInstruction are required' },
        { status: 400 }
      );
    }

    await dbConnect();
    const user = await User.findById(session.userId);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const actionDef = await getActionDefinition('createThemeArtifacts');

    const responseStream = await executeWithFallback(
      user,
      async (genAI, modelId) => {
        const themeString = await getThemeString(theme);
        const artifactPrompt = compilePrompt(actionDef.prompt, {
          prompt,
          styleInstruction,
          theme: themeString,
        });
        return await genAI.models.generateContentStream({
          contents: [{ parts: [{ text: artifactPrompt }], role: 'user' }],
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
          console.error('Artifact streaming error:', error);
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
    console.error('Artifact generation error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
