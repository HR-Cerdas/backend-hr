require("dotenv").config();
const { MongoClient, ObjectId, Db } = require("mongodb");
const client = new MongoClient(process.env.DATABASE_URL);
const db = client.db("hr_cerdas");
const path = require("path");
const fs = require("fs");
const moment = require("moment");

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
  const { id } = req.user;
  try {
    const findIdHr = await db.collection("profilehrs").findOne({
      _id: ObjectId(id),
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
      namaPerusahaan: findIdHr.namaPerusahaan,
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
      status: "Bad Requests",
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

const applyLowongan = async (req, res, next) => {
  const { username } = req.user;
  const { nomer, alasan } = req.body;
  const resume = req.file;

  const id = req.params.id;

  try {
    const findIdPelamar = await db.collection("profilepelamar").findOne({
      username: username,
    });
    if (!findIdPelamar)
      return res.status(400).json({
        status: "Bad Request",
        message: "data pelamar tidak ditemukan",
      });

    const findLowongan = await db.collection("lowongan_pekerjaan").findOne({
      _id: ObjectId(id),
    });
    if (!findLowongan)
      return res.status(400).json({
        status: "Bad Request",
        message: "lowongan tidak di temukan",
      });

    const findPerusahaan = await db.collection("profilehrs").findOne({
      _id: ObjectId(findLowongan.id_hr),
    });
    if (!findLowongan)
      return res.status(400).json({
        status: "Bad Request",
        message: "data hr tidak di temukan",
      });

    // if (findLowongan.Pelamar !== undefined) {
    //   findLowongan.Pelamar.map(e => {
    //     if (e.id_pelamar.toString() === findIdPelamar._id.toString()) {
    //       return res.status(400).json({
    //         message: "Anda Telah Apply di Lowongan ini",
    //       });
    //     } else {
    //       console.log("geo kontol");
    //     }
    //   });
    // }

    // Query A untuk mencari apakah terdapat pelamar dalam lowongan yang ingin di aplly
    const a = await db
      .collection("lowongan_pekerjaan")
      .find({
        _id: ObjectId(id),
        "Pelamar.id_pelamar": ObjectId(findIdPelamar._id),
      })
      .toArray();
    // console.log(a);
    if (a[0] === undefined) {
      const cekResumeNama = [];
      const cekResumePath = [];

      if (findIdPelamar.pathCV === undefined) {
        if (resume === undefined) {
          return res.status(400).json({
            status: "Bad Request",
            message: "Harus Menambahkan CV",
          });
        } else {
          await db.collection("profilepelamar").updateOne(
            { _id: ObjectId(findIdPelamar._id) },
            {
              $set: {
                namaCV: resume.filename,
                pathCV: resume.path,
              },
            }
          );
          cekResumeNama.push(resume.filename);
          cekResumePath.push(resume.path);
        }
      } else {
        let filenameCv = path.basename(`../${findIdPelamar.pathCV}`);
        if (resume === undefined) {
          // const a = await db
          //   .collection("lowongan_pekerjaan")
          //   .find({
          //     _id: ObjectId(findLowongan._id),
          //     "Pelamar.id_pelamar": ObjectId(findIdPelamar._id.toString()),
          //   })
          //   .toArray();
          // if (a) {
          //   return res.status(400).json({
          //     status: "Bad Request",
          //     message: "Anda Telah Apply di Lowongan ini",
          //   });
          // } else {
          cekResumePath.push(findIdPelamar.pathCV);
          cekResumeNama.push(filenameCv);
          // }
        } else {
          if (resume.filename === filenameCv) {
            // const a = await db
            //   .collection("lowongan_pekerjaan")
            //   .find({
            //     _id: ObjectId(findLowongan._id),
            //     "Pelamar.id_pelamar": ObjectId(findIdPelamar._id.toString()),
            //   })
            //   .toArray();
            // if (a) {
            //   return res.status(400).json({
            //     status: "Bad Request",
            //     message: "Anda Telah Apply di Lowongan ini",
            //   });
            // } else {
            cekResumePath.push(findIdPelamar.pathCV);
            cekResumeNama.push(filenameCv);
            // }
          } else {
            const paths = `./assets/cv/${username}/${resume.filename}`;
            fs.unlink(paths, err => {
              if (err) console.log(err);
              else {
                console.log("\nDeleted file: example_file.txt");
              }
            });
          }
          cekResumePath.push(findIdPelamar.pathCV);
          cekResumeNama.push(filenameCv);
        }
      }

      const name = findIdPelamar.name.first_name + findIdPelamar.name.last_name;

      if (findLowongan.Pelamar === undefined) {
        await db.collection("lowongan_pekerjaan").updateOne(
          { _id: ObjectId(findLowongan._id) },
          {
            $set: {
              Pelamar: [
                {
                  id_pelamar: findIdPelamar._id,
                  name: name,
                  nomer: nomer,
                  alasan: alasan,
                  namaResume: cekResumeNama[0],
                  pathResume: cekResumePath[0],
                },
              ],
            },
          }
        );
        return res.status(200).json({
          msg: `berhasil melamar di`,
        });
      } else {
        await db.collection("lowongan_pekerjaan").updateOne(
          { _id: ObjectId(findLowongan._id) },
          {
            $push: {
              Pelamar: {
                $each: [
                  {
                    id_pelamar: findIdPelamar._id,
                    name: name,
                    nomer: nomer,
                    alasan: alasan,
                    namaResume: cekResumeNama[0],
                    pathResume: cekResumePath[0],
                  },
                ],
              },
            },
          }
        );
        return res.status(200).json({
          msg: `berhasil melamar dissss`,
        });
      }
    } else {
      const paths = `./assets/cv/${username}/${resume.filename}`;
      fs.unlink(paths, err => {
        if (err) console.log(err);
        else {
          console.log("\nDeleted file: example_file.txt");
        }
      });
      return res.status(400).json({
        msg: "Anda Telah Aplly Di Lowongan ini",
      });
    }
  } catch (error) {
    return res.status(404).json({
      status: "Bad Request",
    });
  }
};

const getAllDataPelamarApply = async (req, res, next) => {
  const { id } = req.user;
  const idlowongan = req.params.id;

  try {
    const findIdhr = await db.collection("profilehrs").findOne({
      _id: ObjectId(id),
    });
    if (!findIdhr)
      return res.status(400).json({
        status: "Bad Request",
        message: "data hr tidak ditemukan",
      });

    const findLowonganByidHr = await db
      .collection("lowongan_pekerjaan")
      .findOne({
        id_hr: ObjectId(id),
      });
    if (!findLowonganByidHr)
      return res.status(400).json({
        status: "Bad Request",
        message: "data lowongan pekerjaan tidak ditemukan",
      });
    if (
      findLowonganByidHr._id.toString() === idlowongan &&
      findLowonganByidHr.id_hr.toString() === id
    ) {
      return res.status(200).json({
        msg: findLowonganByidHr.Pelamar,
      });
    } else {
      return res.status(400).json({
        status: "Bad Request",
        message: "data lowongan pekerjaan tidak ditemukan",
      });
    }
  } catch (error) {
    return res.status(404).json({
      status: "Bad Request",
    });
  }
};

const getLowonganhr = async (req, res, next) => {
  const { id } = req.user;
  console.log(id);

  try {
    const findIdhr = await db.collection("profilehrs").findOne({
      _id: ObjectId(id),
    });
    if (!findIdhr)
      return res.status(400).json({
        status: "Bad Request",
        message: "data hr tidak ditemukan",
      });
    const findLowonganByHr = await db
      .collection("lowongan_pekerjaan")
      .find({ id_hr: ObjectId(id) })
      .toArray();

    return res.status(200).json({
      data: findLowonganByHr,
    });
  } catch (error) {
    return res.status(404).json({
      status: "Bad Request",
    });
  }
};

const deleteLowongan = async (req, res, next) => {
  const { id } = req.user;
  const idlowongan = req.params.id;
  try {
    const findIdhr = await db.collection("profilehrs").findOne({
      _id: ObjectId(id),
    });
    if (!findIdhr)
      return res.status(400).json({
        status: "Bad Request",
        message: "data hr tidak ditemukan",
      });
    await db
      .collection("lowongan_pekerjaan")
      .deleteOne({ _id: ObjectId(idlowongan) });
    return res.status(200).json({
      msg: "berhasil menghapus lowongan pekerjaan",
    });
  } catch (error) {
    return res.status(404).json({
      status: "Bad Request",
    });
  }
};

const updateLowongan = async (req, res, next) => {
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
  const id = req.params.id;
  const { username } = req.user;

  try {
    const findLowongan = await db
      .collection("lowongan_pekerjaan")
      .findOne({ _id: ObjectId(id) });
    if (!findLowongan) {
      return res.status(400).json({
        message: `Hanya perusahaan ${findLowongan.namaPerusahaan} yang dapat mengganti lowongan`,
      });
    }
    const findHr = await db
      .collection("profilehrs")
      .findOne({ username: username });
    if (!findHr) {
      return res.status(400).json({
        message: "data hr tidak ditemukan",
      });
    }

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
    if (findHr.DetailBasicPerusahaan === undefined) {
      profileImage.push("");
    } else {
      profileImage.push(findHr.DetailBasicPerusahaan.fotoperusahaan);
    }

    const updateLowongan = await db.collection("lowongan_pekerjaan").updateOne(
      { _id: ObjectId(id) },
      {
        $set: {
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
          updated_ad: new Date(
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
    return res.status(200).json({
      message: "Berhasil Update Lowongan",
    });
  } catch (error) {
    return res.status(404).json({
      status: "Bad Request",
    });
  }
};

module.exports = {
  createLowongan,
  getAllLowongan,
  getDetailLowongan,
  applyLowongan,
  getAllDataPelamarApply,
  getLowonganhr,
  deleteLowongan,
  updateLowongan,
};
