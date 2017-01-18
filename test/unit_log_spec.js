const {Log} = require('../lib/log')
const expect = require('chai').expect


describe('Unit::Deployable::log::log', function(){

  describe('Log instance', function(){

    it('should be a Log', function(){
      expect( Log.name ).to.equal( 'Log' )
    })

    it('should have an init function', function(){
      expect( Log.init ).to.be.a('function')
    })

    it('should have a default pino instance', function(){
      expect( Log.logger ).to.be.ok
    })

    it('should have a level', function(){
      expect( Log.logger.level ).to.equal( 'info' )
    })

    it('should have a default winston express instance', function(){
      expect( Log.express ).to.be.ok
    })

    it('fetchs a logger and debug instance', function(){
      let me = Log.fetch('me')
      expect( me ).to.have.keys('logger', 'debug')
    })

    it('log entries are passed to stream', function(){
      let me = Log.fetch('me')
      me.logger.info('testa info')
      me.logger.level = 'debug'
      me.logger.debug('test debug')
      me.logger.level = 'trace'
      me.logger.trace('test trace')
      me.logger.info('test info2')
      me.logger.trace('test trace')
      let logdata = Log.testGetLastLog()
      expect( logdata ).to.contain.keys('msg','time','_logger','level')
      expect( logdata.msg ).to.equal( 'test trace' )
      expect( logdata.time ).to.be.a( 'number' )
      expect( logdata._logger ).to.equal( 'me' )
      expect( logdata.level ).to.equal( 10 )
    })

  })

})
