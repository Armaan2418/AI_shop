import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (token, email) => {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is not set in environment variables.');
  }

  const baseUrl = process.env.FRONTEND_URL
    ? process.env.FRONTEND_URL.replace(/\/$/, '')
    : 'https://ai-shop-lac.vercel.app';

  // After clicking verify, the page auto-redirects to /login
  const verificationLink = `${baseUrl}/verify-email?token=${token}`;
  const loginLink = `${baseUrl}/login`;

  const { error } = await resend.emails.send({
    from: 'E-kart Support <onboarding@resend.dev>',
    to: email,
    subject: '✅ Verify your E-kart account',
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #f8fafc; padding: 40px 20px;">
        <div style="max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header -->
          <div style="background: linear-gradient(135deg, #1e40af, #2563eb); padding: 32px 40px; text-align: center;">
            <h1 style="margin: 0; color: #ffffff; font-size: 26px; font-weight: 700; letter-spacing: -0.5px;">
              🛍️ AIShop
            </h1>
            <p style="margin: 8px 0 0; color: #bfdbfe; font-size: 14px;">Your AI-powered shopping companion</p>
          </div>

          <!-- Body -->
          <div style="padding: 40px;">
            <h2 style="margin: 0 0 12px; color: #0f172a; font-size: 22px; font-weight: 700;">
              Confirm your email address
            </h2>
            <p style="color: #475569; font-size: 15px; line-height: 1.6; margin: 0 0 28px;">
              You're almost there! Click the button below to verify your email.
              Once verified, you'll be taken straight to the <strong>sign‑in page</strong> so you can start shopping right away.
            </p>

            <!-- CTA Button -->
            <div style="text-align: center; margin-bottom: 28px;">
              <a href="${verificationLink}"
                 style="display: inline-block; background: linear-gradient(135deg, #1e40af, #2563eb); color: #ffffff;
                        padding: 14px 36px; border-radius: 10px; font-size: 16px; font-weight: 700;
                        text-decoration: none; letter-spacing: 0.3px; box-shadow: 0 4px 14px rgba(37,99,235,0.4);">
                Verify &amp; Sign In →
              </a>
            </div>

            <!-- Fallback link -->
            <p style="font-size: 13px; color: #94a3b8; text-align: center; margin: 0 0 8px;">
              Button not working? Copy and paste this link:
            </p>
            <p style="font-size: 12px; text-align: center; word-break: break-all; margin: 0 0 28px;">
              <a href="${verificationLink}" style="color: #2563eb;">${verificationLink}</a>
            </p>

            <!-- Divider -->
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 0 0 24px;" />

            <!-- Already have account -->
            <p style="font-size: 13px; color: #64748b; text-align: center; margin: 0;">
              Already verified?
              <a href="${loginLink}" style="color: #2563eb; font-weight: 600; text-decoration: none;">Sign in here →</a>
            </p>
          </div>

          <!-- Footer -->
          <div style="background: #f1f5f9; padding: 20px 40px; text-align: center;">
            <p style="font-size: 12px; color: #94a3b8; margin: 0;">
              This link expires in <strong>10 minutes</strong>. If you didn't create an account, you can safely ignore this email.
            </p>
          </div>

        </div>
      </div>
    `,
  });

  if (error) {
    console.error('❌ Resend error:', error);
    throw new Error('Email service is currently unavailable.');
  }

  console.log('✅ Verification email sent to:', email);
};