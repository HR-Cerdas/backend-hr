var express = require("express");
const { nyoba } = require("../controller/hrUsers");
var router = express.Router();

// router.post("/registerHr", register);
router.get("/nyoba", nyoba);
// router.post("/loginHr", login);

module.exports = router;
