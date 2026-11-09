const prisma = require('../db/prisma');

async function findByEmail(email) {
  return prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      email: true,
      passwordHash: true,
    },
  });
}

async function create({ name, email, passwordHash }) {
  return prisma.user.create({
    data: { name, email, passwordHash },
    select: {
      id: true,
      name: true,
      email: true,
      passwordHash: true,
    },
  });
}

module.exports = { findByEmail, create };
