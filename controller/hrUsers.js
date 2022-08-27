const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient();

const Register = async (req, res) => {
  const {
    first_name,
    last_name,
    email,
    noHp,
    password,
    confPassword,
    username,
  } = req.body;

  try {
    const regis = await db.profilehrs.create({
      name: {
        first_name: first_name,
        last_name: last_name,
      },
      username: username,
      password: password,
      email: email,
      noHp: noHp,
    });

    res.status(201).json({ status: "Created", msg: "Register Berhasil" });
  } catch (error) {
    res.status(404).json({ msg: error });
  }
};
const nyoba = async (req, res) => {
  try {
    const getData = await db.profilehrs.findMany({});
    res.status(200).json({ msg: getData });
  } catch (error) {
    res.status(404).json({ msg: "Not Found" });
  }
};

module.exports = { Register, nyoba };
