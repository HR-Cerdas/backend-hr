const Response = require("../helpers/response");

module.exports = (req, res, next) => {
  const response = new Response(res);
  const { location, residentialStatus, nationality, noHp, email } = req.body;

  if (!noHp)
    return response.Fail(
      response.BadRequest,
      "Bad Request",
      "No hp tidak boleh kosong"
    );
  if (!email)
    return response.Fail(
      response.BadRequest,
      "Bad Request",
      "email tidak boleh kosong"
    );

  const validEmail =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const isValidEmail = email.match(validEmail);
  if (!isValidEmail)
    return response.Fail(
      response.BadRequest,
      "Bad Request",
      "email tidak valid"
    );

  const validLocation = /^[a-zA-Z]*$/;
  const isValidLocation = location.match(validLocation);
  if (!isValidLocation)
    return response.Fail(
      response.BadRequest,
      "Bad Request",
      "Location hanya boleh mengandung alphabet"
    );
  const validResiden = /^[a-zA-Z]*$/;
  const isValidResiden = residentialStatus.match(validResiden);
  if (!isValidResiden)
    return response.Fail(
      response.BadRequest,
      "Bad Request",
      "Residen hanya boleh mengandung alphabet"
    );
  const validnoHp = /^[0-9]+$/;
  const isValidnoHp = noHp.match(validnoHp);
  if (!isValidnoHp)
    return response.Fail(
      response.BadRequest,
      "Bad Request",
      "No hp hanya boleh mengandung angka"
    );
  const validNationality = /^[A-Z]*$/;
  const isValidNationality = nationality.match(validNationality);
  if (!isValidNationality)
    return response.Fail(
      response.BadRequest,
      "Bad Request",
      "Nationality hanya boleh mengandung alphabet Kapital"
    );

  next();
};
