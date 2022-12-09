const cloudinary = require("cloudinary").v2;
const Response = require("../helpers/response");
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: +process.env.api_key,
  api_secret: process.env.api_secret,
  secure: true,
});
// Image Profile Account Hr Start
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
// Image Profile Account Hr End

// CRUD CV Start
const uploudcv = async (req, res, next) => {
  const response = new Response(res);
  const { username } = req.user;
  const id = req.params.id;
  try {
    if (req.file) {
      const foldering = `HrCerdas/CV_Aplly/${id}/${username}/`;
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

const uploudcvCadangan = async (req, res, next) => {
  const response = new Response(res);
  const { username } = req.user;
  const id = req.params.id;
  try {
    if (req.file) {
      const foldering = `HrCerdas/CV_Aplly/${id}/${username}/`;
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

const uploudcvPelamar = async value => {
  const response = new Response(res);
  try {
    if (value[0]) {
      const folderCVPelamar = `HrCerdas/CV/${value[1]}/`;
      const uploadedMediaPelamar = await cloudinary.uploader.upload(
        req.file.path,
        {
          folder: folderCVPelamar,
        }
      );
      req.body.cloud_media_url_CVpelamar = uploadedMediaPelamar.secure_url;
    }
    next();
  } catch (error) {
    return response.Fail(error.http_code, error, error.message);
  }
};

const deleteCV = async img_url => {
  const img_id = img_url.split("/");
  const file = img_id[11].split(".");
  return await cloudinary.uploader.destroy(
    `HrCerdas/CV_Aplly/${img_id[9]}/${img_id[10]}/${file[0]}`,
    result => result
  );
};
// CRUD CV End

module.exports = {
  profileHrUpload,
  deleteImageProfile,
  uploudcv,
  deleteCV,
  uploudcvPelamar,
  uploudcvCadangan,
};
