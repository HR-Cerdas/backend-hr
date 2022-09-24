const express = require("express");
const router = express.Router();
// Get Route Start
const {
  createLowongan,
  getAllLowongan,
} = require("../controller/lowonganPekerjaan.controller");
// Get Route End

const authHeader = require("../misc/auth.header");

// Create Lowongan pekerjaan
router.post("/create", authHeader, createLowongan);
router.get("/getall", getAllLowongan);

module.exports = router;
