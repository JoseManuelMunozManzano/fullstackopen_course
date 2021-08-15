const logger = require('./logger');

const errors = {
  passLength: {
    status: 400,
    msg: 'The length of the password must be at least 3 characters',
  },
  passReq: {
    status: 400,
    msg: 'Password required',
  },
  titUrlReq: {
    status: 400,
    msg: 'Title and Url required',
  },
  usOrPassInv: {
    status: 401,
    msg: 'Invalid username or password',
  },
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
    const { status, msg } = errors[error.message];
    return res.status(status).json({
      error: msg,
    });
  }

  logger.error(error.message);

  next(error);
};

module.exports = {
  unknownEndpoint,
  errorHandler,
};
