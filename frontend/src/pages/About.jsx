import { Link } from 'react-router-dom';
import './About.css';

const Icon = ({ name, size = 20 }) => {
  const icons = {
    home:     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    chevronRight: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
    sparkles: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z"/><path d="M5 3l.75 2.25L8 6l-2.25.75L5 9l-.75-2.25L2 6l2.25-.75L5 3z"/><path d="M19 13l.75 2.25L22 16l-2.25.75L19 19l-.75-2.25L16 16l2.25-.75L19 13z"/></svg>,
    code:     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
    target:   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
  };
  return icons[name] ?? null;
};

export default function About() {
  return (
    <div className="about-page">
      
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero__bg" />
        <div className="container about-hero__inner">
          <div className="about-hero__eyebrow"><Icon name="sparkles" size={14} /> The AI Shop Story</div>
          <h1 className="about-hero__title">Redefining the Future of Luxury E-Commerce.</h1>
          <p className="about-hero__sub">
            AI Shop was born from a simple belief: online shopping shouldn't just be functional, it should be an experience. We blend premium technology and meticulous design to curate the finest products for modern lifestyles.
          </p>
          <nav className="breadcrumb" style={{ justifyContent: 'center', marginTop: 30 }}>
            <Link to="/" className="breadcrumb__item"><Icon name="home" size={14} /> Home</Link>
            <span className="breadcrumb__sep"><Icon name="chevronRight" size={13} /></span>
            <span className="breadcrumb__item breadcrumb__item--active">About Us</span>
          </nav>
        </div>
      </section>

      {/* The Vision */}
      <section className="about-vision">
        <div className="container">
          <div className="vision-grid">
            <div className="vision-text">
              <h2 className="vision-title"><Icon name="target" size={28} /> Why AI Shop is Better</h2>
              <p className="vision-desc">
                Traditional e-commerce platforms overwhelm users with endless, uncurated lists. We wanted to build something entirely different—a personalized, intelligent engine that understands your taste. 
              </p>
              <p className="vision-desc">
                By integrating AI-driven curation with a world-class aesthetic layout, we’ve created a space where premium tech seamlessly meets high-end fashion and lifestyle. No clutter, just the absolute best products handpicked for you. Every detail, from the fluid animations to the carefully tailored catalog, was designed to redefine your digital retail experience.
              </p>
            </div>
            <div className="vision-image">
              <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80" alt="Premium Shopping" className="vision-img" />
            </div>
          </div>
        </div>
      </section>

      {/* Meet the Founders / Minds Behind It */}
      <section className="about-founders">
        <div className="container">
          <div className="founders-header">
            <h2>The Minds Behind AI Shop</h2>
            <p>A perfect synergy of meticulous design and robust architecture.</p>
          </div>

          <div className="founders-grid">
            
            {/* Prachi */}
            <div className="founder-card prachi-card">
              <div className="founder-card-bg"></div>
              <div className="founder-card-inner">
                <div className="fc-photo-wrap">
                  <img src="/developer-prachi.jpg" alt="Prachi Khandelwal" />
                </div>
                <div className="fc-content">
                  <div className="fc-role">Co-Founder & UI/UX Director</div>
                  <h3 className="fc-name">Prachi Khandelwal</h3>
                  <div className="fc-quote">
                    "My vision was to make AI Shop feel less like a store and more like a luxury boutique. I focused entirely on the user's emotional journey—the colors, the layout spacing, and the micro-interactions. If a user isn't instantly captivated the moment the page loads, we haven't done our job. I wanted to build an aesthetic that breathes elegance and trust."
                  </div>
                  <div className="fc-signature">Prachi K.</div>
                </div>
              </div>
            </div>

            {/* Armaan */}
            <div className="founder-card armaan-card">
              <div className="founder-card-bg"></div>
              <div className="founder-card-inner">
                <div className="fc-photo-wrap">
                  <img src="/founder-armaan.jpeg" alt="Armaan Sangwan" />
                </div>
                <div className="fc-content">
                  <div className="fc-role">Co-Founder & Lead Architect</div>
                  <h3 className="fc-name">Armaan Sangwan</h3>
                  <div className="fc-quote">
                    "While Prachi perfected the surface, my obsession was what happens underneath. I envisioned an architecture that doesn't just work, but anticipates scale. Implementing Redux state flows, real-time responsive routers, and ensuring blazing-fast data retrieval was strictly about providing a perfectly seamless backbone. The UI is beautiful because the engineering behind it is flawless."
                  </div>
                  <div className="fc-signature">Armaan S.</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="about-cta">
        <div className="container about-cta-inner">
          <h2>Experience the Difference</h2>
          <p>Ready to explore our curated collections? Step into the future of shopping.</p>
          <Link to="/products" className="btn btn-primary" style={{ padding: '16px 32px', fontSize: '16px', borderRadius: '30px' }}>
            Start Shopping
          </Link>
        </div>
      </section>

    </div>
  );
}
