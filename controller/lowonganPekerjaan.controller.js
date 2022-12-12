require("dotenv").config();
const { MongoClient, ObjectId, Db } = require("mongodb");
const client = new MongoClient(process.env.DATABASE_URL);
const db = client.db("hr_cerdas");
const path = require("path");
const fs = require("fs");
const moment = require("moment");

const claudinary = require("../misc/claudinary");

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

const getAllLowonganPagination = async (req, res, next) => {
  const { page } = req.body;
  const listPage = 25;
  try {
    const p = page || 0;
    const data = [];
    const getData = await db
      .collection("lowongan_pekerjaan")
      .find()
      .sort({ position: 1 })
      .skip(p * listPage)
      .limit(listPage)
      .forEach(ke => data.push(ke));

    return res.status(200).json({
      data: data,
    });
  } catch (error) {
    return res.status(400).json({
      status: "Bad Request",
    });
  }
};

const applyLowongan = async (req, res, next) => {
  const { username } = req.user;
  const { nomer, alasan, cloud_media_url } = req.body;
  const resume = req.file;
  const id = req.params.id;
  console.log(cloud_media_url);

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

    if (findLowongan.Pelamar === undefined) {
      await db.collection("lowongan_pekerjaan").updateOne(
        { _id: ObjectId(id) },
        {
          $set: {
            Pelamar: [{ name: "dataPertama" }],
          },
        }
      );
    }

    // value untuk kirim data claudinary pelamar
    const value = [resume, username];

    // Query A untuk mencari apakah terdapat pelamar dalam lowongan yang ingin di aplly
    const a = await db
      .collection("lowongan_pekerjaan")
      .find({
        _id: ObjectId(id),
        "Pelamar.id_pelamar": ObjectId(findIdPelamar._id),
      })
      .toArray();

    if (a[0] === undefined) {
      const cekResumeNama = [];

      if (findIdPelamar.namaCV === undefined) {
        if (resume === undefined) {
          return res.status(400).json({
            status: "Bad Request",
            message: "Harus Menambahkan CV",
          });
        } else {
          claudinary.uploudcvPelamar(value);
          const { cloud_media_url_CVpelamar } = req.body;
          await db.collection("profilepelamar").updateOne(
            { _id: ObjectId(findIdPelamar._id) },
            {
              $set: {
                namaCV: cloud_media_url_CVpelamar,
              },
            }
          );
          cekResumeNama.push(cloud_media_url);
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
          cekResumeNama.push(findIdPelamar.namaCV);
          // }
        } else {
          if (cloud_media_url === findIdPelamar.namaCV) {
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
            cekResumeNama.push(findIdPelamar.namaCV);
            // }
          } else {
            // const paths = `./assets/cv/${username}/${resume.filename}`;
            // fs.unlink(paths, err => {
            //   if (err) console.log(err);
            //   else {
            //     console.log("\nDeleted file: example_file.txt");
            //   }
            // });
            claudinary.deleteCV(cloud_media_url);
          }
          cekResumeNama.push(findIdPelamar.namaCV);
        }
      }

      const name = findIdPelamar.name.first_name + findIdPelamar.name.last_name;

      if (findLowongan.Pelamar === undefined) {
        await db.collection("lowongan_pekerjaan").updateOne(
          { _id: ObjectId(findLowongan._id) },
          {
            $set: {
              updated_by: findIdPelamar.username,
              updated_at: new Date(
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
            $set: {
              Pelamar: [
                {
                  id: ObjectId(),
                  id_pelamar: findIdPelamar._id,
                  name: name,
                  nomer: nomer,
                  alasan: alasan,
                  namaResume: cekResumeNama[0],
                  profile: findIdPelamar.img,
                  score_utama: findIdPelamar.Score.score_utama,
                  created_by: findIdPelamar.username,
                  created_at: new Date(
                    Date.UTC(
                      moment().get("year"),
                      moment().get("month"),
                      moment().get("date"),
                      moment().get("hour"),
                      moment().get("minute"),
                      moment().get("second")
                    )
                  ),
                  updated_by: findIdPelamar.username,
                  updated_at: new Date(
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
              ],
            },
          }
        );
        if (findIdPelamar.apllyLowonganPerusahaan === undefined) {
          await db.collection("profilepelamar").updateOne(
            {
              _id: ObjectId(findIdPelamar._id),
            },
            {
              $set: {
                updated_by: findIdPelamar.username,
                updated_at: new Date(
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
              $set: {
                apllyLowonganPerusahaan: [
                  {
                    id_lowongan: findLowongan._id,
                    position: findLowongan.position,
                    namaPerusahaan: findLowongan.namaPerusahaan,
                    salary: findLowongan.salary,
                    status: "sudah melamar",
                    created_by: findIdPelamar.username,
                    created_at: new Date(
                      Date.UTC(
                        moment().get("year"),
                        moment().get("month"),
                        moment().get("date"),
                        moment().get("hour"),
                        moment().get("minute"),
                        moment().get("second")
                      )
                    ),
                    updated_by: findIdPelamar.username,
                    updated_at: new Date(
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
                ],
              },
            }
          );
        } else {
          await db.collection("profilepelamar").updateOne(
            {
              _id: ObjectId(findIdPelamar._id),
            },
            {
              $set: {
                updated_by: findIdPelamar.username,
                updated_at: new Date(
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
              $push: {
                apllyLowonganPerusahaan: {
                  $each: [
                    {
                      id_lowongan: findLowongan._id,
                      position: findLowongan.position,
                      namaPerusahaan: findLowongan.namaPerusahaan,
                      salary: findLowongan.salary,
                      status: "sudah melamar",
                      created_by: findIdPelamar.username,
                      created_at: new Date(
                        Date.UTC(
                          moment().get("year"),
                          moment().get("month"),
                          moment().get("date"),
                          moment().get("hour"),
                          moment().get("minute"),
                          moment().get("second")
                        )
                      ),
                      updated_by: findIdPelamar.username,
                      updated_at: new Date(
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
                  ],
                },
              },
            }
          );
        }

        return res.status(200).json({
          msg: `berhasil melamar di`,
        });
      } else {
        await db.collection("lowongan_pekerjaan").updateOne(
          { _id: ObjectId(findLowongan._id) },
          {
            $set: {
              updated_by: findIdPelamar.username,
              updated_at: new Date(
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
            $push: {
              Pelamar: {
                $each: [
                  {
                    id: ObjectId(),
                    id_pelamar: findIdPelamar._id,
                    name: name,
                    nomer: nomer,
                    alasan: alasan,
                    namaResume: cekResumeNama[0],
                    profile: findIdPelamar.img,
                    score_utama: findIdPelamar.Score.score_utama,
                    created_by: findIdPelamar.username,
                    created_at: new Date(
                      Date.UTC(
                        moment().get("year"),
                        moment().get("month"),
                        moment().get("date"),
                        moment().get("hour"),
                        moment().get("minute"),
                        moment().get("second")
                      )
                    ),
                    updated_by: findIdPelamar.username,
                    updated_at: new Date(
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
                ],
              },
            },
          }
        );
        if (findIdPelamar.apllyLowonganPerusahaan === undefined) {
          await db.collection("profilepelamar").updateOne(
            {
              _id: ObjectId(findIdPelamar._id),
            },
            {
              $set: {
                updated_by: findIdPelamar.username,
                updated_at: new Date(
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
              $set: {
                apllyLowonganPerusahaan: [
                  {
                    id_lowongan: findLowongan._id,
                    position: findLowongan.position,
                    namaPerusahaan: findLowongan.namaPerusahaan,
                    salary: findLowongan.salary,
                    status: "sudah melamar",
                    created_by: findIdPelamar.username,
                    created_at: new Date(
                      Date.UTC(
                        moment().get("year"),
                        moment().get("month"),
                        moment().get("date"),
                        moment().get("hour"),
                        moment().get("minute"),
                        moment().get("second")
                      )
                    ),
                    updated_by: findIdPelamar.username,
                    updated_at: new Date(
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
                ],
              },
            }
          );
        } else {
          await db.collection("profilepelamar").updateOne(
            {
              _id: ObjectId(findIdPelamar._id),
            },
            {
              $set: {
                updated_by: findIdPelamar.username,
                updated_at: new Date(
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
              $push: {
                apllyLowonganPerusahaan: {
                  $each: [
                    {
                      id_lowongan: findLowongan._id,
                      position: findLowongan.position,
                      namaPerusahaan: findLowongan.namaPerusahaan,
                      salary: findLowongan.salary,
                      status: "sudah melamar",
                      created_by: findIdPelamar.username,
                      created_at: new Date(
                        Date.UTC(
                          moment().get("year"),
                          moment().get("month"),
                          moment().get("date"),
                          moment().get("hour"),
                          moment().get("minute"),
                          moment().get("second")
                        )
                      ),
                      updated_by: findIdPelamar.username,
                      updated_at: new Date(
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
                  ],
                },
              },
            }
          );
        }
        return res.status(200).json({
          msg: `berhasil melamar dissss`,
        });
      }
    } else {
      if (resume !== undefined) {
        // const paths = `./assets/cv/${username}/${resume.filename}`;
        // fs.unlink(paths, err => {
        //   if (err) console.log(err);
        //   else {
        //     console.log("\nDeleted file: example_file.txt");
        //   }
        // });
        claudinary.deleteCV(cloud_media_url);
        return res.status(400).json({
          msg: "Anda Telah Aplly Di Lowongan iniss",
        });
      } else {
        return res.status(400).json({
          msg: "Anda Telah Aplly Di Lowongan inis",
        });
      }
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
        _id: ObjectId(idlowongan),
      });
    if (!findLowonganByidHr)
      return res.status(400).json({
        status: "Bad Request",
        message: "data lowongan pekerjaan tidak ditemukan",
      });

    if (findLowonganByidHr.id_hr.toString() === findIdhr._id.toString()) {
      if (findLowonganByidHr.Pelamar === undefined) {
        return res.status(400).json({
          data: "Data Pelamar Tidak Ditemukan",
        });
      } else {
        return res.status(200).json({
          data: findLowonganByidHr.Pelamar,
        });
      }
    } else {
      return res.status(400).json({
        data: "Data Hr dan Pelamar Tidak Ditemukan",
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
  console.log(position);
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

const sortLowongan = async (req, res, next) => {
  const { idLowongan } = req.body;
  const { id } = req.user;
  console.log(idLowongan);
  try {
    const findLowongan = await db
      .collection("lowongan_pekerjaan")
      .findOne({ _id: ObjectId(idLowongan) });
    if (!findLowongan) {
      return res.status(400).json({
        message: `Tidak Ditemukan Data Lowongan`,
      });
    }
    const findHr = await db
      .collection("profilehrs")
      .findOne({ _id: ObjectId(id) });
    if (!findHr) {
      return res.status(400).json({
        message: "data hr tidak ditemukan",
      });
    }
    const pelamar = await db
      .collection("lowongan_pekerjaan")
      .findOne({ _id: ObjectId(findLowongan._id) });

    if (pelamar.Pelamar[0].name === "dataPertama") {
      if (findLowongan.id_hr.toString() === findHr._id.toString()) {
        const a = pelamar.Pelamar.filter(
          person => person.name != "dataPertama"
        );
        const compareAge = (c, b) => {
          return b.score_utama - c.score_utama;
        };
        const f = a.sort(compareAge);
        return res.status(200).json({
          data: f,
        });
      } else {
        return res.status(400).json({
          msg: "NOT FOUND",
        });
      }
    } else {
      if (findLowongan.id_hr.toString() === findHr._id.toString()) {
        const compareAge = (c, b) => {
          return b.score_utama - c.score_utama;
        };
        const f = pelamar.Pelamar.sort(compareAge);
        return res.status(200).json({
          data: f,
        });
      } else {
        return res.status(400).json({
          msg: "NOT FOUND",
        });
      }
    }
  } catch (error) {
    return res.status(404).json({
      status: "Bad Request",
    });
  }
};

const getAllPelamarAllLowongan = async (req, res, next) => {
  const { id } = req.user;
  try {
    const findHr = await db.collection("profilehrs").findOne({
      _id: ObjectId(id),
    });
    if (!findHr) {
      return res.status(400).json({
        msg: "Data Hr Tidak Ditemukan",
      });
    }

    const findLowongan = await db
      .collection("lowongan_pekerjaan")
      .find({
        id_hr: ObjectId(findHr._id),
      })
      .toArray();
    const kon = [];
    findLowongan.map(e => {
      if (e.Pelamar === undefined) {
        console.log("a");
      } else {
        kon.push(e.Pelamar);
      }
    });

    return res.status(200).json({
      data: kon,
    });
  } catch (error) {
    return res.status(404).json({
      status: "Bad Request",
    });
  }
};

const Searchlowongan = async (req, res, next) => {
  const { query } = req.body;
  try {
    // Create Index Text
    // db.collection("lowongan_pekerjaan").createIndex({
    //   position: "text",
    //   namaPerusahaan: "text",
    // });

    const cursor = await db
      .collection("lowongan_pekerjaan")
      .find({ $text: { $search: `\"${query}\"` } })
      .toArray();

    return res.status(200).json({
      data: cursor,
    });
  } catch (error) {
    return res.status(404).json({
      status: "Bad Request",
    });
  }
};

const apllyLowonganV2 = async (req, res, next) => {
  const { username } = req.user;
  const id = req.params.id;
  const { nomer, alasan } = req.body;
  try {
    const findAccountPelamar = await db.collection("profilepelamar").findOne({
      username: username,
    });
    if (!findAccountPelamar)
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
        message: "data lowongan tidak ditemukan",
      });
    if (findAccountPelamar.DetailProfil.location === "") {
      return res.status(400).json({
        status: "Bad Request",
        message: "data lowongan tidak ditemukan",
      });
    }

    const name =
      findAccountPelamar.name.first_name + findAccountPelamar.name.last_name;

    if (findLowongan.Pelamar === undefined) {
      await db.collection("lowongan_pekerjaan").updateOne(
        { _id: ObjectId(findLowongan._id) },
        {
          $set: {
            updated_by: findAccountPelamar.username,
            updated_at: new Date(
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
          $set: {
            Pelamar: [
              {
                id: ObjectId(),
                id_pelamar: findAccountPelamar._id,
                name: name,
                nomer: nomer,
                alasan: alasan,
                profile: findIdPelamar.img,
                score_utama: findIdPelamar.Score.score_utama,
                created_by: findIdPelamar.username,
                created_at: new Date(
                  Date.UTC(
                    moment().get("year"),
                    moment().get("month"),
                    moment().get("date"),
                    moment().get("hour"),
                    moment().get("minute"),
                    moment().get("second")
                  )
                ),
                updated_by: findIdPelamar.username,
                updated_at: new Date(
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
            ],
          },
        }
      );
    } else {
    }
    return res.status(200).json({
      status: "Success",
      msg: findAccountPelamar,
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
  sortLowongan,
  getAllPelamarAllLowongan,
  getAllLowonganPagination,
  Searchlowongan,
  apllyLowonganV2,
};
