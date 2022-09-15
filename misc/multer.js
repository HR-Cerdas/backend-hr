const multer = require("multer");

const storageCv = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./assets/cv");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      `${req.user.id}-resume-${file.originalname.split(".")[0]}.${
        file.originalname.split(".")[1]
      }`
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
