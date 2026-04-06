import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (token, email) => {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is not set in environment variables.');
  }

  const baseUrl = process.env.FRONTEND_URL
    ? process.env.FRONTEND_URL.replace(/\/$/, '')
    : 'https://ai-shop-lac.vercel.app';
  const verificationLink = `${baseUrl}/verify-email?token=${token}`;

  const { error } = await resend.emails.send({
    from: 'E-kart Support <onboarding@resend.dev>',
    to: email,
    subject: 'Verify Your E-kart Account',
    html: `
      <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 500px;">
        <h2 style="color: #1e293b;">Confirm your email</h2>
        <p style="color: #475569;">Click the button below to verify your E-kart account:</p>
        <a href="${verificationLink}"
           style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">
          Verify Email
        </a>
        <p style="margin-top: 20px; font-size: 12px; color: #94a3b8;">
          If the button doesn't work, copy and paste this link:<br/>
          <a href="${verificationLink}" style="color: #2563eb;">${verificationLink}</a>
        </p>
        <p style="font-size: 12px; color: #94a3b8;">This link expires in 10 minutes.</p>
      </div>
    `,
  });

  if (error) {
    console.error('❌ Resend error:', error);
    throw new Error('Email service is currently unavailable.');
  }

  console.log('✅ Verification email sent to:', email);
};