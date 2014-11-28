'use strict';

var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;


var ModuleSchema = new mongoose.Schema(
{
	name : {type: String, required: true, default:"foo"},
	type : {type: String, required: true},
	netID : {type: String, required: true},
	ip : {type: String, required: true},
	devices : {type: [ObjectId], ref: "Device"}
}

);

mongoose.model("Module", ModuleSchema);