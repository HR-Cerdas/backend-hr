const moment = require("moment");

console.log(moment().get("hour"));
const utcDate = new Date(
  Date.UTC(
    moment().get("year"),
    moment().get("month"),
    moment().get("date"),
    moment().get("hour"),
    moment().get("minute"),
    moment().get("second")
  )
);
console.log(utcDate);
