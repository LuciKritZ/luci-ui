import { NextResponse } from 'next/server';

import RateLimit from '@/models/rate-limit.model';
import dbConnect from '@/utils/db.utils';

/**
 * Checks if the user has exceeded their rate limit for a specific action.
 * Returns a 429 NextResponse if limited, or null if the action is allowed.
 *
 * @param userId - The user's ID
 * @param action - A string representing the action (e.g., 'generate-theme')
 * @param limit - The maximum number of allowed requests
 * @param windowSeconds - The time window in seconds
 */
export async function enforceRateLimit(
  userId: string,
  action: string,
  limit: number = 10,
  windowSeconds: number = 60
): Promise<NextResponse | null> {
  await dbConnect();

  const identifier = `${userId}_${action}`;

  // Find the rate limit document or create it if it doesn't exist.
  // The $setOnInsert sets resetAt only on creation.
  const rateLimitDoc = await RateLimit.findOneAndUpdate(
    { identifier },
    {
      $inc: { count: 1 },
      $setOnInsert: {
        resetAt: new Date(Date.now() + windowSeconds * 1000),
      },
    },
    { new: true, upsert: true }
  );

  if (rateLimitDoc.count > limit) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait before trying again.' },
      {
        headers: {
          'Retry-After': Math.ceil(
            (rateLimitDoc.resetAt.getTime() - Date.now()) / 1000
          ).toString(),
        },
        status: 429,
      }
    );
  }

  return null;
}
