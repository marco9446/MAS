'use strict';

var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;


var ModuleSchema = new mongoose.Schema(
{
	name : {type: String, required: true, default:"foo"},
	state : {type: String, required: true},
	device : {type:ObjectId, ref: "Device" ,required: true}
}

);

mongoose.model("Action", ModuleSchema);