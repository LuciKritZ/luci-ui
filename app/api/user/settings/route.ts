import { NextRequest, NextResponse } from 'next/server';

import User, { IApiKey } from '@/models/user.model';
import dbConnect from '@/utils/db.utils';
import { encrypt } from '@/utils/encryption.utils';
import { getSession, unauthorizedResponse } from '@/utils/jwt.utils';

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession(request);
    if (!session) return unauthorizedResponse();

    const body = await request.json();
    const { keyId, provider = 'gemini' } = body;

    if (!keyId)
      return NextResponse.json({ error: 'Missing keyId' }, { status: 400 });

    await dbConnect();
    const user = await User.findById(session.userId);
    if (!user || !user.apiKeys)
      return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const providerKey = provider.toLowerCase();
    const currentKeys = user.apiKeys.get(providerKey) || [];

    // Filter out the key to delete
    const newKeys = currentKeys.filter(
      (k: IApiKey) => k._id?.toString() !== keyId
    );

    if (newKeys.length === currentKeys.length) {
      return NextResponse.json({ error: 'Key not found' }, { status: 404 });
    }

    user.apiKeys.set(providerKey, newKeys);
    await user.save();

    return NextResponse.json({ message: 'Key deleted successfully' });
  } catch (error) {
    console.error('Settings DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request);
    if (!session) {
      return unauthorizedResponse();
    }

    await dbConnect();

    const user = await User.findById(session.userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Map keys to a safe format for the frontend
    const keysInfo: Record<string, unknown> = {};
    let hasGeminiKey = false;

    if (user.apiKeys && typeof user.apiKeys.forEach === 'function') {
      user.apiKeys.forEach((keys: IApiKey[], provider: string) => {
        if (Array.isArray(keys)) {
          keysInfo[provider] = keys.map(key => ({
            _id: key._id,
            createdAt: key.createdAt,
            hasKey: true,
            meta: key.meta,
            priority: key.priority,
            status: key.status,
          }));
          if (provider === 'gemini' && keys.length > 0) {
            hasGeminiKey = true;
          }
        }
      });
    } else if (user.apiKeys) {
      // Fallback if it's a plain object
      for (const [provider, keys] of Object.entries(user.apiKeys)) {
        if (Array.isArray(keys)) {
          keysInfo[provider] = keys.map((key: IApiKey) => ({
            _id: key._id,
            createdAt: key.createdAt,
            hasKey: true,
            meta: key.meta,
            priority: key.priority,
            status: key.status,
          }));
          if (provider === 'gemini' && keys.length > 0) {
            hasGeminiKey = true;
          }
        }
      }
    }

    return NextResponse.json({
      hasGeminiKey,
      keys: keysInfo,
    });
  } catch (error) {
    console.error('Settings GET error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    console.log('PATCH /api/user/settings: Starting...');
    const session = await getSession(request);
    if (!session) {
      console.log('PATCH /api/user/settings: No session found');
      return unauthorizedResponse();
    }

    const body = await request.json();
    const {
      geminiApiKey,
      keyId,
      meta,
      priority = 1,
      provider = 'gemini',
    } = body;
    console.log('PATCH /api/user/settings: Decoded userId:', session.userId);
    console.log('PATCH /api/user/settings: Provider:', provider);
    console.log('PATCH /api/user/settings: Has key in body:', !!geminiApiKey);
    console.log('PATCH /api/user/settings: Has keyId in body:', !!keyId);

    // Validate meta description
    if (meta && meta.description !== undefined) {
      if (typeof meta.description !== 'string') {
        return NextResponse.json(
          { error: 'Description must be a string' },
          { status: 400 }
        );
      }
      if (meta.description.length > 50) {
        return NextResponse.json(
          { error: 'Description cannot exceed 50 characters' },
          { status: 400 }
        );
      }
    }

    await dbConnect();
    console.log('PATCH /api/user/settings: DB Connected');

    const user = await User.findById(session.userId);
    if (!user) {
      console.log('PATCH /api/user/settings: User not found in DB');
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Initialize apiKeys if it doesn't exist
    if (!user.apiKeys) {
      user.apiKeys = new Map();
    }

    const providerKey = provider.toLowerCase();
    const currentKeys = user.apiKeys.get(providerKey) || [];

    if (keyId) {
      console.log('PATCH /api/user/settings: Updating existing key...');
      const keyIndex = currentKeys.findIndex(
        (k: IApiKey) => k._id?.toString() === keyId
      );
      if (keyIndex > -1) {
        if (priority !== undefined) {
          const p = Number(priority) || 1;
          currentKeys[keyIndex].priority = p < 1 ? 1 : p;
        }
        if (meta?.description !== undefined) {
          currentKeys[keyIndex].meta = {
            ...currentKeys[keyIndex].meta,
            description: meta.description,
          };
        }
        user.apiKeys.set(providerKey, currentKeys);
      } else {
        return NextResponse.json({ error: 'Key not found' }, { status: 404 });
      }
    } else if (geminiApiKey) {
      console.log('PATCH /api/user/settings: Encrypting key...');
      try {
        const { encryptedText, iv } = encrypt(geminiApiKey);
        console.log('PATCH /api/user/settings: Encryption successful');

        currentKeys.push({
          encryptedKey: encryptedText,
          iv: iv,
          meta: meta || { description: 'Gemini API Key' },
          priority: priority,
          status: 'active',
        });
        user.apiKeys.set(providerKey, currentKeys);
      } catch (encryptError) {
        console.error(
          'PATCH /api/user/settings: Encryption failed:',
          encryptError
        );
        return NextResponse.json(
          { error: 'Encryption failed' },
          { status: 500 }
        );
      }
    }

    console.log('PATCH /api/user/settings: Saving user...');
    await user.save();
    console.log('PATCH /api/user/settings: Save successful');

    return NextResponse.json({
      hasKey: true,
      message: `${provider} API key added successfully`,
    });
  } catch (error) {
    console.error('Settings PATCH error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal Server Error',
        stack:
          process.env.NODE_ENV === 'development'
            ? error instanceof Error
              ? error.stack
              : undefined
            : undefined,
      },
      { status: 500 }
    );
  }
}
