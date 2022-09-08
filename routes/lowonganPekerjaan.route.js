const express = require("express");
const router = express.Router();
// Get Route Start
const {
  createLowongan,
} = require("../controller/lowonganPekerjaan.controller");
// Get Route End

// Create Lowongan pekerjaan
router.post("/create", createLowongan);

module.exports = router;
