import { promises as fs } from 'fs';
import path from 'path';
import { createSession, isSessionValid } from './auth';

const DB_PATH = path.join(process.cwd(), 'data', 'hr-crm-db.json');

const defaultDb = {
  users: [
    {
      id: 'emp-101',
      name: 'Ava Sharma',
      email: 'ava@company.com',
      role: 'employee',
      department: 'Engineering',
      title: 'Software Engineer',
      passwordHash:
        '5010831a5da52f27c566b11fa82191ec:0604e5bd62b3f37968be277fdddc50902b5eda443340316f42eedf51fa4fabbf0d110804f8a4646ba18760b8dba2abab31eb514fbf5071dfc61491ea54899a2b',
      leaveBalance: {
        casual: 8,
        sick: 10,
        paid: 20,
      },
    },
    {
      id: 'hr-001',
      name: 'Noah Mehta',
      email: 'hr.admin@company.com',
      role: 'hr',
      department: 'People Operations',
      title: 'HR Manager',
      passwordHash:
        'c94ac31c4cc11a33ea076fb0343c7633:6f12c8c07bb3d0611f9e22d3d23717fe956d5f88bc865c654ff137d462736136e2b7a9eb6f0659543efbd55d57493674dc2d1c92418324fcfd5bef4ea950fac6',
      leaveBalance: {
        casual: 12,
        sick: 12,
        paid: 24,
      },
    },
  ],
  attendance: [],
  leaves: [],
  events: [
    {
      id: 'ev-1',
      title: 'Quarterly Town Hall',
      description: 'Leadership updates and open Q&A.',
      type: 'meeting',
      date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString(),
      createdBy: 'hr-001',
    },
  ],
  notifications: [],
  sessions: [],
};

async function ensureDb() {
  try {
    await fs.access(DB_PATH);
  } catch {
    await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
    await fs.writeFile(DB_PATH, JSON.stringify(defaultDb, null, 2));
  }
}

export async function readDb() {
  await ensureDb();
  const raw = await fs.readFile(DB_PATH, 'utf8');
  return JSON.parse(raw);
}

export async function writeDb(data) {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
}

export async function withDb(mutator) {
  const db = await readDb();
  const result = await mutator(db);
  await writeDb(db);
  return result;
}

export function publicUser(user) {
  const { passwordHash, ...safeUser } = user;
  return safeUser;
}

export async function createUserSession(userId) {
  return withDb((db) => {
    db.sessions = db.sessions.filter((session) => isSessionValid(session));
    const session = createSession(userId);
    db.sessions.push(session);
    return session;
  });
}

export async function getSessionUser(token) {
  if (!token) return null;

  const db = await readDb();
  const session = db.sessions.find((entry) => entry.token === token);
  if (!session || !isSessionValid(session)) return null;

  const user = db.users.find((entry) => entry.id === session.userId);
  return user ? publicUser(user) : null;
}

export async function requireUser(request) {
  const authHeader = request.headers.get('authorization') || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  return getSessionUser(token);
}

export function createId(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}
