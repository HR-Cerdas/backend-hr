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

// const cloudinary = require("cloudinary").v2;
// require("dotenv").config();

// cloudinary.config({
//   cloud_name: process.env.cloud_name,
//   api_key: +process.env.api_key,
//   api_secret: process.env.api_secret,
//   secure: true,
// });

// const deleteImage = async () => {
//   return await cloudinary.uploader.destroy(
//     `secondHand/pt/dabcp62jg3ufw2xusrqi`,
//     result => result
//   );
// };
// deleteImage();

// const a =
//   "https://res.cloudinary.com/ddrv8rknj/image/upload/v1667319901/secondHand/pt/au4mvfp6lyhm5z13adxq.png";
// const b = a.split("/");
// console.log(b[9]);
require("dotenv").config();
const { MongoClient, ObjectId, Db } = require("mongodb");
const client = new MongoClient(process.env.DATABASE_URL);
const db = client.db("hr_cerdas");

db.collection("lowongan_pekerjaan").createIndex({ position: "text" });
