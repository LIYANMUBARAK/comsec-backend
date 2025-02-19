const nodemailer = require('nodemailer');
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
function sendDirectorInvitationEmail(email, name, classOfShares, noOfShares, companyId) {
    const transporter = nodemailer.createTransport({
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
        from: EMAIL_PASS,
        to: email,
        subject: "Invitation to Become a Director in COMSEC360",
        html: `
            <h1>Director Invitation</h1>
            <p>Dear ${name},</p>
            <p>You have been invited to join COMSEC360 with the following details:</p>
            <ul>
                <li>Class of Shares: ${classOfShares}</li>
                <li>Number of Shares: ${noOfShares}</li>
                <li>Company ID: ${companyId}</li> <!-- Include companyId in the email -->
            </ul>
            <p>Please accept this invitation by clicking the link below:</p>
            <p style="text-align:center;">
                <a href="${process.env.FRONTEND_URL}/project-form?fromEmail=true&companyId=${companyId}" style="display: inline-block; background-color: black; color: white; 
                font-size: 14px; font-weight: bold; text-decoration: none; 
                padding: 12px 24px; border-radius: 6px;">Accept Invitation</a>
            </p>
            <p>Best Regards,<br>COMSEC360 Team</p>
        `,
    };

    return transporter.sendMail(mailOptions);
}

exports.sendDirectorInvitationEmail = sendDirectorInvitationEmail;
