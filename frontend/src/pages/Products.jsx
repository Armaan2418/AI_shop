import { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../store/cartSlice';
import { toggleWishlist, selectIsWishlisted } from '../store/wishlistSlice';
import { toggleCompare, selectIsCompared, selectCompareCount } from '../store/compareSlice';
import { productService } from '../services/productService';
import { MOCK_PRODUCTS } from '../data/products';
import './Products.css';

const CATEGORIES = [
  { value: 'All',         label: 'All Categories', icon: 'grid' },
  { value: 'phones',      label: 'Phones',         icon: 'phone' },
  { value: 'laptops',     label: 'Laptops',        icon: 'laptop' },
  { value: 'audio',       label: 'Audio',          icon: 'headphones' },
  { value: 'wearables',   label: 'Wearables',      icon: 'watch' },
  { value: 'gaming',      label: 'Gaming',         icon: 'gaming' },
  { value: 'accessories', label: 'Accessories',    icon: 'plug' },
  { value: 'clothing',    label: 'Clothing',       icon: 'shirt' },
  { value: 'fashion',     label: 'Fashion',        icon: 'sparkles' },
  { value: 'makeup',      label: 'Makeup',         icon: 'makeup' },
];

const BRANDS = ['All', 'Apple', 'Samsung', 'Sony', 'Google', 'Dell', 'Bose', 'OnePlus', 'Realme', 'HP', 'Lenovo', 'JBL', 'Garmin', 'Fitbit', 'Nintendo', 'Zara', 'MAC', 'NYX', 'Maybelline'];
const SORT_OPTS = [
  { label: 'Featured',      value: 'featured' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Top Rated',     value: 'rating' },
  { label: 'Most Reviews',  value: 'reviews' },
  { label: 'Best Deals',    value: 'deals' },
];

const PRICE_PRESETS = [
  { label: 'Under ₹5,000',      min: '',       max: '5000' },
  { label: '₹5,000–₹25,000',   min: '5000',   max: '25000' },
  { label: '₹25,000–₹1,00,000',min: '25000',  max: '100000' },
  { label: '₹1,00,000+',       min: '100000', max: '' },
];

// ── SVG Icons ─────────────────────────────────────────────────────────
const Icon = ({ name, size = 18 }) => {
  const icons = {
    search:     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    filter:     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
    grid:       <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
    list:       <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
    close:      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    chevronDown:<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>,
    chevronRight:<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
    home:       <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    phone:      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>,
    laptop:     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="2" y1="20" x2="22" y2="20"/></svg>,
    headphones: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18v-6a9 9 0 0118 0v6"/><path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z"/></svg>,
    watch:      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="7"/><polyline points="12 9 12 12 13.5 13.5"/><path d="M16.51 17.35l-.35 3.83a2 2 0 01-2 1.82H9.83a2 2 0 01-2-1.82l-.35-3.83m.01-10.7l.35-3.83A2 2 0 019.83 1h4.35a2 2 0 011.95 1.82l.35 3.83"/></svg>,
    gaming:     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="6" y1="12" x2="10" y2="12"/><line x1="8" y1="10" x2="8" y2="14"/><circle cx="15" cy="13" r="1"/><circle cx="18" cy="11" r="1"/><path d="M17.32 5H6.68a4 4 0 00-3.978 3.59C2.604 9.416 2 14.456 2 16a3 3 0 003 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 019.828 16h4.344a2 2 0 011.414.586L17 18c.5.5 1 1 2 1a3 3 0 003-3c0-1.545-.604-6.584-.685-7.258A4 4 0 0017.32 5z"/></svg>,
    plug:       <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>,
    shirt:      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.57a1 1 0 00.99.86H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.86l.58-3.57a2 2 0 00-1.34-2.23z"/></svg>,
    sparkles:   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z"/><path d="M5 3l.75 2.25L8 6l-2.25.75L5 9l-.75-2.25L2 6l2.25-.75L5 3z"/><path d="M19 13l.75 2.25L22 16l-2.25.75L19 19l-.75-2.25L16 16l2.25-.75L19 13z"/></svg>,
    makeup:     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c4 0 7-3.5 7-7 0-2-1-4-3-5.5V4a1 1 0 00-1-1h-6a1 1 0 00-1 1v5.5C6 11 5 13 5 15c0 3.5 3 7 7 7z"/><line x1="10" y1="4" x2="14" y2="4"/></svg>,
    star:       <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
    starEmpty:  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
    heart:      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
    heartFill:  <svg width={size} height={size} viewBox="0 0 24 24" fill="#dc2626" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
    cart:       <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>,
    check:      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
    eye:        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
    package:    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
    truck:      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
    shield:     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    arrowRight: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
    sliders:    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>,
    sortAsc:    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="20" x2="12" y2="4"/><polyline points="18 10 12 4 6 10"/></svg>,
  };
  return icons[name] ?? null;
};

// ── Stars ─────────────────────────────────────────────────────────────
function Stars({ rating }) {
  return (
    <span className="stars">
      {[1,2,3,4,5].map(s => (
        <span key={s} className={s <= Math.round(rating) ? 'star-filled' : 'star-empty'}>
          <Icon name={s <= Math.round(rating) ? 'star' : 'starEmpty'} size={12} />
        </span>
      ))}
    </span>
  );
}

// ── Product Card ──────────────────────────────────────────────────────
function ProductCard({ product, viewMode, onAddToCart, isAdded }) {
  const dispatch     = useDispatch();
  const wished       = useSelector(selectIsWishlisted(product._id));
  const compared     = useSelector(selectIsCompared(product._id));
  const compareCount = useSelector(selectCompareCount);
  const [imgError, setImgError] = useState(false);
  const [heartBurst, setHeartBurst] = useState(false);

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  const handleWish = (e) => {
    e.preventDefault();
    dispatch(toggleWishlist(product));
    if (!wished) { setHeartBurst(true); setTimeout(() => setHeartBurst(false), 600); }
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!product.inStock) return;
    onAddToCart(product);
  };

  const handleCompare = (e) => {
    e.preventDefault();
    if (!compared && compareCount >= 3) return;
    dispatch(toggleCompare(product));
  };

  const categoryIconMap = {
    phones: 'phone', laptops: 'laptop', audio: 'headphones',
    wearables: 'watch', gaming: 'gaming', accessories: 'plug',
    clothing: 'shirt', fashion: 'sparkles', makeup: 'makeup',
  };

  return (
    <Link to={`/products/${product._id}`} className={`pcard pcard--${viewMode}`}>
      <div className="pcard__image-wrap">
        {imgError ? (
          <div className="pcard__img-fallback">
            <Icon name={categoryIconMap[product.category] ?? 'package'} size={44} />
          </div>
        ) : (
          <img
            src={product.image}
            alt={product.name}
            className="pcard__img"
            onError={() => setImgError(true)}
          />
        )}

        <div className="pcard__badges">
          {discount && <span className="pcard__badge pcard__badge--sale">-{discount}%</span>}
          {product.badge === 'AI Pick' && <span className="pcard__badge pcard__badge--ai">AI Pick</span>}
          {!product.inStock && <span className="pcard__badge pcard__badge--out">Out of Stock</span>}
        </div>

        {viewMode === 'grid' && (
          <div className="pcard__overlay">
            <span className="pcard__quick"><Icon name="eye" size={13} /> Quick View</span>
          </div>
        )}
      </div>

      <div className="pcard__info">
        <p className="pcard__brand">{product.brand}</p>
        <p className="pcard__name">{product.name}</p>

        <div className="pcard__rating">
          <Stars rating={product.rating} />
          <span className="pcard__rating-val">{product.rating}</span>
          <span className="pcard__rating-cnt">({product.reviewCount.toLocaleString()})</span>
        </div>

        <div className="pcard__price-row">
          <span className="pcard__price">₹{product.price.toLocaleString('en-IN')}</span>
          {product.originalPrice && (
            <span className="pcard__original">₹{product.originalPrice.toLocaleString('en-IN')}</span>
          )}
          {discount && <span className="pcard__save">Save ₹{(product.originalPrice - product.price).toLocaleString('en-IN')}</span>}
        </div>

        {viewMode === 'list' && (
          <div className="pcard__meta">
            <span className={`pcard__stock ${product.inStock ? 'pcard__stock--in' : 'pcard__stock--out'}`}>
              <Icon name={product.inStock ? 'check' : 'close'} size={12} />
              {product.inStock ? 'In Stock' : 'Out of Stock'}
            </span>
            <span className="pcard__shipping">
              <Icon name="truck" size={12} /> Free Shipping
            </span>
          </div>
        )}

        <div className="pcard__actions-row">
          <button
            className={`pcard__wish-inline ${wished ? 'pcard__wish-inline--active' : ''}`}
            onClick={handleWish}
            aria-label="Wishlist"
          >
            <Icon name={wished ? 'heartFill' : 'heart'} size={15} />
            {wished ? 'Saved' : ''}
            {heartBurst && (
              <span className="heart-burst-container">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={`heart-particle heart-particle--${i}`}>♥</span>
                ))}
              </span>
            )}
          </button>
          
          <button
            className={`pcard__compare-btn-inline ${compared ? 'pcard__compare-btn-inline--active' : ''}`}
            onClick={handleCompare}
            aria-label="Compare"
            title={compared ? 'Remove from Compare' : compareCount >= 3 ? 'Max 3 items' : 'Compare'}
            style={{ opacity: !compared && compareCount >= 3 ? 0.4 : 1 }}
          >
            ⚖ {compared ? 'Comparing' : ''}
          </button>

          <button
            className={`pcard__add-btn ${isAdded ? 'pcard__add-btn--added' : ''} ${!product.inStock ? 'pcard__add-btn--disabled' : ''}`}
            onClick={handleAdd}
            disabled={!product.inStock}
          >
            {isAdded
              ? <><Icon name="check" size={14} /> Added</>
              : !product.inStock
              ? 'Out of Stock'
              : <><Icon name="cart" size={14} /> Add to Cart</>}
          </button>
        </div>
      </div>
    </Link>
  );
}

// ── Sidebar Section ───────────────────────────────────────────────────
function SidebarSection({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="sidebar-section">
      <button className="sidebar-section-header" onClick={() => setOpen(o => !o)}>
        <span className="sidebar-section-title">{title}</span>
        <span className={`sidebar-section-chevron ${open ? 'sidebar-section-chevron--open' : ''}`}>
          <Icon name="chevronDown" size={14} />
        </span>
      </button>
      {open && <div className="sidebar-section-body">{children}</div>}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────
export default function Products() {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const [products,    setProducts]    = useState(MOCK_PRODUCTS);
  const [loading,     setLoading]     = useState(false);
  const [viewMode,    setViewMode]    = useState('grid');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [addedId,     setAddedId]     = useState(null);
  const [toast,       setToast]       = useState(null);

  // Filters
  const [search,   setSearch]   = useState(searchParams.get('search')   || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [brand,    setBrand]    = useState('All');
  const [sort,     setSort]     = useState(searchParams.get('sort')     || 'featured');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [inStock,  setInStock]  = useState(false);
  const [onSale,   setOnSale]   = useState(searchParams.get('sort') === 'deals');
  const [minRating,setMinRating]= useState(0);

  const searchRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const params = {};
        if (category !== 'All') params.category = category;
        if (brand !== 'All')    params.brand     = brand;
        if (sort)               params.sort      = sort;
        if (minPrice)           params.minPrice  = minPrice;
        if (maxPrice)           params.maxPrice  = maxPrice;
        if (search)             params.search    = search;
        const data = await productService.getProducts(params);
        if (data?.products?.length) setProducts(data.products);
      } catch { /* ignore */ }
      finally { setLoading(false); }
    };
    load();
  }, [category, brand, sort, minPrice, maxPrice, search]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const handleAddToCart = (product) => {
    dispatch(addToCart({ ...product, selectedColor: null, selectedStorage: null }));
    setAddedId(product._id);
    setTimeout(() => setAddedId(null), 2000);
    showToast(`${product.name} added to cart`);
  };

  const handleClearFilters = () => {
    setSearch(''); setCategory('All'); setBrand('All');
    setSort('featured'); setMinPrice(''); setMaxPrice('');
    setInStock(false); setOnSale(false); setMinRating(0);
    setSearchParams({});
  };

  // Client-side filtering + sorting
  const filtered = products.filter(p => {
    if (category !== 'All' && p.category !== category) return false;
    if (brand    !== 'All' && p.brand    !== brand)    return false;
    if (inStock  && !p.inStock)                        return false;
    if (onSale   && !p.originalPrice)                  return false;
    if (minPrice && p.price < Number(minPrice))        return false;
    if (maxPrice && p.price > Number(maxPrice))        return false;
    if (minRating > 0 && p.rating < minRating)         return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) &&
                  !p.brand.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }).sort((a, b) => {
    if (sort === 'price_asc')  return a.price - b.price;
    if (sort === 'price_desc') return b.price - a.price;
    if (sort === 'rating')     return b.rating - a.rating;
    if (sort === 'reviews')    return b.reviewCount - a.reviewCount;
    if (sort === 'deals')      return (b.originalPrice ? 1 : 0) - (a.originalPrice ? 1 : 0);
    return 0;
  });

  const activeFiltersCount = [
    category !== 'All', brand !== 'All', inStock, onSale,
    !!minPrice, !!maxPrice, !!search, minRating > 0
  ].filter(Boolean).length;

  return (
    <div className="products-page">
      {/* Toast */}
      {toast && (
        <div className="toast-container">
          <div className="toast">
            <span className="toast__icon"><Icon name="check" size={13} /></span>
            <span className="toast__msg">{toast}</span>
            <button className="toast__close" onClick={() => setToast(null)}><Icon name="close" size={13} /></button>
          </div>
        </div>
      )}

      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link to="/" className="breadcrumb__item"><Icon name="home" size={14} /> Home</Link>
          <span className="breadcrumb__sep"><Icon name="chevronRight" size={13} /></span>
          <span className="breadcrumb__item breadcrumb__item--active">
            {category !== 'All'
              ? CATEGORIES.find(c => c.value === category)?.label ?? category
              : 'All Products'}
          </span>
        </nav>

        {/* Page Header */}
        <div className="products-header">
          <div>
            <h1 className="products-title">
              {category !== 'All'
                ? CATEGORIES.find(c => c.value === category)?.label
                : 'All Products'}
            </h1>
            <p className="products-subtitle">
              {loading ? 'Loading products...' : `${filtered.length} products found`}
            </p>
          </div>
        </div>

        <div className="products-layout">

          {/* ── SIDEBAR ── */}
          <aside className={`products-sidebar ${sidebarOpen ? 'products-sidebar--open' : ''}`}>
            <div className="sidebar-top">
              <div className="sidebar-top__left">
                <Icon name="sliders" size={16} />
                <span className="sidebar-title">Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="sidebar-count-badge">{activeFiltersCount}</span>
                )}
              </div>
              <div className="sidebar-top__right">
                {activeFiltersCount > 0 && (
                  <button className="sidebar-clear" onClick={handleClearFilters}>Clear all</button>
                )}
                <button className="sidebar-close-btn" onClick={() => setSidebarOpen(false)}>
                  <Icon name="close" size={15} />
                </button>
              </div>
            </div>

            {/* Category */}
            <SidebarSection title="Category">
              <div className="sidebar-category-list">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.value}
                    className={`sidebar-cat-btn ${category === cat.value ? 'sidebar-cat-btn--active' : ''}`}
                    onClick={() => setCategory(cat.value)}
                  >
                    <span className="sidebar-cat-icon"><Icon name={cat.icon} size={15} /></span>
                    <span className="sidebar-cat-label">{cat.label}</span>
                    <span className="sidebar-cat-count">
                      {cat.value === 'All'
                        ? products.length
                        : products.filter(p => p.category === cat.value).length}
                    </span>
                  </button>
                ))}
              </div>
            </SidebarSection>

            {/* Brand */}
            <SidebarSection title="Brand">
              <div className="sidebar-brand-list">
                {BRANDS.map(b => (
                  <label key={b} className={`sidebar-brand-item ${brand === b ? 'sidebar-brand-item--active' : ''}`}>
                    <input
                      type="radio"
                      name="brand"
                      checked={brand === b}
                      onChange={() => setBrand(b)}
                    />
                    <span>{b === 'All' ? 'All Brands' : b}</span>
                    <span className="sidebar-brand-count">
                      {b === 'All' ? products.length : products.filter(p => p.brand === b).length}
                    </span>
                  </label>
                ))}
              </div>
            </SidebarSection>

            {/* Price */}
            <SidebarSection title="Price Range">
              <div className="sidebar-price-inputs">
                <div className="sidebar-price-field">
                  <span className="sidebar-price-prefix">₹</span>
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={e => setMinPrice(e.target.value)}
                    className="sidebar-price-input"
                  />
                </div>
                <span className="sidebar-price-dash">—</span>
                <div className="sidebar-price-field">
                  <span className="sidebar-price-prefix">₹</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={e => setMaxPrice(e.target.value)}
                    className="sidebar-price-input"
                  />
                </div>
              </div>
              <div className="sidebar-price-presets">
                {PRICE_PRESETS.map(p => (
                  <button
                    key={p.label}
                    className={`sidebar-preset-btn ${minPrice === p.min && maxPrice === p.max ? 'sidebar-preset-btn--active' : ''}`}
                    onClick={() => { setMinPrice(p.min); setMaxPrice(p.max); }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </SidebarSection>

            {/* Rating */}
            <SidebarSection title="Minimum Rating">
              <div className="sidebar-rating-list">
                {[4, 3, 2, 0].map(r => (
                  <button
                    key={r}
                    className={`sidebar-rating-btn ${minRating === r ? 'sidebar-rating-btn--active' : ''}`}
                    onClick={() => setMinRating(r)}
                  >
                    {r === 0 ? (
                      <span>Any Rating</span>
                    ) : (
                      <>
                        <span className="sidebar-rating-stars">
                          {[1,2,3,4,5].map(s => (
                            <span key={s} className={s <= r ? 'star-filled' : 'star-empty'}>
                              <Icon name="star" size={12} />
                            </span>
                          ))}
                        </span>
                        <span>& Up</span>
                      </>
                    )}
                  </button>
                ))}
              </div>
            </SidebarSection>

            {/* Availability */}
            <SidebarSection title="Availability">
              <div className="sidebar-toggles">
                <label className="sidebar-toggle">
                  <div className="sidebar-toggle__track" data-checked={inStock} onClick={() => setInStock(v => !v)}>
                    <div className={`sidebar-toggle__thumb ${inStock ? 'sidebar-toggle__thumb--on' : ''}`} />
                  </div>
                  <span>In Stock Only</span>
                </label>
                <label className="sidebar-toggle">
                  <div className="sidebar-toggle__track" data-checked={onSale} onClick={() => setOnSale(v => !v)}>
                    <div className={`sidebar-toggle__thumb ${onSale ? 'sidebar-toggle__thumb--on' : ''}`} />
                  </div>
                  <span>On Sale Only</span>
                </label>
              </div>
            </SidebarSection>
          </aside>

          {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

          {/* ── MAIN ── */}
          <div className="products-main">

            {/* Toolbar */}
            <div className="products-toolbar">
              <div className="products-toolbar__left">
                <button className="toolbar-filter-btn" onClick={() => setSidebarOpen(true)}>
                  <Icon name="sliders" size={15} />
                  Filters
                  {activeFiltersCount > 0 && (
                    <span className="toolbar-badge">{activeFiltersCount}</span>
                  )}
                </button>
                <span className="products-count">
                  {loading ? 'Loading...' : `${filtered.length} results`}
                </span>
              </div>

              <div className="products-toolbar__right">
                <div className="toolbar-search">
                  <span className="toolbar-search__icon"><Icon name="search" size={15} /></span>
                  <input
                    ref={searchRef}
                    type="text"
                    placeholder="Search products..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                  {search && (
                    <button className="toolbar-search__clear" onClick={() => setSearch('')}>
                      <Icon name="close" size={13} />
                    </button>
                  )}
                </div>

                <div className="toolbar-sort-wrap">
                  <Icon name="sortAsc" size={14} />
                  <select
                    className="toolbar-sort"
                    value={sort}
                    onChange={e => setSort(e.target.value)}
                  >
                    {SORT_OPTS.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>

                <div className="view-toggle">
                  <button
                    className={`view-btn ${viewMode === 'grid' ? 'view-btn--active' : ''}`}
                    onClick={() => setViewMode('grid')}
                    title="Grid view"
                  >
                    <Icon name="grid" size={15} />
                  </button>
                  <button
                    className={`view-btn ${viewMode === 'list' ? 'view-btn--active' : ''}`}
                    onClick={() => setViewMode('list')}
                    title="List view"
                  >
                    <Icon name="list" size={15} />
                  </button>
                </div>
              </div>
            </div>

            {/* Active filter chips */}
            {activeFiltersCount > 0 && (
              <div className="active-filters">
                {search && (
                  <span className="filter-chip">
                    Search: "{search}"
                    <button onClick={() => setSearch('')}><Icon name="close" size={11} /></button>
                  </span>
                )}
                {category !== 'All' && (
                  <span className="filter-chip">
                    {CATEGORIES.find(c => c.value === category)?.label}
                    <button onClick={() => setCategory('All')}><Icon name="close" size={11} /></button>
                  </span>
                )}
                {brand !== 'All' && (
                  <span className="filter-chip">
                    {brand}
                    <button onClick={() => setBrand('All')}><Icon name="close" size={11} /></button>
                  </span>
                )}
                {inStock && (
                  <span className="filter-chip">
                    In Stock
                    <button onClick={() => setInStock(false)}><Icon name="close" size={11} /></button>
                  </span>
                )}
                {onSale && (
                  <span className="filter-chip">
                    On Sale
                    <button onClick={() => setOnSale(false)}><Icon name="close" size={11} /></button>
                  </span>
                )}
                {(minPrice || maxPrice) && (
                  <span className="filter-chip">
                    ₹{minPrice || '0'} – ₹{maxPrice || '∞'}
                    <button onClick={() => { setMinPrice(''); setMaxPrice(''); }}><Icon name="close" size={11} /></button>
                  </span>
                )}
                {minRating > 0 && (
                  <span className="filter-chip">
                    {minRating}+ Stars
                    <button onClick={() => setMinRating(0)}><Icon name="close" size={11} /></button>
                  </span>
                )}
                <button className="filter-chip-clear-all" onClick={handleClearFilters}>
                  Clear all
                </button>
              </div>
            )}

            {/* Grid / List */}
            {loading ? (
              <div className={`products-grid products-grid--${viewMode}`}>
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="pcard-skeleton">
                    <div className="skeleton skeleton--img" />
                    <div className="skeleton-body">
                      <div className="skeleton skeleton--text-sm" />
                      <div className="skeleton skeleton--text" />
                      <div className="skeleton skeleton--text-sm" />
                      <div className="skeleton skeleton--btn" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state__icon"><Icon name="package" size={48} /></div>
                <h3 className="empty-state__title">No products found</h3>
                <p className="empty-state__sub">Try adjusting your filters or search term</p>
                <button className="empty-state__btn" onClick={handleClearFilters}>
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className={`products-grid products-grid--${viewMode}`}>
                {filtered.map(product => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    viewMode={viewMode}
                    onAddToCart={handleAddToCart}
                    isAdded={addedId === product._id}
                  />
                ))}
              </div>
            )}

            {/* Results footer */}
            {!loading && filtered.length > 0 && (
              <div className="products-footer">
                <p className="products-footer__text">
                  Showing {filtered.length} of {products.length} products
                </p>
                <div className="products-footer__trust">
                  <span><Icon name="shield" size={13} /> Secure checkout</span>
                  <span><Icon name="truck" size={13} /> Free shipping over ₹2,000</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}