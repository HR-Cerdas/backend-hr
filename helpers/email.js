const nodemailer = require("nodemailer");
const { userEmail, pws } = process.env;

exports.kirimEmail = dataEmail => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: userEmail, // generated ethereal user
      pass: pws, // generated ethereal password
    },
  });
  return transporter
    .sendMail(dataEmail)
    .then(info => console.log(`Email Terkirim: ${info.message}`))
    .catch(err => console.log(`Terjadi Kesalahan: ${err}`));
};
