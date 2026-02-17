import axios from "axios";

// Place a bid
export const placeBid = (productId, amount) => async (dispatch) => {
  try {
    dispatch({ type: "PLACE_BID_REQUEST" });

    const { data } = await axios.post(`/bid`, { productId, amount });

    dispatch({
      type: "PLACE_BID_SUCCESS",
      payload: data.bid,
    });
  } catch (error) {
    dispatch({
      type: "PLACE_BID_FAIL",
      payload: error.response.data.message,
    });
  }
};

// Get bids for a product
export const getBids = (productId) => async (dispatch) => {
  try {
    dispatch({ type: "GET_BIDS_REQUEST" });

    const { data } = await axios.get(`/bid/product/${productId}`);

    dispatch({
      type: "GET_BIDS_SUCCESS",
      payload: data.bids,
    });
  } catch (error) {
    dispatch({
      type: "GET_BIDS_FAIL",
      payload: error.response.data.message,
    });
  }
};

// Accept or Reject a bid
export const acceptOrRejectBid = (bidId, status) => async (dispatch) => {
  try {
    dispatch({ type: "UPDATE_BID_REQUEST" });

    const { data } = await axios.put(`/bid/${bidId}/status`, { status });

    dispatch({
      type: "UPDATE_BID_SUCCESS",
      payload: data.bid,
    });
  } catch (error) {
    dispatch({
      type: "UPDATE_BID_FAIL",
      payload: error.response.data.message,
    });
  }
};

// Get all bids for user
export const getAllBids = () => async (dispatch) => {
  try {
    dispatch({ type: "GET_ALL_BIDS_REQUEST" });

    const { data } = await axios.get(`/bid/user`);

    dispatch({
      type: "GET_ALL_BIDS_SUCCESS",
      payload: data.bids,
    });
  } catch (error) {
    dispatch({
      type: "GET_ALL_BIDS_FAIL",
      payload: error.response?.data?.message || "Something went wrong",
    });
  }
};

// Delete product
export const deleteProduct = (productId) => async (dispatch) => {
  try {
    dispatch({ type: "DELETE_PRODUCT_REQUEST" });

    const { data } = await axios.delete(`/api/v2/delete-shop-product/${productId}`);

    dispatch({
      type: "DELETE_PRODUCT_SUCCESS",
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: "DELETE_PRODUCT_FAIL",
      payload: error.response.data.message,
    });
  }
};
