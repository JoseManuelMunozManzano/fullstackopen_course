let timer;

const notificationReducer = (state = '', action) => {
  switch (action.type) {
    case 'SET':
      return action.payload.notification;
    case 'RESET':
      return '';
    default:
      return state;
  }
};

export const setNotification = (notification, time) => {
  return async (dispatch) => {
    clearTimeout(timer);

    dispatch({
      type: 'SET',
      payload: {
        notification: notification,
      },
    });

    timer = setTimeout(() => {
      dispatch(resetNotification());
    }, time);
  };
};

export const resetNotification = () => {
  return {
    type: 'RESET',
    payload: {
      notification: '',
    },
  };
};

export default notificationReducer;
