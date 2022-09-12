const express = require("express");
const router = express.Router();

const {
  getDetailProfil,
  editDetailProfil,
  getAbout,
} = require("../controller/cDetailPelamar");

const validationEditDetailPelamar = require("../validation/vDetailPelamar");

// get All Detail Data Pelamar
router.get("/getalldetail", getDetailProfil);
// Edit Detail Data Pelamar
router.put("/editdetailpelamar", validationEditDetailPelamar, editDetailProfil);
router.get("/getAbout", getAbout);
module.exports = router;
