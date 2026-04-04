import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectCartItems, selectCartTotal,
  removeFromCart, updateQuantity,
  applyCoupon, removeCoupon, selectCoupon
} from '../store/cartSlice';
import { selectIsAuth } from '../store/authSlice';
import { cartService } from '../services/cartService';
import './Cart.css';

function LoginPromptModal({ onClose, message }) {
  return (
    <div className="login-prompt-overlay" onClick={onClose}>
      <div className="login-prompt-modal" onClick={(e) => e.stopPropagation()}>
        <div className="login-prompt-icon">🔒</div>
        <h3 className="login-prompt-title">Sign In Required</h3>
        <p className="login-prompt-text">{message}</p>
        <div className="login-prompt-actions">
          <Link to="/login" className="btn btn-primary btn-lg">Sign In</Link>
          <Link to="/register" className="btn btn-outline">Create Account</Link>
        </div>
        <button className="login-prompt-close" onClick={onClose}>✕</button>
      </div>
    </div>
  );
}

export default function Cart() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const items     = useSelector(selectCartItems);
  const coupon    = useSelector(selectCoupon);
  const totals    = useSelector(selectCartTotal);
  const isAuth    = useSelector(selectIsAuth);

  const [couponInput,   setCouponInput]   = useState('');
  const [couponError,   setCouponError]   = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [removingIdx,   setRemovingIdx]   = useState(null);
  const [loginPrompt,   setLoginPrompt]   = useState(null); // null | 'checkout' | 'coupon'

  const handleRemove = (idx) => {
    setRemovingIdx(idx);
    setTimeout(() => {
      dispatch(removeFromCart(idx));
      setRemovingIdx(null);
    }, 300);
  };

  const handleQty = (idx, qty) => {
    if (qty < 1 || qty > 10) return;
    dispatch(updateQuantity({ index: idx, quantity: qty }));
  };

  const handleApplyCoupon = async () => {
    if (!isAuth) { setLoginPrompt('coupon'); return; }
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    setCouponError('');
    try {
      const data = await cartService.validateCoupon(couponInput.trim().toUpperCase());
      dispatch(applyCoupon({ code: data.code, discount: data.discount }));
      setCouponInput('');
    } catch {
      if (couponInput.trim().toUpperCase() === 'SAVE10') {
        dispatch(applyCoupon({ code: 'SAVE10', discount: 0.10 }));
        setCouponInput('');
      } else if (couponInput.trim().toUpperCase() === 'AISHIP') {
        dispatch(applyCoupon({ code: 'AISHIP', discount: 0.15 }));
        setCouponInput('');
      } else {
        setCouponError('Invalid coupon code. Try SAVE10 or AISHIP');
      }
    } finally {
      setCouponLoading(false);
    }
  };

  const handleCheckout = () => {
    if (!isAuth) { setLoginPrompt('checkout'); return; }
    navigate('/checkout');
  };

  const categoryEmoji = (cat) => ({
    phones:    '📱',
    laptops:   '💻',
    audio:     '🎧',
    wearables: '⌚',
    gaming:    '🎮',
    clothing:  '👕',
    fashion:   '👗',
    makeup:    '💄',
  }[cat] ?? '📦');

  if (items.length === 0) {
    return (
      <div className="cart-page page-enter">
        <div className="container">
          <div className="empty-state" style={{ minHeight: '60vh' }}>
            <div className="empty-state-icon">🛒</div>
            <div className="empty-state-title">Your cart is empty</div>
            <div className="empty-state-text">Looks like you haven't added anything yet. Let's fix that!</div>
            <Link to="/products" className="btn btn-primary btn-lg mt-md">Start Shopping →</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page page-enter">
      {loginPrompt && (
        <LoginPromptModal
          onClose={() => setLoginPrompt(null)}
          message={
            loginPrompt === 'checkout'
              ? 'Please sign in to place your order and track it anytime.'
              : 'Please sign in to apply coupon codes and unlock exclusive discounts.'
          }
        />
      )}

      <div className="container">
        <h1 className="cart-heading">Shopping Cart <span className="cart-count-chip">{items.length} items</span></h1>

        {/* Guest notice banner */}
        {!isAuth && (
          <div className="cart-guest-banner">
            <span>👋 Shopping as guest —</span>
            <Link to="/login">Sign in</Link> to save your cart & access exclusive deals
          </div>
        )}

        <div className="cart-layout">

          {/* ── Left: Items ── */}
          <div className="cart-items-col">
            {items.map((item, idx) => (
              <div
                key={idx}
                className={`cart-item ${removingIdx === idx ? 'cart-item--removing' : ''}`}
              >
                {/* Image */}
                <div className="cart-item__img">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: 6 }}
                      onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                    />
                  ) : null}
                  <span style={{ fontSize: 36, display: item.image ? 'none' : 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                    {categoryEmoji(item.category)}
                  </span>
                </div>

                {/* Info */}
                <div className="cart-item__info">
                  <p className="cart-item__brand">{item.brand}</p>
                  <Link to={`/products/${item._id}`} className="cart-item__name">{item.name}</Link>
                  <div className="cart-item__variants">
                    {item.selectedColor   && <span className="cart-item__variant">{item.selectedColor}</span>}
                    {item.selectedStorage && <span className="cart-item__variant">{item.selectedStorage}</span>}
                  </div>
                  <div className="cart-item__controls">
                  <span className="cart-item__price-mobile">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
                </div>

                {/* Qty */}
                <div className="cart-item__qty-col">
                  <div className="qty-selector">
                    <button className="qty-btn" onClick={() => handleQty(idx, item.quantity - 1)} disabled={item.quantity <= 1}>−</button>
                    <span className="qty-value">{item.quantity}</span>
                    <button className="qty-btn" onClick={() => handleQty(idx, item.quantity + 1)} disabled={item.quantity >= 10}>+</button>
                  </div>
                </div>

                {/* Price */}
                <div className="cart-item__subtotal">
                  <span className="cart-item__price">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                  {item.quantity > 1 && (
                    <span className="cart-item__unit-price">₹{item.price.toLocaleString('en-IN')} each</span>
                  )}
                </div>

                {/* Remove */}
                <button
                  className="cart-item__remove"
                  onClick={() => handleRemove(idx)}
                  title="Remove"
                >🗑</button>
              </div>
            ))}

            {/* Continue shopping */}
            <div className="cart-continue">
              <Link to="/products" className="btn btn-outline">← Continue Shopping</Link>
            </div>
          </div>

          {/* ── Right: Summary ── */}
          <div className="cart-summary-col">
            <div className="cart-summary-card">
              <h3 className="cart-summary-title">Order Summary</h3>

              <div className="cart-summary-rows">
                <div className="cart-summary__row">
                <span>Subtotal</span>
                <span>₹{totals.subtotal.toLocaleString('en-IN')}</span>
              </div>

              {totals.discount > 0 && (
                <div className="cart-summary__row cart-summary__row--discount">
                  <span>Discount</span>
                  <span>−₹{totals.discount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="cart-summary__row">
                <span>Shipping</span>
                <span>
                  {(items.length > 0 && items.every(i => i.category === 'scam')) || totals.subtotal >= 2000 ? '🎉 Free' : `₹99`}
                </span>
              </div>

              {totals.tax > 0 ? (
                <div className="cart-summary__row">
                  <span>Tax (GST)</span>
                  <span>₹{Math.round(totals.tax).toLocaleString('en-IN')}</span>
                </div>
              ) : null}
            </div>

              <div className="cart-summary__divider" />

              <div className="cart-summary__row cart-summary__row--total">
                <span>Total</span>
                <span>₹{Math.round(totals.total).toLocaleString('en-IN')}</span>
              </div>

              {/* Coupon */}
              <div className="coupon-section">
                {coupon ? (
                  <div className="coupon-applied">
                    <span>🎉 Coupon <strong>{coupon}</strong> applied!</span>
                    <button onClick={() => dispatch(removeCoupon())} className="coupon-remove">Remove</button>
                  </div>
                ) : (
                  <>
                    <div className="coupon-input-row">
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Enter coupon code"
                        value={couponInput}
                        onChange={e => { setCouponInput(e.target.value.toUpperCase()); setCouponError(''); }}
                        onKeyDown={e => e.key === 'Enter' && handleApplyCoupon()}
                        style={{ height: 44, fontSize: 14 }}
                      />
                      <button
                        className="btn btn-outline-blue btn-sm"
                        onClick={handleApplyCoupon}
                        disabled={couponLoading || !couponInput.trim()}
                        style={{ height: 44, padding: '0 16px', whiteSpace: 'nowrap' }}
                      >
                        {couponLoading ? '…' : 'Apply'}
                      </button>
                    </div>
                    {couponError && <p className="form-error">{couponError}</p>}
                    {!isAuth
                      ? <p className="coupon-hint">
                          <span onClick={() => setLoginPrompt('coupon')} style={{ color: '#1a56db', cursor: 'pointer', textDecoration: 'underline' }}>Sign in</span> to use coupon codes
                        </p>
                      : <p className="coupon-hint">Try: SAVE10 or AISHIP</p>
                    }
                  </>
                )}
              </div>

              <button
                className="btn btn-primary btn-full btn-lg"
                onClick={handleCheckout}
                style={{ marginTop: 16 }}
              >
                Proceed to Checkout →
              </button>

              {!isAuth && (
                <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-tertiary)', marginTop: 8 }}>
                  You'll be asked to sign in before placing your order
                </p>
              )}

              {/* Trust */}
              <div className="cart-trust">
                <span>🔒 Secure checkout</span>
                <span>·</span>
                <span>🔄 30-day returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}