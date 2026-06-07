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
      'generate-styles',
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

    const actionDef = await getActionDefinition('createStyles');

    const result = await executeWithFallback(
      user,
      async (genAI, modelId) => {
        const themeString = await getThemeString(theme);
        const stylePrompt = compilePrompt(actionDef.prompt, {
          prompt,
          theme: themeString,
        });
        return await genAI.models.generateContent({
          config: {
            responseMimeType: 'application/json',
          },
          contents: [{ parts: [{ text: stylePrompt }], role: 'user' }],
          model: modelId,
        });
      },
      actionDef.model,
      actionDef.fallbackModel
    );

    const text = result.text ?? '';
    if (!text) {
      return NextResponse.json(
        { error: 'AI returned no response' },
        { status: 500 }
      );
    }

    let generatedStyles = [];
    try {
      const jsonContent = text.replace(/```json\n?|```/g, '').trim();
      generatedStyles = JSON.parse(jsonContent);
      if (!Array.isArray(generatedStyles) || generatedStyles.length < 3) {
        throw new Error('Invalid array returned');
      }
    } catch (parseError) {
      console.error(
        'Failed to parse AI response for styles:',
        text,
        parseError
      );
      generatedStyles = [
        'Primary Pigment Gridwork',
        'Tactile Risograph Layering',
        'Kinetic Silhouette Balance',
      ];
    }

    return NextResponse.json({ styles: generatedStyles.slice(0, 3) });
  } catch (error) {
    console.error('Style generation error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
