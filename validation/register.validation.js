const Response = require("../helpers/response");

module.exports = (req, res, next) => {
  const response = new Response(res);
  const {
    first_name,
    last_name,
    email,
    noHp,
    password,
    username,
    confPassword,
  } = req.body;
  if (!first_name)
    return response.Fail(
      response.BadRequest,
      "Bad Request",
      "First Name tidak boleh kosong"
    );
  if (!last_name)
    return response.Fail(
      response.BadRequest,
      "Bad Request",
      "Last Name tidak boleh kosong"
    );
  if (!email)
    return response.Fail(
      response.BadRequest,
      "Bad Request",
      "email tidak boleh kosong"
    );
  if (!noHp)
    return response.Fail(
      response.BadRequest,
      "Bad Request",
      "No HP tidak boleh kosong"
    );
  if (!password)
    return response.Fail(
      response.BadRequest,
      "Bad Request",
      "password tidak boleh kosong"
    );
  if (!username)
    return response.Fail(
      response.BadRequest,
      "Bad Request",
      "Username tidak boleh kosong"
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

  const validFirstName = /^[a-zA-Z ]*$/;
  const isValidFirstName = first_name.match(validFirstName);
  if (!isValidFirstName)
    return response.Fail(
      response.BadRequest,
      "Bad Request",
      "First Name hanya boleh mengandung alphabet"
    );

  const validLastName = /^[a-zA-Z ]*$/;
  const isValidLastName = last_name.match(validLastName);
  if (!isValidLastName)
    return response.Fail(
      response.BadRequest,
      "Bad Request",
      "Last Name hanya boleh mengandung alphabet"
    );

  const validPassword = /^(?=.*[A-Z])/;
  const isValidPassword = password.match(validPassword);
  if (!isValidPassword)
    return response.Fail(
      response.BadRequest,
      "Bad Request",
      "Kata sandi harus memiliki setidaknya satu Karakter Huruf Besar."
    );

  const containsLowercase = /^(?=.*[a-z])/;
  const isContainsLowercase = password.match(containsLowercase);
  if (!isContainsLowercase) {
    return response.Fail(
      response.BadRequest,
      "Bad Request",
      "Kata sandi harus memiliki setidaknya satu Karakter Huruf Kecil."
    );
  }
  const containsSymbol = /^(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹])/;
  const isContainsSymbol = password.match(containsSymbol);
  if (!isContainsSymbol) {
    return response.Fail(
      response.BadRequest,
      "Bad Request",
      "Kata sandi harus mengandung setidaknya satu Simbol Khusus."
    );
  }
  const containsNumber = /^(?=.*[0-9])/;
  const isContainsNumber = password.match(containsNumber);
  if (!password.match(isContainsNumber)) {
    return response.Fail(
      response.BadRequest,
      "Bad Request",
      "Kata sandi harus mengandung setidaknya satu digit Angka."
    );
  }
  const validLength = /^.{8,15}$/;
  const isValidLength = password.match(validLength);
  if (!password.match(isValidLength)) {
    return response.Fail(
      response.BadRequest,
      "Bad Request",
      "Kata sandi harus terdiri dari 8-15 Karakter."
    );
  }
  const hasSpace = !password.match(/^\S*$/) && !confPassword.match(/^\S*$/);
  if (hasSpace)
    return response.Fail(
      response.BadRequest,
      "Bad Request",
      "password tidak boleh mengandung spasi"
    );

  next();
};
