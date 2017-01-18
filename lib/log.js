// # Log
const stream = require('stream')
const debug = require('debug')('dply:log')
const RingBuffer = require('deployable-ringbuffer')

//const { Logger } = require('./logger')


class Log {

  static init() {

    // Attach the pino module
    this.pino = require('pino')

    // Attach a debug instance
    this.debug = require('debug')

    // If we are test, setup differently
    this.logstream = ( process.env.NODE_ENV === 'test' )
      ? this.testSetupStream()
      : process.stdout

    this.logger = this.pino({}, this.logstream)
  }

  static express() {
    if ( this.express ) return this.express
    return this.express = require('express-pino-logger')()
  }

  static fetch( name ) {
    let logger = this.logger.child({ _logger: name })
    let debug = this.debug(name)
    return { logger, debug }
  }

  // Setup an in memory logger for test envs
  static testSetupStream( n = 50, options = {} ){
    this.logbuffer = new RingBuffer(n)
    this.logstream = this.logbuffer.writeStream()
    return this.logstream
  }

  // Pull the last log entry from buffer
  static testGetLastLog(){
    let log = this.logbuffer.last().toString()
    return JSON.parse(log)
  }

}

Log.init()

//module.exports = { Log, Logger }
module.exports = { Log }
