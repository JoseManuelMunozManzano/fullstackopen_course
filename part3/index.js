const express = require('express');
const app = express();

let persons = [
  {
    name: 'Arto Hellas',
    number: '040-123456',
    id: 1,
  },
  {
    name: 'Ada Lovelace',
    number: '39-44-5323523',
    id: 2,
  },
  {
    name: 'Dan Abramov',
    number: '12-43-234345',
    id: 3,
  },
  {
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
    id: 4,
  },
];

const PORT = 3001;
const MAX_ID = 100_000;

app.use(express.json());

app.get('/info', (req, res) => {
  res.send(
    `<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`
  );
});

app.get('/api/persons', (req, res) => {
  res.json(persons);
});

app.get('/api/persons/:id', (req, res) => {
  const id = +req.params.id;
  const person = persons.find((person) => person.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.delete('/api/persons/:id', (req, res) => {
  const id = +req.params.id;
  persons = persons.filter((person) => person.id !== id);

  res.status(204).end();
});

app.post('/api/persons', (req, res) => {
  const body = req.body;

  if (!body.name.trim()) {
    return res.status(400).json({ error: 'name is required' });
  }

  if (!body.number.trim()) {
    return res.status(400).json({ error: 'number is required' });
  }

  if (
    persons.find(
      (person) =>
        person.name.toUpperCase().trim() === body.name.toUpperCase().trim()
    )
  ) {
    return res.status(404).json({ error: 'name must be unique' });
  }

  const person = {
    name: body.name.trim(),
    number: body.number.trim(),
    id: Math.floor(Math.random() * MAX_ID) + 1,
  };

  persons = [...persons, person];

  res.json(persons);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
