import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { addVote } from '../reducers/anecdoteReducer';
import { voteNotification } from '../reducers/notificationReducer';

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
    console.log('vote', id);
    dispatch(addVote(id));
    dispatch(
      voteNotification(anecdotes.filter((an) => an.id === id)[0].content)
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
