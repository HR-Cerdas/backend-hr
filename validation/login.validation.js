const Response = require("../helpers/response");
module.exports = (req, res, next) => {
  const response = new Response(res);
  const { email, password } = req.body;

  if (!email)
    return response.Fail(
      response.BadRequest,
      "Bad Request",
      "email tidak boleh kosong"
    );
  if (!password)
    return response.Fail(
      response.BadRequest,
      "Bad Request",
      "password tidak boleh kosong"
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
  const hasSpace = !password.match(/^\S*$/) && !confirmPassword.match(/^\S*$/);
  if (hasSpace)
    return response.Fail(
      response.BadRequest,
      "Bad Request",
      "password tidak boleh mengandung spasi"
    );

  next();
};
