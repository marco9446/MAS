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
function condition(arguments) {
	for (var i = 0; i < arguments.length; i++) {
		//resolve sensor into pin and device name
		var device = doRequest("GET", "/device/" + arguments[i]._id, {});
		//check database for validity
		if (device.type != "input") {
			throw new Error("bad type of device:" device._id);
		};
		//return false or continue
		if (device.state != "true") {
			return false;
		}
	};

	return true;
}

function action(argument) {
	//resolve device name
	var device = doRequest("GET", '/device/' + argument._id, {});
	if (device.type != "output") {
		throw new Error("bad type of device:" + device._id);
	};

	var newstate = (device.state == "true") ? "false" : "true";
	//resolve module name
	var module = doRequest("GET", '/mod/bydevice/' + device._id, {});
	//very politely ask the module to perform shit
	var postbody = {ID: device._id, PARAM: [ {device.pin: newstate}]};
	doRequest('POST', "/action/" + module._id, postbody);

	return true;
}