const express = require('express');
const app = express();

require('./startup/logging');
require('./startup/routes')(app);
require('./startup/graphql')(app);
require('./startup/db');

