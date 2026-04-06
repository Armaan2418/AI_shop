import nodemailer from "nodemailer";
import "dotenv/config";

export const sendVerificationEmail = async (token, email) => {
  try {
    // Guard: fail fast if credentials not configured (avoids 30s timeout)
    if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
      throw new Error('Email credentials (MAIL_USER / MAIL_PASS) are not set in environment variables.');
    }

    const cleanPass = process.env.MAIL_PASS.replace(/\s+/g, ''); // strip spaces from app password

    // Port 465 + secure:true (direct SSL) is more reliable on cloud hosts than 587 STARTTLS
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

    /**
     * 2. UPDATED URL
     * Uses FRONTEND_URL from environment or falls back to production link
     */
    const baseUrl = process.env.FRONTEND_URL ? process.env.FRONTEND_URL.replace(/\/$/, '') : 'https://ai-shop-lac.vercel.app';
    const verificationLink = `${baseUrl}/verify-email?token=${token}`;

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