require("dotenv").config();
const { MongoClient, ObjectId } = require("mongodb");
const client = new MongoClient(process.env.DATABASE_URL);
const db = client.db("hr_cerdas");
const path = require("path");
const fs = require("fs");
const moment = require("moment");

const addWorkExperience = async (req, res, next) => {
  // Req User
  const { username } = req.user;
  // Req Body
  const { jobPosition, company, startDate, endDate } = req.body;

  try {
    // Find Account Pelamar
    const findAccountPelamar = await db.collection("profilepelamar").findOne({
      username: username,
    });
    // Error Account Pelamar
    if (!findAccountPelamar)
      return res.status(400).json({
        status: "Bad Request",
        message: "data pelamar tidak ditemukan",
      });
    // Condition field end Date Tidak di isi
    const dateEnd = [];
    console.log(dateEnd);
    if (endDate === "present") {
      dateEnd.push("present");
    } else {
      dateEnd.push(new Date(endDate));
    }
    // Condition field experience kosong atau tidak
    if (findAccountPelamar.workExperience === undefined) {
      // True
      // Tambah Field experience By Account Pelamar
      await db.collection("profilepelamar").updateOne(
        { _id: findAccountPelamar._id },
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
            workExperience: [
              {
                id_Experience: ObjectId(),
                jobPosition: jobPosition,
                company: company,
                startDate: new Date(startDate),
                endDate: dateEnd[0],
                created_by: findAccountPelamar.username,
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
            ],
          },
        }
      );
    } else {
      // Field
      // Tambah Data experience By Account Pelamar
      await db.collection("profilepelamar").updateOne(
        { _id: findAccountPelamar._id },
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
          $push: {
            workExperience: {
              $each: [
                {
                  id_Experience: ObjectId(),
                  jobPosition: jobPosition,
                  company: company,
                  startDate: new Date(startDate),
                  endDate: dateEnd[0],
                  created_by: findAccountPelamar.username,
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
  addWorkExperience,
};
