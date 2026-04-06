import { useEffect, useState, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { verifyEmail } from '../store/authSlice';
import { authService } from '../services/authService';
import './Login.css';

export default function Verifyemail() {
  const dispatch        = useDispatch();
  const [params]        = useSearchParams();
  const token           = params.get('token');

  const [status,      setStatus]      = useState('idle');   // idle | loading | success | error
  const [message,     setMessage]     = useState('');
  const [resendState, setResendState] = useState('idle');   // idle | sending | sent | error
  const [resendMsg,   setResendMsg]   = useState('');
  const [countdown,   setCountdown]   = useState(0);        // cooldown seconds

  // Email stored by Register.jsx after a successful registration call
  const pendingEmail = sessionStorage.getItem('pendingVerifyEmail') || '';

  // Auto-verify when a token is present in the URL
  useEffect(() => {
    if (!token) return;
    const doVerify = async () => {
      setStatus('loading');
      try {
        await authService.verifyEmail(token);   // sends Bearer token header to backend
        dispatch(verifyEmail());                 // mark verified in Redux
        sessionStorage.removeItem('pendingVerifyEmail'); // clean up stored email
        setStatus('success');
      } catch (err) {
        setMessage(err.message || 'Verification failed. The link may have expired.');
        setStatus('error');
      }
    };
    doVerify();
  }, [token, dispatch]);

  // Countdown timer for resend cooldown
  useEffect(() => {
    if (countdown <= 0) return;
    const id = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(id);
  }, [countdown]);

  const handleResend = useCallback(async () => {
    if (!pendingEmail) {
      setResendState('error');
      setResendMsg('Could not determine your email. Please register again.');
      return;
    }
    if (countdown > 0) return; // still cooling down

    setResendState('sending');
    setResendMsg('');
    try {
      await authService.resendVerification(pendingEmail);
      setResendState('sent');
      setResendMsg(`New link sent to ${pendingEmail}`);
      setCountdown(60); // 60-second cooldown to prevent spam
    } catch (err) {
      setResendState('error');
      setResendMsg(err.message || 'Failed to resend. Please try again.');
    }
  }, [pendingEmail, countdown]);

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
            <p style={{ color: '#94a3b8', fontSize: 15, lineHeight: 1.6, marginBottom: 8 }}>
              We sent a verification link to{' '}
              {pendingEmail
                ? <strong style={{ color: '#e2e8f0' }}>{pendingEmail}</strong>
                : 'your email address'
              }. Click it to activate your account.
            </p>
            <p style={{ color: '#64748b', fontSize: 13, marginBottom: 28 }}>
              The link expires in <strong style={{ color: '#e2e8f0' }}>10 minutes</strong>.
              Check your spam folder if you don&apos;t see it.
            </p>

            {/* Resend button */}
            <div style={{ marginBottom: 28 }}>
              <button
                onClick={handleResend}
                disabled={resendState === 'sending' || countdown > 0}
                style={{
                  background: resendState === 'sent' ? 'rgba(74,222,128,0.1)' : 'rgba(96,165,250,0.1)',
                  border: `1px solid ${resendState === 'sent' ? '#4ade80' : '#60a5fa'}`,
                  color: resendState === 'sent' ? '#4ade80' : '#60a5fa',
                  fontWeight: 600,
                  cursor: countdown > 0 || resendState === 'sending' ? 'not-allowed' : 'pointer',
                  fontSize: 14,
                  padding: '10px 24px',
                  borderRadius: 10,
                  opacity: countdown > 0 || resendState === 'sending' ? 0.6 : 1,
                  transition: 'all 0.2s',
                  width: '100%',
                }}
              >
                {resendState === 'sending'
                  ? '⏳ Sending…'
                  : countdown > 0
                    ? `Resend in ${countdown}s`
                    : resendState === 'sent'
                      ? '✓ Resent!'
                      : 'Resend verification email'
                }
              </button>
              {resendMsg && (
                <p style={{
                  marginTop: 8, fontSize: 13,
                  color: resendState === 'error' ? '#f87171' : '#4ade80',
                }}>
                  {resendMsg}
                </p>
              )}
            </div>

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