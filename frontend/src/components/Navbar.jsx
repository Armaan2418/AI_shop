import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectIsAuth, selectUser, logout } from '../store/authSlice';
import { selectCartCount } from '../store/cartSlice';
import { selectWishlistCount } from '../store/wishlistSlice';
import { ROUTES } from '../routes/AppRoutes';
import './Navbar.css';

const CATEGORIES = [
  { label: 'Phones',      icon: 'phone',      path: '/products?category=phones' },
  { label: 'Laptops',     icon: 'laptop',     path: '/products?category=laptops' },
  { label: 'Audio',       icon: 'headphones', path: '/products?category=audio' },
  { label: 'Wearables',   icon: 'watch',      path: '/products?category=wearables' },
  { label: 'Gaming',      icon: 'gaming',     path: '/products?category=gaming' },
  { label: 'Accessories', icon: 'plug',       path: '/products?category=accessories' },
  { label: 'Clothing',    icon: 'shirt',      path: '/products?category=clothing' },
  { label: 'Fashion',     icon: 'sparkles',   path: '/products?category=fashion' },
  { label: 'Makeup',      icon: 'makeup',     path: '/products?category=makeup' },
];

const Icon = ({ name, size = 18 }) => {
  const icons = {
    search: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    cart: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>,
    user: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    close: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    chevronDown: <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>,
    dashboard: <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
    orders: <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
    heart: <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
    settings: <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M4.93 19.07l1.41-1.41M19.07 19.07l-1.41-1.41M12 2v2M12 20v2M2 12h2M20 12h2"/></svg>,
    logout: <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
    signin: <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>,
    register: <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>,
    phone: <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>,
    laptop: <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="2" y1="20" x2="22" y2="20"/></svg>,
    headphones: <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18v-6a9 9 0 0118 0v6"/><path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z"/></svg>,
    watch: <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="7"/><polyline points="12 9 12 12 13.5 13.5"/><path d="M16.51 17.35l-.35 3.83a2 2 0 01-2 1.82H9.83a2 2 0 01-2-1.82l-.35-3.83m.01-10.7l.35-3.83A2 2 0 019.83 1h4.35a2 2 0 011.95 1.82l.35 3.83"/></svg>,
    gaming: <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="6" y1="12" x2="10" y2="12"/><line x1="8" y1="10" x2="8" y2="14"/><circle cx="15" cy="13" r="1"/><circle cx="18" cy="11" r="1"/><path d="M17.32 5H6.68a4 4 0 00-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 003 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 019.828 16h4.344a2 2 0 011.414.586L17 18c.5.5 1 1 2 1a3 3 0 003-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0017.32 5z"/></svg>,
    plug: <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>,
    tag: <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>,
    home: <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    grid: <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
    arrowRight: <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
    shirt:      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.57a1 1 0 00.99.86H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.86l.58-3.57a2 2 0 00-1.34-2.23z"/></svg>,
    sparkles:   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z"/><path d="M5 3l.75 2.25L8 6l-2.25.75L5 9l-.75-2.25L2 6l2.25-.75L5 3z"/><path d="M19 13l.75 2.25L22 16l-2.25.75L19 19l-.75-2.25L16 16l2.25-.75L19 13z"/></svg>,
    makeup:     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c4 0 7-3.5 7-7 0-2-1-4-3-5.5V4a1 1 0 00-1-1h-6a1 1 0 00-1 1v5.5C6 11 5 13 5 15c0 3.5 3 7 7 7z"/><line x1="10" y1="4" x2="14" y2="4"/></svg>,
  };
  return icons[name] ?? null;
};

const LogoMark = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="28" height="28" rx="7" fill="#1a56db"/>
    <path d="M8 14l4-6 4 6-4 2-4-2z" fill="white" opacity="0.9"/>
    <path d="M12 16l4-2 4 6H8l4-4z" fill="white"/>
  </svg>
);

export default function Navbar() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const location  = useLocation();
  const isAuth       = useSelector(selectIsAuth);
  const user         = useSelector(selectUser);
  const cartCount    = useSelector(selectCartCount);
  const wishlistCount = useSelector(selectWishlistCount);

  const [scrolled,     setScrolled]     = useState(false);
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [searchOpen,   setSearchOpen]   = useState(false);
  const [searchQuery,  setSearchQuery]  = useState('');
  const [productsOpen, setProductsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [cartBounce,   setCartBounce]   = useState(false);

  const searchRef   = useRef(null);
  const userMenuRef = useRef(null);
  const productsRef = useRef(null);
  const prevCount   = useRef(cartCount);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileOpen(false); setSearchOpen(false);
    setUserMenuOpen(false); setProductsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (cartCount > prevCount.current) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCartBounce(true);
      setTimeout(() => setCartBounce(false), 600);
    }
    prevCount.current = cartCount;
  }, [cartCount]);

  useEffect(() => {
    if (searchOpen) setTimeout(() => searchRef.current?.focus(), 50);
  }, [searchOpen]);

  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false);
      if (productsRef.current && !productsRef.current.contains(e.target)) setProductsOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery(''); setSearchOpen(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    setUserMenuOpen(false);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
        <div className="navbar__inner container">

          <Link to="/" className="navbar__logo">
            <LogoMark />
            <span className="navbar__logo-text">AI<span>Shop</span></span>
          </Link>

          <ul className="navbar__links">
            <li>
              <Link to="/" className={`navbar__link ${isActive('/') ? 'navbar__link--active' : ''}`}>Home</Link>
            </li>
            <li className="navbar__dropdown-wrap" ref={productsRef}>
              <button
                className={`navbar__link navbar__link--btn ${productsOpen ? 'navbar__link--active' : ''}`}
                onClick={() => setProductsOpen((p) => !p)}
                onMouseEnter={() => setProductsOpen(true)}
              >
                Products
                <span className={`navbar__chevron ${productsOpen ? 'navbar__chevron--open' : ''}`}>
                  <Icon name="chevronDown" />
                </span>
              </button>
              {productsOpen && (
                <div className="navbar__dropdown" onMouseLeave={() => setProductsOpen(false)}>
                  <div className="navbar__dropdown-header">Shop by Category</div>
                  <div className="navbar__dropdown-grid">
                    {CATEGORIES.map((cat) => (
                      <Link key={cat.label} to={cat.path} className="navbar__dropdown-item" onClick={() => setProductsOpen(false)}>
                        <span className="navbar__dropdown-icon"><Icon name={cat.icon} size={15} /></span>
                        <span>{cat.label}</span>
                      </Link>
                    ))}
                  </div>
                  <div className="navbar__dropdown-footer">
                    <Link to="/products" onClick={() => setProductsOpen(false)} className="navbar__dropdown-all">
                      View All Products <Icon name="arrowRight" />
                    </Link>
                  </div>
                </div>
              )}
            </li>
            <li>
              <Link to="/products?sort=deals" className={`navbar__link navbar__link--deals ${location.search.includes('deals') ? 'navbar__link--active' : ''}`}>
                <Icon name="tag" size={14} /> Deals
              </Link>
            </li>
            <li>
              <Link to="/about" className={`navbar__link ${isActive('/about') ? 'navbar__link--active' : ''}`}>
                About
              </Link>
            </li>
            <li>
              <Link to="/contact" className={`navbar__link ${isActive('/contact') ? 'navbar__link--active' : ''}`}>
                Contact
              </Link>
            </li>
          </ul>

          <div className="navbar__right">
            {/* AI Visual Search camera button */}
            <button
              className="navbar__icon-btn navbar__icon-btn--camera"
              aria-label="AI Visual Search"
              title="Search by Image"
              onClick={() => window.dispatchEvent(new Event('aishop:open-visual-search'))}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
            </button>

            <div className="navbar__search-wrap">
              {searchOpen ? (
                <form className="navbar__search-form" onSubmit={handleSearch}>
                  <span className="navbar__search-icon"><Icon name="search" size={15} /></span>
                  <input ref={searchRef} type="text" className="navbar__search-input" placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={(e) => e.key === 'Escape' && setSearchOpen(false)} />
                  <button type="button" className="navbar__search-close" onClick={() => { setSearchOpen(false); setSearchQuery(''); }}><Icon name="close" size={14} /></button>
                </form>
              ) : (
                <button className="navbar__icon-btn" onClick={() => setSearchOpen(true)} aria-label="Search"><Icon name="search" /></button>
              )}
            </div>

            <div className="navbar__user-wrap" ref={userMenuRef}>
              <button className="navbar__icon-btn" onClick={() => setUserMenuOpen((p) => !p)} aria-label="Account">
                {isAuth && user ? (
                  <span className="navbar__avatar">{user.name?.[0]?.toUpperCase() ?? 'U'}<span className="navbar__avatar-dot" /></span>
                ) : (
                  <Icon name="user" />
                )}
              </button>
              {userMenuOpen && (
                <div className="navbar__user-menu">
                  {isAuth ? (
                    <>
                      <div className="navbar__user-header">
                        <div className="navbar__user-avatar">{user?.name?.[0]?.toUpperCase() ?? 'U'}</div>
                        <div>
                          <div className="navbar__user-name">{user?.name ?? 'User'}</div>
                          <div className="navbar__user-email">{user?.email}</div>
                        </div>
                      </div>
                      <div className="navbar__user-body">
                        <Link to="/dashboard"          className="navbar__user-item" onClick={() => setUserMenuOpen(false)}><Icon name="dashboard" /><span>Dashboard</span></Link>
                        <Link to="/dashboard"          className="navbar__user-item" onClick={() => setUserMenuOpen(false)}><Icon name="orders"    /><span>My Orders</span></Link>
                        <Link to="/wishlist" className="navbar__user-item" onClick={() => setUserMenuOpen(false)}><Icon name="heart" /><span>Wishlist {wishlistCount > 0 && <span className="navbar__user-badge">{wishlistCount}</span>}</span></Link>
                        <Link to="/dashboard" className="navbar__user-item" onClick={() => setUserMenuOpen(false)}><Icon name="settings"  /><span>Settings</span></Link>
                      </div>
                      <div className="navbar__user-divider" />
                      <div className="navbar__user-body">
                        <button className="navbar__user-item navbar__user-item--red" onClick={handleLogout}><Icon name="logout" /><span>Sign Out</span></button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="navbar__user-guest">
                        <p>Welcome to AIShop</p>
                        <small>Sign in for the best experience</small>
                      </div>
                      <div className="navbar__user-body">
                        <Link to="/login"    className="navbar__user-item" onClick={() => setUserMenuOpen(false)}><Icon name="signin"   /><span>Sign In</span></Link>
                        <Link to="/register" className="navbar__user-item" onClick={() => setUserMenuOpen(false)}><Icon name="register" /><span>Create Account</span></Link>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Wishlist icon with count */}
            <Link to="/wishlist" className="navbar__cart-btn navbar__wishlist-btn" aria-label="Wishlist" title="My Wishlist">
              <Icon name="heart" size={20} />
              {wishlistCount > 0 && (
                <span className="navbar__cart-badge navbar__wishlist-badge">
                  {wishlistCount > 99 ? '99+' : wishlistCount}
                </span>
              )}
            </Link>

            <Link to="/cart" className={`navbar__cart-btn ${cartBounce ? 'navbar__cart-btn--bounce' : ''}`} aria-label="Cart">
              <Icon name="cart" size={20} />
              {cartCount > 0 && (
                <span className={`navbar__cart-badge ${cartBounce ? 'navbar__cart-badge--pulse' : ''}`}>
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>
          </div>

          <button className={`navbar__hamburger ${mobileOpen ? 'navbar__hamburger--open' : ''}`} onClick={() => setMobileOpen((p) => !p)} aria-label="Toggle menu">
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {mobileOpen && <div className="mobile-overlay" onClick={() => setMobileOpen(false)} />}

      <div className={`mobile-drawer ${mobileOpen ? 'mobile-drawer--open' : ''}`}>
        <div className="mobile-drawer__header">
          <Link to="/" className="navbar__logo" onClick={() => setMobileOpen(false)}>
            <LogoMark />
            <span className="navbar__logo-text">AI<span>Shop</span></span>
          </Link>
          <button className="mobile-drawer__close" onClick={() => setMobileOpen(false)}><Icon name="close" size={16} /></button>
        </div>

        <form className="mobile-drawer__search" onSubmit={handleSearch}>
          <Icon name="search" size={15} />
          <input type="text" placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </form>

        <nav className="mobile-drawer__nav">
          <Link to="/"                     className="mobile-drawer__link" onClick={() => setMobileOpen(false)}><Icon name="home" /><span>Home</span></Link>
          <Link to="/products"             className="mobile-drawer__link" onClick={() => setMobileOpen(false)}><Icon name="grid" /><span>All Products</span></Link>
          <Link to="/products?sort=deals"  className="mobile-drawer__link" onClick={() => setMobileOpen(false)}><Icon name="tag"  /><span>Deals</span></Link>
          <div className="mobile-drawer__section-title">Categories</div>
          {CATEGORIES.map((cat) => (
            <Link key={cat.label} to={cat.path} className="mobile-drawer__link mobile-drawer__link--sub" onClick={() => setMobileOpen(false)}>
              <Icon name={cat.icon} size={15} /><span>{cat.label}</span>
            </Link>
          ))}
          <Link to="/wishlist" className="mobile-drawer__link" onClick={() => setMobileOpen(false)}>
            <Icon name="heart" /><span>Wishlist</span>
            {wishlistCount > 0 && <span className="mobile-drawer__badge">{wishlistCount}</span>}
          </Link>
          <Link to="/cart" className="mobile-drawer__link" onClick={() => setMobileOpen(false)}>
            <Icon name="cart" /><span>Cart</span>
            {cartCount > 0 && <span className="mobile-drawer__badge">{cartCount}</span>}
          </Link>
          <div className="mobile-drawer__divider" />
          {isAuth ? (
            <>
              <Link to="/dashboard" className="mobile-drawer__link" onClick={() => setMobileOpen(false)}><Icon name="dashboard" /><span>Dashboard</span></Link>
              <button className="mobile-drawer__link mobile-drawer__link--red" onClick={handleLogout}><Icon name="logout" /><span>Sign Out</span></button>
            </>
          ) : (
            <>
              <Link to="/login"    className="mobile-drawer__link" onClick={() => setMobileOpen(false)}><Icon name="signin"   /><span>Sign In</span></Link>
              <Link to="/register" className="mobile-drawer__link" onClick={() => setMobileOpen(false)}><Icon name="register" /><span>Create Account</span></Link>
            </>
          )}
        </nav>
      </div>
    </>
  );
}