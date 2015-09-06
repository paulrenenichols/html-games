var $ = require('jquery');
var game = require('./bubble-shooter.game.js')();

var debug = require('./bubble-shooter.debug.js')('bubble-shooter:main');

debug('Inializing bubble shooter');

game.initialize();
