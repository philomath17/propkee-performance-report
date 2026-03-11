import { NextResponse } from 'next/server';
import { readDb, requireUser, publicUser } from '@/lib/db';

export async function GET(request) {
  const user = await requireUser(request);
  if (!user || user.role !== 'hr') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

  const db = await readDb();
  const employees = db.users.map(publicUser);
  return NextResponse.json({ employees });
}
