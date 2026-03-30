import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './OrderSuccess.css';

export default function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const [orderId] = useState(() => location.state?.orderId || 'ORD-' + Date.now());

  useEffect(() => {
    if (!orderId) {
      navigate('/');
    }
  }, [orderId, navigate]);

  return (
    <div className="success-page page-enter">
      <div className="container">
        <div className="success-card">

          {/* Animated checkmark */}
          <div className="success-anim">
            <div className="success-ring success-ring--1" />
            <div className="success-ring success-ring--2" />
            <div className="success-check">✓</div>
          </div>

          <h1 className="success-title">Order Placed! 🎉</h1>
          <p className="success-sub">
            Thank you for your purchase! Your order has been confirmed and is being prepared.
          </p>

          <div className="success-order-id">
            <span>Order ID</span>
            <strong>{orderId}</strong>
          </div>

          {/* Timeline */}
          <div className="success-timeline">
            {[
              { icon: '✅', label: 'Order Confirmed',    sub: 'Just now',        done: true  },
              { icon: '📦', label: 'Being Packed',        sub: 'In 1-2 hours',    done: false },
              { icon: '🚚', label: 'Out for Delivery',    sub: 'In 1-2 days',     done: false },
              { icon: '🏠', label: 'Delivered',           sub: 'Expected 2 days', done: false },
            ].map((t, i) => (
              <div key={i} className={`timeline-step ${t.done ? 'timeline-step--done' : ''}`}>
                <div className="timeline-icon">{t.icon}</div>
                <div className="timeline-info">
                  <div className="timeline-label">{t.label}</div>
                  <div className="timeline-sub">{t.sub}</div>
                </div>
                {i < 3 && <div className={`timeline-line ${t.done ? 'timeline-line--done' : ''}`} />}
              </div>
            ))}
          </div>

          <div className="success-actions">
            <Link to="/dashboard" className="btn btn-primary btn-lg">View My Orders →</Link>
            <Link to="/products"  className="btn btn-outline btn-lg">Continue Shopping</Link>
          </div>

          <p className="success-email-note">
            📧 A confirmation email has been sent to your registered email address.
          </p>
        </div>
      </div>
    </div>
  );
}