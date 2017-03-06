// # Log

const debug = require('debug')('dply:log')
const pino = require('pino')
//const { Logger } = require('./logger')


// ## Class Log

class Log {

  static init() {

    // Attach the pino modules
    this.pino = pino

    // Attach the debug module
    this.debug = require('debug')

    // If we are test, setup differently
    ;( process.env.NODE_ENV === 'test' )
      ? this.setupTestStream()
      : this.setupStream()

    debug('logger', this.logger.name)
  }

  static get express () {
    if ( this._express ) return this._express
    return this._express = require('express-pino-logger')({logger: this.logger})
  }

  static fetch( name ) {
    let logger = this.logger.child({ _logger: name })
    let debug = require('debug')(name)
    return { logger, debug }
  }

  static setupStream(opts = {}){
    this.logstream = opts.logstream || process.stdout
    if (opts.name !== undefined) opts.name = 'default'
    this.name = opts.name
    return this.logger = pino(opts, this.logstream)
  }

  // Setup an in memory logger for test envs
  // Use multiple streams so errors can still be logged somewhere
  static setupTestStream( opts = {} ){

    // Set a size for the buffer
    if (!opts.logsize) opts.logsize = 50

    // Set a logger to use
    if (!opts.logger) opts.logger = (...args)=> console.error(`Error: %s`, ...args)

    // Option to log errors to logger, or not
    opts.logerror = (opts.logerror === undefined ) ? true : Boolean(opts.logerror)

    let RingBuffer = require('deployable-ringbuffer')
    this.logbuffer = new RingBuffer(opts.logsize)
    this.logstream = this.logbuffer.writeStream( ch => {
      if ( opts.logerror !== true ) return
      let o = JSON.parse(ch.toString())
      if (o.level && o.level >= 40 ) opts.logger(o.msg)
    })
    return this.logger = pino(opts, this.logstream)
  }

  // Pull the last log entry from buffer
  static testGetLastLog(){
    let log = this.logbuffer.last().toString()
    return JSON.parse(log)
  }

  // Pull all log entries from buffer
  static testGetAllLogs(){
    return this.logbuffer.toArray()
      .map(log => JSON.parse(log.toString()))
  }

  constructor( options = {} ){
    this.logstream = options.logstream || process.stdout
    this.debug =
    this.name = options.name
    this.logger = pino({ name: this.name })
  }

  fetch(name){
    let logger = this.logger.child({ _logger: name })
    let debug = this.debug(name)
    return { logger, debug }
  }

  express( options = {} ){
    if ( this.express ) return this.express
    let logger = options.logger || this.logger
    return this.express = require('express-pino-logger')({logger: logger})
  }

}

Log.init()

//module.exports = { Log, Logger }
module.exports = { Log }
