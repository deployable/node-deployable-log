// # Log
const stream = require('stream')
const debug = require('debug')('dply:log')
const RingBuffer = require('deployable-ringbuffer')

//const { Logger } = require('./logger')


class Log {

  static init() {

    // Attach a debug instance
    this.debug = require('debug')

    // If we are test, setup differently
    this.logstream = ( process.env.NODE_ENV === 'test' )
      ? this.testSetupStream()
      : process.stdout

    this.logger = require('pino')({}, this.logstream)
  }

  static testGetLastLog(){
    let log = this.logbuffer.last().toString()
    return JSON.parse(log)
  }

  static testSetupStream(){
    this.logbuffer = new RingBuffer(100)
    this.logstream = this.logbuffer.writeStream()
    return this.logstream
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

}

Log.init()

//module.exports = { Log, Logger }
module.exports = { Log }
