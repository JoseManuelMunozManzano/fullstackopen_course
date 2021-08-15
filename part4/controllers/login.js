const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const loginRouter = require('express').Router();

const User = require('../models/user');

loginRouter.post('/', async (req, res, next) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash);

  if (!(user && passwordCorrect)) {
    next(new Error('usOrPassInv'));
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  };

  // token expires in five hours
  const token = jwt.sign(userForToken, process.env.SECRET, {
    expiresIn: '5h',
  });

  res.status(200).send({ token, username: user.username, name: user.name });
});

module.exports = loginRouter;
