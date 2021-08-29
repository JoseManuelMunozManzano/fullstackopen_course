import React from 'react';
import { connect } from 'react-redux';

import { newAnecdote } from '../reducers/anecdoteReducer';
import { setNotification } from '../reducers/notificationReducer';

const AnecdoteForm = (props) => {
  const addAnecdote = async (ev) => {
    ev.preventDefault();
    const content = ev.target.anecdote.value;
    ev.target.anecdote.value = '';
    props.newAnecdote(content);

    props.setNotification(`new anecdote '${content}'`, 5000);
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

export default connect(null, { newAnecdote, setNotification })(AnecdoteForm);
