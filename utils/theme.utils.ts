import mongoose from 'mongoose';

import Theme from '@/models/theme.model';

/**
 * Takes a theme ID (or string) and resolves it to a stringified JSON representation
 * of the design system so the AI can understand the actual theme variables.
 */
export async function getThemeString(
  themeId: string | undefined
): Promise<string> {
  if (!themeId || themeId === 'minimal') return 'minimal';

  if (mongoose.Types.ObjectId.isValid(themeId)) {
    try {
      const themeDoc = await Theme.findById(themeId);
      if (themeDoc) {
        return JSON.stringify(
          {
            colors: themeDoc.colors,
            description: themeDoc.description,
            fonts: { display: themeDoc.fontDisplay, sans: themeDoc.fontSans },
            name: themeDoc.name,
            radius: themeDoc.radius,
            shadows: themeDoc.shadows,
            spacing: themeDoc.spacing,
          },
          null,
          2
        );
      }
    } catch (e) {
      console.error('Failed to fetch theme for AI prompt:', e);
    }
  }

  return themeId; // fallback
}
