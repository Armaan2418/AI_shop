import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../store/cartSlice';
import { toggleWishlist, selectIsWishlisted } from '../store/wishlistSlice';
import { toggleCompare, selectIsCompared, selectCompareCount } from '../store/compareSlice';
import { productService } from '../services/productService';
import './Home.css';

const MOCK_CATEGORIES = [
  { label: 'Phones',      icon: 'phone',      count: 248, slug: 'phones' },
  { label: 'Laptops',     icon: 'laptop',     count: 156, slug: 'laptops' },
  { label: 'Audio',       icon: 'headphones', count: 89,  slug: 'audio' },
  { label: 'Wearables',   icon: 'watch',      count: 64,  slug: 'wearables' },
  { label: 'Gaming',      icon: 'gaming',     count: 112, slug: 'gaming' },
  { label: 'Accessories', icon: 'plug',       count: 203, slug: 'accessories' },
  { label: 'Clothing',    icon: 'shirt',      count: 320, slug: 'clothing' },
  { label: 'Fashion',     icon: 'sparkles',   count: 185, slug: 'fashion' },
  { label: 'Makeup',      icon: 'makeup',     count: 142, slug: 'makeup' },
];

const MOCK_PRODUCTS = [
  { _id: '1',  name: 'iPhone 15 Pro Max',      category: 'phones',      price: 129900, originalPrice: 149900, rating: 4.8, reviewCount: 2145, image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&q=80', badge: 'AI Pick', inStock: true },
  { _id: '2',  name: 'MacBook Air M3',          category: 'laptops',     price: 114900, originalPrice: null,   rating: 4.9, reviewCount: 1820, image: 'https://images.unsplash.com/photo-1611186871525-b9e8b073b50a?w=400&q=80', badge: null,      inStock: true },
  { _id: '3',  name: 'AirPods Pro 2nd Gen',     category: 'audio',       price: 24900,  originalPrice: 26900,  rating: 4.7, reviewCount: 3210, image: 'https://images.unsplash.com/photo-1606220588913-b3eea41b658d?w=400&q=80', badge: 'Sale',    inStock: true },
  { _id: '4',  name: 'Galaxy Watch 6',          category: 'wearables',   price: 26999,  originalPrice: null,   rating: 4.6, reviewCount: 890,  image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80', badge: null,      inStock: true },
  { _id: '5',  name: 'Sony WH-1000XM5',        category: 'audio',       price: 25990,  originalPrice: 34990,  rating: 4.8, reviewCount: 4120, image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&q=80', badge: 'AI Pick', inStock: true },
  { _id: '7',  name: 'PS5 DualSense',           category: 'gaming',      price: 5990,   originalPrice: 6490,   rating: 4.7, reviewCount: 5400, image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400&q=80', badge: 'Sale',    inStock: true },
  { _id: '8',  name: 'Samsung 4K Monitor',      category: 'accessories', price: 29999,  originalPrice: 42999,  rating: 4.5, reviewCount: 430,  image: 'https://images.unsplash.com/photo-1527443224154-c4a573d5f6b4?w=400&q=80', badge: null,      inStock: true },
  { _id: '13', name: 'Classic White Tee',       category: 'clothing',    price: 999,    originalPrice: 1499,   rating: 4.5, reviewCount: 1240, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80', badge: 'Sale',    inStock: true },
  { _id: '16', name: 'Leather Handbag',         category: 'fashion',     price: 7499,   originalPrice: 9999,   rating: 4.7, reviewCount: 876,  image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80', badge: 'AI Pick', inStock: true },
  { _id: '19', name: 'Matte Lipstick Set',      category: 'makeup',      price: 1499,   originalPrice: 1999,   rating: 4.8, reviewCount: 2310, image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80', badge: 'Sale',    inStock: true },
  { _id: '15', name: 'Floral Maxi Dress',       category: 'clothing',    price: 1999,   originalPrice: 2999,   rating: 4.7, reviewCount: 820,  image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&q=80', badge: 'AI Pick', inStock: true },
  { _id: '20', name: 'Foundation & Concealer',  category: 'makeup',      price: 1999,   originalPrice: null,   rating: 4.7, reviewCount: 1890, image: 'https://images.unsplash.com/photo-1631214499178-338dc7a3e0cb?w=400&q=80', badge: 'AI Pick', inStock: true },
];

const FILTER_TABS = ['All', 'Phones', 'Laptops', 'Audio', 'Wearables', 'Gaming', 'Clothing', 'Fashion', 'Makeup'];

const TRUST_ITEMS = [
  { icon: 'truck',   title: 'Free Shipping',   subtitle: 'On orders over ₹2,000' },
  { icon: 'shield',  title: 'Secure Payments', subtitle: '256-bit SSL encrypted' },
  { icon: 'refresh', title: '30-Day Returns',  subtitle: 'Hassle-free returns' },
  { icon: 'headset', title: '24/7 Support',    subtitle: 'Always here to help' },
];

const AI_CHIPS = [
  'Find me a phone under ₹50,000',
  'Best laptop for students',
  'Noise cancelling headphones',
];

const FOUNDERS = [
  {
    name:     'Prachi Khandelwal',
    bio:      'Prachi drives the vision behind AIShop — building a smarter, more personalized way to shop. She believes AI should feel like a trusted friend, not a search engine.',
    image:    '/developer-prachi.jpg',
    initials: 'PK',
    linkedin: 'https://www.linkedin.com/in/prachi-khandelwal-035518320',
  },
  {
    name:     'Armaan Sangwan',
    bio:      'Armaan architects the technology that powers AIShop. From recommendation engines to real-time order tracking, he turns ambitious ideas into seamless experiences.',
    image:    '/founder-armaan.jpeg',
    initials: 'AS',
    linkedin: 'https://www.linkedin.com/in/armaan-sangwan-5457a3268/',
  },
];

const Icon = ({ name, size = 18 }) => {
  const icons = {
    phone:      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>,
    laptop:     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="2" y1="20" x2="22" y2="20"/></svg>,
    headphones: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18v-6a9 9 0 0118 0v6"/><path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z"/></svg>,
    watch:      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="7"/><polyline points="12 9 12 12 13.5 13.5"/><path d="M16.51 17.35l-.35 3.83a2 2 0 01-2 1.82H9.83a2 2 0 01-2-1.82l-.35-3.83m.01-10.7l.35-3.83A2 2 0 019.83 1h4.35a2 2 0 011.95 1.82l.35 3.83"/></svg>,
    gaming:     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="6" y1="12" x2="10" y2="12"/><line x1="8" y1="10" x2="8" y2="14"/><circle cx="15" cy="13" r="1"/><circle cx="18" cy="11" r="1"/><path d="M17.32 5H6.68a4 4 0 00-3.978 3.59C2.604 9.416 2 14.456 2 16a3 3 0 003 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 019.828 16h4.344a2 2 0 011.414.586L17 18c.5.5 1 1 2 1a3 3 0 003-3c0-1.545-.604-6.584-.685-7.258A4 4 0 0017.32 5z"/></svg>,
    plug:       <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>,
    truck:      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
    shield:     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    refresh:    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>,
    headset:    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18v-6a9 9 0 0118 0v6"/><path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z"/></svg>,
    star:       <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
    starEmpty:  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
    heart:      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
    heartFill:  <svg width={size} height={size} viewBox="0 0 24 24" fill="#dc2626" stroke="#dc2626" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
    cart:       <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>,
    check:      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
    eye:        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
    arrowRight: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
    tag:        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>,
    zap:        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
    brain:      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 2A2.5 2.5 0 017 4.5v0A2.5 2.5 0 014.5 7H4a2 2 0 00-2 2v0a2 2 0 002 2h.5A2.5 2.5 0 017 13.5v0A2.5 2.5 0 019.5 16H10v2a2 2 0 002 2h0a2 2 0 002-2v-2h.5A2.5 2.5 0 0117 13.5v0a2.5 2.5 0 012.5-2.5H20a2 2 0 002-2v0a2 2 0 00-2-2h-.5A2.5 2.5 0 0117 4.5v0A2.5 2.5 0 0114.5 2H14a2 2 0 00-2 2v0a2 2 0 01-2-2H9.5z"/></svg>,
    shirt:      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.57a1 1 0 00.99.86H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.86l.58-3.57a2 2 0 00-1.34-2.23z"/></svg>,
    sparkles:   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z"/><path d="M5 3l.75 2.25L8 6l-2.25.75L5 9l-.75-2.25L2 6l2.25-.75L5 3z"/><path d="M19 13l.75 2.25L22 16l-2.25.75L19 19l-.75-2.25L16 16l2.25-.75L19 13z"/></svg>,
    makeup:     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c4 0 7-3.5 7-7 0-2-1-4-3-5.5V4a1 1 0 00-1-1h-6a1 1 0 00-1 1v5.5C6 11 5 13 5 15c0 3.5 3 7 7 7z"/><line x1="10" y1="4" x2="14" y2="4"/></svg>,
    close:      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    mail:       <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
    lock:       <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>,
    twitter:    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
    instagram:  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>,
    linkedin:   <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>,
    package:    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
    quote:      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M11.192 15.757c0-.88-.23-1.618-.69-2.217-.326-.412-.768-.683-1.327-.812-.55-.128-1.07-.137-1.54-.028-.16-.95.1-1.95.76-3 .66-1.06 1.514-1.86 2.56-2.4L9.373 5c-1.073.57-1.96 1.34-2.66 2.31-.7.97-1.14 1.99-1.32 3.06-.18 1.07-.14 2.09.12 3.07.26.98.71 1.81 1.35 2.49.64.68 1.42 1.15 2.34 1.41.92.26 1.83.22 2.73-.12l-.74-1.44zM19.19 15.757c0-.88-.23-1.618-.69-2.217-.326-.42-.77-.695-1.327-.825-.56-.13-1.07-.14-1.54-.03-.16-.94.1-1.94.76-3 .66-1.06 1.51-1.86 2.56-2.4L17.37 5c-1.07.57-1.96 1.34-2.66 2.31-.7.97-1.14 1.99-1.32 3.06-.18 1.07-.14 2.09.12 3.07.26.98.71 1.81 1.35 2.49.64.68 1.42 1.15 2.34 1.41.92.26 1.83.22 2.73-.12l-.72-1.44z"/></svg>,
  };
  return icons[name] ?? null;
};

function Stars({ rating }) {
  return (
    <span className="stars">
      {[1,2,3,4,5].map((s) => (
        <span key={s} className={s <= Math.round(rating) ? 'star-filled' : 'star-empty'}>
          <Icon name={s <= Math.round(rating) ? 'star' : 'starEmpty'} size={13} />
        </span>
      ))}
    </span>
  );
}

function ProductCard({ product, onAddToCart }) {
  const dispatch    = useDispatch();
  const wished      = useSelector(selectIsWishlisted(product._id));
  const compared    = useSelector(selectIsCompared(product._id));
  const compareCount = useSelector(selectCompareCount);
  const [added,    setAdded]    = useState(false);
  const [imgError, setImgError] = useState(false);
  const [heartBurst, setHeartBurst] = useState(false);

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  const handleAdd = (e) => {
    e.preventDefault();
    if (!product.inStock) return;
    onAddToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleWish = (e) => {
    e.preventDefault();
    dispatch(toggleWishlist(product));
    if (!wished) {
      setHeartBurst(true);
      setTimeout(() => setHeartBurst(false), 600);
    }
  };

  const handleCompare = (e) => {
    e.preventDefault();
    if (!compared && compareCount >= 3) return;
    dispatch(toggleCompare(product));
  };

  return (
    <Link to={`/products/${product._id}`} className="product-card">
      <div className="product-card__image-wrap">
        {imgError ? (
          <div className="product-card__img-fallback">
            <Icon name={
              product.category === 'phones'    ? 'phone'      :
              product.category === 'laptops'   ? 'laptop'     :
              product.category === 'audio'     ? 'headphones' :
              product.category === 'wearables' ? 'watch'      :
              product.category === 'gaming'    ? 'gaming'     : 'package'
            } size={52} />
          </div>
        ) : (
          <img src={product.image} alt={product.name} className="product-card__img" onError={() => setImgError(true)} />
        )}
        <div className="product-card__badges">
          {discount && <span className="product-card__badge product-card__badge--sale">-{discount}%</span>}
          {product.badge === 'AI Pick' && <span className="product-card__badge product-card__badge--ai">AI Pick</span>}
          {!product.inStock && <span className="product-card__badge product-card__badge--out">Out of Stock</span>}
        </div>
        <div className="product-card__overlay">
          <span className="product-card__quick"><Icon name="eye" size={14} /> Quick View</span>
        </div>
      </div>
      <div className="product-card__info">
        <p className="product-card__category">{product.category}</p>
        <p className="product-card__name">{product.name}</p>
        <div className="product-card__rating">
          <Stars rating={product.rating} />
          <span className="product-card__rating-num">{product.rating}</span>
          <span className="product-card__rating-count">({product.reviewCount.toLocaleString()})</span>
        </div>
        <div className="product-card__price-row" style={{ display: 'flex', gap: '8px', marginBottom: '12px', alignItems: 'baseline', flexWrap: 'wrap' }}>
          <span className="product-card__price">₹{product.price.toLocaleString('en-IN')}</span>
          {product.originalPrice && <span className="product-card__original" style={{ textDecoration: 'line-through', color: '#94a3b8', fontSize: '13px' }}>₹{product.originalPrice.toLocaleString('en-IN')}</span>}
        </div>
        
        <div className="pcard__actions-row" style={{ display: 'flex', gap: '8px', marginTop: 'auto', alignItems: 'center', flexWrap: 'wrap' }}>
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
            className={`pcard__add-btn ${added ? 'pcard__add-btn--added' : ''} ${!product.inStock ? 'pcard__add-btn--disabled' : ''}`}
            onClick={handleAdd}
            disabled={!product.inStock}
          >
            {added ? <><Icon name="check" size={15} /> Added</> : !product.inStock ? 'Out of Stock' : <><Icon name="cart" size={15} /> Add to Cart</>}
          </button>
        </div>
      </div>
    </Link>
  );
}

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

const LogoMark = () => (
  <svg width="32" height="32" viewBox="0 0 28 28" fill="none">
    <rect width="28" height="28" rx="7" fill="#1a56db"/>
    <path d="M8 14l4-6 4 6-4 2-4-2z" fill="white" opacity="0.9"/>
    <path d="M12 16l4-2 4 6H8l4-4z" fill="white"/>
  </svg>
);

export default function Home() {
  const dispatch = useDispatch();

  const [products,      setProducts]      = useState(MOCK_PRODUCTS);
  const [loading,       setLoading]       = useState(false);
  const [activeTab,     setActiveTab]     = useState('All');
  const [email,         setEmail]         = useState('');
  const [subscribed,    setSubscribed]    = useState(false);
  const [toastMsg,      setToastMsg]      = useState(null);
  const [heroVisible,   setHeroVisible]   = useState(false);
  const [activeFounder, setActiveFounder] = useState(null);
  const [heroScrollY,   setHeroScrollY]   = useState(0);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const heroRef = useRef(null);

  const sliderProducts = products.filter(p => p.originalPrice && p.price < p.originalPrice).slice(0, 6);

  useEffect(() => {
    if (sliderProducts.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlideIndex(prev => (prev + 1) % sliderProducts.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [sliderProducts.length]);

  // Parallax scroll effect
  useEffect(() => {
    const onScroll = () => setHeroScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await productService.getFeatured();
        if (data?.products?.length) setProducts(data.products);
      } catch { /* ignore */ }
      finally { setLoading(false); }
    };
    load();
  }, []);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') setActiveFounder(null); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (activeFounder) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [activeFounder]);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleAddToCart = (product) => {
    dispatch(addToCart({ ...product, selectedColor: null, selectedStorage: null }));
    showToast(`${product.name} added to cart`);
  };

  const filteredProducts = activeTab === 'All'
    ? products
    : products.filter((p) => p.category?.toLowerCase() === activeTab.toLowerCase());

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail('');
  };

  return (
    <div className="home">
      {toastMsg && <Toast msg={toastMsg} onClose={() => setToastMsg(null)} />}

      {/* HERO */}
      <section ref={heroRef} className={`hero ${heroVisible ? 'hero--visible' : ''}`}>
        <div className="hero__bg-grid" style={{ transform: `translateY(${heroScrollY * 0.12}px)` }} />
        <div className="container hero__inner">
          <div className="hero__text" style={{ transform: `translateY(${heroScrollY * 0.18}px)` }}>
            <div className="hero__eyebrow">
              <span className="hero__eyebrow-pulse" />
              AI-Powered Shopping
            </div>
            <h1 className="hero__title">
              The Smartest Way<br />
              to <span className="hero__title-accent">Shop Online</span>
            </h1>
            <p className="hero__subtitle">
              Discover products curated by AI, personalized for you.
              Better recommendations, unbeatable deals, instant answers.
            </p>
            <div className="hero__actions">
              <Link to="/products" className="hero__btn hero__btn--primary">
                Browse Products <Icon name="arrowRight" size={16} />
              </Link>
              <button className="hero__btn hero__btn--secondary" onClick={() => window.dispatchEvent(new CustomEvent('open-chatbot'))}>
                <Icon name="brain" size={16} /> Talk to AI
              </button>
            </div>
            <div className="hero__stats">
              {[
                { num: '50K+', label: 'Customers' },
                { num: '10K+', label: 'Products' },
                { num: '4.9',  label: 'Avg Rating' },
                { num: '99%',  label: 'Satisfaction' },
              ].map((s, i) => (
                <div key={i} className="hero__stat">
                  <span className="hero__stat-num">{s.num}</span>
                  <span className="hero__stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="hero__visual" style={{ transform: `translateY(${heroScrollY * 0.28}px)` }}>
            <div className="hero__device">
              <div className="hero__device-screen">
                <div className="hero__device-header">
                  <LogoMark />
                  <span className="hero__device-title">AIShop</span>
                  <span className="hero__device-live">Live</span>
                </div>
                <div className="hero__device-slider" style={{ position: 'relative', overflow: 'hidden', height: '125px' }}>
                  {sliderProducts.length > 0 ? (
                    sliderProducts.map((p, idx) => {
                      const discount = Math.round((1 - p.price / p.originalPrice) * 100);
                      return (
                        <Link 
                          to={`/products/${p._id}`} 
                          key={p._id}
                          className="hero__device-card"
                          style={{
                            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                            opacity: currentSlideIndex === idx ? 1 : 0,
                            transform: `translateX(${(idx - currentSlideIndex) * 100}%)`,
                            transition: 'all 0.5s ease-in-out',
                            textDecoration: 'none',
                            borderBottom: 'none'
                          }}
                        >
                          <div className="hero__device-card-img">
                            <img src={p.image} alt={p.name} onError={(e) => { e.target.style.display='none'; }} />
                          </div>
                          <div className="hero__device-card-info">
                            <div className="hero__device-badge">-{discount}% OFF</div>
                            <div className="hero__device-name">{p.name}</div>
                            <div className="hero__device-price" style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                              ₹{p.price.toLocaleString('en-IN')}
                              <span style={{ textDecoration: 'line-through', color: '#94a3b8', fontSize: '11px', fontWeight: 500 }}>
                                ₹{p.originalPrice.toLocaleString('en-IN')}
                              </span>
                            </div>
                            <div className="hero__device-cta">Quick Look</div>
                          </div>
                        </Link>
                      );
                    })
                  ) : (
                    <div className="hero__device-card" style={{ borderBottom: 'none' }}>
                      <div className="hero__device-card-img">
                        <img src="https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-7inch-bluetitanium?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1693009278" alt="iPhone" onError={(e) => { e.target.style.display='none'; }} />
                      </div>
                      <div className="hero__device-card-info">
                        <div className="hero__device-badge">AI Recommended</div>
                        <div className="hero__device-name">iPhone 15 Pro Max</div>
                        <div className="hero__device-price">₹1,29,900</div>
                        <div className="hero__device-cta">Add to Cart</div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="hero__device-row">
                  <div className="hero__device-mini"><Icon name="truck" size={14} /><span>Free delivery</span></div>
                  <div className="hero__device-mini"><Icon name="shield" size={14} /><span>Secure checkout</span></div>
                </div>
              </div>
            </div>
            <div className="hero__side-stat hero__side-stat--1" style={{ transform: `translateY(${heroScrollY * 0.35}px)` }}>
              <div className="hero__side-stat-icon"><Icon name="zap" size={16} /></div>
              <div><div className="hero__side-stat-num">2-day</div><div className="hero__side-stat-label">Delivery</div></div>
            </div>
            <div className="hero__side-stat hero__side-stat--2" style={{ transform: `translateY(${heroScrollY * 0.22}px)` }}>
              <div className="hero__side-stat-icon"><Icon name="star" size={16} /></div>
              <div><div className="hero__side-stat-num">4.9★</div><div className="hero__side-stat-label">Rating</div></div>
            </div>
            <div className="hero__side-stat hero__side-stat--3" style={{ transform: `translateY(${heroScrollY * 0.4}px)` }}>
              <div className="hero__side-stat-icon"><Icon name="brain" size={16} /></div>
              <div><div className="hero__side-stat-num">AI</div><div className="hero__side-stat-label">Assistant</div></div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="trust-bar">
        <div className="container trust-bar__inner">
          {TRUST_ITEMS.map((item, i) => (
            <div key={i} className="trust-bar__item">
              <div className="trust-bar__icon"><Icon name={item.icon} size={20} /></div>
              <div>
                <div className="trust-bar__title">{item.title}</div>
                <div className="trust-bar__sub">{item.subtitle}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="section categories-section">
        <div className="container">
          <div className="section-header">
            <div>
              <p className="section-label">Explore</p>
              <h2 className="section-title">Shop by Category</h2>
            </div>
            <Link to="/products" className="section-link">All Categories <Icon name="arrowRight" size={14} /></Link>
          </div>
          <div className="categories-grid">
            {MOCK_CATEGORIES.map((cat) => (
              <Link key={cat.slug} to={`/products?category=${cat.slug}`} className="category-card">
                <div className="category-card__icon"><Icon name={cat.icon} size={28} /></div>
                <div className="category-card__name">{cat.label}</div>
                <div className="category-card__count">{cat.count} products</div>
                <div className="category-card__arrow"><Icon name="arrowRight" size={14} /></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="section products-section">
        <div className="container">
          <div className="section-header">
            <div>
              <p className="section-label">Curated for You</p>
              <h2 className="section-title">Trending Products</h2>
            </div>
            <Link to="/products" className="section-link">View All <Icon name="arrowRight" size={14} /></Link>
          </div>
          <div className="filter-tabs">
            {FILTER_TABS.map((tab) => (
              <button key={tab} className={`filter-tab ${activeTab === tab ? 'filter-tab--active' : ''}`} onClick={() => setActiveTab(tab)}>
                {tab}
              </button>
            ))}
          </div>
          {loading ? (
            <div className="products-grid">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="product-card-skeleton">
                  <div className="skeleton skeleton--img" />
                  <div className="skeleton-body">
                    <div className="skeleton skeleton--text" style={{ width: '60%' }} />
                    <div className="skeleton skeleton--text" style={{ width: '80%' }} />
                    <div className="skeleton skeleton--text" style={{ width: '40%' }} />
                    <div className="skeleton skeleton--btn" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="products-grid">
              {filteredProducts.map((p) => (
                <ProductCard key={p._id} product={p} onAddToCart={handleAddToCart} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state__icon"><Icon name="package" size={40} /></div>
              <div className="empty-state__title">No products in this category yet</div>
              <div className="empty-state__sub">Check back soon or browse all products</div>
              <Link to="/products" className="hero__btn hero__btn--primary" style={{ marginTop: 16, display: 'inline-flex' }}>Browse All</Link>
            </div>
          )}
        </div>
      </section>

      {/* AI BANNER */}
      <section className="section">
        <div className="container">
          <div className="ai-banner">
            <div className="ai-banner__left">
              <div className="ai-banner__icon-wrap"><Icon name="brain" size={28} /></div>
              <div className="ai-banner__content">
                <h3 className="ai-banner__title">Let AI Shop For You</h3>
                <p className="ai-banner__text">
                  Tell our AI what you need — it finds the best products, compares prices,
                  and delivers personalized recommendations instantly.
                </p>
                <div className="ai-banner__chips">
                  {AI_CHIPS.map((chip, i) => (
                    <button key={i} className="ai-banner__chip" onClick={() => window.dispatchEvent(new CustomEvent('open-chatbot'))}>
                      {chip}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <button className="hero__btn hero__btn--primary ai-banner__cta" onClick={() => window.dispatchEvent(new CustomEvent('open-chatbot'))}>
              <Icon name="brain" size={16} /> Start AI Chat
            </button>
          </div>
        </div>
      </section>

      {/* FOUNDERS */}
      <section className="section founders-section">
        <div className="container">
          <div className="section-header">
            <div>
              <p className="section-label">The People Behind AIShop</p>
              <h2 className="section-title">Meet the Founders</h2>
            </div>
          </div>
          <div className="founders-grid">
            {FOUNDERS.map((f) => (
              <div
                key={f.name}
                className="founder-card"
                onClick={() => setActiveFounder(f)}
              >
                <div className="founder-card__img-wrap">
                  <img
                    src={f.image}
                    alt={f.name}
                    className="founder-card__img"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="founder-card__img-fallback" style={{ display: 'none' }}>
                    {f.initials}
                  </div>
                  <div className="founder-card__img-overlay">
                    <span className="founder-card__view-hint">Click to view</span>
                  </div>
                </div>
                <div className="founder-card__body">
                  <div className="founder-card__quote-icon">
                    <Icon name="quote" size={20} />
                  </div>
                  <p className="founder-card__bio">"{f.bio}"</p>
                  <div className="founder-card__footer">
                    <div className="founder-card__name">{f.name}</div>
                    <a
                      href={f.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="founder-card__linkedin"
                      aria-label="LinkedIn"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Icon name="linkedin" size={16} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOUNDER MODAL */}
      {activeFounder && (
        <div className="founder-modal-overlay" onClick={() => setActiveFounder(null)}>
          <div className="founder-modal" onClick={(e) => e.stopPropagation()}>
            <button className="founder-modal__close" onClick={() => setActiveFounder(null)}>
              <Icon name="close" size={18} />
            </button>
            <div className="founder-modal__img-wrap">
              <img
                src={activeFounder.image}
                alt={activeFounder.name}
                className="founder-modal__img"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="founder-modal__img-fallback" style={{ display: 'none' }}>
                {activeFounder.initials}
              </div>
            </div>
            <div className="founder-modal__body">
              <div className="founder-modal__quote-icon">
                <Icon name="quote" size={22} />
              </div>
              <p className="founder-modal__bio">"{activeFounder.bio}"</p>
              <div className="founder-modal__footer">
                <span className="founder-modal__name">{activeFounder.name}</span>
                <a
                  href={activeFounder.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="founder-modal__linkedin-btn"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Icon name="linkedin" size={16} /> View LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DEALS BANNER */}
      <section className="deals-banner">
        <div className="container deals-banner__inner">
          <div className="deals-banner__left">
            <div className="deals-banner__eyebrow">
              <Icon name="tag" size={13} /> Limited Time Offer
            </div>
            <h2 className="deals-banner__title">Flash Sale — Up to 40% Off</h2>
            <p className="deals-banner__sub">Handpicked deals on top electronics. Ends Sunday midnight.</p>
            <Link to="/products?sort=deals" className="deals-banner__btn">
              View All Deals <Icon name="arrowRight" size={15} />
            </Link>
          </div>
          <div className="deals-banner__right">
            {[
              { name: 'AirPods Pro',    newPrice: '₹24,900',   oldPrice: '₹26,900',   pct: '-11%', icon: 'headphones' },
              { name: 'MacBook Air M3', newPrice: '₹1,14,900', oldPrice: '₹1,29,900', pct: '-15%', icon: 'laptop' },
            ].map((deal, i) => (
              <div key={i} className="deals-banner__card">
                <div className="deals-banner__card-icon"><Icon name={deal.icon} size={36} /></div>
                <div className="deals-banner__card-name">{deal.name}</div>
                <div className="deals-banner__card-prices">
                  <span className="deals-banner__card-new">{deal.newPrice}</span>
                  <span className="deals-banner__card-old">{deal.oldPrice}</span>
                </div>
                <span className="deals-banner__card-badge">{deal.pct} OFF</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="newsletter">
        <div className="container newsletter__inner">
          {subscribed ? (
            <div className="newsletter__success">
              <div className="newsletter__success-icon"><Icon name="check" size={28} /></div>
              <h2 className="newsletter__success-title">You're subscribed!</h2>
              <p className="newsletter__success-sub">Check your inbox for your 10% off coupon.</p>
            </div>
          ) : (
            <>
              <div className="newsletter__text">
                <div className="newsletter__icon"><Icon name="mail" size={22} /></div>
                <h2 className="newsletter__title">Get 10% Off Your First Order</h2>
                <p className="newsletter__sub">Join 50,000+ shoppers getting exclusive deals and AI-curated picks.</p>
              </div>
              <form className="newsletter__form" onSubmit={handleSubscribe}>
                <div className="newsletter__input-wrap">
                  <span className="newsletter__input-icon"><Icon name="mail" size={16} /></span>
                  <input type="email" className="newsletter__input" placeholder="Enter your email address" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <button type="submit" className="newsletter__btn">Subscribe <Icon name="arrowRight" size={15} /></button>
              </form>
              <p className="newsletter__privacy"><Icon name="lock" size={13} /> No spam, ever. Unsubscribe anytime.</p>
            </>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container">
          <div className="footer__top">
            <div className="footer__brand">
              <Link to="/" className="footer__logo"><LogoMark /><span>AI<span>Shop</span></span></Link>
              <p className="footer__tagline">The future of shopping powered by artificial intelligence. Better deals, smarter choices, every time.</p>
              <div className="footer__socials">
                {[
                  { icon: 'twitter',   label: 'Twitter' },
                  { icon: 'instagram', label: 'Instagram' },
                  { icon: 'linkedin',  label: 'LinkedIn' },
                ].map((s) => (
                  <a key={s.icon} href="#" className="footer__social" aria-label={s.label}>
                    <Icon name={s.icon} size={16} />
                  </a>
                ))}
              </div>
            </div>
            <div className="footer__col">
              <div className="footer__col-title">Shop</div>
              <Link to="/products" className="footer__link">All Products</Link>
              <Link to="/products?category=phones" className="footer__link">Phones</Link>
              <Link to="/products?category=laptops" className="footer__link">Laptops</Link>
              <Link to="/products?sort=deals" className="footer__link">Deals</Link>
              <Link to="/products?sort=newest" className="footer__link">New Arrivals</Link>
            </div>
            <div className="footer__col">
              <div className="footer__col-title">Support</div>
              <Link to="/contact" className="footer__link">Help Center</Link>
              <Link to="/contact" className="footer__link">Contact Us</Link>
              <a href="#" className="footer__link">AI Assistant</a>
              <a href="#" className="footer__link">Shipping Info</a>
              <a href="#" className="footer__link">Returns</a>
            </div>
            <div className="footer__col">
              <div className="footer__col-title">Company</div>
              <Link to="/about" className="footer__link">About Us</Link>
              <a href="#" className="footer__link">Careers</a>
              <a href="#" className="footer__link">Press</a>
              <a href="#" className="footer__link">Blog</a>
            </div>
          </div>
          <div className="footer__bottom">
            <p className="footer__copy">© 2026 AIShop. All rights reserved.</p>
            <div className="footer__legal">
              <a href="#" className="footer__legal-link">Terms</a>
              <a href="#" className="footer__legal-link">Privacy</a>
              <a href="#" className="footer__legal-link">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}