const express = require("express");
const router = express.Router();
const {
  showProvince,
  showDistricts,
} = require("../controller/dataPostalCode.controller");

// Get Data Province
router.get("/province", showProvince);
router.get("/districts/id/:id", showDistricts);

module.exports = router;
