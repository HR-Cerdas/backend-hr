const express = require("express");
const router = express.Router();
// Get Route Start
const {
  createLowongan,
  getAllLowongan,
  getDetailLowongan,
  applyLowongan,
} = require("../controller/lowonganPekerjaan.controller");
// Get Route End

const authHeader = require("../misc/auth.header");
const uploadCv = require("../misc/multerCV");

// Create Lowongan pekerjaan
router.post("/create", authHeader, createLowongan);
router.get("/getall", getAllLowongan);
router.get("/detaillowongan/id/:id", getDetailLowongan);
router.put(
  "/applylowongan/id/:id",
  authHeader,
  uploadCv.single("resume"),
  applyLowongan
);

module.exports = router;
