require("dotenv").config();
const { MongoClient } = require("mongodb");
const client = new MongoClient(process.env.DATABASE_URL);
const db = client.db("hr_cerdas");

// const register = async (req, res) => {
//   const {
//     first_name,
//     last_name,
//     email,
//     noHp,
//     password,
//     confPassword,
//     username,
//   } = req.body;

//   try {
//     const regis = await db.profilehrs.create({
//       data: {
//         name: {
//           first_name: first_name,
//           last_name: last_name,
//         },
//         username: username,
//         password: password,
//         email: email,
//         noHp: noHp,
//       },
//     });

//     res.json({ status: "Created", msg: regis });
//   } catch (e) {
//     res.status(404).json({ msg: e });
//   }
// };
// const login = async (req, res, next) => {
//   const { email, password } = req.body;
//   try {
//     const findUsername = await db.profilehrs.findFirst({
//       where: {
//         email: email,
//       },
//     });
//     if (!findUsername)
//       throw { message: "email is incorrect", status: "Bad Request", code: 400 };

//     if (findUsername.password === password) {
//       return res.status(200).json({
//         msg: "yes",
//       });
//     }
//     return res.status(400).json({
//       status: "Bad Request",
//       message: "password is incorrect",
//     });
//   } catch (error) {
//     next(error);
//   }
// };
const nyoba = async (req, res) => {
  try {
    const getData = await db.collection("profilehrs").find().toArray();

    res.status(200).json({ msg: getData });
  } catch (error) {
    res.status(404).json({ msg: "Not Found" });
  }
};

module.exports = { nyoba };
