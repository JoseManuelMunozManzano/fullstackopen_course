import { useEffect, useState } from 'react';

import { Filter } from './components/Filter';
import { Notification } from './components/Notification';
import { PersonForm } from './components/PersonForm';
import { Persons } from './components/Persons';
import personService from './services/persons';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');
  const [message, setMessage] = useState(null);

  const getAll = () => {
    personService
      .getAll()
      .then((response) => {
        setPersons(response);
      })
      .catch((err) => {
        setMessage({
          msg: 'There was a problem getting the data',
          isError: true,
        });
        setTimeout(() => {
          setMessage(null);
        }, 5000);
      });
  };

  useEffect(() => {
    getAll();
  }, []);

  useEffect(() => {
    if (persons.find((person) => person.name === newName)) {
      alert(`${newName} is already added to phonebook`);
    }
  }, [newName, persons]);

  const updatePerson = (personFind) => {
    const newData = { name: personFind.name, number: newNumber };
    personService
      .update(personFind.id, newData)
      .then((updatedPerson) => {
        setMessage({
          msg: `Updated ${updatedPerson.name} number to ${newData.number}`,
          isError: false,
        });
        setTimeout(() => {
          setMessage(null);
        }, 5000);

        setNewName('');
        setNewNumber('');
        setPersons(
          persons.map((person) =>
            person.id !== personFind.id ? person : updatedPerson
          )
        );
      })
      .catch((err) => {
        setNewName('');
        setNewNumber('');

        setMessage({
          msg: `There was a problem updating ${personFind.name}`,
          isError: true,
        });
        setTimeout(() => {
          setMessage(null);
        }, 5000);

        getAll();
      });
  };

  const addPerson = (e) => {
    e.preventDefault();

    if (newName === '') {
      setMessage({
        msg: 'Name required',
        isError: true,
      });
      setTimeout(() => {
        setMessage(null);
      }, 3000);
      return;
    }

    const personFind = persons.find((person) => person.name === newName);
    if (personFind) {
      if (
        window.confirm(
          `${newName} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        updatePerson(personFind);
        return;
      }
      setNewName('');
      setNewNumber('');
      return;
    }

    const person = { name: newName, number: newNumber };
    personService
      .create(person)
      .then((returnedPerson) => {
        setMessage({
          msg: `Added ${returnedPerson.name}`,
          isError: false,
        });
        setTimeout(() => {
          setMessage(null);
        }, 5000);

        setNewName('');
        setNewNumber('');
        setPersons([...persons, returnedPerson]);
      })
      .catch((err) => {
        setNewName('');
        setNewNumber('');

        setMessage({
          msg: `There was a problem creating ${person.name}`,
          isError: true,
        });
        setTimeout(() => {
          setMessage(null);
        }, 5000);
      });
  };

  const deletePerson = (person) => {
    const { name, id } = person;
    if (window.confirm(`Delete ${name}?`)) {
      personService
        .deleteElement(id)
        .then((response) => {
          setMessage({
            msg: `${person.name} has been deleted`,
            isError: false,
          });
          setTimeout(() => {
            setMessage(null);
          }, 5000);

          setPersons(persons.filter((person) => person.id !== id));
        })
        .catch((err) => {
          setNewName('');
          setNewNumber('');

          setMessage({
            msg: `There was a problem deleting ${person.name}`,
            isError: true,
          });
          setTimeout(() => {
            setMessage(null);
          }, 5000);
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

      <Notification message={message} />

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
