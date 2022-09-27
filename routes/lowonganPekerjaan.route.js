const express = require("express");
const router = express.Router();
// Get Route Start
const {
  createLowongan,
  getAllLowongan,
  getDetailLowongan,
} = require("../controller/lowonganPekerjaan.controller");
// Get Route End

const authHeader = require("../misc/auth.header");

// Create Lowongan pekerjaan
router.post("/create", authHeader, createLowongan);
router.get("/getall", getAllLowongan);
router.get("/detaillowongan/id/:id", getDetailLowongan);

module.exports = router;
