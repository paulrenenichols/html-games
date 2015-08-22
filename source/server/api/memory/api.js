var debug = require('debug')('html-games:memory-api');

function memoryApi() {

  debug('building memory api');

  var api = {};

  function hello (name) {
    var greeting = "Hello";
    if (name) {
      greeting += ", " + name;
    }
    return greeting;
  }

  api.hello = hello;

  return api;
}

module.exports = memoryApi;
