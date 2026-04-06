import nodemailer from "nodemailer";
import "dotenv/config";

export const sendOTPMail = async (otp, email) => {
  try {
    // Guard: fail fast if credentials not configured (avoids 30s timeout)
    if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
      throw new Error('Email credentials (MAIL_USER / MAIL_PASS) are not set in environment variables.');
    }

    const cleanPass = process.env.MAIL_PASS.replace(/\s+/g, '');

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: cleanPass,
      },
      connectionTimeout: 30000,
      socketTimeout: 30000,
      greetingTimeout: 30000,
      tls: {
        rejectUnauthorized: false
      }
    });

    const mailConfigurations = {
      from: process.env.MAIL_USER,
      to: email,
      subject: "Password Reset OTP",
      html: `<p>Your OTP for password reset is: <b>${otp}</b></p>`
    };

    await transporter.sendMail(mailConfigurations);

    console.log("OTP sent successfully to:", email);
  } catch (error) {
    console.error("Email sending failed:", error);
    throw new Error("Email sending failed");
  }
};