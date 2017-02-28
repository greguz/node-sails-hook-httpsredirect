/**
 * dependencies
 */

var http = require('http')

/**
 * hook specification
 *
 * @help http://sailsjs.org/documentation/concepts/extending-sails/hooks/hook-specification
 */

module.exports = function httpsredirect (sails) {

  // started HTTP server
  var server

  // return installable hook
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

        // port to listen
        port: undefined

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

    initialize: function (callback) {

      // handle undefined port
      if (typeof sails.config.httpsredirect.port !== 'number') {

        // on production env use port 80, on other env use default sails port
        sails.config.httpsredirect.port = sails.config.environment === 'production' ? 80 : 1337

      }

      // ensure configured HTTPS server (and enabled hook)
      if (!sails.config.ssl.key || !sails.config.ssl.cert || sails.config.httpsredirect.disabled) {

        // do not start any server
        return callback()

      }

      // handle same port configured for HTTP and HTTPS servers
      if (sails.config.httpsredirect.port === sails.config.port) {

        // stop server lift
        return callback(new Error('HTTP and HTTPS server have the same port configured'))

      }

      // handle errors
      try {

        // create web server
        server = http.createServer(function (req, res) {

          // base target (https protocol + hostname without port)
          var location = 'https://' + req.headers.host.replace(/:.+/, '')

          // add custom HTTPS port
          if (sails.config.port !== 443) location += ':' + sails.config.port

          // add current url
          location += req.url

          // send response header
          res.writeHead(301, { 'Location': location })

          // end request
          res.end()

        })

        // start listening
        server.listen(sails.config.httpsredirect.port, sails.config.httpsredirect.hostname, function (err) {

          // handle error
          if (err) return callback(err)

          // listen for lowering
          sails.once('lower', function () {

            // close HTTP server
            server.close()

          })

          // all done
          callback()

        })

      } catch (err) {

        // notify error
        callback(err)

      }

    }

  }

}
