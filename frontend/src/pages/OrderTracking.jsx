import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { cartService } from '../services/cartService';
import './OrderTracking.css';

// Professional UI Icons map
const ICONS = {
  check:    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  box:      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
  factory:  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="18" rx="2" ry="2"/><line x1="8" y1="18" x2="16" y2="18"/><line x1="12" y1="14" x2="12" y2="18"/><path d="M2 9h20"/></svg>,
  truck:    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
  scooter:  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="7" cy="17" r="3"/><circle cx="17" cy="17" r="3"/><path d="M14 17h-4"/><path d="M14 14V6L8 8"/><path d="M22 6L14 14"/></svg>,
  home:     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  package:  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
  pin:      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  img:      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
};

const INR = (n) => '₹' + Math.round(n).toLocaleString('en-IN');

const DEFAULT_TRACKING = [
  { status: 'Order Placed',     time: '', done: true,  icon: ICONS.check,   desc: 'Your order was confirmed and payment received.' },
  { status: 'Packed',           time: '', done: true,  icon: ICONS.box,     desc: 'Your item has been packed and ready for pickup.' },
  { status: 'Picked Up',        time: '', done: true,  icon: ICONS.factory, desc: 'Package picked up by delivery partner.' },
  { status: 'In Transit',       time: '', done: true,  icon: ICONS.truck,   desc: 'Package is on its way to your city.' },
  { status: 'Out for Delivery', time: '', done: false, icon: ICONS.scooter, desc: 'Your package is out for delivery today.' },
  { status: 'Delivered',        time: '', done: false, icon: ICONS.home,    desc: 'Package delivered to your address.' },
];

const MOCK_ORDER = {
  _id: 'ORD-8754',
  date: '2026-03-10',
  status: 'Shipped',
  total: 35388,
  paymentMethod: 'upi',
  items: [{ name: 'Sony WH-1000XM5', qty: 1, price: 35388, brand: 'Sony', image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=120&q=80' }],
  shipping: { fullName: 'Arjun M.', address: '42 Tech Park, Whitefield', city: 'Bangalore', state: 'Karnataka', zip: '560066', country: 'India' },
  tracking: DEFAULT_TRACKING.map((t, i) => ({ ...t, time: ['Mar 10, 10:30 AM','Mar 10, 3:00 PM','Mar 11, 9:00 AM','Mar 11, 6:00 PM','Mar 12, 8:00 AM','Expected today'][i] })),
};

const FALLBACK_MOCKS = [
  { _id: 'ORD-8821', date: '2026-03-20', status: 'Delivered',  total: 153282, items: [{ name: 'iPhone 15 Pro Max',   qty: 1, price: 153282, brand: 'Apple', image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=120&q=80' }] },
  { _id: 'ORD-8754', date: '2026-03-10', status: 'Shipped',    total: 35388,  items: [{ name: 'Sony WH-1000XM5',     qty: 1, price: 35388,  brand: 'Sony',  image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=120&q=80' }] },
  { _id: 'ORD-8601', date: '2026-02-28', status: 'Processing', total: 106082, items: [{ name: 'Apple Watch Ultra 2', qty: 1, price: 106082, brand: 'Apple', image: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=120&q=80' }] },
  { _id: 'ORD-8422', date: '2026-02-10', status: 'Delivered',  total: 29382,  items: [{ name: 'AirPods Pro 2',       qty: 1, price: 29382,  brand: 'Apple', image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=120&q=80' }] },
];

const STATUS_COLOR = {
  Delivered:  'badge-green',
  Shipped:    'badge-blue',
  Processing: 'badge-yellow',
  Cancelled:  'badge-red',
};

export default function OrderTracking() {
  const { id }  = useParams();
  const [order, setOrder] = useState(MOCK_ORDER);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await cartService.getOrderById(id);
        if (data?.order) {
          const o = data.order;
          if (!o.tracking) o.tracking = DEFAULT_TRACKING;
          if (!o.shipping) o.shipping = MOCK_ORDER.shipping;
          setOrder(o);
          return;
        }
      } catch { /* fallback below */ }

      // Try localStorage first
      let found = null;
      const local = localStorage.getItem('aishop_orders');
      if (local) {
        try { found = JSON.parse(local).find(o => o._id === id); } catch { /* ignore */ }
      }

      // Then try hardcoded mocks
      if (!found) found = FALLBACK_MOCKS.find(o => o._id === id);

      if (found) {
        if (!found.tracking) found = { ...found, tracking: DEFAULT_TRACKING };
        if (!found.shipping) found = { ...found, shipping: MOCK_ORDER.shipping };
        setOrder(found);
      }
    };
    load();
    window.scrollTo(0, 0);
  }, [id]);

  const lastDone = [...(order.tracking || [])].reverse().find(t => t.done);

  return (
    <div className="tracking-page page-enter">
      <div className="container">

        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/">Home</Link><span className="sep">›</span>
          <Link to="/dashboard">Dashboard</Link><span className="sep">›</span>
          <span className="current">Track Order</span>
        </div>

        <h1 className="tracking-heading">
          Order Tracking
          <span className="tracking-id-badge">{order._id}</span>
        </h1>

        <div className="tracking-layout">

          {/* ── Left: Timeline ── */}
          <div className="tracking-main">

            {/* Status card */}
            <div className="tracking-status-card">
              <div className="tracking-status-icon" style={{ display: 'flex', color: 'var(--blue)' }}>{lastDone?.icon ?? ICONS.package}</div>
              <div>
                <p className="tracking-status-label">Current Status</p>
                <p className="tracking-status-value">{lastDone?.status ?? 'Processing'}</p>
                <p className="tracking-status-time">{lastDone?.time}</p>
              </div>
              <span className={`badge ${STATUS_COLOR[order.status] ?? 'badge-gray'}`}>{order.status}</span>
            </div>

            {/* Timeline */}
            <div className="tracking-timeline">
              {(order.tracking || []).map((step, i) => (
                <div
                  key={i}
                  className={`track-step ${step.done ? 'track-step--done' : ''} ${step === lastDone ? 'track-step--current' : ''}`}
                >
                  <div className="track-step__left">
                    <div className="track-step__dot">
                      {step.done
                        ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                        : <span style={{ fontSize: 10 }}>○</span>}
                    </div>
                    {i < (order.tracking?.length || 0) - 1 && (
                      <div className={`track-step__line ${step.done ? 'track-step__line--done' : ''}`} />
                    )}
                  </div>
                  <div className="track-step__content">
                    <div className="track-step__header">
                      <span className="track-step__icon">{step.icon}</span>
                      <span className="track-step__status">{step.status}</span>
                      <span className="track-step__time">{step.time}</span>
                    </div>
                    <p className="track-step__desc">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: Order Details ── */}
          <div className="tracking-sidebar">

            {/* Items with images */}
            <div className="tracking-card">
              <h3 className="tracking-card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: 'var(--slate)', display: 'flex' }}>{ICONS.box}</span> Order Items
              </h3>
              {order.items?.map((item, i) => {
                const name  = typeof item === 'string' ? item : item.name;
                const qty   = typeof item === 'object' ? item.qty  : 1;
                const price = typeof item === 'object' ? item.price : 0;
                const image = typeof item === 'object' ? (item.image || '') : '';
                const brand = typeof item === 'object' ? (item.brand || '') : '';

                return (
                  <div key={i} className="tracking-item">
                    <div className="tracking-item__img">
                      {image ? (
                        <img
                          src={image}
                          alt={name}
                          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=64&q=80'; }}
                        />
                      ) : (
                        <div className="tracking-item__img-placeholder">{ICONS.img}</div>
                      )}
                    </div>
                    <div className="tracking-item__info">
                      <span className="tracking-item__name">{name}</span>
                      {brand && <span className="tracking-item__brand">{brand}</span>}
                      <span className="tracking-item__qty-price">{qty}× · {price > 0 ? INR(price) : ''}</span>
                    </div>
                    <span className="tracking-item__price">{price > 0 ? INR(qty * price) : ''}</span>
                  </div>
                );
              })}
              <div className="tracking-total">
                <span>Order Total</span>
                <strong>{INR(order.total)}</strong>
              </div>
            </div>

            {/* Shipping address */}
            <div className="tracking-card">
              <h3 className="tracking-card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: 'var(--slate)', display: 'flex' }}>{ICONS.pin}</span> Delivering to
              </h3>
              <p className="tracking-address">
                <strong>{order.shipping?.fullName}</strong><br />
                {order.shipping?.address}<br />
                {order.shipping?.city}, {order.shipping?.state} {order.shipping?.zip}<br />
                {order.shipping?.country}
              </p>
            </div>

            <div className="tracking-actions">
              <Link to="/dashboard" className="btn btn-outline btn-full">← Back to Orders</Link>
              <Link to="/products"  className="btn btn-primary btn-full">Shop Again →</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}