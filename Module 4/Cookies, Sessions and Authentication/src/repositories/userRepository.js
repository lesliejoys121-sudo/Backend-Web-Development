const bcrypt = require('bcryptjs');
const prisma = require('../db/prisma');

const dummyPasswordHash =
  '$2b$12$C6UzMDM.H6dfI/f/IKcEe.5J7J2J8J4N9lVwD3w7W9J6b8V9Q7M2e';

async function findByEmail(email) {
  return prisma.user.findUnique({
    where: { email },
    select: { id: true, name: true, email: true, passwordHash: true },
  });
}

async function findPublicById(id) {
  return prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, email: true },
  });
}

module.exports = { findByEmail, findPublicById, dummyPasswordHash };
