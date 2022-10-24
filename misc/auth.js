const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { JWT_SECRET } = process.env;

// Setting Token & expired Start
const signToken = payload =>
  jwt.sign(payload, JWT_SECRET, { expiresIn: "10m" });
// Setting Token & expired End

// Setting Check Password Hash Start
const checkPassword = (password, hashedPassword) =>
  bcrypt.compareSync(password, hashedPassword);
// Setting Check Password Hash End

// Create Token By Email id Start
const tokenCheck = findEmail => jwt.sign({ iduser: findEmail._id }, JWT_SECRET);
// Create Token By Email id End

module.exports = {
  signToken,
  checkPassword,
  tokenCheck,
};
