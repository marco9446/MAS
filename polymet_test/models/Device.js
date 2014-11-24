'use strict';

var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var DeviceSchema = new mongoose.Schema(
{
	name: {type: String, required: true, default: "new device"},
	module: {type: ObjectId, required: true, ref: "Module"},
	slot : {type: Number, required: true, default: 0},
	type : {type: String, required: true}
}
);


mongoose.model("Device", DeviceSchema);