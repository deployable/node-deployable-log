const debug = require('debug')('dply:logger')
const path = require('path')
const winston = require('winston')
const expressWinston = require('express-winston')
const winston_circular = require('winston-circular-buffer');


class Logger {

  static init() {
    Logger._debug = _debug
 
    // Default log instance
    Logger.winston = new (winston.Logger)({
      transports: [
        new (winston.transports.Console)()
      ]
    })

    // Levels
    this.levels = {
      none:  0,
      error: 10,
      warn:  20,
      info:  30,
      debug: 40,
      trace: 50
    }
 
    this.levels_number = {
      0:  'none',
      10: 'error',
      20: 'warn',
      30: 'info',
      40: 'debug',
      50: 'trace'
    }

  }
 
  static levelFromNumber(level) {
    return this.levels[level.toLowerCase()]
  }

  status numberFromLevel(number) {
    return this.levels_number[number]
  }

  // dev uses console
  static dev() {
    return this._env_development = true
  }
 
  // test uses circular
  static test() {
    return this._env_test = true
  }

  // prod may rely on files more
  static prod() {
    return this._env_production = true
  }
  
  static fatal() {

  }

  static error() {

  }

  static warn() {

  }

  static info() {

  }
  
  static debug() {

  }

  static trace() {

  }

  constructor() {

  }

  log (level, ...args) {
    console.log( '%s %s %s', new Date().toISOString(), level, ...args )
  }
 
  level (level) {
    let _level = this.constructor.levels[level]
    if ( !_level ) _level = this.constructor.levels_number[level]
    if ( !_level ) throw new Error(`No level found "${level}"`)
    return this.level = _level
  }

  defineNullLevel( name ){
    `${name} () {}`
  }

  defineLevel( name ){
    `${name} () { this.log('${name}', ...args) }`
  }

}

Logger.init()



const winston_transports = []
winston_transports.push(new winston.transports.Console())

let winston_express_transports = []

switch ( process.env.NODE_ENV ) {
  case  'development':
    winston_express_transports = winston_transports
    break
  
  case 'test':
    let transport = new winston.transports.CircularBuffer({
      name: 'circular-buffer',
      level: 'info',
      json: true,
      size: 500
    })
    winston_express_transports.push(transport)  
    break
 
  default:
    let transport = new winston.transports.File({
      filename: path.join(config.get('path.logs'),'access.log')
    })
    winston_express_transports.push(transport)
}

//,new winston.transports.Redis({host:'localhost',port:6379,length:5000})

const expressLogger = expressWinston.logger({
  transports: winston_express_transports,
  meta: !(process.env.NODE_ENV == 'development'),
  msg: "HTTP {{res.statusCode}} {{req.method}} {{req.url}} {{res.responseTime}}",
  colorStatus: false
  //ignoreRoute: function (req, res) { return false; }
})


module.exports = ( tag, options = {} ) => {
  let _debug = debug(tag)
  let _logger = winston.loggers.get(tag)
  if (!_logger) {
    _logger = winston.loggers.add(tag, {
      transports: options.transports || winston_transports
    })
  }
  _logger.expressLogger = expressLogger
  return { debug: _debug, logger: _logger }
}

module.exports.expressLogger = expressLogger
module.exports.winstonLogger = winstonLogger
