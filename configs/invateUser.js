const nodemailer = require("nodemailer");
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
async function sendUserInvitationEmail(email, firstName, lastName, password) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS ,
    },
  });
  console.log(" process.env.EMAIL_USER i nodemail", process.env.EMAIL_USER, process.env.EMAIL_PASS)


  const loginUrl = `${process.env.FRONTEND_URL}/login`;

  const mailOptions = {
    from: EMAIL_PASS ,
    to: email,
    subject: "Welcome to COMSEC360 - Your Account Details",
    html: `
      <h1>Welcome to COMSEC360</h1>
      <p>Dear ${firstName} ${lastName},</p>
      <p>Your account has been created successfully. Below are your login details:</p>
      <ul>
        <li><strong>Full Name:</strong> ${firstName} ${lastName}</li>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Password:</strong> <span style="background-color: #f2f2f2; padding: 5px; border-radius: 3px;">${password}</span></li>
      </ul>
      <p>You can log in using the following link:</p>
     <p style="text-align: center;">
     <a href="${loginUrl}" 
     style="display: inline-block; background-color: black; color: white; 
            font-size: 14px; font-weight: bold; text-decoration: none; 
            padding: 12px 24px; border-radius: 6px;">
       Login Now
      </a>
    </p>
      <p>Best Regards,<br>COMSEC360 Team</p>
    `,
  };

  return transporter.sendMail(mailOptions);
}

module.exports = { sendUserInvitationEmail };
