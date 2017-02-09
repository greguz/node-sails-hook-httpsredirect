# sails-hook-httpsredirect

This [sails](http://sailsjs.com/) hook will start an HTTP server that will redirect all received requests to the HTTPS server lifted from sails.

If the HTTPS server is not configured, this module will not start any server.

## Installation

### NPM

Run `npm install --save sails-hook-httpsredirect`.

### Yarn

Run `yarn add sails-hook-httpsredirect`.

## Usage

Just install this module and lift your server.

## Configuration

### Parameters

| Parameter     | Type          | Default       | Description                                                                       |
| ------------- | ------------- | ------------- | --------------------------------------------------------------------------------- |
| disabled      | {Boolean}     | false         | if true, the HTTP server will not start                                           |
| hostname      | {String}      | '0.0.0.0'     | HTTP server accepted hostname, default all                                        |
| port          | {Number}      | 80 or 1337    | HTTP server port: by default port 80 on production and 1337 on other environments |

### Runtime

You can access the configuration from `sails.config.httpsredirect` var.

### File

You can customize the settings by creating **config/httpsredirect.js** file.

```javascript
/**
 * HTTP to HTTPS hook configuration
 */

module.exports.httpsredirect = {

  // listen only localhost requests
  hostname: '127.0.0.1',

  // from port 1234
  port: 1234

};
```
