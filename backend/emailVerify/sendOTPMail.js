import nodemailer from "nodemailer";
import "dotenv/config";

export const sendOTPMail = async (otp, email) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS ? process.env.MAIL_PASS.replace(/\s+/g, '') : '',
      },
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