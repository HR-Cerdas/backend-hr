require("dotenv").config();
const { MongoClient } = require("mongodb");
const Objectid = require("mongodb").ObjectId;
const client = new MongoClient(process.env.DATABASE_URL);
const db = client.db("hr_cerdas");

const showProvince = async (req, res, next) => {
  try {
    const getData = await db
      .collection("postal_codes")
      .find()
      .project({ _id: 1, province: 1 })
      .toArray();

    return res.status(200).json({
      msg: getData,
    });
  } catch (error) {
    return res.status(400).json({
      status: "Bad Request",
    });
  }
};

const showDistricts = async (req, res, next) => {
  const { id } = req.params;
  var o_id = new Objectid(id);

  try {
    const findProvince = await db
      .collection("postal_codes")
      .findOne({ _id: o_id });

    const getData = await db
      .collection("postal_codes")
      .find({ _id: findProvince._id })
      .project({ _id: 1, districts: { district: 1 } })
      .toArray();

    return res.status(200).json({
      msg: getData,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { showProvince, showDistricts };
