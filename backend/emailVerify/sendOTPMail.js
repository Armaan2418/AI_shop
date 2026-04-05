import nodemailer from "nodemailer";
import "dotenv/config";

export const sendOTPMail = async (token, email) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const verificationLink = `http://localhost:5173/verify/${token}`;

    const mailConfigurations = {
      from: process.env.MAIL_USER,
      to: email,
      subject: "Password Reset OTP",
      html:`<p> Your OTP for password reset is:<b>${OTP}</b></p>`
    };

    await transporter.sendMail(mailConfigurations);

    console.log("OTP sent successfully to:", email);
  } catch (error) {
    console.error("Email sending failed:", error);
    throw new Error("Email sending failed");
  }
};