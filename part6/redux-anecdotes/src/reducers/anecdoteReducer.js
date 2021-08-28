import anecdoteService from '../services/anecdotes';

const anecdoteReducer = (state = [], action) => {
  console.log('state now: ', state);
  console.log('action', action);

  switch (action.type) {
    case 'ADD_VOTE':
      return state.map((anecdote) =>
        anecdote.id === action.payload.id
          ? { ...anecdote, votes: anecdote.votes + 1 }
          : anecdote
      );
    case 'INIT_ANECDOTES':
      return action.payload.data;
    case 'NEW_ANECDOTE':
      return [...state, action.payload.data];
    default:
      return state;
  }
};

export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll();

    dispatch({
      type: 'INIT_ANECDOTES',
      payload: {
        data: anecdotes,
      },
    });
  };
};

export const addVote = (id) => {
  return {
    type: 'ADD_VOTE',
    payload: {
      id,
    },
  };
};

export const newAnecdote = (content) => {
  return async (dispatch) => {
    const newAnec = await anecdoteService.createNew(content);

    dispatch({
      type: 'NEW_ANECDOTE',
      payload: {
        data: newAnec,
      },
    });
  };
};

export default anecdoteReducer;
