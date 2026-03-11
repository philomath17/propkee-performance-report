import { NextResponse } from 'next/server';
import { createId, readDb, requireUser, withDb } from '@/lib/db';

export async function GET() {
  const db = await readDb();
  const events = [...db.events].sort((a, b) => new Date(a.date) - new Date(b.date));
  return NextResponse.json({ events });
}

export async function POST(request) {
  const user = await requireUser(request);
  if (!user || user.role !== 'hr') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

  const body = await request.json();
  const { title, description, type, date } = body || {};

  if (!title || !description || !type || !date) {
    return NextResponse.json({ message: 'Please complete all event fields.' }, { status: 400 });
  }

  const event = await withDb((db) => {
    const newEvent = {
      id: createId('event'),
      title: title.trim(),
      description: description.trim(),
      type,
      date,
      createdBy: user.id,
      createdAt: new Date().toISOString(),
    };

    db.events.push(newEvent);

    db.users
      .filter((entry) => entry.role === 'employee')
      .forEach((employee) => {
        db.notifications.push({
          id: createId('note'),
          userId: employee.id,
          message: `New HR event scheduled: ${newEvent.title} on ${new Date(newEvent.date).toLocaleDateString()}.`,
          createdAt: new Date().toISOString(),
          read: false,
        });
      });

    return newEvent;
  });

  return NextResponse.json({ event });
}
