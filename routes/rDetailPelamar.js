const express = require("express");
const router = express.Router();

const {
  getDetailProfil,
  editDetailProfil,
  updateAbout,
  addWorkExperience,
  addEducation,
  addSkill,
} = require("../controller/cDetailPelamar");

const validationEditDetailPelamar = require("../validation/vDetailPelamar");

// get All Detail Data Pelamar
router.get("/getalldetail", getDetailProfil);
// Edit Detail Data Pelamar
router.put("/editdetailpelamar", validationEditDetailPelamar, editDetailProfil);
router.get("/getAbout", updateAbout);
router.put("/addexperience", addWorkExperience);
router.put("/addeducation", addEducation);
router.put("/addskill", addSkill);

module.exports = router;
