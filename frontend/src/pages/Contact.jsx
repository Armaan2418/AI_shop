import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Contact.css';

const Icon = ({ name, size = 20 }) => {
  const icons = {
    phone:    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8a19.79 19.79 0 01-3.07-8.67A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.89a16 16 0 006.29 6.29l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>,
    mail:     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
    clock:    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
    check:    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
    send:     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
    headset:  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18v-6a9 9 0 0118 0v6"/><path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z"/></svg>,
    zap:      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
    shield:   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    home:     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    chevronRight: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
  };
  return icons[name] ?? null;
};

const FAQ = [
  { q: 'What are your delivery timelines?', a: 'Standard delivery takes 3–5 business days. Express delivery (1–2 days) is available for select pin codes.' },
  { q: 'Can I return a product?', a: 'Yes! We offer a 30-day hassle-free return policy on all products. Items must be in original condition.' },
  { q: 'How do I track my order?', a: 'Once your order is shipped, you will receive a tracking link via email and SMS.' },
  { q: 'Do you offer Cash on Delivery?', a: 'Yes, COD is available for orders up to ₹10,000. Additional ₹49 COD handling fee applies.' },
  { q: 'Are the products genuine?', a: '100% genuine products sourced directly from authorised brand distributors.' },
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSent(true);
  };

  return (
    <div className="contact-page">

      {/* Hero */}
      <section className="contact-hero">
        <div className="contact-hero__bg" />
        <div className="container contact-hero__inner">
          <div className="contact-hero__eyebrow">📞 We're Here For You</div>
          <h1 className="contact-hero__title">Get In Touch</h1>
          <p className="contact-hero__sub">
            Have a question, feedback, or need help with an order?<br/>
            Our team typically responds within 2 hours.
          </p>
          <nav className="breadcrumb" style={{ justifyContent: 'center', marginTop: 20 }}>
            <Link to="/" className="breadcrumb__item"><Icon name="home" size={14} /> Home</Link>
            <span className="breadcrumb__sep"><Icon name="chevronRight" size={13} /></span>
            <span className="breadcrumb__item breadcrumb__item--active">Contact Us</span>
          </nav>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="contact-cards-section">
        <div className="container contact-cards-grid">

          <div className="contact-card">
            <div className="contact-card__icon-wrap contact-card__icon-wrap--blue">
              <Icon name="phone" size={24} />
            </div>
            <h3 className="contact-card__title">Call Us</h3>
            <p className="contact-card__desc">Available Mon–Sat, 10 AM – 7 PM IST</p>
            <a href="tel:+917878148960" className="contact-card__link">+91 78781 48960</a>
            <a href="tel:+919350329708" className="contact-card__link">+91 93503 29708</a>
          </div>

          <div className="contact-card">
            <div className="contact-card__icon-wrap contact-card__icon-wrap--purple">
              <Icon name="mail" size={24} />
            </div>
            <h3 className="contact-card__title">Email Us</h3>
            <p className="contact-card__desc">We reply to all emails within 24 hours</p>
            <a href="mailto:armaan.sangwan24@gmail.com" className="contact-card__link">armaan.sangwan24@gmail.com</a>
            <a href="mailto:khandelwalprachi42@gmail.com" className="contact-card__link">khandelwalprachi42@gmail.com</a>
          </div>

          <div className="contact-card">
            <div className="contact-card__icon-wrap contact-card__icon-wrap--green">
              <Icon name="clock" size={24} />
            </div>
            <h3 className="contact-card__title">Support Hours</h3>
            <p className="contact-card__desc">Our team is here to assist you</p>
            <span className="contact-card__link">Mon – Fri: 9 AM – 8 PM</span>
            <span className="contact-card__link">Sat – Sun: 10 AM – 6 PM</span>
          </div>

        </div>
      </section>

      {/* Form + FAQ */}
      <section className="contact-main-section">
        <div className="container contact-main-grid">

          {/* Form */}
          <div className="contact-form-wrap">
            <div className="contact-form-header">
              <h2 className="contact-form-title">Send Us a Message</h2>
              <p className="contact-form-sub">Fill in the form and we'll get back to you shortly.</p>
            </div>

            {sent ? (
              <div className="contact-success">
                <div className="contact-success__icon"><Icon name="check" size={32} /></div>
                <h3>Message Sent!</h3>
                <p>Thank you for reaching out. We'll get back to you within 24 hours.</p>
                <button className="btn btn-primary" onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }); }}>
                  Send Another
                </button>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="contact-form-row">
                  <div className="contact-form-field">
                    <label>Your Name <span className="required">*</span></label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Armaan Sangwan"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="contact-form-field">
                    <label>Email Address <span className="required">*</span></label>
                    <input
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="contact-form-field">
                  <label>Subject</label>
                  <select name="subject" value={form.subject} onChange={handleChange}>
                    <option value="">Select a topic</option>
                    <option value="order">Order Issue</option>
                    <option value="return">Return / Refund</option>
                    <option value="product">Product Query</option>
                    <option value="delivery">Delivery Tracking</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="contact-form-field">
                  <label>Message <span className="required">*</span></label>
                  <textarea
                    name="message"
                    placeholder="How can we help you today?"
                    value={form.message}
                    onChange={handleChange}
                    rows={5}
                    required
                  />
                </div>
                <button type="submit" className="contact-submit-btn">
                  <Icon name="send" size={16} /> Send Message
                </button>
              </form>
            )}
          </div>

          {/* FAQ */}
          <div className="contact-faq-wrap">
            <h2 className="contact-faq-title">Frequently Asked Questions</h2>
            <div className="contact-faq-list">
              {FAQ.map((item, i) => (
                <div key={i} className={`contact-faq-item ${openFaq === i ? 'contact-faq-item--open' : ''}`}>
                  <button className="contact-faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                    <span>{item.q}</span>
                    <span className="contact-faq-arrow">{openFaq === i ? '−' : '+'}</span>
                  </button>
                  {openFaq === i && <p className="contact-faq-a">{item.a}</p>}
                </div>
              ))}
            </div>

            {/* Quick support chips */}
            <div className="contact-quick-support">
              <p>Quick Actions</p>
              <div className="contact-quick-chips">
                <Link to="/products" className="contact-chip"><Icon name="zap" size={13} /> Browse Products</Link>
                <Link to="/cart" className="contact-chip"><Icon name="shield" size={13} /> My Cart</Link>
                <a href="tel:+917878148960" className="contact-chip"><Icon name="headset" size={13} /> Call Now</a>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Developer Section */}
      <section className="contact-founder">
        <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          
          {/* Prachi */}
          <div className="contact-founder-inner" style={{ margin: 0 }}>
            <div className="founder-photo-wrap">
              <img src="/developer-prachi.jpg" alt="Prachi Khandelwal - Developer" className="founder-photo" />
            </div>
            <div className="founder-info">
              <p className="founder-eyebrow">The Developer</p>
              <h2 className="founder-name">Prachi Khandelwal</h2>
              <p className="founder-bio">
                "Building AI Shop was about bridging the gap between premium technology and everyday lifestyle. From design to code, my goal is to ensure every user experiences a seamless, intelligent, and delightful platform."
              </p>
              <p className="founder-signature">Prachi Khandelwal</p>
            </div>
          </div>

          {/* Armaan */}
          <div className="contact-founder-inner" style={{ margin: 0 }}>
            <div className="founder-photo-wrap">
              <img src="/founder-armaan.jpeg" alt="Armaan Sangwan - Developer" className="founder-photo" />
            </div>
            <div className="founder-info">
              <p className="founder-eyebrow">The Developer</p>
              <h2 className="founder-name">Armaan Sangwan</h2>
              <p className="founder-bio">
                "Architecting the technology that powers AI Shop. From recommendation engines to real-time order tracking, I focus on turning ambitious ideas into seamless, scalable experiences."
              </p>
              <p className="founder-signature">Armaan Sangwan</p>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
