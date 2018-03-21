// # Log

const debugr = require('debug')
const debug = debugr('dply:log:Log')
const pino = require('pino')
//const { Logger } = require('./logger')
const noop = function (){}

// ## Class Log

class Log {

  static _classInit() {

    // Attach the pino module
    this.pino = pino

    // Attach the debug module
    this.debug = require('debug')

    // If we are test, setup differently
    ;( process.env.NODE_ENV === 'test' )
      ? this.setupTestStream()
      : this.setupStream()
  }

  static get express () {
    if ( this._express ) return this._express
    return this._express = require('express-pino-logger')({logger: this.logger})
  }

  static fetch( label ) {
    let logger = this.logger.child({ _logger: label })

    // Use noop if no `DEBUG` is set. The debug module took this out
    let their_debug = (process.env.DEBUG) ? debugr(label) : noop

    debug('setup logger and debug for "%s"', label)
    return { logger, debug: their_debug }
  }

  static setupStream( opts = {} ){
    this.logstream = opts.logstream || process.stdout
    if ( opts.label !== undefined ) opts.label = 'default'
    this.label = opts.label
    return this.logger = pino(opts, this.logstream)
  }

  // Setup an in memory logger for test envs
  // Patch the stream so errors can still be logged somewhere
  static setupTestStream( opts = {} ){

    // Set a size for the buffer
    if (!opts.logsize) opts.logsize = 50

    // Set a logger to use
    if (!opts.logger) opts.logger = (...args)=> console.error(`Error: %s`, ...args)

    // Option to log errors to logger, or not
    opts.logerror = (opts.logerror === undefined ) ? true : Boolean(opts.logerror)

    let RingBuffer = require('@deployable/ringbuffer')
    this.logbuffer = new RingBuffer(opts.logsize)
    this.logstream = this.logbuffer.writeStream( ch => {
      if ( opts.logerror !== true ) return
      let o = JSON.parse(ch.toString())
      if ( o.level && o.level >= 40 ) opts.logger(o.msg)
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
    this.label = options.label
    this.logger = pino({ name: this.label })
  }

  fetch(label){
    let logger = this.logger.child({ _logger: label })
    let debug = this.debug(label)
    return { logger, debug }
  }

  express( options = {} ){
    if ( this.express ) return this.express
    let logger = options.logger || this.logger
    return this.express = require('express-pino-logger')({logger: logger})
  }

}

Log._classInit()

//module.exports = { Log, Logger }
module.exports = { Log }
