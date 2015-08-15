var     express         = require('express')
    ,   path            = require('path')
    ,   favicon         = require('serve-favicon')
    ,   logger          = require('morgan')
    ,   cookieParser    = require('cookie-parser')
    ,   bodyParser      = require('body-parser')
    ,   debug           = require('debug')('game-app:boot');

debug("booting game-app");

// Select api, configure middleware, set up routes
var api = {};

debug("detecting api choice from process.env.API, variable is set to: %s");

switch (process.env.API) {
    default:
        api = require('./api/memory/api.js');
}

var middleware  = require('./middleware')(api);
var router      = require('./router')(middleware);

var app = express();

app.set('view engine', 'jade');
app.set('views', 'views');

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
