import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  notifications: [],
  loading: false,
  error: null,
};

export const notificationReducer = createReducer(initialState, {
  ADD_NOTIFICATION_REQUEST: (state) => {
    state.loading = true;
  },
  ADD_NOTIFICATION_SUCCESS: (state, action) => {
    state.loading = false;
    state.notifications = [action.payload, ...state.notifications];
  },
  ADD_NOTIFICATION_FAIL: (state, action) => {
    state.loading = false;
    state.error = action.payload;
  },
  MARK_AS_READ: (state, action) => {
    state.notifications = state.notifications.map((notification) =>
      notification._id === action.payload
        ? { ...notification, isRead: true }
        : notification
    );
  },
  CLEAR_ERRORS: (state) => {
    state.error = null;
  },
});
