const fs = require('fs');
let prodContent = fs.readFileSync('frontend/src/data/products.js', 'utf8');

const explicitMap = {
  'AirPods Pro 2': '/images/products/airpods-pro-2.jpg',
  'Bose QC45': '/images/products/bose-qc45.jpg',
  'Dell XPS 15': '/images/products/dell-xps-15.jpg',
  'HP Spectre x360': '/images/products/hp-spectre.jpg',
  'iPad Pro M4': '/images/products/ipad-pro.jpg',
  'iPhone 15 Pro': '/images/products/iphone-15-pro.jpg',
  'Lenovo IdeaPad 5': '/images/products/lenovo-ideapad.jpg',
  'MacBook Air M3': '/images/products/macbook-air-m3.jpg',
  'PlayStation 5': '/images/products/ps5-console.jpg',
  'Razer Kraken Headset': '/images/products/razer-kraken.jpg',
  'Galaxy Tab S9 Ultra': '/images/products/samsung-tab-s9-ultra.jpg',
  'Sony WH-1000XM5': '/images/products/sony-wh1000xm5.jpg',
  'Xbox Wireless Controller': '/images/products/xbox-series-x.jpg',
  
  'Galaxy Z Fold 5': 'https://m.media-amazon.com/images/I/716pi7fRYjL._SX679_.jpg',
  'OnePlus Pad': 'https://m.media-amazon.com/images/I/61MvUa1k6WL._SX679_.jpg',
  'JBL Tune 770NC': 'https://m.media-amazon.com/images/I/61k1qH1tFmL._SX679_.jpg',
  'Sennheiser Momentum 4': 'https://m.media-amazon.com/images/I/61KqUa-t2WL._SX679_.jpg',
  'Galaxy Buds2 Pro': 'https://m.media-amazon.com/images/I/51r5I9i27NL._SX679_.jpg',
  'AirPods Max': 'https://m.media-amazon.com/images/I/81jqUPkIGhL._SX679_.jpg',
  'Realme Buds Air 5 Pro': 'https://m.media-amazon.com/images/I/61H4hT0K4bL._SX679_.jpg',
  'OnePlus Buds Pro 2': 'https://m.media-amazon.com/images/I/51p0c0oB8sL._SX679_.jpg',
  'Apple Watch Ultra 2': 'https://m.media-amazon.com/images/I/81h9iFk-50L._SX679_.jpg',
  'Galaxy Watch 6': 'https://m.media-amazon.com/images/I/71p0A1A-85L._SX679_.jpg',
  'Fitbit Sense 2': 'https://m.media-amazon.com/images/I/61P1aC21vJL._SX679_.jpg',
  'Garmin Forerunner 255': 'https://m.media-amazon.com/images/I/51P+RHz4nBL._SX679_.jpg',
  'Nintendo Switch Lite': 'https://m.media-amazon.com/images/I/71dZZgKcwGL._SX679_.jpg',
  'Nintendo Switch OLED': 'https://m.media-amazon.com/images/I/61O9tD6NAAL._SX679_.jpg',
  'Nintendo Pro Controller': 'https://m.media-amazon.com/images/I/61O9tD6NAAL._SX679_.jpg',
  'Sony Bravia 65" OLED': 'https://m.media-amazon.com/images/I/91rI6JvBpwL._SX679_.jpg',
  'Samsung 4K Monitor': 'https://m.media-amazon.com/images/I/81stE7sQ-pL._SX679_.jpg',
  'Polo T-Shirt': 'https://m.media-amazon.com/images/I/81Uq+a6yK1L._SX679._AC_UL640_FMwebp_QL65_.jpg',
  'Zip-up Hoodie': 'https://m.media-amazon.com/images/I/61aMlvXzTmL._SX679._AC_UL640_FMwebp_QL65_.jpg',
  'Sports Shorts': 'https://m.media-amazon.com/images/I/51I3IqZ0MOL._SX679_.jpg',
  'Nike Air Max 270': 'https://m.media-amazon.com/images/I/71Y+R48qXLL._AC_UL640_FMwebp_QL65_.jpg',
  'Levis 501 Original Jeans': 'https://m.media-amazon.com/images/I/81wMIfP99eL._SX679._AC_UL640_FMwebp_QL65_.jpg',
  'Zara Trench Coat': 'https://m.media-amazon.com/images/I/61X-uV+R8PL._SY741._AC_UL640_FMwebp_QL65_.jpg',
  'H&M Pleated Skirt': 'https://m.media-amazon.com/images/I/61XzEksjRDL._SX679._AC_UL640_FMwebp_QL65_.jpg',
  'Pearl Drop Earrings': 'https://m.media-amazon.com/images/I/61x0a-0-YHL._SX679._AC_UL640_FMwebp_QL65_.jpg',
  'Silk Scarf': 'https://m.media-amazon.com/images/I/81F5G-X8nQL._SX679._AC_UL640_FMwebp_QL65_.jpg',
  'Canvas Tote Bag': 'https://m.media-amazon.com/images/I/81eR0eXohtL._AC_UL640_FMwebp_QL65_.jpg',
  'Ray-Ban Aviator Classic': 'https://m.media-amazon.com/images/I/31I03dOqF-L._AC_UL640_FMwebp_QL65_.jpg',
  'Ray-Ban Wayfarer': 'https://m.media-amazon.com/images/I/41O0g3Xq7TL._AC_UL640_FMwebp_QL65_.jpg',
  'Coach Crossbody Bag': 'https://m.media-amazon.com/images/I/71v4uRYx5GL._AC_UL640_FMwebp_QL65_.jpg',
  'Coach Wallet': 'https://m.media-amazon.com/images/I/71x4x0G6I2L._AC_UL640_FMwebp_QL65_.jpg',
  'Coach Tabby Shoulder Bag': 'https://m.media-amazon.com/images/I/71R2nJ7z2TL._AC_UL640_FMwebp_QL65_.jpg'
};

for (const [name, url] of Object.entries(explicitMap)) {
  const safeName = name.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
  const regex = new RegExp(`name:\\s*\\x27${safeName}\\x27[\\s\\S]*?image:\\s*\\x27.*?\\x27`, "g");
  prodContent = prodContent.replace(regex, (match) => {
    return match.replace(/image:\s*\x27.*?\x27/, `image: \x27${url}\x27`);
  });
}

// Fallback all remaining Unsplash generic placeholders so user doesn't see broken/misaligned mock images
prodContent = prodContent.replace(/image:\s*\x27https:\/\/images\.unsplash\.com[^\x27]*\x27/g, `image: 'https://m.media-amazon.com/images/I/71o06qeJuZL._AC_UL640_FMwebp_QL65_.jpg'`);

fs.writeFileSync('frontend/src/data/products.js', prodContent);
console.log("Image correction completed successfully.");
