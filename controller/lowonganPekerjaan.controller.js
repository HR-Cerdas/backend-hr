require("dotenv").config();
const { MongoClient, ObjectId } = require("mongodb");
const client = new MongoClient(process.env.DATABASE_URL);
const db = client.db("hr_cerdas");

const createLowongan = async (req, res, next) => {
  const {
    position,
    placementCity,
    salarymin,
    salarymax,
    tesRequired,
    skill,
    jobDescription,
    Essay,
    startdate,
    enddate,
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

    const profileImage = [];

    if (findIdHr.DetailBasicPerusahaan === undefined) {
      profileImage.push("");
    } else {
      profileImage.push(findIdHr.DetailBasicPerusahaan.fotoperusahaan);
    }

    const createLowongan = await db.collection("lowongan_pekerjaan").insertOne({
      id_hr: findIdHr._id,
      position: position,
      placementCity: placementCity,
      skills: skill,
      salary: salary,
      tesrequired: require[0],
      jobdescription: jobDescription,
      essay: esay[0],
      profileImage: profileImage[0],
      start_date: startdate,
      end_date: enddate,
      created_at: new Date(),
      updated_ad: new Date(),
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

const getDetailLowongan = async (req, res, next) => {
  const id = req.params.id;

  try {
    const findIdLowongan = await db.collection("lowongan_pekerjaan").findOne({
      _id: ObjectId(id),
    });
    console.log(findIdLowongan);
    if (!findIdLowongan)
      return res.status(400).json({
        status: "Bad Request",
        message: "lowongan tidak di temukan",
      });

    return res.status(200).json({
      data: findIdLowongan,
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

// const applyLowongan = async (req, res, next) => {
//   const { username } = req.user;
//   const id = req.params.id;
//   try {
//     const findIdHr = await db.collection("profilehrs").findOne({
//       username: username,
//     });
//     if (!findIdHr)
//       return res.status(400).json({
//         status: "Bad Request",
//         message: "data hr tidak ditemukan",
//       });

//     const findLowongan = await db.collection("lowongan_pekerjaan").findOne({
//       _id: ObjectId(id),
//     });
//     if (!findLowongan)
//       return res.status(400).json({
//         status: "Bad Request",
//         message: "lowongan tidak di temukan",
//       });
//   } catch (error) {}
// };

module.exports = {
  createLowongan,
  getAllLowongan,
  getDetailLowongan,
};
