import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../store/authSlice';
import { logout } from '../store/authSlice';
import { cartService } from '../services/cartService';
import './Dashboard.css';

const MOCK_ORDERS = [
  {
    _id: 'ORD-8821',
    date: '2026-03-20',
    status: 'Delivered',
    total: 153282,
    paymentMethod: 'card',
    items: [
      { name: 'iPhone 15 Pro Max', qty: 1, price: 153282, brand: 'Apple', image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=80&q=80' }
    ],
    shipping: { fullName: 'Arjun M.', address: '42 Tech Park', city: 'Bengaluru', state: 'Karnataka', zip: '560066', country: 'India' }
  },
  {
    _id: 'ORD-8754',
    date: '2026-03-10',
    status: 'Shipped',
    total: 35388,
    paymentMethod: 'upi',
    items: [
      { name: 'Sony WH-1000XM5', qty: 1, price: 35388, brand: 'Sony', image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=80&q=80' }
    ],
    shipping: { fullName: 'Arjun M.', address: '42 Tech Park', city: 'Bengaluru', state: 'Karnataka', zip: '560066', country: 'India' }
  },
  {
    _id: 'ORD-8601',
    date: '2026-02-28',
    status: 'Processing',
    total: 106082,
    paymentMethod: 'card',
    items: [
      { name: 'Apple Watch Ultra 2', qty: 1, price: 106082, brand: 'Apple', image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=80&q=80' }
    ],
    shipping: { fullName: 'Arjun M.', address: '42 Tech Park', city: 'Bengaluru', state: 'Karnataka', zip: '560066', country: 'India' }
  },
  {
    _id: 'ORD-8422',
    date: '2026-02-10',
    status: 'Delivered',
    total: 29382,
    paymentMethod: 'cod',
    items: [
      { name: 'AirPods Pro 2', qty: 1, price: 29382, brand: 'Apple', image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=80&q=80' }
    ],
    shipping: { fullName: 'Arjun M.', address: '42 Tech Park', city: 'Bengaluru', state: 'Karnataka', zip: '560066', country: 'India' }
  },
];

const ICONS = {
  box: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
  wallet: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" ry="2"/><line x1="2" y1="10" x2="22" y2="10"/><circle cx="17" cy="15" r="1" fill="currentColor"/></svg>,
  truck: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
  heart: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78v0z"/></svg>,
  logout: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  settings: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93A10 10 0 116.93 19.07M12 1v3M12 20v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M1 12h3M20 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/></svg>,
  user: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  card: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="3"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
  upi: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  cod: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="3"/></svg>,
};

const STATUS_COLOR = {
  Delivered:  'badge-green',
  Shipped:    'badge-blue',
  Processing: 'badge-yellow',
  Cancelled:  'badge-red',
};

const PAYMENT_LABEL = {
  card: 'Card',
  upi:  'UPI',
  cod:  'COD',
};

const TABS = ['Overview', 'Orders', 'Wishlist', 'Settings'];

const INR = (n) => '₹' + Math.round(n).toLocaleString('en-IN');

export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user     = useSelector(selectUser);

  const [activeTab, setActiveTab] = useState('Overview');
  const [orders,    setOrders]    = useState(MOCK_ORDERS);
  const [loading,   setLoading]   = useState(false);

  const [profile, setProfile] = useState({
    name:  user?.name  || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await cartService.getOrders();
        if (data?.orders?.length) setOrders(data.orders);
      } catch {
        // Merge localStorage orders with mock orders
        const local = localStorage.getItem('aishop_orders');
        if (local) {
          try {
            const parsedLocal = JSON.parse(local);
            // Avoid duplicates
            const localIds = new Set(parsedLocal.map(o => o._id));
            const uniqueMocks = MOCK_ORDERS.filter(o => !localIds.has(o._id));
            setOrders([...parsedLocal, ...uniqueMocks]);
          } catch {
            setOrders(MOCK_ORDERS);
          }
        }
      }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const totalSpent = orders.reduce((s, o) => s + (o.total || 0), 0);
  const inTransit  = orders.filter(o => o.status === 'Shipped').length;

  return (
    <div className="dashboard-page page-enter">
      <div className="container">

        {/* Header */}
        <div className="dashboard-header">
          <div className="dashboard-header__left">
            <div className="dashboard-avatar">
              {user?.name?.[0]?.toUpperCase() ?? 'U'}
            </div>
            <div>
              <h1 className="dashboard-greeting">Welcome back, {user?.name?.split(' ')[0] ?? 'there'}!</h1>
              <p style={{ color: 'var(--slate)', fontSize: 14 }}>{user?.email}</p>
            </div>
          </div>
          <button className="btn btn-outline btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '8px' }} onClick={handleLogout}>
            {ICONS.logout} Logout
          </button>
        </div>

        {/* Stats */}
        <div className="dashboard-stats">
          {[
            { icon: ICONS.box,    label: 'Total Orders',   value: orders.length           },
            { icon: ICONS.wallet, label: 'Total Spent',    value: INR(totalSpent)         },
            { icon: ICONS.truck,  label: 'In Transit',     value: inTransit               },
            { icon: ICONS.heart,  label: 'Wishlist Items', value: 0                       },
          ].map(s => (
            <div key={s.label} className="dashboard-stat-card">
              <span className="dashboard-stat-icon">{s.icon}</span>
              <span className="dashboard-stat-value">{s.value}</span>
              <span className="dashboard-stat-label">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="tabs">
          {TABS.map(tab => (
            <button
              key={tab}
              className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ── Overview Tab ── */}
        {activeTab === 'Overview' && (
          <div className="dashboard-tab-content">
            <h3 className="dash-section-title">Recent Orders</h3>
            <div className="orders-cards">
              {orders.slice(0, 3).map(order => (
                <OrderCard key={order._id} order={order} />
              ))}
            </div>
            {orders.length > 3 && (
              <button className="btn btn-ghost btn-sm mt-md" onClick={() => setActiveTab('Orders')}>
                View all {orders.length} orders →
              </button>
            )}
          </div>
        )}

        {/* ── Orders Tab ── */}
        {activeTab === 'Orders' && (
          <div className="dashboard-tab-content">
            <h3 className="dash-section-title">All Orders ({orders.length})</h3>
            {loading ? (
              <div style={{ padding: 40, textAlign: 'center', color: 'var(--slate)' }}>Loading orders…</div>
            ) : orders.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">{ICONS.box}</div>
                <div className="empty-state-title">No orders yet</div>
                <Link to="/products" className="btn btn-primary mt-md">Shop Now →</Link>
              </div>
            ) : (
              <div className="orders-cards">
                {orders.map(order => (
                  <OrderCard key={order._id} order={order} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Wishlist Tab ── */}
        {activeTab === 'Wishlist' && (
          <div className="dashboard-tab-content">
            <div className="empty-state">
              <div className="empty-state-icon" style={{ color: 'var(--red)' }}>{ICONS.heart}</div>
              <div className="empty-state-title">Your wishlist is empty</div>
              <div className="empty-state-text">Save items you love and find them here anytime.</div>
              <Link to="/products" className="btn btn-primary mt-md">Browse Products →</Link>
            </div>
          </div>
        )}

        {/* ── Settings Tab ── */}
        {activeTab === 'Settings' && (
          <div className="dashboard-tab-content">
            <div className="settings-section">
              <h3 className="dash-section-title">Profile Information</h3>
              <div className="settings-form">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input className="form-input" value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input className="form-input" type="email" value={profile.email} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input className="form-input" type="tel" value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} placeholder="+91 98765 43210" />
                </div>
                <button className="btn btn-primary">Save Changes</button>
              </div>
            </div>

            <div className="settings-section" style={{ marginTop: 32 }}>
              <h3 className="dash-section-title" style={{ color: 'var(--red)' }}>Danger Zone</h3>
              <button className="btn btn-red btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '8px' }} onClick={handleLogout}>
                {ICONS.logout} Logout from all devices
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

/* ── Order Card Component (with product images) ── */
function OrderCard({ order }) {
  const extraCount = (order.items?.length || 1) - 1;
  const payMethod = order.paymentMethod || 'card';

  return (
    <div className="order-card">
      {/* Product image strip */}
      <div className="order-card__images">
        {order.items?.slice(0, 4).map((item, i) => {
          const imgSrc = typeof item === 'object' ? (item.image || '') : '';
          return (
            <div key={i} className="order-card__img-wrap">
              {imgSrc ? (
                <img
                  src={imgSrc}
                  alt={typeof item === 'object' ? item.name : item}
                  onError={e => { e.target.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=64&q=80'; }}
                />
              ) : (
                <div className="order-card__img-placeholder">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                </div>
              )}
            </div>
          );
        })}
        {extraCount > 0 && (
          <div className="order-card__img-more">+{extraCount}</div>
        )}
      </div>

      {/* Main info */}
      <div className="order-card__body">
        <div className="order-card__top">
          <div>
            <p className="order-card__id">{order._id}</p>
            <p className="order-card__items">
              {order.items?.map(i => typeof i === 'string' ? i : i.name).join(', ')}
            </p>
          </div>
          <span className={`badge ${STATUS_COLOR[order.status] || 'badge-gray'}`}>{order.status}</span>
        </div>

        <div className="order-card__meta">
          <span className="order-card__date">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            {new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
          <span className="order-card__payment">
            {ICONS[payMethod] || ICONS.card} {PAYMENT_LABEL[payMethod] || 'Card'}
          </span>
          <strong className="order-card__total">{INR(order.total)}</strong>
        </div>

        <div className="order-card__actions">
          <Link to={`/dashboard/orders/${order._id}`} className="btn btn-outline btn-sm">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            Track Order
          </Link>
          <Link to="/products" className="btn btn-ghost btn-sm">Buy Again</Link>
        </div>
      </div>
    </div>
  );
}