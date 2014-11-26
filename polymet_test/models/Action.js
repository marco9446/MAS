'use strict';

var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;


var ActionSchema = new mongoose.Schema(
{
	name: {type: String, default: "new program"},
	type: {type: String, required: true},
	devices : {type: [ObjectId], ref: "Device"}
}
);

mongoose.model("Action", ActionSchema);