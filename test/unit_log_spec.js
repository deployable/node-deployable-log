const {Log} = require('../lib/log')
const expect = require('chai').expect
const debug = require('debug')('dply:test:unit:log')

describe('Unit::Deployable::log::log', function(){

  describe('Log instance', function(){

    it('should be a Log', function(){
      expect( Log.name ).to.equal( 'Log' )
    })

    it('should have an init function', function(){
      expect( Log._classInit ).to.be.a('function')
    })

    it('should have a default pino instance', function(){
      expect( Log.logger ).to.be.ok
    })

    xit('should have a level', function(){
      expect( Log.logger.level ).to.equal( 'info' )
    })

    it('should have a default express instance attached', function(){
      expect( Log.express ).to.be.ok
    })

    it('fetchs a logger and debug instance', function(){
      let me = Log.fetch('me')
      expect( me ).to.have.keys('logger', 'debug')
    })

    it('log entries are passed to stream', function(){
      let melog = Log.fetch('me')
      melog.logger.info('testa info')
      melog.logger.level = 'debug'
      melog.logger.debug('test debug')
      melog.logger.level = 'trace'
      melog.logger.trace('test trace')
      melog.logger.info('test info2')
      melog.logger.trace('test trace')
      let logdata = Log.testGetLastLog()
      expect( logdata ).to.contain.keys( 'msg','time','_logger','level' )
      debug('logdata', logdata)
      expect( logdata.msg ).to.equal( 'test trace' )
      expect( logdata.time ).to.be.a( 'number' )
      expect( logdata._logger ).to.equal( 'me' )
      expect( logdata.level ).to.equal( 10 )
    })

    // This needs the horrible stdout/stderr capture trick
    it('should log to stderr still under TEST', function(){
      let me = Log.fetch('me')
      me.logger.error('testa error')
      let logdata = Log.testGetLastLog()
      expect( logdata.msg ).to.equal( 'testa error' )
    })

  })

})
