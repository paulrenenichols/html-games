var express = require('express');
var router = express.Router();
var debug = require('debug')('html-games:router');

function buildApplicationRouter(middleware) {

  debug('building routes');

  router.all('*', function(request, response, next) {
    debug('api router activity: ', request.path);
    next();
  });

  router.get('/hello', middleware.hello());

  router.get('/', function (request, response) {
    response.send('html-games server api');
  });

  return router;
}

module.exports = buildApplicationRouter;
