const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");

var uploadfilektpname = "";
var uploadfiletdpname = "";
var uploadfilesiupname = "";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { username } = req.user;

    if (file.fieldname == "ktp") {
      const path = `./assets/DetailPerusahaan/${username}/ktp`;
      fs.mkdirSync(path, { recursive: true });
      return cb(null, path);
    } else if (file.fieldname == "tdp") {
      const path = `./assets/DetailPerusahaan/${username}/tdp`;
      fs.mkdirSync(path, { recursive: true });
      return cb(null, path);
    } else {
      const path = `./assets/DetailPerusahaan/${username}/siup`;
      fs.mkdirSync(path, { recursive: true });
      return cb(null, path);
    }
  },
  filename: function (req, file, cb) {
    if (file.fieldname == "ktp") {
      cb(
        null,
        `${req.user.id}-ktp-${uuidv4()}.${file.originalname.split(".")[1]}`
      );
    } else if (file.fieldname == "tdp") {
      cb(
        null,
        `${req.user.id}-tdp-${uuidv4()}.${file.originalname.split(".")[1]}`
      );
    } else {
      cb(
        null,
        `${req.user.id}-siup-${uuidv4()}.${file.originalname.split(".")[1]}`
      );
    }
  },
});

const uploadKtpDetailPerusahaan = multer({
  storage: storage,
  limits: { fileSize: 1048576 }, // 10 Mb
  fileFilter: (req, file, cb) => {
    const validImageExtension = ["application/pdf", "application/x-pdf"];
    if (validImageExtension.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
  },
});

// const uploadPhoto = multer({
//   storage: storage,
//   limits: { fileSize: 25e+7 },
//   fileFilter: (req, file, cb) => {
//     const validImageExtension = ['image/png','image/jpeg','image/jpg']
//     if (validImageExtension.includes(file.mimetype)) cb(null, true);
//     else cb("invalid file extension", false)
//   }
// })

module.exports = uploadKtpDetailPerusahaan;
