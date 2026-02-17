import axios from "axios";
import { server } from "../../server";

// add to wishlist
export const addToWishlist = (data) => async (dispatch, getState) => {
  dispatch({
    type: "addToWishlist",
    payload: data,
  });

  const wishlist = getState().wishlist.wishlist;
  localStorage.setItem("wishlistItems", JSON.stringify(wishlist));

  if (getState().user.isAuthenticated) {
    await axios.put(`${server}/user/update-wishlist`, { wishlist }, { withCredentials: true });
  }
  return data;
};

// remove from wishlist
export const removeFromWishlist = (data) => async (dispatch, getState) => {
  dispatch({
    type: "removeFromWishlist",
    payload: data._id,
  });

  const wishlist = getState().wishlist.wishlist;
  localStorage.setItem("wishlistItems", JSON.stringify(wishlist));

  if (getState().user.isAuthenticated) {
    await axios.put(`${server}/user/update-wishlist`, { wishlist }, { withCredentials: true });
  }
  return data;
};
