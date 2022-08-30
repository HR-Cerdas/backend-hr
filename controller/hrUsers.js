// Menggunakan .env Start
require("dotenv").config();
// Menggunakan .env E
const bcrypt = require("bcryptjs");
const { MongoClient } = require("mongodb");
const client = new MongoClient(process.env.DATABASE_URL);
const db = client.db("hr_cerdas");
const jwt = require("jsonwebtoken");
const { signToken, checkPassword } = require("../misc/auth");

const register = async (req, res, next) => {
  const {
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
      throw {
        message: "Email telah digunakan",
        status: "Bad Request",
        code: 400,
      };
    // Check Email Ready End

    // Check Email Ready Start
    const findUsername = await db
      .collection("profilehrs")
      .findOne({ username: username });
    if (findUsername)
      throw {
        message: "Username telah digunakan",
        status: "Bad Request",
        code: 400,
      };
    // Check Email Ready End

    // Check Password Confirm Start
    if (password !== confPassword)
      throw {
        message: "Password Tidak Cocok",
        status: "Bad Request",
        code: 400,
      };
    // Check Password Confirm End

    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt);
    // Register Input Start
    const regis = await db.collection("profilehrs").insertOne({
      name: {
        first_name: first_name,
        last_name: last_name,
      },
      username: username,
      password: hashPassword,
      email: email,
      noHp: noHp,
      resetPasswordLink: "",
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
    const findEmail = await db.collection("profilehrs").findOne({
      email: email,
    });
    if (!findEmail)
      throw { message: "Email Salah", status: "Bad Request", code: 400 };

    const passwordTrue = checkPassword(password, findEmail.password);

    if (passwordTrue) {
      const payload = {
        id: findEmail.id,
        username: findEmail.username,
      };

      const token = signToken(payload);
      return res.status(200).json({
        data: token,
      });
    }
    return res.status(400).json({
      status: "Bad Request",
      message: "password is incorrect",
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
      throw {
        message: "Email Tidak Terdaftar",
        status: "Bad Request",
        code: 400,
      };
    // Cek Email apakah telah terdaftar End
    // const cek = tokenCheck(findEmail);
    const tokenCheck = jwt.sign(
      { iduser: findEmail._id },
      process.env.JWT_SECRET
    );
    const lol = await db
      .collection("profilehrs")
      .updateOne(
        { _id: findEmail._id },
        { $set: { resetPasswordLink: tokenCheck } }
      );
    return res.status(200).json({
      message: "Berhasil Update",
    });
  } catch (error) {
    return res.status(400).json({
      status: "Bad Request",
      message: error,
    });
  }
};

const nyoba = async (req, res) => {
  try {
    const getData = await db.collection("profilehrs").find().toArray();

    res.status(200).json({ msg: getData });
  } catch (error) {
    res.status(404).json({ msg: "Not Found" });
  }
};

module.exports = { nyoba, register, login, forgotPassword };
