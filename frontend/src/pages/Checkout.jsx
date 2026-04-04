import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectCartItems, selectCoupon, selectDiscount, clearCart } from '../store/cartSlice';
import { selectUser } from '../store/authSlice';
import {
  getStatesByCountry,
  getCitiesByStateAndCountry,
  getPinsByStateAndCountry,
  getPinByCity,
} from '../data/indiaLocationData';
import './Checkout.css';

/* ── Constants ─────────────────────────────────────────── */
const GST_RATE = 0.18;
const HANDLING_FEE = 49;
const PLATFORM_FEE = 29;
const COD_CHARGE = 40;
const FREE_DELIVERY_THRESHOLD = 2000;
const DELIVERY_CHARGE = 99;

const STEPS = ['Shipping', 'Payment', 'Review & Pay'];

const COUNTRIES = ['India', 'USA', 'UK', 'Canada', 'Australia'];

/* ── Price Breakdown Calculator ────────────────────────── */
function computeBreakdown(items, discountPct, paymentMethod) {
  const isScamOnly = items.length > 0 && items.every(i => i.category === 'scam');
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const couponDiscount = Math.round(subtotal * discountPct);
  const afterDiscount = subtotal - couponDiscount;

  if (isScamOnly) {
    return { subtotal, couponDiscount, afterDiscount, delivery: 0, handling: 0, platformFee: 0, gst: 0, codCharge: 0, total: afterDiscount };
  }

  const delivery = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_CHARGE;
  const taxableSubtotal = items.filter(i => i.category !== 'scam').reduce((sum, i) => sum + i.price * i.quantity, 0);
  const gst = Math.round((taxableSubtotal - (taxableSubtotal * discountPct)) * GST_RATE);
  
  const codCharge = paymentMethod === 'cod' ? COD_CHARGE : 0;
  const total = afterDiscount + delivery + HANDLING_FEE + PLATFORM_FEE + gst + codCharge;
  return { subtotal, couponDiscount, afterDiscount, delivery, handling: HANDLING_FEE, platformFee: PLATFORM_FEE, gst, codCharge, total };
}

const INR = (n) => '₹' + Math.round(n).toLocaleString('en-IN');

/* ── Real Scannable QR Code (encoded amount via UPI deep link) ── */
function RealQRCode({ amount }) {
  // Build UPI payment deep link with the actual amount
  const upiLink = `upi://pay?pa=7878148960@ptaxis&pn=Prachi+Khandelwal&am=${amount}&cu=INR&tn=Order+Payment`;
  const encoded = encodeURIComponent(upiLink);
  const qrDataUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encoded}&bgcolor=ffffff&color=0f172a&margin=10&qzone=2`;

  if (!qrDataUrl) {
    return (
      <div style={{ width: 220, height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', borderRadius: 12, border: '2px solid #e2e8f0' }}>
        <div className="pg-spinner" />
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <img
        src={qrDataUrl}
        alt={`Scan to pay ${INR(amount)} via UPI`}
        width={220}
        height={220}
        style={{ borderRadius: 12, border: '4px solid #fff', boxShadow: '0 4px 32px rgba(0,0,0,0.18)', display: 'block' }}
        onError={(e) => {
          // Fallback to local QR if API fails
          e.target.style.display = 'none';
          e.target.nextSibling.style.display = 'flex';
        }}
      />
      {/* Fallback local SVG QR */}
      <FallbackQR size={220} style={{ display: 'none', position: 'absolute', top: 0, left: 0 }} />
    </div>
  );
}

/* ── Fallback QR (local pattern) ── */
function FallbackQR({ size = 220, style }) {
  const modules = 25;
  const cellSize = size / modules;
  const cells = [];
  const seed = 42;
  for (let r = 0; r < modules; r++) {
    for (let c = 0; c < modules; c++) {
      const inTopLeft = r < 7 && c < 7;
      const inTopRight = r < 7 && c >= modules - 7;
      const inBottomLeft = r >= modules - 7 && c < 7;
      if (inTopLeft || inTopRight || inBottomLeft) {
        const lr = inTopLeft ? r : inTopRight ? r : r - (modules - 7);
        const lc = inTopLeft ? c : inTopRight ? c - (modules - 7) : c;
        const isOuter = lr === 0 || lr === 6 || lc === 0 || lc === 6;
        const isInner = lr >= 2 && lr <= 4 && lc >= 2 && lc <= 4;
        if (isOuter || isInner) {
          cells.push(<rect key={`${r}-${c}`} x={c * cellSize} y={r * cellSize} width={cellSize} height={cellSize} fill="#0f172a" />);
        }
      } else {
        const hash = ((r * 31 + c * 17 + seed) * 2654435761) >>> 0;
        if (hash % 3 !== 0) {
          cells.push(<rect key={`${r}-${c}`} x={c * cellSize} y={r * cellSize} width={cellSize} height={cellSize} fill="#0f172a" />);
        }
      }
    }
  }
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ borderRadius: 8, border: '4px solid #fff', boxShadow: '0 4px 24px rgba(0,0,0,0.12)', ...style }}>
      <rect width={size} height={size} fill="#fff" />
      {cells}
    </svg>
  );
}

/* ── Dummy Card Visual ─────────────────────────────────── */
function CardVisual({ number, name, expiry }) {
  const last4 = number.replace(/\s/g, '').slice(-4) || '••••';
  const display = `•••• •••• •••• ${last4}`;
  return (
    <div className="pg-card-visual">
      <div className="pg-card-visual__chip">
        <svg width="36" height="28" viewBox="0 0 36 28" fill="none"><rect x="2" y="2" width="32" height="24" rx="4" fill="#d4a017" stroke="#b8860b" strokeWidth="1.5"/><line x1="2" y1="10" x2="34" y2="10" stroke="#b8860b" strokeWidth="1"/><line x1="2" y1="16" x2="34" y2="16" stroke="#b8860b" strokeWidth="1"/><line x1="14" y1="2" x2="14" y2="26" stroke="#b8860b" strokeWidth="1"/></svg>
      </div>
      <div className="pg-card-visual__number">{display}</div>
      <div className="pg-card-visual__bottom">
        <div>
          <div className="pg-card-visual__label">Card Holder</div>
          <div className="pg-card-visual__value">{name || 'YOUR NAME'}</div>
        </div>
        <div>
          <div className="pg-card-visual__label">Expires</div>
          <div className="pg-card-visual__value">{expiry || 'MM/YY'}</div>
        </div>
      </div>
      <div className="pg-card-visual__brand">VISA</div>
    </div>
  );
}

/* ── Payment Gateway Modal ─────────────────────────────── */
function PaymentGateway({ method, amount, payment, onSuccess, onCancel }) {
  const [phase, setPhase] = useState('init'); // init | processing | otp | success | failed
  const [progress, setProgress] = useState(0);
  const [otp, setOtp] = useState('');
  const [upiTimer, setUpiTimer] = useState(300); // 5 min
  const [statusMsg, setStatusMsg] = useState('');
  const timerRef = useRef(null);

  useEffect(() => {
    if (method === 'cod') {
      setPhase('success');
      setStatusMsg('Order Confirmed!');
      return;
    }

    if (method === 'card') {
      setPhase('processing');
      setStatusMsg('Connecting to bank...');
      const steps = [
        { msg: 'Connecting to bank...', pct: 15, delay: 800 },
        { msg: 'Verifying card details...', pct: 35, delay: 1200 },
        { msg: 'Authenticating transaction...', pct: 55, delay: 1000 },
        { msg: 'Enter OTP sent to your registered mobile', pct: 60, delay: 800 },
      ];
      let i = 0;
      const runStep = () => {
        if (i >= steps.length) { setPhase('otp'); return; }
        setStatusMsg(steps[i].msg);
        setProgress(steps[i].pct);
        i++;
        setTimeout(runStep, steps[i - 1].delay);
      };
      runStep();
    }

    if (method === 'upi') {
      setPhase('processing');
      setStatusMsg('Scan the QR code with any UPI app');
      setProgress(10);
      timerRef.current = setInterval(() => {
        setUpiTimer(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setPhase('failed');
            setStatusMsg('Payment timed out. Please try again.');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [method]);

  const handleOtpSubmit = () => {
    if (otp.length < 4) return;
    setPhase('processing');
    setStatusMsg('Verifying OTP...');
    setProgress(75);
    setTimeout(() => {
      setStatusMsg('Processing payment...');
      setProgress(90);
      setTimeout(() => {
        setProgress(100);
        setPhase('success');
        setStatusMsg('Payment Successful!');
      }, 1000);
    }, 1200);
  };

  const handleUpiVerify = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setStatusMsg('Verifying payment...');
    setProgress(70);
    setTimeout(() => {
      setProgress(100);
      setPhase('success');
      setStatusMsg('Payment Received!');
    }, 2000);
  };

  const formatTimer = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <div className="pg-overlay">
      <div className="pg-modal">
        {/* Header */}
        <div className="pg-header">
          <div className="pg-header__left">
            <div className="pg-header__logo">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="1" y="4" width="22" height="16" rx="3"/>
                <line x1="1" y1="10" x2="23" y2="10"/>
              </svg>
            </div>
            <div>
              <div className="pg-header__title">AI Shop Payments</div>
              <div className="pg-header__secure">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>
                256-bit SSL Encrypted · PCI DSS Compliant
              </div>
            </div>
          </div>
          {phase !== 'success' && (
            <button className="pg-header__close" onClick={onCancel}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          )}
        </div>

        {/* Amount bar */}
        <div className="pg-amount-bar">
          <div className="pg-amount-bar__left">
            <span className="pg-amount-bar__label">Amount to Pay</span>
            <span className="pg-amount-bar__method">
              {method === 'card' ? '💳 Credit/Debit Card' : method === 'upi' ? '📲 UPI Payment' : '💵 Cash on Delivery'}
            </span>
          </div>
          <span className="pg-amount-bar__value">{INR(amount)}</span>
        </div>

        {/* Progress bar */}
        {phase !== 'success' && phase !== 'failed' && method !== 'cod' && (
          <div className="pg-progress">
            <div className="pg-progress__fill" style={{ width: `${progress}%` }} />
          </div>
        )}

        {/* Body */}
        <div className="pg-body">

          {/* ── CARD: OTP Entry ── */}
          {method === 'card' && phase === 'otp' && (
            <div className="pg-otp-section">
              <div className="pg-otp-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="1.5"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 018 0v4"/></svg>
              </div>
              <h3 className="pg-otp-title">Enter OTP</h3>
              <p className="pg-otp-sub">A 6-digit OTP has been sent to your registered mobile number ••••XX89</p>
              <div className="pg-otp-inputs">
                <input
                  className="pg-otp-input"
                  type="text"
                  maxLength={6}
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  autoFocus
                />
              </div>
              <button className="pg-btn pg-btn--primary" onClick={handleOtpSubmit} disabled={otp.length < 4}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>
                Verify & Pay {INR(amount)}
              </button>
              <p className="pg-otp-resend">Didn't receive? <button className="pg-link-btn" onClick={() => setOtp('')}>Resend OTP</button></p>
              <p className="pg-demo-hint">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                Demo mode: Enter any 4-6 digit number
              </p>
            </div>
          )}

          {/* ── CARD: Processing ── */}
          {method === 'card' && phase === 'processing' && (
            <div className="pg-processing">
              <div className="pg-spinner" />
              <p className="pg-processing__msg">{statusMsg}</p>
              <CardVisual number={payment.cardNumber} name={payment.cardName} expiry={payment.expiry} />
            </div>
          )}

          {/* ── UPI: QR + Timer ── */}
          {method === 'upi' && phase === 'processing' && (
            <div className="pg-upi-section">
              <div className="pg-qr-wrap">
                <RealQRCode amount={amount} />
                <div className="pg-qr-badge">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="white" stroke="none"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>
                  Scan to Pay
                </div>
              </div>
              <p className="pg-upi-scan-text">Scan with any UPI app · Paying <strong>{INR(amount)}</strong></p>
              <div className="pg-upi-apps">
                {[
                  { name: 'GPay', color: '#4285F4' },
                  { name: 'PhonePe', color: '#5F259F' },
                  { name: 'Paytm', color: '#00B9F1' },
                  { name: 'BHIM', color: '#FF6B05' },
                ].map(app => (
                  <span key={app.name} className="pg-upi-app-chip" style={{ borderColor: app.color, color: app.color }}>{app.name}</span>
                ))}
              </div>
              <div className="pg-upi-timer">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                <span>Expires in <strong className={upiTimer < 60 ? 'pg-timer-urgent' : ''}>{formatTimer(upiTimer)}</strong></span>
              </div>
              <div className="pg-upi-or"><span>OR pay using UPI ID</span></div>
              <div className="pg-upi-id-row">
                <span className="pg-upi-id-value">7878148960@ptaxis</span>
                <button className="pg-copy-btn" onClick={() => navigator.clipboard?.writeText('7878148960@ptaxis')}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
                  Copy
                </button>
              </div>
              <button className="pg-btn pg-btn--primary pg-btn--full" onClick={handleUpiVerify} style={{ marginTop: 20 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                I've Made the Payment
              </button>
              <p className="pg-demo-hint">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                Demo mode: Click above after scanning to simulate payment
              </p>
            </div>
          )}

          {/* ── COD / Success ── */}
          {phase === 'success' && (
            <div className="pg-success">
              <div className="pg-success-anim">
                <div className="pg-success-ring" />
                <div className="pg-success-check">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
              </div>
              <h3 className="pg-success-title">{statusMsg}</h3>
              <p className="pg-success-amount">{INR(amount)}</p>
              {method === 'cod' && (
                <div className="pg-success-cod-note">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                  Pay <strong>{INR(amount)}</strong> in cash when your order is delivered.<br />Keep the exact amount ready for a smooth handover.
                </div>
              )}
              {method === 'card' && (
                <p className="pg-success-txn">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 12l2 2 4-4"/><path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"/></svg>
                  Transaction ID: TXN{Date.now().toString().slice(-10)}
                </p>
              )}
              {method === 'upi' && (
                <p className="pg-success-txn">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 12l2 2 4-4"/><path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"/></svg>
                  UPI Ref: UPI{Date.now().toString().slice(-12)}
                </p>
              )}
              <button className="pg-btn pg-btn--success pg-btn--full" onClick={onSuccess}>
                Continue to Order Confirmation →
              </button>
            </div>
          )}

          {/* ── Failed ── */}
          {phase === 'failed' && (
            <div className="pg-failed">
              <div className="pg-failed-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </div>
              <h3 className="pg-failed-title">Payment Failed</h3>
              <p className="pg-failed-msg">{statusMsg}</p>
              <button className="pg-btn pg-btn--primary pg-btn--full" onClick={onCancel}>Try Again</button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pg-footer">
          <div className="pg-footer__badges">
            <span className="pg-footer__badge">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>
              SSL Secure
            </span>
            <span className="pg-footer__badge">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="3"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
              PCI DSS
            </span>
            <span className="pg-footer__badge">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/><path d="M12 6v6l4 2"/></svg>
              RBI Compliant
            </span>
          </div>
          <span className="pg-footer__powered">Powered by <strong>AI Shop Payments</strong></span>
        </div>
      </div>
    </div>
  );
}

/* ── Helpers ────────────────────────────────────────────── */
const formatCard = (val) => val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
const formatExpiry = (val) => {
  const clean = val.replace(/\D/g, '').slice(0, 4);
  return clean.length >= 3 ? clean.slice(0, 2) + '/' + clean.slice(2) : clean;
};

/* ── Location-Aware Dropdown ────────────────────────────── */
function LocationDropdowns({ shipping, updateShipping }) {
  const country = shipping.country;
  const states = getStatesByCountry(country);
  const cities = getCitiesByStateAndCountry(country, shipping.state);
  const pins = getPinsByStateAndCountry(country, shipping.state);

  const handleStateChange = (val) => {
    updateShipping('state', val);
    updateShipping('city', '');
    updateShipping('zip', '');
  };

  const handleCityChange = (val) => {
    updateShipping('city', val);
    const pin = getPinByCity(country, shipping.state, val);
    if (pin) updateShipping('zip', pin);
  };

  const pinLabel = country === 'India' ? 'PIN Code' : country === 'UK' ? 'Postcode' : 'ZIP Code';
  const statePlaceholder = country === 'India' ? 'Select State' : 'Select State / Region';

  return (
    <>
      <div className="form-group">
        <label className="form-label">{country === 'India' ? 'State *' : 'State / Region *'}</label>
        {states.length > 0 ? (
          <select
            className="form-select"
            value={shipping.state}
            onChange={e => handleStateChange(e.target.value)}
          >
            <option value="">{statePlaceholder}</option>
            {states.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        ) : (
          <input className="form-input" placeholder={statePlaceholder} value={shipping.state} onChange={e => updateShipping('state', e.target.value)} />
        )}
      </div>

      <div className="form-group">
        <label className="form-label">City *</label>
        {shipping.state && cities.length > 0 ? (
          <select
            className="form-select"
            value={shipping.city}
            onChange={e => handleCityChange(e.target.value)}
          >
            <option value="">Select City</option>
            {cities.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        ) : (
          <input className="form-input" placeholder="Enter city" value={shipping.city} onChange={e => updateShipping('city', e.target.value)} />
        )}
      </div>

      <div className="form-group">
        <label className="form-label">{pinLabel} *</label>
        {shipping.state && pins.length > 0 ? (
          <select
            className="form-select"
            value={shipping.zip}
            onChange={e => updateShipping('zip', e.target.value)}
          >
            <option value="">Select {pinLabel}</option>
            {pins.map((p, i) => (
              <option key={i} value={p}>{p}{cities[i] ? ` (${cities[i]})` : ''}</option>
            ))}
          </select>
        ) : (
          <input className="form-input" placeholder={country === 'India' ? '400001' : 'Enter code'} value={shipping.zip} onChange={e => updateShipping('zip', e.target.value)} maxLength={10} />
        )}
      </div>
    </>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN CHECKOUT COMPONENT
   ══════════════════════════════════════════════════════════ */
export default function Checkout() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const items     = useSelector(selectCartItems);
  const coupon    = useSelector(selectCoupon);
  const discountPct = useSelector(selectDiscount);
  const user      = useSelector(selectUser);

  const [step, setStep] = useState(0);
  const [error, setError] = useState('');
  const [showGateway, setShowGateway] = useState(false);

  const [shipping, setShipping] = useState({
    fullName: user?.name || '',
    email:    user?.email || '',
    phone:    '',
    address:  '',
    city:     '',
    state:    '',
    zip:      '',
    country:  'India',
  });

  const [payment, setPayment] = useState({
    method:     'card',
    cardNumber: '',
    cardName:   '',
    expiry:     '',
    cvv:        '',
    upiId:      '',
  });

  const [saveAddress, setSaveAddress] = useState(true);

  const updateShipping = (field, val) => {
    setShipping(s => {
      const updated = { ...s, [field]: val };
      // Reset state/city/zip when country changes
      if (field === 'country') {
        updated.state = '';
        updated.city = '';
        updated.zip = '';
      }
      return updated;
    });
  };
  const updatePayment  = (field, val) => setPayment(p  => ({ ...p, [field]: val }));

  const breakdown = computeBreakdown(items, discountPct, payment.method);

  const validateShipping = () => {
    const { fullName, email, address, city, state, zip } = shipping;
    if (!fullName || !email || !address || !city || !state || !zip) {
      setError('Please fill in all required fields.');
      return false;
    }
    setError('');
    return true;
  };

  const validatePayment = () => {
    if (payment.method === 'card') {
      if (!payment.cardNumber || !payment.cardName || !payment.expiry || !payment.cvv) {
        setError('Please fill in all card details.');
        return false;
      }
      if (payment.cardNumber.replace(/\s/g, '').length < 16) {
        setError('Please enter a valid 16-digit card number.');
        return false;
      }
    }
    setError('');
    return true;
  };

  const handleNext = () => {
    if (step === 0 && !validateShipping()) return;
    if (step === 1 && !validatePayment())  return;
    setStep(s => s + 1);
    setError('');
    window.scrollTo(0, 0);
  };

  const handlePlaceOrder = () => { setShowGateway(true); };

  const handlePaymentSuccess = () => {
    setShowGateway(false);

    const orderId = 'ORD-' + Date.now().toString().slice(-8);
    const newOrder = {
      _id: orderId,
      date: new Date().toISOString(),
      status: 'Processing',
      total: breakdown.total,
      paymentMethod: payment.method,
      // Save full item details including images
      items: items.map(i => ({
        name:     i.name,
        qty:      i.quantity,
        price:    i.price,
        image:    i.image || i.images?.[0] || '',
        brand:    i.brand || '',
        category: i.category || '',
      })),
      shipping: { ...shipping },
      breakdown: { ...breakdown },
    };

    try {
      const existing = JSON.parse(localStorage.getItem('aishop_orders') || '[]');
      localStorage.setItem('aishop_orders', JSON.stringify([newOrder, ...existing]));
    } catch(e) {
      console.error('Failed to save mock order', e);
    }

    dispatch(clearCart());
    navigate('/order-success', {
      state: {
        orderId:       orderId,
        paymentMethod: payment.method,
        total:         breakdown.total,
        items:         newOrder.items,
      }
    });
  };

  if (items.length === 0) {
    return (
      <div className="checkout-page page-enter">
        <div className="container">
          <div className="empty-state" style={{ minHeight: '60vh' }}>
            <div className="empty-state-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 001.99-1.79L23 6H6"/></svg>
            </div>
            <div className="empty-state-title">Your cart is empty</div>
            <Link to="/products" className="btn btn-primary btn-lg mt-md">Shop Now →</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page page-enter">
      {/* Payment Gateway Modal */}
      {showGateway && (
        <PaymentGateway
          method={payment.method}
          amount={breakdown.total}
          payment={payment}
          onSuccess={handlePaymentSuccess}
          onCancel={() => setShowGateway(false)}
        />
      )}

      <div className="container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/">Home</Link><span className="sep">›</span>
          <Link to="/cart">Cart</Link><span className="sep">›</span>
          <span className="current">Checkout</span>
        </div>

        <h1 className="checkout-heading">Secure Checkout</h1>

        {/* Stepper */}
        <div className="checkout-stepper">
          {STEPS.map((label, i) => (
            <div key={label} className="checkout-step-item">
              <div className={`checkout-step-circle ${i < step ? 'done' : i === step ? 'active' : ''}`}>
                {i < step
                  ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                  : i + 1}
              </div>
              <span className={`checkout-step-label ${i === step ? 'active' : ''}`}>{label}</span>
              {i < STEPS.length - 1 && <div className={`checkout-step-line ${i < step ? 'done' : ''}`} />}
            </div>
          ))}
        </div>

        <div className="checkout-layout">

          {/* ── Left: Form ── */}
          <div className="checkout-form-col">

            {/* STEP 0: Shipping */}
            {step === 0 && (
              <div className="checkout-section">
                <h2 className="checkout-section-title">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>
                  Shipping Address
                </h2>
                {error && <div className="auth-alert auth-alert--error mb-md"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> {error}</div>}

                <div className="checkout-form-grid">
                  <div className="form-group checkout-span-2">
                    <label className="form-label">Full Name *</label>
                    <input className="form-input" placeholder="John Doe" value={shipping.fullName} onChange={e => updateShipping('fullName', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email *</label>
                    <input className="form-input" type="email" placeholder="you@email.com" value={shipping.email} onChange={e => updateShipping('email', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone</label>
                    <input className="form-input" placeholder="+91 98765 43210" value={shipping.phone} onChange={e => updateShipping('phone', e.target.value)} />
                  </div>
                  <div className="form-group checkout-span-2">
                    <label className="form-label">Street Address *</label>
                    <input className="form-input" placeholder="123 Main Street, Apt 4B" value={shipping.address} onChange={e => updateShipping('address', e.target.value)} />
                  </div>

                  {/* Country selector */}
                  <div className="form-group checkout-span-2">
                    <label className="form-label">Country</label>
                    <select className="form-select" value={shipping.country} onChange={e => updateShipping('country', e.target.value)}>
                      {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  {/* Dynamic State / City / PIN dropdowns */}
                  <LocationDropdowns shipping={shipping} updateShipping={updateShipping} />
                </div>

                <label className="checkbox-wrapper mt-md">
                  <input type="checkbox" checked={saveAddress} onChange={e => setSaveAddress(e.target.checked)} />
                  <span className="checkbox-label">Save this address for future orders</span>
                </label>
              </div>
            )}

            {/* STEP 1: Payment Method */}
            {step === 1 && (
              <div className="checkout-section">
                <h2 className="checkout-section-title">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="3"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                  Payment Method
                </h2>
                {error && <div className="auth-alert auth-alert--error mb-md"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> {error}</div>}

                {/* Method selector */}
                <div className="payment-methods">
                  {[
                    { value: 'card', label: 'Credit / Debit Card', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="3"/><line x1="1" y1="10" x2="23" y2="10"/></svg>, sub: 'Visa · Mastercard · RuPay · Amex' },
                    { value: 'upi',  label: 'UPI / QR Code',       icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="3" height="3"/></svg>, sub: 'Google Pay · PhonePe · Paytm · BHIM' },
                    { value: 'cod',  label: 'Cash on Delivery',    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M6 12h.01M18 12h.01"/></svg>, sub: `Extra ${INR(COD_CHARGE)} COD charge` },
                  ].map(m => (
                    <label key={m.value} className={`payment-method-card ${payment.method === m.value ? 'payment-method-card--active' : ''}`}>
                      <input type="radio" name="paymentMethod" value={m.value} checked={payment.method === m.value} onChange={() => updatePayment('method', m.value)} />
                      <span className="payment-method-icon">{m.icon}</span>
                      <div className="payment-method-info">
                        <span className="payment-method-label">{m.label}</span>
                        <span className="payment-method-sub">{m.sub}</span>
                      </div>
                      {payment.method === m.value && (
                        <span className="payment-method-check">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                        </span>
                      )}
                    </label>
                  ))}
                </div>

                {/* Card fields */}
                {payment.method === 'card' && (
                  <div className="card-fields">
                    <CardVisual number={payment.cardNumber} name={payment.cardName} expiry={payment.expiry} />
                    <div className="form-group" style={{ marginTop: 20 }}>
                      <label className="form-label">Card Number *</label>
                      <div className="input-wrapper">
                        <span className="input-icon-left">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="3"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                        </span>
                        <input
                          className="form-input has-icon-left"
                          placeholder="1234 5678 9012 3456"
                          value={payment.cardNumber}
                          onChange={e => updatePayment('cardNumber', formatCard(e.target.value))}
                          maxLength={19}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Cardholder Name *</label>
                      <input className="form-input" placeholder="Name on card" value={payment.cardName} onChange={e => updatePayment('cardName', e.target.value)} />
                    </div>
                    <div className="checkout-form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                      <div className="form-group">
                        <label className="form-label">Expiry Date *</label>
                        <input className="form-input" placeholder="MM/YY" value={payment.expiry} onChange={e => updatePayment('expiry', formatExpiry(e.target.value))} maxLength={5} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">CVV *</label>
                        <input className="form-input" placeholder="•••" type="password" value={payment.cvv} onChange={e => updatePayment('cvv', e.target.value.replace(/\D/g,'').slice(0, 4))} maxLength={4} />
                      </div>
                    </div>
                    <div className="card-secure-note">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>
                      Your card details are 256-bit encrypted and never stored on our servers
                    </div>
                  </div>
                )}

                {/* UPI */}
                {payment.method === 'upi' && (
                  <div className="upi-preview-section">
                    <div className="upi-preview-info">
                      <div className="upi-preview-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="3" height="3"/></svg>
                      </div>
                      <div>
                        <strong>Pay via UPI / QR Code</strong>
                        <p>A scannable QR code with the exact payment amount will be shown. Scan it with any UPI app (Google Pay, PhonePe, Paytm, BHIM).</p>
                      </div>
                    </div>
                    <div className="form-group" style={{ marginTop: 16 }}>
                      <label className="form-label">UPI ID (Optional)</label>
                      <input className="form-input" placeholder="yourname@upi" value={payment.upiId} onChange={e => updatePayment('upiId', e.target.value)} />
                      <p className="form-hint">You can also scan the QR code shown on the next step</p>
                    </div>
                  </div>
                )}

                {/* COD */}
                {payment.method === 'cod' && (
                  <div className="cod-note">
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="1.5"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M6 12h.01M18 12h.01"/></svg>
                    <div>
                      <strong>Cash on Delivery</strong>
                      <p>Pay when your order arrives. An additional <strong>{INR(COD_CHARGE)}</strong> COD handling charge applies.</p>
                      <ul className="cod-rules">
                        <li>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                          Keep exact change ready
                        </li>
                        <li>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                          Available for orders under ₹50,000
                        </li>
                        <li>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                          Verify package before payment
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STEP 2: Review & Pay */}
            {step === 2 && (
              <div className="checkout-section">
                <h2 className="checkout-section-title">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  Review Your Order
                </h2>

                {/* Shipping summary */}
                <div className="review-block">
                  <div className="review-block__header">
                    <span className="review-block__title">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      Shipping to
                    </span>
                    <button className="review-block__edit" onClick={() => setStep(0)}>Edit</button>
                  </div>
                  <p className="review-block__content">
                    {shipping.fullName}<br />
                    {shipping.address}, {shipping.city}, {shipping.state} {shipping.zip}<br />
                    {shipping.country} · {shipping.phone || shipping.email}
                  </p>
                </div>

                {/* Payment summary */}
                <div className="review-block">
                  <div className="review-block__header">
                    <span className="review-block__title">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="3"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                      Payment
                    </span>
                    <button className="review-block__edit" onClick={() => setStep(1)}>Edit</button>
                  </div>
                  <p className="review-block__content">
                    {payment.method === 'card'
                      ? `Credit/Debit Card ending in ${payment.cardNumber.replace(/\s/g,'').slice(-4) || '????'}`
                      : payment.method === 'upi' ? 'UPI / QR Code Payment' : 'Cash on Delivery'
                    }
                  </p>
                </div>

                {/* Items with images */}
                <div className="review-items">
                  <h4 className="review-items__title">Items ({items.length})</h4>
                  {items.map((item, idx) => (
                    <div key={idx} className="review-item">
                      <div className="review-item__img">
                        {(item.image || item.images?.[0]) ? (
                          <img
                            src={item.image || item.images?.[0]}
                            alt={item.name}
                            onError={e => { e.target.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=80&q=80'; }}
                          />
                        ) : (
                          <div className="review-item__img-placeholder">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                          </div>
                        )}
                      </div>
                      <div className="review-item__details">
                        <span className="review-item__name">{item.name}</span>
                        <span className="review-item__meta">
                          {item.brand && <span>{item.brand} · </span>}
                          Qty: {item.quantity}
                          {item.selectedColor && <span> · {item.selectedColor}</span>}
                        </span>
                        <span className="review-item__unit-price">{INR(item.price)} each</span>
                      </div>
                      <span className="review-item__price">{INR(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                {error && <div className="auth-alert auth-alert--error mt-md"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> {error}</div>}
              </div>
            )}

            {/* Navigation buttons */}
            <div className="checkout-nav-btns">
              {step > 0 && (
                <button className="btn btn-outline btn-lg" onClick={() => setStep(s => s - 1)}>← Back</button>
              )}
              {step < 2 ? (
                <button className="btn btn-primary btn-lg" style={{ marginLeft: 'auto' }} onClick={handleNext}>
                  Continue →
                </button>
              ) : (
                <button
                  className="btn btn-green btn-lg btn-pay-now"
                  style={{ marginLeft: 'auto' }}
                  onClick={handlePlaceOrder}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>
                  {payment.method === 'cod' ? 'Confirm Order' : `Pay Securely ${INR(breakdown.total)}`}
                </button>
              )}
            </div>
          </div>

          {/* ── Right: Order Summary ── */}
          <div className="checkout-summary-col">
            <div className="cart-summary-card">
              <h3 className="cart-summary-title">Order Summary</h3>

              {/* Item list with thumbnails */}
              <div className="checkout-summary-items">
                {items.map((item, i) => (
                  <div key={i} className="checkout-summary-item">
                    <div className="checkout-summary-item__thumb">
                      {(item.image || item.images?.[0]) ? (
                        <img src={item.image || item.images?.[0]} alt={item.name} onError={e => { e.target.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=48&q=80'; }} />
                      ) : (
                        <div className="checkout-summary-item__thumb-placeholder" />
                      )}
                      <span className="checkout-summary-item__qty">{item.quantity}</span>
                    </div>
                    <span className="truncate" style={{ maxWidth: 160, flex: 1 }}>{item.name}</span>
                    <span className="checkout-summary-item__price">{INR(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="cart-summary-divider" />

              {/* Detailed breakdown */}
              <div className="cart-summary-rows">
                <div className="cart-summary-row">
                  <span>Subtotal</span>
                  <span>{INR(breakdown.subtotal)}</span>
                </div>

                {breakdown.couponDiscount > 0 && (
                  <div className="cart-summary-row cart-summary-row--green">
                    <span>Coupon ({coupon})</span>
                    <span>−{INR(breakdown.couponDiscount)}</span>
                  </div>
                )}

                <div className="cart-summary-row">
                  <span>Delivery</span>
                  <span className={breakdown.delivery === 0 ? 'cart-free-ship' : ''}>
                    {breakdown.delivery === 0 ? '🎉 FREE' : INR(breakdown.delivery)}
                  </span>
                </div>

                <div className="cart-summary-row">
                  <span>Handling Charges</span>
                  <span>{INR(breakdown.handling)}</span>
                </div>

                <div className="cart-summary-row">
                  <span>Platform Fee</span>
                  <span>{INR(breakdown.platformFee)}</span>
                </div>

                <div className="cart-summary-row">
                  <span>GST (18%)</span>
                  <span>{INR(breakdown.gst)}</span>
                </div>

                {breakdown.codCharge > 0 && (
                  <div className="cart-summary-row cart-summary-row--amber">
                    <span>COD Charge</span>
                    <span>{INR(breakdown.codCharge)}</span>
                  </div>
                )}
              </div>

              <div className="cart-summary-divider" />

              <div className="cart-summary-total">
                <span>Total</span>
                <span>{INR(breakdown.total)}</span>
              </div>

              {/* Savings callout */}
              {(breakdown.couponDiscount > 0 || breakdown.delivery === 0) && (
                <div className="checkout-savings">
                  🎉 You're saving {INR(breakdown.couponDiscount + (breakdown.delivery === 0 ? DELIVERY_CHARGE : 0))} on this order!
                </div>
              )}

              {/* Trust badges */}
              <div className="cart-trust" style={{ marginTop: 16 }}>
                <span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>
                  Secure Payment
                </span>
                <span>·</span>
                <span>30-day Returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}