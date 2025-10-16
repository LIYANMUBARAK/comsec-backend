// const nodemailer = require("nodemailer");
// const EMAIL_USER = process.env.EMAIL_USER;
// const EMAIL_PASS = process.env.EMAIL_PASS;
// async function sendUserInvitationEmail(email, firstName, lastName, password) {
//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     host: "smtp.gmail.com",
//     port: 465,
//     secure: true,
//     auth: {
//       user: EMAIL_USER,
//       pass: EMAIL_PASS ,
//     },
//   });
//   console.log(" process.env.EMAIL_USER i nodemail", process.env.EMAIL_USER, process.env.EMAIL_PASS)


//   const loginUrl = `${process.env.FRONTEND_URL}/login`;

//   const mailOptions = {
//     from: EMAIL_PASS ,
//     to: email,
//     subject: "Welcome to COMSEC360 - Your Account Details",
//     html: `
//       <h1>Welcome to COMSEC360</h1>
//       <p>Dear ${firstName} ${lastName},</p>
//       <p>Your account has been created successfully. Below are your login details:</p>
//       <ul>
//         <li><strong>Full Name:</strong> ${firstName} ${lastName}</li>
//         <li><strong>Email:</strong> ${email}</li>
//         <li><strong>Password:</strong> <span style="background-color: #f2f2f2; padding: 5px; border-radius: 3px;">${password}</span></li>
//       </ul>
//       <p>You can log in using the following link:</p>
//      <p style="text-align: center;">
//      <a href="${loginUrl}" 
//      style="display: inline-block; background-color: black; color: white; 
//             font-size: 14px; font-weight: bold; text-decoration: none; 
//             padding: 12px 24px; border-radius: 6px;">
//        Login Now
//       </a>
//     </p>
//       <p>Best Regards,<br>COMSEC360 Team</p>
//     `,
//   };

//   return transporter.sendMail(mailOptions);
// }

// module.exports = { sendUserInvitationEmail };

const dotenv = require("dotenv");
dotenv.config();

const EmailTemplate = require('../models/email_templates');
const nodemailer = require("nodemailer");
const handlebars = require("handlebars");

async function sendUserInvitationEmail(email, firstName, lastName, password) {
  // Step 1: Get the template from DB
  const template = await EmailTemplate.findOne({ name: 'user_invitation' });
  if (!template) throw new Error('Email template not found');

  // Step 2: Compile the HTML using Handlebars
  const loginUrl = `${process.env.FRONTEND_URL}/login`;

  const compiledTemplate = handlebars.compile(template.html);
  const html = compiledTemplate({
    firstName,
    lastName,
    email,
    password,
    loginUrl,
  });

  // Step 3: Setup transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Step 4: Send mail
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: template.subject || "Welcome to COMSEC360 – Your Account Details",
    html,
  };

  return transporter.sendMail(mailOptions);
}

module.exports = { sendUserInvitationEmail };
