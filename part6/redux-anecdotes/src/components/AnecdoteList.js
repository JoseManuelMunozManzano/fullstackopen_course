import React from 'react';
import { connect } from 'react-redux';

import { addVote } from '../reducers/anecdoteReducer';
import { setNotification } from '../reducers/notificationReducer';

const AnecdoteList = (props) => {
  const vote = (id) => {
    props.addVote(id);

    props.setNotification(
      `you voted '${props.anecdotes.filter((an) => an.id === id)[0].content}'`,
      5000
    );
  };

  return (
    <>
      {props.anecdotes.map((anecdote) => (
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

const mapStateToProps = (state) => {
  if (state.filter === '') {
    return {
      anecdotes: state.anecdotes.sort((a, b) => b.votes - a.votes),
    };
  }

  return {
    anecdotes: state.anecdotes
      .filter((anecdote) =>
        anecdote.content.toUpperCase().includes(state.filter.toUpperCase())
      )
      .sort((a, b) => b.votes - a.votes),
  };
};

const mapDispatchToProps = {
  addVote,
  setNotification,
};

export default connect(mapStateToProps, mapDispatchToProps)(AnecdoteList);
