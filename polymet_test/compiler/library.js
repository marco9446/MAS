var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var Device = mongoose.model('Device');
var Module = mongoose.model('Module');
var ac = require('./../routes/arduinoCommunication');

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
var condition = function condition(arguments) {
	var runningQueries = 0;
	var passing = true;
	for (var i = 0; i < arguments.length; i++) {
		++runningQueries;
		//resolve sensor into pin and device name
		Device.findById(arguments[i]._id).exec(function(err, device) {
			if (err) {
				throw new Error("no devices found! reboot or something");
			}
			--runningQueries;
			if (device.type != "input") {
				throw new Error("runLoop: bad type of device:" + device._id);
			}
			if (device.state != "true") {
				passing = false;
			}

		});
	};

	//I didn't want to write this, but javascript and mongo forced me to
	while(1) {
		if (runningQueries === 0) {
			return passing;
		}
	}
	return true;
}

var action = function action(argument) {
	//resolve device name
	Device.findById(argument._id).exec(function(err, device) {
		if (device.type != "output") {
			throw new Error("runLoop: bad type of device:" + device._id);
		}
		var newstate = (device.state == "true") ? "false" : "true";
		Module.find({devices: req.params.deviceid}).exec(function(err, modules) {
			for (var i = 0; i < modules.length; i++) {
				var msg = {ip: modules[i].ip, action : []};
				msg.action[device.pin] = newstate;
				ac.sendMessage(msg);
			};
		});

	});

	return true;
}

module.exports.condition = condition;
module.exports.action = action;