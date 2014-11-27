'use strict';

var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;


var ModuleSchema = new mongoose.Schema(
{
	name : {type: String, required: true},
	type : {type: String, required: true},
	netID : {type: Number, required: true},
	ip : {type: String, required: true},
	mac : {type: String, required: true},
	devices : {type: [ObjectId], ref: "Device"}
}

);

mongoose.model("Module", ModuleSchema);