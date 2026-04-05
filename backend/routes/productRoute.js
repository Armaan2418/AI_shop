import express from 'express';

const router = express.Router();

// ── Mock product data (mirrors frontend MOCK_PRODUCTS) ─────────────────────
// The AI route calls GET /api/products to get a list it can recommend from.
// Until a real Product model exists, we serve this lightweight version.
const PRODUCTS = [
  { _id: '1',  name: 'iPhone 15 Pro Max',        category: 'phones',      price: 129900, brand: 'Apple',       rating: 4.8 },
  { _id: '6',  name: 'iPad Pro M4',               category: 'phones',      price: 89900,  brand: 'Apple',       rating: 4.9 },
  { _id: '9',  name: 'Google Pixel 8 Pro',        category: 'phones',      price: 74999,  brand: 'Google',      rating: 4.6 },
  { _id: '22', name: 'Samsung Galaxy S24 Ultra',  category: 'phones',      price: 134999, brand: 'Samsung',     rating: 4.8 },
  { _id: '23', name: 'OnePlus 12',                category: 'phones',      price: 64999,  brand: 'OnePlus',     rating: 4.7 },
  { _id: '24', name: 'Realme Narzo 70 Pro',       category: 'phones',      price: 23999,  brand: 'Realme',      rating: 4.4 },
  { _id: '45', name: 'Galaxy Z Fold 5',           category: 'phones',      price: 154999, brand: 'Samsung',     rating: 4.8 },
  { _id: '2',  name: 'MacBook Air M3',            category: 'laptops',     price: 114900, brand: 'Apple',       rating: 4.9 },
  { _id: '10', name: 'Dell XPS 15',               category: 'laptops',     price: 149990, brand: 'Dell',        rating: 4.7 },
  { _id: '25', name: 'HP Spectre x360',           category: 'laptops',     price: 124990, brand: 'HP',          rating: 4.7 },
  { _id: '26', name: 'Lenovo IdeaPad 5',          category: 'laptops',     price: 69990,  brand: 'Lenovo',      rating: 4.5 },
  { _id: '3',  name: 'AirPods Pro 2nd Gen',       category: 'audio',       price: 24900,  brand: 'Apple',       rating: 4.7 },
  { _id: '5',  name: 'Sony WH-1000XM5',           category: 'audio',       price: 26990,  brand: 'Sony',        rating: 4.8 },
  { _id: '12', name: 'Bose QC45',                 category: 'audio',       price: 24900,  brand: 'Bose',        rating: 4.6 },
  { _id: '27', name: 'JBL Tune 770NC',            category: 'audio',       price: 9999,   brand: 'JBL',         rating: 4.5 },
  { _id: '4',  name: 'Galaxy Watch 6',            category: 'wearables',   price: 26999,  brand: 'Samsung',     rating: 4.6 },
  { _id: '11', name: 'Apple Watch Ultra 2',       category: 'wearables',   price: 89900,  brand: 'Apple',       rating: 4.8 },
  { _id: '29', name: 'Fitbit Sense 2',            category: 'wearables',   price: 15990,  brand: 'Fitbit',      rating: 4.4 },
  { _id: '51', name: 'Sony PlayStation 5',        category: 'gaming',      price: 49990,  brand: 'Sony',        rating: 4.9 },
  { _id: '90', name: 'Xbox Series X',             category: 'gaming',      price: 49990,  brand: 'Microsoft',   rating: 4.8 },
  { _id: '52', name: 'Nintendo Switch OLED',      category: 'gaming',      price: 34990,  brand: 'Nintendo',    rating: 4.8 },
  { _id: '7',  name: 'PS5 DualSense Controller',  category: 'gaming',      price: 5990,   brand: 'Sony',        rating: 4.7 },
  { _id: '8',  name: 'Samsung 4K Monitor',        category: 'accessories', price: 29999,  brand: 'Samsung',     rating: 4.5 },
  { _id: '35', name: 'Logitech MX Keys',          category: 'accessories', price: 8995,   brand: 'Logitech',    rating: 4.8 },
  { _id: '13', name: 'Classic White Tee',         category: 'clothing',    price: 999,    brand: 'Zara',        rating: 4.5 },
  { _id: '54', name: 'Nike Air Force 1',          category: 'clothing',    price: 8495,   brand: 'Nike',        rating: 4.8 },
  { _id: '16', name: 'Leather Handbag',           category: 'fashion',     price: 7499,   brand: 'Coach',       rating: 4.7 },
  { _id: '17', name: 'Designer Sunglasses',       category: 'fashion',     price: 12999,  brand: 'Ray-Ban',     rating: 4.8 },
  { _id: '19', name: 'Matte Lipstick Set',        category: 'makeup',      price: 1499,   brand: 'MAC',         rating: 4.8 },
  { _id: '21', name: 'Eyeshadow Palette',         category: 'makeup',      price: 2499,   brand: 'Urban Decay', rating: 4.9 },
];

// GET /api/products — full list (used by AI bot + frontend fallback)
router.get('/', (req, res) => {
  const { category, brand, maxPrice } = req.query;
  let result = [...PRODUCTS];

  if (category) result = result.filter(p => p.category === category.toLowerCase());
  if (brand)    result = result.filter(p => p.brand.toLowerCase() === brand.toLowerCase());
  if (maxPrice) result = result.filter(p => p.price <= Number(maxPrice));

  res.status(200).json({ success: true, products: result, count: result.length });
});

// GET /api/products/featured — curated picks
router.get('/featured', (req, res) => {
  const featured = PRODUCTS.filter(p => p.rating >= 4.8).slice(0, 6);
  res.status(200).json({ success: true, products: featured });
});

// GET /api/products/:id — single product
router.get('/:id', (req, res) => {
  const product = PRODUCTS.find(p => p._id === req.params.id);
  if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
  res.status(200).json({ success: true, product });
});

export default router;