const Log = require('../')
const expect = require('chai').expect

describe('Unit::Deployable::log::package', function(){

  describe('Log instance', function(){

    it('should be a Log', function(){
      expect( Log.name ).to.equal( 'Log' )
    })

    it('should have an init function', function(){
      expect( Log.init ).to.be.a('function')
    })

  })

})
