// Menggunakan .env Start
require("dotenv").config();
// Menggunakan .env End
const bcrypt = require("bcryptjs");
const { MongoClient, ObjectId, Timestamp } = require("mongodb");
const client = new MongoClient(process.env.DATABASE_URL);
const db = client.db("hr_cerdas");
const { kirimEmail } = require("../helpers/email");
const { signToken, checkPassword, tokenCheck } = require("../misc/auth");
const moment = require("moment");

const register = async (req, res, next) => {
  const {
    namaPerusahaan,
    first_name,
    last_name,
    email,
    noHp,
    password,
    confPassword,
    username,
  } = req.body;
  try {
    // Check Email Ready Start
    const findEmail = await db
      .collection("profilehrs")
      .findOne({ email: email });
    if (findEmail)
      return res.status(400).json({
        status: "Bad Request",
        message: "Email Telah digunakan",
      });
    // Check Email Ready End

    // Check Email Ready Start
    const findUsername = await db
      .collection("profilehrs")
      .findOne({ username: username });
    if (findUsername)
      return res.status(400).json({
        status: "Bad Request",
        message: "Username telah digunakan",
      });
    // Check Email Ready End

    // Check Password Confirm Start
    if (password !== confPassword)
      throw {
        message: "Password Tidak Cocok",
        status: "Bad Request",
        code: 400,
      };
    // Check Password Confirm End

    // Create hash Password Start
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt);
    // Create hash Password End

    // Register Input Start
    const regis = await db.collection("profilehrs").insertOne({
      name: {
        first_name: first_name,
        last_name: last_name,
      },
      namaPerusahaan: namaPerusahaan,
      username: username,
      password: hashPassword,
      email: email,
      noHp: noHp,
      resetPasswordLink: "",
      created_at: new Date(
        Date.UTC(
          moment().get("year"),
          moment().get("month"),
          moment().get("date"),
          moment().get("hour"),
          moment().get("minute"),
          moment().get("second")
        )
      ),
      updated_at: new Date(
        Date.UTC(
          moment().get("year"),
          moment().get("month"),
          moment().get("date"),
          moment().get("hour"),
          moment().get("minute"),
          moment().get("second")
        )
      ),
    });
    // Register Input End

    res.json({ status: "Created", msg: "Register Berhasil" });
  } catch (e) {
    res.status(404).json({ msg: e });
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    // Check Data by Email Start
    const findEmail = await db.collection("profilehrs").findOne({
      email: email,
    });
    // error
    if (!findEmail)
      return res.status(400).json({
        status: "Bad Request",
        message: "Email Salah",
      });
    // Check Data by Email End

    // Check Password True & login Start
    const passwordTrue = checkPassword(password, findEmail.password);
    if (passwordTrue) {
      const payload = {
        id: findEmail._id,
        username: findEmail.username,
      };

      const token = signToken(payload);
      return res.status(200).json({
        data: token,
        expired: 60000,
      });
    }
    // Check Password True & login End

    return res.status(400).json({
      status: "Bad Request",
      message: "Password salah",
    });
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  try {
    // Cari email di collection profilehrs Start
    const findEmail = await db.collection("profilehrs").findOne({
      email: email,
    });
    // Cari email di collection profilehrs End

    // Cek Email apakah telah terdaftar Start
    if (!findEmail)
      return res.status(400).json({
        status: "Bad Request",
        message: "Email tidak ditemukan",
      });
    // Cek Email apakah telah terdaftar End

    // Create Token Start
    const cek = tokenCheck(findEmail);
    // Create Token End

    // Create Update Document Start
    await db.collection("profilehrs").updateOne(
      { _id: findEmail._id },
      {
        $set: {
          resetPasswordLink: cek,
          updated_by: findEmail._id,
          updated_at: new Date(
            Date.UTC(
              moment().get("year"),
              moment().get("month"),
              moment().get("date"),
              moment().get("hour"),
              moment().get("minute"),
              moment().get("second")
            )
          ),
        },
      }
    );
    // Create Update Document End

    // Template Text Email Start
    const templateEmail = {
      from: "rajihkharissuha120701@gmail.com", // sender address
      to: email, // list of receivers
      subject: "Hello ✔", // Subject line
      text: "Hello world?", // plain text body
      html: "<p>Silahkan klick tombol di bawah untuk mengganti Password</p> <form action=`${process.env.CLIENT_URL}/resetpassword/${cek}`><input type='submit' value='Reset Password' /></form>",
    };
    kirimEmail(templateEmail);
    // Template Text Email End

    return res.status(200).json({
      message: "Link reset password berhasil terkirim melalui email",
    });
  } catch (error) {
    return res.status(400).json({
      status: "Bad Request",
      message: error,
    });
  }
};

const getToken = async (req, res, next) => {
  try {
    const find = await db.collection("profilehrs").find().toArray();
    // Cari email di collection profilehrs End
    // Cek Email apakah telah terdaftar Start
    return res.status(200).json({
      data: find,
    });
  } catch (error) {
    return res.status(400).json({
      status: "Bad Request",
      message: error,
    });
  }
};

const resetPassword = async (req, res, next) => {
  const { token, password, confPassword } = req.body;
  try {
    // Cari Token di collection profilehrs Start
    const findToken = await db.collection("profilehrs").findOne({
      resetPasswordLink: token,
    });
    // Cari Token di collection profilehrs End

    // Check Password Confirm Start
    if (password !== confPassword)
      throw {
        message: "Password Tidak Cocok",
        status: "Bad Request",
        code: 400,
      };
    // Check Password Confirm End

    // Create Hash Password Start
    const salt = bcrypt.genSaltSync(10);
    const hashResetPassword = bcrypt.hashSync(password, salt);
    // Create Hash Password End

    // Create Update Document Start
    if (findToken) {
      await db.collection("profilehrs").updateOne(
        { _id: findToken._id },
        {
          $set: {
            password: hashResetPassword,
            resetPasswordLink: "",
            updated_by: findToken._id,
            updated_at: new Date(
              Date.UTC(
                moment().get("year"),
                moment().get("month"),
                moment().get("date"),
                moment().get("hour"),
                moment().get("minute"),
                moment().get("second")
              )
            ),
          },
        }
      );
    }
    // Create Update Document End

    return res.status(200).json({
      message: "Password Berhasil di Ganti",
    });
  } catch (error) {
    return res.status(400).json({
      status: "Bad Request",
      message: error,
    });
  }
};

const getprofilid = async (req, res) => {
  const { id } = req.user;
  console.log(id);
  try {
    const findhr = await db.collection("profilehrs").findOne({
      _id: ObjectId(id),
    });
    if (!findhr)
      return res.status(400).json({
        status: "Bad Request",
        message: "data hr tidak ditemukan",
      });

    res.status(200).json({ data: findhr });
  } catch (error) {
    res.status(404).json({ msg: "Not Found" });
  }
};

module.exports = {
  getprofilid,
  register,
  login,
  forgotPassword,
  resetPassword,
  getToken,
};
