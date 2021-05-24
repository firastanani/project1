const winston = require('winston');

module.exports = function () {

    process.on('uncaughtException', (err) => {
        winston.error(err.toString());
        winston.error(err.stack.toString());
    });

      process.on('unhandledRejection' , (err)=>{
        winston.error(err.toString());
        winston.error(err.stack.toString());
      })
      
      winston.add(new winston.transports.File({ filename: 'logfile.log'}));
      winston.add(new winston.transports.Console());
}



