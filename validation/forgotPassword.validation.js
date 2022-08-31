const Response = require("../helpers/response");
module.exports = (req, res, next) => {
  const response = new Response(res);
  const { email } = req.body;

  // Validation form Email Tidak Boleh Kosong
  if (!email)
    return response.Fail(
      response.BadRequest,
      "Bad Request",
      "email tidak boleh kosong"
    );

  // Validation format Input Email
  const validEmail =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const isValidEmail = email.match(validEmail);
  if (!isValidEmail)
    return response.Fail(
      response.BadRequest,
      "Bad Request",
      "email tidak valid"
    );

  next();
};
