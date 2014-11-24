/** @module albums/router */
'use strict';

var express = require('express');
var router = express.Router();
var middleware =  require('../middleware');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var Module = mongoose.model('Module');

//allowed methods
router.all('/', middleware.supportedMethods('GET, POST'));

//get module with id
router.get('/:moduleid', function(req, res, next) {

  Module.findById(req.params.moduleid).lean().exec(function(err, module){
    if (err) return next (err);

    if (!module) {
    	res.status(404);
    	res.json({message: "not found"});
    }

    res.json(module);
  });
});

//get all modules
router.get('/', function(req, res, next) {

    Module.find({}).lean().exec(function(err, modules) {
        if (err) return next (err);

        res.json(modules);
    })
})

//create new module
router.post('/', function(req, res, next) {
    var newModule = new Module(req.body);
    newModule.save(onModelSave(res, 201, true));
});

