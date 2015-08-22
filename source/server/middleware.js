function buildApplicationMiddleware(api) {

  var mw = {};

  function hello() {
    return function(request, response) {
      response.json({
        hello: api.hello(request.params.name)
      });
    };
  }

  mw.hello = hello;

  return mw;
}

module.exports = buildApplicationMiddleware;
