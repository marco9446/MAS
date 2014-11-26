var config = require('./config');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var dustjs = require('adaro');
var app = express();

// Connect to MongoDB here
var mongoose   = require('mongoose');
mongoose.connect(config.mongoUrl + config.mongoDbName);

// Register model definition here
//<!-- build:remove -->
require('./models');
//<!-- /build -->

// dustjs view engine setup
app.engine('dust', dustjs.dust());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'dust');

//configure app
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));    // parse application/x-www-form-urlencoded
app.use(bodyParser.json());    // parse application/json
app.use(express.static(path.join(__dirname, 'public')));

// Initialize routers here
//<!-- build:remove -->

var routers = require('./routes/routers');
// var index = require('./routes/index');
// app.use('/', index);
app.use('/action', routers.action);
app.use('/device', routers.device);
app.use('/log', routers.log);
app.use('/module', routers.module);
app.use('/program', routers.program);

module.exports = app;