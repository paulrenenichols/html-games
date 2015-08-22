var     express         = require('express')
    ,   path            = require('path')
    ,   favicon         = require('serve-favicon')
    ,   logger          = require('morgan')
    ,   cookieParser    = require('cookie-parser')
    ,   bodyParser      = require('body-parser')
    ,   livereload      = require('express-livereload')
    ,   debug           = require('debug')('html-games:express:app');


// Select api, configure middleware, set up routes
var api = {};

debug("detecting api choice from process.env.API, variable is set to: %s", process.env.API);

var apiChoice = process.env.API ? process.env.API : 'memory';

switch (apiChoice) {
    case 'memory':
        api = require('./api/memory/api.js')();
        break;
    default:
        api = require('./api/memory/api.js')();
}

debug('api.hello? %s', !!api.hello);

var middleware  = require('./middleware')(api);
var router      = require('./router')(middleware);

var app = express();

debug("app.get('env')", app.get('env'));

app.use(require('connect-livereload')({
  port: 35729
}));

app.set('view engine', 'jade');
app.set('views', 'views');

app.set('port', process.env.PORT || 3000);

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', router);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500).json({
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500).json({
        message: err.message,
        error: {}
    });
});


module.exports = app;
