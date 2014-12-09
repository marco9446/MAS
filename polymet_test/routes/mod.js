/** @module albums/router */
'use strict';

var express = require('express');
var router = express.Router();
var middleware =  require('./middleware');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var Module = mongoose.model('Module');
var Device = mongoose.model('Device');
var Log = mongoose.model('Log');
var Design = mongoose.model('Design');
var library = require('./../compiler/library.js');

var arduino = require("./arduinoComunication");


//allowed methods
router.all('/', middleware.supportedMethods('GET, POST'));

//get module with id
router.get('/:moduleid', function(req, res, next) {

  Module.findById(req.params.moduleid).lean().exec(function(err, mod){
    if (err) return next (err);

    if (!mod) {
    	res.status(404);
    	res.json({message: "not found"});
    }

    res.json(mod);
  });
});

//get all modules
router.get('/', function(req, res, next) {

    Module.find({}).populate("devices").exec(function(err, modules) {
        if (err) return next (err);
        res.json(modules);
    })
});

//get module with device
router.get('/bydevice/:deviceid', function(req, res, next) {

    Module.find({devices: req.params.deviceid}).lean().exec(function(err, modules) {
        if (err) return next(err);

        res.json(modules);
    })
});

//create new module
router.post('/', function(req, res, next) {
    var newModule = new Module(req.body);
    newModule.save(onModelSave(res, 201, true));

});


function saveAndSend(json) {
  Module.findOne({devices : json.id},function(err,found){
    if(found){
      Device.findOne({_id:json.id},function(err,found1){
      if(found1){
      var pin=found1.pin;

      var log= new Log();
     log.title="Change Device State.";
    log.msg="Name:"+found.name;
    log.save();
      arduino.sendMessage(JSON.parse('{"ip":"' + found.ip + '","action":[{"'+ pin + '":"'+json.status+'"}]}'));
      found1.state=json.status;
      found1.save(function(err,saved){console.log(err,saved)});
      }});

    }
  });
}

function sendRequestTo(design){
  var i=0;
  var db={};
  function loop(){
        console.log(design.sensors);
        if(i<design.sensors.length){
          Device.findOne({_id:design.sensors[i]},function(err1,found){
            console.log(err1,found,"asdjaslkjdlkas")
            if(!err1){
                db[found._id]=found.state=="true"?true:false;
                i++;
                loop();
            }
          })

        }else{
          console.log(db,"db");
          var func=Function("db","library",design.program);
          func(db,library);
        }
      }
      loop(); 
}


arduino.actionLinstener.push(function(msg){

  console.log(msg);
  Design.find({sensors:msg._id},function(err,found){
    if(found){
    for(var lala=0;lala<found.length;lala++){
      sendRequestTo(found[lala]);
      

    }
  }
  })
});

router.post('/send', function(req, res, next) {
    console.log(req.body.status+"asdasdjhaskjdhaskjdhakjsdhakjshd");
    saveAndSend(req.body);
    res.status(200).end();
});

router.post('/sendByName', function(req, res, next) {
    console.log(req.body.state+"asdasdasdasdasdasdasdas");
    Device.find({name:req.body.name},function(err,found){
      if(!err && found){
         for(var i=0;i<found.length;i++){
            console.log(found[i])
            if(found[i].type.indexOf("o")!=-1){
              console.log({id:found[i]._id,status:req.body.status})
               saveAndSend({id:found[i]._id,status:req.body.status});
            }
           
          }
         res.status(200).end();
      }else{
        res.status(404).end();
      }
    });
});


router.put('/:deviceid', function(req, res, next) {
    Module.findOne({_id:req.params.deviceid}).exec(function(err, module) {
        if (err) return next(err);

        if (module) {
            console.log(module);
            if (req.body.name) {
                module.name = req.body.name;
            }
            module.save(onModelSave(res));
        }else{
            res.json({
                statusCode: 404,
                message: "no device found"
            });
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