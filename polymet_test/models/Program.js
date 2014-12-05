'use strict';

var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;


var ProgramSchema = new mongoose.Schema(
{
	name: {type: String, default: "new program"},
	code: {type: String, required: true},
	sensors: {type: [ObjectId], ref: "Device"},
	active: {type: Boolean, default: true, required: true}
}
);

mongoose.model("Program", ProgramSchema);