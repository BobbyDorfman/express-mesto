const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFound = require('../errors/NotFound');
const ValidationError = require('../errors/ValidationError');
const ConflictError = require('../errors/ConcflictError');

const getUsers = (req, res, next) => {
  const { userList } = {};
  return User.find(userList)
    .then((users) => res.status(200).send(users))
    .catch(next);
};

const getUser = (req, res, next) => {
  const { id } = req.params;
  return User.findById(id)
    .orFail(() => {
      throw new NotFound('Пользователь не найден');
    })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new ValidationError('Переданы некорректные данные');
      }
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      }))
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError('Переданы некорректные данные при создании пользователя');
      } else if (err.code === 11000) {
        throw new ConflictError({ message: 'Пользователь с таким email уже существует' });
      }
    })
    .catch(next);
};

const getCurrentUser = (req, res, next) => User.findById(req.user._id)
  .orFail(() => {
    throw new NotFound('Пользователь не найден');
  })
  .then((user) => res.status(200).send({ user }))
  .catch((err) => {
    if (err.name === 'CastError') {
      throw new ValidationError('Переданы некорректные данные');
    }
  })
  .catch(next);

const updateUser = (req, res, next) => {
  const { name, about } = req.body;

  return User.findByIdAndUpdate(req.user._id, { name, about }, { new: true })
    .orFail(() => {
      throw new NotFound('Пользователь с указанным _id не найден');
    })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        throw new ValidationError('Переданы некорректные данные при обновлении профиля');
      }
    })
    .catch(next);
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  return User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .orFail(() => {
      throw new NotFound('Пользователь с указанным _id не найден');
    })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        throw new ValidationError('Переданы некорректные данные при обновлении аватара');
      }
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(next);
};

module.exports = {
  getUsers,
  getUser,
  getCurrentUser,
  createUser,
  updateUser,
  updateAvatar,
  login,
};
