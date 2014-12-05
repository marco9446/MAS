var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var Device = mongoose.model('Device');
var Module = mongoose.model('Module');
var Log = mongoose.model('Log');
var ac = require('../routes/arduinoComunication');

function doRequest(method, url, data) {
	if (!method || !url)
		throw new Error("bad doRequest parameter");
	if (["GET", "POST", "PUT", "DELETE"].indexOf(method) == -1)
		throw new Error("bad method, not allowed bromeo")

	var request = new XMLHttpRequest();
	request.open(method, url, true);
	request.setRequestHeader("Accept","application/json");
	if (["PUT", "POST"].indexOf(method) > -1)
		request.setRequestHeader("Content-Type","application/json");

	var datastring = JSON.stringify(data);
	request.send(datastring);

	var returnval = request.onreadystatechange = function() {
		if (request.readyState == 4) {
			if (request.status == 200) {
				return(request.responseText);
			} else {
				//pretend to handle
			}
		}
  	};

  	return returnval;
};

//evaluate the IF condition
//takes a list of arguments, check each of them for AND
var condition = function condition(arg) {
	console.log("condition",arg)

	var passing = true;
	if (!(arg.constructor === Array)) {
		arg=[arg];
	} 
	for (var i = 0; i < arg.length; i++) {
		if (db[arg[i]] != true) {
			passing = false;
		}
	};

	return passing;

}

var action = function action(argument) {
	console.log("action",argument)
	//resolve device name
	Device.findById(argument).exec(function(err, device) {
		console.log(device,"admdMuasd")
		if (err) {
				throw new Error("no devices found! reboot or something");
			}
		if (device.type != "o") {
			throw new Error("runLoop: bad type of device:" + device._id);
		}
		var newstate = (device.state == "true") ? "false" : "true";
		console.log(device.state,newstate)
		saveAndSend({id:argument,status:newstate});
		

	});

	return true;
}



function saveAndSend(json) {
	console.log(json);
  Module.findOne({devices : json.id},function(err,found){
    if(found){
      Device.findOne({_id:json.id},function(err,found1){
      if(found1){
      var pin=found1.pin;

      var log= new Log();
     log.title="Change Device State.";
    log.msg="Name:"+found.name;
    log.save();
      ac.sendMessage(JSON.parse('{"ip":"' + found.ip + '","action":[{"'+ pin + '":"'+json.status+'"}]}'));
      found1.state=json.status;
      found1.save(function(err,saved){console.log(err,saved)});
      }});

    }
  });
}


module.exports.condition = condition;
module.exports.action = action;