import axios from "axios";

export const sendOTPMail = async (otp, email) => {
  if (!process.env.BREVO_API_KEY) {
    console.error("❌ BREVO_API_KEY not set in environment.");
    throw new Error("Email credentials not configured.");
  }

  const senderEmail = process.env.BREVO_SENDER || "noreply@aishop.com";

  console.log(`📧 Sending OTP email to: ${email}`);

  const { data } = await axios.post(
    "https://api.brevo.com/v3/smtp/email",
    {
      sender: { name: "AIShop", email: senderEmail },
      to: [{ email }],
      subject: "Your Password Reset OTP - AIShop",
      htmlContent: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #f8fafc; padding: 40px 20px;">
          <div style="max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
            <div style="background: linear-gradient(135deg, #1e40af, #2563eb); padding: 32px 40px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 26px; font-weight: 700;">🛍️ AIShop</h1>
            </div>
            <div style="padding: 40px;">
              <h2 style="margin: 0 0 12px; color: #0f172a; font-size: 22px; font-weight: 700;">Password Reset OTP</h2>
              <p style="color: #475569; font-size: 15px; line-height: 1.6; margin: 0 0 20px;">
                Use the OTP below to reset your password. It expires in 10 minutes.
              </p>
              <div style="font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #2563eb; padding: 20px; background: #eff6ff; border-radius: 8px; text-align: center; margin-bottom: 20px;">
                ${otp}
              </div>
              <p style="font-size: 12px; color: #94a3b8; text-align: center;">If you didn't request this, ignore this email.</p>
            </div>
          </div>
        </div>
      `,
    },
    {
      headers: {
        "api-key": process.env.BREVO_API_KEY,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }
  );

  console.log("✅ OTP email sent to:", email, "| messageId:", data?.messageId);
};