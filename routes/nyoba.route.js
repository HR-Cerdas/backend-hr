const express = require("express");
const router = express.Router();
const { ayo } = require("../controller/nyoba");
const authHeader = require("../misc/auth.header");

router.post("/nyoba", authHeader, ayo);

module.exports = router;
