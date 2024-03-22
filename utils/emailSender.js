const nodemailer = require("nodemailer");
const sendEmail = async (email, emailRec, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      // host: process.env.EMAILHOST,
      // port: 465,
      // secure: true,
      service: "gmail",
      // host: 'mail.housepointegypt.com',
      auth: {
        user: process.env.EMAILUSER,
        pass: process.env.EMAILPASS,
      },
      // tls: {
      //   rejectUnauthorized: false

      // }
    });

    await transporter.sendMail({
      from: emailRec,
      to: process.env.EMAILUSER,
      subject: subject,
      html: html,
    });
    console.log("Email sent sucessfully");
  } catch (error) {
    console.log("Email not sent");
    console.log(error);
  }
};

module.exports = sendEmail;
