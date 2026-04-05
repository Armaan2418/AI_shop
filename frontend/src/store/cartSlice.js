import { createSlice, createSelector } from '@reduxjs/toolkit';

const initialState = {
  items:    [],
  coupon:   null,
  discount: 0,       // percentage e.g. 0.10 = 10%
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, { payload }) {
      const idx = state.items.findIndex(
        (i) =>
          i._id             === payload._id &&
          i.selectedColor   === (payload.selectedColor   ?? null) &&
          i.selectedStorage === (payload.selectedStorage ?? null)
      );
      if (idx >= 0) {
        state.items[idx].quantity += payload.quantity ?? 1;
      } else {
        state.items.push({ ...payload, quantity: payload.quantity ?? 1 });
      }
    },
    removeFromCart(state, { payload }) {
      // payload = index
      state.items.splice(payload, 1);
    },
    updateQuantity(state, { payload }) {
      const { index, quantity } = payload;
      if (quantity < 1) return;
      if (state.items[index]) state.items[index].quantity = quantity;
    },
    clearCart(state) {
      state.items    = [];
      state.coupon   = null;
      state.discount = 0;
    },
    applyCoupon(state, { payload }) {
      // payload = { code: 'SAVE10', discount: 0.10 }
      state.coupon   = payload.code;
      state.discount = payload.discount;
    },
    removeCoupon(state) {
      state.coupon   = null;
      state.discount = 0;
    },
  },
});

export const {
  addToCart, removeFromCart, updateQuantity,
  clearCart, applyCoupon, removeCoupon,
} = cartSlice.actions;

// Selectors
export const selectCartItems    = (s) => s.cart.items;
export const selectCartCount    = (s) => s.cart.items.reduce((sum, i) => sum + i.quantity, 0);
export const selectCartSubtotal = (s) => s.cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
export const selectCoupon       = (s) => s.cart.coupon;
export const selectDiscount     = (s) => s.cart.discount;
export const selectCartTotal    = createSelector(
  [selectCartItems, selectCartSubtotal, selectDiscount],
  (items, sub, discountPct) => {
    const isScamOnly = items.length > 0 && items.every(i => i.category === 'scam');
    const disc = sub * discountPct;
    if (isScamOnly) {
      return { subtotal: sub, discount: disc, tax: 0, total: sub - disc };
    }
    const taxableSubtotal = items.filter(i => i.category !== 'scam' && !i.noTax).reduce((sum, i) => sum + i.price * i.quantity, 0);
    const tax = Math.round((taxableSubtotal - (taxableSubtotal * discountPct)) * 0.18);
    return { subtotal: sub, discount: disc, tax, total: sub - disc + tax };
  }
);

export default cartSlice.reducer;