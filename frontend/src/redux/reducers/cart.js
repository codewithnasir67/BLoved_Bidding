import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  cart: [],
};

export const cartReducer = createReducer(initialState, {
  addToCart: (state, action) => {
    const item = action.payload;
    const isItemExist = state.cart.find((i) => i._id === item._id);
    if (isItemExist) {
      return {
        ...state,
        cart: state.cart.map((i) => (i._id === isItemExist._id ? item : i)),
      };
    } else {
      return {
        ...state,
        cart: [...state.cart, { ...item, selected: true }],
      };
    }
  },

  removeFromCart: (state, action) => {
    return {
      ...state,
      cart: state.cart.filter((i) => i._id !== action.payload),
    };
  },

  toggleCartItemSelection: (state, action) => {
    const itemId = action.payload;
    return {
      ...state,
      cart: state.cart.map((i) =>
        i._id === itemId ? { ...i, selected: !i.selected } : i
      ),
    };
  },

  cartData: (state, action) => {
    return {
      ...state,
      cart: action.payload,
    };
  },

  clearCart: (state) => {
    return {
      ...state,
      cart: [],
    };
  },

  resetCartItemSelection: (state) => {
    return {
      ...state,
      cart: state.cart.map((i) => ({ ...i, selected: true })),
    };
  },
});
