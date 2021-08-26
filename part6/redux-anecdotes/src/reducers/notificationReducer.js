const notificationReducer = (state = '', action) => {
  console.log(state);

  switch (action.type) {
    case 'CREATE':
      return action.payload.message;
    case 'VOTE':
      return action.payload.message;
    case 'RESET':
      return '';
    default:
      return state;
  }
};

export const createMessage = (message) => {
  return {
    type: 'CREATE',
    payload: {
      message: `you create '${message}'`,
    },
  };
};

export const voteMessage = (message) => {
  return {
    type: 'VOTE',
    payload: {
      message: `you voted '${message}'`,
    },
  };
};

export const resetMessage = () => {
  return {
    type: 'RESET',
    payload: {
      message: '',
    },
  };
};

export default notificationReducer;
