'use strict';

var mongoose = require('mongoose');

require('./Device');
require('./Log');
require('./Module');
require('./User');
require('./Program');
require('./Design');
require('./Action');

module.exports = {
  'Device' : mongoose.model('Device'),
  'Log' : mongoose.model('Log'),
  'Module' : mongoose.model('Module'),
  'User' : mongoose.model('User'),
  'Program' : mongoose.model('Program'),
  'Design' : mongoose.model('Design'),
  'Action' : mongoose.model('Action')
}

