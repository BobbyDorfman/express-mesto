const router = require('express').Router()
const usersRouter = require('./users')
const cardsRouter = require('./cards')

router.use('/users', usersRouter)
router.use('/cards', cardsRouter)
router.get('/', (req, res) => {
  res.send('Тут ничего нет')
})
module.exports = router