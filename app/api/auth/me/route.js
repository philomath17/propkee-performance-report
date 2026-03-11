import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/db';

export async function GET(request) {
  const user = await requireUser(request);

  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({ user });
}
