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

    res.json({ status: "Created", msg: regis });
  } catch (error) {
    res.status(404).json({ msg: error });
  }
};
const Login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const findUsername = await db.profilehrs.findFirst({
      where: {
        email: email,
      },
    });
    if (!findUsername)
      throw { message: "email is incorrect", status: "Bad Request", code: 400 };

    if (findUsername.password === password) {
      return res.status(200).json({
        msg: "yes",
      });
    }
    return res.status(400).json({
      status: "Bad Request",
      message: "password is incorrect",
    });
  } catch (error) {
    next(error);
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

module.exports = { Register, nyoba, Login };
