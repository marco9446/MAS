/** @module albums/router */
'use strict';

var express = require('express');
var router = express.Router();
var middleware =  require('./middleware');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var User = mongoose.model('User');
var path = require('path');

var passfilter = {"password": 0};
//allowed methods
router.all('/', middleware.supportedMethods('GET, POST'));

//get user with id
router.get('/byid/:userid', function(req, res, next) {

  User.findById(req.params.userid, passfilter).lean().exec(function(err, user){
    if (err) return next (err);

    if (!user) {
    	res.status(404);
    	res.json({message: "not found"});
    }

    res.json(user);
  });
});

//get user by name
router.get('/byname/:username', function(req, res, next) {
    User.find({name: req.params.username}, passfilter).lean().exec(function(err, user) {
        if (err) return next (err);

        if (!user) {
            res.status(404);
            res.json({message: "not found"});
        };

        res.json(user);
    })
});

//create new user
router.post('/', function(req, res, next) {
    console.log(req.body);
    var newUser = new User(req.body);
    newUser.save(onModelSave(res, 201, true));
});


//get all users

router.get('/', function(req, res, next) {
    User.find({}, passfilter).lean().exec(function(err, users) {
        if (err) return next (err);
        res.json(users);
    })
})

router.get('/logIn',function(req,res){
  console.log(req.body);
   res.redirect("/finished");
});
router.post('/logIn',function(req,res){
  console.log(req.body);
  if(req.body.username=="admin" && req.body.password=="admin"){
    console.log("redirect")

     res.redirect("/finished");
  }else{

  User.findOne({name:req.body.username},function(err,found){
      if(err || !found || found.password!=req.body.password ){
        res.redirect("/");
      }else{
         res.redirect("/finished");
      }

  });
}

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