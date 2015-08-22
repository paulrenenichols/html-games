function buildApplicationMiddleware(api) {

  var mw = {};

  function hello(request, response) {
    response.json({
      hello: api.hello(request.query.name)
    });
  }

  mw.hello = hello;

  return mw;
}

module.exports = buildApplicationMiddleware;
