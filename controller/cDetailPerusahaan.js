require("dotenv").config();
const { MongoClient } = require("mongodb");
const client = new MongoClient(process.env.DATABASE_URL);
const db = client.db("hr_cerdas");
const path = require("path");

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
  const ktp = req.file;
  const tdp = req.file;
  const siup = req.file;
  // const textKtp = ktp.ktp[0].path + "ktp";
  // const textTdp = tdp.tdp[0].path + "tdp";
  // const textSiup = siup.tdp[0].path + "siup";
  console.log(ktp[0].path);
  console.log(tdp[0].path);
  console.log(siup[0].path);

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
    // console.log(findAccountHr);
    // console.log(findAccountHr.DetailProfile.filetdp);

    // var filename = path.basename(`../assets/DetailPerusahaan/${username}/ktp`);

    const textKtp = [];
    const textTdp = [];
    const textSiup = [];

    if (ktp[0] === undefined) {
      textKtp.push("");
    } else {
      textKtp.push(ktp[0].path);
    }
    if (tdp[0] === undefined) {
      textTdp.push("");
    } else {
      textTdp.push(tdp[0].path);
    }
    if (siup[0] === undefined) {
      textSiup.push("");
    } else {
      textSiup.push(siup[0].path);
    }

    console.log(textKtp);
    console.log(textTdp);
    console.log(textSiup);

    const editPorfileDetail = await db.collection("profilehrs").updateOne(
      { _id: findAccountHr._id },
      {
        $set: {
          DetailProfile: {
            industrycategory: industryCategory,
            capacity: Capacity,
            deskripsi: DetailDescription,
            filektp: textKtp[0],
            filetdp: textTdp[0],
            filesiup: textSiup[0],
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
