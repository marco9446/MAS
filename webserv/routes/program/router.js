/** @module albums/router */
'use strict';

var express = require('express');
var router = express.Router();
var middleware =  require('../middleware');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var Program = mongoose.model('Program');

//allowed methods
router.all('/', middleware.supportedMethods('GET, POST'));

//get program with id
router.get('/:programid', function(req, res, next) {

  Program.findById(req.params.userid).lean().exec(function(err, program){
    if (err) return next (err);

    if (!program) {
    	res.status(404);
    	res.json({message: "not found"});
    }

    res.json(program);
  });
});

//get all programs
router.get('/', function(req, res, next) {

    Program.find({}).lean().exec(function(err, programs) {
        if (err) return next (err);

        res.json(programs);
    })
})

//create new program
router.post('/', function(req, res, next) {
    var newProgram = new Program(req.body);
    newProgram.save(onModelSave(res, 201, true));
});

