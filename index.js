const winston = require('winston');
const express = require('express');
const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

require('./startup/logging');
require('./startup/graphql')(app);
require('./startup/db');

const port = process.env.PORT || 3000;
app.listen(port, () => winston.info(`Listening on port ${port}...`));