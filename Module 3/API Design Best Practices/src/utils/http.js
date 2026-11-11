function sendList(res, result) {
  return res.status(200).json({ data: result.rows, meta: result.meta });
}

function sendCreated(res, data) {
  return res.status(201).json({ data });
}

function sendOk(res, data) {
  return res.status(200).json({ data });
}

function sendError(res, status, { code, message, details } = {}) {
  const error = { code, message };
  if (details !== undefined) error.details = details;
  return res.status(status).json({ error });
}

module.exports = {
  sendList,
  sendCreated,
  sendOk,
  sendError
};
