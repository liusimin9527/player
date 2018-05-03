var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var session = require('express-session');
var cookie = require('cookie-parser');
var bodyParser = require('body-parser');
var ejs = require('ejs');

var index = require('./routes/index');
var users = require('./routes/users');
var login = require('./routes/login');
var register = require('./routes/register');
var personal = require('./routes/person');
var singers = require('./routes/singer');
var player = require('./routes/player');
var chart = require('./routes/chart');
var forget = require('./routes/forget');

obj = {};   // 全局变量-存储歌曲

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html',ejs.__express);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookie());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/login', login);
app.use('/register', register);
app.use('/personal', personal);
app.use('/singerList', singers);
app.use('/player', player);
app.use('/chart', chart);
app.use('/forget', forget);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
