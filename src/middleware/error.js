//Winston is a logging module for saving errors to a file or database
const winston = require('winston')
require('winston-mongodb')

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'bookAPI' },
    transports: [
        new winston.transports.File({ filename: 'src/logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'src/logs/warnings.log',level:'warn' }),
        new winston.transports.File({ filename: 'src/logs/combined.log'}),
        // new winston.transports.MongoDB({db:process.env.DB_CONNECT_STRING })   
    ]
})

// log express errors
function error(err,req,res,next){
    res.status(500).send(err)
}

// log uncaught sync exception
process.on('uncaughtException', (err) => {
    console.log(ex)
    logger.error(ex.message, ex)
    process.exit(1)
})
// log uncaught async code errors and unhandled rejections
process.on('unhandledRejection', (ex) => {
    console.log('An uncaught rejection occurred')
    logger.error(ex.message, ex)
})

module.exports = error