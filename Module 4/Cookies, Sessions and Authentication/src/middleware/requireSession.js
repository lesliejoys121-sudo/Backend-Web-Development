const userRepository = require('../repositories/userRepository');
const sessionStore = require('../session/sessionStore');
const AppError = require('../utils/AppError');

module.exports = async function requireSession(req, res, next) {
  const sid = req.signedCookies && req.signedCookies.sid;
  const session = typeof sid === 'string' ? sessionStore.get(sid) : null;
  const user = session ? await userRepository.findPublicById(session.userId) : null;

  if (!session || !user) {
    if (sid && session) sessionStore.destroy(sid);
    throw new AppError(401, 'AUTH_REQUIRED', 'Authentication required');
  }

  req.user = user;
  return next();
};
