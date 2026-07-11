import 'dotenv/config';
import { Resend } from 'resend';
import nodemailer from "nodemailer";
import logger from '../../config/logger.js';

// const resend = new Resend(process.env.RESEND_API_KEY);



// export async function sendEmail(email, subject, link) {
//     const html = `
// <div style="font-family:Arial;padding:40px;background:#f5f5f5">
//   <div style="max-width:600px;margin:auto;background:white;padding:30px;border-radius:8px">
//     <h2>Password Reset</h2>

//     <p>We received a request to reset your password.</p>

//     <p>
//       <a
//         href="${link}"
//         style="
//           background:#000;
//           color:white;
//           padding:12px 20px;
//           text-decoration:none;
//           border-radius:6px;
//         ">
//         Reset Password
//       </a>
//     </p>

//     <p>This link expires in 15 minutes.</p>

//     <p>If you didn't request this, you can ignore this email.</p>

//     <hr>

//     <p style="font-size:12px">${link}</p>
//   </div>
// </div>`;
//     const { data, error } = await resend.emails.send({
//         from: 'piyush@resend.dev',
//         to: email,
//         subject: subject,
//         html: html,
//     });

//     if (error) {
//         logger.error(error);
//         return;
//     }

//     if (data) {
//         logger.info(`${email}: Email Sent`);
//     }
// };


let transporter;
if (process.env.NODE_ENV !== "production") {
  transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}


export const sendEmail = async (to, subject, link) => {
  const html = `
<div style="font-family:Arial;padding:40px;background:#f5f5f5">
  <div style="max-width:600px;margin:auto;background:white;padding:30px;border-radius:8px">
    <h2>Password Reset</h2>

    <p>We received a request to reset your password.</p>

    <p>
      <a
        href="${link}"
        style="
          background:#000;
          color:white;
          padding:12px 20px;
          text-decoration:none;
          border-radius:6px;
        ">
        Reset Password
      </a>
    </p>

    <p>This link expires in 15 minutes.</p>

    <p>If you didn't request this, you can ignore this email.</p>

    <hr>

    <p style="font-size:12px">${link}</p>
  </div>
</div>`;

  try {
    transporter.sendMail({
      form: process.env.EMAIL_USER,
      to,
      subject,
      html,
    });
    logger.info(`${to}: Email Sent`);
  } catch (error) {
    logger.error("Error sending email", error);
    throw error;
  }
} 