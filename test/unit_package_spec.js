const Log = require('../')
const expect = require('chai').expect

describe('Unit::Deployable::log::package', function(){

  describe('Log instance', function(){

    it('should be a Log', function(){
      expect( Log.name ).to.equal( 'Log' )
    })

    it('should have pino attached', function(){
      expect( Log.pino ).to.be.a('function')
    })

    it('should have debug attached', function(){
      expect( Log.debug ).to.be.a('function')
    })

  })

})
