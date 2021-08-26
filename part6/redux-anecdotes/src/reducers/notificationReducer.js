const notificationReducer = (state = '', action) => {
  console.log(state);

  switch (action.type) {
    case 'CREATE':
      return action.payload.notification;
    case 'VOTE':
      return action.payload.notification;
    case 'RESET':
      return '';
    default:
      return state;
  }
};

export const createNotification = (notification) => {
  return {
    type: 'CREATE',
    payload: {
      notification: `you create '${notification}'`,
    },
  };
};

export const voteNotification = (notification) => {
  return {
    type: 'VOTE',
    payload: {
      notification: `you voted '${notification}'`,
    },
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
