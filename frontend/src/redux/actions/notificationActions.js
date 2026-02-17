import axios from 'axios';
import { NOTIFICATIONS_SUCCESS, NOTIFICATIONS_FAIL } from '../constants/notificationConstants';

export const fetchNotifications = () => async (dispatch, getState) => {
  try {
    const { userLogin: { userInfo } } = getState();

    const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
    const { data } = await axios.get('/api/notifications', config);

    dispatch({ type: NOTIFICATIONS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: NOTIFICATIONS_FAIL, payload: error.response?.data?.message || 'Failed to load notifications' });
  }
};
