const express = require('express');
const router = express.Router();
const passport = require('../config/passport');

// Iniciar login GitHub
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

// Callback de GitHub
router.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/'); // Aquí puedes redirigir al dashboard, productos, etc.
  }
);

// Logout
router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

module.exports = router;
