require("dotenv").config();
const { MongoClient } = require("mongodb");
const client = new MongoClient(process.env.DATABASE_URL);
const db = client.db("hr_cerdas");

const editDetailBasicInfo = async (req, res, next) => {
  const { username } = req.user;
  const { namaperusahaan, alamat, noPerusahaan, email, website, deskripsi } =
    req.body;
  const fotoProfilPerusahaan = req.file;
  try {
    const findAccountHr = await db
      .collection("profilehrs")
      .findOne({ username: username });
    if (!findAccountHr) {
      return res.status(400).json({
        status: "Bad Request",
        message: "data hr tidak ditemukan",
      });
    }
    const editBasicDetail = await db.collection("profilehrs").updateOne(
      { _id: findAccountHr._id },
      {
        $set: {
          DetailBasicPerusahaan: {
            namaperusahaan: namaperusahaan,
            alamat: alamat,
            noPerusahaan: noPerusahaan,
            email: email,
            website: website,
            fotoperusahaan: fotoProfilPerusahaan.path,
            deskripsi: deskripsi,
          },
        },
      }
    );

    return res.status(200).json({
      msg: "berhasil Update Detail Basic Perusahaan",
    });
  } catch (error) {
    return res.status(404).json({
      status: "Bad Request",
    });
  }
};

const editDetailProfile = async (req, res, next) => {
  const { username } = req.user;
  const { industryCategory, Capacity, DetailDescription } = req.body;
  const ktp = req.files;
  const tdp = req.files;

  try {
    const findAccountHr = await db
      .collection("profilehrs")
      .findOne({ username: username });
    if (!findAccountHr) {
      return res.status(400).json({
        status: "Bad Request",
        message: "data hr tidak ditemukan",
      });
    }

    const editPorfileDetail = await db.collection("profilehrs").updateOne(
      { _id: findAccountHr._id },
      {
        $set: {
          DetailProfile: {
            industrycategory: industryCategory,
            capacity: Capacity,
            deskripsi: DetailDescription,
            filektp: ktp.ktp[0].path,
            filetdp: tdp.tdp[0].path,
          },
        },
      }
    );

    return res.status(200).json({
      msg: "berhasil Update Detail Basic Perusahaan",
    });
  } catch (error) {
    return res.status(404).json({
      status: "Bad Request",
    });
  }
};

module.exports = { editDetailBasicInfo, editDetailProfile };
