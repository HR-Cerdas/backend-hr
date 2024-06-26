const express = require("express");
// Get Module Controller Start
const {
  register,
  login,
  forgotPassword,
  resetPassword,
  getToken,
  getprofilid,
} = require("../controller/accountHr.controller");
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

// Register Hr
router.post("/register", regisValidation, regisSanitize, register);
// Login Hr
router.post("/login", loginValidation, login);
// Forgot Password Account Hr
router.put("/gantiPassword", forgotPasswordValidation, forgotPassword);
// Reset old password to new password Account Hr
router.put("/resetPassword", resetPasswordValidation, resetPassword);
// Percobaan
router.get("/getToken", getToken);
router.get("/profile", authHeader, getprofilid);

module.exports = router;
