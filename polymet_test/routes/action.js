
var express = require('express');
var router = express.Router();
var middleware =  require('./middleware');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var Action = mongoose.model('Action');

router.all('/', middleware.supportedMethods('GET, POST'));


router.get('/', function(req, res, next) {
	Action.find({},function(err,found){

		if(!err && found){
			res.json(found).end();
		}else{
			res.status(404).end();
		}

	})

});

router.post("/",function(req,res,next){
	var action=new Action(req.body);
	action.save(function(err,saved){
		if(!err){
			res.json(saved._id).end();
		}else{
			res.status(404).end();
		}
	})

});

module.exports=router;