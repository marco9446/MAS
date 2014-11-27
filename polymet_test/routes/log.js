/** @module albums/router */
'use strict';

var express = require('express');
var router = express.Router();
var middleware =  require('./middleware');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var Log = mongoose.model('Log');

//allowed methods
router.all('/', middleware.supportedMethods('GET, POST, DELETE'));

//get all logs
router.get('/', function(req, res, next) {

  Log.find({}).lean().exec(function(err, logs){
    if (err) return next (err);

    res.json(logs);
  });
});

//create new logs
router.post('/', function(req, res, next) {
    var newLog = new Log(req.body);
    newLog.save(onModelSave(res, 201, true));
});

//delete all logs
router.delete('/', function(req, res, next) {
	Log.collection.drop();
});


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