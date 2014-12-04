var express = require('express');
var router = express.Router();
var middleware =  require('./middleware');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var Design = mongoose.model('Design');
var Program= mongoose.model('Program')

//allowed methods
router.all('/', middleware.supportedMethods('GET, POST',"DELETE"));


//get all Project
router.get('/', function(req, res, next) {

    Design.find({}).lean().exec(function(err, projects) {
        if (err) return next (err);
        res.json(projects);
    })
});

//add new Design
router.post('/', function(req, res, next) {
    var newDesign = new Design(req.body);
    newDesign.save(onModelSave(res, 201, true));
});


router.post('/:paramID',function(req,res,next){
  Design.findOne({_id:req.params.paramID},function(err,found){
    if(!err && found){
      if(req.body.name){
        found.name=req.body.name;
      }
      if(req.body.program){
        found.program=req.body.program;
      }
      if(req.body.code){
        found.code=req.body.code;
      }
      found.save(function(err,saved){if(!err){res.status(200).end()}else{res.status(404).end()}});

    }else{
      res.status(404).end();
    }
  });
});


//delete design and the program associated.
router.delete('/:paramID', function(req, res, next) {
    Design.findOne({_id: req.params.paramID},function(err,found){
      if(!err && found){
          Program.remove({ _id: found.program},function(){});
          Design.remove({ _id: req.params.paramID }, function(err) {
          if (err) {
                  res.status(404).end();
          }
          else {
                 res.status(200).end();
          }
          });
        }
    });
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

