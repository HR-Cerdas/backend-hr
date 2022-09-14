require("dotenv").config();
const { MongoClient } = require("mongodb");
const client = new MongoClient(process.env.DATABASE_URL);
const db = client.db("hr_cerdas");

const moment = require("moment");
require("mongodb-moment")(moment);

// Get All Data Sesuai User Login
const getDetailProfil = async (req, res, next) => {
  // ambil data req
  const { username } = req.user;
  try {
    // Cari Document Ready or No Start
    const findAccountPelamar = await db.collection("profilepelamar").findOne({
      username: username,
    });
    if (!findAccountPelamar)
      return res.status(400).json({
        status: "Bad Request",
        message: "data pelamar tidak ditemukan",
      });
    // Cari Document Ready or No End

    return res.status(200).json({
      msg: findAccountPelamar,
    });
  } catch (error) {
    next(error);
  }
};
// Edit Detail Profil Pelamar
const editDetailProfil = async (req, res, next) => {
  // Ambil Data Req
  const { username } = req.user;
  const { location, age, gender, residentialStatus, nationality, noHp, email } =
    req.body;
  try {
    // Cari Document Account sesuai Login Start
    const findAccountPelamar = await db.collection("profilepelamar").findOne({
      username: username,
    });
    if (!findAccountPelamar)
      return res.status(400).json({
        status: "Bad Request",
        message: "data pelamar tidak ditemukan",
      });
    // Cari Document Account sesuai Login End

    // Validation Bollean Gender Start
    const genderr = [];
    if (gender === "true") {
      genderr.push("laki - laki");
    } else {
      genderr.push("perempuan");
    }
    // Validation Bollean Gender End

    // Edit Data pada 1 Document Start
    const updateDetailPelamar = await db.collection("profilepelamar").updateOne(
      { _id: findAccountPelamar._id },
      {
        $set: {
          email: email,
          noHp: noHp,
          DetailProfil: {
            location: location,
            age: age,
            gender: genderr[0],
            residentialStatus: residentialStatus,
            nationality: nationality,
          },
        },
      }
    );
    // Edit Data pada 1 Document End

    return res.status(200).json({
      msg: "berhasil mengubah data",
    });
  } catch (error) {
    next(error);
  }
};
// Get AboutMe Sesuai User Login
const updateAbout = async (req, res, next) => {
  const { username } = req.user;
  const { aboutme } = req.body;
  try {
    const findAccountPelamar = await db.collection("profilepelamar").findOne({
      username: username,
    });
    if (!findAccountPelamar)
      return res.status(400).json({
        status: "Bad Request",
        message: "data pelamar tidak ditemukan",
      });
    const updateAbout = await db.collection("profilepelamar").updateOne(
      { _id: findAccountPelamar._id },
      {
        $set: {
          aboutme: aboutme,
        },
      }
    );

    return res.status(200).json({
      msg: "berhasil Update Bio Aboutme",
    });
  } catch (error) {
    return res.status(404).json({
      status: "Bad Request",
    });
  }
};
const addWorkExperience = async (req, res, next) => {
  const { username } = req.user;
  const { jobPosition, company, startDate, endDate } = req.body;
  try {
    const findAccountPelamar = await db.collection("profilepelamar").findOne({
      username: username,
    });
    if (!findAccountPelamar)
      return res.status(400).json({
        status: "Bad Request",
        message: "data pelamar tidak ditemukan",
      });
    if (findAccountPelamar.workExperience === undefined) {
      const updateExperience = await db.collection("profilepelamar").updateOne(
        { _id: findAccountPelamar._id },
        {
          $set: {
            workExperience: [
              {
                jobosition: jobPosition,
                company: company,
                startDate: moment.utc(startDate),
                endDate: moment.utc(endDate),
              },
            ],
          },
        }
      );
    } else {
      await db.collection("profilepelamar").updateOne(
        { _id: findAccountPelamar._id },
        {
          $push: {
            workExperience: {
              $each: [
                {
                  jobosition: jobPosition,
                  company: company,
                  startDate: moment.utc(startDate),
                  endDate: moment.utc(endDate),
                },
              ],
            },
          },
        }
      );
    }
    return res.status(200).json({
      msg: "berhasil Update work experience",
    });
  } catch (error) {
    return res.status(404).json({
      status: "Bad Request",
    });
  }
};

module.exports = {
  getDetailProfil,
  editDetailProfil,
  updateAbout,
  addWorkExperience,
};