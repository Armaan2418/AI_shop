// ──────────────────────────────────────────────────────────────────────────
//  AI SHOP — Product catalog used by Ava AI recommendation engine
//  Keep in sync with frontend/src/data/products.js
// ──────────────────────────────────────────────────────────────────────────

export const MOCK_PRODUCTS = [
  // Phones
  { _id: '1',  name: 'iPhone 15 Pro Max',       category: 'phones',      price: 129900, originalPrice: 149900, rating: 4.8, reviewCount: 2145, badge: 'AI Pick', inStock: true,  brand: 'Apple' },
  { _id: '6',  name: 'iPad Pro M4',              category: 'phones',      price: 89900,  originalPrice: null,   rating: 4.9, reviewCount: 760,  badge: null,      inStock: false, brand: 'Apple' },
  { _id: '9',  name: 'Google Pixel 8 Pro',       category: 'phones',      price: 74999,  originalPrice: 84999,  rating: 4.6, reviewCount: 1230, badge: 'Sale',    inStock: true,  brand: 'Google' },
  { _id: '22', name: 'Samsung Galaxy S24 Ultra', category: 'phones',      price: 134999, originalPrice: null,   rating: 4.8, reviewCount: 1780, badge: null,      inStock: true,  brand: 'Samsung' },
  { _id: '23', name: 'OnePlus 12',               category: 'phones',      price: 64999,  originalPrice: 74999,  rating: 4.7, reviewCount: 932,  badge: 'Sale',    inStock: true,  brand: 'OnePlus' },
  { _id: '24', name: 'Realme Narzo 70 Pro',      category: 'phones',      price: 23999,  originalPrice: 26999,  rating: 4.4, reviewCount: 412,  badge: null,      inStock: true,  brand: 'Realme' },
  { _id: '45', name: 'Galaxy Z Fold 5',          category: 'phones',      price: 154999, originalPrice: 164999, rating: 4.8, reviewCount: 920,  badge: 'AI Pick', inStock: true,  brand: 'Samsung' },
  { _id: '46', name: 'Galaxy Tab S9 Ultra',      category: 'phones',      price: 119999, originalPrice: null,   rating: 4.9, reviewCount: 410,  badge: null,      inStock: true,  brand: 'Samsung' },
  { _id: '70', name: 'OnePlus Pad',              category: 'phones',      price: 37999,  originalPrice: 39999,  rating: 4.7, reviewCount: 420,  badge: null,      inStock: true,  brand: 'OnePlus' },
  // Laptops
  { _id: '2',  name: 'MacBook Air M3',           category: 'laptops',     price: 114900, originalPrice: null,   rating: 4.9, reviewCount: 1820, badge: null,      inStock: true,  brand: 'Apple' },
  { _id: '10', name: 'Dell XPS 15',              category: 'laptops',     price: 149990, originalPrice: null,   rating: 4.7, reviewCount: 680,  badge: null,      inStock: true,  brand: 'Dell' },
  { _id: '25', name: 'HP Spectre x360',          category: 'laptops',     price: 124990, originalPrice: 144990, rating: 4.7, reviewCount: 520,  badge: 'AI Pick', inStock: true,  brand: 'HP' },
  { _id: '26', name: 'Lenovo IdeaPad 5',         category: 'laptops',     price: 69990,  originalPrice: 79990,  rating: 4.5, reviewCount: 870,  badge: 'Sale',    inStock: true,  brand: 'Lenovo' },
  { _id: '48', name: 'Mac Studio M2 Max',        category: 'laptops',     price: 199900, originalPrice: null,   rating: 4.9, reviewCount: 210,  badge: 'AI Pick', inStock: false, brand: 'Apple' },
  // Audio
  { _id: '3',  name: 'AirPods Pro 2nd Gen',      category: 'audio',       price: 24900,  originalPrice: 26900,  rating: 4.7, reviewCount: 3210, badge: 'Sale',    inStock: true,  brand: 'Apple' },
  { _id: '5',  name: 'Sony WH-1000XM5',          category: 'audio',       price: 26990,  originalPrice: 34990,  rating: 4.8, reviewCount: 4120, badge: 'AI Pick', inStock: true,  brand: 'Sony' },
  { _id: '12', name: 'Bose QC45',                category: 'audio',       price: 24900,  originalPrice: 29900,  rating: 4.6, reviewCount: 2870, badge: 'Sale',    inStock: true,  brand: 'Bose' },
  { _id: '27', name: 'JBL Tune 770NC',           category: 'audio',       price: 9999,   originalPrice: 12999,  rating: 4.5, reviewCount: 1450, badge: 'Sale',    inStock: true,  brand: 'JBL' },
  { _id: '28', name: 'Sennheiser Momentum 4',    category: 'audio',       price: 29990,  originalPrice: 34990,  rating: 4.8, reviewCount: 680,  badge: 'AI Pick', inStock: true,  brand: 'Sennheiser' },
  { _id: '47', name: 'Galaxy Buds2 Pro',         category: 'audio',       price: 16999,  originalPrice: 19999,  rating: 4.7, reviewCount: 1250, badge: 'Sale',    inStock: true,  brand: 'Samsung' },
  { _id: '49', name: 'AirPods Max',              category: 'audio',       price: 59900,  originalPrice: null,   rating: 4.8, reviewCount: 890,  badge: null,      inStock: true,  brand: 'Apple' },
  { _id: '67', name: 'Realme Buds Air 5 Pro',    category: 'audio',       price: 4999,   originalPrice: 5999,   rating: 4.5, reviewCount: 1200, badge: 'Sale',    inStock: true,  brand: 'Realme' },
  { _id: '69', name: 'OnePlus Buds Pro 2',       category: 'audio',       price: 11999,  originalPrice: 13999,  rating: 4.6, reviewCount: 760,  badge: 'Sale',    inStock: true,  brand: 'OnePlus' },
  // Wearables
  { _id: '4',  name: 'Galaxy Watch 6',           category: 'wearables',   price: 26999,  originalPrice: null,   rating: 4.6, reviewCount: 890,  badge: null,      inStock: true,  brand: 'Samsung' },
  { _id: '11', name: 'Apple Watch Ultra 2',      category: 'wearables',   price: 89900,  originalPrice: null,   rating: 4.8, reviewCount: 940,  badge: 'AI Pick', inStock: true,  brand: 'Apple' },
  { _id: '29', name: 'Fitbit Sense 2',           category: 'wearables',   price: 15990,  originalPrice: 19990,  rating: 4.4, reviewCount: 560,  badge: 'Sale',    inStock: true,  brand: 'Fitbit' },
  { _id: '30', name: 'Garmin Forerunner 255',    category: 'wearables',   price: 32990,  originalPrice: null,   rating: 4.7, reviewCount: 310,  badge: null,      inStock: true,  brand: 'Garmin' },
  { _id: '68', name: 'Realme Watch 3 Pro',       category: 'wearables',   price: 4499,   originalPrice: null,   rating: 4.3, reviewCount: 890,  badge: null,      inStock: true,  brand: 'Realme' },
  // Gaming
  { _id: '7',  name: 'PS5 DualSense Controller', category: 'gaming',      price: 5990,   originalPrice: 6490,   rating: 4.7, reviewCount: 5400, badge: 'Sale',    inStock: true,  brand: 'Sony' },
  { _id: '31', name: 'Nintendo Switch Lite',     category: 'gaming',      price: 19990,  originalPrice: null,   rating: 4.7, reviewCount: 2100, badge: null,      inStock: true,  brand: 'Nintendo' },
  { _id: '32', name: 'Xbox Wireless Controller', category: 'gaming',      price: 5990,   originalPrice: 6990,   rating: 4.6, reviewCount: 1340, badge: 'Sale',    inStock: true,  brand: 'Microsoft' },
  { _id: '33', name: 'Razer Kraken Headset',     category: 'gaming',      price: 4999,   originalPrice: 6999,   rating: 4.5, reviewCount: 890,  badge: 'Sale',    inStock: true,  brand: 'Razer' },
  { _id: '51', name: 'Sony PlayStation 5',       category: 'gaming',      price: 49990,  originalPrice: 54990,  rating: 4.9, reviewCount: 8900, badge: 'AI Pick', inStock: true,  brand: 'Sony' },
  { _id: '52', name: 'Nintendo Switch OLED',     category: 'gaming',      price: 34990,  originalPrice: null,   rating: 4.8, reviewCount: 3100, badge: null,      inStock: true,  brand: 'Nintendo' },
  { _id: '53', name: 'Nintendo Pro Controller',  category: 'gaming',      price: 6990,   originalPrice: null,   rating: 4.9, reviewCount: 1540, badge: null,      inStock: true,  brand: 'Nintendo' },
  { _id: '90', name: 'Xbox Series X',            category: 'gaming',      price: 49990,  originalPrice: null,   rating: 4.8, reviewCount: 6200, badge: null,      inStock: true,  brand: 'Microsoft' },
  { _id: '91', name: 'Steam Deck OLED',          category: 'gaming',      price: 55999,  originalPrice: 59999,  rating: 4.9, reviewCount: 3400, badge: 'AI Pick', inStock: true,  brand: 'Valve' },
  // Accessories
  { _id: '8',  name: 'Samsung 4K Monitor',       category: 'accessories', price: 29999,  originalPrice: 42999,  rating: 4.5, reviewCount: 430,  badge: 'Sale',    inStock: true,  brand: 'Samsung' },
  { _id: '34', name: 'Anker 100W GaN Charger',   category: 'accessories', price: 2999,   originalPrice: 3999,   rating: 4.6, reviewCount: 2100, badge: 'Sale',    inStock: true,  brand: 'Anker' },
  { _id: '35', name: 'Logitech MX Keys',         category: 'accessories', price: 8995,   originalPrice: 10995,  rating: 4.8, reviewCount: 1560, badge: 'AI Pick', inStock: true,  brand: 'Logitech' },
  { _id: '50', name: 'Sony Bravia 65" OLED',     category: 'accessories', price: 249990, originalPrice: 289990, rating: 4.8, reviewCount: 340,  badge: 'Sale',    inStock: true,  brand: 'Sony' },
  // Clothing
  { _id: '13', name: 'Classic White Tee',        category: 'clothing',    price: 999,    originalPrice: 1499,   rating: 4.5, reviewCount: 1240, badge: 'Sale',    inStock: true,  brand: 'Zara' },
  { _id: '14', name: 'Slim Fit Denim Jacket',    category: 'clothing',    price: 2999,   originalPrice: 4499,   rating: 4.6, reviewCount: 540,  badge: null,      inStock: true,  brand: 'Levis' },
  { _id: '54', name: 'Nike Air Force 1',         category: 'clothing',    price: 8495,   originalPrice: null,   rating: 4.8, reviewCount: 12500,badge: 'AI Pick', inStock: true,  brand: 'Nike' },
  { _id: '56', name: 'Nike Running Shoes',       category: 'clothing',    price: 11995,  originalPrice: null,   rating: 4.7, reviewCount: 3200, badge: null,      inStock: true,  brand: 'Nike' },
  { _id: '57', name: 'Zara Leather Jacket',      category: 'clothing',    price: 5990,   originalPrice: 7990,   rating: 4.7, reviewCount: 420,  badge: 'Sale',    inStock: true,  brand: 'Zara' },
  { _id: '71', name: 'Zara Oversized Blazer',    category: 'clothing',    price: 4999,   originalPrice: 6999,   rating: 4.8, reviewCount: 2200, badge: 'AI Pick', inStock: true,  brand: 'Zara' },
  { _id: '73', name: 'Levis 501 Original Jeans', category: 'clothing',    price: 3499,   originalPrice: 4299,   rating: 4.7, reviewCount: 8900, badge: null,      inStock: true,  brand: 'Levis' },
  { _id: '76', name: 'Nike Air Max 270',         category: 'clothing',    price: 12995,  originalPrice: 14995,  rating: 4.8, reviewCount: 6300, badge: 'AI Pick', inStock: true,  brand: 'Nike' },
  // Fashion
  { _id: '16', name: 'Leather Handbag',          category: 'fashion',     price: 7499,   originalPrice: 9999,   rating: 4.7, reviewCount: 876,  badge: 'AI Pick', inStock: true,  brand: 'Coach' },
  { _id: '17', name: 'Designer Sunglasses',      category: 'fashion',     price: 12999,  originalPrice: 15999,  rating: 4.8, reviewCount: 430,  badge: 'Sale',    inStock: true,  brand: 'Ray-Ban' },
  { _id: '63', name: 'Ray-Ban Aviator Classic',  category: 'fashion',     price: 9490,   originalPrice: null,   rating: 4.8, reviewCount: 5200, badge: 'AI Pick', inStock: true,  brand: 'Ray-Ban' },
  { _id: '65', name: 'Coach Crossbody Bag',      category: 'fashion',     price: 18900,  originalPrice: 22900,  rating: 4.8, reviewCount: 920,  badge: 'Sale',    inStock: true,  brand: 'Coach' },
  { _id: '80', name: 'Pandora Charm Bracelet',   category: 'fashion',     price: 8999,   originalPrice: 10999,  rating: 4.8, reviewCount: 3100, badge: 'Sale',    inStock: true,  brand: 'Pandora' },
  { _id: '84', name: 'Mia Diamond Ring',         category: 'fashion',     price: 45999,  originalPrice: 52999,  rating: 4.9, reviewCount: 210,  badge: 'AI Pick', inStock: true,  brand: 'Mia' },
  // Makeup
  { _id: '19', name: 'Matte Lipstick Set',       category: 'makeup',      price: 1499,   originalPrice: 1999,   rating: 4.8, reviewCount: 2310, badge: 'Sale',    inStock: true,  brand: 'MAC' },
  { _id: '21', name: 'Eyeshadow Palette',        category: 'makeup',      price: 2499,   originalPrice: 2999,   rating: 4.9, reviewCount: 3100, badge: 'AI Pick', inStock: true,  brand: 'Urban Decay' },
  { _id: '59', name: 'MAC Studio Fix Fluid',     category: 'makeup',      price: 3300,   originalPrice: null,   rating: 4.8, reviewCount: 5600, badge: 'AI Pick', inStock: true,  brand: 'MAC' },
  { _id: '85', name: 'MAC Ruby Woo Lipstick',    category: 'makeup',      price: 1950,   originalPrice: null,   rating: 4.9, reviewCount: 8900, badge: 'AI Pick', inStock: true,  brand: 'MAC' },
  { _id: '87', name: 'Urban Decay Naked Palette',category: 'makeup',      price: 4900,   originalPrice: 5500,   rating: 4.8, reviewCount: 4200, badge: null,      inStock: true,  brand: 'Urban Decay' },
  { _id: '88', name: 'Maybelline Fit Me Foundation',category: 'makeup',   price: 649,    originalPrice: 799,    rating: 4.5, reviewCount: 12500,badge: 'Sale',    inStock: true,  brand: 'Maybelline' },
  { _id: '89', name: 'Laura Mercier Setting Powder',category: 'makeup',   price: 3600,   originalPrice: null,   rating: 4.9, reviewCount: 2800, badge: 'AI Pick', inStock: true,  brand: 'Laura Mercier' },
  // Groceries
  { _id: '101', name: 'Kaali Mirch (Black Pepper)', category: 'groceries', price: 150, originalPrice: null, rating: 4.9, reviewCount: 840, badge: 'Spice', inStock: true, brand: 'Organic Farms', noTax: true },
  // Royal Footwear
  { _id: '102', name: "Rani Sa's Crocs", category: 'fashion', price: 100000, originalPrice: null, rating: 5.0, reviewCount: 1, badge: '👑 Royal', inStock: true, brand: 'Rani Sa Exclusive', deal: "Whoever makes them dirty wins them for free! 👑 Think you can do it?" },
];
