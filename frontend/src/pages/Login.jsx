import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginSuccess, loginFailure, clearError, selectIsAuth } from '../store/authSlice';
import { authService } from '../services/authService';
import './Login.css';

// ── Icons ─────────────────────────────────────────────────────────────
const Icon = ({ name, size = 18 }) => {
  const icons = {
    mail:    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
    lock:    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>,
    eye:     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
    eyeOff:  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>,
    check:   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
    warn:    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
    zap:     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
    truck:   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
    shield:  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    brain:   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 2A2.5 2.5 0 017 4.5v0A2.5 2.5 0 014.5 7H4a2 2 0 00-2 2v0a2 2 0 002 2h.5A2.5 2.5 0 017 13.5v0A2.5 2.5 0 019.5 16H10v2a2 2 0 002 2h0a2 2 0 002-2v-2h.5A2.5 2.5 0 0117 13.5v0a2.5 2.5 0 012.5-2.5H20a2 2 0 002-2v0a2 2 0 00-2-2h-.5A2.5 2.5 0 0117 4.5v0A2.5 2.5 0 0114.5 2H14a2 2 0 00-2 2v0a2 2 0 01-2-2H9.5z"/></svg>,
    star:    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
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
  { icon: 'brain',  title: 'AI-Powered Picks',    sub: 'Products curated just for you' },
  { icon: 'truck',  title: 'Fast Delivery',        sub: '1–2 day shipping on most items' },
  { icon: 'shield', title: 'Secure & Private',     sub: '256-bit SSL encryption' },
];

// ── Main ──────────────────────────────────────────────────────────────
export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isAuth   = useSelector(selectIsAuth);
  const { loading, error } = useSelector((s) => s.auth);

  const from = location.state?.from?.pathname || '/dashboard';
  const successMsg = location.state?.successMsg || null;

  const [form,        setForm]        = useState({ email: '', password: '' });
  const [showPass,    setShowPass]    = useState(false);
  const [remember,    setRemember]    = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [visible,     setVisible]     = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 40);
    return () => clearTimeout(t);
  }, []);

  // Only auto-redirect if already authenticated AND didn't just register
  useEffect(() => {
    if (isAuth && !successMsg) navigate(from, { replace: true });
  }, [isAuth, from, navigate, successMsg]);

  useEffect(() => {
    dispatch(clearError());
  }, [form.email, form.password, dispatch]);

  const validate = () => {
    const errs = {};
    if (!form.email.trim())                    errs.email    = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email    = 'Invalid email address';
    if (!form.password)                        errs.password = 'Password is required';
    else if (form.password.length < 6)         errs.password = 'At least 6 characters required';
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (fieldErrors[name]) setFieldErrors((f) => ({ ...f, [name]: '' }));
    if (error) dispatch(clearError());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    dispatch(loginStart());
    try {
      const data = await authService.login({ email: form.email, password: form.password });
      dispatch(loginSuccess({ user: data.user, token: data.token || data.accessToken }));
      // Always go to dashboard after login
      navigate('/dashboard', { replace: true });
    } catch (err) {
      dispatch(loginFailure(err.message || 'Login failed. Check your credentials.'));
    }
  };

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
            Trusted by 50,000+ shoppers
          </div>

          <h2 className="auth-panel__title">
            Shop smarter<br />with AI
          </h2>
          <p className="auth-panel__sub">
            Personalized recommendations, instant AI support,
            and the best deals — all in one place.
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
              "AIShop found me the perfect laptop under my budget in seconds. The AI recommendations are genuinely impressive."
            </p>
            <div className="auth-panel__testimonial-author">
              <div className="auth-panel__testimonial-avatar">P</div>
              <div>
                <div className="auth-panel__testimonial-name">Priya R.</div>
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
            <h1 className="auth-card__title">Welcome back</h1>
            <p className="auth-card__sub">Sign in to your AIShop account</p>
          </div>

          {/* Success alert (after registration) */}
          {successMsg && (
            <div className="auth-alert" style={{ background: '#f0fdf4', border: '1px solid #86efac', color: '#15803d', marginBottom: 16 }}>
              <span className="auth-alert__icon"><Icon name="check" size={15} /></span>
              <span>{successMsg}</span>
            </div>
          )}

          {/* Error alert */}
          {error && (
            <div className="auth-alert auth-alert--error">
              <span className="auth-alert__icon"><Icon name="warn" size={15} /></span>
              <span>{error}</span>
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit} noValidate>

            {/* Email */}
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email address</label>
              <div className="input-wrapper">
                <span className="input-icon-left input-icon-left--svg">
                  <Icon name="mail" size={16} />
                </span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className={`form-input has-icon-left ${
                    fieldErrors.email ? 'form-input--error' : form.email && !fieldErrors.email ? 'form-input--success' : ''
                  }`}
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                />
                {form.email && !fieldErrors.email && (
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
              <label className="form-label" htmlFor="password">Password</label>
              <div className="input-wrapper">
                <span className="input-icon-left input-icon-left--svg">
                  <Icon name="lock" size={16} />
                </span>
                <input
                  id="password"
                  name="password"
                  type={showPass ? 'text' : 'password'}
                  autoComplete="current-password"
                  className={`form-input has-icon-left has-icon-right ${
                    fieldErrors.password ? 'form-input--error' : ''
                  }`}
                  placeholder="Enter your password"
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
            </div>

            {/* Remember + Forgot */}
            <div className="auth-form__row">
              <label className="auth-checkbox">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="auth-checkbox__input"
                />
                <span className="auth-checkbox__box">
                  {remember && <Icon name="check" size={11} />}
                </span>
                <span className="auth-checkbox__label">Remember me</span>
              </label>
              <Link to="/forgot-password" className="auth-form__forgot">
                Forgot password?
              </Link>
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
                <>Sign In <Icon name="arrowRight" size={16} /></>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="auth-divider">
            <span className="auth-divider__line" />
            <span className="auth-divider__text">or continue with</span>
            <span className="auth-divider__line" />
          </div>

          {/* Social */}
          <div className="auth-social">
            <button
              className="auth-social__btn"
              type="button"
              onClick={() => alert('Google OAuth coming soon!')}
            >
              <GoogleIcon />
              Continue with Google
            </button>
          </div>

          <p className="auth-switch">
            Don't have an account?{' '}
            <Link to="/register" className="auth-switch__link">
              Create one free <Icon name="arrowRight" size={12} />
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}