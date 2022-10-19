require("dotenv").config();
const { MongoClient, ObjectId, Db } = require("mongodb");
const client = new MongoClient(process.env.DATABASE_URL);
const db = client.db("hr_cerdas");

const ayo = async (req, res, next) => {
  try {
    const a = await db
      .collection("lowongan_pekerjaan")
      .find({
        _id: ObjectId("6348df5bf490384ba5100a85"),
        "Pelamar.id_pelamar": ObjectId("633594eba9a9101c9d8040a4asdasda"),
      })
      .toArray();
  } catch (error) {
    return res.status(404).json({
      // msg: "untuk cek sudah pernah melamar atau belom " + a,
      msg: "terserah",
    });
  }

  // const b = [];
  // for (let i = 0; i < a.length; i++) {
  //   if (a[i]) {
  //     console.log(a[i]);
  //     b.push(a[i].namaPerusahaan);
  //   }
  // }

  return res.status(200).json({
    // msg: "untuk cek sudah pernah melamar atau belom " + a,
    msg: "nana",

    // ms: "untuk get data pelamar melamar dimana saja " + b,
  });
};

module.exports = { ayo };
