import { createSlice } from '@reduxjs/toolkit';

const loadCartFromStorage = () => {
  try {
    const data = localStorage.getItem('cart');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

// Load cart items once
const initialItems = loadCartFromStorage();

// Calculate initial totals
const initialState = {
  items: initialItems,
  totalQty: initialItems.reduce((acc, item) => acc + item.qty, 0),
  totalPrice: initialItems.reduce(
    (acc, item) => acc + item.qty * item.price,
    0
  ),
};

// Recalculate totals and save cart
const recalcAndPersist = (state) => {
  state.totalQty = state.items.reduce(
    (acc, item) => acc + item.qty,
    0
  );

  state.totalPrice = state.items.reduce(
    (acc, item) => acc + item.qty * item.price,
    0
  );

  localStorage.setItem('cart', JSON.stringify(state.items));
};

const cartSlice = createSlice({
  name: 'cart',

  initialState,

  reducers: {
    // Add product to cart
    addToCart: (state, action) => {
      const { id, qty } = action.payload;

      const existing = state.items.find((item) => item.id === id);

      if (existing) {
        existing.qty += qty;
      } else {
        state.items.push({
          ...action.payload,
          qty,
        });
      }

      recalcAndPersist(state);
    },

    // Update product quantity
    updateQty: (state, action) => {
      const { id, qty } = action.payload;

      const item = state.items.find((item) => item.id === id);

      if (item) {
        item.qty = Math.max(1, qty);
      }

      recalcAndPersist(state);
    },

    // Remove product from cart
    removeFromCart: (state, action) => {
      state.items = state.items.filter(
        (item) => item.id !== action.payload
      );

      recalcAndPersist(state);
    },

    // Clear entire cart
    clearCart: (state) => {
      state.items = [];

      recalcAndPersist(state);
    },
  },
});

export const { addToCart,updateQty,removeFromCart,clearCart,} = cartSlice.actions;

export default cartSlice.reducer;