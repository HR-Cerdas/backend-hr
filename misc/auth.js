const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { JWT_SECRET } = process.env;

const signToken = payload =>
  jwt.sign(payload, JWT_SECRET, { expiresIn: "2hr" });

const checkPassword = (password, hashedPassword) =>
  bcrypt.compareSync(password, hashedPassword);

module.exports = {
  signToken,
  checkPassword,
};
