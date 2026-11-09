// A Prisma-backed implementation would change this file's storage calls only;
// the repository contract and all services would remain unchanged.
const posts = new Map([
  [1, { id: 1, title: 'First post', body: 'Repository boundaries protect change.', authorId: 7 }],
  [2, { id: 2, title: 'Second post', body: 'Services should speak in domain language.', authorId: 8 }],
]);

let nextId = 3;

function findAll() {
  return Array.from(posts.values(), (post) => ({ ...post }));
}

function findById(id) {
  const post = posts.get(Number(id));
  return post ? { ...post } : null;
}

function create(fields) {
  const record = {
    id: nextId++,
    ...fields,
  };
  posts.set(record.id, record);
  return { ...record };
}

function update(id, patch) {
  const postId = Number(id);
  const post = posts.get(postId);
  if (!post) return null;

  const updated = { ...post, ...patch, id: postId };
  posts.set(postId, updated);
  return { ...updated };
}

function remove(id) {
  return posts.delete(Number(id));
}

module.exports = { findAll, findById, create, update, remove };
