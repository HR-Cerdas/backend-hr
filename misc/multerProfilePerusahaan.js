const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

const storageFoto = multer.diskStorage({
  // destination: (req, file, cb) => {
  //   cb(null, "./assets/profilePerusahaan");
  // },
  filename: function (req, file, cb) {
    cb(
      null,
      `${req.user.id}-profilPerusahaan-${uuidv4()}.${
        file.originalname.split(".")[1]
      }`
    );
  },
});
const uploadPhoto = multer({
  storage: storageFoto,
  limits: { fileSize: 25e7 },
  fileFilter: (req, file, cb) => {
    const validImageExtension = ["image/png", "image/jpeg", "image/jpg"];
    if (validImageExtension.includes(file.mimetype)) cb(null, true);
    else cb("invalid file extension", false);
  },
});

module.exports = uploadPhoto;
