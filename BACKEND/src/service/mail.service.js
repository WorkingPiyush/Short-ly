import 'dotenv/config';
import nodemailer from "nodemailer";
import { BrevoClient } from '@getbrevo/brevo';
import logger from '../../config/logger.js';


let transporter;
// for development only
if (process.env.NODE_ENV !== "production") {
  transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}


export const sendEmail = async (to, subject, name, link) => {
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
  // for production only
  if (process.env.NODE_ENV === "production") {
    const client = new BrevoClient({
      apiKey: process.env.BREVO_API_KEY,
    })
    const message = {
      sender: { email: process.env.EMAIL_FROM },
      to: [{ email: to, name }],
      subject,
      htmlContent: html,
    }
    try {
      const response = await client.transactionalEmails.sendTransacEmail(message);
      logger.info("Email Sent:", response);
      logger.info(response.body);
    } catch (error) {
      logger.error("Error sending email via Brevo API:", error);
      throw error;
    }
  } else {
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

}


