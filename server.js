const express = require('express');
const app = express();
const mongodb = require('./data/database');
const port = 3000;
const bodyparser = require('body-parser');
app.use(bodyparser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Z-Key');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});
app.use('/', require('./routes'));



mongodb.initDB((err) => {
  if (err) {
    console.log(err);
  }
  else {
    app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
  }
});