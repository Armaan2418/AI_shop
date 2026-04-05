from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

# 🧠 SYSTEM PROMPT (your bot personality)
SYSTEM_PROMPT = (
    "Your name is Ava. You are a sweet personal shopping assistant for Prachi's 'AI Shop'. "
    "Be helpful, polite, and sugarcoat your advice!"
)

# 🛒 Sample Product Data (Replace with DB later)
products = [
    {
        "_id": "1",
        "name": "iPhone 15 Pro Max",
        "category": "phones",
        "price": 129900,
        "rating": 4.9
    },
    {
        "_id": "2",
        "name": "MacBook Air M3",
        "category": "laptops",
        "price": 114900,
        "rating": 4.8
    },
    {
        "_id": "3",
        "name": "Budget Android Phone",
        "category": "phones",
        "price": 14999,
        "rating": 4.3
    },
    {
        "_id": "4",
        "name": "Gaming Laptop",
        "category": "laptops",
        "price": 75000,
        "rating": 4.5
    }
]

# 🔍 Simple filtering logic
def filter_products(user_msg):
    user_msg = user_msg.lower()
    filtered = products

    # Filter by category
    if "phone" in user_msg:
        filtered = [p for p in filtered if p["category"] == "phones"]

    if "laptop" in user_msg:
        filtered = [p for p in filtered if p["category"] == "laptops"]

    # Filter by price
    import re
    price_match = re.search(r'\d+', user_msg)
    if price_match:
        max_price = int(price_match.group())
        filtered = [p for p in filtered if p["price"] <= max_price]

    return filtered

# 🤖 AI CHAT ROUTE
@app.route("/get", methods=["POST"])
def chat():
    try:
        data = request.get_json()
        user_msg = data.get("msg")

        if not user_msg:
            return jsonify({"response": "I didn't receive a message!"}), 400

        # 🔍 Filter products based on user query
        filtered_products = filter_products(user_msg)

        # 🧠 Build AI prompt
        prompt = f"""
{SYSTEM_PROMPT}

User said: "{user_msg}"

Available products:
{filtered_products}

Instructions:
- Recommend ONLY from the available products
- Be friendly and conversational
- Mention product names and prices
"""

        # 🚀 Call Ollama API
        response = requests.post(
            "http://localhost:11434/api/generate",
            json={
                "model": "llama3",
                "prompt": prompt,
                "stream": False
            }
        )

        ai_reply = response.json().get("response", "")

        return jsonify({
            "response": ai_reply,
            "products": filtered_products  # send to frontend for cards
        })

    except Exception as e:
        print(f"AI ERROR: {e}")
        return jsonify({"response": "I'm having trouble right now!"}), 500


# 🛍️ FEATURED PRODUCTS ROUTE (unchanged)
@app.route("/api/products/featured", methods=["GET"])
def get_featured():
    try:
        return jsonify({"products": products})
    except Exception as e:
        print(f"PRODUCT ERROR: {e}")
        return jsonify({"error": str(e)}), 500


# ▶️ RUN SERVER
if __name__ == "__main__":
    app.run(debug=True, port=5001)