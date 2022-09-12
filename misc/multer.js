const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
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

module.exports = uploadPhoto;
