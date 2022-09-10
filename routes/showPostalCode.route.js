const express = require("express");
const router = express.Router();
const {
  showProvince,
  showDistricts,
  showSubDistricts,
  showPostalCodes,
} = require("../controller/dataPostalCode.controller");

// Get Data Province
router.get("/province", showProvince);
router.get("/districts", showDistricts);
router.get("/sub-districts", showSubDistricts);
router.get("/postal-codes", showPostalCodes);

module.exports = router;
