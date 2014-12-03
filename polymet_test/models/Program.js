'use strict';

var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;


var ProgramSchema = new mongoose.Schema(
{
	name: {type: String, default: "new program"},
	filename: {type: String, required: true},
	sensors: {type: [ObjectId], ref: "Device"}
}
);

mongoose.model("Program", ProgramSchema);