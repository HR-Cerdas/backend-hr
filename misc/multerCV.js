const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");

const storageCv = multer.diskStorage({
  destination: (req, file, cb) => {
    const path = `./assets/cv/${req.user.username}`;
    fs.mkdirSync(path, { recursive: true });
    return cb(null, path);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      `${req.user.id}-resume-${uuidv4()}.${file.originalname.split(".")[1]}`
    );
  },
});

const uploadCv = multer({
  storage: storageCv,
  limits: { fileSize: 1048576 }, // 10 Mb
  fileFilter: (req, file, cb) => {
    const validImageExtension = ["application/pdf", "application/x-pdf"];
    if (validImageExtension.includes(file.mimetype)) cb(null, true);
    else cb("invalid file extension", false);
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

module.exports = uploadCv;
