require("dotenv").config();
const { MongoClient, ObjectId } = require("mongodb");
const client = new MongoClient(process.env.DATABASE_URL);
const db = client.db("hr_cerdas");
const path = require("path");
const fs = require("fs");
const moment = require("moment");

// Update Organization
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

    const idd = ObjectId();

    await db.collection("organization_pelamar").insertOne({
      _id: idd,
      organizationName: organizationName,
      Role: Role,
      startDate: moment.utc(startDate),
      endDate: moment.utc(endDate),
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
    });

    if (findAccountPelamar.addorganization === undefined) {
      const updateExperience = await db.collection("profilepelamar").updateOne(
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
            addorganization: [
              {
                id_Organization: idd,
              },
            ],
          },
        }
      );
    } else {
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
            addorganization: {
              $each: [
                {
                  id_Organization: idd,
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
  addOrganization,
};
