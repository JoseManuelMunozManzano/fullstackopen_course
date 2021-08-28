import React from 'react';
import { useDispatch } from 'react-redux';

import { newAnecdote } from '../reducers/anecdoteReducer';
import {
  createNotification,
  resetNotification,
} from '../reducers/notificationReducer';

const AnecdoteForm = () => {
  const dispatch = useDispatch();

  const addAnecdote = async (ev) => {
    ev.preventDefault();
    const content = ev.target.anecdote.value;
    ev.target.anecdote.value = '';
    dispatch(newAnecdote(content));

    dispatch(createNotification(`new anecdote '${content}'`));
    setTimeout(() => {
      dispatch(resetNotification());
    }, 5000);
  };

  return (
    <>
      <h2>create new</h2>
      <form onSubmit={addAnecdote}>
        <div>
          <input name="anecdote" />
        </div>
        <button type="submit">create</button>
      </form>
    </>
  );
};

export default AnecdoteForm;
