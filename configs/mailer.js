// mailer.js
const nodemailer = require('nodemailer');
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
function sendOtpEmail(email, otp){
    let transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: "prasadkrishna1189@gmail.com",
      to: email,
      subject: "Your Comsec360 2FA Code is Here!",
      html: `your 2FA is:${otp}`,
    };
    return transporter.sendMail(mailOptions);
  }
exports.sendOtpEmail = sendOtpEmail
