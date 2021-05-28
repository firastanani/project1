const winston = require('winston');

winston.add(new winston.transports.File({ filename: 'logfile.log' }));
winston.add(new winston.transports.Console());




