import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { MOCK_PRODUCTS } from "../data/products.js"; // backend copy of catalog

const router = express.Router();

// ═══════════════════════════════════════════════
//  GEMINI SETUP  — Reverted to gemini-1.5-flash 
//  because the key explicitly threw limit: 0 for 2.0
// ═══════════════════════════════════════════════
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function makeModel() {
  return genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
    generationConfig: { maxOutputTokens: 900, temperature: 0.85 },
  });
}

// ── Helper: sleep ms ─────────────────────────────────────────────────────────
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

// ── Create & cache a fresh chat session ──────────────────────────────────────
function createSession() {
  const chat = makeModel().startChat({ history: [] });
  return { chat, lastAccess: Date.now() };
}

// In-memory session store: sessionId → ChatSession
const sessions = new Map();

// Clean old sessions every 30 minutes
setInterval(() => {
  const cutoff = Date.now() - 30 * 60 * 1000;
  for (const [id, data] of sessions) {
    if (data.lastAccess < cutoff) sessions.delete(id);
  }
}, 10 * 60 * 1000);

// ═══════════════════════════════════════════════
//  SYSTEM PROMPT  (kept short to save tokens)
// ═══════════════════════════════════════════════
const SYSTEM_PROMPT = `You are Ava — an AI shopping expert for "AI Shop", India's smartest e-commerce store. Think of yourself as that one brilliant friend who geeks out over specs, sniffs out bad deals from a mile away, and makes shopping genuinely fun.

Your personality:
• Witty and fun — drop a clever quip or light joke when it fits. Never cringe, never try-hard.
• Professional — you're an expert, own it. No fluff, no vague "it depends" answers.
• Informative — give real details: actual specs that matter in daily use, real price comparisons, honest trade-offs.
• Warm — like a friend texting you, not a chatbot reading from a manual.
• Light Hinglish is welcome (yaar, bhai, sach mein). Don't force it.

Phrases you use naturally: "absolute beast", "don't waste your money on this", "the sleeper pick nobody talks about", "honestly this one slaps", "overpriced junk wrapped in good marketing", "this aged like milk", "chef's kiss pick".

STRICT FORMAT — always follow this structure:

For RECOMMENDATIONS:
Line 1: One punchy, witty opening (who it's for, what vibe)

**Expected specs at this price:**
• [Spec 1 i.e. Display type/refresh rate]
• [Spec 2 i.e. Processor performance class]
• [Spec 3 i.e. Camera capabilities]
• [Spec 4 i.e. Battery & charging speed]
• [Spec 5 i.e. Build materials/extras]

**Top Picks:**
(Briefly introduce the top options from the store that meet the criteria)

**[Product Name 1]**
• **Pros:** [1-2 real-world strengths]
• **Cons:** [1 honest trade-off]

**[Product Name 2]** (if applicable)
• **Pros:** [1-2 real-world strengths]
• **Cons:** [1 honest trade-off]

**Verdict:** [1 decisive, slightly witty sentence — name the absolute winner and exactly why]

For COMPARISONS (vs / versus / compare):
**[Product A]**
• [key strength]
• [key weakness]

**[Product B]**
• [key strength]
• [key weakness]

**My Pick:** [decisive winner + punchy one-line reason — maybe with a dash of humour]

For GENERAL ADVICE:
Line 1: Direct, witty answer

**What to look for:**
• [point]
• [point]

**Common mistakes:**
• [mistake — make it relatable]

**Bottom line:** [one punchy, memorable sentence]

Rules:
• Use ₹ for all prices. Indian budget tiers: budget <₹15k, mid-range ₹20-35k, flagship >₹80k
• Only recommend from the PRODUCTS list in each message. If none match, answer from general knowledge.
• Keep it tight — no filler, no repetition, no corporate speak
• Never use ### or ## headers. Bold (**) for section labels only.
• One joke or witty comment per response max — quality over quantity`;


// ═══════════════════════════════════════════════
//  SMART PRODUCT FILTER
// ═══════════════════════════════════════════════
function smartFilter(msg) {
  const q = msg.toLowerCase();
  let pool = [...MOCK_PRODUCTS];

  // ── Context-aware overrides (must run BEFORE generic catMap) ────────────
  // "gaming pc" or "pc gaming" → gaming, not laptops
  const isGamingPc = (q.includes("gaming pc") || q.includes("pc gaming") ||
    (q.includes("gaming") && q.includes("pc")));

  // ── Category keyword map (order matters for single-match fallback) ───────
  const catMap = [
    // Gaming — high priority, check before generic "pc"
    { kw: "console",    cat: "gaming" },
    { kw: "playstation", cat: "gaming" },
    { kw: "ps5",        cat: "gaming" },
    { kw: "xbox",       cat: "gaming" },
    { kw: "nintendo",   cat: "gaming" },
    { kw: "controller", cat: "gaming" },
    { kw: "gaming",     cat: "gaming" },
    { kw: "game",       cat: "gaming" },
    // Phones
    { kw: "phone",      cat: "phones" },
    { kw: "mobile",     cat: "phones" },
    { kw: "smartphone", cat: "phones" },
    { kw: "iphone",     cat: "phones" },
    { kw: "android",    cat: "phones" },
    { kw: "tablet",     cat: "phones" },
    { kw: "ipad",       cat: "phones" },
    // Laptops
    { kw: "laptop",     cat: "laptops" },
    { kw: "macbook",    cat: "laptops" },
    { kw: "notebook",   cat: "laptops" },
    { kw: "pc",         cat: isGamingPc ? "gaming" : "laptops" },
    { kw: "computer",   cat: "laptops" },
    // Audio
    { kw: "headphone",  cat: "audio" },
    { kw: "earphone",   cat: "audio" },
    { kw: "earbud",     cat: "audio" },
    { kw: "airpod",     cat: "audio" },
    { kw: "speaker",    cat: "audio" },
    { kw: "headset",    cat: "audio" },
    // Wearables
    { kw: "watch",      cat: "wearables" },
    { kw: "smartwatch", cat: "wearables" },
    { kw: "fitness",    cat: "wearables" },
    { kw: "band",       cat: "wearables" },
    // Accessories
    { kw: "monitor",    cat: "accessories" },
    { kw: "charger",    cat: "accessories" },
    { kw: "keyboard",   cat: "accessories" },
    { kw: "mouse",      cat: "accessories" },
    // Clothing
    { kw: "shirt",      cat: "clothing" },
    { kw: "tshirt",     cat: "clothing" },
    { kw: "hoodie",     cat: "clothing" },
    { kw: "jeans",      cat: "clothing" },
    { kw: "jacket",     cat: "clothing" },
    { kw: "shoes",      cat: "clothing" },
    { kw: "sneaker",    cat: "clothing" },
    { kw: "dress",      cat: "clothing" },
    // Fashion
    { kw: "handbag",    cat: "fashion" },
    { kw: "sunglasses", cat: "fashion" },
    { kw: "necklace",   cat: "fashion" },
    { kw: "earring",    cat: "fashion" },
    { kw: "jewel",      cat: "fashion" },
    { kw: "ring",       cat: "fashion" },
    { kw: "bag",        cat: "fashion" },
    // Makeup
    { kw: "lipstick",   cat: "makeup" },
    { kw: "foundation", cat: "makeup" },
    { kw: "mascara",    cat: "makeup" },
    { kw: "makeup",     cat: "makeup" },
    { kw: "beauty",     cat: "makeup" },
    { kw: "eyeshadow",  cat: "makeup" },
  ];

  // ── Detect ALL matching categories (for comparison queries) ─────────────
  const isComparison = /\bvs\b|versus|compare|difference between|or the/.test(q);
  const matchedCats = new Set();
  for (const { kw, cat } of catMap) {
    if (q.includes(kw)) matchedCats.add(cat);
  }

  if (matchedCats.size > 1 && isComparison) {
    // Merge products from all matched categories for comparison queries
    pool = pool.filter(p => matchedCats.has(p.category));
  } else if (matchedCats.size === 1) {
    pool = pool.filter(p => p.category === [...matchedCats][0]);
  } else if (matchedCats.size > 1) {
    // Multiple categories but not a comparison — use the first (highest-priority) match
    const firstCat = catMap.find(({ kw }) => q.includes(kw))?.cat;
    if (firstCat) pool = pool.filter(p => p.category === firstCat);
  }

  // ── Brand detection ─────────────────────────
  const brands = ["apple","samsung","oneplus","google","realme","sony",
    "bose","jbl","sennheiser","dell","hp","lenovo","fitbit","garmin",
    "nike","zara","levis","h&m","mac","nyx","maybelline","urban decay",
    "laura mercier","pandora","coach","ray-ban","aldo"];
  for (const brand of brands) {
    if (q.includes(brand)) {
      const filtered = pool.filter(p => p.brand.toLowerCase().includes(brand));
      if (filtered.length) { pool = filtered; break; }
    }
  }

  // ── Budget / price detection ─────────────────
  const pricePatterns = [
    /under\s*(?:rs\.?|inr|₹)?\s*([\d,.]+)\s*(k|l|lakh)?\b/i,
    /below\s*(?:rs\.?|inr|₹)?\s*([\d,.]+)\s*(k|l|lakh)?\b/i,
    /less\s*than\s*(?:rs\.?|inr|₹)?\s*([\d,.]+)\s*(k|l|lakh)?\b/i,
    /(?:budget|max|upto|up to)\s*(?:rs\.?|inr|₹)?\s*([\d,.]+)\s*(k|l|lakh)?\b/i,
    /(?:rs\.?|inr|₹)\s*([\d,.]+)\s*(k|l|lakh)?\b/i,
    /([\d,.]+)\s*(k|l|lakh|rs|rupee|inr)\b/i,
  ];

  let maxPrice = null;
  for (const rx of pricePatterns) {
    const m = q.match(rx);
    if (m) {
      let val = parseFloat(m[1].replace(/,/g, ""));
      const mult = (m[2] || "").toLowerCase();
      if (mult === "k") val *= 1000;
      else if (mult === "l" || mult === "lakh") val *= 100000;
      maxPrice = parseInt(val);
      break;
    }
  }

  if (maxPrice) pool = pool.filter(p => p.price <= maxPrice);

  // ── Availability ────────────────────────────
  if (q.includes("in stock") || q.includes("available")) {
    pool = pool.filter(p => p.inStock);
  }

  // ── Sort by rating (best first) ──────────────
  pool.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);

  return pool.slice(0, 4); // Top 4 to keep input tokens low
}

// ═══════════════════════════════════════════════
//  POST /api/v1/ai/chat   (main endpoint)
// ═══════════════════════════════════════════════
router.post("/chat", async (req, res) => {
  const { msg, sessionId } = req.body;

  if (!msg || typeof msg !== "string" || !msg.trim()) {
    return res.status(400).json({ success: false, response: "Please send a message!" });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({
      success: false,
      response: "AI is not configured. Please add GEMINI_API_KEY to backend .env",
    });
  }

  // ── Get or create chat session ───────────
  const sid = sessionId || `s_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  if (!sessions.has(sid)) sessions.set(sid, createSession());
  const sessionData = sessions.get(sid);
  sessionData.lastAccess = Date.now();

  // ── Filter products for this query ────────
  const relevant = smartFilter(msg);
  const productContext = relevant.length
    ? `\n\nPRODUCTS:\n${relevant
        .map(p => `${p.name} | ${p.brand} | ₹${p.price.toLocaleString("en-IN")} | ${p.rating}★ | ${p.inStock ? "In Stock" : "OOS"}`)
        .join("\n")}`
    : "\n\n(No exact products in our store for this — answer from general expert knowledge and mention we may carry relevant items soon.)";  

  // ── Send to Gemini (auto-retry once on transient 429) ─────────────────────
  const attemptGemini = async (isRetry = false) => {
    try {
      const result = await sessionData.chat.sendMessage(msg + productContext);
      return result.response.text();
    } catch (err) {
      const is429 = err.message?.includes("429") || err.message?.includes("quota") || err.status === 429;

      // On 429, delete broken session, create a fresh one, wait 5s, retry once
      if (is429 && !isRetry) {
        console.warn("⚠️  Gemini 429 — creating fresh session and retrying in 5s...");
        sessions.delete(sid);
        const fresh = createSession();
        sessions.set(sid, fresh);
        fresh.lastAccess = Date.now();
        await sleep(5000);
        // Replace the chat reference in sessionData so the retry uses the fresh session
        sessionData.chat = fresh.chat;
        return attemptGemini(true);
      }

      throw err; // propagate to outer catch
    }
  };

  try {
    const aiReply = await attemptGemini();

    return res.status(200).json({
      success: true,
      response: aiReply,
      products: relevant,
      sessionId: sid,
    });

  } catch (err) {
    console.error("❌ Ava AI Error:", err.message);

    // Always delete the session on any error so next request starts fresh
    sessions.delete(sid);

    if (err.message?.includes("API_KEY_INVALID") || err.message?.includes("API key not valid")) {
      return res.status(401).json({ success: false, response: "There's a configuration issue on our end. Please try again shortly!" });
    }
    if (err.message?.includes("429") || err.message?.includes("quota") || err.status === 429) {
      return res.status(429).json({ success: false, response: "I'm thinking extra hard right now — give me 15 seconds and ask again! 🧠" });
    }
    if (err.message?.includes("SAFETY")) {
      return res.status(400).json({ success: false, response: "Ava couldn't respond to that one. Try rephrasing your question!" });
    }

    return res.status(500).json({
      success: false,
      response: "Something went wrong on my end — please try again! 💙",
    });
  }
});

// ═══════════════════════════════════════════════
//  GET /api/v1/ai/suggestions  (quick chips)
// ═══════════════════════════════════════════════
router.get("/suggestions", (_req, res) => {
  res.json({
    success: true,
    suggestions: [
      "Best phone under ₹30,000?",
      "Compare Sony vs Bose headphones",
      "Which laptop is best for students?",
      "Best gaming console to buy in 2025?",
      "Noise cancelling earbuds under ₹15k?",
      "Best smartwatch for fitness tracking?",
    ],
  });
});

export default router;