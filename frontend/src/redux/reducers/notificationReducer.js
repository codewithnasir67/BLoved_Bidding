import { NOTIFICATIONS_SUCCESS, NOTIFICATIONS_FAIL } from '../constants/notificationConstants';

export const notificationReducer = (state = { notifications: [] }, action) => {
  switch (action.type) {
    case NOTIFICATIONS_SUCCESS:
      return { notifications: action.payload };
    case NOTIFICATIONS_FAIL:
      return { error: action.payload };
    default:
      return state;
  }
};
