import React from 'react';

export const Person = ({ person }) => {
  return (
    <div key={person.name} person={person}>
      {person.name} {person.number}
    </div>
  );
};
