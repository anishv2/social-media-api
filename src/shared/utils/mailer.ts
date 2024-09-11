import nodemailer from "nodemailer";
import AppConfig from "../../config/env.config.js";

function generateEmailTemplate(otp: string) {
  return `
    <!DOCTYPE html>
       <html lang="en">
       <head>
       <meta charset="utf-8">
       <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>2Post OTP page</title>
        <style>
          *{
          font-family: "Arial";
          }
            h2 {
            background-color:#3f51b5;
            color:#fff;
            padding: 0.5rem;
            }
        </style>
        </head>

        <body>
        <h2>2Post</h2>
        <p>Recover your account<p>
         <p>Your OTP is <strong style="font-size:1.1rem">${otp}</strong><p>
         <p>Use this OTP to reset your password. This OTP is valid for only 10 minutes.</p>
        </body>
    </html>
    `;
}

export async function sendMail(recipientEmail: string, otp: string) {
  const transporter = await nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: AppConfig.mail.senderMail,
      pass: AppConfig.mail.password,
    },
  });

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: `${AppConfig.mail.senderName} <${AppConfig.mail.senderMail}>`,
    to: recipientEmail,
    subject: `2Post Recover account OTP`,
    text: `Hello User, your secret code ${otp}`,
    html: generateEmailTemplate(otp),
  });

  console.log("Message sent: %s", info.messageId);
}
