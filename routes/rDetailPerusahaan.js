const express = require("express");
const router = express.Router();

const {
  editDetailBasicInfo,
  editDetailProfile,
} = require("../controller/cDetailPerusahaan");

const uploadPhoto = require("../misc/multerProfilePerusahaan");
const uploadKtp = require("../misc/multerKtpDetailPerusahaan");

router.put(
  "/basic",
  uploadPhoto.single("fotoProfilPerusahaan"),
  editDetailBasicInfo
);

router.put(
  "/detailprofile",
  uploadKtp.fields([
    { name: "ktp", maxCount: 1 },
    { name: "tdp", maxCount: 1 },
    { name: "siup", maxCount: 1 },
  ]),
  editDetailProfile
);

module.exports = router;
