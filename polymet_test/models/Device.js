'use strict';

var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var DeviceSchema = new mongoose.Schema(
{
	name: {type: String, required: true, default: "new device"},
	pin : {type: String, required: true},
	type : {type: String, required: true},
	state: {type: String, required: true}
}
);


mongoose.model("Device", DeviceSchema);