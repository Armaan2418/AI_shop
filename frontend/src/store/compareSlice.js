import { createSlice } from '@reduxjs/toolkit';

const MAX_COMPARE = 3;

const compareSlice = createSlice({
  name: 'compare',
  initialState: { items: [] },
  reducers: {
    toggleCompare(state, { payload }) {
      const idx = state.items.findIndex(i => i._id === payload._id);
      if (idx >= 0) {
        state.items.splice(idx, 1);
      } else if (state.items.length < MAX_COMPARE) {
        state.items.push(payload);
      }
    },
    removeFromCompare(state, { payload }) {
      state.items = state.items.filter(i => i._id !== payload);
    },
    clearCompare(state) {
      state.items = [];
    },
  },
});

export const { toggleCompare, removeFromCompare, clearCompare } = compareSlice.actions;
export const selectCompareItems = s => s.compare.items;
export const selectCompareCount = s => s.compare.items.length;
export const selectIsCompared   = id => s => s.compare.items.some(i => i._id === id);
export default compareSlice.reducer;
