// const moment = require("moment");

// console.log(moment().get("hour"));
// const utcDate = new Date(
//   Date.UTC(
//     moment().get("year"),
//     moment().get("month"),
//     moment().get("date"),
//     moment().get("hour"),
//     moment().get("minute"),
//     moment().get("second")
//   )
// );
// console.log(utcDate);
// console.log(Math.floor(Math.random() * 90 + 10));

const cloudinary = require("cloudinary").v2;
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: +process.env.api_key,
  api_secret: process.env.api_secret,
  secure: true,
});

const deleteImage = async () => {
  return await cloudinary.uploader.destroy(
    `HrCerdas/CV/geo/ynxs2emev8fhchmfnmi9`,
    result => result
  );
};
deleteImage();

// const a =
//   "https://res.cloudinary.com/ddrv8rknj/image/upload/v1669307685/HrCerdas/CV/geo/jnfuhmqax04hlqmhvirc.pdf/";
// const b = a.toString().split("/");
// console.log(b);
