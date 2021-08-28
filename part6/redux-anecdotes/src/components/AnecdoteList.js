import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { addVote } from '../reducers/anecdoteReducer';
import { setNotification } from '../reducers/notificationReducer';

const AnecdoteList = () => {
  const dispatch = useDispatch();

  const anecdotes = useSelector(({ filter, anecdotes }) => {
    if (filter === '') {
      return anecdotes.sort((a, b) => b.votes - a.votes);
    }
    return anecdotes
      .filter((anecdote) =>
        anecdote.content.toUpperCase().includes(filter.toUpperCase())
      )
      .sort((a, b) => b.votes - a.votes);
  });

  const vote = (id) => {
    dispatch(addVote(id));

    dispatch(
      setNotification(
        `you voted '${anecdotes.filter((an) => an.id === id)[0].content}'`,
        5000
      )
    );
  };

  return (
    <>
      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      ))}
    </>
  );
};

export default AnecdoteList;
