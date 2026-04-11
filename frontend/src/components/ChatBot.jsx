import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './ChatBot.css';

const API_BASE = '/api/v1/ai'; // Proxied through Vercel → no CORS on iOS



// ── Format ₹ price ───────────────────────────────────────────────────────────
const fmt = (n) => `₹${Number(n).toLocaleString('en-IN')}`;

// ── Detect shopping intent (only show product cards when actually shopping) ──
function isShoppingIntent(text) {
  const q = text.toLowerCase();
  const buyKeywords = [
    'buy', 'purchase', 'recommend', 'suggestion', 'best', 'which', 'should i',
    'worth it', 'budget', 'under', 'below', 'afford', 'price', 'cheapest',
    'top', 'show me', 'find me', 'looking for', 'available', 'instock',
    'compare', 'vs ', 'versus', 'difference between', 'good phone', 'good laptop',
    'good headphone', 'pick for me', 'what to buy',
  ];
  return buyKeywords.some(kw => q.includes(kw));
}

// ── Quick suggestion chips — only shown in welcome state ────────────────────
const WELCOME_CHIPS = [
  { icon: '📱', text: 'Best phone under ₹30,000?' },
  { icon: '💻', text: 'Which laptop is best for students?' },
  { icon: '🎧', text: 'Sony vs Bose headphones — honest take?' },
  { icon: '⌚', text: 'Best smartwatch for fitness?' },
];

// ── Star rating ──────────────────────────────────────────────────────────────
function Stars({ rating }) {
  return (
    <span className="cb-stars">
      {[1,2,3,4,5].map(i => (
        <span key={i} className={i <= Math.round(rating) ? 'cb-star filled' : 'cb-star'}>★</span>
      ))}
      <span className="cb-rating-num">{rating}</span>
    </span>
  );
}

// ── Typing bubble ─────────────────────────────────────────────────────────────
function TypingBubble() {
  return (
    <div className="cb-msg cb-msg--bot">
      <div className="cb-avatar">
        <AvaIcon size={14} />
      </div>
      <div className="cb-bubble cb-bubble--bot cb-bubble--typing">
        <span className="cb-dot" />
        <span className="cb-dot" />
        <span className="cb-dot" />
      </div>
    </div>
  );
}

// ── Ava SVG logo icon ─────────────────────────────────────────────────────────
function AvaIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a4 4 0 014 4v1a4 4 0 01-8 0V6a4 4 0 014-4z"/>
      <path d="M20 11H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2v-6a2 2 0 00-2-2z"/>
      <circle cx="9"  cy="16" r="1" fill="currentColor" stroke="none"/>
      <circle cx="12" cy="16" r="1" fill="currentColor" stroke="none"/>
      <circle cx="15" cy="16" r="1" fill="currentColor" stroke="none"/>
    </svg>
  );
}

// ── Product card shown inside chat ────────────────────────────────────────────
function ProductCard({ product, onView }) {
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <div className="cb-product-card" onClick={() => onView(product._id)}>
      <div className="cb-product-info">
        <div className="cb-product-header">
          <span className="cb-product-brand">{product.brand}</span>
          {product.badge && <span className="cb-product-badge">{product.badge}</span>}
          {!product.inStock && <span className="cb-product-oos">Out of Stock</span>}
        </div>
        <h4 className="cb-product-name">{product.name}</h4>
        <div className="cb-product-price-row">
          <span className="cb-product-price">{fmt(product.price)}</span>
          {product.originalPrice && (
            <>
              <span className="cb-product-original">{fmt(product.originalPrice)}</span>
              <span className="cb-product-discount">−{discount}%</span>
            </>
          )}
        </div>
        <Stars rating={product.rating} />
      </div>
      <button className="cb-product-view">View →</button>
    </div>
  );
}

// ── Inline bold renderer ─────────────────────────────────────────────────────
function RenderInline({ text }) {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return (
    <>
      {parts.map((part, j) =>
        j % 2 === 1 ? <strong key={j}>{part}</strong> : part
      )}
    </>
  );
}

// ── Format bot message — structured renderer ─────────────────────────────────
function FormatText({ text }) {
  const lines = text.split('\n');
  const elements = [];

  lines.forEach((raw, i) => {
    const line = raw.trim();

    // Empty line → small spacer
    if (!line) {
      elements.push(<div key={i} className="cb-spacer" />);
      return;
    }

    // Standalone **Label** or **Label:** → section header chip
    if (/^\*\*[^*]+\*\*:?$/.test(line)) {
      const label = line.replace(/\*\*/g, '').replace(/:$/, '');
      elements.push(
        <div key={i} className="cb-section-label">{label}</div>
      );
      return;
    }

    // Bullet: •, -, *
    if (/^[•\-\*]\s/.test(line)) {
      const content = line.replace(/^[•\-\*]\s*/, '');
      elements.push(
        <div key={i} className="cb-bullet">
          <span><RenderInline text={content} /></span>
        </div>
      );
      return;
    }

    // Numbered: 1. 2.
    if (/^\d+\.\s/.test(line)) {
      const num     = line.match(/^(\d+)\./)[1];
      const content = line.replace(/^\d+\.\s*/, '');
      elements.push(
        <div key={i} className="cb-numbered">
          <span className="cb-num">{num}</span>
          <span><RenderInline text={content} /></span>
        </div>
      );
      return;
    }

    // Normal line (may have inline **bold**)
    elements.push(
      <p key={i} className="cb-text-line">
        <RenderInline text={line} />
      </p>
    );
  });

  return <div className="cb-text-body">{elements}</div>;
}

// ── Single message bubble ─────────────────────────────────────────────────────
function Message({ msg, onViewProduct }) {
  const isBot = msg.role === 'bot';
  const showCards = isBot && msg.products?.length > 0 && msg.showProducts;

  return (
    <div className={`cb-msg ${isBot ? 'cb-msg--bot' : 'cb-msg--user'}`}>
      {isBot && (
        <div className="cb-avatar">
          <AvaIcon size={14} />
        </div>
      )}

      <div className="cb-bubble-wrap">
        <div className={`cb-bubble ${isBot ? 'cb-bubble--bot' : 'cb-bubble--user'}`}>
          {isBot ? <FormatText text={msg.text} /> : msg.text}
        </div>

        {/* Product cards — strictly only when user was shopping */}
        {showCards && (
          <div className="cb-products">
            <div className="cb-products-label">From our store</div>
            {msg.products.slice(0, 3).map(p => (
              <ProductCard key={p._id} product={p} onView={onViewProduct} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
//  MAIN CHATBOT COMPONENT
// ═══════════════════════════════════════════════════════════════════════════
export default function ChatBot() {
  const navigate = useNavigate();
  const [open, setOpen]           = useState(false);
  const [messages, setMessages]   = useState([]);
  const [input, setInput]         = useState('');
  const [loading, setLoading]     = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [unread, setUnread]       = useState(0);
  const [error, setError]         = useState('');
  const messagesEndRef = useRef(null);
  const inputRef       = useRef(null);

  // ── Update --cb-vh whenever visual viewport resizes (keyboard open/close) ──
  useEffect(() => {
    const setVh = () => {
      const h = window.visualViewport?.height ?? window.innerHeight;
      document.documentElement.style.setProperty('--cb-vh', `${h}px`);
    };
    setVh();
    window.visualViewport?.addEventListener('resize', setVh);
    window.visualViewport?.addEventListener('scroll', setVh);
    return () => {
      window.visualViewport?.removeEventListener('resize', setVh);
      window.visualViewport?.removeEventListener('scroll', setVh);
    };
  }, []);

  // ── iOS scroll lock — prevents page background from scrolling when panel ──
  // is open. On iOS Safari, if the page scrolls (e.g. when keyboard opens),
  // position:fixed elements visually move up with it. Locking body scroll
  // prevents that and keeps the panel exactly in place.
  useEffect(() => {
    if (open) {
      const scrollY = window.scrollY;
      document.body.style.position   = 'fixed';
      document.body.style.top        = `-${scrollY}px`;
      document.body.style.left       = '0';
      document.body.style.right      = '0';
      document.body.style.overflowY  = 'scroll'; // keep scrollbar width, avoid layout shift
    } else {
      const scrollY = parseFloat(document.body.style.top || '0') * -1;
      document.body.style.position   = '';
      document.body.style.top        = '';
      document.body.style.left       = '';
      document.body.style.right      = '';
      document.body.style.overflowY  = '';
      // Restore exact scroll position
      window.scrollTo(0, scrollY);
    }
    return () => {
      // Cleanup on unmount
      document.body.style.position  = '';
      document.body.style.top       = '';
      document.body.style.left      = '';
      document.body.style.right     = '';
      document.body.style.overflowY = '';
    };
  }, [open]);



  // ── Scroll to latest message ──────────────────────────────────────────────
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);
  useEffect(scrollToBottom, [messages, loading, scrollToBottom]);

  // ── Focus input when panel opens ──────────────────────────────────────────
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 130);
      setUnread(0);
    }
  }, [open]);

  // ── Show welcome message on first open ────────────────────────────────────
  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{
        id: Date.now(),
        role: 'bot',
        text: "Hey! I'm **Ava** ✨ — your AI shopping sidekick.\n\nPhones, laptops, headphones, budget picks, comparisons — I've done the research so you don't have to guess. What are we shopping for?",
        products: [],
        showProducts: false,
        isWelcome: true,
      }]);
    }
  }, [open, messages.length]);

  // ── Listen for "open chatbot" custom event from external buttons ──────────
  useEffect(() => {
    const handler = (e) => {
      setOpen(true);
      if (e.detail?.prefill) {
        setTimeout(() => {
          setInput(e.detail.prefill);
          inputRef.current?.focus();
        }, 200);
      }
    };
    window.addEventListener('open-chatbot', handler);
    return () => window.removeEventListener('open-chatbot', handler);
  }, []);

  // ── Send message ──────────────────────────────────────────────────────────
  const sendMessage = useCallback(async (text) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;

    const showProducts = isShoppingIntent(msg);

    setInput('');
    setError('');
    setMessages(prev => [...prev, { id: Date.now(), role: 'user', text: msg }]);
    setLoading(true);

    // 30-second timeout — prevents silent hangs on slow mobile connections
    const controller = new AbortController();
    const timeoutId  = setTimeout(() => controller.abort(), 30000);

    try {
      const res = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ msg, sessionId }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.response || 'Something went wrong');
      }

      if (data.sessionId) setSessionId(data.sessionId);

      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'bot',
        text: data.response,
        products: data.products || [],
        showProducts,   // ← only true when user was actually shopping
        isWelcome: false,
      }]);

      if (!open) setUnread(u => u + 1);

    } catch (err) {
      clearTimeout(timeoutId);
      // Map browser-specific network errors to friendly messages
      const raw = err.message || '';
      const errMsg =
        err.name === 'AbortError'
          ? 'Request timed out (30s). Check your connection and try again.'
          : raw.includes('Failed to fetch') || raw.includes('Load failed') || raw.includes('NetworkError')
            ? "Couldn't reach Ava's server. Check your connection and try again."
            : raw || 'Something went wrong. Try again!';

      setError(errMsg);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'bot',
        text: errMsg,
        products: [],
        showProducts: false,
        isWelcome: false,
      }]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, sessionId, open]);

  // ── Chip clicked in welcome state ─────────────────────────────────────────
  const handleChip = (text) => {
    setInput(text);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  // ── Enter key sends ───────────────────────────────────────────────────────
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // ── Navigate to product page ──────────────────────────────────────────────
  const handleViewProduct = (id) => {
    navigate(`/products/${id}`);
    setOpen(false);
  };

  // ── Clear chat ────────────────────────────────────────────────────────────
  const clearChat = () => {
    setMessages([]);
    setSessionId(null);
    setError('');
  };

  // Whether to show welcome chips (only when the sole message is the welcome)
  const showWelcomeChips = messages.length === 1 && messages[0]?.isWelcome && !loading;

  return (
    <>
      {/* ── Floating Action Button ─────────────────────────────────────── */}
      <button
        id="chatbot-fab"
        className={`cb-fab ${open ? 'cb-fab--open' : ''}`}
        onClick={() => setOpen(o => !o)}
        aria-label="Open Ava AI assistant"
      >
        {open ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        ) : (
          <>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
              <circle cx="9"  cy="10" r="1" fill="currentColor"/>
              <circle cx="12" cy="10" r="1" fill="currentColor"/>
              <circle cx="15" cy="10" r="1" fill="currentColor"/>
            </svg>
            {unread > 0 && <span className="cb-fab-badge">{unread}</span>}
          </>
        )}
        {!open && <span className="cb-fab-pulse" />}
      </button>

      {/* ── Chat Panel ────────────────────────────────────────────────── */}
      <div className={`cb-panel ${open ? 'cb-panel--open' : ''}`} id="chatbot-panel">

        {/* Header */}
        <div className="cb-header">
          <div className="cb-header-left">
            <div className="cb-header-avatar">
              <AvaIcon size={17} />
              <span className="cb-header-status" />
            </div>
            <div>
              <div className="cb-header-name">
                Ava
                <span className="cb-header-ai-tag">AI</span>
              </div>
              <div className="cb-header-sub">Shopping Expert · Online</div>
            </div>
          </div>
          <div className="cb-header-actions">
            <button className="cb-header-btn" onClick={clearChat} title="New conversation">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
                <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
              </svg>
            </button>
            <button className="cb-header-btn" onClick={() => setOpen(false)} title="Close">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="cb-messages" id="chatbot-messages">

          {messages.map(msg => (
            <Message key={msg.id} msg={msg} onViewProduct={handleViewProduct} />
          ))}

          {/* Suggestion chips — ONLY after welcome message, never after responses */}
          {showWelcomeChips && (
            <div className="cb-welcome-chips">
              <div className="cb-welcome-chips-label">Try asking</div>
              {WELCOME_CHIPS.map((chip, i) => (
                <button
                  key={i}
                  className="cb-chip"
                  onClick={() => handleChip(chip.text)}
                >
                  <span className="cb-chip-icon">{chip.icon}</span>
                  {chip.text}
                </button>
              ))}
            </div>
          )}

          {loading && <TypingBubble />}

          <div ref={messagesEndRef} />
        </div>

        {/* Error */}
        {error && <div className="cb-error">{error}</div>}

        {/* Input */}
        <div className="cb-input-area">
          <div className="cb-input-wrap">
            <textarea
              ref={inputRef}
              id="chatbot-input"
              className="cb-input"
              placeholder="Ask me anything about any product..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              disabled={loading}
            />
            <button
              id="chatbot-send"
              className={`cb-send ${input.trim() && !loading ? 'cb-send--active' : ''}`}
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              aria-label="Send message"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>
          <div className="cb-input-footer">
            <span className="cb-input-hint">Powered by Gemini AI</span>
            <span className="cb-input-hint-dot" />
            <span className="cb-input-hint">Enter to send</span>
          </div>
        </div>
      </div>
    </>
  );
}
