const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();
const Person = require('./models/person');

const app = express();

// Consts and variables
const PORT = process.env.PORT || 3001;

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

const errorHandler = (err, req, res, next) => {
  console.log(err.message);

  if (err.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' });
  } else if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  }

  next(err);
};

// Middlewares
app.use(express.static('build'));
app.use(cors());
app.use(express.json());
app.use(morgan(logger));

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

app.get('/api/persons', (req, res, next) => {
  Person.find({})
    .then((persons) => {
      res.json(persons);
    })
    .catch(next);
});

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch(next);
});

app.post('/api/persons', (req, res, next) => {
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

  person
    .save()
    .then((savedPerson) => {
      res.json(savedPerson.toJSON());
    })
    .catch(next);
});

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body;

  if (!body.number.trim()) {
    return res.status(400).json({ error: 'number is required' });
  }

  const person = {
    number: body.number,
  };

  Person.findByIdAndUpdate(req.params.id, person, {
    new: true,
    runValidators: true,
  })
    .then((updatedPerson) => {
      if (!updatedPerson) {
        return res.status(400).json({ error: 'Not updated' });
      }
      res.json(updatedPerson);
    })
    .catch(next);
});

app.delete('/api/persons/:id', (req, res, next) => {
  const id = req.params.id;

  Person.findByIdAndRemove(id)
    .then((result) => {
      if (result) {
        res.status(204).end();
      } else {
        res.status(400).json({ error: 'person was deleted before' });
      }
    })
    .catch(next);
});

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' });
};

// Other middlewares
app.use(unknownEndpoint);
app.use(errorHandler);

// Port
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
