const store = require('../data/postStore');

function listPosts(query = {}) {
  const pageValue = Number.parseInt(query.page, 10);
  const limitValue = Number.parseInt(query.limit, 10);
  const page = Number.isInteger(pageValue) && pageValue > 0 ? pageValue : 1;
  const limit = Math.min(100, Number.isInteger(limitValue) && limitValue > 0 ? limitValue : 2);
  const allPosts = store.getAllPosts();
  const total = allPosts.length;
  const pages = Math.ceil(total / limit);
  const start = (page - 1) * limit;

  return {
    rows: allPosts.slice(start, start + limit),
    meta: { page, limit, total, pages }
  };
}

function getPost(id) {
  return store.getPostById(id);
}

function createPost(body = {}) {
  return store.createPost({
    title: body.title,
    author: body.author
  });
}

function likePost(id) {
  return store.incrementLikes(id);
}

function explode() {
  const err = new Error('SQLITE_CONSTRAINT in posts table');
  err.statusCode = 500;
  throw err;
}

module.exports = {
  listPosts,
  getPost,
  createPost,
  likePost,
  explode
};
