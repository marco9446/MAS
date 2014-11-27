'use strict';

var mongoose = require('mongoose');

require('./Device');
require('./Log');
require('./Module');
require('./User');
require('./Program');

module.exports = {
  'Device' : mongoose.model('Device'),
  'Log' : mongoose.model('Log'),
  'Module' : mongoose.model('Module'),
  'User' : mongoose.model('User'),
  'Program' : mongoose.model('Program')
}

