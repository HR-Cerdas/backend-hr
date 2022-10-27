// const moment = require("moment");

// console.log(moment().get("hour"));
// const utcDate = new Date(
//   Date.UTC(
//     moment().get("year"),
//     moment().get("month"),
//     moment().get("date"),
//     moment().get("hour"),
//     moment().get("minute"),
//     moment().get("second")
//   )
// );
// console.log(utcDate);
// console.log(Math.floor(Math.random() * 90 + 10));
const bcrypt = require("bcryptjs");
const myPlaintextPassword =
  "$2a$10$aZjF65Opa8nYVVfAXEJW3e/Pa2uJzUfhU3DL8j7MFjonGquLJhbSK";
const salt = myPlaintextPassword.split("$")[3].substr(0, 22);
console.log(salt);
