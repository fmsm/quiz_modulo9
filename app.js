var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var methodOverride = require('method-override');
var session = require('express-session');

var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//¿instalar middleware partials?
app.use(partials());

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser('Quiz 2015'));
app.use(session());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

//Helpers dinámicos
app.use(function(req, res, next) {
  //guarda path en session.redir para despues de hacer login
  if (!req.path.match(/\/login|\/logout/)) {
    req.session.redir = req.path;
  }
  //hacer visible req.session en las vistas
  res.locals.session = req.session;
  next();
}); 

//Middleware para auto-logout tras 2 minutos
app.use(function(req, res, next) {
  //Se usa una variable req.session.hora, en la que esta almacenanda la hora en la que se hizo la ultima 
  //transaccion, esta variable se inicializa en session_controller cuando se hace login y se crea la session
  //- comprobar si han pasado mas de dos minutos
  //  - >2 minutos --> render la vista index, con un mensaje informando de que la sesion ha expirado
  //  - <2 minutos --> actualiza hora
  //- pasar control a sgte middleware
  if (req.session.user) {    
    if (Date.now() - req.session.hora > 1200000) { //temporal-->volver a cambiar esto a 120000
      delete req.session.hora;
      //res.redirect('/logout');
      delete req.session.user;
      res.render('index', { title: 'Quiz', errors: [{'message': 'Sesion expirada.'}] });
    } else {
      req.session.hora = Date.now();      
    }//if..else    
  }//if (req.session.user)   
  next();  
});

app.use('/', routes);

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
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
	    errors: []
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        errors: []
    });
});


module.exports = app;
