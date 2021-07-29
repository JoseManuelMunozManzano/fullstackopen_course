import { useEffect, useState } from 'react';

import { Filter } from './components/Filter';
import { PersonForm } from './components/PersonForm';
import { Persons } from './components/Persons';
import personService from './services/persons';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');

  useEffect(() => {
    personService.getAll().then((response) => {
      setPersons(response);
    });
  }, []);

  useEffect(() => {
    if (persons.find((person) => person.name === newName)) {
      alert(`${newName} is already added to phonebook`);
    }
  }, [newName, persons]);

  const addPerson = (e) => {
    e.preventDefault();

    if (newName === '') {
      alert('name is required');
      return;
    }

    const personFind = persons.find((person) => person.name === newName);
    if (personFind) {
      if (
        window.confirm(
          `${newName} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        const updatePerson = { name: personFind.name, number: newNumber };
        personService
          .update(personFind.id, updatePerson)
          .then((updatedPerson) => {
            setNewName('');
            setNewNumber('');
            setPersons(
              persons.map((person) =>
                person.id !== personFind.id ? person : updatedPerson
              )
            );
          });
        return;
      }
      setNewName('');
      setNewNumber('');
      return;
    }
    const person = { name: newName, number: newNumber };
    personService.create(person).then((returnedPerson) => {
      setNewName('');
      setNewNumber('');
      setPersons([...persons, returnedPerson]);
    });
  };

  const deletePerson = (person) => {
    const { name, id } = person;
    if (window.confirm(`Delete ${name}?`)) {
      personService.deleteElement(id).then((response) => {
        console.log();
        setPersons(persons.filter((person) => person.id !== id));
      });
    }
  };

  const handleNewName = (e) => {
    setNewName(e.target.value);
  };

  const handleNewNumber = (e) => {
    setNewNumber(e.target.value);
  };

  const handleFilter = (e) => {
    setFilter(e.target.value);
  };

  const personsToShow =
    filter === ''
      ? [...persons]
      : persons.filter((person) =>
          person.name.toUpperCase().includes(filter.toUpperCase())
        );

  return (
    <div>
      <h2>Phonebook</h2>

      <Filter filter={filter} handleFilter={handleFilter} />

      <h3>add a new</h3>

      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNewName={handleNewName}
        newNumber={newNumber}
        handleNewNumber={handleNewNumber}
      />

      <h3>Numbers</h3>

      <Persons persons={personsToShow} deletePerson={deletePerson} />
    </div>
  );
};

export default App;
