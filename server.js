require('dotenv').config();
const express = require('express');
const mongodb = require('./data/database');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const cors = require('cors');

require('./config/passport');

const app = express();
const port = process.env.PORT || 3000;

// 🔥 Middleware ÚNICO (orden correcto)
app.use(bodyParser.json());
app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE'] }));
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());


passport.serializeUser((user, done) => {
  done(null, user); 
});

passport.deserializeUser((user, done) => {
  done(null, user); 
});


app.get('/test', (req, res) => {
  res.send({
    logged_in: req.isAuthenticated(),
    user: req.user
  });
});

// Ruta home
app.get('/', (req, res) => {
  return res.status(200).send(
    req.user
      ? `Logged in as ${req.user.displayName || req.user.username}`
      : 'Logged out'
  );
});

// GitHub login
app.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

// GitHub callback
app.get(
  '/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/');
  }
);

// Logout
app.get('/auth/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

// Rutas de la app
app.use('/', require('./routes/index.js'));

mongodb.initDB((err) => {
  if (err) {
    console.error(err);
  } else {
    app.listen(port, () => {
      console.log(`🚀 Server running at: http://localhost:${port}`);
    });
  }
});
