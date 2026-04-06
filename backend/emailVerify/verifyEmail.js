import nodemailer from "nodemailer";
import "dotenv/config";

// 1. Create transporter once (more efficient)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS ? process.env.MAIL_PASS.replace(/\\s+/g, '') : '', // Sanitize spaces
  },
});

export const sendVerificationEmail = async (token, email) => {
  try {
    /**
     * 2. UPDATED URL
     * Port 5174: Matches your Vite current running port.
     * /verify/: Matches your Route path in App.jsx.
     */
    const verificationLink = `http://localhost:5173/verify-email?token=${token}`;

    const mailConfigurations = {
      from: `"E-kart Support" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "Verify Your E-kart Account",
      text: `Hi there,

Thank you for registering with E-kart! 

Please click the link below to verify your email address and activate your account. This link will expire in 10 minutes.

${verificationLink}

If you did not create an account, please ignore this email.

Best regards,
The E-kart Team`,
      // Optional: Adding HTML makes the link clickable in all mail clients
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2>Confirm your email</h2>
          <p>Click the button below to verify your account:</p>
          <a href="${verificationLink}" 
             style="background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
             Verify Email
          </a>
          <p style="margin-top: 20px; font-size: 12px; color: #666;">
            If the button doesn't work, copy and paste this link: <br/>
            ${verificationLink}
          </p>
        </div>
      `
    };

    await transporter.sendMail(mailConfigurations);
    console.log("✅ Verification email sent to:", email);
    
  } catch (error) {
    console.error("❌ Email sending failed:", error.message);
    // Rethrowing allows your userController's catch block to delete the failed user
    throw new Error("Email service is currently unavailable.");
  }
};