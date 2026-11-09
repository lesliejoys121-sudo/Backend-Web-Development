const crypto = require('crypto');

const sessions = new Map();
const ttlMs = Number(process.env.SESSION_TTL_MS || 3600000);

function create(userId) {
  const id = crypto.randomUUID();
  const expiresAt = Date.now() + ttlMs;
  sessions.set(id, { userId, expiresAt });
  return { id, userId, expiresAt };
}

function get(id) {
  if (!id) return null;
  const session = sessions.get(id);
  if (!session) return null;
  if (session.expiresAt <= Date.now()) {
    sessions.delete(id);
    return null;
  }
  return { ...session };
}

function destroy(id) {
  if (id) sessions.delete(id);
}

module.exports = { create, get, destroy };
