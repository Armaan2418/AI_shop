import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { verifyEmail } from '../store/authSlice';
import { authService } from '../services/authService';
import './Login.css';

export default function Verifyemail() {
  const dispatch        = useDispatch();
  const [params]        = useSearchParams();
  const token           = params.get('token');

  const [status,  setStatus]  = useState('idle');    // idle | loading | success | error
  const [message, setMessage] = useState('');
  const [resent,  setResent]  = useState(false);

  // Auto-verify when a token is present in the URL
  useEffect(() => {
    if (!token) return;
    const doVerify = async () => {
      setStatus('loading');
      try {
        await authService.verifyEmail(token);   // passes token as custom Bearer header
        dispatch(verifyEmail());                 // mark verified in Redux
        setStatus('success');
      } catch (err) {
        setMessage(err.message || 'Verification failed. The link may have expired.');
        setStatus('error');
      }
    };
    doVerify();
  }, [token, dispatch]);

  const handleResend = async () => {
    setResent(false);
    try {
      // We need the user's email — ask them to go back to login/register
      alert('Please log in and use the "Resend verification" option if available, or register again with your email.');
    } catch {
      /* silently fail */
    }
    setResent(true);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg, #0f172a)',
        padding: '24px',
      }}
    >
      <div
        style={{
          background: 'var(--card-bg, #1e293b)',
          border: '1px solid var(--border, #334155)',
          borderRadius: 20,
          padding: '48px 40px',
          maxWidth: 460,
          width: '100%',
          textAlign: 'center',
          boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
        }}
      >
        {/* ── No token in URL (user just registered) ── */}
        {!token && (
          <>
            <div style={{ fontSize: 56, marginBottom: 20 }}>📬</div>
            <h1 style={{ color: '#fff', fontSize: 24, fontWeight: 700, marginBottom: 12 }}>
              Check your inbox
            </h1>
            <p style={{ color: '#94a3b8', fontSize: 15, lineHeight: 1.6, marginBottom: 28 }}>
              We sent a verification link to your email address. Click it to activate
              your account. The link expires in <strong style={{ color: '#e2e8f0' }}>10 minutes</strong>.
            </p>
            <p style={{ color: '#64748b', fontSize: 13, marginBottom: 32 }}>
              Didn't receive it? Check your spam folder, or{' '}
              <button
                onClick={handleResend}
                style={{
                  background: 'none', border: 'none', color: '#60a5fa',
                  fontWeight: 600, cursor: 'pointer', fontSize: 13,
                }}
              >
                request a new link
              </button>.
              {resent && (
                <span style={{ color: '#4ade80', marginLeft: 8 }}>✓ Sent!</span>
              )}
            </p>
            <Link
              to="/login"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                color: '#fff', padding: '12px 28px', borderRadius: 10,
                fontWeight: 600, fontSize: 15, textDecoration: 'none',
              }}
            >
              Back to Sign In →
            </Link>
          </>
        )}

        {/* ── Verifying ── */}
        {token && status === 'loading' && (
          <>
            <div
              style={{
                width: 56, height: 56, borderRadius: '50%',
                border: '3px solid #334155', borderTopColor: '#3b82f6',
                animation: 'spin 0.8s linear infinite',
                margin: '0 auto 24px',
              }}
            />
            <h1 style={{ color: '#fff', fontSize: 22, fontWeight: 700, marginBottom: 10 }}>
              Verifying your email…
            </h1>
            <p style={{ color: '#64748b', fontSize: 14 }}>This just takes a second.</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </>
        )}

        {/* ── Success ── */}
        {token && status === 'success' && (
          <>
            <div
              style={{
                width: 72, height: 72, borderRadius: '50%',
                background: 'rgba(74, 222, 128, 0.15)',
                border: '2px solid #4ade80',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 24px', fontSize: 30,
              }}
            >
              ✅
            </div>
            <h1 style={{ color: '#fff', fontSize: 24, fontWeight: 700, marginBottom: 12 }}>
              Email Verified!
            </h1>
            <p style={{ color: '#94a3b8', fontSize: 15, lineHeight: 1.6, marginBottom: 32 }}>
              Your account is now active. You can sign in and start shopping.
            </p>
            <Link
              to="/login"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                color: '#fff', padding: '12px 28px', borderRadius: 10,
                fontWeight: 600, fontSize: 15, textDecoration: 'none',
              }}
            >
              Sign In →
            </Link>
          </>
        )}

        {/* ── Error ── */}
        {token && status === 'error' && (
          <>
            <div
              style={{
                width: 72, height: 72, borderRadius: '50%',
                background: 'rgba(248, 113, 113, 0.1)',
                border: '2px solid #f87171',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 24px', fontSize: 30,
              }}
            >
              ❌
            </div>
            <h1 style={{ color: '#fff', fontSize: 24, fontWeight: 700, marginBottom: 12 }}>
              Verification Failed
            </h1>
            <p style={{ color: '#94a3b8', fontSize: 15, lineHeight: 1.6, marginBottom: 32 }}>
              {message}
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link
                to="/register"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                  color: '#fff', padding: '12px 24px', borderRadius: 10,
                  fontWeight: 600, fontSize: 15, textDecoration: 'none',
                }}
              >
                Register Again
              </Link>
              <Link
                to="/login"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: 'transparent',
                  border: '1px solid #334155',
                  color: '#94a3b8', padding: '12px 24px', borderRadius: 10,
                  fontWeight: 600, fontSize: 15, textDecoration: 'none',
                }}
              >
                Sign In
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}