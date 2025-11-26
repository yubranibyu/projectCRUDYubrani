const express = require('express');
const router = express.Router();
const passport = require('passport');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');
router.use('/', require('./swagger'));


// 🔐 Rutas de autenticación con Passport
router.get('/login', passport.authenticate('github'), (req, res) => {});




// 🔓 Logout
router.get('/logout', (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    res.redirect('/');
  });
});

// 📄 Swagger
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// ⚠ Importante: Primero las rutas de autenticación
router.use('/auth', require('./auth'));

// Luego las demás rutas
router.use('/users', require('./users'));
router.use('/products', require('./products'));

module.exports = router;
