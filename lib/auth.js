import crypto from 'crypto';

const SESSION_TTL_MS = 1000 * 60 * 60 * 12;

export function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password, saltedHash) {
  const [salt, storedHash] = saltedHash.split(':');
  const derivedHash = crypto.scryptSync(password, salt, 64).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(storedHash, 'hex'), Buffer.from(derivedHash, 'hex'));
}

export function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

export function createSession(userId) {
  return {
    token: generateToken(),
    userId,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + SESSION_TTL_MS).toISOString(),
  };
}

export function isSessionValid(session) {
  return Boolean(session?.expiresAt && new Date(session.expiresAt).getTime() > Date.now());
}
