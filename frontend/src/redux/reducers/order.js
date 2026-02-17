import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  isLoading: true,
  adminOrderLoading: false,
  orderUpdateLoading: false,
};

export const orderReducer = createReducer(initialState, {
  // get all orders of user
  getAllOrdersUserRequest: (state) => {
    state.isLoading = true;
  },
  getAllOrdersUserSuccess: (state, action) => {
    state.isLoading = false;
    state.orders = action.payload;
    state.error = null;
  },
  getAllOrdersUserFailed: (state, action) => {
    state.isLoading = false;
    state.error = action.payload;
    state.orders = [];
  },

  // get all orders of shop
  getAllOrdersShopRequest: (state) => {
    state.isLoading = true;
  },
  getAllOrdersShopSuccess: (state, action) => {
    state.isLoading = false;
    state.orders = action.payload;
  },
  getAllOrdersShopFailed: (state, action) => {
    state.isLoading = false;
    state.error = action.payload;
  },

  // get all orders for admin
  adminAllOrdersRequest: (state) => {
    state.adminOrderLoading = true;
  },
  adminAllOrdersSuccess: (state, action) => {
    state.adminOrderLoading = false;
    state.adminOrders = action.payload;
  },
  adminAllOrdersFailed: (state, action) => {
    state.adminOrderLoading = false;
    state.error = action.payload;
  },

  updateOrderStatusRequest: (state) => {
    state.orderUpdateLoading = true;
  },
  updateOrderStatusSuccess: (state, action) => {
    state.orderUpdateLoading = false;
    state.orders = state.orders.map((order) =>
      order._id === action.payload._id ? action.payload : order
    );
  },
  updateOrderStatusFailed: (state, action) => {
    state.orderUpdateLoading = false;
    state.error = action.payload;
  },

  // get shop sales stats
  getShopSalesStatsRequest: (state) => {
    state.statsLoading = true;
  },
  getShopSalesStatsSuccess: (state, action) => {
    state.statsLoading = false;
    state.stats = action.payload;
  },
  getShopSalesStatsFailed: (state, action) => {
    state.statsLoading = false;
    state.error = action.payload;
  },

  clearErrors: (state) => {
    state.error = null;
  },
});
