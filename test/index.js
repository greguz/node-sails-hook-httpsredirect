/**
 * dependencies
 */

var Sails = require('sails').Sails
var path = require('path')
var fs = require('fs')
var chai = require('chai')
var expect = chai.expect
var request = require('request')

/**
 * fix "self-signed" cert error
 */

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0

/**
 * test definition
 */

describe('HTTP-to-HTTPS Sails hook', function () {

  // server instance
  var sails

  // runs before each test in this block
  beforeEach(function () {

    // create a new sails instance
    sails = new Sails()

  })

  /**
   * lift a new sails server
   *
   * @param {Object} [config]
   * @param {Number} [config.port]            server port
   * @param {Number} [config.explicitHost]    server explicit host
   * @param {Boolean} [config.ssl]            enable HTTPS
   * @param {Object} [config.httpsredirect]   hook configuration
   * @param {Function} done
   */

  function lift (config, done) {

    // ensure config object
    config = config || {}

    // customize hooks
    config.hooks = {

      // skip grunt
      'grunt': false,

      // load this hook
      'httpsredirect': require('../')

    }

    // customize logging
    config.log = {

      // disable all logs
      level: 'silent'

    }

    // add HTTPS configuration
    config.ssl = config.ssl !== true ? undefined : {
      cert: fs.readFileSync(path.join(__dirname, '..', 'ssl', 'cert.pem'), { encoding: 'utf8' }),
      key: fs.readFileSync(path.join(__dirname, '..', 'ssl', 'key.pem'), { encoding: 'utf8' })
    }

    // lift sails
    sails.lift(config, done)

  }

  // runs after each test in this block
  afterEach(function (done) {

    // lower sails
    sails.lower(done)

  })

  // hook's smoke test
  it('should start', function (done) {

    // lift sails
    lift(null, done)

  })

  // basic redirect test
  it('should throw "same port" error', function (done) {

    // lift a new server
    lift({
      port: 1234,
      ssl: true,
      httpsredirect: {
        port: 1234
      }
    }, function (err) {

      // check resulting error
      expect(err).to.be.instanceof(Error)

      // all done
      done()

    })

  })

  // basic redirect test
  it('should redirect from HTTP to HTTPS', function (done) {

    // add more time
    this.timeout(5000)

    // lift a new server
    lift({
      ssl: true,
      port: 1234,
      httpsredirect: {
        port: 1357
      }
    }, function (err) {

      // handle error
      if (err) return done(err)

      // execute request to HTTP server
      request.get('http://127.0.0.1:1357', function (err, res) {

        // handle error
        if (err) return done(err)

        // check target redirect
        expect(res.request.uri.href).to.match(/^https:\/\/127.0.0.1:1234/)

        // all done
        done()

      })

    })

  })

  // basic redirect test
  it('should redirect to actual page', function (done) {

    // add more time
    this.timeout(5000)

    // lift a new server
    lift({
      ssl: true,
      port: 1234,
      httpsredirect: {
        port: 1357
      }
    }, function (err) {

      // handle error
      if (err) return done(err)

      // execute request to HTTP server
      request.get('http://127.0.0.1:1357/some/page/#here', function (err, res, body) {

        // handle error
        if (err) return done(err)

        // check target redirect
        expect(res.request.uri.href).to.match(/^https:\/\/127.0.0.1:1234\/some\/page/)

        // all done
        done()

      })

    })

  })

})
