require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');

const app = express();

// Consts and variables
const PORT = process.env.PORT || 3001;
// const MAX_ID = 1_000_000;

// let persons = [
//   {
//     name: 'Arto Hellas',
//     number: '040-123456',
//     id: 1,
//   },
//   {
//     name: 'Ada Lovelace',
//     number: '39-44-5323523',
//     id: 2,
//   },
//   {
//     name: 'Dan Abramov',
//     number: '12-43-234345',
//     id: 3,
//   },
//   {
//     name: 'Mary Poppendieck',
//     number: '39-23-6423122',
//     id: 4,
//   },
// ];

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
app.use(express.static('build'));
app.use(express.json());
app.use(morgan(logger));
app.use(cors());

// Routes
app.get('/info', (req, res) => {
  Person.find({}).then((persons) => {
    res.send(
      `<p>Phonebook has info for ${
        persons.length
      } people</p><p>${new Date()}</p>`
    );
  });
});

app.get('/api/persons', (req, res) => {
  Person.find({})
    .then((persons) => {
      res.json(persons);
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  Person.findById(id)
    .then((person) => {
      res.json(person);
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id;

  Person.deleteOne({ _id: id })
    .then((result) => {
      if (result.deletedCount > 0) {
        res.status(204).end();
      } else {
        res.status(400).json({ error: 'person was deleted before' });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

app.post('/api/persons', (req, res) => {
  const body = req.body;

  if (!body.name.trim()) {
    return res.status(400).json({ error: 'name is required' });
  }

  if (!body.number.trim()) {
    return res.status(400).json({ error: 'number is required' });
  }

  const person = new Person({
    name: body.name.trim(),
    number: body.number.trim(),
  });

  person.save().then((savedPerson) => {
    res.json(savedPerson);
  });
});

// Port
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
