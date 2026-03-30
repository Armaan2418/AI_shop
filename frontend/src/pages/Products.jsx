import { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/cartSlice';
import { productService } from '../services/productService';
import './Products.css';

// ── Data ──────────────────────────────────────────────────────────────
const MOCK_PRODUCTS = [
  // Phones
  { _id: '1',  name: 'iPhone 15 Pro Max',      category: 'phones',      price: 129900, originalPrice: 149900, rating: 4.8, reviewCount: 2145, badge: 'AI Pick', inStock: true,  brand: 'Apple',     image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&q=80' },
  { _id: '6',  name: 'iPad Pro M4',             category: 'phones',      price: 89900,  originalPrice: null,   rating: 4.9, reviewCount: 760,  badge: null,      inStock: false, brand: 'Apple',     image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&q=80' },
  { _id: '9',  name: 'Google Pixel 8 Pro',      category: 'phones',      price: 74999,  originalPrice: 84999,  rating: 4.6, reviewCount: 1230, badge: 'Sale',    inStock: true,  brand: 'Google',    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&q=80' },
  { _id: '22', name: 'Samsung Galaxy S24 Ultra', category: 'phones',     price: 134999, originalPrice: null,   rating: 4.8, reviewCount: 1780, badge: null,      inStock: true,  brand: 'Samsung',   image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&q=80' },
  { _id: '23', name: 'OnePlus 12',              category: 'phones',      price: 64999,  originalPrice: 74999,  rating: 4.7, reviewCount: 932,  badge: 'Sale',    inStock: true,  brand: 'OnePlus',   image: 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=400&q=80' },
  { _id: '24', name: 'Realme Narzo 70 Pro',     category: 'phones',      price: 23999,  originalPrice: 26999,  rating: 4.4, reviewCount: 412,  badge: null,      inStock: true,  brand: 'Realme',    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80' },
  // Laptops
  { _id: '2',  name: 'MacBook Air M3',          category: 'laptops',     price: 114900, originalPrice: null,   rating: 4.9, reviewCount: 1820, badge: null,      inStock: true,  brand: 'Apple',     image: 'https://images.unsplash.com/photo-1611186871525-b9e8b073b50a?w=400&q=80' },
  { _id: '10', name: 'Dell XPS 15',             category: 'laptops',     price: 149990, originalPrice: null,   rating: 4.7, reviewCount: 680,  badge: null,      inStock: true,  brand: 'Dell',      image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&q=80' },
  { _id: '25', name: 'HP Spectre x360',         category: 'laptops',     price: 124990, originalPrice: 144990, rating: 4.7, reviewCount: 520,  badge: 'AI Pick', inStock: true,  brand: 'HP',        image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&q=80' },
  { _id: '26', name: 'Lenovo IdeaPad 5',        category: 'laptops',     price: 69990,  originalPrice: 79990,  rating: 4.5, reviewCount: 870,  badge: 'Sale',    inStock: true,  brand: 'Lenovo',    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80' },
  // Audio
  { _id: '3',  name: 'AirPods Pro 2nd Gen',     category: 'audio',       price: 24900,  originalPrice: 26900,  rating: 4.7, reviewCount: 3210, badge: 'Sale',    inStock: true,  brand: 'Apple',     image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400&q=80' },
  { _id: '5',  name: 'Sony WH-1000XM5',        category: 'audio',       price: 26990,  originalPrice: 34990,  rating: 4.8, reviewCount: 4120, badge: 'AI Pick', inStock: true,  brand: 'Sony',      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80' },
  { _id: '12', name: 'Bose QC45',               category: 'audio',       price: 24900,  originalPrice: 29900,  rating: 4.6, reviewCount: 2870, badge: 'Sale',    inStock: true,  brand: 'Bose',      image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&q=80' },
  { _id: '27', name: 'JBL Tune 770NC',          category: 'audio',       price: 9999,   originalPrice: 12999,  rating: 4.5, reviewCount: 1450, badge: 'Sale',    inStock: true,  brand: 'JBL',       image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&q=80' },
  { _id: '28', name: 'Sennheiser Momentum 4',   category: 'audio',       price: 29990,  originalPrice: 34990,  rating: 4.8, reviewCount: 680,  badge: 'AI Pick', inStock: true,  brand: 'Sennheiser',image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&q=80' },
  // Wearables
  { _id: '4',  name: 'Galaxy Watch 6',          category: 'wearables',   price: 26999,  originalPrice: null,   rating: 4.6, reviewCount: 890,  badge: null,      inStock: true,  brand: 'Samsung',   image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80' },
  { _id: '11', name: 'Apple Watch Ultra 2',     category: 'wearables',   price: 89900,  originalPrice: null,   rating: 4.8, reviewCount: 940,  badge: 'AI Pick', inStock: true,  brand: 'Apple',     image: 'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=400&q=80' },
  { _id: '29', name: 'Fitbit Sense 2',          category: 'wearables',   price: 15990,  originalPrice: 19990,  rating: 4.4, reviewCount: 560,  badge: 'Sale',    inStock: true,  brand: 'Fitbit',    image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400&q=80' },
  { _id: '30', name: 'Garmin Forerunner 255',   category: 'wearables',   price: 32990,  originalPrice: null,   rating: 4.7, reviewCount: 310,  badge: null,      inStock: true,  brand: 'Garmin',    image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400&q=80' },
  // Gaming
  { _id: '7',  name: 'PS5 DualSense',           category: 'gaming',      price: 6490,   originalPrice: 6990,   rating: 4.7, reviewCount: 5400, badge: 'Sale',    inStock: true,  brand: 'Sony',      image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400&q=80' },
  { _id: '31', name: 'Nintendo Switch Lite',    category: 'gaming',      price: 19990,  originalPrice: null,   rating: 4.7, reviewCount: 2100, badge: null,      inStock: true,  brand: 'Nintendo',  image: 'https://images.unsplash.com/photo-1585620385456-4759f9b5c7d9?w=400&q=80' },
  { _id: '32', name: 'Xbox Wireless Controller',category: 'gaming',      price: 5990,   originalPrice: 6990,   rating: 4.6, reviewCount: 1340, badge: 'Sale',    inStock: true,  brand: 'Microsoft', image: 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=400&q=80' },
  { _id: '33', name: 'Razer Kraken Headset',    category: 'gaming',      price: 4999,   originalPrice: 6999,   rating: 4.5, reviewCount: 890,  badge: 'Sale',    inStock: true,  brand: 'Razer',     image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&q=80' },
  // Accessories
  { _id: '8',  name: 'Samsung 4K Monitor',      category: 'accessories', price: 42999,  originalPrice: 52999,  rating: 4.5, reviewCount: 430,  badge: null,      inStock: true,  brand: 'Samsung',   image: 'https://images.unsplash.com/photo-1527443224154-c4a573d5f6b4?w=400&q=80' },
  { _id: '34', name: 'Anker 100W GaN Charger',  category: 'accessories', price: 2999,   originalPrice: 3999,   rating: 4.6, reviewCount: 2100, badge: 'Sale',    inStock: true,  brand: 'Anker',     image: 'https://images.unsplash.com/photo-1601999009162-2459b9446d6e?w=400&q=80' },
  { _id: '35', name: 'Logitech MX Keys',        category: 'accessories', price: 8995,   originalPrice: 10995,  rating: 4.8, reviewCount: 1560, badge: 'AI Pick', inStock: true,  brand: 'Logitech',  image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&q=80' },
  // Clothing
  { _id: '13', name: 'Classic White Tee',       category: 'clothing',    price: 999,    originalPrice: 1499,   rating: 4.5, reviewCount: 1240, badge: 'Sale',    inStock: true,  brand: 'Zara',      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80' },
  { _id: '14', name: 'Slim Fit Denim Jacket',   category: 'clothing',    price: 2999,   originalPrice: 4499,   rating: 4.6, reviewCount: 540,  badge: null,      inStock: true,  brand: 'Levis',     image: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=400&q=80' },
  { _id: '15', name: 'Floral Maxi Dress',       category: 'clothing',    price: 1999,   originalPrice: 2999,   rating: 4.7, reviewCount: 820,  badge: 'AI Pick', inStock: true,  brand: 'H&M',       image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&q=80' },
  { _id: '36', name: 'Polo T-Shirt',            category: 'clothing',    price: 1299,   originalPrice: null,   rating: 4.4, reviewCount: 780,  badge: null,      inStock: true,  brand: 'U.S. Polo', image: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400&q=80' },
  { _id: '37', name: 'Zip-up Hoodie',           category: 'clothing',    price: 1999,   originalPrice: 2999,   rating: 4.6, reviewCount: 630,  badge: 'Sale',    inStock: true,  brand: 'Zara',      image: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=400&q=80' },
  { _id: '38', name: 'Sports Shorts',           category: 'clothing',    price: 799,    originalPrice: 999,    rating: 4.3, reviewCount: 450,  badge: 'Sale',    inStock: true,  brand: 'Nike',      image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=400&q=80' },
  // Fashion
  { _id: '16', name: 'Leather Handbag',         category: 'fashion',     price: 7499,   originalPrice: 9999,   rating: 4.7, reviewCount: 876,  badge: 'AI Pick', inStock: true,  brand: 'Coach',     image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80' },
  { _id: '17', name: 'Designer Sunglasses',     category: 'fashion',     price: 12999,  originalPrice: 15999,  rating: 4.8, reviewCount: 430,  badge: 'Sale',    inStock: true,  brand: 'Ray-Ban',   image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&q=80' },
  { _id: '18', name: 'Gold Chain Necklace',     category: 'fashion',     price: 3499,   originalPrice: null,   rating: 4.6, reviewCount: 320,  badge: null,      inStock: true,  brand: 'Pandora',   image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80' },
  { _id: '39', name: 'Pearl Drop Earrings',     category: 'fashion',     price: 1999,   originalPrice: null,   rating: 4.7, reviewCount: 290,  badge: 'AI Pick', inStock: true,  brand: 'Mia',       image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=400&q=80' },
  { _id: '40', name: 'Silk Scarf',              category: 'fashion',     price: 2999,   originalPrice: 4999,   rating: 4.5, reviewCount: 180,  badge: 'Sale',    inStock: true,  brand: 'Da Milano', image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400&q=80' },
  { _id: '41', name: 'Canvas Tote Bag',         category: 'fashion',     price: 1499,   originalPrice: null,   rating: 4.4, reviewCount: 510,  badge: null,      inStock: true,  brand: 'Aldo',      image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&q=80' },
  // Makeup
  { _id: '19', name: 'Matte Lipstick Set',      category: 'makeup',      price: 1499,   originalPrice: 1999,   rating: 4.8, reviewCount: 2310, badge: 'Sale',    inStock: true,  brand: 'MAC',       image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80' },
  { _id: '20', name: 'Foundation & Concealer',  category: 'makeup',      price: 1999,   originalPrice: null,   rating: 4.7, reviewCount: 1890, badge: 'AI Pick', inStock: true,  brand: 'NYX',       image: 'https://images.unsplash.com/photo-1631214499178-338dc7a3e0cb?w=400&q=80' },
  { _id: '21', name: 'Eyeshadow Palette',       category: 'makeup',      price: 2499,   originalPrice: 2999,   rating: 4.9, reviewCount: 3100, badge: 'AI Pick', inStock: true,  brand: 'Urban Decay',image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&q=80' },
  { _id: '42', name: 'Setting Powder',          category: 'makeup',      price: 1799,   originalPrice: 2499,   rating: 4.6, reviewCount: 940,  badge: null,      inStock: true,  brand: 'Laura Mercier', image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&q=80' },
  { _id: '43', name: 'Mascara Duo Pack',        category: 'makeup',      price: 999,    originalPrice: 1299,   rating: 4.5, reviewCount: 1670, badge: 'Sale',    inStock: true,  brand: 'Maybelline', image: 'https://images.unsplash.com/photo-1631214524020-3c69bec1f8c0?w=400&q=80' },
  // New additions satisfying brand depth
  { _id: '45', name: 'Galaxy Z Fold 5',         category: 'phones',      price: 154999, originalPrice: 164999, rating: 4.8, reviewCount: 920,  badge: 'AI Pick', inStock: true,  brand: 'Samsung',   image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&q=80' },
  { _id: '46', name: 'Galaxy Tab S9 Ultra',     category: 'phones',      price: 119999, originalPrice: null,   rating: 4.9, reviewCount: 410,  badge: null,      inStock: true,  brand: 'Samsung',   image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&q=80' },
  { _id: '47', name: 'Galaxy Buds2 Pro',        category: 'audio',       price: 16999,  originalPrice: 19999,  rating: 4.7, reviewCount: 1250, badge: 'Sale',    inStock: true,  brand: 'Samsung',   image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400&q=80' },
  { _id: '48', name: 'Mac Studio M2 Max',       category: 'laptops',     price: 199900, originalPrice: null,   rating: 4.9, reviewCount: 210,  badge: 'AI Pick', inStock: false, brand: 'Apple',     image: 'https://images.unsplash.com/photo-1611186871525-b9e8b073b50a?w=400&q=80' },
  { _id: '49', name: 'AirPods Max',             category: 'audio',       price: 59900,  originalPrice: null,   rating: 4.8, reviewCount: 890,  badge: null,      inStock: true,  brand: 'Apple',     image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&q=80' },
  { _id: '50', name: 'Sony Bravia 65" OLED',    category: 'accessories', price: 249990, originalPrice: 289990, rating: 4.8, reviewCount: 340,  badge: 'Sale',    inStock: true,  brand: 'Sony',      image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=400&q=80' },
  { _id: '51', name: 'Sony PlayStation 5',      category: 'gaming',      price: 54990,  originalPrice: null,   rating: 4.9, reviewCount: 8900, badge: 'AI Pick', inStock: true,  brand: 'Sony',      image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400&q=80' },
  { _id: '52', name: 'Nintendo Switch OLED',    category: 'gaming',      price: 34990,  originalPrice: null,   rating: 4.8, reviewCount: 3100, badge: null,      inStock: true,  brand: 'Nintendo',  image: 'https://images.unsplash.com/photo-1585620385456-4759f9b5c7d9?w=400&q=80' },
  { _id: '53', name: 'Nintendo Pro Controller', category: 'gaming',      price: 6990,   originalPrice: null,   rating: 4.9, reviewCount: 1540, badge: null,      inStock: true,  brand: 'Nintendo',  image: 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=400&q=80' },
  { _id: '54', name: 'Nike Air Force 1',        category: 'clothing',    price: 8495,   originalPrice: null,   rating: 4.8, reviewCount: 12500,badge: 'AI Pick', inStock: true,  brand: 'Nike',      image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&q=80' },
  { _id: '55', name: 'Nike Dri-FIT Tee',        category: 'clothing',    price: 1495,   originalPrice: 1995,   rating: 4.6, reviewCount: 890,  badge: 'Sale',    inStock: true,  brand: 'Nike',      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80' },
  { _id: '56', name: 'Nike Running Shoes',      category: 'clothing',    price: 11995,  originalPrice: null,   rating: 4.7, reviewCount: 3200, badge: null,      inStock: true,  brand: 'Nike',      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80' },
  { _id: '57', name: 'Zara Leather Jacket',     category: 'clothing',    price: 5990,   originalPrice: 7990,   rating: 4.7, reviewCount: 420,  badge: 'Sale',    inStock: true,  brand: 'Zara',      image: 'https://images.unsplash.com/photo-1551028719-01c1eb562661?w=400&q=80' },
  { _id: '58', name: 'Zara Chelsea Boots',      category: 'clothing',    price: 4990,   originalPrice: null,   rating: 4.5, reviewCount: 310,  badge: null,      inStock: true,  brand: 'Zara',      image: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=400&q=80' },
  { _id: '59', name: 'MAC Studio Fix Fluid',    category: 'makeup',      price: 3300,   originalPrice: null,   rating: 4.8, reviewCount: 5600, badge: 'AI Pick', inStock: true,  brand: 'MAC',       image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80' },
  { _id: '60', name: 'MAC Prep + Prime',        category: 'makeup',      price: 2400,   originalPrice: 2800,   rating: 4.7, reviewCount: 2100, badge: 'Sale',    inStock: true,  brand: 'MAC',       image: 'https://images.unsplash.com/photo-1631214499178-338dc7a3e0cb?w=400&q=80' },
  { _id: '61', name: 'Urban Decay Setting Spray',category: 'makeup',     price: 2900,   originalPrice: null,   rating: 4.9, reviewCount: 4300, badge: 'AI Pick', inStock: true,  brand: 'Urban Decay',image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&q=80' },
  { _id: '62', name: 'Urban Decay Primer',      category: 'makeup',      price: 2200,   originalPrice: 2600,   rating: 4.6, reviewCount: 1800, badge: 'Sale',    inStock: true,  brand: 'Urban Decay',image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&q=80' },
  { _id: '63', name: 'Ray-Ban Aviator Classic', category: 'fashion',     price: 9490,   originalPrice: null,   rating: 4.8, reviewCount: 5200, badge: 'AI Pick', inStock: true,  brand: 'Ray-Ban',   image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&q=80' },
  { _id: '64', name: 'Ray-Ban Wayfarer',        category: 'fashion',     price: 8990,   originalPrice: 10490,  rating: 4.7, reviewCount: 3800, badge: 'Sale',    inStock: true,  brand: 'Ray-Ban',   image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&q=80' },
  { _id: '65', name: 'Coach Crossbody Bag',     category: 'fashion',     price: 18900,  originalPrice: 22900,  rating: 4.8, reviewCount: 920,  badge: 'Sale',    inStock: true,  brand: 'Coach',     image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80' },
  { _id: '66', name: 'Coach Wallet',            category: 'fashion',     price: 6500,   originalPrice: null,   rating: 4.6, reviewCount: 450,  badge: null,      inStock: true,  brand: 'Coach',     image: 'https://images.unsplash.com/photo-1628151015968-3a4429e9ef04?w=400&q=80' },
  { _id: '67', name: 'Realme Buds Air 5 Pro',   category: 'audio',       price: 4999,   originalPrice: 5999,   rating: 4.5, reviewCount: 1200, badge: 'Sale',    inStock: true,  brand: 'Realme',    image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400&q=80' },
  { _id: '68', name: 'Realme Watch 3 Pro',      category: 'wearables',   price: 4499,   originalPrice: null,   rating: 4.3, reviewCount: 890,  badge: null,      inStock: true,  brand: 'Realme',    image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400&q=80' },
  { _id: '69', name: 'OnePlus Buds Pro 2',      category: 'audio',       price: 11999,  originalPrice: 13999,  rating: 4.6, reviewCount: 760,  badge: 'Sale',    inStock: true,  brand: 'OnePlus',   image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&q=80' },
  { _id: '70', name: 'OnePlus Pad',             category: 'phones',      price: 37999,  originalPrice: 39999,  rating: 4.7, reviewCount: 420,  badge: null,      inStock: true,  brand: 'OnePlus',   image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&q=80' },
  // Ultra-Expanded Fashion & Clothing
  { _id: '71', name: 'Zara Oversized Blazer',   category: 'clothing',    price: 4999,   originalPrice: 6999,   rating: 4.8, reviewCount: 2200, badge: 'AI Pick', inStock: true,  brand: 'Zara',      image: 'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=400&q=80' },
  { _id: '72', name: 'Nike Sportswear Tech Fleece', category: 'clothing', price: 7495,  originalPrice: null,   rating: 4.9, reviewCount: 4100, badge: 'Sale',    inStock: true,  brand: 'Nike',      image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&q=80' },
  { _id: '73', name: 'Levis 501 Original Jeans',category: 'clothing',    price: 3499,   originalPrice: 4299,   rating: 4.7, reviewCount: 8900, badge: null,      inStock: true,  brand: 'Levis',     image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&q=80' },
  { _id: '74', name: 'H&M Knit Sweater',        category: 'clothing',    price: 1999,   originalPrice: null,   rating: 4.5, reviewCount: 1540, badge: null,      inStock: true,  brand: 'H&M',       image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&q=80' },
  { _id: '75', name: 'U.S. Polo Linen Shirt',   category: 'clothing',    price: 1799,   originalPrice: 2499,   rating: 4.6, reviewCount: 920,  badge: 'Sale',    inStock: true,  brand: 'U.S. Polo', image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&q=80' },
  { _id: '76', name: 'Nike Air Max 270',        category: 'clothing',    price: 12995,  originalPrice: 14995,  rating: 4.8, reviewCount: 6300, badge: 'AI Pick', inStock: true,  brand: 'Nike',      image: 'https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=400&q=80' },
  { _id: '77', name: 'Zara Trench Coat',        category: 'clothing',    price: 8990,   originalPrice: null,   rating: 4.7, reviewCount: 430,  badge: null,      inStock: true,  brand: 'Zara',      image: 'https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=400&q=80' },
  { _id: '78', name: 'H&M Pleated Skirt',       category: 'clothing',    price: 1499,   originalPrice: 1999,   rating: 4.4, reviewCount: 890,  badge: 'Sale',    inStock: true,  brand: 'H&M',       image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=400&q=80' },
  { _id: '79', name: 'Coach Tabby Shoulder Bag',category: 'fashion',     price: 34500,  originalPrice: null,   rating: 4.9, reviewCount: 1200, badge: 'AI Pick', inStock: true,  brand: 'Coach',     image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&q=80' },
  { _id: '80', name: 'Pandora Charm Bracelet',  category: 'fashion',     price: 8999,   originalPrice: 10999,  rating: 4.8, reviewCount: 3100, badge: 'Sale',    inStock: true,  brand: 'Pandora',   image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&q=80' },
  { _id: '81', name: 'Da Milano Tote',          category: 'fashion',     price: 12499,  originalPrice: 15999,  rating: 4.6, reviewCount: 540,  badge: null,      inStock: true,  brand: 'Da Milano', image: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=400&q=80' },
  { _id: '82', name: 'Ray-Ban Clubmaster',      category: 'fashion',     price: 11290,  originalPrice: null,   rating: 4.7, reviewCount: 1800, badge: null,      inStock: true,  brand: 'Ray-Ban',   image: 'https://images.unsplash.com/photo-1572635196184-84e35138cf62?w=400&q=80' },
  { _id: '83', name: 'Aldo Block Heels',        category: 'fashion',     price: 6999,   originalPrice: 8999,   rating: 4.5, reviewCount: 920,  badge: 'Sale',    inStock: true,  brand: 'Aldo',      image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&q=80' },
  { _id: '84', name: 'Mia Diamond Ring',        category: 'fashion',     price: 45999,  originalPrice: 52999,  rating: 4.9, reviewCount: 210,  badge: 'AI Pick', inStock: true,  brand: 'Mia',       image: 'https://images.unsplash.com/photo-1605100804763-247f67b254a4?w=400&q=80' },
  { _id: '85', name: 'MAC Ruby Woo Lipstick',   category: 'makeup',      price: 1950,   originalPrice: null,   rating: 4.9, reviewCount: 8900, badge: 'AI Pick', inStock: true,  brand: 'MAC',       image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&q=80' },
  { _id: '86', name: 'NYX Setting Spray Matte', category: 'makeup',      price: 899,    originalPrice: 1199,   rating: 4.6, reviewCount: 5400, badge: 'Sale',    inStock: true,  brand: 'NYX',       image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&q=80' },
  { _id: '87', name: 'Urban Decay Naked Palette',category: 'makeup',     price: 4900,   originalPrice: 5500,   rating: 4.8, reviewCount: 4200, badge: null,      inStock: true,  brand: 'Urban Decay',image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&q=80' },
  { _id: '88', name: 'Maybelline Fit Me Foundation',category: 'makeup',  price: 649,    originalPrice: 799,    rating: 4.5, reviewCount: 12500,badge: 'Sale',    inStock: true,  brand: 'Maybelline', image: 'https://images.unsplash.com/photo-1631214500115-598fc2cb8d2d?w=400&q=80' },
  { _id: '89', name: 'Laura Mercier Setting Powder',category: 'makeup',  price: 3600,   originalPrice: null,   rating: 4.9, reviewCount: 2800, badge: 'AI Pick', inStock: true,  brand: 'Laura Mercier', image: 'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?w=400&q=80' },
];

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
  const [wished,   setWished]   = useState(false);
  const [imgError, setImgError] = useState(false);

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  const handleWish = (e) => {
    e.preventDefault();
    setWished(w => !w);
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!product.inStock) return;
    onAddToCart(product);
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

        <button className={`pcard__wish ${wished ? 'pcard__wish--active' : ''}`} onClick={handleWish} aria-label="Wishlist">
          <Icon name={wished ? 'heartFill' : 'heart'} size={14} />
        </button>

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

        <button
          className={`pcard__add-btn ${isAdded ? 'pcard__add-btn--added' : ''} ${!product.inStock ? 'pcard__add-btn--disabled' : ''}`}
          onClick={handleAdd}
          disabled={!product.inStock}
        >
          {isAdded
            ? <><Icon name="check" size={14} /> Added to Cart</>
            : !product.inStock
            ? 'Out of Stock'
            : <><Icon name="cart" size={14} /> Add to Cart</>}
        </button>
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
                  <span className="sidebar-price-prefix">$</span>
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
                  <span className="sidebar-price-prefix">$</span>
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
                    ${minPrice || '0'} – ${maxPrice || '∞'}
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