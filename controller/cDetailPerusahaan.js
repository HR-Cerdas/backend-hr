require("dotenv").config();
const { MongoClient } = require("mongodb");
const client = new MongoClient(process.env.DATABASE_URL);
const db = client.db("hr_cerdas");
const path = require("path");
const fs = require("fs");

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
  const siup = req.files;
  // console.log(ktp);
  // const textKtp = ktp.ktp[0].path + "ktp";
  // const textTdp = tdp.tdp[0].path + "tdp";
  // const textSiup = siup.tdp[0].path + "siup";

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

    // console.log(filenamektp);

    const textKtp = [];
    const textTdp = [];
    const textSiup = [];

    try {
      const files = fs.readdirSync(`./assets/DetailPerusahaan/${username}`);
      // console.log("kikikikiki");

      let filenamektp = path.basename(
        `../${findAccountHr.DetailProfile.filektp}`
      );
      let filenametdp = path.basename(
        `../${findAccountHr.DetailProfile.filetdp}`
      );
      let filenamesiup = path.basename(
        `../${findAccountHr.DetailProfile.filesiup}`
      );

      if (ktp.ktp === undefined) {
        if (findAccountHr.DetailProfile.filektp === "") {
          textKtp.push("");
        } else {
          const paths = `./assets/DetailPerusahaan/${username}/ktp/${filenamektp}`;
          fs.unlink(paths, function (err) {
            if (err) {
              throw err;
            } else {
              console.log("Successfully deleted the file.");
            }
          });
          textKtp.push(ktp.ktp[0].path);
        }
      } else {
        if (filenamektp === "..") {
          textKtp.push(ktp.ktp[0].path);
        } else {
          let filenamektp = path.basename(
            `../${findAccountHr.DetailProfile.filektp}`
          );
          const paths = `./assets/DetailPerusahaan/${username}/ktp/${filenamektp}`;
          fs.unlink(paths, function (err) {
            if (err) {
              throw err;
            } else {
              console.log("Successfully deleted the file.");
            }
          });
          textKtp.push(ktp.ktp[0].path);
        }
      }

      if (tdp.tdp === undefined) {
        if (findAccountHr.DetailProfile.filetdp === "") {
          textTdp.push("");
        } else {
          const paths = `./assets/DetailPerusahaan/${username}/tdp/${filenametdp}`;
          fs.unlink(paths, function (err) {
            if (err) {
              throw err;
            } else {
              console.log("Successfully deleted the file.");
            }
          });
          textTdp.push(tdp.tdp[0].path);
        }
      } else {
        if (filenametdp === "..") {
          textTdp.push(tdp.tdp[0].path);
        } else {
          let filenametdp = path.basename(
            `../${findAccountHr.DetailProfile.filetdp}`
          );
          const paths = `./assets/DetailPerusahaan/${username}/tdp/${filenametdp}`;
          fs.unlink(paths, function (err) {
            if (err) {
              throw err;
            } else {
              console.log("Successfully deleted the file.");
            }
          });
          textTdp.push(tdp.tdp[0].path);
        }
      }

      if (siup.siup === undefined) {
        if (findAccountHr.DetailProfile.filesiup === "") {
          textSiup.push("");
        } else {
          const paths = `./assets/DetailPerusahaan/${username}/siup/${filenamesiup}`;
          fs.unlink(paths, function (err) {
            if (err) {
              throw err;
            } else {
              console.log("Successfully deleted the file.");
            }
          });
          textSiup.push(siup.siup[0].path);
        }
      } else {
        if (filenamesiup === "..") {
          textSiup.push(siup.siup[0].path);
        } else {
          let filenamesiup = path.basename(
            `../${findAccountHr.DetailProfile.filesiup}`
          );
          const paths = `./assets/DetailPerusahaan/${username}/siup/${filenamesiup}`;
          fs.unlink(paths, function (err) {
            if (err) {
              throw err;
            } else {
              console.log("Successfully deleted the file.");
            }
          });
          textSiup.push(siup.siup[0].path);
        }
      }
    } catch (error) {
      // console.log("asdasd");

      if (ktp.ktp === undefined) {
        textKtp.push("");
      } else {
        textKtp.push(ktp.ktp[0].path);
      }
      if (tdp.tdp === undefined) {
        textTdp.push("");
      } else {
        textTdp.push(tdp.tdp[0].path);
      }
      if (siup.siup === undefined) {
        textSiup.push("");
      } else {
        textSiup.push(siup.siup[0].path);
      }
    }

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
