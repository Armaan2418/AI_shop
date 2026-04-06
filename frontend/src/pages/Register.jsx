import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginSuccess, loginFailure, clearError, selectIsAuth } from '../store/authSlice';
import { authService } from '../services/authService';
import './Login.css';

// ── Password helpers ──────────────────────────────────────────────────
const checkPassword = (pw) => ({
  length:    pw.length >= 8,
  uppercase: /[A-Z]/.test(pw),
  number:    /\d/.test(pw),
  special:   /[!@#$%^&*(),.?":{}|<>]/.test(pw),
});

const getStrength = (rules) => {
  const count = Object.values(rules).filter(Boolean).length;
  if (count <= 1) return { label: 'Weak',   cls: 'weak',   pct: 25 };
  if (count <= 2) return { label: 'Fair',   cls: 'medium', pct: 50 };
  if (count <= 3) return { label: 'Good',   cls: 'medium', pct: 75 };
  return              { label: 'Strong', cls: 'strong', pct: 100 };
};

// ── Icons ─────────────────────────────────────────────────────────────
const Icon = ({ name, size = 18 }) => {
  const icons = {
    user:    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    mail:    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
    lock:    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>,
    eye:     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
    eyeOff:  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>,
    check:   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
    warn:    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
    star:    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
    gift:    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z"/></svg>,
    brain:   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 2A2.5 2.5 0 017 4.5v0A2.5 2.5 0 014.5 7H4a2 2 0 00-2 2v0a2 2 0 002 2h.5A2.5 2.5 0 017 13.5v0A2.5 2.5 0 019.5 16H10v2a2 2 0 002 2h0a2 2 0 002-2v-2h.5A2.5 2.5 0 0117 13.5v0a2.5 2.5 0 012.5-2.5H20a2 2 0 002-2v0a2 2 0 00-2-2h-.5A2.5 2.5 0 0117 4.5v0A2.5 2.5 0 0114.5 2H14a2 2 0 00-2 2v0a2 2 0 01-2-2H9.5z"/></svg>,
    package: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
    heart:   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
    arrowRight: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  };
  return icons[name] ?? null;
};

// ── Logo Mark ─────────────────────────────────────────────────────────
const LogoMark = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <rect width="28" height="28" rx="7" fill="#1a56db"/>
    <path d="M8 14l4-6 4 6-4 2-4-2z" fill="white" opacity="0.9"/>
    <path d="M12 16l4-2 4 6H8l4-4z" fill="white"/>
  </svg>
);

// ── Google SVG ────────────────────────────────────────────────────────
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
  </svg>
);

// ── Panel Features ────────────────────────────────────────────────────
const PANEL_FEATURES = [
  { icon: 'gift',    title: '10% Off First Order',      sub: 'Welcome discount auto-applied at checkout' },
  { icon: 'brain',   title: 'AI Shopping Assistant',    sub: 'Personalized picks available 24/7' },
  { icon: 'package', title: 'Real-Time Order Tracking', sub: 'Live updates on every package' },
  { icon: 'heart',   title: 'Wishlist & Price Alerts',  sub: 'Get notified when prices drop' },
];

// ── Main ──────────────────────────────────────────────────────────────
export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuth   = useSelector(selectIsAuth);
  const { loading, error } = useSelector((s) => s.auth);

  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
  });
  const [showPass,    setShowPass]    = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed,      setAgreed]      = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [pwRules,     setPwRules]     = useState(checkPassword(''));
  const [visible,     setVisible]     = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 40);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (isAuth) navigate('/dashboard', { replace: true });
  }, [isAuth, navigate]);

  useEffect(() => {
    dispatch(clearError());
  }, [form.name, form.email, form.password, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (name === 'password') setPwRules(checkPassword(value));
    if (fieldErrors[name]) setFieldErrors((f) => ({ ...f, [name]: '' }));
    if (error) dispatch(clearError());
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim())                      errs.name            = 'Full name is required';
    else if (form.name.trim().length < 2)       errs.name            = 'At least 2 characters required';
    if (!form.email.trim())                     errs.email           = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email           = 'Invalid email address';
    if (!form.password)                         errs.password        = 'Password is required';
    else if (form.password.length < 8)          errs.password        = 'At least 8 characters required';
    if (!form.confirmPassword)                  errs.confirmPassword = 'Please confirm your password';
    else if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    if (!agreed)                                errs.agreed          = 'You must agree to the terms';
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    dispatch(loginStart());
    try {
      await authService.register({
        name:     form.name.trim(),
        email:    form.email.trim(),
        password: form.password,
      });
      // Backend only sends a verification email — no user/token returned.
      // Store email so /verify-email page can offer resend without asking user to retype.
      sessionStorage.setItem('pendingVerifyEmail', form.email.trim().toLowerCase());
      dispatch(loginFailure(null)); // clears loading, keeps state clean
      navigate('/verify-email');
    } catch (err) {
      dispatch(loginFailure(err.message));
    }
  };

  const strength = getStrength(pwRules);

  const pwRulesList = [
    { key: 'length',    label: 'At least 8 characters' },
    { key: 'uppercase', label: 'One uppercase letter' },
    { key: 'number',    label: 'One number' },
    { key: 'special',   label: 'One special character' },
  ];

  const passwordsMatch = form.confirmPassword && form.password === form.confirmPassword;

  return (
    <div className={`auth-page ${visible ? 'auth-page--visible' : ''}`}>

      {/* ── Left Panel ── */}
      <div className="auth-panel">
        <div className="auth-panel__blob auth-panel__blob--1" />
        <div className="auth-panel__blob auth-panel__blob--2" />

        <div className="auth-panel__inner">
          <Link to="/" className="auth-panel__logo">
            <LogoMark />
            <span>AI<span className="auth-panel__logo-accent">Shop</span></span>
          </Link>

          <div className="auth-panel__eyebrow">
            <span className="auth-panel__eyebrow-dot" />
            Join 50,000+ smart shoppers
          </div>

          <h2 className="auth-panel__title">
            Everything you need<br />in one account
          </h2>
          <p className="auth-panel__sub">
            Create your free account and unlock AI-powered shopping,
            exclusive deals, and real-time order tracking.
          </p>

          <div className="auth-panel__features">
            {PANEL_FEATURES.map((f) => (
              <div key={f.title} className="auth-panel__feature">
                <div className="auth-panel__feature-icon">
                  <Icon name={f.icon} size={18} />
                </div>
                <div>
                  <div className="auth-panel__feature-title">{f.title}</div>
                  <div className="auth-panel__feature-sub">{f.sub}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="auth-panel__testimonial">
            <div className="auth-panel__testimonial-stars">
              {[1,2,3,4,5].map(s => <Icon key={s} name="star" size={13} />)}
            </div>
            <p className="auth-panel__testimonial-text">
              "The AI recommended a phone bundle that saved me a ton of money. Absolutely love this store!"
            </p>
            <div className="auth-panel__testimonial-author">
              <div className="auth-panel__testimonial-avatar">A</div>
              <div>
                <div className="auth-panel__testimonial-name">Arjun M.</div>
                <div className="auth-panel__testimonial-role">Verified Customer</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right Form Side ── */}
      <div className="auth-form-side">
        <div className="auth-card">

          {/* Mobile logo */}
          <Link to="/" className="auth-mobile-logo">
            <LogoMark />
            <span>AI<span>Shop</span></span>
          </Link>

          <div className="auth-card__header">
            <h1 className="auth-card__title">Create your account</h1>
            <p className="auth-card__sub">Free forever. No credit card required.</p>
          </div>

          {/* Error alert */}
          {error && (
            <div className="auth-alert auth-alert--error">
              <span className="auth-alert__icon"><Icon name="warn" size={15} /></span>
              <span>{error}</span>
            </div>
          )}

          {/* Google sign up */}
          <button
            className="auth-social__btn"
            type="button"
            onClick={() => alert('Google OAuth coming soon!')}
            style={{ width: '100%', marginBottom: 20 }}
          >
            <GoogleIcon />
            Sign up with Google
          </button>

          {/* Divider */}
          <div className="auth-divider" style={{ marginTop: 0, marginBottom: 20 }}>
            <span className="auth-divider__line" />
            <span className="auth-divider__text">or sign up with email</span>
            <span className="auth-divider__line" />
          </div>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>

            {/* Full Name */}
            <div className="form-group">
              <label className="form-label" htmlFor="name">Full Name</label>
              <div className="input-wrapper">
                <span className="input-icon-left input-icon-left--svg">
                  <Icon name="user" size={16} />
                </span>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  className={`form-input has-icon-left ${
                    fieldErrors.name ? 'form-input--error'
                    : form.name.trim().length >= 2 ? 'form-input--success' : ''
                  }`}
                  placeholder="John Doe"
                  value={form.name}
                  onChange={handleChange}
                />
                {form.name.trim().length >= 2 && !fieldErrors.name && (
                  <span className="input-icon-right input-check">
                    <Icon name="check" size={14} />
                  </span>
                )}
              </div>
              {fieldErrors.name && (
                <span className="form-error">
                  <Icon name="warn" size={12} /> {fieldErrors.name}
                </span>
              )}
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="form-label" htmlFor="reg-email">Email address</label>
              <div className="input-wrapper">
                <span className="input-icon-left input-icon-left--svg">
                  <Icon name="mail" size={16} />
                </span>
                <input
                  id="reg-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className={`form-input has-icon-left ${
                    fieldErrors.email ? 'form-input--error'
                    : /\S+@\S+\.\S+/.test(form.email) ? 'form-input--success' : ''
                  }`}
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                />
                {/\S+@\S+\.\S+/.test(form.email) && !fieldErrors.email && (
                  <span className="input-icon-right input-check">
                    <Icon name="check" size={14} />
                  </span>
                )}
              </div>
              {fieldErrors.email && (
                <span className="form-error">
                  <Icon name="warn" size={12} /> {fieldErrors.email}
                </span>
              )}
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label" htmlFor="reg-password">Password</label>
              <div className="input-wrapper">
                <span className="input-icon-left input-icon-left--svg">
                  <Icon name="lock" size={16} />
                </span>
                <input
                  id="reg-password"
                  name="password"
                  type={showPass ? 'text' : 'password'}
                  autoComplete="new-password"
                  className={`form-input has-icon-left has-icon-right ${
                    fieldErrors.password ? 'form-input--error' : ''
                  }`}
                  placeholder="Min. 8 characters"
                  value={form.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="input-icon-right input-eye-btn"
                  onClick={() => setShowPass((p) => !p)}
                  tabIndex={-1}
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                >
                  <Icon name={showPass ? 'eyeOff' : 'eye'} size={16} />
                </button>
              </div>
              {fieldErrors.password && (
                <span className="form-error">
                  <Icon name="warn" size={12} /> {fieldErrors.password}
                </span>
              )}

              {/* Strength meter */}
              {form.password && (
                <div className="reg-strength">
                  <div className="reg-strength__bars">
                    {[1,2,3,4].map((n) => (
                      <div
                        key={n}
                        className="reg-strength__bar"
                        style={{
                          background: n <= Math.ceil(strength.pct / 25)
                            ? strength.cls === 'weak'   ? '#dc2626'
                            : strength.cls === 'medium' ? '#f59e0b'
                            : '#16a34a'
                            : '#e2e8f0'
                        }}
                      />
                    ))}
                  </div>
                  <span
                    className="reg-strength__label"
                    style={{
                      color: strength.cls === 'weak' ? '#dc2626'
                           : strength.cls === 'medium' ? '#d97706'
                           : '#16a34a'
                    }}
                  >
                    {strength.label}
                  </span>
                </div>
              )}

              {/* Password rules */}
              {form.password && (
                <div className="reg-pw-rules">
                  {pwRulesList.map((r) => (
                    <div
                      key={r.key}
                      className={`reg-pw-rule ${pwRules[r.key] ? 'reg-pw-rule--pass' : 'reg-pw-rule--fail'}`}
                    >
                      <span className="reg-pw-rule__icon">
                        <Icon name={pwRules[r.key] ? 'check' : 'warn'} size={11} />
                      </span>
                      {r.label}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
              <div className="input-wrapper">
                <span className="input-icon-left input-icon-left--svg">
                  <Icon name="lock" size={16} />
                </span>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirm ? 'text' : 'password'}
                  autoComplete="new-password"
                  className={`form-input has-icon-left has-icon-right ${
                    fieldErrors.confirmPassword ? 'form-input--error'
                    : passwordsMatch ? 'form-input--success' : ''
                  }`}
                  placeholder="Re-enter your password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="input-icon-right input-eye-btn"
                  onClick={() => setShowConfirm((p) => !p)}
                  tabIndex={-1}
                  aria-label={showConfirm ? 'Hide password' : 'Show password'}
                >
                  <Icon name={showConfirm ? 'eyeOff' : 'eye'} size={16} />
                </button>
              </div>
              {fieldErrors.confirmPassword && (
                <span className="form-error">
                  <Icon name="warn" size={12} /> {fieldErrors.confirmPassword}
                </span>
              )}
              {passwordsMatch && !fieldErrors.confirmPassword && (
                <span className="form-success">
                  <Icon name="check" size={12} /> Passwords match
                </span>
              )}
            </div>

            {/* Terms checkbox */}
            <div className="form-group" style={{ marginBottom: 22 }}>
              <label className="auth-checkbox" style={{ alignItems: 'flex-start' }}>
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => {
                    setAgreed(e.target.checked);
                    if (fieldErrors.agreed) setFieldErrors((f) => ({ ...f, agreed: '' }));
                  }}
                  className="auth-checkbox__input"
                />
                <span
                  className="auth-checkbox__box"
                  style={{ marginTop: 1, flexShrink: 0 }}
                  onClick={() => {
                    setAgreed((a) => !a);
                    if (fieldErrors.agreed) setFieldErrors((f) => ({ ...f, agreed: '' }));
                  }}
                >
                  {agreed && <Icon name="check" size={11} />}
                </span>
                <span className="auth-checkbox__label" style={{ lineHeight: 1.5 }}>
                  I agree to the{' '}
                  <a href="#" className="auth-terms-link">Terms of Service</a>
                  {' '}and{' '}
                  <a href="#" className="auth-terms-link">Privacy Policy</a>
                </span>
              </label>
              {fieldErrors.agreed && (
                <span className="form-error" style={{ marginTop: 6 }}>
                  <Icon name="warn" size={12} /> {fieldErrors.agreed}
                </span>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className={`auth-submit-btn ${loading ? 'auth-submit-btn--loading' : ''}`}
              disabled={loading}
            >
              {loading ? (
                <span className="auth-submit-btn__spinner" />
              ) : (
                <>Create Account <Icon name="arrowRight" size={16} /></>
              )}
            </button>
          </form>

          <p className="auth-switch" style={{ marginTop: 20 }}>
            Already have an account?{' '}
            <Link to="/login" className="auth-switch__link">
              Sign in <Icon name="arrowRight" size={12} />
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}