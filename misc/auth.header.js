const jwt = require("jsonwebtoken");
const Response = require("../helpers/response");
require("dotenv").config();

module.exports = function (req, res, next) {
  const response = new Response(res);

  const authHeader = req.header("Authorization");
  if (!authHeader)
    return response.Fail(response.Unauthorized, "Authentication Needed");

  const token = authHeader.split(" ")[1];

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    const errorList = ["JsonWebTokenError", "TokenExpiredError"];
    errorList.includes(err.name)
      ? response.Fail(response.BadRequest, err.message)
      : response.Fail(response.InternalServerError, "internal server error");
  }
};
