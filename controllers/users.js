const User = require("../models/user");
const getUsers = (req, res) => {
  return User.find({})
    .then(users => res.status(200).send(users))
    .catch(err => res.status(500).send({ message: `Не удалось получить пользователей: ${err}`}))
}

const getUser = (req, res) => {
  const { id } = req.params
  return User.findById(id)
    .then(user => res.status(200).send(user))
    .catch(err => res.status(500).send({ message: `Пользователь не найден: ${err}`}))
}

const createUser = (req, res) => {
  const { name, about, avatar } = req.body

  return User.create({ name, about, avatar })
    .then(user=> res.status(200).send(user))
    .catch(err => res.status(500).send({ message: `Произошла ошибка: ${err}`
}))
}

const updateUser = (req, res) => {
  const { name, about } = req.body

  return User.findByIdAndUpdate(req.user._id, {name, about})
    .then(user => res.status(200).send(user))
}

const updateAvatar = (req, res) => {
  const { avatar } = req.body
  return User.findByIdAndUpdate(req.user._id, { avatar })
    .then(avatar => res.status(200).send(avatar))
}

module.exports = { getUsers, getUser, createUser, updateUser, updateAvatar }