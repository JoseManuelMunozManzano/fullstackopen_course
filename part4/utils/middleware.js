const jwt = require('jsonwebtoken');

const User = require('../models/user');
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
  tokenErr: {
    status: 401,
    msg: 'Token missing or invalid',
  },
  UserIncorrect: {
    status: 401,
    msg: "You can't delete this blog",
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
  } else if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'invalid token' });
  } else if (error.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'token expired' });
  } else if (error.name === 'Error') {
    const { status, msg } = errors[error.message];
    return res.status(status).json({
      error: msg,
    });
  }

  logger.error(error.message);

  next(error);
};

const tokenExtractor = (req, res, next) => {
  let authorization = req.get('authorization');

  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    authorization = authorization.substring(7);
  }

  req.token = authorization;

  next();
};

const userExtractor = async (req, res, next) => {
  const decodedToken = jwt.verify(req.token, process.env.SECRET);
  if (!req.token || !decodedToken.id) {
    return next(new Error('tokenErr'));
  }

  req.user = await User.findById(decodedToken.id);
  next();
};

module.exports = {
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor,
};
