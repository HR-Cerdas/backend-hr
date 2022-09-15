const express = require("express");
const router = express.Router();

const {
  getDetailProfil,
  editDetailProfil,
  updateAbout,
  addWorkExperience,
  addEducation,
  addSkill,
  addJobInterests,
  addResume,
  addSosialMedia,
  addOrganization,
} = require("../controller/cDetailPelamar");

const validationEditDetailPelamar = require("../validation/vDetailPelamar");
const uploadCv = require("../misc/multer");

// get All Detail Data Pelamar
router.get("/getalldetail", getDetailProfil);
// Edit Detail Data Pelamar
router.put("/editdetailpelamar", validationEditDetailPelamar, editDetailProfil);
router.get("/getAbout", updateAbout);
router.put("/addexperience", addWorkExperience);
router.put("/addeducation", addEducation);
router.put("/addskill", addSkill);
router.put("/addjob", addJobInterests);
router.put("/addresume", uploadCv.single("cv"), addResume);
router.put("/addsosialmedia", addSosialMedia);
router.put("/addorganization", addOrganization);

module.exports = router;
