import axios from "axios";
import { server } from "../../server";

// load user
export const loadUser = () => async (dispatch) => {
  try {
    dispatch({
      type: "LoadUserRequest",
    });
    const { data } = await axios.get(`${server}/user/getuser`, {
      withCredentials: true,
    });
    dispatch({
      type: "LoadUserSuccess",
      payload: data.user,
    });
    // Sync cart and wishlist from backend
    if (data.user.cart) {
      dispatch({
        type: "cartData",
        payload: data.user.cart,
      });
      localStorage.setItem("cartItems", JSON.stringify(data.user.cart));
    }
    if (data.user.wishlist) {
      dispatch({
        type: "wishlistData",
        payload: data.user.wishlist,
      });
      localStorage.setItem("wishlistItems", JSON.stringify(data.user.wishlist));
    }
  } catch (error) {
    dispatch({
      type: "LoadUserFail",
      payload: error.response.data.message,
    });
    localStorage.removeItem("cartItems");
    localStorage.removeItem("wishlistItems");
    dispatch({ type: "clearCart" });
    dispatch({ type: "clearWishlist" });
  }
};

// load admin
export const loadAdmin = () => async (dispatch) => {
  try {
    dispatch({
      type: "LoadAdminRequest",
    });
    const { data } = await axios.get(`${server}/user/get-admin`, {
      withCredentials: true,
    });
    dispatch({
      type: "LoadAdminSuccess",
      payload: data.user,
    });
  } catch (error) {
    dispatch({
      type: "LoadAdminFail",
      payload: error.response.data.message,
    });
  }
};

// logout admin
export const logoutAdmin = () => async (dispatch) => {
  try {
    await axios.get(`${server}/user/admin-logout`, {
      withCredentials: true,
    });
    dispatch({
      type: "LogoutAdminSuccess",
    });
  } catch (error) {
    dispatch({
      type: "LogoutAdminFail",
      payload: error.response.data.message,
    });
  }
};

// load seller
export const loadSeller = () => async (dispatch) => {
  try {
    dispatch({
      type: "LoadSellerRequest",
    });

    // Check if seller data exists in localStorage
    const sellerData = localStorage.getItem("seller");
    if (!sellerData) {
      dispatch({
        type: "LoadSellerFail",
        payload: "Seller not logged in",
      });
      return;
    }

    const { data } = await axios.get(`${server}/shop/getSeller`, {
      withCredentials: true,
    });

    dispatch({
      type: "LoadSellerSuccess",
      payload: data.seller,
    });
  } catch (error) {
    dispatch({
      type: "LoadSellerFail",
      payload: error.response?.data?.message || "Failed to load seller",
    });
  }
};

// user update information
export const updateUserInformation =
  (name, email, phoneNumber) => async (dispatch) => {
    try {
      dispatch({
        type: "updateUserInfoRequest",
      });

      const { data } = await axios.put(
        `${server}/user/update-user-info`,
        {
          phoneNumber,
          name,
        },
        {
          withCredentials: true,
          headers: {
            "Access-Control-Allow-Credentials": true,
          },
        }
      );

      dispatch({
        type: "updateUserInfoSuccess",
        payload: data.user,
      });
    } catch (error) {
      dispatch({
        type: "updateUserInfoFailed",
        payload: error.response.data.message,
      });
    }
  };

// update user address
export const updatUserAddress =
  (country, city, address1, address2, zipCode, addressType, state) =>
    async (dispatch) => {
      try {
        dispatch({
          type: "updateUserAddressRequest",
        });

        const { data } = await axios.put(
          `${server}/user/update-user-addresses`,
          {
            country,
            city,
            address1,
            address2,
            zipCode,
            addressType,
            state,
          },
          { withCredentials: true }
        );

        dispatch({
          type: "updateUserAddressSuccess",
          payload: {
            successMessage: "User address updated succesfully!",
            user: data.user,
          },
        });
      } catch (error) {
        dispatch({
          type: "updateUserAddressFailed",
          payload: error.response.data.message,
        });
      }
    };

// delete user address
export const deleteUserAddress = (id) => async (dispatch) => {
  try {
    dispatch({
      type: "deleteUserAddressRequest",
    });

    const { data } = await axios.delete(
      `${server}/user/delete-user-address/${id}`,
      { withCredentials: true }
    );

    dispatch({
      type: "deleteUserAddressSuccess",
      payload: {
        successMessage: "User deleted successfully!",
        user: data.user,
      },
    });
  } catch (error) {
    dispatch({
      type: "deleteUserAddressFailed",
      payload: error.response.data.message,
    });
  }
};

// get all users --- admin
export const getAllUsers = () => async (dispatch) => {
  try {
    dispatch({
      type: "getAllUsersRequest",
    });

    const { data } = await axios.get(`${server}/user/admin-all-users`, {
      withCredentials: true,
    });

    dispatch({
      type: "getAllUsersSuccess",
      payload: data.users,
    });
  } catch (error) {
    dispatch({
      type: "getAllUsersFailed",
      payload: error.response.data.message,
    });
  }
};
