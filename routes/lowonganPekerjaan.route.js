const express = require("express");
const router = express.Router();
// Get Route Start
const {
  createLowongan,
  getAllLowongan,
  getDetailLowongan,
  applyLowongan,
  getAllDataPelamarApply,
  getLowonganhr,
  deleteLowongan,
  updateLowongan,
  sortLowongan,
  getAllPelamarAllLowongan,
  getAllLowonganPagination,
  Searchlowongan,
} = require("../controller/lowonganPekerjaan.controller");
// Get Route End

const authHeader = require("../misc/auth.header");
const uploadCv = require("../misc/multerCV");

// Create Lowongan pekerjaan
router.post("/create", authHeader, createLowongan);
router.post("/search", Searchlowongan);
router.get("/getall", getAllLowongan);
router.get("/getLowongan", getAllLowonganPagination);
router.get("/detaillowongan/id/:id", getDetailLowongan);
router.put(
  "/applylowongan/id/:id",
  authHeader,
  uploadCv.single("resume"),
  applyLowongan
);
router.get("/listpelamar/id/:id", authHeader, getAllDataPelamarApply);
router.get("/getlowonganhr", authHeader, getLowonganhr);
router.delete("/deletelowongan/id/:id", authHeader, deleteLowongan);
router.put("/update/id/:id", authHeader, updateLowongan);
router.post("/getdetailpelamar", authHeader, sortLowongan);
router.get("/allpelamarapllylowongan", authHeader, getAllPelamarAllLowongan);

module.exports = router;
