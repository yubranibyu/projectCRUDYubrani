const express = require('express');
const mongodb = require('./data/database');
const port = 3000;
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
const passport = require('passport');
const session = require('express-session');
const GithubStrategy = require('passport-github2').Strategy;
const cors = require('cors');
const app = express();


// Middleware

app
.use(bodyParser.json())
.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true
}))


.use(passport.initialize())


.use(passport.session())


.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  next();
})
.use(cors({ methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'] }))
.use(cors({ origin: '*' }))
.use('/', require('./routes/index.js'));


// Passport GitHub Strategy
passport.use(new GithubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL
  },
  (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
  }
));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Routes
app.get('/', (req, res) => {
  res.send(req.session.user !== undefined ? `Logged in as ${req.session.user.displayName}` : 'Logged out');
});



// GitHub callback
app.get('/github/callback', passport.authenticate('github', { failureRedirect: '/api-docs', session: false }),
  (req, res) => {
    req.session.user = req.user;
    res.redirect('/');
  }
);



// MongoDB Init
mongodb.initDB((err) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  }
});
