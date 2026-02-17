import axios from "axios";
import { server } from "../../server";

// add to cart
export const addTocart = (data) => async (dispatch, getState) => {
  dispatch({
    type: "addToCart",
    payload: data,
  });

  const cart = getState().cart.cart;
  localStorage.setItem("cartItems", JSON.stringify(cart));

  if (getState().user.isAuthenticated) {
    await axios.put(`${server}/user/update-cart`, { cart }, { withCredentials: true });
  }
  return data;
};

// remove from cart
export const removeFromCart = (data) => async (dispatch, getState) => {
  dispatch({
    type: "removeFromCart",
    payload: data._id,
  });

  const cart = getState().cart.cart;
  localStorage.setItem("cartItems", JSON.stringify(cart));

  if (getState().user.isAuthenticated) {
    await axios.put(`${server}/user/update-cart`, { cart }, { withCredentials: true });
  }
  return data;
};

// toggle item selection
export const toggleCartItemSelection = (itemId) => async (dispatch, getState) => {
  dispatch({
    type: "toggleCartItemSelection",
    payload: itemId,
  });
  const cart = getState().cart.cart;
  localStorage.setItem("cartItems", JSON.stringify(cart));

  if (getState().user.isAuthenticated) {
    await axios.put(`${server}/user/update-cart`, { cart }, { withCredentials: true });
  }
};

// reset item selection
export const resetCartItemSelection = () => async (dispatch, getState) => {
  dispatch({
    type: "resetCartItemSelection",
  });
  const cart = getState().cart.cart;
  localStorage.setItem("cartItems", JSON.stringify(cart));

  if (getState().user.isAuthenticated) {
    await axios.put(`${server}/user/update-cart`, { cart }, { withCredentials: true });
  }
};
// clear cart
export const clearCart = () => async (dispatch, getState) => {
  dispatch({
    type: "clearCart",
  });
  localStorage.setItem("cartItems", JSON.stringify([]));

  if (getState().user.isAuthenticated) {
    await axios.put(`${server}/user/update-cart`, { cart: [] }, { withCredentials: true });
  }
};
