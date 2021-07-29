import React from 'react';

export const Person = ({ person, deletePerson }) => {
  return (
    <div key={person.name} person={person}>
      {person.name} {person.number}{' '}
      <button onClick={() => deletePerson(person)}> delete</button>
    </div>
  );
};
