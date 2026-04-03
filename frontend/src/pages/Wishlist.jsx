import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectWishlistItems, removeFromWishlist, clearWishlist } from '../store/wishlistSlice';
import { addToCart } from '../store/cartSlice';
import './Wishlist.css';

// ── Icons ──────────────────────────────────────────────────────────────────
const Icon = ({ name, size = 18 }) => {
  const icons = {
    heart: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
    heartFill: <svg width={size} height={size} viewBox="0 0 24 24" fill="#ef4444" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
    cart: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>,
    trash: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>,
    check: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
    close: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    arrowRight: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
    star: <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
    package: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
    tag: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>,
  };
  return icons[name] ?? null;
};

// ── Heart Burst Button ─────────────────────────────────────────────────────
function HeartBurstBtn({ onClick }) {
  const [burst, setBurst] = useState(false);
  const handle = () => {
    setBurst(true);
    setTimeout(() => setBurst(false), 600);
    onClick();
  };
  return (
    <button className={`wcard__remove-btn ${burst ? 'wcard__remove-btn--burst' : ''}`} onClick={handle} aria-label="Remove from wishlist">
      <Icon name="trash" size={15} />
      {burst && (
        <span className="heart-particles" aria-hidden="true">
          {[...Array(6)].map((_, i) => <span key={i} className={`heart-particle heart-particle--${i}`}>♥</span>)}
        </span>
      )}
    </button>
  );
}

// ── Wishlist Card ──────────────────────────────────────────────────────────
function WishlistCard({ item, removing, onMoveToCart, onRemove }) {
  const [imgError, setImgError]   = useState(false);
  const [movedToCart, setMovedToCart] = useState(false);

  const discount = item.originalPrice
    ? Math.round((1 - item.price / item.originalPrice) * 100)
    : null;

  const handleMove = () => {
    setMovedToCart(true);
    setTimeout(() => onMoveToCart(), 400);
  };

  const catIconMap = {
    phones: 'package', laptops: 'package', audio: 'package',
    wearables: 'package', gaming: 'package', accessories: 'package',
    clothing: 'package', fashion: 'package', makeup: 'package',
  };

  return (
    <div className={`wcard ${removing ? 'wcard--removing' : ''} ${movedToCart ? 'wcard--moved' : ''}`}>
      <Link to={`/products/${item._id}`} className="wcard__img-wrap">
        {!imgError ? (
          <img src={item.image} alt={item.name} className="wcard__img" onError={() => setImgError(true)} />
        ) : (
          <div className="wcard__img-fallback"><Icon name={catIconMap[item.category] ?? 'package'} size={48} /></div>
        )}
        {discount && <span className="wcard__badge">-{discount}%</span>}
        {item.badge === 'AI Pick' && <span className="wcard__badge wcard__badge--ai">AI Pick</span>}
      </Link>

      <div className="wcard__body">
        <p className="wcard__brand">{item.brand}</p>
        <Link to={`/products/${item._id}`} className="wcard__name">{item.name}</Link>

        <div className="wcard__rating">
          {[1,2,3,4,5].map(s => (
            <span key={s} style={{ color: s <= Math.round(item.rating) ? '#f59e0b' : '#374151', fontSize: '11px' }}>★</span>
          ))}
          <span className="wcard__rating-val">{item.rating}</span>
        </div>

        <div className="wcard__price-row">
          <span className="wcard__price">₹{item.price.toLocaleString('en-IN')}</span>
          {item.originalPrice && <span className="wcard__original">₹{item.originalPrice.toLocaleString('en-IN')}</span>}
        </div>

        {discount && (
          <div className="wcard__save">
            <Icon name="tag" size={11} /> You save ₹{(item.originalPrice - item.price).toLocaleString('en-IN')} ({discount}% off)
          </div>
        )}

        <div className="wcard__actions">
          <button className={`wcard__cart-btn ${movedToCart ? 'wcard__cart-btn--moved' : ''}`} onClick={handleMove} disabled={!item.inStock}>
            {movedToCart ? <><Icon name="check" size={14} /> Moved!</> : <><Icon name="cart" size={14} /> Move to Cart</>}
          </button>
          <HeartBurstBtn onClick={onRemove} />
        </div>
      </div>
    </div>
  );
}

// ── Toast ──────────────────────────────────────────────────────────────────
function Toast({ msg, onClose }) {
  return (
    <div className="toast-container">
      <div className="toast">
        <span className="toast__icon"><Icon name="check" size={14} /></span>
        <span className="toast__msg">{msg}</span>
        <button className="toast__close" onClick={onClose}><Icon name="close" size={13} /></button>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function Wishlist() {
  const dispatch    = useDispatch();
  const items       = useSelector(selectWishlistItems);
  const [toast, setToast]       = useState(null);
  const [removingId, setRemovingId] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  };

  const handleMoveToCart = (item) => {
    dispatch(addToCart({ ...item, selectedColor: null, selectedStorage: null }));
    dispatch(removeFromWishlist(item._id));
    showToast(`${item.name} moved to cart!`);
  };

  const handleRemove = (id) => {
    setRemovingId(id);
    setTimeout(() => {
      dispatch(removeFromWishlist(id));
      setRemovingId(null);
    }, 380);
  };

  const handleMoveAll = () => {
    items.forEach(item => {
      dispatch(addToCart({ ...item, selectedColor: null, selectedStorage: null }));
    });
    dispatch(clearWishlist());
    showToast(`All ${items.length} items moved to cart!`);
  };

  // ── Empty State ──────────────────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <div className="wishlist-page">
        {toast && <Toast msg={toast.msg ?? toast} onClose={() => setToast(null)} />}
        <div className="container">
          <div className="wishlist-empty">
            <div className="wishlist-empty__icon">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="url(#wl-grad)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                <defs>
                  <linearGradient id="wl-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6366f1"/>
                    <stop offset="100%" stopColor="#ec4899"/>
                  </linearGradient>
                </defs>
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
              </svg>
            </div>
            <h1 className="wishlist-empty__title">Your wishlist is empty</h1>
            <p className="wishlist-empty__sub">
              Save your favourite products by clicking the <span className="wishlist-empty__heart">♥</span> heart button on any product.
            </p>
            <Link to="/products" className="wishlist-empty__btn">
              Browse Products <Icon name="arrowRight" size={16} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      {toast && <Toast msg={toast.msg ?? toast} onClose={() => setToast(null)} />}

      <div className="container">
        {/* Header */}
        <div className="wishlist-header">
          <div className="wishlist-header__left">
            <h1 className="wishlist-title">
              <Icon name="heartFill" size={28} /> Your Wishlist
            </h1>
            <p className="wishlist-subtitle">
              {items.length} saved item{items.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="wishlist-header__right">
            <button className="wishlist-move-all-btn" onClick={handleMoveAll}>
              <Icon name="cart" size={15} /> Move All to Cart
            </button>
            <button className="wishlist-clear-btn" onClick={() => dispatch(clearWishlist())}>
              <Icon name="trash" size={14} /> Clear All
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="wishlist-grid">
          {items.map(item => (
            <WishlistCard
              key={item._id}
              item={item}
              removing={removingId === item._id}
              onMoveToCart={() => handleMoveToCart(item)}
              onRemove={() => handleRemove(item._id)}
            />
          ))}
        </div>

        {/* Footer CTA */}
        <div className="wishlist-footer">
          <Link to="/products" className="wishlist-footer__link">
            <Icon name="arrowRight" size={14} /> Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
