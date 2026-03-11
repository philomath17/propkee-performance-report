import { NextResponse } from 'next/server';
import { createId, readDb, requireUser, withDb } from '@/lib/db';

const LEAVE_TYPES = ['casual', 'sick', 'paid'];

function daysBetween(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diff = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;
  return diff > 0 ? diff : 0;
}

export async function GET(request) {
  const user = await requireUser(request);
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const db = await readDb();
  const requests = user.role === 'hr' ? db.leaves : db.leaves.filter((entry) => entry.userId === user.id);

  return NextResponse.json({
    leaveRequests: requests,
    leaveBalance: user.leaveBalance,
  });
}

export async function POST(request) {
  const user = await requireUser(request);
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const leaveType = body?.leaveType;
  const startDate = body?.startDate;
  const endDate = body?.endDate;
  const reason = body?.reason?.trim();

  if (!LEAVE_TYPES.includes(leaveType) || !startDate || !endDate || !reason) {
    return NextResponse.json({ message: 'Please provide all required leave details.' }, { status: 400 });
  }

  const totalDays = daysBetween(startDate, endDate);
  if (!totalDays) return NextResponse.json({ message: 'Invalid leave date range.' }, { status: 400 });

  const created = await withDb((db) => {
    const dbUser = db.users.find((entry) => entry.id === user.id);

    if (!dbUser || dbUser.leaveBalance[leaveType] < totalDays) {
      return { error: 'Insufficient leave balance.' };
    }

    const requestRecord = {
      id: createId('leave'),
      userId: user.id,
      employeeName: user.name,
      leaveType,
      startDate,
      endDate,
      totalDays,
      reason,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    db.leaves.push(requestRecord);
    return { record: requestRecord };
  });

  if (created.error) return NextResponse.json({ message: created.error }, { status: 400 });

  return NextResponse.json({ leaveRequest: created.record });
}

export async function PATCH(request) {
  const user = await requireUser(request);
  if (!user || user.role !== 'hr') {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  const body = await request.json();
  const leaveId = body?.leaveId;
  const action = body?.action;

  if (!leaveId || !['approved', 'rejected'].includes(action)) {
    return NextResponse.json({ message: 'Invalid request.' }, { status: 400 });
  }

  const result = await withDb((db) => {
    const leaveRequest = db.leaves.find((entry) => entry.id === leaveId);
    if (!leaveRequest || leaveRequest.status !== 'pending') {
      return { error: 'Leave request not found or already processed.' };
    }

    leaveRequest.status = action;
    leaveRequest.reviewedAt = new Date().toISOString();
    leaveRequest.reviewedBy = user.id;

    if (action === 'approved') {
      const dbUser = db.users.find((entry) => entry.id === leaveRequest.userId);
      if (dbUser) {
        dbUser.leaveBalance[leaveRequest.leaveType] -= leaveRequest.totalDays;
      }
    }

    db.notifications.push({
      id: createId('note'),
      userId: leaveRequest.userId,
      message: `Your ${leaveRequest.leaveType} leave request (${leaveRequest.totalDays} day(s)) was ${action}.`,
      createdAt: new Date().toISOString(),
      read: false,
    });

    return { record: leaveRequest };
  });

  if (result.error) return NextResponse.json({ message: result.error }, { status: 400 });

  return NextResponse.json({ leaveRequest: result.record });
}
