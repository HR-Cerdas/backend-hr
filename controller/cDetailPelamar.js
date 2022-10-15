require("dotenv").config();
const { MongoClient, ObjectId } = require("mongodb");
const client = new MongoClient(process.env.DATABASE_URL);
const db = client.db("hr_cerdas");
const path = require("path");
const fs = require("fs");

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
  const { id } = req.user;
  const {
    location,
    tanggalLahir,
    gender,
    residentialStatus,
    nationality,
    noHp,
    email,
  } = req.body;
  try {
    // Cari Document Account sesuai Login Start
    const findAccountPelamar = await db.collection("profilepelamar").findOne({
      _id: ObjectId(id),
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
      { _id: ObjectId(id) },
      {
        $set: {
          email: email,
          noHp: noHp,
          DetailProfil: {
            location: location,
            tanggalLahir: moment.utc(tanggalLahir),
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
    return res.status(404).json({
      status: "Bad Request",
    });
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

    const dateEnd = [];
    if (endDate === "present") {
      dateEnd.push("present");
    } else {
      dateEnd.push(moment.utc(endDate));
    }

    if (findAccountPelamar.workExperience === undefined) {
      await db.collection("profilepelamar").updateOne(
        { _id: findAccountPelamar._id },
        {
          $set: {
            workExperience: [
              {
                jobposition: jobPosition,
                company: company,
                startDate: moment.utc(startDate),
                endDate: dateEnd[0],
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
                  endDate: dateEnd[0],
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
const addEducation = async (req, res, next) => {
  const { username } = req.user;
  const { lembaga, gelar, bidangStudy, startDate, endDate } = req.body;

  try {
    const findAccountPelamar = await db.collection("profilepelamar").findOne({
      username: username,
    });
    if (!findAccountPelamar)
      return res.status(400).json({
        status: "Bad Request",
        message: "data pelamar tidak ditemukan",
      });

    const dateEnd = [];
    if (endDate === "present") {
      dateEnd.push("present");
    } else {
      dateEnd.push(moment.utc(endDate));
    }

    if (findAccountPelamar.addEducation === undefined) {
      const updateExperience = await db.collection("profilepelamar").updateOne(
        { _id: findAccountPelamar._id },
        {
          $set: {
            addEducation: [
              {
                lembaga: lembaga,
                gelar: gelar,
                bidangStudy: bidangStudy,
                startDate: moment.utc(startDate),
                endDate: dateEnd[0],
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
            addEducation: {
              $each: [
                {
                  lembaga: lembaga,
                  gelar: gelar,
                  bidangStudy: bidangStudy,
                  startDate: moment.utc(startDate),
                  endDate: dateEnd[0],
                },
              ],
            },
          },
        }
      );
    }
    return res.status(200).json({
      msg: "berhasil Update Education",
    });
  } catch (error) {
    return res.status(404).json({
      status: "Bad Request",
    });
  }
};
const addSkill = async (req, res, next) => {
  const { username } = req.user;
  const { skill } = req.body;
  try {
    const findAccountPelamar = await db.collection("profilepelamar").findOne({
      username: username,
    });
    if (!findAccountPelamar)
      return res.status(400).json({
        status: "Bad Request",
        message: "data pelamar tidak ditemukan",
      });
    if (findAccountPelamar.skills === undefined) {
      const updateSkill = await db.collection("profilepelamar").updateOne(
        { _id: findAccountPelamar._id },
        {
          $set: {
            skills: skill,
          },
        }
      );
    } else {
      const ontol = await db
        .collection("profilepelamar")
        .find({ _id: findAccountPelamar._id })
        .project({
          skills: 1,
        })
        .toArray();
      const value = new Set([...ontol[0].skills, ...skill]);
      await db.collection("profilepelamar").updateOne(
        { _id: findAccountPelamar._id },
        {
          $set: {
            skills: [...value],
          },
        }
      );
    }
    return res.status(200).json({
      msg: "berhasil Update Skill",
    });
  } catch (error) {
    return res.status(404).json({
      status: "Bad Request",
    });
  }
};
const addJobInterests = async (req, res, next) => {
  const { username } = req.user;
  const { job } = req.body;
  try {
    const findAccountPelamar = await db.collection("profilepelamar").findOne({
      username: username,
    });
    if (!findAccountPelamar)
      return res.status(400).json({
        status: "Bad Request",
        message: "data pelamar tidak ditemukan",
      });
    if (findAccountPelamar.jobInterest === undefined) {
      const updateJob = await db.collection("profilepelamar").updateOne(
        { _id: findAccountPelamar._id },
        {
          $set: {
            jobInterest: job,
          },
        }
      );
    } else {
      const ontol = await db
        .collection("profilepelamar")
        .find({ _id: findAccountPelamar._id })
        .project({
          jobInterest: 1,
        })
        .toArray();
      const value = new Set([...ontol[0].jobInterest, ...job]);
      await db.collection("profilepelamar").updateOne(
        { _id: findAccountPelamar._id },
        {
          $set: {
            jobInterest: [...value],
          },
        }
      );
    }
    return res.status(200).json({
      msg: "berhasil Update Job",
    });
  } catch (error) {
    return res.status(404).json({
      status: "Bad Request",
    });
  }
};
const addResume = async (req, res, next) => {
  const { username } = req.user;
  const cv = req.file;
  try {
    const findAccountPelamar = await db.collection("profilepelamar").findOne({
      username: username,
    });
    if (!findAccountPelamar)
      return res.status(400).json({
        status: "Bad Request",
        message: "data pelamar tidak ditemukan",
      });

    let filenamektp = path.basename(`../${findAccountPelamar.pathCV}`);

    const cekResumeNama = [];
    const cekResumePath = [];
    if (findAccountPelamar.pathCV === undefined) {
      cekResumeNama.push(cv.filename);
      cekResumePath.push(cv.path);
    } else {
      if (cv.filename === filenamektp) {
        console.log("ya sudah");
      } else {
        const paths = `./assets/cv/${username}/${filenamektp}`;
        fs.unlink(paths, function (err) {
          if (err) {
            throw err;
          } else {
            console.log("Successfully deleted the file.");
          }
        });

        cekResumeNama.push(cv.filename);
        cekResumePath.push(cv.path);
      }
    }

    await db.collection("profilepelamar").updateOne(
      { _id: findAccountPelamar._id },
      {
        $set: {
          namaCV: cekResumeNama[0],
          pathCV: cekResumePath[0],
        },
      }
    );
    return res.status(200).json({
      msg: "berhasil Update Resume",
    });
  } catch (error) {
    return res.status(404).json({
      status: "Bad Request",
    });
  }
};
const addSosialMedia = async (req, res, next) => {
  const { facebook, twitter, instagram, linkedin } = req.body;
  const { username } = req.user;
  try {
    const findAccountPelamar = await db.collection("profilepelamar").findOne({
      username: username,
    });
    if (!findAccountPelamar)
      return res.status(400).json({
        status: "Bad Request",
        message: "data pelamar tidak ditemukan",
      });
    const updateSosialMedia = await db.collection("profilepelamar").updateOne(
      { _id: findAccountPelamar._id },
      {
        $set: {
          sosialMedia: {
            facebook: facebook,
            twitter: twitter,
            instagram: instagram,
            linkedin: linkedin,
          },
        },
      }
    );
    return res.status(200).json({
      msg: "berhasil Update Sosial Media",
    });
  } catch (error) {
    return res.status(404).json({
      status: "Bad Request",
    });
  }
};
const addOrganization = async (req, res, next) => {
  const { username } = req.user;
  const { organizationName, Role, startDate, endDate } = req.body;

  try {
    const findAccountPelamar = await db.collection("profilepelamar").findOne({
      username: username,
    });
    if (!findAccountPelamar)
      return res.status(400).json({
        status: "Bad Request",
        message: "data pelamar tidak ditemukan",
      });
    if (findAccountPelamar.addorganization === undefined) {
      const updateExperience = await db.collection("profilepelamar").updateOne(
        { _id: findAccountPelamar._id },
        {
          $set: {
            addorganization: [
              {
                organizationName: organizationName,
                Role: Role,
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
            addorganization: {
              $each: [
                {
                  organizationName: organizationName,
                  Role: Role,
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
      msg: "berhasil Update Education",
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
  addEducation,
  addSkill,
  addJobInterests,
  addResume,
  addSosialMedia,
  addOrganization,
};
