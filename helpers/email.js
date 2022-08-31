const nodemailer = require("nodemailer");
const { userEmail, pws } = process.env;

exports.kirimEmail = dataEmail => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    requireTLS: true,
    auth: {
      user: userEmail, // generated ethereal user
      pass: pws, // generated ethereal password Password email generate [qdeznlspadpzbgnv]
    },
  });
  return transporter
    .sendMail(dataEmail)
    .then(info => console.log(`Email Terkirim: ${info.message}`))
    .catch(err => console.log(`Terjadi Kesalahan: ${err}`));
};
