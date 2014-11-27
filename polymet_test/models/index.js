'use strict';

var mongoose = require('mongoose');

require('./Action');
require('./Device');
require('./Log');
require('./Module');
require('./User');
require('./Program');

module.exports = {
  'Action' : mongoose.model('Action'),
  'Device' : mongoose.model('Device'),
  'Log' : mongoose.model('Log'),
  'Module' : mongoose.model('Module'),
  'User' : mongoose.model('User'),
  'Program' : mongoose.model('Program')
}

