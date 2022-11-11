const cloudinary = require("cloudinary").v2;
const Response = require("../helpers/response");
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: +process.env.api_key,
  api_secret: process.env.api_secret,
  secure: true,
});

const profileHrUpload = async (req, res, next) => {
  const response = new Response(res);
  const { username } = req.user;
  try {
    if (req.file) {
      const foldering = `HrCerdas/profileHr/${username}/`;
      const uploadedMedia = await cloudinary.uploader.upload(req.file.path, {
        folder: foldering,
      });
      req.body.cloud_media_url = uploadedMedia.secure_url;
    }
    next();
  } catch (error) {
    return response.Fail(error.http_code, error, error.message);
  }
};

const deleteImageProfile = async img_url => {
  const img_id = img_name.split("/");
  return await cloudinary.uploader.destroy(
    `secondHand/${img_id[8]}/${img_id[9]}`,
    result => result
  );
};

module.exports = { profileHrUpload, deleteImageProfile };
