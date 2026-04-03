#!/bin/bash
DIR="frontend/public/images/products"
mkdir -p "$DIR"

dl() {
  local name="$1" url="$2"
  if [ -f "$DIR/$name" ] && [ -s "$DIR/$name" ]; then
    echo "EXISTS: $name"
    return
  fi
  s=$(curl -s -L -o "$DIR/$name" -w "%{http_code}" -H "User-Agent: Mozilla/5.0" "$url" -m 15)
  if [ "$s" = "200" ] && [ -s "$DIR/$name" ]; then
    sz=$(wc -c < "$DIR/$name")
    echo "OK: $name (${sz} bytes)"
  else
    rm -f "$DIR/$name"
    echo "FAIL: $name ($s)"
  fi
}

echo "=== Downloading from Amazon CDN ==="

# Key products - using Amazon media image URLs (these work with curl + User-Agent)
dl "iphone-15-pro.jpg" "https://m.media-amazon.com/images/I/618vU2qKXQL._AC_UL640_FMwebp_QL65_.jpg"
dl "samsung-tab-s9-ultra.jpg" "https://m.media-amazon.com/images/I/71o06qeJuZL._AC_UL640_FMwebp_QL65_.jpg"
dl "ps5-console.jpg" "https://m.media-amazon.com/images/I/61Q1Pa4X4-L._AC_UY436_FMwebp_QL65_.jpg"
dl "xbox-series-x.jpg" "https://m.media-amazon.com/images/I/81avVy49ufL._AC_UY436_FMwebp_QL65_.jpg"
dl "macbook-air-m3.jpg" "https://m.media-amazon.com/images/I/712WiT-wexL._AC_UL1280_FMwebp_QL65_.jpg"

# More products from Amazon
dl "galaxy-s24-ultra.jpg" "https://m.media-amazon.com/images/I/71E1yoZIxuL._SX679_.jpg"
dl "pixel-8-pro.jpg" "https://m.media-amazon.com/images/I/71GELn-MdCL._SX679_.jpg"
dl "oneplus-12.jpg" "https://m.media-amazon.com/images/I/61U2MxqMHrL._SX679_.jpg"
dl "galaxy-z-fold-5.jpg" "https://m.media-amazon.com/images/I/71Y0mHPxvAL._SX679_.jpg"
dl "ipad-pro.jpg" "https://m.media-amazon.com/images/I/81gC7frRJyL._SX679_.jpg"
dl "oneplus-pad.jpg" "https://m.media-amazon.com/images/I/61MDk6MzuWL._SX679_.jpg"
dl "realme-narzo.jpg" "https://m.media-amazon.com/images/I/71AviBFGJwL._SX679_.jpg"

# Laptops
dl "dell-xps-15.jpg" "https://m.media-amazon.com/images/I/71jG+e7roXL._SX679_.jpg"
dl "lenovo-ideapad.jpg" "https://m.media-amazon.com/images/I/71jG+e7roXL._SX679_.jpg"
dl "mac-studio.jpg" "https://m.media-amazon.com/images/I/71Nh1VjItRL._SX679_.jpg"

# Audio
dl "airpods-pro-2.jpg" "https://m.media-amazon.com/images/I/61SUj2aKoEL._SX679_.jpg"
dl "bose-qc45.jpg" "https://m.media-amazon.com/images/I/51JbsHSktkL._SX679_.jpg"
dl "jbl-tune770.jpg" "https://m.media-amazon.com/images/I/51JiC4AgLcL._SX679_.jpg"
dl "sennheiser-hd450bt.jpg" "https://m.media-amazon.com/images/I/41rlFYaQFvL._SX679_.jpg"
dl "galaxy-buds2-pro.jpg" "https://m.media-amazon.com/images/I/61Ig5WMmBZL._SX679_.jpg"
dl "airpods-max.jpg" "https://m.media-amazon.com/images/I/81jX3k2HoYL._SX679_.jpg"
dl "oneplus-buds-pro2.jpg" "https://m.media-amazon.com/images/I/51qdG7YQNLL._SX679_.jpg"
dl "realme-buds-air5.jpg" "https://m.media-amazon.com/images/I/51DdxJykETL._SX679_.jpg"

# Wearables
dl "apple-watch-ultra2.jpg" "https://m.media-amazon.com/images/I/81XAvYThyiL._SX679_.jpg"
dl "galaxy-watch-6.jpg" "https://m.media-amazon.com/images/I/61aDFERmikL._SX679_.jpg"
dl "fitbit-sense-2.jpg" "https://m.media-amazon.com/images/I/61mQNqPdtiL._SX679_.jpg"
dl "garmin-forerunner.jpg" "https://m.media-amazon.com/images/I/71+GP5Ub6WL._SX679_.jpg"
dl "realme-watch-3.jpg" "https://m.media-amazon.com/images/I/61xbyXNS6ZL._SX679_.jpg"

# Gaming
dl "ps5-dualsense.jpg" "https://m.media-amazon.com/images/I/61HnRrW4qYL._SX679_.jpg"
dl "nintendo-switch-lite.jpg" "https://m.media-amazon.com/images/I/71fkvFsrasL._SX679_.jpg"
dl "xbox-controller.jpg" "https://m.media-amazon.com/images/I/61u1pACYZyL._SX679_.jpg"
dl "razer-kraken.jpg" "https://m.media-amazon.com/images/I/61CGHv6kmWL._SX679_.jpg"
dl "nintendo-switch-oled.jpg" "https://m.media-amazon.com/images/I/61nqNujSF1L._SX679_.jpg"
dl "nintendo-pro-controller.jpg" "https://m.media-amazon.com/images/I/71gm24VnGnL._SX679_.jpg"
dl "steam-deck.jpg" "https://m.media-amazon.com/images/I/61k-0+uNSjL._SX679_.jpg"

# Accessories
dl "samsung-4k-monitor.jpg" "https://m.media-amazon.com/images/I/81Kkj4VD3HL._SX679_.jpg"
dl "anker-charger.jpg" "https://m.media-amazon.com/images/I/61bJDkAVapL._SX679_.jpg"
dl "logitech-mx-keys.jpg" "https://m.media-amazon.com/images/I/71gOCTsSF7L._SX679_.jpg"
dl "sony-bravia-65.jpg" "https://m.media-amazon.com/images/I/81TlEHvnbjL._SX679_.jpg"

# Clothing & Shoes
dl "nike-air-force-1.jpg" "https://m.media-amazon.com/images/I/61FxFRMFL3L._SY695_.jpg"
dl "nike-dri-fit.jpg" "https://m.media-amazon.com/images/I/61WqH9jIe2L._SX679_.jpg"
dl "nike-running-shoes.jpg" "https://m.media-amazon.com/images/I/71zZgrOLvUL._SY695_.jpg"
dl "nike-air-max-270.jpg" "https://m.media-amazon.com/images/I/71FKEaxv3CL._SY695_.jpg"
dl "levis-501.jpg" "https://m.media-amazon.com/images/I/61qGkJR+yJL._SY741_.jpg"

# Fashion
dl "ray-ban-aviator.jpg" "https://m.media-amazon.com/images/I/41hKJR+xUEL._SX679_.jpg"
dl "ray-ban-wayfarer.jpg" "https://m.media-amazon.com/images/I/41s3AT4JIuL._SX679_.jpg"
dl "coach-crossbody.jpg" "https://m.media-amazon.com/images/I/71Smc0S7IgL._SY741_.jpg"

# Makeup
dl "mac-lipstick.jpg" "https://m.media-amazon.com/images/I/31E9x7ynA4L._SX679_.jpg"
dl "nyx-foundation.jpg" "https://m.media-amazon.com/images/I/41A2sqHAqJL._SX679_.jpg"
dl "mac-studio-fix.jpg" "https://m.media-amazon.com/images/I/61i4Nh-SkRL._SX679_.jpg"
dl "maybelline-fit-me.jpg" "https://m.media-amazon.com/images/I/51h0YhKrOKL._SX679_.jpg"
dl "urban-decay-setting-spray.jpg" "https://m.media-amazon.com/images/I/61TiO7mLcJL._SX679_.jpg"
dl "mac-ruby-woo.jpg" "https://m.media-amazon.com/images/I/31nqoAE6uuL._SX679_.jpg"
dl "laura-mercier-powder.jpg" "https://m.media-amazon.com/images/I/51DqIR+yfaL._SX679_.jpg"

echo ""
echo "=== DOWNLOAD SUMMARY ==="
echo "Total files:"
ls "$DIR"/ | wc -l
echo "Files downloaded:"
ls -la "$DIR"/ | grep -v "^total" | grep -v "^\." | awk '{print $NF, $5}' | column -t
