global.chai = require('chai')
global.sinon = require('sinon')
global.expect = require('chai').expect

if (!process.env.NODE_ENV) process.env.NODE_ENV = 'test'
