const nodemailer = require('nodemailer');
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
function sendShareInvitationEmail(email, name, classOfShares, noOfShares, companyId,password) {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: 'testtdemoo11111@gmail.com',
            pass: 'wikvaxsgqyebphvh',
        },
    });

    const mailOptions = {
        from: EMAIL_USER,
        to: email,
        subject: "Invitation to Become a Shareholder in COMSEC360",
        html: `
            <h1>Shareholder Invitation</h1>
            <p>Dear ${name},</p>
            <p>You have been invited to become a shareholder with the following details:</p>
            <ul>
                <li>Class of Shares: ${classOfShares}</li>
                <li>Number of Shares: ${noOfShares}</li>
                <li>Company ID: ${companyId}</li>
                <p>Please first login to the website by the following Credentials:</p>
            <li>Class of Shares: ${email}</li>
            <li>Class of Shares: ${password}</li>
                </ul>
                <p style="text-align:center;">
                <a href="${process.env.FRONTEND_URL}/login" style="display: inline-block; background-color: black; color: white; 
                font-size: 14px; font-weight: bold; text-decoration: none; 
                padding: 12px 24px; border-radius: 6px;">Accept Invitation</a>
            </p>
                <p>After login Please accept this invitation by clicking the link below:</p>
            <p style="text-align:center;">
                <a href="${process.env.FRONTEND_URL}/project-form?fromShare=true&companyId=${companyId}" style="display: inline-block; background-color: black; color: white; 
                font-size: 14px; font-weight: bold; text-decoration: none; 
                padding: 12px 24px; border-radius: 6px;">Accept Invitation</a>
            </p>
            <p>We look forward to having you as a shareholder!</p>
            <p>Best Regards,<br>COMSEC360 Team</p>
        `,
    };

    return transporter.sendMail(mailOptions);
}

exports.sendShareInvitationEmail = sendShareInvitationEmail;
