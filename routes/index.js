var express = require("express");
var router = express.Router();

// Panggil Route Start
const hr = require("./hr");
// Panggil Route End

// use Route Start
router.use("/HR", hr);
// use Route End

module.exports = router;
