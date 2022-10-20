require("dotenv").config();
const { MongoClient, ObjectId, Db } = require("mongodb");
const client = new MongoClient(process.env.DATABASE_URL);
const dbb = client.db("hr_cerdas");

const db = client.db("aggregation");
const coll = db.collection("lowongan_pekerjaan");

const ayoo = async (req, res, next) => {
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
  try {
    return res.status(200).json({
      // msg: "untuk cek sudah pernah melamar atau belom " + a,
      msg: "nana",

      // ms: "untuk get data pelamar melamar dimana saja " + b,
    });
  } catch (error) {
    return res.status(404).json({
      // msg: "untuk cek sudah pernah melamar atau belom " + a,
      msg: "nana",

      // ms: "untuk get data pelamar melamar dimana saja " + b,
    });
  }
};
//   const a = await db
//     .collection("lowongan_pekerjaan")
//     .find({
//       _id: ObjectId("6348df5bf490384ba5100a85"),
//       "Pelamar.id_pelamar": ObjectId("633594eba9a9101c9d8040a4asdasda"),
//     })
//     .toArray();
// } catch (error) {
//   return res.status(404).json({
//     // msg: "untuk cek sudah pernah melamar atau belom " + a,
//     msg: "terserah",
//   });
// }

// const b = [];
// for (let i = 0; i < a.length; i++) {
//   if (a[i]) {
//     console.log(a[i]);
//     b.push(a[i].namaPerusahaan);
//   }
// }

const ayo = async (req, res, next) => {
  const { position } = req.body;
  const { id } = req.user;
  console.log(position);
  try {
    const findLowongan = await dbb
      .collection("lowongan_pekerjaan")
      .findOne({ position: position });
    if (!findLowongan) {
      return res.status(400).json({
        message: `Tidak Ditemukan Data Lowongan`,
      });
    }
    const findHr = await dbb
      .collection("profilehrs")
      .findOne({ _id: ObjectId(id) });
    if (!findHr) {
      return res.status(400).json({
        message: "data hr tidak ditemukan",
      });
    }
    const a = await db.coll.aggregate(
      // Initial document match (uses index, if a suitable one is available)
      {
        $match: {
          _id: ObjectId("6348df5bf490384ba5100a85"),
        },
      },

      // Expand the scores array into a stream of documents
      { $unwind: "$Pelamar" },

      // Filter to 'homework' scores
      // {
      //   $match: {
      //     "Pelamar.nae": "Akhmad NurHidayat",
      //   },
      // },

      // Sort in descending order
      {
        $sort: {
          "Pelamar.score_utama": 1,
        },
      }
    );
    console.log(a);

    return res.status(200).json({
      data: a,
    });
  } catch (error) {
    return res.status(404).json({
      status: "Bad Request",
    });
  }
};

module.exports = { ayo };
