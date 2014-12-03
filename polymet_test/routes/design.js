var express = require('express');
var router = express.Router();
var middleware =  require('./middleware');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var Design = mongoose.model('Design');

//allowed methods
router.all('/', middleware.supportedMethods('GET, POST'));


//get all Project
router.get('/', function(req, res, next) {

    Design.find({}).lean().exec(function(err, projects) {
        if (err) return next (err);
        res.json(projects);
    })
});


router.post('/', function(req, res, next) {
    var newDesign = new Design(req.body);
    newDesign.save(onModelSave(res, 201, true));
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

