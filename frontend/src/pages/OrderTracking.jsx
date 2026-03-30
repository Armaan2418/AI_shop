import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { cartService } from '../services/cartService';
import './OrderTracking.css';

const MOCK_ORDER = {
  _id: 'ORD-8754',
  date: '2026-03-10',
  status: 'Shipped',
  total: 349,
  items: [{ name: 'Sony WH-1000XM5', qty: 1, price: 349 }],
  shipping: { fullName: 'Arjun M.', address: '42 Tech Park, Whitefield', city: 'Bangalore', state: 'Karnataka', zip: '560066', country: 'India' },
  tracking: [
    { status: 'Order Placed',     time: 'Mar 10, 10:30 AM', done: true,  icon: '✅', desc: 'Your order was confirmed and payment received.' },
    { status: 'Packed',           time: 'Mar 10, 3:00 PM',  done: true,  icon: '📦', desc: 'Your item has been packed and ready for pickup.' },
    { status: 'Picked Up',        time: 'Mar 11, 9:00 AM',  done: true,  icon: '🏭', desc: 'Package picked up by delivery partner.' },
    { status: 'In Transit',       time: 'Mar 11, 6:00 PM',  done: true,  icon: '🚚', desc: 'Package is on its way to your city.' },
    { status: 'Out for Delivery', time: 'Mar 12, 8:00 AM',  done: false, icon: '🛵', desc: 'Your package is out for delivery today.' },
    { status: 'Delivered',        time: 'Expected today',   done: false, icon: '🏠', desc: 'Package delivered to your address.' },
  ],
};

export default function OrderTracking() {
  const { id }    = useParams();
  const [order,   setOrder]   = useState(MOCK_ORDER);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await cartService.getOrderById(id);
        if (data?.order) setOrder(data.order);
      } catch { /* ignore */ }
    };
    load();
    window.scrollTo(0, 0);
  }, [id]);

  const lastDone = [...order.tracking].reverse().find(t => t.done);

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
              <div className="tracking-status-icon">{lastDone?.icon ?? '📦'}</div>
              <div>
                <p className="tracking-status-label">Current Status</p>
                <p className="tracking-status-value">{lastDone?.status ?? 'Processing'}</p>
                <p className="tracking-status-time">{lastDone?.time}</p>
              </div>
              <span className={`badge ${order.status === 'Delivered' ? 'badge-green' : order.status === 'Shipped' ? 'badge-blue' : 'badge-yellow'}`}>
                {order.status}
              </span>
            </div>

            {/* Timeline */}
            <div className="tracking-timeline">
              {order.tracking.map((step, i) => (
                <div
                  key={i}
                  className={`track-step ${step.done ? 'track-step--done' : ''} ${step === lastDone ? 'track-step--current' : ''}`}
                >
                  <div className="track-step__left">
                    <div className="track-step__dot">
                      {step.done ? '✓' : <span style={{ fontSize: 10 }}>○</span>}
                    </div>
                    {i < order.tracking.length - 1 && (
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

            {/* Items */}
            <div className="tracking-card">
              <h3 className="tracking-card-title">📦 Order Items</h3>
              {order.items?.map((item, i) => (
                <div key={i} className="tracking-item">
                  <span className="tracking-item__qty">{item.qty}×</span>
                  <span className="tracking-item__name">{item.name}</span>
                  <span className="tracking-item__price">${item.price}</span>
                </div>
              ))}
              <div className="tracking-total">
                <span>Total</span>
                <strong>${order.total}</strong>
              </div>
            </div>

            {/* Shipping address */}
            <div className="tracking-card">
              <h3 className="tracking-card-title">📍 Delivering to</h3>
              <p className="tracking-address">
                {order.shipping?.fullName}<br />
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