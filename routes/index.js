const express = require('express');
const router = express.Router();
const passport = require('passport');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');


// Rutas de autenticación
router.get('/login', passport.authenticate('github'), (req, res) => {});


router.get('/logout', (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    res.redirect('/');
  });
});




router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

router.use('/auth', require('./auth'));
router.use('/users', require('./users'));
router.use('/products', require('./products'));

module.exports = router;
