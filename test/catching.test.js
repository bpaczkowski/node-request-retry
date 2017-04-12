'use strict';

var request = require('../');
var t = require('chai').assert;

describe('Catching retry strategy errors', function () {
  it('should pass the caught error to callback', function (done) {
    request.get({
      url: 'http://www.filltext.com/?rows=1&err=400',
      maxTattempts: 3,
      retryStrategy: function (err, response, body) {
        if (err) {
          return true;
        }

        if (response.statusCode === 400) {
          throw Error('Received 400 code');
        }
      }
    }, function (err, response, body) {
      t.strictEqual(err.message, 'Received 400 code');
      t.strictEqual(response.statusCode, 400);
      t.strictEqual(response.attempts, 1);
      done();
    });
  });

  it('should work with promises', function (done) {
    request.get({
      url: 'http://www.filltext.com/?rows=1&err=400',
      maxTattempts: 3,
      retryStrategy: function (err, response, body) {
        if (err) {
          return true;
        }

        if (response.statusCode === 400) {
          throw Error('Received 400 code');
        }
      }
    })
    .catch(function (err) {
      t.strictEqual(err.message, 'Received 400 code');
      t.strictEqual(err.response.statusCode, 400);
      t.strictEqual(err.response.attempts, 1);
      done();
    });
  });
});

