import { NextResponse } from 'next/server';
import { readDb, requireUser, withDb } from '@/lib/db';

export async function GET(request) {
  const user = await requireUser(request);
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const db = await readDb();
  const notifications = db.notifications
    .filter((entry) => entry.userId === user.id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return NextResponse.json({ notifications });
}

export async function PATCH(request) {
  const user = await requireUser(request);
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  await withDb((db) => {
    db.notifications.forEach((entry) => {
      if (entry.userId === user.id) entry.read = true;
    });
  });

  return NextResponse.json({ success: true });
}
