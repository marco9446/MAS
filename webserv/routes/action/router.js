/** @module albums/router */
'use strict';

var express = require('express');
var router = express.Router();
var middleware =  require('../middleware');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var Action = mongoose.model('Action');

//allowed methods
router.all('/', middleware.supportedMethods('GET, POST'));

//get Action with id
router.get('/:actionid', function(req, res, next) {

  Action.findById(req.params.actionid).lean().exec(function(err, action){
    if (err) return next (err);

    if (!action) {
    	res.status(404);
    	res.json({message: "not found"});
    }

    res.json(action);
  });
});

//get all Actions
router.get('/', function(req, res, next) {

    Action.find({}).lean().exec(function(err, actions) {
        if (err) return next (err);

        res.json(actions);
    })
})

//create new Action
router.post('/', function(req, res, next) {
    var newAction = new Action(req.body);
    newAction.save(onModelSave(res, 201, true));
});

