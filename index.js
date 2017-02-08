/**
 * dependencies
 */

var http = require('http');


/**
 * hook specification
 *
 * @help http://sailsjs.org/documentation/concepts/extending-sails/hooks/hook-specification
 */

module.exports = function httpsredirect (sails) {

  return {


    /**
     * The defaults feature can be implemented either as an object or a function which
     * takes a single argument and returns an object.
     * The object you specify will be used to provide default configuration values for Sails.
     *
     * @help http://sailsjs.org/documentation/concepts/extending-sails/hooks/hook-specification/defaults
     */

    defaults: {

      httpsredirect: {

        // disable HTTPS redirect
        disabled: false,

        // listen for all connected hostname
        hostname: '0.0.0.0',

        // port to listen (default sails.js port)
        port: 1337

      }

    },


    /**
     * The initialize feature allows a hook to perform startup tasks
     * that may be asynchronous or rely on other hooks.
     * All Sails configuration is guaranteed to be completed
     * before a hook’s initialize function runs.
     *
     * @help http://sailsjs.org/documentation/concepts/extending-sails/hooks/hook-specification/initialize
     */

    initialize: function(callback) {

      // ensure configured HTTPS server (and enabled hook)
      if (!sails.config.ssl.key || !sails.config.ssl.cert || sails.config.httpsredirect.disabled) return callback();

      // handle same port configured for HTTP and HTTPS servers
      if (sails.config.httpsredirect.port === sails.config.port) return callback(new Error('HTTP and HTTPS server have same port configured'));

      // handle errors
      try {

        // create web server
        var server = http.createServer(function (req, res) {

          // base target (https protocol + hostname without port)
          var location = "https://" + req.headers.host.replace(/:.+/, '');

          // add custom HTTPS port
          if (sails.config.port !== 443) location += ':' + sails.config.port;

          // add current url
          location += req.url;

          // send response header
          res.writeHead(301, { 'Location': location });

          // end request
          res.end();

        });

        // start listening
        server.listen(sails.config.httpsredirect.port, sails.config.httpsredirect.hostname);

        // all done
        callback();

      }

      // catch server creation error
      catch (err) {

        // notify error
        callback(err);

      }

    }


  };

};
