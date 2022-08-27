var express = require("express");
const { Register, nyoba, Login } = require("../controller/hrUsers");
var router = express.Router();

router.post("/registerHr", Register);
router.get("/nyoba", nyoba);
router.post("/loginHr", Login);

module.exports = router;
