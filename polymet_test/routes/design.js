var express = require('express');
var router = express.Router();
var middleware =  require('./middleware');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var Design = mongoose.model('Design');
var Program= mongoose.model('Program')
var Device=mongoose.model('Device')
var compiler = require('./../compiler/compiler.js');
var library = require('./../compiler/library.js');



//allowed methods
router.all('/', middleware.supportedMethods('GET, POST',"DELETE","PUT"));


//get all Project
router.get('/', function(req, res, next) {

    Design.find({}).lean().exec(function(err, projects) {
        if (err) return next (err);
        res.json(projects);
    })
});

router.get('/:paramID', function(req, res, next) {

    Design.findOne({_id:req.params.paramID}).lean().exec(function(err, projects) {
        if (err) return next (err);
        res.json(projects);
    })
});

//add new Design
router.post('/', function(req, res, next) {

    

    var newDesign = new Design();
    newDesign.name=JSON.parse(Object.keys(req.body)[0]).name
    newDesign.code=JSON.parse(JSON.parse(Object.keys(req.body)[0]).code);
    newDesign.save(onModelSave(res, 201, true));
});


router.put('/:paramID',function(req,res,next){
   var context=req.body;
  Design.findOne({_id:req.params.paramID},function(err,found){
    if(!err && found){
      if(context.name){
        found.name=JSON.parse(context.name);
      }
      if(context.program){
        found.program=JSON.parse(context.program);
      }
      if(context.code!=undefined){

        found.code=JSON.parse(context.code);
        var compiled = compiler(found.code);
        found.program=compiled.code;
        found.sensors=compiled.sensors;  
      }
      if(context.active!=undefined){
         found.active=context.active;
      }
      found.save(function(err,saved){if(!err){res.status(200).end()}else{res.status(404).end()}});

    }else{
      res.status(404).end();
    }
  });
});

router.get('/run/:id',function(req,res,next){

   Design.findById(req.params.id).lean().exec(function(err, design){
    if(!err && design){
      var i=0;
      var db={};
      function loop(){
        if(i<design.sensors.length){
          Device.findOne({_id:design.sensors[i]},function(err1,found){
            if(!err1){
                db[found._id]=found.state=="true"?true:false;
                i++;
                loop();
            }
          })

        }else{
          var func=Function("db","library",design.program);
          func(db,library);
        }
      }
      loop();      
    }
   });
   res.status(200).end();

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

