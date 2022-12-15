const express = require("express");
const router = express.Router();

const {
  getDetailProfil,
  editDetailProfil,
  updateAbout,
  addSkill,
  addJobInterests,
  addResume,
  addSosialMedia,
} = require("../controller/cDetailPelamar");
const { addEducation } = require("../controller/Education");
// organization
const {
  addOrganization,
  editOrganization,
} = require("../controller/Organization");
// experience
const { addWorkExperience } = require("../controller/Experience");

const validationEditDetailPelamar = require("../validation/vDetailPelamar");
const uploadCv = require("../misc/multerCV");

// get All Detail Data Pelamar
router.get("/getalldetail", getDetailProfil);
// Edit Detail Data Pelamar
router.put("/editdetailpelamar", validationEditDetailPelamar, editDetailProfil);
router.put("/getAbout", updateAbout);
router.put("/addexperience", addWorkExperience);
router.put("/addeducation", addEducation);
router.put("/addskill", addSkill);
router.put("/addjob", addJobInterests);
router.put("/addresume", uploadCv.single("cv"), addResume);
router.put("/addsosialmedia", addSosialMedia);

router.post("/addorganization", addOrganization);
router.put("/updateorganization/id/:id", editOrganization);

module.exports = router;
