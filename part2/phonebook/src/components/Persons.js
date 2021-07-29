import React from 'react';
import { Person } from './Person';

export const Persons = ({ persons, deletePerson }) => {
  return (
    <>
      {persons.map((person) => (
        <Person key={person.name} person={person} deletePerson={deletePerson} />
      ))}
    </>
  );
};
