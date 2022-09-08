var express = require("express");
var router = express.Router();

router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

// Panggil Route Start
const hr = require("./hr.route");
const pelamar = require("./pelamar.router");
const nyoba = require("./nyoba.route");
const lowonganPekerjaan = require("./lowonganPekerjaan.route");
const postalcode = require("./showPostalCode.route");
// Panggil Route End

const authHeader = require("../misc/auth.header");

// use Route Start
router.use("/hr", hr);
router.use("/pelamar", pelamar);
router.use("/lowonganpekerjaan", authHeader, lowonganPekerjaan);
router.use("/postalcode", postalcode);
router.use("/", authHeader, nyoba);
// use Route End

module.exports = router;
