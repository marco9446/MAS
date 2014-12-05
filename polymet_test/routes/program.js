/** @module albums/router */
'use strict';

var express = require('express');
var router = express.Router();
var middleware =  require('./middleware');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var Program = mongoose.model('Program');
var compiler = require('./../compiler/compiler.js');
var library = require('./../compiler/library.js');


//allowed methods
router.all('/', middleware.supportedMethods('GET, POST'));

//get program with id
router.get('/:programid', function(req, res, next) {

  Program.findById(req.params.programid).lean().exec(function(err, program){
    if (err) return next (err);

    if (!program) {
    	res.status(404);
    	res.json({message: "not found"});
    }else{res.json(program);}

    
  });
});

//get all programs
router.get('/', function(req, res, next) {

    Program.find({}).lean().exec(function(err, programs) {
        if (err) return next (err);

        res.json(programs);
    })
});

//create new program
router.post('/', function(req, res, next) {
    var compiled = compiler(JSON.parse(req.body.code));
    var newProgram = new Program({name:req.body.name, code: compiled.code, sensors: compiled.sensors});
    newProgram.save(function(err){console.log(err)});
});



router.get('/run/:id',function(req,res,next){

   Program.findById(req.params.id).lean().exec(function(err, program){
    if(!err && program){

    
      var func=Function("library",program.code);
      func(library);
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
        //return next(err);
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