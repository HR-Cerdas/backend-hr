require("dotenv").config();
const { MongoClient } = require("mongodb");
const client = new MongoClient(process.env.DATABASE_URL);
const db = client.db("hr_cerdas");

const createLowongan = async (req, res, next) => {
  const {
    position,
    districts,
    sub_district,
    postal_codes,
    salarymin,
    salarymax,
    tesRequired,
    skill,
    jobDescription,
    Essay,
  } = req.body;
  const { username } = req.user;
  try {
    const findIdHr = await db.collection("profilehrs").findOne({
      username: username,
    });
    if (!findIdHr)
      return res.status(400).json({
        status: "Bad Request",
        message: "data hr tidak ditemukan",
      });

    const rupiah = number => {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(number);
    };
    const salary = `${rupiah(salarymin)} - ${rupiah(salarymax)}`;

    const require = [];
    if (tesRequired === "true") {
      require.push("true");
    } else {
      require.push("false");
    }

    const esay = [];
    if (Essay === "true") {
      esay.push("true");
    } else {
      esay.push("false");
    }

    const createLowongan = await db.collection("lowongan_pekerjaan").insertOne({
      id_hr: findIdHr._id,
      position: position,
      // placementCity: placementC,
      skills: skill,
      salary: salary,
      tesrequired: require[0],
      jobdescription: jobDescription,
      essay: esay[0],
    });
    return res.status(200).json({
      message: "Berhasil Create Lowongan",
    });
  } catch (error) {
    return res.status(404).json({
      status: "Bad Requestss",
      message: error,
    });
  }
};
const getAllLowongan = async (req, res, next) => {
  try {
    const getData = await db.collection("lowongan_pekerjaan").find().toArray();

    return res.status(200).json({
      data: getData,
    });
  } catch (error) {
    return res.status(400).json({
      status: "Bad Request",
    });
  }
};

module.exports = {
  createLowongan,
  getAllLowongan,
};
