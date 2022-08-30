var express = require("express");
const {
  nyoba,
  register,
  login,
  forgotPassword,
} = require("../controller/hrUsers");
var router = express.Router();
// Validation Start
const regisValidation = require("../validation/register.validation");
const loginValidation = require("../validation/login.validation");
// Validation End
const regisSanitize = require("../sanitize/register.sanitize");

router.post("/register", regisValidation, regisSanitize, register);
router.get("/nyoba", nyoba);
router.post("/login", loginValidation, login);
router.put("/gantiPassword", forgotPassword);
// router.post("/loginHr", login);

module.exports = router;
