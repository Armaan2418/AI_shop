import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectCompareItems, removeFromCompare, clearCompare } from '../store/compareSlice';
import { getProductSpecs } from '../data/products';
import './CompareDrawer.css';

// ── Stars ─────────────────────────────────────────────────────────────────
function Stars({ rating }) {
  return (
    <span className="cd-stars">
      {[1,2,3,4,5].map(s => (
        <span key={s} style={{ color: s <= Math.round(rating) ? '#f59e0b' : '#374151', fontSize: '12px' }}>★</span>
      ))}
    </span>
  );
}

// ── Compare Modal ─────────────────────────────────────────────────────────
function CompareModal({ items, onClose }) {
  const dispatch = useDispatch();

  const lowestPrice  = Math.min(...items.map(i => i.price));
  const highestRating = Math.max(...items.map(i => i.rating));
  const highestReviews = Math.max(...items.map(i => i.reviewCount ?? 0));

  const ROWS = [
    { label: 'Brand',    key: 'brand',      fmt: v => v,            best: null },
    { label: 'Price',    key: 'price',      fmt: v => `₹${v.toLocaleString('en-IN')}`, isBest: (v) => v === lowestPrice, bestLabel: 'Best Price' },
    { label: 'Rating',   key: 'rating',     fmt: v => `${v} / 5`,  isBest: (v) => v === highestRating,  bestLabel: 'Top Rated' },
    { label: 'Reviews',  key: 'reviewCount',fmt: v => (v ?? 0).toLocaleString(), isBest: (v) => (v ?? 0) === highestReviews, bestLabel: 'Most Reviews' },
    { label: 'In Stock', key: 'inStock',    fmt: v => v ? '✓ Yes' : '✗ No', isBest: (v) => v === true, bestLabel: '' },
  ];

  // Dynamically aggregate all unique feature specs from the compared items
  const allSpecsSet = new Set();
  const itemSpecsMap = {}; // itemId -> { "Spec Label": "Spec Value" }

  items.forEach(item => {
    const specs = getProductSpecs(item) || [];
    const map = {};
    specs.forEach(s => {
      // Exclude generic base features already handled by ROWS above
      if (!['Price', 'Rating', 'Brand', 'Category', 'Availability'].includes(s.label)) {
        allSpecsSet.add(s.label);
        map[s.label] = s.value;
      }
    });
    itemSpecsMap[item._id] = map;
  });

  const specLabels = Array.from(allSpecsSet);

  return (
    <div className="cm-overlay" onClick={onClose}>
      <div className="cm-modal" onClick={e => e.stopPropagation()}>
        <div className="cm-modal__header">
          <h2 className="cm-modal__title">
            <span className="cm-modal__title-icon">⚖</span>
            Product Comparison
          </h2>
          <button className="cm-modal__close" onClick={onClose}>✕</button>
        </div>

        <div className="cm-modal__body">
          <div className="cm-table-wrap">
            <table className="cm-table">
              {/* Product headers */}
              <thead>
                <tr>
                  <th className="cm-th-label"></th>
                  {items.map(item => (
                    <th key={item._id} className="cm-th-product">
                      <div className="cm-product-head">
                        <div className="cm-product-img-wrap">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="cm-product-img"
                            onError={e => { e.target.style.display = 'none'; }}
                          />
                        </div>
                        <Link
                          to={`/products/${item._id}`}
                          className="cm-product-name"
                          onClick={onClose}
                        >
                          {item.name}
                        </Link>
                        <div className="cm-product-brand">{item.brand}</div>
                        <button
                          className="cm-product-remove"
                          onClick={() => dispatch(removeFromCompare(item._id))}
                        >✕ Remove</button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Spec rows */}
              <tbody>
                {ROWS.map(row => (
                  <tr key={row.label} className="cm-row">
                    <td className="cm-row__label">{row.label}</td>
                    {items.map(item => {
                      const val = item[row.key];
                      const isBest = row.isBest ? row.isBest(val) : false;
                      return (
                        <td key={item._id} className={`cm-row__val ${isBest ? 'cm-row__val--best' : ''}`}>
                          <span className="cm-row__text">{row.fmt(val)}</span>
                          {isBest && row.bestLabel && (
                            <span className="cm-best-badge">{row.bestLabel}</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
                
                {/* Dynamically Generated Specific Features Rows */}
                {specLabels.map(label => (
                  <tr key={label} className="cm-row cm-row--spec">
                    <td className="cm-row__label">{label}</td>
                    {items.map(item => {
                      const specVal = itemSpecsMap[item._id]?.[label];
                      return (
                        <td key={item._id} className="cm-row__val">
                          <span className="cm-row__text" style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                            {specVal ? specVal : '—'}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>

              {/* Action row */}
              <tfoot>
                <tr className="cm-row cm-row--action">
                  <td className="cm-row__label"></td>
                  {items.map(item => (
                    <td key={item._id} className="cm-row__val">
                      <Link
                        to={`/products/${item._id}`}
                        className="cm-view-btn"
                        onClick={onClose}
                      >
                        View Product →
                      </Link>
                    </td>
                  ))}
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Compare Drawer ────────────────────────────────────────────────────────
export default function CompareDrawer() {
  const dispatch = useDispatch();
  const items    = useSelector(selectCompareItems);
  const [modalOpen, setModalOpen] = useState(false);

  if (items.length === 0) return null;

  return (
    <>
      {/* Fixed bottom drawer */}
      <div className="cd-drawer cd-drawer--visible">
        <div className="cd-drawer__inner">

          {/* Label */}
          <div className="cd-drawer__label">
            <span className="cd-drawer__icon">⚖</span>
            <span className="cd-drawer__label-text">Compare</span>
            <span className="cd-drawer__count">{items.length} / 3</span>
          </div>

          {/* Product slots */}
          <div className="cd-drawer__items">
            {items.map(item => (
              <div key={item._id} className="cd-drawer__item">
                <div className="cd-drawer__item-img-wrap">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="cd-drawer__item-img"
                    onError={e => { e.target.style.display = 'none'; }}
                  />
                </div>
                <div className="cd-drawer__item-info">
                  <div className="cd-drawer__item-name">{item.name}</div>
                  <div className="cd-drawer__item-price">₹{item.price.toLocaleString('en-IN')}</div>
                </div>
                <button
                  className="cd-drawer__item-remove"
                  onClick={() => dispatch(removeFromCompare(item._id))}
                  aria-label="Remove"
                >✕</button>
              </div>
            ))}

            {/* Empty slots */}
            {Array.from({ length: 3 - items.length }).map((_, i) => (
              <div key={`empty-${i}`} className="cd-drawer__item cd-drawer__item--empty">
                <div className="cd-drawer__item-empty-icon">＋</div>
                <div className="cd-drawer__item-empty-text">Add product</div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="cd-drawer__actions">
            <button className="cd-drawer__clear" onClick={() => dispatch(clearCompare())}>
              Clear All
            </button>
            <button
              className="cd-drawer__compare-btn"
              onClick={() => setModalOpen(true)}
              disabled={items.length < 2}
            >
              Compare Now →
            </button>
          </div>
        </div>
      </div>

      {/* Full-screen compare modal */}
      {modalOpen && (
        <CompareModal items={items} onClose={() => setModalOpen(false)} />
      )}
    </>
  );
}
