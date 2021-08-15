const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();

const User = require('../models/user');

usersRouter.get('/', async (req, res) => {
  const users = await User.find({}).populate('blogs', {
    url: 1,
    title: 1,
    author: 1,
  });
  res.json(users);
});

usersRouter.post('/', async (req, res, next) => {
  const { username, name, password } = req.body;

  if (!password) {
    return next(new Error('passReq'));
  } else if (password.length < 3) {
    return next(new Error('passLength'));
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash,
  });

  const savedUser = await user.save();

  res.json(savedUser);
});

module.exports = usersRouter;
