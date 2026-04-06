import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOTPMail = async (otp, email) => {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is not set in environment variables.');
  }

  const { error } = await resend.emails.send({
    from: 'E-kart Support <onboarding@resend.dev>',
    to: email,
    subject: 'Your Password Reset OTP - E-kart',
    html: `
      <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 500px;">
        <h2 style="color: #1e293b;">Password Reset OTP</h2>
        <p style="color: #475569;">Use the OTP below to reset your E-kart password. It expires in 10 minutes.</p>
        <div style="font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #2563eb; padding: 20px; background: #eff6ff; border-radius: 8px; text-align: center; margin: 20px 0;">
          ${otp}
        </div>
        <p style="font-size: 12px; color: #94a3b8;">If you did not request a password reset, ignore this email.</p>
      </div>
    `,
  });

  if (error) {
    console.error('❌ Resend OTP error:', error);
    throw new Error('Email sending failed');
  }

  console.log('✅ OTP email sent to:', email);
};