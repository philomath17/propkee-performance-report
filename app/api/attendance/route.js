import { NextResponse } from 'next/server';
import { createId, readDb, requireUser, withDb } from '@/lib/db';

function calculateHours(checkIn, checkOut) {
  if (!checkIn || !checkOut) return 0;
  const hours = (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60);
  return Number(hours.toFixed(2));
}

export async function GET(request) {
  const user = await requireUser(request);
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const db = await readDb();
  const records = user.role === 'hr' ? db.attendance : db.attendance.filter((entry) => entry.userId === user.id);
  return NextResponse.json({ records });
}

export async function POST(request) {
  const user = await requireUser(request);
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const today = new Date().toISOString().slice(0, 10);

  const created = await withDb((db) => {
    const existing = db.attendance.find((entry) => entry.userId === user.id && entry.date === today);
    if (existing) return null;

    const record = {
      id: createId('att'),
      userId: user.id,
      employeeName: user.name,
      date: today,
      checkIn: new Date().toISOString(),
      checkOut: null,
      hoursWorked: 0,
      status: 'checked-in',
    };
    db.attendance.push(record);
    return record;
  });

  if (!created) return NextResponse.json({ message: 'Already checked in today.' }, { status: 409 });

  return NextResponse.json({ record: created });
}

export async function PATCH(request) {
  const user = await requireUser(request);
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const today = new Date().toISOString().slice(0, 10);

  const updated = await withDb((db) => {
    const record = db.attendance.find((entry) => entry.userId === user.id && entry.date === today);
    if (!record || record.checkOut) return null;

    record.checkOut = new Date().toISOString();
    record.hoursWorked = calculateHours(record.checkIn, record.checkOut);
    record.status = 'checked-out';
    return record;
  });

  if (!updated) {
    return NextResponse.json({ message: 'No active check-in found for today.' }, { status: 404 });
  }

  return NextResponse.json({ record: updated });
}
