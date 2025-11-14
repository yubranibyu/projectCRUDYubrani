const express = require('express');
const router = express.Router();

router.use('/', require('./swagger'));

router.get('/', (req, res) => {
  //  #swagger.tags=['Users']
  res.send('Welcome to the Users API');
});

router.use('/users', require('./users'));


module.exports = router;
