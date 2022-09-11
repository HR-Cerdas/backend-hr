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
      data: getData,
    });
  } catch (error) {
    return res.status(400).json({
      status: "Bad Request",
    });
  }
};

const showDistricts = async (req, res, next) => {
  const { id } = req.body;
  var oID = new Objectid(id);

  try {
    const getData = await db
      .collection("postal_codes")
      .find({ _id: oID })
      .project({ _id: 1, districts: { district: 1 } })
      .toArray();

    return res.status(200).json({
      data: getData[0],
    });
  } catch (error) {
    next(error);
  }
};

const showSubDistricts = async (req, res, next) => {
  const { id, districtName } = req.body;
  var oID = new Objectid(id);

  try {
    // const getData = await db
    //   .collection("postal_codes")
    //   .aggregate([
    //     {
    //       $match: {
    //         _id: oID,
    //       },
    //     },
    //     {
    //       $project: {
    //         district: {
    //           $filter: {
    //             input: "$districts",
    //             as: "district",
    //             cond: {
    //               $eq: ["$$district.district", districtName],
    //             },
    //           },
    //         },
    //       },
    //     },
    //     {
    //       $project: {
    //         district: {
    //           district: 1,
    //           sub_districts: {
    //             sub_district: 1,
    //           },
    //         },
    //       },
    //     },
    //   ])
    //   .toArray();
    const getData = await db
      .collection("postal_codes")
      .find({ _id: oID })
      .project({
        _id: 1,
        districts: { district: 1, sub_districts: { sub_district: 1 } },
      })
      .toArray();

    let district = getData[0].districts.find(
      (element) => element.district === districtName
    );

    getData[0].districts = district;
    return res.status(200).json({
      data: getData[0],
    });
  } catch (error) {
    next(error);
  }
};

const showPostalCodes = async (req, res, next) => {
  const { id, districtName, subDistrictName } = req.body;
  var oID = new Objectid(id);

  try {
    const getData = await db
      .collection("postal_codes")
      .find({ _id: oID })
      .project({
        _id: 1,
        districts: {
          district: 1,
          sub_districts: { sub_district: 1, postal_codes: 1 },
        },
      })
      .toArray();

    let district = getData[0].districts.find(
      (element) => element.district === districtName
    );
    let subDistrict = district.sub_districts.find(
      (element) => element.sub_district === subDistrictName
    );

    district.sub_districts = subDistrict;
    getData[0].districts = district;
    return res.status(200).json({
      data: getData[0],
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  showProvince,
  showDistricts,
  showSubDistricts,
  showPostalCodes,
};
