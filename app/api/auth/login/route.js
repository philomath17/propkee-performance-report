import { NextResponse } from 'next/server';
import { readDb, createUserSession, publicUser } from '@/lib/db';
import { verifyPassword } from '@/lib/auth';

export async function POST(request) {
  const body = await request.json();
  const email = body?.email?.toLowerCase()?.trim();
  const password = body?.password;

  if (!email || !password) {
    return NextResponse.json({ message: 'Email and password are required.' }, { status: 400 });
  }

  const db = await readDb();
  const user = db.users.find((entry) => entry.email.toLowerCase() === email);

  if (!user || !verifyPassword(password, user.passwordHash)) {
    return NextResponse.json({ message: 'Invalid credentials.' }, { status: 401 });
  }

  const session = await createUserSession(user.id);

  return NextResponse.json({
    token: session.token,
    user: publicUser(user),
  });
}
