import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotifications } from '../redux/actions/notificationActions';

const Notifications = () => {
  const dispatch = useDispatch();
  const { notifications, error } = useSelector(state => state.notifications);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  return (
    <div>
      <h3>Notifications</h3>
      {error && <p>{error}</p>}
      <ul>
        {notifications.map((notification) => (
          <li key={notification._id}>{notification.message}</li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;
