const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

// Consts and variables
const PORT = process.env.PORT || 3001;
const MAX_ID = 1_000_000;

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

// Functions
const logger = (tokens, req, res) => {
  morgan.token('body', function (req, res) {
    return JSON.stringify(req.body);
  });

  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'),
    '-',
    tokens['response-time'](req, res),
    'ms',
    tokens.body(req, res),
  ].join(' ');
};

// Middlewares
app.use(express.json());
app.use(morgan(logger));
app.use(cors());

// Routes
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

  res.json(person);
});

// Port
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
