import { createSlice } from '@reduxjs/toolkit';

// Load persisted wishlist from localStorage
const loadWishlist = () => {
  try {
    const raw = localStorage.getItem('aishop_wishlist');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: loadWishlist(),
  },
  reducers: {
    toggleWishlist(state, { payload }) {
      const idx = state.items.findIndex((i) => i._id === payload._id);
      if (idx >= 0) {
        state.items.splice(idx, 1);
      } else {
        state.items.push(payload);
      }
      // Persist
      try {
        localStorage.setItem('aishop_wishlist', JSON.stringify(state.items));
      } catch { /* ignore */ }
    },
    removeFromWishlist(state, { payload }) {
      state.items = state.items.filter((i) => i._id !== payload);
      try {
        localStorage.setItem('aishop_wishlist', JSON.stringify(state.items));
      } catch { /* ignore */ }
    },
    clearWishlist(state) {
      state.items = [];
      try { localStorage.removeItem('aishop_wishlist'); } catch { /* ignore */ }
    },
  },
});

export const { toggleWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions;

export const selectWishlistItems = (s) => s.wishlist.items;
export const selectWishlistCount = (s) => s.wishlist.items.length;
export const selectIsWishlisted  = (id) => (s) => s.wishlist.items.some((i) => i._id === id);

export default wishlistSlice.reducer;
