/** @module albums/router */
'use strict';

var express = require('express');
var router = express.Router();
var middleware =  require('./middleware');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var Device = mongoose.model('Device');

//allowed methods
router.all('/', middleware.supportedMethods('GET, POST, PUT'));

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


//get all devices
router.get('/', function( req, res, next) {

    Device.find({}).lean().exec(function(err, devices) {
        if (err) return next (err);

        res.json(devices);
    })
});

//update device

router.put('/:deviceid', function(req, res, next) {
    Device.findOne({_id:req.params.deviceid}).exec(function(err, device) {
        if (err) return next (err);

        if (device) {
          console.log(device);
            if (req.body.name) {
                device.name = req.body.name;
            }
            if (req.body.state) {
                device.state = req.body.state;
            }
            if (req.body.position) {
                device.position = req.body.position;
            }

            device.save(onModelSave(res));
        }
    });
})

function onModelSave(res, status, sendItAsResponse){
  var statusCode = status || 204;
  var sendItAsResponse = sendItAsResponse || false;
  return function(err, saved){
    if (err) {
      if (err.name === 'ValidationError' 
        || err.name === 'TypeError' ) {
        res.status(400)
        return res.json({
          statusCode: 400,
          message: "Bad Request"
        });
      }else{
        return next (err);
      }
    }
    if( sendItAsResponse){
      var obj = saved.toObject();
      delete obj.password;
      delete obj.__v;
      res.status(statusCode)
      return res.json(obj);
    }else{
      return res.status(statusCode).end();
    }
  }
};

module.exports = router;