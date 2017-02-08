/**
 * dependencies
 */

var Sails = require('sails').Sails;


/**
 * test definition
 */

describe('Smoke test ::', function () {

  // sails instance var
  var sails;

  // attempt to lift sails
  before(function (done) {

    // timeout at 10s
    this.timeout(10 * 1000);

    // instance and lift
    Sails().lift({

      // customize hooks
      hooks: {

        // skip grunt
        'grunt': false,

        // load this hook
        'httpsredirect': require('../')

      },

      // customize logging
      log: {

        // set log level to "only errors"
        level: "error"

      }

    }, function (err, server) {

      // handle error
      if (err) return done(err);

      // save sails instance
      sails = server;

      // execute success callback
      return done();

    });

  });

  // lower sails at the end
  after(function (done) {

    // lower if server exists
    sails ? sails.lower(done) : done();

  });

  // test that Sails can lift with the hook in place
  it ('sails does not crash', function () {

    return true;

  });

});
