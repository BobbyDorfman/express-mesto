const Cards = require('../models/card');
const ValidationError = require('../errors/ValidationError');
const NotFound = require('../errors/NotFound');
const Forbidden = require('../errors/Forbidden');

const getCards = (req, res, next) => {
  const { cardsList } = {};
  return Cards.find(cardsList)
    .then((cards) => res.status(200).send(cards))
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  return Cards.create({ name, link, owner: req.user._id })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError('Переданы некорректные данные при создании карточки');
      }
    })
    .catch(next);
};

const deleteCard = (req, res, next) => {
  const cardId = req.params.id;
  return Cards.findById(cardId)
    .orFail(() => {
      throw new NotFound('Карточка с указанным _id не найдена');
    })
    .then((card) => {
      if (card.owner.toString() === req.user._id) {
        Cards.findByIdAndRemove(cardId)
          .then(() => res.status(200).send(card));
      } else {
        throw new Forbidden('Вы пытаетесь удалить чужую карточку');
      }
    })
    .catch(next);
};

const likeCard = (req, res, next) => {
  Cards.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new NotFound('Передан несуществующий _id карточки');
    })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        throw new ValidationError('Переданы некорректные данные');
      }
    })
    .catch(next);
};

const dislikeCard = (req, res, next) => {
  Cards.findByIdAndUpdate(req.params.id, { $pull: { likes: req.user._id } }, { new: true })
    .orFail(() => {
      throw new NotFound('Передан несуществующий _id карточки');
    })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new ValidationError('Переданы некорректные данные');
      }
    })
    .catch(next);
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
