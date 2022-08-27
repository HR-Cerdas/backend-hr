var express = require("express");
const { Register, nyoba } = require("../controller/hrUsers");
var router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post("/registerHr", Register);
router.get("/nyoba", nyoba);

module.exports = router;
