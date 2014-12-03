var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
var session = require('express-session')



var mongoose = require('mongoose');

mongoose.connect("mongodb://localhost/" + "HOMEAUTO");


require('./models');


// var indexRouter = require('./routes/index');
var usersRouter = require('./routes/user');
var deviceRouter = require('./routes/device');
var logRouter = require('./routes/log');
var modRouter = require('./routes/mod');
var designRouter = require('./routes/Design');



var programRouter = require('./routes/program');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
 secret: '1234567890QWERTY'
}))


// app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/device', deviceRouter);
app.use('/log', logRouter);
app.use('/mod', modRouter);
app.use('/program', programRouter);
app.use('/Design',designRouter);

app.get("/",function(req,res){
    res.sendFile(path.join(__dirname,"/public/finished/Login-page.html"));

})


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
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});




module.exports = app;
