var query={};

var express = require('express');
var router = express.Router();
var middleware =  require('./middleware');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var Module = mongoose.model('Module');
var Device = mongoose.model('Device');
var Log = mongoose.model('Log');



//######################################## ____ Module Method ____#####################################


query.getByNetId= function (netID,callback){

	Module.findOne({netID:netID},function(err,found){callback(err,found)});
}



//the json should be{key:keyTosearch,value:valToCompare}
query.getOneModuleBy= function (json,callback){

	Module.findOne(json,function(err,found){callback(err,found)});
}

query.getOneModuleByIp= function (ip,callback){

	Module.findOne({ip:ip},function(err,found){callback(err,found)});
}


query.addNewModule = function(json,callback){

	var myNewModule=new Module();
	myNewModule.type = json.type;
	myNewModule.netID = json.netID;
	myNewModule.ip = json.ip;
	myNewModule.save(function(err, saved){
		callback(err,saved);
	});
	var log= new Log();
	log.msg="New Module Added. Type: "+json.type+";"
	log.save();


} 


//Push device in the devices field of Module
query.pushDevices=function(json,moduleID,callback){

	Module.findOne({_id:moduleID},function(err,found){
	if(found){
	//search the module and in the callback do the stuff below
		
		found.devices.push(json.id);
		found.markModified("devices");
		found.save(function(err,upp){console.log("pushed",err,upp,found);callback(err,found)});
	}else{

		console.log("_id ",moduleID," not found")
	}
});
}


//Change the ip of some 
//TODO modules must be replace wuith Id module
query.changeIp=function(json,moduleID,callback){
	//TODO search the module and in the callback do the stuff below
	Module.findOne({_id:moduleID},function(err,found){
	if(found){
		found.ip=json.ip;
		found.markModified("ip");
		found.save(function(err,saved){callback(err,saved)});
	}else{
		console.log("_id ",moduleID," not found")
	}
	});
}



//######################################## ____Device Method ____#####################################

query.addNewDevice=function(json,callback){

	var myNewModule=new Device();
	myNewModule.name  = json.pin;
	myNewModule.pin   = json.pin;
	myNewModule.type  = json.type;
	myNewModule.state = json.state;
	myNewModule.save(function(err,saved){
			callback(err,saved);
	});
	var log= new Log();
		log.msg="New Device Added. Name:"+myNewModule.name +"; Pinout: "+json.type+";"
		log.save();

}

//TODO id could be a id nont a json
query.getDevice=function(json,callback){

	Device.findOne({_id:json.id},function(err,dev){callback(err,dev);})

}

query.getOneDeviceFromArrayPin= function(arr,pin,callback){
	Device.findOne({_id:{$in:arr},pin:pin},function(err,found){callback(err,found)});
}


query.updateDevieState = function(id,newState,callback){
	


	query.getDevice({id:id},function(err,found){
		found.state=newState;
		var log= new Log();
		log.msg="Update Device State. Name:"+found.name;
		log.save();
		found.markModified("state");
		found.save(function(err,saved){callback(err,saved)});
	});
	

} 

module.exports = query;