import React from 'react';
import { useDispatch } from 'react-redux';

import { newAnecdote } from '../reducers/anecdoteReducer';
import { createNotification } from '../reducers/notificationReducer';
import anecdoteService from '../services/anecdotes';

const AnecdoteForm = () => {
  const dispatch = useDispatch();

  const addAnecdote = async (ev) => {
    ev.preventDefault();
    const content = ev.target.anecdote.value;
    ev.target.anecdote.value = '';
    const newAnecd = await anecdoteService.createNew(content);
    dispatch(newAnecdote(newAnecd));
    dispatch(createNotification(newAnecd.content));
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
