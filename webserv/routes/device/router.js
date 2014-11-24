/** @module albums/router */
'use strict';

var express = require('express');
var router = express.Router();
var middleware =  require('../middleware');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var Device = mongoose.model('Device');

//allowed methods
router.all('/', middleware.supportedMethods('GET, POST'));

//get device with id
router.get('/:deviceid', function(req, res, next) {

  Device.findById(req.params.deviceid).lean().exec(function(err, device){
    if (err) return next (err);

    if (!device) {
    	res.status(404);
    	res.json({message: "not found"});
    }

    res.json(device);
  });
});

//create new device
router.post('/', function(req, res, next) {
    var newDevice = new Device(req.body);
    newDevice.save(onModelSave(res, 201, true));
});
