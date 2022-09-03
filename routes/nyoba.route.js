const express = require("express");
const router = express.Router();
const { ayo } = require("../controller/nyoba");
router.get("/nyoba", ayo);

module.exports = router;
