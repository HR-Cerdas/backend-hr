module.exports = (req, res, next) => {
  const { username } = req.body;
  req.body.username = username.replace(/\s{2,}/g, " ").trim();
  next();
};
