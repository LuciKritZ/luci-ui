import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

import User from '@/models/user.model';
import dbConnect from '@/utils/db.utils';
import { signToken } from '@/utils/jwt.utils';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    await dbConnect();

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials.' },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid credentials.' },
        { status: 401 }
      );
    }

    // Generate JWT
    const token = signToken({ userId: user._id.toString() });

    // Create response and set cookie
    const response = NextResponse.json(user);
    response.cookies.set('token', token, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
