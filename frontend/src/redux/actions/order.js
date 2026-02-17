import axios from "axios";
import { server } from "../../server";

// get all orders of user
export const getAllOrdersOfUser = (userId) => async (dispatch) => {
  try {
    dispatch({
      type: "getAllOrdersUserRequest",
    });

    const { data } = await axios.get(
      `${server}/order/get-all-orders/${userId}`,
      { withCredentials: true }
    );

    dispatch({
      type: "getAllOrdersUserSuccess",
      payload: data.orders,
    });
  } catch (error) {
    dispatch({
      type: "getAllOrdersUserFailed",
      payload: error.response?.data?.message || "Error fetching orders",
    });
  }
};

// get all orders of seller
export const getAllOrdersOfShop = () => async (dispatch) => {
  try {
    dispatch({
      type: "getAllOrdersShopRequest",
    });

    const { data } = await axios.get(
      `${server}/order/get-seller-all-orders`,
      { withCredentials: true }
    );

    if (!data.success) {
      throw new Error(data.message || "Failed to fetch orders");
    }

    // Ensure orders is an array
    const orders = Array.isArray(data.orders) ? data.orders : [];

    // Sort orders by createdAt in descending order (newest first)
    const sortedOrders = orders.sort((a, b) =>
      new Date(b.createdAt) - new Date(a.createdAt)
    );

    console.log("Fetched orders:", sortedOrders.length);

    dispatch({
      type: "getAllOrdersShopSuccess",
      payload: sortedOrders,
    });
  } catch (error) {
    console.error("Error fetching shop orders:", error);
    dispatch({
      type: "getAllOrdersShopFailed",
      payload: error.response?.data?.message || error.message,
    });
  }
};

// get all orders of Admin
export const getAllOrdersOfAdmin = () => async (dispatch) => {
  try {
    dispatch({
      type: "adminAllOrdersRequest",
    });

    const { data } = await axios.get(`${server}/order/admin-all-orders`, {
      withCredentials: true,
    });

    // Sort orders by createdAt in descending order (newest first)
    const sortedOrders = data.orders.sort((a, b) =>
      new Date(b.createdAt) - new Date(a.createdAt)
    );

    dispatch({
      type: "adminAllOrdersSuccess",
      payload: sortedOrders,
    });
  } catch (error) {
    dispatch({
      type: "adminAllOrdersFailed",
      payload: error.response.data.message,
    });
  }
};

// update order status after checkout
export const updateOrderStatusAfterCheckout = (orderId) => async (dispatch) => {
  try {
    dispatch({
      type: "updateOrderStatusRequest",
    });

    const { data } = await axios.put(
      `${server}/order/update-order-status-after-checkout/${orderId}`,
      {},
      { withCredentials: true }
    );

    dispatch({
      type: "updateOrderStatusSuccess",
      payload: data.order,
    });
  } catch (error) {
    dispatch({
      type: "updateOrderStatusFailed",
      payload: error.response.data.message,
    });
  }
};
// get shop sales stats
export const getShopSalesStats = () => async (dispatch) => {
  try {
    dispatch({
      type: "getShopSalesStatsRequest",
    });

    const { data } = await axios.get(
      `${server}/order/get-shop-sales-stats`,
      { withCredentials: true }
    );

    dispatch({
      type: "getShopSalesStatsSuccess",
      payload: data.stats,
    });
  } catch (error) {
    dispatch({
      type: "getShopSalesStatsFailed",
      payload: error.response?.data?.message || "Error fetching sales stats",
    });
  }
};
