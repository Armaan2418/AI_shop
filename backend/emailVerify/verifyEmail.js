import nodemailer from "nodemailer";
import dns from "dns";
import { promisify } from "util";

const resolve4 = promisify(dns.resolve4);

export const sendVerificationEmail = async (token, email) => {
  // Guard: fast-fail if credentials missing
  if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
    console.error("❌ MAIL_USER or MAIL_PASS not set in environment.");
    throw new Error("Email credentials not configured.");
  }

  const user = process.env.MAIL_USER.trim();
  const pass = process.env.MAIL_PASS.replace(/\s+/g, ""); // strip spaces from app password

  console.log(`📧 Sending verification email to: ${email}`);
  console.log(`📧 MAIL_USER: ${user} | MAIL_PASS length: ${pass.length}`);

  // Resolve smtp.gmail.com to IPv4 explicitly — Railway's DNS resolves to IPv6 (unreachable)
  let gmailHost = "smtp.gmail.com";
  try {
    const [ipv4] = await resolve4("smtp.gmail.com");
    gmailHost = ipv4;
    console.log(`📧 Resolved smtp.gmail.com → ${gmailHost} (IPv4)`);
  } catch (dnsErr) {
    console.warn("⚠️ DNS resolve4 failed, falling back to hostname:", dnsErr.message);
  }

  const transporter = nodemailer.createTransport({
    host: gmailHost,
    port: 465,
    secure: true,
    auth: { user, pass },
    connectionTimeout: 20000,
    socketTimeout: 20000,
    greetingTimeout: 15000,
    tls: {
      rejectUnauthorized: false,
      servername: "smtp.gmail.com", // SNI: must match cert even if host is an IP
    },
  });

  // Verify auth before sending — gives exact SMTP error in logs
  try {
    await transporter.verify();
    console.log("✅ SMTP connection verified OK.");
  } catch (verifyErr) {
    console.error("❌ SMTP verify failed:", verifyErr.message, "| code:", verifyErr.code);
    throw new Error("Email service is currently unavailable.");
  }

  const baseUrl = process.env.FRONTEND_URL
    ? process.env.FRONTEND_URL.replace(/\/$/, "")
    : "https://ai-shop-lac.vercel.app";
  const verificationLink = `${baseUrl}/verify-email?token=${token}`;
  const loginLink = `${baseUrl}/login`;

  await transporter.sendMail({
    from: `"E-kart Support" <${user}>`,
    to: email,
    subject: "✅ Verify your E-kart account",
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #f8fafc; padding: 40px 20px;">
        <div style="max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">

          <div style="background: linear-gradient(135deg, #1e40af, #2563eb); padding: 32px 40px; text-align: center;">
            <h1 style="margin: 0; color: #ffffff; font-size: 26px; font-weight: 700;">🛍️ AIShop</h1>
            <p style="margin: 8px 0 0; color: #bfdbfe; font-size: 14px;">Your AI-powered shopping companion</p>
          </div>

          <div style="padding: 40px;">
            <h2 style="margin: 0 0 12px; color: #0f172a; font-size: 22px; font-weight: 700;">Confirm your email address</h2>
            <p style="color: #475569; font-size: 15px; line-height: 1.6; margin: 0 0 28px;">
              You're almost there! Click the button below to verify your email.
              Once verified, you'll be taken straight to the <strong>sign‑in page</strong>.
            </p>

            <div style="text-align: center; margin-bottom: 28px;">
              <a href="${verificationLink}"
                 style="display: inline-block; background: linear-gradient(135deg, #1e40af, #2563eb); color: #ffffff;
                        padding: 14px 36px; border-radius: 10px; font-size: 16px; font-weight: 700;
                        text-decoration: none; box-shadow: 0 4px 14px rgba(37,99,235,0.4);">
                Verify &amp; Sign In →
              </a>
            </div>

            <p style="font-size: 13px; color: #94a3b8; text-align: center; margin: 0 0 8px;">
              Button not working? Copy and paste this link:
            </p>
            <p style="font-size: 12px; text-align: center; word-break: break-all; margin: 0 0 28px;">
              <a href="${verificationLink}" style="color: #2563eb;">${verificationLink}</a>
            </p>

            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 0 0 24px;" />
            <p style="font-size: 13px; color: #64748b; text-align: center; margin: 0;">
              Already verified?
              <a href="${loginLink}" style="color: #2563eb; font-weight: 600; text-decoration: none;">Sign in here →</a>
            </p>
          </div>

          <div style="background: #f1f5f9; padding: 20px 40px; text-align: center;">
            <p style="font-size: 12px; color: #94a3b8; margin: 0;">
              This link expires in <strong>10 minutes</strong>. If you didn't create an account, ignore this email.
            </p>
          </div>

        </div>
      </div>
    `,
  });

  console.log("✅ Verification email sent successfully to:", email);
};