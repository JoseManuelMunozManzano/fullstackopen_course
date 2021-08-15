const logger = require('./logger');

const errors = {
  passLength: 'The length of the password must be at least 3 characters',
  passReq: 'Password required',
  titUrlReq: 'Title and Url required',
};

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (error, req, res, next) => {
  if (error.name === 'CastError') {
    return res.status(400).json({
      error: 'malformatted id',
    });
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({
      error: error.message,
    });
  } else if (error.name === 'Error') {
    return res.status(400).json({
      error: errors[error.message],
    });
  }

  logger.error(error.message);

  next(error);
};

module.exports = {
  unknownEndpoint,
  errorHandler,
};
