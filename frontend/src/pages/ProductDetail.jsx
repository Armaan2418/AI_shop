import { useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../store/cartSlice';
import { selectIsAuth } from '../store/authSlice';
import { productService } from '../services/productService';
import { MOCK_PRODUCTS, getProductSpecs, getProductDescription, COMPARISON_MAP } from '../data/products';
import './ProductDetail.css';

// Generic reviews per category
const GENERIC_REVIEWS = {
  phones:      [
    { id: 1, name: 'Rahul S.',  rating: 5, date: '1 week ago',  verified: true,  text: 'Absolutely love this device! The performance is top-notch and the camera quality blew me away. Great value for the price.' },
    { id: 2, name: 'Priya M.',  rating: 4, date: '2 weeks ago', verified: true,  text: 'Really solid buy. Build quality is premium and the battery easily lasts a full day. Delivery was fast too.' },
    { id: 3, name: 'Ankit R.',  rating: 5, date: '3 weeks ago', verified: false, text: 'Exceeded my expectations. The display is gorgeous and it handles gaming without any lag.' },
  ],
  laptops:     [
    { id: 1, name: 'Arjun T.',  rating: 5, date: '5 days ago',  verified: true,  text: 'This laptop transformed my workflow. Blazing fast, runs cool and quiet. Best purchase I\'ve made this year.' },
    { id: 2, name: 'Sanya K.',  rating: 4, date: '2 weeks ago', verified: true,  text: 'Very well built, keyboard is great and the trackpad is precise. Battery life is impressive.' },
    { id: 3, name: 'Dev P.',    rating: 5, date: '1 month ago', verified: true,  text: 'Worth every rupee. Handles design work, video editing and gaming without breaking a sweat.' },
  ],
  audio:       [
    { id: 1, name: 'Neha G.',   rating: 5, date: '1 week ago',  verified: true,  text: 'The noise cancellation is outstanding. Wearing these makes the office disappear completely.' },
    { id: 2, name: 'Karan B.',  rating: 5, date: '2 weeks ago', verified: true,  text: 'Rich, warm sound. Comfortable even after hours of use. Best audio I\'ve heard at this price.' },
    { id: 3, name: 'Riya V.',   rating: 4, date: '1 month ago', verified: false, text: 'Great bass and clarity. The build feels very premium. App works well too.' },
  ],
  wearables:   [
    { id: 1, name: 'Meera S.',  rating: 5, date: '3 days ago',  verified: true,  text: 'Tracks everything accurately and the health insights are genuinely useful. Love the always-on display.' },
    { id: 2, name: 'Vijay N.',  rating: 4, date: '1 week ago',  verified: true,  text: 'Great smartwatch — battery life is solid and it pairs seamlessly with my phone.' },
    { id: 3, name: 'Amit C.',   rating: 5, date: '3 weeks ago', verified: true,  text: 'Switched from a fitness band and couldn\'t be happier. The extra features are well worth it.' },
  ],
  gaming:      [
    { id: 1, name: 'Yash M.',   rating: 5, date: '4 days ago',  verified: true,  text: 'Feels incredible in the hands. Response time is lightning-quick. My sessions have never been this immersive.' },
    { id: 2, name: 'Aditya K.', rating: 5, date: '2 weeks ago', verified: true,  text: 'Build quality is premium and the wireless connection is rock-solid. Zero lag.' },
    { id: 3, name: 'Siddharth', rating: 4, date: '1 month ago', verified: false, text: 'Really comfortable for long sessions. Would highly recommend to any serious gamer.' },
  ],
  accessories: [
    { id: 1, name: 'Pooja L.',  rating: 5, date: '1 week ago',  verified: true,  text: 'Exactly what I needed. Premium build, works perfectly and looks great on my desk.' },
    { id: 2, name: 'Rohit D.',  rating: 4, date: '2 weeks ago', verified: true,  text: 'Does the job beautifully. Setup was straightforward and performance is reliable.' },
    { id: 3, name: 'Kavya P.',  rating: 5, date: '1 month ago', verified: true,  text: 'Excellent quality. Noticed a real difference immediately. Highly recommended.' },
  ],
  clothing:    [
    { id: 1, name: 'Ishaan T.', rating: 5, date: '2 days ago',  verified: true,  text: 'Fits perfectly! The fabric feels soft and the colour looks exactly like the photo. Great quality.' },
    { id: 2, name: 'Diya M.',   rating: 4, date: '1 week ago',  verified: true,  text: 'Very comfortable and well-made. Gets lots of compliments. Will definitely buy again.' },
    { id: 3, name: 'Rohan S.',  rating: 5, date: '3 weeks ago', verified: false, text: 'Great value. Washed it twice and it held its shape and colour perfectly.' },
  ],
  fashion:     [
    { id: 1, name: 'Aditi R.',  rating: 5, date: '3 days ago',  verified: true,  text: 'Absolutely stunning! The quality is superb and it elevates every outfit I pair it with.' },
    { id: 2, name: 'Preet K.',  rating: 5, date: '1 week ago',  verified: true,  text: 'A genuine luxury feel. The craftsmanship is excellent and it arrived in perfect condition.' },
    { id: 3, name: 'Tanya V.',  rating: 4, date: '2 weeks ago', verified: true,  text: 'Beautiful product. Looks even better in person. Packaging was elegant too.' },
  ],
  makeup:      [
    { id: 1, name: 'Simran N.', rating: 5, date: '5 days ago',  verified: true,  text: 'Lasts all day! The formula is smooth and the pigment pay-off is incredible. My new holy grail.' },
    { id: 2, name: 'Aanya P.',  rating: 5, date: '2 weeks ago', verified: true,  text: 'Amazing product. Goes on like a dream. My skin has never looked better.' },
    { id: 3, name: 'Riya C.',   rating: 4, date: '1 month ago', verified: false, text: 'Great quality. The shade range is impressive and it feels comfortable to wear all day.' },
  ],
};

// Per-category variant data
const CATEGORY_VARIANTS = {
  phones:      { colors: ['Midnight Black', 'Glacier White', 'Ocean Blue', 'Forest Green'], storage: ['128 GB', '256 GB', '512 GB', '1 TB'] },
  laptops:     { colors: ['Space Grey', 'Silver', 'Midnight'], storage: ['256 GB SSD', '512 GB SSD', '1 TB SSD'] },
  audio:       { colors: ['Black', 'White', 'Midnight Blue'], storage: null },
  wearables:   { colors: ['Midnight', 'Starlight', 'Graphite', 'Coral'], storage: null },
  gaming:      { colors: ['Black', 'White', 'Red'], storage: null },
  clothing:    { colors: ['White', 'Black', 'Navy Blue', 'Olive Green', 'Charcoal'], storage: null },
  fashion:     { colors: ['Black', 'Brown', 'Tan', 'Burgundy'], storage: null },
  makeup:      { colors: ['Shade 01', 'Shade 02', 'Shade 03', 'Shade 04'], storage: null },
  accessories: { colors: ['Black', 'Silver', 'White'], storage: null },
};

// Per-color alternate images — visually different photos for each color variant
const COLOR_IMAGE_POOL = {
  phones: [
    'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&q=80',
    'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500&q=80',
    'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=500&q=80',
    'https://images.unsplash.com/photo-1580910051074-3eb694886f8b?w=500&q=80',
  ],
  laptops: [
    'https://images.unsplash.com/photo-1611186871525-b9e8b073b50a?w=500&q=80',
    'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500&q=80',
    'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=500&q=80',
  ],
  audio: [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
    'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&q=80',
    'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500&q=80',
  ],
  wearables: [
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80',
    'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=500&q=80',
    'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&q=80',
    'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&q=80',
  ],
  gaming: [
    'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500&q=80',
    'https://images.unsplash.com/photo-1607853202273-232359dbb5b0?w=500&q=80',
    'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=500&q=80',
  ],
  clothing: [
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80',
    'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=500&q=80',
    'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&q=80',
    'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500&q=80',
    'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=500&q=80',
  ],
  fashion: [
    'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&q=80',
    'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500&q=80',
    'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=500&q=80',
    'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=500&q=80',
  ],
  makeup: [
    'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&q=80',
    'https://images.unsplash.com/photo-1631214499178-338dc7a3e0cb?w=500&q=80',
    'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500&q=80',
    'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=500&q=80',
  ],
  accessories: [
    'https://images.unsplash.com/photo-1527443224154-c4a573d5f6b4?w=500&q=80',
    'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&q=80',
    'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500&q=80',
  ],
};

function buildProductData(rawProduct) {
  const cat      = rawProduct.category ?? 'accessories';
  const variants = CATEGORY_VARIANTS[cat] ?? CATEGORY_VARIANTS.accessories;
  const pool     = COLOR_IMAGE_POOL[cat] ?? COLOR_IMAGE_POOL.accessories;
  // Build a map: colorIndex -> [4 images].
  // First color uses the product's own image as hero; other colors use pool images.
  const colorImages = {};
  (variants.colors ?? []).forEach((color, i) => {
    if (i === 0) {
      // First color = product's real image + pool extras
      colorImages[i] = [
        rawProduct.image,
        pool[0],
        pool[1 % pool.length],
        pool[2 % pool.length],
      ];
    } else {
      // Other colors = pool image as hero + product image as fallback
      colorImages[i] = [
        pool[i % pool.length],
        pool[(i + 1) % pool.length],
        rawProduct.image,
        pool[(i + 2) % pool.length],
      ];
    }
  });
  return {
    ...rawProduct,
    description: getProductDescription(rawProduct),
    features:    getProductSpecs(rawProduct),
    images:      colorImages[0] ?? [rawProduct.image, rawProduct.image, rawProduct.image, rawProduct.image],
    colorImages,
    reviews:     GENERIC_REVIEWS[cat] ?? GENERIC_REVIEWS.accessories,
    colors:      variants.colors,
    storage:     variants.storage,
  };
}

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

  // Find product from shared data, fallback to first product
  const rawDefault = MOCK_PRODUCTS.find(p => p._id === id) ?? MOCK_PRODUCTS[0];
  const [product,         setProduct]         = useState(() => buildProductData(rawDefault));
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
  const [hoverStar]                   = useState(0);
  const [zoom,            setZoom]            = useState(false);

  const reviewsRef = useRef(null);

  useEffect(() => {
    // Update product when route id changes
    const rawProduct = MOCK_PRODUCTS.find(p => p._id === id);
    if (rawProduct) {
      setProduct(buildProductData(rawProduct));
    }
    const load = async () => {
      try {
        const data = await productService.getById(id);
        if (data?.product) setProduct(data.product);
      } catch { /* ignore */ }
    };
    load();
    window.scrollTo(0, 0);
    setActiveImg(0);
    setImgErrors({});
    setSelectedColor(0);
    setSelectedStorage(0);
    setQty(1);
  }, [id]);

  // Related = other products in same category (up to 3, excluding current)
  const RELATED = MOCK_PRODUCTS
    .filter(p => p.category === product.category && p._id !== id)
    .slice(0, 3);

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
                  {product.category === 'makeup' ? 'Shade' :
                   (product.category === 'clothing' || product.category === 'fashion') ? 'Colour' : 'Colour'}{' '}
                  <span className="pdp__option-value">{product.colors[selectedColor]}</span>
                </div>
                <div className="pdp__color-options">
                  {product.colors.map((color, i) => (
                    <button
                      key={color}
                      className={`pdp__color-btn ${selectedColor === i ? 'pdp__color-btn--active' : ''}`}
                      onClick={() => {
                        setSelectedColor(i);
                        setActiveImg(0);
                        if (product.colorImages?.[i]) {
                          setProduct(prev => ({ ...prev, images: prev.colorImages[i] }));
                        }
                      }}
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
                  {product.category === 'clothing' ? 'Size' :
                   product.category === 'laptops' || product.category === 'phones' ? 'Storage' : 'Variant'}{' '}
                  <span className="pdp__option-value">{product.storage[selectedStorage]}</span>
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

        {/* ── Compare Similar Products ── */}
        {(() => {
          const compIds = COMPARISON_MAP[id];
          if (!compIds) return null;
          const compProducts = compIds
            .map(cid => MOCK_PRODUCTS.find(p => p._id === cid))
            .filter(Boolean);
          if (compProducts.length < 2) return null;
          const currentIdx = compProducts.findIndex(p => p._id === id);
          return (
            <div className="pdp__compare">
              <h3 className="pdp__compare-title">
                <Icon name="package" size={20} /> Compare Similar Products
              </h3>
              <div className="pdp__compare-table-wrap">
                <table className="pdp__compare-table">
                  <thead>
                    <tr>
                      <th className="pdp__compare-label-col"></th>
                      {compProducts.map((cp, i) => (
                        <th key={cp._id} className={`pdp__compare-product-col ${i === currentIdx ? 'pdp__compare-product-col--current' : ''}`}>
                          {i === currentIdx && <span className="pdp__compare-current-badge">Current</span>}
                          <div className="pdp__compare-img-wrap">
                            <img src={cp.image} alt={cp.name} className="pdp__compare-img" onError={e => { e.target.style.display = 'none'; }} />
                          </div>
                          <Link to={`/products/${cp._id}`} className="pdp__compare-name">{cp.name}</Link>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="pdp__compare-label">Brand</td>
                      {compProducts.map(cp => <td key={cp._id}>{cp.brand}</td>)}
                    </tr>
                    <tr>
                      <td className="pdp__compare-label">Price</td>
                      {compProducts.map(cp => <td key={cp._id} className="pdp__compare-price">₹{cp.price.toLocaleString('en-IN')}</td>)}
                    </tr>
                    <tr>
                      <td className="pdp__compare-label">Rating</td>
                      {compProducts.map(cp => (
                        <td key={cp._id}>
                          <span className="pdp__compare-rating">
                            <Stars rating={cp.rating} size={12} /> {cp.rating}
                          </span>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="pdp__compare-label">Reviews</td>
                      {compProducts.map(cp => <td key={cp._id}>{cp.reviewCount?.toLocaleString()}</td>)}
                    </tr>
                    <tr>
                      <td className="pdp__compare-label">In Stock</td>
                      {compProducts.map(cp => (
                        <td key={cp._id}>
                          <span className={cp.inStock ? 'pdp__compare-yes' : 'pdp__compare-no'}>
                            {cp.inStock ? '✓ Yes' : '✗ No'}
                          </span>
                        </td>
                      ))}
                    </tr>
                    {compProducts[0]?.originalPrice != null && (
                      <tr>
                        <td className="pdp__compare-label">Original Price</td>
                        {compProducts.map(cp => (
                          <td key={cp._id}>{cp.originalPrice ? `₹${cp.originalPrice.toLocaleString('en-IN')}` : '—'}</td>
                        ))}
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })()}

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