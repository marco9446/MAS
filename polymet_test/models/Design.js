'use strict';

var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;


var DesignSchema = new mongoose.Schema(
{
	name: {type: String, default: "new Design"},
	code: {type: Object, required: true},
	program: {type: String},
	sensors: {type: [ObjectId], ref: "Device"},
	active: {type: Boolean, default: true}
}
);

mongoose.model("Design", DesignSchema);