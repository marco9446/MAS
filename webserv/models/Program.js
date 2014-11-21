'use strict';

var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;


var ProgramSchema = new mongoose.Schema(
{
	name: {type: String, default: "new program"},
	instructions: {type : [ObjectId], ref: "Action"}
}
);

mongoose.model("Program", ProgramSchema);