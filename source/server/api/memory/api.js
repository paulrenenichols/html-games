

function memmoryApi() {

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

module.exports = memmoryApi;
