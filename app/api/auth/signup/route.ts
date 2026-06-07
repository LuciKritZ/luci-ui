import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

import User from '@/models/user.model';
import dbConnect from '@/utils/db.utils';
import { signToken } from '@/utils/jwt.utils';

export async function POST(request: Request) {
  try {
    const { email, name, password } = await request.json();

    // Strict Email Check against environment variable
    const allowedEmails = (process.env.ALLOWED_EMAILS || '')
      .split(',')
      .map(e => e.trim());
    if (!allowedEmails.includes(email)) {
      return NextResponse.json(
        { error: 'Unauthorized: This email is not on the allowlist.' },
        { status: 403 }
      );
    }

    await dbConnect();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists.' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await User.create({
      email,
      name,
      password: hashedPassword,
    });

    // Generate JWT
    const token = signToken({ userId: user._id.toString() });

    // Create response and set cookie
    const response = NextResponse.json(user, { status: 201 });
    response.cookies.set('token', token, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    return response;
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
