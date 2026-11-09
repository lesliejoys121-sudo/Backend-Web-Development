const prisma = require('../db/prisma');
const { toApplicationError } = require('./databaseError');

async function findAll() {
  return prisma.post.findMany({ orderBy: { id: 'asc' } });
}

async function findById(id) {
  const numericId = Number(id);
  if (!Number.isInteger(numericId) || numericId < 1) return null;
  return prisma.post.findUnique({ where: { id: numericId } });
}

async function create(fields) {
  try {
    return await prisma.post.create({
      data: {
        title: fields.title,
        body: fields.body || '',
        authorId: fields.authorId,
      },
    });
  } catch (error) {
    throw toApplicationError(error);
  }
}

async function update(id, patch) {
  const numericId = Number(id);
  if (!Number.isInteger(numericId) || numericId < 1) return null;
  const existing = await findById(numericId);
  if (!existing) return null;

  const data = {};
  if (patch.title !== undefined) data.title = patch.title;
  if (patch.body !== undefined) data.body = patch.body;

  try {
    return await prisma.post.update({ where: { id: numericId }, data });
  } catch (error) {
    throw toApplicationError(error);
  }
}

async function remove(id) {
  const numericId = Number(id);
  if (!Number.isInteger(numericId) || numericId < 1) return false;
  const existing = await findById(numericId);
  if (!existing) return false;

  try {
    await prisma.post.delete({ where: { id: numericId } });
  } catch (error) {
    throw toApplicationError(error);
  }
  return true;
}

module.exports = { findAll, findById, create, update, remove };
