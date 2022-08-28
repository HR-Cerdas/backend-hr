const password = "AA085@a";
const validPassword =
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹])(?!.*\s).{8,15}$/;
// const isValidPassword = password.match(validPassword);
const isValidPassword = password.match(validPassword);

if (!isValidPassword) {
  console.log("salah");
}
