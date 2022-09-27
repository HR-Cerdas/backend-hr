var fs = require("fs");
try {
  var files = fs.readdirSync("./assets/DetailPerusahaan/rajih");
} catch (error) {
  console.log("kontol");
}
