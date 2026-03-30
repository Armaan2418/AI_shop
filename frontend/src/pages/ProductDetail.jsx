import { useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../store/cartSlice';
import { selectIsAuth } from '../store/authSlice';
import { productService } from '../services/productService';
import './ProductDetail.css';

// ── Mock Data ─────────────────────────────────────────────────────────
const MOCK_PRODUCT = {
  _id: '1',
  name: 'iPhone 15 Pro Max',
  brand: 'Apple',
  category: 'phones',
  price: 1199,
  originalPrice: 1299,
  rating: 4.8,
  reviewCount: 2145,
  inStock: true,
  badge: 'AI Pick',
  description: 'The iPhone 15 Pro Max represents the pinnacle of smartphone engineering. Forged from aerospace-grade titanium, it is the lightest Pro Max ever made. The A17 Pro chip delivers a transformative leap in performance, enabling console-quality gaming and groundbreaking AI capabilities. The new 48MP camera system with 5x optical zoom lets you capture stunning detail from incredible distances.',
  colors: ['Natural Titanium', 'Blue Titanium', 'White Titanium', 'Black Titanium'],
  storage: ['256GB', '512GB', '1TB'],
  features: [
    { label: 'Processor',    value: 'A17 Pro chip, 6-core CPU' },
    { label: 'Camera',       value: '48MP main, 12MP ultrawide, 12MP telephoto' },
    { label: 'Zoom',         value: '5x Optical Zoom, up to 25x Digital' },
    { label: 'Display',      value: '6.7" Super Retina XDR, ProMotion 120Hz' },
    { label: 'Battery',      value: 'Up to 29 hours video playback' },
    { label: 'Connectivity', value: 'USB-C with USB 3 speeds, Wi-Fi 6E' },
    { label: 'Build',        value: 'Titanium frame, textured matte glass back' },
    { label: 'Action Button',value: 'Customizable hardware button' },
  ],
  images: [
    'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-7inch-bluetitanium?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1693009278',
    'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-7inch-naturaltitanium?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1693009278',
    'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-7inch-whitetitanium?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1693009278',
    'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-7inch-blacktitanium?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1693009278',
  ],
  reviews: [
    { id: 1, name: 'Arjun M.',  rating: 5, date: '2 weeks ago',  verified: true,  text: 'Best iPhone yet. The titanium build feels incredibly premium and the camera system is on another level. The 5x zoom is genuinely useful for everyday shots. Totally worth the upgrade.' },
    { id: 2, name: 'Sneha R.',  rating: 5, date: '1 month ago',  verified: true,  text: 'Switched from Android after years and I am never going back. Performance is silky smooth, the display is gorgeous, and the battery lasts all day.' },
    { id: 3, name: 'Kevin T.',  rating: 4, date: '3 weeks ago',  verified: true,  text: 'Great phone but the price is steep. Battery life is significantly better than my 14 Pro. The action button is a genuinely useful addition.' },
    { id: 4, name: 'Priya K.',  rating: 5, date: '5 days ago',   verified: false, text: 'The camera upgrades alone make this worth it. Portrait mode is stunning. USB-C is a welcome change.' },
  ],
};

const RELATED = [
  { _id: '3',  name: 'AirPods Pro 2nd Gen',  price: 249, originalPrice: 279, brand: 'Apple',   category: 'audio',     image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MQD83?wid=1144&hei=1144&fmt=jpeg&qlt=90&.v=1660803972361' },
  { _id: '11', name: 'Apple Watch Ultra 2',   price: 799, originalPrice: null, brand: 'Apple',  category: 'wearables', image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MQDY3ref_VW_34FR+watch-49-titanium-ultra2_VW_34FR_WF_CO+watch-face-49-alpine-ultra2_VW_34FR_WF_CO?wid=750&hei=712&trim=1&fmt=p-jpg&qlt=95&.v=1693498667882' },
  { _id: '6',  name: 'iPad Pro M4',           price: 999, originalPrice: null, brand: 'Apple',  category: 'phones',    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-pro-finish-select-gallery-202210-11inch?wid=5120&hei=2880&fmt=jpeg&qlt=90&.v=1664411207590' },
];

// ── Icons ─────────────────────────────────────────────────────────────
const Icon = ({ name, size = 18 }) => {
  const icons = {
    home:       <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    chevronRight:<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
    heart:      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
    heartFill:  <svg width={size} height={size} viewBox="0 0 24 24" fill="#dc2626" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
    share:      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>,
    cart:       <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>,
    zap:        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
    check:      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
    truck:      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
    refresh:    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>,
    shield:     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    headset:    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18v-6a9 9 0 0118 0v6"/><path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z"/></svg>,
    star:       <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
    starEmpty:  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
    minus:      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    plus:       <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    close:      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    verified:   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
    package:    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
    arrowRight: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
    tag:        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>,
    brain:      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 2A2.5 2.5 0 017 4.5v0A2.5 2.5 0 014.5 7H4a2 2 0 00-2 2v0a2 2 0 002 2h.5A2.5 2.5 0 017 13.5v0A2.5 2.5 0 019.5 16H10v2a2 2 0 002 2h0a2 2 0 002-2v-2h.5A2.5 2.5 0 0117 13.5v0a2.5 2.5 0 012.5-2.5H20a2 2 0 002-2v0a2 2 0 00-2-2h-.5A2.5 2.5 0 0117 4.5v0A2.5 2.5 0 0114.5 2H14a2 2 0 00-2 2v0a2 2 0 01-2-2H9.5z"/></svg>,
  };
  return icons[name] ?? null;
};

// ── Stars ─────────────────────────────────────────────────────────────
function Stars({ rating, size = 14, interactive = false, onSet, hovered = 0 }) {
  return (
    <span className="stars">
      {[1,2,3,4,5].map(s => {
        const filled = s <= (interactive ? (hovered || rating) : Math.round(rating));
        return (
          <span
            key={s}
            className={filled ? 'star-filled' : 'star-empty'}
            style={interactive ? { cursor: 'pointer' } : {}}
            onClick={interactive ? () => onSet(s) : undefined}
          >
            <Icon name={filled ? 'star' : 'starEmpty'} size={size} />
          </span>
        );
      })}
    </span>
  );
}

// ── Rating Bar ────────────────────────────────────────────────────────
function RatingBar({ label, pct }) {
  return (
    <div className="rating-bar">
      <span className="rating-bar__label">{label}</span>
      <div className="rating-bar__track">
        <div className="rating-bar__fill" style={{ width: `${pct}%` }} />
      </div>
      <span className="rating-bar__pct">{pct}%</span>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────
export default function ProductDetail() {
  const { id }    = useParams();
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const isAuth    = useSelector(selectIsAuth);

  const [product,         setProduct]         = useState(MOCK_PRODUCT);
  const [activeImg,       setActiveImg]       = useState(0);
  const [imgErrors,       setImgErrors]       = useState({});
  const [selectedColor,   setSelectedColor]   = useState(0);
  const [selectedStorage, setSelectedStorage] = useState(0);
  const [qty,             setQty]             = useState(1);
  const [activeTab,       setActiveTab]       = useState('description');
  const [wished,          setWished]          = useState(false);
  const [added,           setAdded]           = useState(false);
  const [toast,           setToast]           = useState(null);
  const [reviewText,      setReviewText]      = useState('');
  const [reviewRating,    setReviewRating]    = useState(5);
  const [hoverStar]                   = useState(0); // Restored for star hover functionality
  const [zoom,            setZoom]            = useState(false);

  const reviewsRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await productService.getById(id);
        if (data?.product) setProduct(data.product);
      } catch { /* ignore */ }
    };
    load();
    window.scrollTo(0, 0);
  }, [id]);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  const handleAddToCart = () => {
    if (!product.inStock) return;
    dispatch(addToCart({
      ...product,
      selectedColor:   product.colors?.[selectedColor] ?? null,
      selectedStorage: product.storage?.[selectedStorage] ?? null,
      quantity: qty,
    }));
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
    showToast(`${product.name} added to cart`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    setTimeout(() => navigate(isAuth ? '/cart' : '/login'), 300);
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewText.trim()) return;
    showToast('Review submitted — thank you!');
    setReviewText('');
    setReviewRating(5);
  };

  const categoryIcon = {
    phones: 'phone', laptops: 'laptop', audio: 'headphones',
    wearables: 'watch', gaming: 'gaming', accessories: 'plug',
  }[product.category] ?? 'package';

  const TRUST_ITEMS = [
    { icon: 'truck',   text: 'Free shipping over ₹2,000' },
    { icon: 'refresh', text: '30-day easy returns' },
    { icon: 'shield',  text: 'Secure checkout' },
    { icon: 'headset', text: '24/7 AI support' },
  ];

  const ratingDist = [
    { label: '5 stars', pct: 68 },
    { label: '4 stars', pct: 20 },
    { label: '3 stars', pct: 8 },
    { label: '2 stars', pct: 3 },
    { label: '1 star',  pct: 1 },
  ];

  return (
    <div className="pdp">
      {/* Toast */}
      {toast && (
        <div className="toast-container">
          <div className="toast">
            <span className="toast__icon"><Icon name="check" size={13} /></span>
            <span className="toast__msg">{toast.msg}</span>
            <button className="toast__close" onClick={() => setToast(null)}>
              <Icon name="close" size={13} />
            </button>
          </div>
        </div>
      )}

      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link to="/" className="breadcrumb__item"><Icon name="home" size={14} /> Home</Link>
          <span className="breadcrumb__sep"><Icon name="chevronRight" size={13} /></span>
          <Link to="/products" className="breadcrumb__item">Products</Link>
          <span className="breadcrumb__sep"><Icon name="chevronRight" size={13} /></span>
          <Link to={`/products?category=${product.category}`} className="breadcrumb__item">
            {product.category?.charAt(0).toUpperCase() + product.category?.slice(1)}
          </Link>
          <span className="breadcrumb__sep"><Icon name="chevronRight" size={13} /></span>
          <span className="breadcrumb__item breadcrumb__item--active">{product.name}</span>
        </nav>

        {/* ── Main Grid ── */}
        <div className="pdp__grid">

          {/* ── Image Column ── */}
          <div className="pdp__image-col">
            {/* Main image */}
            <div className={`pdp__main-img ${zoom ? 'pdp__main-img--zoom' : ''}`} onClick={() => setZoom(z => !z)}>
              {!imgErrors[activeImg] && product.images?.[activeImg] ? (
                <img
                  src={product.images[activeImg]}
                  alt={product.name}
                  className="pdp__img"
                  onError={() => setImgErrors(e => ({ ...e, [activeImg]: true }))}
                />
              ) : (
                <div className="pdp__img-fallback">
                  <Icon name={categoryIcon} size={80} />
                </div>
              )}

              {discount && (
                <span className="pdp__img-badge pdp__img-badge--sale">-{discount}%</span>
              )}
              {product.badge === 'AI Pick' && (
                <span className="pdp__img-badge pdp__img-badge--ai">
                  <Icon name="brain" size={11} /> AI Pick
                </span>
              )}
              <div className="pdp__img-zoom-hint">
                {zoom ? 'Click to zoom out' : 'Click to zoom in'}
              </div>
            </div>

            {/* Thumbnails */}
            <div className="pdp__thumbs">
              {(product.images ?? [null, null, null, null]).map((img, i) => (
                <button
                  key={i}
                  className={`pdp__thumb ${activeImg === i ? 'pdp__thumb--active' : ''}`}
                  onClick={() => setActiveImg(i)}
                >
                  {img && !imgErrors[i] ? (
                    <img
                      src={img}
                      alt={`View ${i + 1}`}
                      onError={() => setImgErrors(e => ({ ...e, [i]: true }))}
                    />
                  ) : (
                    <span className="pdp__thumb-fallback">
                      <Icon name={categoryIcon} size={20} />
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Action buttons under image */}
            <div className="pdp__img-actions">
              <button
                className={`pdp__action-btn ${wished ? 'pdp__action-btn--wished' : ''}`}
                onClick={() => setWished(w => !w)}
              >
                <Icon name={wished ? 'heartFill' : 'heart'} size={16} />
                {wished ? 'Saved' : 'Save'}
              </button>
              <button className="pdp__action-btn" onClick={() => navigator.share?.({ title: product.name, url: window.location.href })}>
                <Icon name="share" size={16} />
                Share
              </button>
            </div>
          </div>

          {/* ── Info Column ── */}
          <div className="pdp__info-col">
            {/* Brand + status */}
            <div className="pdp__meta-row">
              <span className="pdp__brand">{product.brand}</span>
              <span className={`pdp__stock-badge ${product.inStock ? 'pdp__stock-badge--in' : 'pdp__stock-badge--out'}`}>
                <Icon name={product.inStock ? 'check' : 'close'} size={12} />
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>

            <h1 className="pdp__name">{product.name}</h1>

            {/* Rating row */}
            <div className="pdp__rating-row">
              <Stars rating={product.rating} size={15} />
              <span className="pdp__rating-val">{product.rating}</span>
              <span className="pdp__rating-cnt">({product.reviewCount?.toLocaleString()} reviews)</span>
              <button
                className="pdp__rating-link"
                onClick={() => {
                  setActiveTab('reviews');
                  reviewsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
              >
                Read reviews
              </button>
            </div>

            {/* Price block */}
            <div className="pdp__price-block">
              <div className="pdp__price-row">
                <span className="pdp__price">₹{product.price?.toLocaleString('en-IN')}</span>
                {product.originalPrice && (
                  <span className="pdp__price-original">₹{product.originalPrice?.toLocaleString('en-IN')}</span>
                )}
              </div>
              {product.originalPrice && (
                <div className="pdp__save-row">
                  <span className="pdp__save-badge">
                    <Icon name="tag" size={12} />
                    You save ₹{(product.originalPrice - product.price).toLocaleString('en-IN')} ({discount}% off)
                  </span>
                </div>
              )}
            </div>

            <div className="pdp__divider" />

            {/* Color picker */}
            {product.colors?.length > 0 && (
              <div className="pdp__option-group">
                <div className="pdp__option-label">
                  Color <span className="pdp__option-value">{product.colors[selectedColor]}</span>
                </div>
                <div className="pdp__color-options">
                  {product.colors.map((color, i) => (
                    <button
                      key={color}
                      className={`pdp__color-btn ${selectedColor === i ? 'pdp__color-btn--active' : ''}`}
                      onClick={() => setSelectedColor(i)}
                      title={color}
                    >
                      {color.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Storage picker */}
            {product.storage?.length > 0 && (
              <div className="pdp__option-group">
                <div className="pdp__option-label">
                  Storage <span className="pdp__option-value">{product.storage[selectedStorage]}</span>
                </div>
                <div className="pdp__storage-options">
                  {product.storage.map((s, i) => (
                    <button
                      key={s}
                      className={`pdp__storage-btn ${selectedStorage === i ? 'pdp__storage-btn--active' : ''}`}
                      onClick={() => setSelectedStorage(i)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="pdp__option-group">
              <div className="pdp__option-label">Quantity</div>
              <div className="pdp__qty">
                <button className="pdp__qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))} disabled={qty <= 1}>
                  <Icon name="minus" size={14} />
                </button>
                <span className="pdp__qty-val">{qty}</span>
                <button className="pdp__qty-btn" onClick={() => setQty(q => Math.min(10, q + 1))} disabled={qty >= 10}>
                  <Icon name="plus" size={14} />
                </button>
                <span className="pdp__qty-hint">Max 10 per order</span>
              </div>
            </div>

            {/* CTA */}
            <div className="pdp__cta">
              <button
                className={`pdp__btn pdp__btn--primary ${added ? 'pdp__btn--added' : ''}`}
                onClick={handleAddToCart}
                disabled={!product.inStock}
              >
                {added
                  ? <><Icon name="check" size={16} /> Added to Cart</>
                  : !product.inStock
                  ? 'Out of Stock'
                  : <><Icon name="cart" size={16} /> Add to Cart</>}
              </button>
              <button
                className="pdp__btn pdp__btn--secondary"
                onClick={handleBuyNow}
                disabled={!product.inStock}
              >
                <Icon name="zap" size={16} /> Buy Now
              </button>
            </div>

            {/* Trust grid */}
            <div className="pdp__trust">
              {TRUST_ITEMS.map(t => (
                <div key={t.text} className="pdp__trust-item">
                  <div className="pdp__trust-icon"><Icon name={t.icon} size={16} /></div>
                  <span>{t.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="pdp__tabs-section" ref={reviewsRef}>
          <div className="pdp__tabs">
            {[
              { key: 'description', label: 'Description' },
              { key: 'features',    label: 'Specifications' },
              { key: 'reviews',     label: `Reviews (${product.reviews?.length ?? 0})` },
            ].map(tab => (
              <button
                key={tab.key}
                className={`pdp__tab ${activeTab === tab.key ? 'pdp__tab--active' : ''}`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Description */}
          {activeTab === 'description' && (
            <div className="pdp__tab-panel">
              <div className="pdp__description">
                <p className="pdp__description-text">{product.description}</p>
                <div className="pdp__description-highlights">
                  {product.features?.slice(0, 4).map(f => (
                    <div key={f.label} className="pdp__highlight">
                      <div className="pdp__highlight-icon"><Icon name="check" size={14} /></div>
                      <div>
                        <div className="pdp__highlight-label">{f.label}</div>
                        <div className="pdp__highlight-val">{f.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Specifications */}
          {activeTab === 'features' && (
            <div className="pdp__tab-panel">
              <div className="pdp__specs">
                <h3 className="pdp__specs-title">Technical Specifications</h3>
                <div className="pdp__specs-table">
                  {product.features?.map((f, i) => (
                    <div key={f.label} className={`pdp__spec-row ${i % 2 === 0 ? 'pdp__spec-row--alt' : ''}`}>
                      <div className="pdp__spec-key">{f.label}</div>
                      <div className="pdp__spec-val">{f.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Reviews */}
          {activeTab === 'reviews' && (
            <div className="pdp__tab-panel">
              <div className="pdp__reviews">

                {/* Summary */}
                <div className="pdp__reviews-summary">
                  <div className="pdp__reviews-score">
                    <div className="pdp__score-num">{product.rating}</div>
                    <Stars rating={product.rating} size={20} />
                    <div className="pdp__score-label">
                      Based on {product.reviewCount?.toLocaleString()} reviews
                    </div>
                  </div>
                  <div className="pdp__reviews-dist">
                    {ratingDist.map(r => (
                      <RatingBar key={r.label} label={r.label} pct={r.pct} />
                    ))}
                  </div>
                </div>

                {/* Review cards */}
                <div className="pdp__reviews-list">
                  {product.reviews?.map(r => (
                    <div key={r.id} className="pdp__review">
                      <div className="pdp__review-header">
                        <div className="pdp__review-avatar">{r.name[0]}</div>
                        <div className="pdp__review-meta">
                          <div className="pdp__review-name-row">
                            <span className="pdp__review-name">{r.name}</span>
                            {r.verified && (
                              <span className="pdp__review-verified">
                                <Icon name="verified" size={12} /> Verified Purchase
                              </span>
                            )}
                          </div>
                          <div className="pdp__review-date">{r.date}</div>
                        </div>
                        <Stars rating={r.rating} size={13} />
                      </div>
                      <p className="pdp__review-text">{r.text}</p>
                    </div>
                  ))}
                </div>

                {/* Write review */}
                {isAuth ? (
                  <div className="pdp__write-review">
                    <h4 className="pdp__write-title">Write a Review</h4>
                    <p className="pdp__write-sub">Share your experience to help other shoppers</p>
                    <div className="pdp__write-stars">
                      <span className="pdp__write-stars-label">Your rating:</span>
                      <Stars
                        rating={reviewRating}
                        size={24}
                        interactive
                        hovered={hoverStar}
                        onSet={setReviewRating}
                      />
                    </div>
                    <form className="pdp__write-form" onSubmit={handleReviewSubmit}>
                      <textarea
                        className="pdp__write-textarea"
                        placeholder="Share your experience with this product — what do you love, what could be better?"
                        value={reviewText}
                        onChange={e => setReviewText(e.target.value)}
                        rows={4}
                      />
                      <button type="submit" className="pdp__btn pdp__btn--primary" style={{ width: 'auto', padding: '0 28px' }}>
                        Submit Review
                      </button>
                    </form>
                  </div>
                ) : (
                  <div className="pdp__review-login">
                    <p>Sign in to leave a review</p>
                    <Link to="/login" className="pdp__btn pdp__btn--secondary" style={{ width: 'auto', padding: '0 24px', textDecoration: 'none' }}>
                      Sign In
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ── Related Products ── */}
        <div className="pdp__related">
          <div className="pdp__related-header">
            <h3 className="pdp__related-title">You Might Also Like</h3>
            <Link to="/products" className="pdp__related-link">
              View All <Icon name="arrowRight" size={14} />
            </Link>
          </div>
          <div className="pdp__related-grid">
            {RELATED.map(r => {
              const relDiscount = r.originalPrice
                ? Math.round((1 - r.price / r.originalPrice) * 100)
                : null;
              return (
                <Link key={r._id} to={`/products/${r._id}`} className="pdp__related-card">
                  <div className="pdp__related-img">
                    <img
                      src={r.image}
                      alt={r.name}
                      onError={e => { e.target.style.display = 'none'; }}
                    />
                    {relDiscount && (
                      <span className="pdp__related-badge">-{relDiscount}%</span>
                    )}
                  </div>
                  <div className="pdp__related-info">
                    <p className="pdp__related-brand">{r.brand}</p>
                    <p className="pdp__related-name">{r.name}</p>
                    <div className="pdp__related-price-row">
                      <span className="pdp__related-price">₹{r.price.toLocaleString('en-IN')}</span>
                      {r.originalPrice && (
                        <span className="pdp__related-original">₹{r.originalPrice.toLocaleString('en-IN')}</span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}