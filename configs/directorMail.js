const nodemailer = require('nodemailer');
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
function sendDirectorInvitationEmail(email, name, classOfShares, noOfShares,password, companyId,inviteUrl) {
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
            <p><strong>Login Credentials:</strong></p>
            <ul>
                <li>Email: ${email}</li>
                <li>Password: ${password}</li>
            </ul>
            <p>Accept it By, clicking the button below to access your director forms:</p>
            <p style="text-align:center;">
                <a href="${inviteUrl}" style="display: inline-block; background-color: black; color: white; 
                font-size: 14px; font-weight: bold; text-decoration: none; 
                padding: 12px 24px; border-radius: 6px;">Go to Forms</a>
            </p>
            <p>Best Regards,<br>COMSEC360 Team</p>
        `,
    };

    return transporter.sendMail(mailOptions);
}

exports.sendDirectorInvitationEmail = sendDirectorInvitationEmail;
