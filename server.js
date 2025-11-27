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


app
.use(bodyParser.json())
.use(session({
  secret: "secret",
  resave: false,
  saveUninitialized: true
}))
.use(passport.initialize())
.use(passport.session())
.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
})
.use(cors({ methods: ['GET', 'POST', 'PUT', 'DELETE'], origin: '*' }))
.use(cors(origin = '*'))

app.use('/', require('./routes/index.js'));



// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// Home route
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

// Routes

// Database initialization
mongodb.initDB((err) => {
  if (err) {
    console.error(err);
  } else {
    app.listen(port, () => {
      console.log(`🚀 Server running at: http://localhost:${port}`);
    });
  }
});
