import { NextRequest, NextResponse } from "next/server";

import User from "@/models/user.model";
import dbConnect from "@/utils/db.utils";
import {
  compilePrompt,
  executeWithFallback,
  getActionDefinition,
} from "@/utils/genai.utils";
import { getSession, unauthorizedResponse } from "@/utils/jwt.utils";
import { enforceRateLimit } from "@/utils/ratelimit.utils";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession(request);
    if (!session) {
      return unauthorizedResponse();
    }

    const rateLimitResponse = await enforceRateLimit(
      session.userId,
      "generate-themes",
      10,
      60
    );
    if (rateLimitResponse) return rateLimitResponse;

    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    await dbConnect();
    const user = await User.findById(session.userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const actionDef = await getActionDefinition("createTheme");

    const result = await executeWithFallback(
      user,
      async (genAI, modelId) => {
        const stylePrompt = compilePrompt(actionDef.prompt, { prompt });

        const config: Record<string, unknown> = {
          responseMimeType: "application/json",
        };

        if (actionDef.responseSchema) {
          try {
            config.responseSchema = JSON.parse(actionDef.responseSchema);
          } catch {
            console.error("Invalid responseSchema in DB for createTheme");
          }
        }

        return await genAI.models.generateContent({
          config,
          contents: [{ parts: [{ text: stylePrompt }], role: "user" }],
          model: modelId,
        });
      },
      actionDef.model,
      actionDef.fallbackModel
    );

    const text = result.text ?? "";

    if (!text) {
      return NextResponse.json(
        { error: "AI returned no response" },
        { status: 500 }
      );
    }

    try {
      // Strip markdown code blocks if present
      const jsonContent = text.replace(/```json\n?|```/g, "").trim();
      const themesArray = JSON.parse(jsonContent);
      return NextResponse.json({ themes: themesArray });
    } catch (parseError) {
      console.error("Failed to parse AI response:", text, parseError);
      return NextResponse.json(
        { error: "AI returned invalid theme data" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Theme generation error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
