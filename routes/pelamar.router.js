const express = require("express");
// Get Module Controller Start
const {
  register,
  login,
  forgotPassword,
  resetPassword,
  getToken,
  getprofilid,
  getApllyPelamar,
} = require("../controller/accountPelamar.controller");
const router = express.Router();
// Get Module Controller End

// Validation Start
const regisValidation = require("../validation/register.validation");
const loginValidation = require("../validation/login.validation");
const forgotPasswordValidation = require("../validation/forgotPassword.validation");
const resetPasswordValidation = require("../validation/resetPassword.validation");
// Validation End
const regisSanitize = require("../sanitize/register.sanitize");
const authHeader = require("../misc/auth.header");

// Register Pelamar
router.post("/register", regisValidation, regisSanitize, register);
// Login Pelamar
router.post("/login", loginValidation, login);
// Forgot Password Account Pelamar
router.put("/gantiPassword", forgotPasswordValidation, forgotPassword);
// Reset old password to new password Account Pelamar
router.put("/resetPassword", resetPasswordValidation, resetPassword);
// Percobaan
router.get("/getToken", getToken);
router.get("/profile", authHeader, getprofilid);
router.get("/gethistoryaplly", authHeader, getApllyPelamar);

module.exports = router;
