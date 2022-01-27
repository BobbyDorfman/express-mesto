const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const routes = require('./routes');
const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/errors');
const { createUser, login } = require('./controllers/users');
const { loginValidation, userValidation } = require('./middlewares/validation');

const { PORT = 3000 } = process.env;
const app = express();
app.use(bodyParser.json());

app.post('/sign-up', userValidation, createUser);
app.post('sign-in', loginValidation, login);
app.use(auth);

app.use(routes);

app.use(errors());
app.use(errorHandler);

mongoose.connect('mongodb://localhost:27017/mestodb', () => {
  console.log('Подключение успешно');
});

app.listen(PORT, () => {
  console.log(`Started on port ${PORT}`);
});
