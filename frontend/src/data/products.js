// Shared product data used by Products + ProductDetail pages

export const MOCK_PRODUCTS = [
  // Phones
  { _id: '1',  name: 'iPhone 15 Pro Max',       category: 'phones',      price: 129900, originalPrice: 149900, rating: 4.8, reviewCount: 2145, badge: 'AI Pick', inStock: true,  brand: 'Apple',     image: 'https://m.media-amazon.com/images/I/81Os1SDWpcL._SX679_.jpg' },
  { _id: '6',  name: 'iPad Pro M4',              category: 'phones',      price: 89900,  originalPrice: null,   rating: 4.9, reviewCount: 760,  badge: null,      inStock: false, brand: 'Apple',     image: 'https://images.unsplash.com/photo-1529653762956-b0a27278529c?w=500&q=80' },
  { _id: '9',  name: 'Google Pixel 8 Pro',       category: 'phones',      price: 74999,  originalPrice: 84999,  rating: 4.6, reviewCount: 1230, badge: 'Sale',    inStock: true,  brand: 'Google',    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500' },
  { _id: '22', name: 'Samsung Galaxy S24 Ultra', category: 'phones',      price: 134999, originalPrice: null,   rating: 4.8, reviewCount: 1780, badge: null,      inStock: true,  brand: 'Samsung',   image: 'https://m.media-amazon.com/images/I/71E1yoZIxuL._SX679_.jpg' },
  { _id: '23', name: 'OnePlus 12',               category: 'phones',      price: 64999,  originalPrice: 74999,  rating: 4.7, reviewCount: 932,  badge: 'Sale',    inStock: true,  brand: 'OnePlus',   image: 'https://m.media-amazon.com/images/I/717Qo4MH97L._SX679_.jpg' },
  { _id: '24', name: 'Realme Narzo 70 Pro',      category: 'phones',      price: 23999,  originalPrice: 26999,  rating: 4.4, reviewCount: 412,  badge: null,      inStock: true,  brand: 'Realme',    image: 'https://m.media-amazon.com/images/I/71sxlhYhKWL._SX679_.jpg' },
  { _id: '45', name: 'Galaxy Z Fold 5',          category: 'phones',      price: 154999, originalPrice: 164999, rating: 4.8, reviewCount: 920,  badge: 'AI Pick', inStock: true,  brand: 'Samsung',   image: 'https://m.media-amazon.com/images/I/716pi7fRYjL._SX679_.jpg' },
  { _id: '46', name: 'Galaxy Tab S9 Ultra',      category: 'phones',      price: 119999, originalPrice: null,   rating: 4.9, reviewCount: 410,  badge: null,      inStock: true,  brand: 'Samsung',   image: 'https://images.unsplash.com/photo-1588702545922-771a1795ca51?w=500' },
  { _id: '70', name: 'OnePlus Pad',              category: 'phones',      price: 37999,  originalPrice: 39999,  rating: 4.7, reviewCount: 420,  badge: null,      inStock: true,  brand: 'OnePlus',   image: 'https://m.media-amazon.com/images/I/61MvUa1k6WL._SX679_.jpg' },
  // Laptops
  { _id: '2',  name: 'MacBook Air M3',           category: 'laptops',     price: 114900, originalPrice: null,   rating: 4.9, reviewCount: 1820, badge: null,      inStock: true,  brand: 'Apple',     image: 'https://images.unsplash.com/photo-1611186871525-b9e8b073b50a?w=500&q=80' },
  { _id: '10', name: 'Dell XPS 15',              category: 'laptops',     price: 149990, originalPrice: null,   rating: 4.7, reviewCount: 680,  badge: null,      inStock: true,  brand: 'Dell',      image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500' },
  { _id: '25', name: 'HP Spectre x360',          category: 'laptops',     price: 124990, originalPrice: 144990, rating: 4.7, reviewCount: 520,  badge: 'AI Pick', inStock: true,  brand: 'HP',        image: 'https://images.unsplash.com/photo-1585007600263-71228e40c8d1?w=500' },
  { _id: '26', name: 'Lenovo IdeaPad 5',         category: 'laptops',     price: 69990,  originalPrice: 79990,  rating: 4.5, reviewCount: 870,  badge: 'Sale',    inStock: true,  brand: 'Lenovo',    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500' },
  { _id: '48', name: 'Mac Studio M2 Max',        category: 'laptops',     price: 199900, originalPrice: null,   rating: 4.9, reviewCount: 210,  badge: 'AI Pick', inStock: false, brand: 'Apple',     image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80' },
  // Audio
  { _id: '3',  name: 'AirPods Pro 2nd Gen',      category: 'audio',       price: 24900,  originalPrice: 26900,  rating: 4.7, reviewCount: 3210, badge: 'Sale',    inStock: true,  brand: 'Apple',     image: 'https://images.unsplash.com/photo-1606220588913-b3eea41b658d?w=500&q=80' },
  { _id: '5',  name: 'Sony WH-1000XM5',         category: 'audio',       price: 26990,  originalPrice: 34990,  rating: 4.8, reviewCount: 4120, badge: 'AI Pick', inStock: true,  brand: 'Sony',      image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500' },
  { _id: '12', name: 'Bose QC45',                category: 'audio',       price: 24900,  originalPrice: 29900,  rating: 4.6, reviewCount: 2870, badge: 'Sale',    inStock: true,  brand: 'Bose',      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500' },
  { _id: '27', name: 'JBL Tune 770NC',           category: 'audio',       price: 9999,   originalPrice: 12999,  rating: 4.5, reviewCount: 1450, badge: 'Sale',    inStock: true,  brand: 'JBL',       image: 'https://m.media-amazon.com/images/I/61k1qH1tFmL._SX679_.jpg' },
  { _id: '28', name: 'Sennheiser Momentum 4',    category: 'audio',       price: 29990,  originalPrice: 34990,  rating: 4.8, reviewCount: 680,  badge: 'AI Pick', inStock: true,  brand: 'Sennheiser',image: 'https://m.media-amazon.com/images/I/61KqUa-t2WL._SX679_.jpg' },
  { _id: '47', name: 'Galaxy Buds2 Pro',         category: 'audio',       price: 16999,  originalPrice: 19999,  rating: 4.7, reviewCount: 1250, badge: 'Sale',    inStock: true,  brand: 'Samsung',   image: 'https://m.media-amazon.com/images/I/51r5I9i27NL._SX679_.jpg' },
  { _id: '49', name: 'AirPods Max',              category: 'audio',       price: 59900,  originalPrice: null,   rating: 4.8, reviewCount: 890,  badge: null,      inStock: true,  brand: 'Apple',     image: 'https://m.media-amazon.com/images/I/81jqUPkIGhL._SX679_.jpg' },
  { _id: '67', name: 'Realme Buds Air 5 Pro',    category: 'audio',       price: 4999,   originalPrice: 5999,   rating: 4.5, reviewCount: 1200, badge: 'Sale',    inStock: true,  brand: 'Realme',    image: 'https://m.media-amazon.com/images/I/61H4hT0K4bL._SX679_.jpg' },
  { _id: '69', name: 'OnePlus Buds Pro 2',       category: 'audio',       price: 11999,  originalPrice: 13999,  rating: 4.6, reviewCount: 760,  badge: 'Sale',    inStock: true,  brand: 'OnePlus',   image: 'https://m.media-amazon.com/images/I/51p0c0oB8sL._SX679_.jpg' },
  // Wearables
  { _id: '4',  name: 'Galaxy Watch 6',           category: 'wearables',   price: 26999,  originalPrice: null,   rating: 4.6, reviewCount: 890,  badge: null,      inStock: true,  brand: 'Samsung',   image: 'https://m.media-amazon.com/images/I/71p0A1A-85L._SX679_.jpg' },
  { _id: '11', name: 'Apple Watch Ultra 2',      category: 'wearables',   price: 89900,  originalPrice: null,   rating: 4.8, reviewCount: 940,  badge: 'AI Pick', inStock: true,  brand: 'Apple',     image: 'https://m.media-amazon.com/images/I/81h9iFk-50L._SX679_.jpg' },
  { _id: '29', name: 'Fitbit Sense 2',           category: 'wearables',   price: 15990,  originalPrice: 19990,  rating: 4.4, reviewCount: 560,  badge: 'Sale',    inStock: true,  brand: 'Fitbit',    image: 'https://m.media-amazon.com/images/I/61P1aC21vJL._SX679_.jpg' },
  { _id: '30', name: 'Garmin Forerunner 255',    category: 'wearables',   price: 32990,  originalPrice: null,   rating: 4.7, reviewCount: 310,  badge: null,      inStock: true,  brand: 'Garmin',    image: 'https://m.media-amazon.com/images/I/51P+RHz4nBL._SX679_.jpg' },
  { _id: '68', name: 'Realme Watch 3 Pro',       category: 'wearables',   price: 4499,   originalPrice: null,   rating: 4.3, reviewCount: 890,  badge: null,      inStock: true,  brand: 'Realme',    image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&q=80' },
  // Gaming
  { _id: '7',  name: 'PS5 DualSense Controller',  category: 'gaming',      price: 5990,   originalPrice: 6490,   rating: 4.7, reviewCount: 5400, badge: 'Sale',    inStock: true,  brand: 'Sony',      image: 'https://m.media-amazon.com/images/I/61HnRrW4qYL._SX679_.jpg' },
  { _id: '31', name: 'Nintendo Switch Lite',     category: 'gaming',      price: 19990,  originalPrice: null,   rating: 4.7, reviewCount: 2100, badge: null,      inStock: true,  brand: 'Nintendo',  image: 'https://m.media-amazon.com/images/I/71dZZgKcwGL._SX679_.jpg' },
  { _id: '32', name: 'Xbox Wireless Controller', category: 'gaming',      price: 5990,   originalPrice: 6990,   rating: 4.6, reviewCount: 1340, badge: 'Sale',    inStock: true,  brand: 'Microsoft', image: 'https://images.unsplash.com/photo-1629851610474-32aa87019747?w=500' },
  { _id: '33', name: 'Razer Kraken Headset',     category: 'gaming',      price: 4999,   originalPrice: 6999,   rating: 4.5, reviewCount: 890,  badge: 'Sale',    inStock: true,  brand: 'Razer',     image: 'https://images.unsplash.com/photo-1612222869049-d8ec83637a3c?w=500' },
  { _id: '51', name: 'Sony PlayStation 5',       category: 'gaming',      price: 49990,  originalPrice: 54990,  rating: 4.9, reviewCount: 8900, badge: 'AI Pick', inStock: true,  brand: 'Sony',      image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800' },
  { _id: '52', name: 'Nintendo Switch OLED',     category: 'gaming',      price: 34990,  originalPrice: null,   rating: 4.8, reviewCount: 3100, badge: null,      inStock: true,  brand: 'Nintendo',  image: 'https://m.media-amazon.com/images/I/61O9tD6NAAL._SX679_.jpg' },
  { _id: '53', name: 'Nintendo Pro Controller',  category: 'gaming',      price: 6990,   originalPrice: null,   rating: 4.9, reviewCount: 1540, badge: null,      inStock: true,  brand: 'Nintendo',  image: 'https://m.media-amazon.com/images/I/61O9tD6NAAL._SX679_.jpg' },
  // Accessories
  { _id: '8',  name: 'Samsung 4K Monitor',       category: 'accessories', price: 29999,  originalPrice: 42999,  rating: 4.5, reviewCount: 430,  badge: 'Sale',    inStock: true,  brand: 'Samsung',   image: 'https://images.unsplash.com/photo-1527443224154-c4a573d5f6b4?w=500&q=80' },
  { _id: '34', name: 'Anker 100W GaN Charger',   category: 'accessories', price: 2999,   originalPrice: 3999,   rating: 4.6, reviewCount: 2100, badge: 'Sale',    inStock: true,  brand: 'Anker',     image: 'https://images.unsplash.com/photo-1593344484684-c06a3da6eb94?w=500&q=80' },
  { _id: '35', name: 'Logitech MX Keys',         category: 'accessories', price: 8995,   originalPrice: 10995,  rating: 4.8, reviewCount: 1560, badge: 'AI Pick', inStock: true,  brand: 'Logitech',  image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&q=80' },
  { _id: '50', name: 'Sony Bravia 65" OLED',     category: 'accessories', price: 249990, originalPrice: 289990, rating: 4.8, reviewCount: 340,  badge: 'Sale',    inStock: true,  brand: 'Sony',      image: 'https://m.media-amazon.com/images/I/91rI6JvBpwL._SX679_.jpg' },
  // Clothing
  { _id: '13', name: 'Classic White Tee',        category: 'clothing',    price: 999,    originalPrice: 1499,   rating: 4.5, reviewCount: 1240, badge: 'Sale',    inStock: true,  brand: 'Zara',      image: 'https://m.media-amazon.com/images/I/61lVQH4s-CL._SY741_.jpg' },
  { _id: '14', name: 'Slim Fit Denim Jacket',    category: 'clothing',    price: 2999,   originalPrice: 4499,   rating: 4.6, reviewCount: 540,  badge: null,      inStock: true,  brand: 'Levis',     image: 'https://m.media-amazon.com/images/I/71Q3JtFRKwL._SY741_.jpg' },
  { _id: '15', name: 'Floral Maxi Dress',        category: 'clothing',    price: 1999,   originalPrice: 2999,   rating: 4.7, reviewCount: 820,  badge: 'AI Pick', inStock: true,  brand: 'H&M',       image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500&q=80' },
  { _id: '36', name: 'Polo T-Shirt',             category: 'clothing',    price: 1299,   originalPrice: null,   rating: 4.4, reviewCount: 780,  badge: null,      inStock: true,  brand: 'U.S. Polo', image: 'https://m.media-amazon.com/images/I/81Uq+a6yK1L._SX679._AC_UL640_FMwebp_QL65_.jpg' },
  { _id: '37', name: 'Zip-up Hoodie',            category: 'clothing',    price: 1999,   originalPrice: 2999,   rating: 4.6, reviewCount: 630,  badge: 'Sale',    inStock: true,  brand: 'Zara',      image: 'https://m.media-amazon.com/images/I/61aMlvXzTmL._SX679._AC_UL640_FMwebp_QL65_.jpg' },
  { _id: '38', name: 'Sports Shorts',            category: 'clothing',    price: 799,    originalPrice: 999,    rating: 4.3, reviewCount: 450,  badge: 'Sale',    inStock: true,  brand: 'Nike',      image: 'https://m.media-amazon.com/images/I/51I3IqZ0MOL._SX679_.jpg' },
  { _id: '54', name: 'Nike Air Force 1',         category: 'clothing',    price: 8495,   originalPrice: null,   rating: 4.8, reviewCount: 12500,badge: 'AI Pick', inStock: true,  brand: 'Nike',      image: 'https://m.media-amazon.com/images/I/61FxFRMFL3L._SY695_.jpg' },
  { _id: '55', name: 'Nike Dri-FIT Tee',         category: 'clothing',    price: 1495,   originalPrice: 1995,   rating: 4.6, reviewCount: 890,  badge: 'Sale',    inStock: true,  brand: 'Nike',      image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=500&q=80' },
  { _id: '56', name: 'Nike Running Shoes',       category: 'clothing',    price: 11995,  originalPrice: null,   rating: 4.7, reviewCount: 3200, badge: null,      inStock: true,  brand: 'Nike',      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80' },
  { _id: '57', name: 'Zara Leather Jacket',      category: 'clothing',    price: 5990,   originalPrice: 7990,   rating: 4.7, reviewCount: 420,  badge: 'Sale',    inStock: true,  brand: 'Zara',      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&q=80' },
  { _id: '58', name: 'Zara Chelsea Boots',       category: 'clothing',    price: 4990,   originalPrice: null,   rating: 4.5, reviewCount: 310,  badge: null,      inStock: true,  brand: 'Zara',      image: 'https://images.unsplash.com/photo-1542840410-b934f32ad4e3?w=500&q=80' },
  { _id: '71', name: 'Zara Oversized Blazer',    category: 'clothing',    price: 4999,   originalPrice: 6999,   rating: 4.8, reviewCount: 2200, badge: 'AI Pick', inStock: true,  brand: 'Zara',      image: 'https://images.unsplash.com/photo-1594938298603-c8148c4b99e9?w=500&q=80' },
  { _id: '72', name: 'Nike Sportswear Tech Fleece',category: 'clothing',  price: 7495,   originalPrice: null,   rating: 4.9, reviewCount: 4100, badge: 'Sale',    inStock: true,  brand: 'Nike',      image: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=500&q=80' },
  { _id: '73', name: 'Levis 501 Original Jeans', category: 'clothing',    price: 3499,   originalPrice: 4299,   rating: 4.7, reviewCount: 8900, badge: null,      inStock: true,  brand: 'Levis',     image: 'https://m.media-amazon.com/images/I/81wMIfP99eL._SX679._AC_UL640_FMwebp_QL65_.jpg' },
  { _id: '74', name: 'H&M Knit Sweater',         category: 'clothing',    price: 1999,   originalPrice: null,   rating: 4.5, reviewCount: 1540, badge: null,      inStock: true,  brand: 'H&M',       image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&q=80' },
  { _id: '75', name: 'U.S. Polo Linen Shirt',    category: 'clothing',    price: 1799,   originalPrice: 2499,   rating: 4.6, reviewCount: 920,  badge: 'Sale',    inStock: true,  brand: 'U.S. Polo', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&q=80' },
  { _id: '76', name: 'Nike Air Max 270',         category: 'clothing',    price: 12995,  originalPrice: 14995,  rating: 4.8, reviewCount: 6300, badge: 'AI Pick', inStock: true,  brand: 'Nike',      image: 'https://m.media-amazon.com/images/I/71Y+R48qXLL._AC_UL640_FMwebp_QL65_.jpg' },
  { _id: '77', name: 'Zara Trench Coat',         category: 'clothing',    price: 8990,   originalPrice: null,   rating: 4.7, reviewCount: 430,  badge: null,      inStock: true,  brand: 'Zara',      image: 'https://m.media-amazon.com/images/I/61X-uV+R8PL._SY741._AC_UL640_FMwebp_QL65_.jpg' },
  { _id: '78', name: 'H&M Pleated Skirt',        category: 'clothing',    price: 1499,   originalPrice: 1999,   rating: 4.4, reviewCount: 890,  badge: 'Sale',    inStock: true,  brand: 'H&M',       image: 'https://m.media-amazon.com/images/I/61XzEksjRDL._SX679._AC_UL640_FMwebp_QL65_.jpg' },
  // Fashion
  { _id: '16', name: 'Leather Handbag',          category: 'fashion',     price: 7499,   originalPrice: 9999,   rating: 4.7, reviewCount: 876,  badge: 'AI Pick', inStock: true,  brand: 'Coach',     image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&q=80' },
  { _id: '17', name: 'Designer Sunglasses',      category: 'fashion',     price: 12999,  originalPrice: 15999,  rating: 4.8, reviewCount: 430,  badge: 'Sale',    inStock: true,  brand: 'Ray-Ban',   image: 'https://m.media-amazon.com/images/I/41hKJR+xUEL._SX679_.jpg' },
  { _id: '18', name: 'Gold Chain Necklace',      category: 'fashion',     price: 3499,   originalPrice: null,   rating: 4.6, reviewCount: 320,  badge: null,      inStock: true,  brand: 'Pandora',   image: 'https://m.media-amazon.com/images/I/51rR-u1HpwL._SX679_.jpg' },
  { _id: '39', name: 'Pearl Drop Earrings',      category: 'fashion',     price: 1999,   originalPrice: null,   rating: 4.7, reviewCount: 290,  badge: 'AI Pick', inStock: true,  brand: 'Mia',       image: 'https://m.media-amazon.com/images/I/61x0a-0-YHL._SX679._AC_UL640_FMwebp_QL65_.jpg' },
  { _id: '40', name: 'Silk Scarf',               category: 'fashion',     price: 2999,   originalPrice: 4999,   rating: 4.5, reviewCount: 180,  badge: 'Sale',    inStock: true,  brand: 'Da Milano', image: 'https://m.media-amazon.com/images/I/81F5G-X8nQL._SX679._AC_UL640_FMwebp_QL65_.jpg' },
  { _id: '41', name: 'Canvas Tote Bag',          category: 'fashion',     price: 1499,   originalPrice: null,   rating: 4.4, reviewCount: 510,  badge: null,      inStock: true,  brand: 'Aldo',      image: 'https://m.media-amazon.com/images/I/81eR0eXohtL._AC_UL640_FMwebp_QL65_.jpg' },
  { _id: '63', name: 'Ray-Ban Aviator Classic',  category: 'fashion',     price: 9490,   originalPrice: null,   rating: 4.8, reviewCount: 5200, badge: 'AI Pick', inStock: true,  brand: 'Ray-Ban',   image: 'https://m.media-amazon.com/images/I/31I03dOqF-L._AC_UL640_FMwebp_QL65_.jpg' },
  { _id: '64', name: 'Ray-Ban Wayfarer',         category: 'fashion',     price: 8990,   originalPrice: 10490,  rating: 4.7, reviewCount: 3800, badge: 'Sale',    inStock: true,  brand: 'Ray-Ban',   image: 'https://m.media-amazon.com/images/I/41O0g3Xq7TL._AC_UL640_FMwebp_QL65_.jpg' },
  { _id: '65', name: 'Coach Crossbody Bag',      category: 'fashion',     price: 18900,  originalPrice: 22900,  rating: 4.8, reviewCount: 920,  badge: 'Sale',    inStock: true,  brand: 'Coach',     image: 'https://m.media-amazon.com/images/I/71v4uRYx5GL._AC_UL640_FMwebp_QL65_.jpg' },
  { _id: '66', name: 'Coach Wallet',             category: 'fashion',     price: 6500,   originalPrice: null,   rating: 4.6, reviewCount: 450,  badge: null,      inStock: true,  brand: 'Coach',     image: 'https://m.media-amazon.com/images/I/71x4x0G6I2L._AC_UL640_FMwebp_QL65_.jpg' },
  { _id: '79', name: 'Coach Tabby Shoulder Bag', category: 'fashion',     price: 34500,  originalPrice: null,   rating: 4.9, reviewCount: 1200, badge: 'AI Pick', inStock: true,  brand: 'Coach',     image: 'https://m.media-amazon.com/images/I/71R2nJ7z2TL._AC_UL640_FMwebp_QL65_.jpg' },
  { _id: '80', name: 'Pandora Charm Bracelet',   category: 'fashion',     price: 8999,   originalPrice: 10999,  rating: 4.8, reviewCount: 3100, badge: 'Sale',    inStock: true,  brand: 'Pandora',   image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500&q=80' },
  { _id: '81', name: 'Da Milano Tote',           category: 'fashion',     price: 12499,  originalPrice: 15999,  rating: 4.6, reviewCount: 540,  badge: null,      inStock: true,  brand: 'Da Milano', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&q=80' },
  { _id: '82', name: 'Ray-Ban Clubmaster',       category: 'fashion',     price: 11290,  originalPrice: null,   rating: 4.7, reviewCount: 1800, badge: null,      inStock: true,  brand: 'Ray-Ban',   image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&q=80' },
  { _id: '83', name: 'Aldo Block Heels',         category: 'fashion',     price: 6999,   originalPrice: 8999,   rating: 4.5, reviewCount: 920,  badge: 'Sale',    inStock: true,  brand: 'Aldo',      image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500&q=80' },
  { _id: '84', name: 'Mia Diamond Ring',         category: 'fashion',     price: 45999,  originalPrice: 52999,  rating: 4.9, reviewCount: 210,  badge: 'AI Pick', inStock: true,  brand: 'Mia',       image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&q=80' },
  // Makeup
  { _id: '19', name: 'Matte Lipstick Set',       category: 'makeup',      price: 1499,   originalPrice: 1999,   rating: 4.8, reviewCount: 2310, badge: 'Sale',    inStock: true,  brand: 'MAC',       image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&q=80' },
  { _id: '20', name: 'Foundation & Concealer',   category: 'makeup',      price: 1999,   originalPrice: null,   rating: 4.7, reviewCount: 1890, badge: 'AI Pick', inStock: true,  brand: 'NYX',       image: 'https://images.unsplash.com/photo-1631214500115-598fc2cb8d2d?w=500&q=80' },
  { _id: '21', name: 'Eyeshadow Palette',        category: 'makeup',      price: 2499,   originalPrice: 2999,   rating: 4.9, reviewCount: 3100, badge: 'AI Pick', inStock: true,  brand: 'Urban Decay',image: 'https://m.media-amazon.com/images/I/51w7YhKrOKL._SX679_.jpg' },
  { _id: '42', name: 'Setting Powder',           category: 'makeup',      price: 1799,   originalPrice: 2499,   rating: 4.6, reviewCount: 940,  badge: null,      inStock: true,  brand: 'Laura Mercier', image: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=500&q=80' },
  { _id: '43', name: 'Mascara Duo Pack',         category: 'makeup',      price: 999,    originalPrice: 1299,   rating: 4.5, reviewCount: 1670, badge: 'Sale',    inStock: true,  brand: 'Maybelline', image: 'https://images.unsplash.com/photo-1631214500115-598fc2cb8d2d?w=500&q=80' },
  { _id: '59', name: 'MAC Studio Fix Fluid',     category: 'makeup',      price: 3300,   originalPrice: null,   rating: 4.8, reviewCount: 5600, badge: 'AI Pick', inStock: true,  brand: 'MAC',       image: 'https://images.unsplash.com/photo-1512207736890-6ffed8a84e8d?w=500&q=80' },
  { _id: '60', name: 'MAC Prep + Prime',         category: 'makeup',      price: 2400,   originalPrice: 2800,   rating: 4.7, reviewCount: 2100, badge: 'Sale',    inStock: true,  brand: 'MAC',       image: 'https://images.unsplash.com/photo-1596704017254-9b5e2a025acf?w=500&q=80' },
  { _id: '61', name: 'Urban Decay Setting Spray',category: 'makeup',      price: 2900,   originalPrice: null,   rating: 4.9, reviewCount: 4300, badge: 'AI Pick', inStock: true,  brand: 'Urban Decay',image: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=500&q=80' },
  { _id: '62', name: 'Urban Decay Primer',       category: 'makeup',      price: 2200,   originalPrice: 2600,   rating: 4.6, reviewCount: 1800, badge: 'Sale',    inStock: true,  brand: 'Urban Decay',image: 'https://images.unsplash.com/photo-1549213801-4e0b14f3db5e?w=500&q=80' },
  { _id: '85', name: 'MAC Ruby Woo Lipstick',    category: 'makeup',      price: 1950,   originalPrice: null,   rating: 4.9, reviewCount: 8900, badge: 'AI Pick', inStock: true,  brand: 'MAC',       image: 'https://images.unsplash.com/photo-1586495777744-4e6232bf2176?w=500&q=80' },
  { _id: '86', name: 'NYX Setting Spray Matte',  category: 'makeup',      price: 899,    originalPrice: 1199,   rating: 4.6, reviewCount: 5400, badge: 'Sale',    inStock: true,  brand: 'NYX',       image: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=500&q=80' },
  { _id: '87', name: 'Urban Decay Naked Palette',category: 'makeup',      price: 4900,   originalPrice: 5500,   rating: 4.8, reviewCount: 4200, badge: null,      inStock: true,  brand: 'Urban Decay',image: 'https://images.unsplash.com/photo-1512207736890-6ffed8a84e8d?w=500&q=80' },
  { _id: '88', name: 'Maybelline Fit Me Foundation',category: 'makeup',   price: 649,    originalPrice: 799,    rating: 4.5, reviewCount: 12500,badge: 'Sale',    inStock: true,  brand: 'Maybelline', image: 'https://images.unsplash.com/photo-1625093911396-2e06b7f0b6e1?w=500&q=80' },
  { _id: '89', name: 'Laura Mercier Setting Powder',category: 'makeup',   price: 3600,   originalPrice: null,   rating: 4.9, reviewCount: 2800, badge: 'AI Pick', inStock: true,  brand: 'Laura Mercier', image: 'https://images.unsplash.com/photo-1546462518-e8f90c3f5ef3?w=500&q=80' },
  // New gaming — added for comparison
  { _id: '90', name: 'Xbox Series X',            category: 'gaming',      price: 49990,  originalPrice: null,   rating: 4.8, reviewCount: 6200, badge: null,      inStock: true,  brand: 'Microsoft', image: 'https://m.media-amazon.com/images/I/51rR-u1HpwL._SX679_.jpg' },
  { _id: '91', name: 'Steam Deck OLED',          category: 'gaming',      price: 55999,  originalPrice: 59999,  rating: 4.9, reviewCount: 3400, badge: 'AI Pick', inStock: true,  brand: 'Valve',     image: 'https://images.unsplash.com/photo-1627856013091-fed6dc4ee04a?w=500&q=80' },
  // Groceries
  { _id: '101', name: 'Kaali Mirch (Black Pepper)', category: 'groceries', price: 150, originalPrice: null, rating: 4.9, reviewCount: 840, badge: 'Spice', inStock: true, brand: 'Organic Farms', image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500&q=80', noTax: true },
  // Scam
  { _id: '100', name: 'Air from the Moon',       category: 'scam',        price: 20,     originalPrice: 99999,  rating: 0.1, reviewCount: 80085,badge: 'SCAM',    inStock: true,  brand: 'TrustMeBro',image: 'https://images.unsplash.com/photo-1550616158-9a9978dbd9cb?w=500&q=80' },
];

// Explicit comparison groups — each array has 3 product IDs that make sense to compare
export const COMPARISON_MAP = {
  // Phones: flagships
  '1':  ['1','22','23'],   // iPhone vs Galaxy S24 vs OnePlus 12
  '22': ['22','1','23'],
  '23': ['23','1','22'],
  '9':  ['9','24','23'],   // Pixel 8 vs Narzo vs OnePlus
  '24': ['24','9','23'],
  // Phones: tablets
  '6':  ['6','46','70'],   // iPad vs Tab S9 vs OnePlus Pad
  '46': ['46','6','70'],
  '70': ['70','6','46'],
  // Phones: foldable
  '45': ['45','1','22'],
  // Laptops
  '2':  ['2','10','25'],   // MacBook vs Dell XPS vs HP Spectre
  '10': ['10','2','25'],
  '25': ['25','2','10'],
  '26': ['26','2','25'],   // IdeaPad vs MacBook vs HP
  '48': ['48','2','10'],
  // Audio: over-ear
  '5':  ['5','12','28'],   // Sony vs Bose vs Sennheiser
  '12': ['12','5','28'],
  '28': ['28','5','12'],
  '49': ['49','5','28'],   // AirPods Max
  '27': ['27','12','5'],
  // Audio: earbuds
  '3':  ['3','47','69'],   // AirPods Pro vs Galaxy Buds vs OnePlus Buds
  '47': ['47','3','69'],
  '67': ['67','3','69'],
  '69': ['69','3','47'],
  // Wearables
  '4':  ['4','11','30'],   // Galaxy Watch vs Apple Watch vs Garmin
  '11': ['11','4','30'],
  '29': ['29','4','68'],
  '30': ['30','11','4'],
  '68': ['68','4','29'],
  // Gaming: consoles
  '51': ['51','90','52'],  // PS5 vs Xbox vs Switch OLED
  '90': ['90','51','52'],
  '52': ['52','51','90'],
  '91': ['91','52','51'],  // Steam Deck
  // Gaming: controllers
  '7':  ['7','32','53'],   // DualSense vs Xbox Controller vs Pro Controller
  '32': ['32','7','53'],
  '53': ['53','7','32'],
  '33': ['33','7','32'],   // Razer Headset
  '31': ['31','52','91'],  // Switch Lite
  // Accessories
  '8':  ['8','50','35'],
  '34': ['34','35','8'],
  '35': ['35','34','8'],
  '50': ['50','8','35'],
  // Clothing: tees
  '13': ['13','55','36'],  // White Tee vs Dri-FIT vs Polo
  '55': ['55','13','36'],
  '36': ['36','13','55'],
  // Clothing: shoes
  '54': ['54','56','76'],  // AF1 vs Running vs Air Max
  '56': ['56','54','76'],
  '76': ['76','54','56'],
  '38': ['38','72','37'],  // Shorts vs Fleece vs Hoodie
  '58': ['58','54','76'],  // Chelsea Boots
  // Clothing: outerwear
  '14': ['14','57','71'],  // Denim Jacket vs Leather Jacket vs Blazer
  '57': ['57','14','77'],
  '71': ['71','14','57'],
  '77': ['77','57','71'],  // Trench Coat
  '37': ['37','72','74'],  // Hoodie vs Fleece vs Sweater
  '72': ['72','37','74'],
  // Clothing: bottoms / dresses
  '15': ['15','78','73'],  // Maxi Dress vs Skirt vs Jeans
  '73': ['73','14','75'],
  '74': ['74','37','13'],
  '75': ['75','36','13'],
  '78': ['78','15','73'],
  // Fashion: bags
  '16': ['16','65','79'],  // Coach bags
  '65': ['65','16','79'],
  '79': ['79','16','65'],
  '41': ['41','81','16'],
  '81': ['81','41','16'],
  '66': ['66','16','41'],
  // Fashion: sunglasses
  '17': ['17','63','64'],
  '63': ['63','17','64'],
  '64': ['64','17','63'],
  '82': ['82','17','63'],
  // Fashion: jewelry
  '18': ['18','39','80'],
  '39': ['39','18','80'],
  '80': ['80','18','39'],
  '84': ['84','18','80'],
  '40': ['40','41','81'],
  '83': ['83','58','54'],  // Heels vs Boots
  // Makeup: lips
  '19': ['19','85','60'],  // Lipstick Set vs Ruby Woo vs Prep+Prime
  '85': ['85','19','60'],
  // Makeup: face
  '20': ['20','59','88'],  // Foundation vs Studio Fix vs Fit Me
  '59': ['59','20','88'],
  '88': ['88','20','59'],
  '42': ['42','89','61'],  // Setting Powder vs LM Powder vs UD Spray
  '89': ['89','42','61'],
  '60': ['60','19','85'],
  // Makeup: eyes
  '21': ['21','87','62'],  // Eyeshadow vs Naked vs Primer
  '87': ['87','21','62'],
  '62': ['62','21','87'],
  '43': ['43','21','87'],  // Mascara
  '61': ['61','42','89'],
  '86': ['86','61','42'],
};


// Per-category spec templates for product detail pages
export const getProductSpecs = (product) => {
  const specsByCategory = {
    phones: (() => {
      let ram = '8GB LPDDR4';
      let processor = 'Octa-core Processor';
      let camera = '48MP + 12MP Dual Rear';
      let display = '6.5" FHD+ AMOLED';

      if (product.brand === 'Apple') {
         ram = product.name.includes('Pro') ? '8GB Unified Memory' : '6GB Unified Memory';
         processor = product.name.includes('Pro') ? 'A17 Pro Chip' : 'A16 Bionic';
         camera = product.name.includes('Pro') ? '48MP Main + 12MP UW + 12MP Telephoto' : '48MP Main + 12MP UW';
         display = product.name.includes('Pro Max') ? '6.7" Super Retina XDR' : '6.1" Super Retina XDR';
      } else if (product.brand === 'Samsung') {
         ram = product.name.includes('Ultra') ? '12GB LPDDR5X' : '8GB LPDDR5X';
         processor = 'Snapdragon 8 Gen 3 for Galaxy';
         camera = product.name.includes('Ultra') ? '200MP Main + 50MP + 12MP + 10MP' : '50MP Main + 12MP UW + 10MP Telephoto';
         display = product.name.includes('Ultra') ? '6.8" Dynamic AMOLED 2X' : '6.2" Dynamic AMOLED 2X';
      } else if (product.brand === 'OnePlus' || product.brand === 'Google') {
         ram = '12GB LPDDR5X';
         processor = product.brand === 'Google' ? 'Google Tensor G3' : 'Snapdragon 8 Gen 3';
         camera = '50MP Main + 48MP UW + 32MP Telephoto';
         display = '6.7" LTPO AMOLED 120Hz';
      }

      return [
        { label: 'Display',    value: display },
        { label: 'Processor',  value: processor },
        { label: 'RAM',        value: ram },
        { label: 'Camera',     value: camera },
        { label: 'Battery',    value: product.brand === 'Apple' ? 'All-day battery life' : '5000 mAh Fast Charging' },
        { label: 'OS',         value: product.brand === 'Apple' ? 'iOS / iPadOS' : 'Android 14' },
      ];
    })(),
    laptops: (() => {
      let ram = '16GB DDR5';
      let processor = 'Intel Core i7 / AMD Ryzen 7';
      let graphics = 'Integrated Graphics';
      let display = '15.6" IPS Display';

      if (product.brand === 'Apple') {
         ram = product.name.includes('Pro') ? '18GB Unified Memory' : '8GB Unified Memory';
         processor = product.name.includes('M3 Max') ? 'Apple M3 Max 14-core' : product.name.includes('Pro') ? 'Apple M3 Pro' : 'Apple M2 / M3';
         graphics = product.name.includes('Pro') ? 'Apple 14-core GPU' : 'Apple 8-core GPU';
         display = product.name.includes('16') ? '16.2" Liquid Retina XDR' : '13.6" / 14.2" Liquid Retina';
      } else if (product.category === 'gaming') {
         ram = '32GB DDR5 5600MHz';
         processor = 'Intel Core i9 14900HX';
         graphics = 'NVIDIA GeForce RTX 4080 12GB';
      }
      return [
        { label: 'Display',    value: display },
        { label: 'Processor',  value: processor },
        { label: 'RAM',        value: ram },
        { label: 'Graphics',   value: graphics },
        { label: 'OS',         value: product.brand === 'Apple' ? 'macOS Sonoma' : 'Windows 11' },
      ];
    })(),
    audio: [
      { label: 'Brand',        value: product.brand },
      { label: 'Type',         value: 'Headphones / Earbuds' },
      { label: 'Price',        value: `₹${product.price.toLocaleString('en-IN')}` },
      { label: 'Rating',       value: `${product.rating} / 5 (${product.reviewCount?.toLocaleString()} reviews)` },
      { label: 'Connectivity', value: 'Bluetooth 5.3 + Wired' },
      { label: 'Battery',      value: 'Up to 30 hours playback' },
      { label: 'Warranty',     value: '1 Year Manufacturer Warranty' },
      { label: 'Availability', value: product.inStock ? 'In Stock' : 'Out of Stock' },
    ],
    wearables: [
      { label: 'Brand',        value: product.brand },
      { label: 'Type',         value: 'Smartwatch / Fitness Band' },
      { label: 'Price',        value: `₹${product.price.toLocaleString('en-IN')}` },
      { label: 'Rating',       value: `${product.rating} / 5 (${product.reviewCount?.toLocaleString()} reviews)` },
      { label: 'Display',      value: 'AMOLED Always-On Display' },
      { label: 'Battery',      value: 'Up to 7 days' },
      { label: 'Water Resist', value: '5 ATM' },
      { label: 'Warranty',     value: '1 Year Manufacturer Warranty' },
    ],
    gaming: [
      { label: 'Brand',        value: product.brand },
      { label: 'Type',         value: 'Gaming Accessory / Console' },
      { label: 'Price',        value: `₹${product.price.toLocaleString('en-IN')}` },
      { label: 'Rating',       value: `${product.rating} / 5 (${product.reviewCount?.toLocaleString()} reviews)` },
      { label: 'Connectivity', value: 'Wireless + Wired' },
      { label: 'Compatibility',value: 'PC, Console, Mobile' },
      { label: 'Warranty',     value: '1 Year Warranty' },
      { label: 'Availability', value: product.inStock ? 'In Stock' : 'Out of Stock' },
    ],
    accessories: [
      { label: 'Brand',        value: product.brand },
      { label: 'Type',         value: 'Accessory' },
      { label: 'Price',        value: `₹${product.price.toLocaleString('en-IN')}` },
      { label: 'Rating',       value: `${product.rating} / 5 (${product.reviewCount?.toLocaleString()} reviews)` },
      { label: 'Warranty',     value: '1 Year Warranty' },
      { label: 'Availability', value: product.inStock ? 'In Stock' : 'Out of Stock' },
    ],
    clothing: [
      { label: 'Brand',        value: product.brand },
      { label: 'Category',     value: 'Clothing & Footwear' },
      { label: 'Price',        value: `₹${product.price.toLocaleString('en-IN')}` },
      { label: 'Rating',       value: `${product.rating} / 5 (${product.reviewCount?.toLocaleString()} reviews)` },
      { label: 'Material',     value: '100% Premium Cotton / Synthetic Blend' },
      { label: 'Sizes',        value: 'XS, S, M, L, XL, XXL' },
      { label: 'Care',         value: 'Machine Wash Cold, Tumble Dry Low' },
      { label: 'Availability', value: product.inStock ? 'In Stock' : 'Out of Stock' },
    ],
    fashion: [
      { label: 'Brand',        value: product.brand },
      { label: 'Category',     value: 'Fashion & Accessories' },
      { label: 'Price',        value: `₹${product.price.toLocaleString('en-IN')}` },
      { label: 'Rating',       value: `${product.rating} / 5 (${product.reviewCount?.toLocaleString()} reviews)` },
      { label: 'Material',     value: 'Premium Grade Material' },
      { label: 'Warranty',     value: '30-Day Return Policy' },
      { label: 'Authenticity', value: '100% Genuine Product' },
      { label: 'Availability', value: product.inStock ? 'In Stock' : 'Out of Stock' },
    ],
    makeup: [
      { label: 'Brand',        value: product.brand },
      { label: 'Category',     value: 'Makeup & Beauty' },
      { label: 'Price',        value: `₹${product.price.toLocaleString('en-IN')}` },
      { label: 'Rating',       value: `${product.rating} / 5 (${product.reviewCount?.toLocaleString()} reviews)` },
      { label: 'Skin Type',    value: 'All Skin Types' },
      { label: 'Cruelty Free', value: 'Yes' },
      { label: 'Shelf Life',   value: '24 Months from manufacture' },
      { label: 'Availability', value: product.inStock ? 'In Stock' : 'Out of Stock' },
    ],
    groceries: [
      { label: 'Brand',        value: product.brand },
      { label: 'Category',     value: 'Groceries & Spices' },
      { label: 'Price',        value: `₹${product.price.toLocaleString('en-IN')}` },
      { label: 'Rating',       value: `${product.rating} / 5 (${product.reviewCount?.toLocaleString()} reviews)` },
      { label: 'Type',         value: 'Organic Whole Spice' },
      { label: 'Weight',       value: '100g' },
      { label: 'Tax',          value: product.noTax ? 'Tax Exempt' : 'Applicable' },
      { label: 'Availability', value: product.inStock ? 'In Stock' : 'Out of Stock' },
    ],
    scam: [
      { label: 'Brand',        value: 'TrustMeBro Inc' },
      { label: 'Category',     value: 'Absolute Scam' },
      { label: 'Price',        value: `₹${product.price.toLocaleString('en-IN')}` },
      { label: 'Rating',       value: `${product.rating} / 5 (Definitely fake reviews)` },
      { label: 'Warranty',     value: 'Void immediately upon purchase' },
      { label: 'Materials',    value: '100% Pure Scam Liquid' },
      { label: 'Returns',      value: 'Hahahaha. No.' },
      { label: 'Secret Feature', value: 'Vanishes after payment' },
    ],
  };
  return specsByCategory[product.category] ?? specsByCategory.accessories;
};

export const getProductDescription = (product) => {
  const templates = {
    phones: `The ${product.name} from ${product.brand} delivers a premium flagship experience. With cutting-edge performance, an exceptional camera system, and a stunning display, it's designed for those who demand the very best from their device. Whether you're capturing memories, staying productive, or gaming on the go — this device handles it all with ease.`,
    laptops: `The ${product.name} by ${product.brand} redefines portable computing. Built for performance and portability, it offers blazing-fast speeds and a premium build quality that meets the needs of professionals and students alike. Experience seamless multitasking, stunning visuals, and all-day battery life.`,
    audio: `Immerse yourself in sound with the ${product.name} from ${product.brand}. Featuring premium drivers, advanced noise cancellation, and a comfortable design, these headphones deliver an audiophile-grade listening experience — whether at home, at the office, or on the move.`,
    wearables: `The ${product.name} by ${product.brand} is your intelligent companion for everyday life. Track your health metrics, receive smart notifications, and stay connected — all from your wrist. Built with premium materials and a gorgeous display, it's as stylish as it is functional.`,
    gaming: `Level up your gaming experience with the ${product.name} from ${product.brand}. Engineered for precision and comfort, it delivers responsive controls and immersive performance whether you're competing online or exploring vast open worlds.`,
    accessories: `The ${product.name} from ${product.brand} is a premium accessory designed to enhance your setup. Built with quality materials and thoughtful design, it's the perfect complement to your devices.`,
    clothing: `The ${product.name} from ${product.brand} combines style and comfort in a single premium piece. Crafted from high-quality materials with meticulous attention to detail, it's designed to keep you looking great — wherever the day takes you.`,
    fashion: `Make a statement with the ${product.name} from ${product.brand}. This premium fashion accessory is crafted with exceptional quality and sophistication — the perfect finishing touch to any outfit.`,
    makeup: `Achieve your best look with the ${product.name} from ${product.brand}. Formulated with skin-loving ingredients and long-lasting pigments, this beauty essential delivers a flawless finish that lasts all day without compromising on comfort.`,
    groceries: `Spice up your life with the purest ${product.name}. Handpicked from premium organic farms by ${product.brand}, this pantry essential delivers an unbeatable punch of authentic flavor. High quality, fresh, and naturally free from artificial additives.`,
    scam: `Have you ever wanted to burn exactly ₹20 for absolutely no reason? Enter the ${product.name}! This is a 100% certified scam. We promise you will receive nothing, your expectations will be shattered, and you will totally regret this purchase. If you buy this, the only thing you're getting is a lesson in bad financial decisions. Buy now before it disappears into the void!`,
  };
  return templates[product.category] ?? `${product.name} from ${product.brand} — a premium product at a great price.`;
};
