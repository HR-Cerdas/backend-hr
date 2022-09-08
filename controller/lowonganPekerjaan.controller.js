require("dotenv").config();
const { MongoClient } = require("mongodb");
const client = new MongoClient(process.env.DATABASE_URL);
const db = client.db("hr_cerdas");

const createLowongan = async (req, res, next) => {
  const {
    position,
    placementCity_id,
    salarymin,
    salarymax,
    tesRequired,
    mustHaveSkill,
    jobDescription,
    Essay,
  } = req.body;
  const cariusername = req.user.username;
  try {
    const findIdHr = await db.collection("profilehrs").findOne({
      username: cariusername,
    });
    if (!findIdHr)
      throw {
        message: "Hanya HR yang Dapat Membuat Lowongan",
        status: "Bad Request",
        code: 400,
      };

    const salary = `${salarymin} - ${salarymax}`;

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
      placementCity: placementCity_id,
      salary: salary,
      tesrequired: require[0],
      musthaveskill: mustHaveSkill,
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

module.exports = {
  createLowongan,
};
