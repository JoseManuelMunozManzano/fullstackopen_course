import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { resetNotification } from '../reducers/notificationReducer';

const Notification = () => {
  const notification = useSelector((state) => state.notification);
  const dispatch = useDispatch();

  setTimeout(() => {
    dispatch(resetNotification());
  }, 5000);

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
  };
  return <div style={style}>{notification}</div>;
};

export default Notification;
